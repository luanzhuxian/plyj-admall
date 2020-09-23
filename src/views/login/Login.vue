<template>
    <div :class="$style.login">
        <div :class="$style.loginTop">
            <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png">
        </div>
        <div :class="$style.loginBody">
            <div :class="$style.loginBg">
                <PhoneLogin @emitLogin="login" ref="PhoneLogin" @codeShowFoo="codeShowFoo" v-if="$route.name === 'PhoneLogin'" />
                <PasswordLogin @emitLogin="login" ref="PasswordLogin" @codeShowFoo="codeShowFoo" v-if="$route.name === 'PasswordLogin'" />
                <WxLogin @emitLogin="login" v-if="$route.name === 'WxLogin'" />
                <WxBindPassword @emitLogin="login" v-if="$route.name === 'WxBindPassword'" />
                <WxBindPhone @emitLogin="login" v-if="$route.name === 'WxBindPhone'" />
                <CompleteLogin @emitLogin="login" ref="CompleteLogin" @codeShowFoo="codeShowFoo" v-if="$route.name === 'CompleteLogin'" />
            </div>
        </div>
        <Vcode :show="codeShow" @success="success" @close="close" />
    </div>
</template>

<script lang=ts>
import { Component, Vue } from 'vue-property-decorator'
import Vcode from 'vue-puzzle-vcode'
import PhoneLogin from './components/Phone-Login.vue'
import WxLogin from './components/Wx-Login.vue'
import PasswordLogin from './components/Password-Login.vue'
import WxBindPassword from './components/Wx-Bind-Password.vue'
import WxBindPhone from './components/Wx-Bind-Phone.vue'
import CompleteLogin from './components/Complete-Login.vue'
import { namespace, Getter } from 'vuex-class'
const userModule = namespace('user')
interface CodeShowFooType {
    type: boolean;
    name: string;
}
Component.registerHooks([
    'beforeRouteLeave'
])
@Component({
    components: {
        PhoneLogin,
        WxLogin,
        PasswordLogin,
        WxBindPassword,
        WxBindPhone,
        CompleteLogin,
        Vcode
    }
})
export default class Login extends Vue {
    codeShow = false
    agencyError = ''
    enterprise = ''
    showDialog = false
    toName= ''
    refName = ''
    @userModule.Getter('token') tokenFoo!: string
    @userModule.Getter('currentStep') currentStepFoo!: number
    @userModule.Getter('agencyCode') agencyCodeFoo!: string
    @userModule.Getter('agencyList') agencyList: any
    @userModule.Mutation('LOGOUT') logout!: Function
    @userModule.Mutation('SET_CODEPASS') setCodePass!: Function
    @userModule.Action('GET_ALL_MALL_INFO') getAllMallInfo!: Function
    @userModule.Action('GET_AGENCY_LIST') getAgencyList!: Function
    @userModule.Action('selectMall') selectMall!: Function
    @Getter('roleMap') roleMap!: DynamicObject

    codeShowFoo (e: CodeShowFooType) {
        this.codeShow = e.type
        this.refName = e.name
    }

    async login () {
        try {
            await this.getAgencyList()
            await this.selectMall()
            await this.getAllMallInfo()
            this.$router.replace({ name: 'Home' })
        } catch (e) {
            throw e
        }
    }

    async success () {
        this.codeShow = false
        this.setCodePass(true)
        if (this.refName === 'PasswordLogin' || this.refName === 'CompleteLogin') {
            await (this.$refs[this.refName] as HTMLFormElement).login()
        } else {
            await (this.$refs[this.refName] as HTMLFormElement).getCode()
        }
    }

    close () {
        this.codeShow = false
        this.setCodePass(false)
    }

    clearCode () {
        sessionStorage.removeItem('redirect_code')
        sessionStorage.removeItem('redirect_state')
        sessionStorage.removeItem('login_state')
    }

    beforeRouteLeave (to: any, from: any, next: any): void {
        this.toName = to.name
        next()
    }

    destroyed (): void {
        if (this.toName !== 'WxBindPhone' && this.toName !== 'RegisterAccount') this.clearCode()
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
            background: url("https://mallcdn.youpenglai.com/static/admall-new/3.0.0/new-login-bg.jpg");
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
