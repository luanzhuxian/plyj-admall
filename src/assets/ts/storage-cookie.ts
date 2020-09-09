/**
 * 基于localStorage实现的类似 cookie 的存储方式
 */
export default {

    /**
   * 设置storageCookie
   * @param key {string}
   * @param value {string}
   * @param config {object}
   * @property config.expires {number} 毫秒值，过期日期时间
   * @property config.path {string} 允许携带的路径
   */
    set (key: string, value: any, config: { expires: number }): void {
        localStorage.setItem(key, JSON.stringify({
            value,
            expires: config.expires || 0
        }))
    },
    get (key: string): any {
        const result = JSON.parse(localStorage.getItem(key) || '{}')
        const { expires = 0, value = '' } = result
        if (expires && expires < Date.now()) {
            return ''
        }
        return value
    },
    remove (key: string) {
        localStorage.removeItem(key)
    }
}
