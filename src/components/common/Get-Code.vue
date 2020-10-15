<template>
    <div>
        <div :class="$style.getCode" v-if="getCodeing">{{ time }}s</div>
        <div :class="$style.getCode" v-else @click="getCode()">获取验证码</div>
    </div>
</template>

<script lang="ts">
import { isPhone } from '../../assets/ts/validate'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { getVerifyCodeFunc } from '../../apis/common'
import { namespace } from 'vuex-class'
import { MutationTypes } from '@/store/mutation-type'
const userModule = namespace('user')

    @Component
export default class GetCode extends Vue {
        getCodeing = false
        fixedTime = 60
        time = 60
        timer: any = null
        @userModule.Getter('codePass') codePass!: boolean
        @userModule.Mutation(MutationTypes.setCodePass) setCodePass!: Function
        @userModule.Mutation(MutationTypes.setCodeShow) setCodeShow!: Function
        @Prop(String) mobile!: string
        @Prop(String) smsType!: SmsType

        @Emit('errorMobile')
        errorMobile () {
            return true
        }

        created (): void {
            const lastSendTime = Number(localStorage.getItem('sendTime') || 0)
            if (Date.now() - lastSendTime < this.fixedTime * 1000) {
                this.getCodeing = true
                // 如果上次发送验证码的时间与本次的发送时间间隔小于发送验证码的时间间隔(this.time)
                const time = parseInt(JSON.stringify(this.fixedTime - (Date.now() - lastSendTime) / 1000))
                this.countDown(time)
            }
            this.setCodePass(false)
        }

        countDown (time: number|void) {
            if (time) this.time = time
            this.timer = setInterval(() => {
                this.time--
                if (!this.time) {
                    this.getCodeing = false
                    this.time = 60
                    clearInterval(this.timer)
                }
            }, 1000)
        }

        async getCode () {
            if (!isPhone(this.mobile)) {
                this.errorMobile()
                return
            }
            if (this.getCodeing) return
            if (!this.codePass) {
                this.setCodeShow(true)
                return
            }
            try {
                clearInterval(this.timer)
                this.getCodeing = true
                await getVerifyCodeFunc({ mobile: this.mobile, smsType: this.smsType })
                // 存储本次发送验证码的时间
                localStorage.setItem('sendTime', JSON.stringify(Date.now()))
                this.countDown()
            } catch (e) {
                this.getCodeing = false
                throw e
            } finally {
                this.setCodePass(false)
            }
        }
}
</script>

<style module lang="scss">
    .get-code{
        display: flex;
        align-items: center;
        padding: 6px 12px;
        font-size: 14px;
        font-weight: 400;
        color: #4F63FF;
        border: 1px solid #4F63FF;
        border-radius: 17px;
        line-height: 23px;
        cursor: pointer;
    }
</style>
