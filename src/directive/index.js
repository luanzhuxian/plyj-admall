const img = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/img_error.png'
export default {
    imgError: {
        inserted (el, { value }) {
            if (el.tagName === 'IMG') {
                el.onerror = function () {
                    if (el.src === img) {
                        return
                    }
                    el.src = img
                }
            }
        }
    }
}
