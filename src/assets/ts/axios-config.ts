import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import Cookie from './storage-cookie'
import store from '../../store'
import { router } from '../../router'
import { Loading } from 'admall-element'
import { LocalEnum } from '@/enum/storage'
import { MutationTypes } from '@/store/mutation-type'
interface ResData {
    message: string;
    data: object;
    code: number;
    result: object;
    devMessage: string;
    [key: string]: any;
}
interface MyRes extends AxiosResponse {
    data: ResData;
}

const { VUE_APP_MODEL } = process.env

// 每个请求都包含一个独一无二的 hash code, 如果下次请求生成的hash code已存在，则终止此请求，已起到节流的效果
const REQ_HASH: Array<string | undefined> = []
// 允许的最大请求间隔
// const REQ_DURATION = 0
// code码
const SUCCESS_CODE = 2000
const EXCEPTION_CODE = 5000
const WX_UNREGISTERED_CODE = 5001
const TOKEN_TIME_OUT = 4002

// 存到全局，临时关闭全局 loading
const LoadingConfig = {
    background: 'transparent',
    text: '拼命加载中...',
    fullscreen: true
}
let loadingInstance: any = null
const close = function () {
    loadingInstance.close()
}

class ResponseError extends Error {
    constructor (message: string) {
        super(message)
        this.message = message
        this.name = 'ResponseError'
    }
}
class AbortError extends Error {
    config = {}
    constructor (message: string) {
        super(message)
        this.message = message
        this.name = 'AbortError'
    }
}
const parseBlobError = (blob: Blob): Promise<{ message?: string; code: number }> => new Promise(resolve => {
    const reader: FileReader = new FileReader()
    reader.onload = () => {
        try {
            const { message, code } = JSON.parse(reader.result as string)
            resolve({ message, code })
        } catch (e) {
            resolve({ code: 2000 })
        }
    }
    reader.readAsText(blob)
})

interface ReqConfig extends AxiosRequestConfig {
    hash?: string;
}
const reqHandler = (config: ReqConfig) => {
    /**
     * 为每个请求生成一个独一无二的hash，并存储在REQ_HASH中
     * 请求完成后从REQ_HASH删除
     * 如果某个hash在REQ_HASH依然存在，说明该请求还未完成，此时终止请求
     */
    config.hash = window.md5(JSON.stringify({ ...(config.params || {}), ...(config.data || {}), url: config.url }))
    if (REQ_HASH.includes(config.hash || '')) {
        const Abort = new AbortError(`the request has aborted: ${ config.url }`)
        Abort.config = config
        return Promise.reject(Abort)
    }
    REQ_HASH.push(config.hash)

    loadingInstance = Loading.service(LoadingConfig)

    // 比对cookie中的mallId和内存中的mallId是否一致
    const cookieMallId = Cookie.get(LocalEnum.mallId)
    const memoryMallId = store.state.user.mallId
    if (memoryMallId && cookieMallId && cookieMallId !== memoryMallId) {
        alert('检测到您在当前浏览器登录了其它商城，请重新登录，并继续操作')
        localStorage.clear()
        sessionStorage.clear()
        location.reload()
        return Promise.reject(new Error('what?'))
    }
    // console.log(LocalEnum.agencyCode, Cookie.get(LocalEnum.agencyCode))
    // console.log(Cookie.get(LocalEnum.token))
    config.headers.token = Cookie.get(LocalEnum.token)
    /* eslint-disable @typescript-eslint/camelcase */
    config.headers.refresh_token = Cookie.get(LocalEnum.refreshToken)
    config.headers.agencyCode = Cookie.get(LocalEnum.agencyCode)
    config.headers.mallId = cookieMallId
    return config
}

const reqErrorHandler = (error: AxiosError) => {
    close()
    REQ_HASH.length = 0
    return Promise.reject(error)
}

const resHandler = async (response: AxiosResponse): Promise<any> => {
    close()
    const { data, config } = response as MyRes

    /* 返回的是一个文件 */
    if (data instanceof Blob) {
        const { message, code } = await parseBlobError(data)
        if (code !== SUCCESS_CODE) {
            return Promise.reject(new ResponseError(JSON.stringify({
                message
            }, null, 4)))
        }
        REQ_HASH.splice(REQ_HASH.indexOf((response.config as ReqConfig).hash || ''), 1)
        return data
    }
    if (data.code === SUCCESS_CODE || data.code === WX_UNREGISTERED_CODE) {
        response.data.result = response.data.data
        delete response.data.data
        REQ_HASH.splice(REQ_HASH.indexOf((response.config as ReqConfig).hash || ''), 1)
        return response.data
    }
    if (data.code === TOKEN_TIME_OUT) {
        store.commit(`user/${ MutationTypes.logout }`)
        await router.push({ name: 'PhoneLogin' })
        REQ_HASH.splice(REQ_HASH.indexOf((response.config as ReqConfig).hash || ''), 1)
        return Promise.reject(false)
    }
    if (data.code === EXCEPTION_CODE) {
        if (data && data.password) data.password = '******'
        const { devMessage = '', message = '', code } = data
        const { method, url, data: reqData, params } = config
        REQ_HASH.splice(REQ_HASH.indexOf((response.config as ReqConfig).hash || ''), 1)
        return Promise.reject(new ResponseError(JSON.stringify({
            method,
            url,
            data: reqData,
            params,
            devMessage,
            message,
            resCode: code
        }, null, 4)))
    }
}

const resError = async (error: any) => {
    const { method, url, data: reqData, params } = error.config
    REQ_HASH.splice(REQ_HASH.indexOf((error.config as ReqConfig).hash || ''), 1)
    close()
    if (error.name === 'AbortError') {
        return Promise.reject(error)
    }
    const { data: { devMessage, code } } = error.response
    let msg = error.message
    if (msg.indexOf('timeout') > -1) {
        msg = '请求超时◔̯◔'
    }
    if (msg.indexOf('404') > -1) {
        msg = '您似乎在蓬莱岛迷路了'
    }
    if (msg.indexOf('50') > -1) {
        msg = '蓬莱岛消失在了迷雾中~( ˶‾᷄࿀‾᷅˵ )'
    }
    if (msg.indexOf('Network Error') > -1) {
        msg = '网络不给力'
    }
    if (error?.response?.data instanceof Blob) {
        const { message } = await parseBlobError(error.response.data)
        msg = message || '蓬莱岛消失在了迷雾中~( ˶‾᷄࿀‾᷅˵ )'
    }
    return Promise.reject(new ResponseError(JSON.stringify({
        message: msg,
        method,
        url,
        data: reqData,
        params,
        devMessage,
        resCode: code
    }, null, 4)))
}
axios.defaults.timeout = 200000
axios.defaults.headers = {
    'Content-type': 'application/json'
}

// 请求拦截器
axios.interceptors.request.use(reqHandler, reqErrorHandler)
axios.interceptors.response.use(resHandler, resError)

const myAxios: MyAxios = axios
export default myAxios

// 测试环境显示服务器地址切换
if (VUE_APP_MODEL === 'development') {
    const serverName: HTMLInputElement = document.querySelector('#set-server-name') as HTMLInputElement
    const serverBaseUrl = localStorage.getItem('serverBaseUrl')
    const confirmBtn: HTMLButtonElement = document.querySelector('#confirm-server-name') as HTMLButtonElement
    if (serverBaseUrl) {
        serverName.value = serverBaseUrl
        axios.defaults.baseURL = `${ serverBaseUrl }`
        console.warn('已设置服务器地址为：', serverBaseUrl)
    }
    confirmBtn.addEventListener('click', () => {
        let baseURL = ''
        if (serverName.value) {
            baseURL = `http://${ serverName.value }`
        } else {
            baseURL = ''
        }
        axios.defaults.baseURL = baseURL
        console.warn('已设置服务器地址为：', baseURL)
        localStorage.setItem('serverBaseUrl', serverName.value)
    })
}
