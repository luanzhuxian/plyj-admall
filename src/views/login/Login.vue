<template>
    <div :class="$style.login">
        <div :class="$style.loginTop">
            <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png">
            {{ $router.name }}
        </div>
        <div :class="$style.loginBody">
            <div :class="$style.loginBg">
                <phoneLogin v-if="$route.name === 'PhoneLogin'" />
                <passwordLogin v-if="$route.name === 'PasswordLogin'" />
                <wxLogin v-if="$route.name === 'WxLogin'" />
                <WxBindPassword v-if="$route.name === 'WxBindPassword'" />
                <WxBindPhone v-if="$route.name === 'WxBindPhone'" />
            </div>
        </div>
    </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import phoneLogin from './components/Phone-Login'
import wxLogin from './components/Wx-Login'
import passwordLogin from './components/Password-Login'
import WxBindPassword from './components/Wx-Bind-Password'
import WxBindPhone from './components/Wx-Bind-Phone'
    @Component({
        components: {
            phoneLogin,
            wxLogin,
            passwordLogin,
            WxBindPassword,
            WxBindPhone
        }
    })
export default class Login extends Vue {
    @Watch('$route.name')
    onChangeValue (newVal) {
        console.log(newVal)
    }

    mounted () {
        console.log(this.$route.name)
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
