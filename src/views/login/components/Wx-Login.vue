<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            微信扫码登录/注册
        </div>
        <div :class="$style.accountMessage">
            <div id="login-container" style="height: 280px;width: 270px;overflow: hidden" />
        </div>
        <div :class="$style.loginMthods">
            <el-button @click="$router.push({name:'PhoneLogin'})" type="text">手机号登录</el-button>
            |
            <el-button @click="$router.push({name:'PasswordLogin'})" type="text">账号密码登录</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { WxScanLogin } from '../../../apis/login'
import { Component, Vue, Emit } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'
import { SessionEnum } from '@/enum/storage'
import { MutationTypes } from '@/store/mutation-type'
const userModule = namespace('user')
@Component
export default class WxLogin extends Vue {
        loading = false
        code = ''
        @userModule.Mutation(MutationTypes.setLoginInfo) setLoginInfo: any
        @State('bindWechatInfo') bindWechatInfo: any
        @Emit('emitLogin')
        emitLogin () {
            return true
        }

        async mounted () {
            this.weixinLoginCode()
            this.code = sessionStorage.getItem(SessionEnum.redirectCode) as string
            if (this.code) {
                await this.WxScanLogin()
            }
        }

        async WxScanLogin () {
            try {
                const data = await WxScanLogin(this.code)
                if (data.code === 2000) {
                    await this.setLoginInfo(data.result)
                    this.emitLogin()
                    this.clearCode()
                } else if (data.code === 5001) {
                    await this.$router.push({ name: 'RegisterAccount' })
                    this.emitLogin()
                } else {
                    this.clearCode()
                }
            } catch (e) {
                // const ResponseError = JSON.parse(e.message)
                // if (ResponseError.resCode === 5001) {
                //     await this.$router.push({ name: 'WxBindPhone' })
                // } else {
                //     this.clearCode()
                // }
                throw e
            }
        }

        clearCode () {
            sessionStorage.removeItem(SessionEnum.redirectCode)
            sessionStorage.removeItem(SessionEnum.redirectState)
            sessionStorage.removeItem(SessionEnum.loginState)
        }

        weixinLoginCode () {
            /* eslint-disable @typescript-eslint/camelcase */
            /* eslint-disable no-new */
            const weChatStyle: any = 'https://mallcdn.youpenglai.com/static/admall-new/weChatLoginStyle/index.css'
            const state = Date.now().toString(16)
            sessionStorage.setItem(SessionEnum.loginState, state)
            new window.WxLogin({
                self_redirect: false,
                id: 'login-container',
                appid: this.bindWechatInfo.appId,
                scope: 'snsapi_login',
                redirect_uri: `${ this.bindWechatInfo.redirectUrl }/login/wx-login`,
                state,
                style: 'black',
                href: weChatStyle
            })
        }
}
</script>

<style module lang="scss">
    .phone-login{
        width: 360px;
        height: 420px;
        padding: 40px;
        border-radius: 10px;
        background-color: #ffffff;
        padding-top: 10px;
        .login-type{
            display: flex;
            justify-content: center;
            padding-top: 28px;
            padding-bottom: 10px;
            font-size: 20px;
            font-weight: 400;
            color: #333333;
        }
        .login-mthods{
            display: flex;
            justify-content: center;
            align-items: center;
            color: #4F63FF;
            button{
                margin: 0 10px;
            }
        }
    }
</style>
