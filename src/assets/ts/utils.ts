/*eslint-disable*/
/**
 * 获取字符串长度，1个汉字等于2个字母
 * @param str {string}
 * @return {number}
 */
export const codePointNo = (str: string) => {
    let num = 0
    let codePoint = 0
    str = String(str)
    for (const s of str) {
        codePoint = s.codePointAt(0) || 0
        if (codePoint > 127) {
            num += 2
        } else {
            num++
        }
    }
    return num
}

/**
 * 节流阀
 * @param fn 需要包装的事件回调
 * @param delay 时间间隔的阈值
 * @returns {Function}
 */
export const throttle = (fn: Function, delay: number) => {
    // last为上一次触发回调的时间, timer是定时器
    let last = 0
    let timer = 0
    // 将throttle处理结果当作函数返回
    return function (this: void, ...args: any[]) {
        // 保留调用时的this上下文
        // const context = this
        // 保留调用时传入的参数
        // const args = arguments
        // 记录本次触发回调的时间
        const now = +new Date()
        // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
        if (now - last < delay) {
            // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
            clearTimeout(timer)
            timer = setTimeout(() => {
                last = now
                fn.apply(this, args)
            }, delay)
        } else {
            // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
            last = now
            fn.apply(this, args)
        }
    }
}

/**
 * 加载跨域图片
 * @param src {string}
 * @return {Promise<HTMLImageElement>}
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = `${ src }?${ Date.now() }`
    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(img)
        }
        img.onerror = e => {
            reject(new Error('图片加载错误'))
        }
    })
}

/**
 * 截取图片中间部分
 * @param img {HTMLElement} 要截取的图片
 * @param ratio {Number} 裁剪图片的长宽比 默认是1:1
 * @returns {HTMLElement} 返回canvas对象
 */
export const cutImageCenter = (img: HTMLImageElement, ratio = 1) => {
    const canvas = document.createElement('canvas')
    const w = img.naturalWidth
    const h = img.naturalHeight
    // 说明图片高度有可能不够
    if (w / h >= ratio) {
        canvas.width = h * ratio
        canvas.height = h
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.drawImage(
            img,
            (w - canvas.width) / 2,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        )
    } else {
        canvas.width = w
        canvas.height = w / ratio
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.drawImage(
            img,
            0,
            (h - canvas.height) / 2,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        )
    }
    return canvas
}

/**
 * 生成二维码
 * @param size 二维码大小
 * @param text 二维码内容
 * @param padding 二维码内边距
 * @param image 二维码中心图片
 * @param centerPadding 中心图片的内边距（白边大小）
 * @returns {Promise<*>}
 */
export const generateQrcode = async ({ size = 300, text = '', padding = 0, image = '', centerPadding = 0 }) => {
    try {
        // 中心图片的宽高
        const imageSize = 60
        // 中心图片
        let img = null
        if (image) {
            img = await loadImage(image)
        }
        let canvas: HTMLCanvasElement = new window.Qrcode({
            render: 'canvas',
            // 纠错级别
            correctLevel: 3,
            // 内容
            text,
            // 大小
            size,
            background: '#fff',
            foreground: '#000',
            pdground: '#000'
            // image: '', 不起作用，注释掉
            // imageSize: 30
        })
        // 生成中心图片内边距
        if (centerPadding > 0 && img) {
            let centerCanvas = cutImageCenter(img)
            const realPadding = centerPadding * (centerCanvas.width / imageSize)
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = centerCanvas.width + realPadding * 2
            tempCanvas.height = centerCanvas.height + realPadding * 2
            const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D
            tempCtx.fillStyle = '#ffffff'
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
            tempCtx.drawImage(centerCanvas, realPadding, realPadding, centerCanvas.width, centerCanvas.height)
            centerCanvas = tempCanvas
            const imgSize = img.width
            const scale = imageSize / imgSize
            const smallWidth = imgSize * scale
            const smallHeight = imgSize * scale
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            ctx.drawImage(centerCanvas, size / 2 - smallWidth / 2, size / 2 - smallHeight / 2, smallWidth, smallHeight)
        }
        // 绘制二维码内边距
        if (padding > 0) {
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = canvas.width + padding * 2
            tempCanvas.height = canvas.height + padding * 2
            const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D
            tempCtx.fillStyle = '#ffffff'
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
            tempCtx.drawImage(canvas, padding, padding, canvas.width, canvas.height)
            canvas = tempCanvas
        }
        return canvas.toDataURL()
    } catch (e) {
        throw e
    }
}

/**
 * 获取视频第一帧并返会图片
 * @param video {HTMLVideoElement}
 * @returns {WindowBase64}
 */
export const getVideoFirstKeyframe = (video: HTMLVideoElement) => {
    video.onloadeddata = function () {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.drawImage(video, 0, 0)
        return canvas.toDataURL()
    }
}

/**
 * 大写数字
 * @param n {number} 要转换的数字
 * @returns {string}
 */
export const SectionToChinese = (n: number) => {
    const N = n
    const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const chnUnitChar = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '万亿']
    let strIns = ''
    let chnStr = ''
    let unitPos = 0
    let zero = true
    while (n > 0) {
        const v = n % 10
        if (v === 0) {
            if (!zero) {
                zero = true
                chnStr = chnNumChar[v] + chnStr
            }
        } else {
            zero = false
            strIns = chnNumChar[v]
            strIns += chnUnitChar[unitPos]
            chnStr = strIns + chnStr
        }
        unitPos++
        n = Math.floor(n / 10)
    }
    if (N >= 10 && N < 20) {
        return chnStr.replace(/^一/, '')
    }
    return chnStr
}

/**
 * 复制字段
 * @param template {object} 要复制的所有字段
 * @param target {object} 根据字段模板从target中复制出相关字段
 * @returns {*}
 */
export const copyFields = function (template: any, target: any) {
    if (!target) return template
    if (typeof target !== 'object') return template
    if (Object.keys(target).length === 0) return template
    for (const k of Object.keys(template)) {
        template[k] = target[k]
    }
    return template
}

/**
 * 重置表单
 * @param form {Object} 表单对象
 * @param def {Object} 默认字段的值
 */
export const resetForm = function (form: any, def: any = {}) {
    for (const k of Object.keys(form)) {
        const val = form[k]
        if (typeof val === 'string') {
            form[k] = def[k] || ''
            continue
        }
        if (typeof val === 'number') {
            form[k] = def[k] || 0
            continue
        }
        if (Array.isArray(form[k])) {
            if (def[k]) {
                form[k].splice(0, form[k].length, ...def[k])
            } else {
                form[k].splice(0, form[k].length)
            }
            continue
        }
        if (typeof val === 'object' && val !== null) {
            resetForm(val)
        }
    }
}

/**
 * 自动导入文件
 * @param context webpackContext
 */
export const importFiles = (context: any): any[] => {
    const files = []
    for (const key of context.keys()) {
        const file = context(key).default || context(key)
        files.push(...file)
    }
    console.log(files)
    return files
}