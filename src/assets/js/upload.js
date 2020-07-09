import Compressor from 'compressorjs'
import { getSTS } from '../../apis/common'
import { Loading } from 'element-ui'
import store from '../../store'
const { VUE_APP_MODEL } = process.env
const ENV = VUE_APP_MODEL === 'production' ? 'pro' : 'dev'
const OSS = require('ali-oss')
const REGION = 'oss-accelerate'
const BUCKET = 'penglai-weimall'
// const DOMAIN = 'https://penglai-weimall.oss-accelerate.aliyuncs.com/' // 该域名在下载的时候不会使用缓存，暂不使用
const DOMAIN = 'https://mallcdn.youpenglai.com/'
const VIDEO_PATH = `video/admall/${ ENV }`
const IMG_PATH = `img/admall/${ ENV }`
const PDF_PATH = `pdf/admall/${ ENV }`
const STSLIFETIME = 600000

/**
 * 图片URL转blob
 * @param img {HTMLImageElement}
 */
const imgToBlob = img => {
    const canvas = document.createElement('canvas')
    let ctx = null
    img.crossOrigin = ''
    return new Promise(resolve => {
        if (img.complete) {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            canvas.toBlob(blob => {
                resolve(blob)
            }, 'image/jpeg', 0.9)
        } else {
            img.onload = () => {
                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight
                ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)
                canvas.toBlob(blob => {
                    resolve(blob)
                }, 'image/jpeg', 0.9)
            }
        }
    })
}
const getClient = async () => {
    const sts = JSON.parse(localStorage.getItem('sts')) || {}
    let credentials = null

    if (!sts.time || STSLIFETIME < Date.now() - sts.time) {
    // sts过期
        const { data } = await getSTS()
        credentials = data.result.credentials
        data.result.time = Date.now()
        localStorage.setItem('sts', JSON.stringify(data.result))
    } else {
        credentials = sts.credentials
    }
    const { securityToken, accessKeySecret, accessKeyId } = credentials
    return new OSS({
        region: REGION,
        accessKeyId,
        accessKeySecret,
        stsToken: securityToken,
        bucket: BUCKET,
        timeout: 120000
    })
}
const compressImage = (file, maxWidth = 1920) => new Promise((resolve, reject) => {
    /* eslint-disable no-new */
    new Compressor(file, {
        // 输出图像的最大宽度。这个值应该大于0。
        maxWidth,
        success (result) {
            resolve(result)
        },
        error (error) {
            reject(error)
        }
    })
})

/**
 * 生成随机字符串
 */
const randomString = () => `${ window.uuid.v1() }-${ Date.now().toString(16) }`

// STS有效时间，10分钟
Compressor.setDefaults({
    // 检查方向
    checkOrientation: true,
    // 表示压缩后的图像尺寸大于原始图像尺寸时，是否输出原始图像而不是压缩后的图像，但以下情况除外:
    // 设置了mimeType选项，其值与图像的mime类型不同。
    // 设置了width选项，其值大于图像的自然宽度。
    // 设置了height选项，其值大于图像的自然高度。
    // 设置了minWidth选项，其值大于图像的自然宽度。
    // 设置了minHeight选项，其值大于图像的自然高度。
    strict: true,
    // minWidth 输出图像的最小宽度。该值应该大于0，并且不应该大于maxWidth。
    // 输出图像的最大宽度。这个值应该大于0。
    maxWidth: 1920,
    // width: 1920,
    // minHeight 输出图像的最小高度。该值应该大于0，并且不应该大于maxHeight
    // maxHeight 输出图像的最大高度。这个值应该大于0
    // height 输出图像的高度。如果没有指定，则使用原始图像的自然高度，或者如果设置了宽度选项，则使用自然长宽比自动计算高度。
    quality: 0.75,
    mimeType: 'image/jpeg',
    // 超过此值的PNG文件将转换为jpeg。要禁用此功能，只需将值设置为无穷大
    convertSize: 5000000
    // beforeDraw(context, canvas)
    // drew(context, canvas)
})

/**
 * 压缩图片
 * @param file { Blob | HTMLImageElement } 要压缩的图片，可以是blob，也可以是图片URL
 * @param fileType { String } 返回值类型，blob | base64, 不传则返回blob
 * @param maxWidth { Number } 规定压缩的最大宽度
 * @returns {Promise<any>}
 */
export const compress = async (file, fileType = 'blob', maxWidth = 1920) => {
    if (file.toLocaleString().indexOf('HTMLImageElement') > -1) {
        file = await imgToBlob(file)
    }
    try {
        file = await compressImage(file, maxWidth)
        if (fileType === 'base64') {
            const base64 = await blobToBase64(file)
            return base64
        }
        return file
    } catch (e) {
        throw e
    }
}

/**
 * 上传媒体接口
 * @param file {Blob} 媒体
 * @returns {Promise<void>}
 */
export const upload = async file => {
    try {
        let ext = /jpg|png|gif|jpeg|bmp|mp4/i.exec(file.type)
        if (ext) {
            ext = ext[0]
        } else {
            throw new Error('不允许的媒体格式')
        }
        // 使用商城id分开存储
        const mallId = store.getters.mallNumber
        const client = await getClient()
        const key = mallId ? `${ IMG_PATH }/${ mallId }/${ randomString() }.${ ext }` : `${ IMG_PATH }/${ randomString() }.${ ext }`
        const res = await client.put(key, file)
        res.url = `${ DOMAIN }${ res.name }`
        return res
    } catch (e) {
        throw e
    }
}

/**
 * 上传PDF
 * @param file {Blob} 媒体
 * @returns {Promise<void>}
 */
export const uploadPdf = async file => {
    try {
        const ext = 'pdf'
        // 使用商城id分开存储
        const mallId = store.getters.mallNumber
        const client = await getClient()
        const key = mallId ? `${ PDF_PATH }/${ mallId }/${ randomString() }.${ ext }` : `${ PDF_PATH }/${ randomString() }.${ ext }`
        const res = await client.put(key, file)
        console.log(res)
        res.url = `${ DOMAIN }${ res.name }`
        return res
    } catch (e) {
        throw e
    }
}

/**
 * 断点上传接口（用于上传较大文件，可回传进度条）
 * @param file {Blob} 媒体
 * @param callback {Function} 进度回调
 * @returns {Promise<void>}
 */
export const breakpointUpload = async (file, callback) => {
    const ext = /mp4|ogg|webm/i.exec(file.type)[0]
    if (!ext) {
        this.$error('文件格式错误')
        return
    }
    try {
    // 使用商城id分开存储
        const mallId = store.getters.mallNumber
        const client = await getClient()
        const key = mallId ? `${ VIDEO_PATH }/${ mallId }/${ randomString() }.${ ext }` : `${ VIDEO_PATH }/${ randomString() }.${ ext }`
        const { res } = await client.multipartUpload(key, file, {
            async progress (p, checkpoint) {
                callback(p, checkpoint, key, client)
            },
            meta: {
                key,
                size: file.size
            },
            mime: `video/*`
        })
        const urls = res.requestUrls
        const newUrls = []
        for (let url of urls) {
            url = url.split('?')[0]
            newUrls.push(`${ DOMAIN }${ url.substr(url.indexOf('video')) }`)
        }
        return newUrls
    } catch (e) {
        throw e
    }
}

/**
 * 从断点继续上传
 */
export const resumeBreakpointUpload = async (key, file, tempCheckpoint, callback) => {
    try {
        const resumeclient = await getClient()
        const { res } = await resumeclient.multipartUpload(key, file, {
            async progress (p, checkpoint) {
                callback(p, checkpoint, key, resumeclient)
            },
            parallel: 2,
            // 继续上传说明文件容易失败，适当降低分片大小为100kb
            partSize: 100 * 1024,
            meta: {
                key,
                size: file.size
            },
            checkpoint: tempCheckpoint,
            mime: 'video/*'
        })
        const urls = res.requestUrls
        const newUrls = []
        for (let url of urls) {
            url = url.split('?')[0]
            newUrls.push(`${ DOMAIN }${ url.substr(url.indexOf('video')) }`)
        }
        return newUrls
    } catch (e) {
        throw e
    }
}
export const getKey = url => {
    let index = url.indexOf('img/')
    if (index === -1) {
        index = url.indexOf('video/')
    }
    return url.slice(index)
}

/**
 * 删除媒体接口
 * @param keys 媒体名称 {Array}
 * @returns {Promise<void>}
 * 如：[video/demo.mp4, img/demo.jpg]
 */
export const deleteImage = async keys => {
    const client = await getClient()
    // 单独删除咱不可用，所以需传入key的数组
    // if (typeof key === 'string') {
    //   try {
    //     await client.delete(key)
    //   } catch (e) {
    //     throw e
    //   }
    // }
    // 批量删除
    if (Array.isArray(keys)) {
        if (!keys.length) return
        try {
            await client.deleteMulti(keys)
            console.warn('file is deleted !')
        } catch (e) {
            throw e
        }
    } else {
        throw new Error('key 必须是数组！')
    }
}
// blob转base64
export const blobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
        resolve(reader.result.split(',')[1])
    }
    reader.onerror = function () {
        reject(new Error('文件读取错误'))
    }
    reader.readAsDataURL(blob)
})
// buffer转base64
export const bufferToBase64 = buffer => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
        resolve(reader.result.split(',')[1])
    }
    reader.onerror = function () {
        reject(new Error('文件读取错误'))
    }
    reader.readAsDataURL(new Blob([buffer]))
})
// blob转buffer
export const blobToBuffer = blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
        resolve(reader.result)
    }
    reader.onerror = function () {
        reject(new Error('文件读取错误'))
    }
    reader.readAsArrayBuffer(blob)
})

export const createObjectUrl = blob => {
    let url
    // basic
    if (window.createObjectURL) {
        url = window.createObjectURL(blob)
    // mozilla(firefox)
    } else if (window.URL) {
        url = window.URL.createObjectURL(blob)
    // webkit or chrome
    } else if (window.webkitURL) {
        url = window.webkitURL.createObjectURL(blob)
    }
    return url
}

export const revokeObjectURL = URL => {
    window.URL.revokeObjectURL(URL)
}

/**
 * 从oss上下载文件，不支持直播回放视频的下载
 * @param url {string} 视频完整url
 * @param customName {string} 自定义名称
 * @returns {Promise<void>}
 */
export const downloadFile = async (url, customName = '') => {
    try {
        const key = url.substring(url.indexOf('.com/') + 5)
        const name = key.split('/').slice(-1)[0] || ''
        const client = await getClient()
        const downloadUrl = await client.signatureUrl(key, {
            expires: 1800
        })
        let a = document.createElement('a')
        a.href = downloadUrl
        a.download = customName || name
        a.click()
        a = null
    } catch (e) {
        throw e
    }
}

/**
 * 获取视频文件时长
 * @param blob {Blob} 视频文件
 * @return {Promise<void>}
 */
export const getVideoDuration = blob => {
    const Instance = Loading.service({
        background: 'transparent',
        text: '处理中...'
    })
    return new Promise((resolve, reject) => {
        const url = createObjectUrl(blob)
        let video = document.createElement('video')
        video.addEventListener('loadedmetadata', e => {
            resolve(e.target.duration)
            revokeObjectURL(url)
            video = null
            Instance.close()
        })
        video.addEventListener('error', e => {
            revokeObjectURL(url)
            video = null
            Instance.close()
            reject(new Error('视频时长获取失败，请重试'))
        })
        video.src = url
    })
}
