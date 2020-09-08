<template>
    <div :class="$style.login">
        <div :class="$style.loginBg" />
        <phoneLogin />
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
        background-color: #F5F6FA;
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
