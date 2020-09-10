import { getVerifyCodeFunc } from '../apis/common'
import CountDown from '../assets/ts/Countdown'
import { isPhone } from '../assets/ts/validate'
import { Message } from 'admall-element'
import { Commit } from 'vuex'
export default {

    /**
     * 发送验证码，验证码发送成功后，时间会写入state，全局都可以共享到这个时间
     * @param commit
     * @param smsType {String} 短信类型
     * @param phone {String} 手机号
     * @returns {Promise<void>}
     */
    async senCode (context: { commit: Commit }, payload: { smsType: SmsType; phone: string }) {
        try {
            if (!isPhone(payload.phone)) {
                Message.warning({
                    message: '手机号格式错误'
                })
                return
            }
            await getVerifyCodeFunc({
                smsType: payload.smsType,
                mobile: payload.phone
            })
            return new CountDown(60, (t: any) => {
                context.commit('senCode', t)
            }).start()
        } catch (e) {
            throw e
        }
    }

    /**
     * 检查倒计时是否已结束，没结束时，启动全局倒计时
     * 这个方法用在app.vue中，以便限制任何地方的发送验证码
     */
    // checkCountDown ({ commit }) {
    //     const codeCountDown = Number(localStorage.getItem('codeCountDown')) || 0
    //     if (codeCountDown) {
    //         return new CountDown(codeCountDown, t => {
    //             commit('senCode', t)
    //         }).start()
    //     }
    // }
}
// export default actions
