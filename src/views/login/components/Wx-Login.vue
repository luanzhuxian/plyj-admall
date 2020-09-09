<template>
    <div :class="$style.phoneLogin">
        <!--        <div :class="$style.loginType">-->
        <!--            微信扫码登录/注册-->
        <!--        </div>-->
        <div :class="$style.accountMessage">
            <div id="login-container" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
    @Component
export default class WxLogin extends Vue {
        agree = false
        loading = false
        mounted () {
            this.weixinLogin()
        }

        weixinLogin () {
            /* eslint-disable @typescript-eslint/camelcase */
            /* eslint-disable no-new */
            // location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx7f8e7e4ea457931d&redirect_uri=http://joint.xijun.youpenglai.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
            const state = Date.now().toString(16)
            sessionStorage.setItem('login_state', state)
            const a = new window.WxLogin({
                self_redirect: false,
                id: 'login-container',
                appid: 'wx7f8e7e4ea457931d',
                scope: 'snsapi_login',
                redirect_uri: 'http://joint.xijun.youpenglai.com',
                state,
                style: 'black',
                href: ''
            })
            console.log(a)
        }
}
</script>

<style module lang="scss">
    .phone-login{
        width: 400px;
        height: 440px;
        padding: 40px;
        border-radius: 10px;
        background-color: #ffffff;
        .login-type{
            display: flex;
            justify-content: center;
            padding-top: 10px;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
        }
    }
</style>
