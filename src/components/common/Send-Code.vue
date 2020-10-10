<template>
    <!-- 发送验证码 -->
    <el-button
        :type="buttonType"
        v-text="dynamicCodeText"
        @click="send"
        :disabled="dynamicCodeText !== codeText || loading"
        :class="$style.sendCode"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { getVerifyCodeFunc } from '../../apis/common'
import { sessionEnum } from '@/enum/storage'

@Component
export default class SendCode extends Vue {
    private dynamicCodeText = ''
    private timer = 0
    private loading = false
    @Prop({ type: String, default: '获取验证码' }) codeText!: string
    // 手机号
    @Prop({ type: String, default: '' }) mobile!: string
    // 按钮类型
    @Prop({ type: String, default: 'text' }) buttonType!: string
    // 短信类型
    @Prop({ type: String, default: 'ACCOUNT_BIND_PHONE_NUMBER' }) smsType!: SmsType

    mounted () {
        this.dynamicCodeText = this.codeText
        // 获取上次发验证码的时间
        const countdownInfo = sessionStorage.getItem(sessionEnum.verifyCodeTime)
        if (countdownInfo) {
            // 总剩余时长
            const countdown = Number(countdownInfo.split('-')[0])
            // 记录时长的日期
            const countdownDate = Number(countdownInfo.split('-')[1])
            // 自然流过的时间长度
            const residue = Math.ceil((Date.now() - countdownDate) / 1000)
            if (countdown - residue > 0) {
                this.runCountDown(countdown - residue)
            }
        }
    }

    async send () {
        try {
            this.loading = true
            await getVerifyCodeFunc({
                smsType: this.smsType,
                mobile: this.mobile
            })
            this.runCountDown(60)
        } catch (e) {
            throw e
        } finally {
            this.loading = false
        }
    }

    // 启动倒计时
    runCountDown (countdown: number) {
        this.dynamicCodeText = `${ countdown }s`
        this.timer = setInterval(() => {
            this.dynamicCodeText = `${ String(countdown).padStart(2, '0') }s`
            if (countdown === 0) {
                this.dynamicCodeText = '获取验证码'
                clearInterval(this.timer)
                sessionStorage.removeItem(sessionEnum.verifyCodeTime)
                return
            }
            sessionStorage.setItem(sessionEnum.verifyCodeTime, `${ countdown }-${ Date.now() }`)
            countdown--
        }, 1000)
    }
}
</script>

<style module lang="scss">
    .sendCode {
        &:disabled {
            color: #D4D4D4 !important;
        }
    }
</style>
