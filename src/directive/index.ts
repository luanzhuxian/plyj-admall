const img = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/img_error.png'
interface Directive {
    [key: string]: object
}
export default {
    imgError: {
        inserted (el: HTMLImageElement, { value }: any) {
            if (el.tagName === 'IMG') {
                el.onerror = () => {
                    if (el.src === img) {
                        return
                    }
                    el.src = img
                }
            }
        }
    }
} as Directive
