<template>
    <div :class="$style.login">
        <div :class="$style.loginBg" />
        <phoneLogin v-if="typePhoneLogin" @passwordLogin="passwordLogin" />
        <passwordLogin v-if="typePasswordLogin" @phoneLogin="phoneLogin" />
        <!--        <wxLogin />-->
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
    typePhoneLogin= true
    passwordLogin (e) {
        this.typePasswordLogin = e
        this.typePhoneLogin = false
    }

    phoneLogin (e) {
        this.typePhoneLogin = e
        this.typePasswordLogin = false
    }
}
</script>

<style module lang="scss">
    .login{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #ffffff;
        .login-bg{
            width: 320px;
            height: 440px;
            margin-right: 10px;
            border-radius: 10px;
            background-image: url('https://mallcdn.youpenglai.com/static/admall-new/3.0.0/login-bg.png');
            background-size: 100% 100%;
        }
    }
</style>
