import axios from 'axios'
class ResponseError extends Error {
    constructor (message) {
        super(message)
        this.message = message
        this.name = 'ResponseError'
    }
}
const { VUE_APP_MODEL } = process.env
const reqHandler = config => config
const reqErrorHandler = error => Promise.reject(error)
const resHandler = res => res.data
const resError = error => {
    let msg = error.message
    if (msg.indexOf('timeout') > -1) {
        msg = '请求超时◔̯◔'
    }
    if (msg.indexOf('40') > -1) {
        msg = '您似乎在蓬莱岛迷路了'
    }
    if (msg.indexOf('50') > -1) {
        msg = '蓬莱岛消失在了迷雾中~( ˶‾᷄࿀‾᷅˵ )'
    }
    if (msg.indexOf('Network Error') > -1) {
        msg = '网络不给力'
    }
    return Promise.reject(new ResponseError(JSON.stringify({
        message: msg
    }, null, 4)))
}
axios.defaults.timeout = 15000000
axios.defaults.headers = {
    'Content-type': 'application/json'
}

// 请求拦截器
axios.interceptors.request.use(reqHandler, reqErrorHandler)
axios.interceptors.response.use(resHandler, resError)

// 测试环境显示服务器地址切换
if (VUE_APP_MODEL === 'development') {
    const serverName = document.querySelector('#set-server-name')
    const serverBaseUrl = localStorage.getItem('serverBaseUrl')
    const confirmBtn = document.querySelector('#confirm-server-name')
    if (serverBaseUrl) {
        serverName.value = serverBaseUrl
        axios.defaults.baseURL = `${ serverBaseUrl }`
        console.warn('已设置服务器地址为：', serverBaseUrl)
    }
    confirmBtn.addEventListener('click', e => {
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
