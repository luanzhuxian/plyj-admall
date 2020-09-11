<template>
    <div :class="$style.login">
        <div :class="$style.loginTop">
            <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png">
        </div>
        <div :class="$style.loginBody">
            <div :class="$style.loginBg">
                <phoneLogin v-if="typePhoneLogin" @passwordLogin="passwordLogin" @WxLogin="WxLogin" />
                <passwordLogin v-if="typePasswordLogin" @phoneLogin="phoneLogin" @WxLogin="WxLogin" />
                <wxLogin v-if="typeWxLogin" @phoneLogin="phoneLogin" @passwordLogin="passwordLogin" />
            </div>
        </div>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import phoneLogin from './components/Phone-Login'
import wxLogin from './components/Wx-Login'
import passwordLogin from './components/Password-Login'
    @Component({
        components: {
            phoneLogin,
            wxLogin,
            passwordLogin
        }
    })
export default class Login extends Vue {
    typePasswordLogin= false
    typePhoneLogin= false
    typeWxLogin= true
    passwordLogin (e) {
        this.typePasswordLogin = e
        this.typePhoneLogin = false
        this.typeWxLogin = false
    }

    phoneLogin (e) {
        this.typePhoneLogin = e
        this.typePasswordLogin = false
        this.typeWxLogin = false
    }

    WxLogin (e) {
        this.typeWxLogin = e
        this.typePhoneLogin = false
        this.typePasswordLogin = false
    }
}
</script>

<style module lang="scss">
    .login{
        width: 100vw;
        height: 100vh;
        /*display: flex;*/
        /*flex-direction: row;*/
        /*align-items: center;*/
        background-color: #ffffff;
        .login-top{
            width: 100vw;
            height: 80px;
            display: flex;
            align-items: center;
            padding-left: 18%;
        }
        .login-body{
            width: 100vw;
            height: calc(100vh - 80px);
            background: url("https://mallcdn.youpenglai.com/static/admall-new/3.0.0/new-login-bg.png");
            background-size: cover;
            .login-bg{
                position: absolute;
                right: 17%;
                top: 21%;
                margin-right: 10px;
            }
        }
    }
</style>
