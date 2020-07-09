import moment from 'moment'
import { getServerTime } from '../../apis/common'

/**
 * 倒计时类
 * 每次使用，必须new一个实例
 * @class
 */
export default class Countdown {
    timer = 0
    total = 0
    // 倒计时结束的时间戳，如果它减当前时间小于等于0，说明倒计时结束
    // 这样一来就可以避免因锁屏导致的定时器停止问题
    endTime = Date.now()

    /**
     * 倒计时构造函数
     * 退出页面时，需求要停止每个定时器实例
     * @constructor
     * @param duration {number} 倒计时时长, 毫秒值
     * @param callback {function} 接收倒计时数据
     */
    constructor (duration, callback) {
        if (new.target !== Countdown) {
            console.error('必须new实例才能使用')
            return
        }
        // this.duration = duration
        this.total = duration
        this.callback = callback
        // 倒计时结束时间等于当前时间+倒计时持续时间
        this.endTime = Date.now() + duration
    }

    // 启动
    start () {
        // 总时间如果小于等于0，不能启动倒计时
        if (!this.total || this.total < 0) {
            return
        }
        const duration = this.endTime - Date.now()
        if (duration <= 0) {
        // 如果回调接收到null，说明倒计时已结束，需要在外部做出相应的逻辑处理
            this.callback(null)
            return
        }
        const { _data: data } = moment.duration(duration)
        data.days = Math.floor(moment.duration(duration).asDays())
        delete data.years
        delete data.months
        this.callback(data)
        this.timer = setTimeout(() => {
            this.start()
        }, 1000)
    }

    // 手动停止
    stop () {
        clearTimeout(this.timer)
        this.callback = null
    }

    /**
     * 获取服务器当前时间
     * 最好再定时器即将开启前获取，如果中途存在其他逻辑，需要考虑这些逻辑的执行时间，防止误差
     * @param difference {number} 误差，毫秒值
     * @return {Promise<number>}
     */
    static async getServerTime (difference = 0) {
        try {
            const now = Date.now()
            const { result: time } = await getServerTime()
            const end = Date.now()

            // 返回的时间加上请求时间
            return Number(time) + (end - now) + difference
        } catch (e) {
            throw e
        }
    }
}
