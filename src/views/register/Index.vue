<template>
    <div :class="$style.login">
        <div :class="$style.loginTop">
            <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png">
        </div>
        <div :class="$style.loginBody">
            <div :class="$style.loginBg">
                <Register ref="Register" @codeShowFoo="codeShowFoo" @emitLogin="login" v-if="$route.name === 'RegisterAccount'" />
                <ForgetPassword ref="ForgetPassword" @codeShowFoo="codeShowFoo" v-if="$route.name === 'ForgetPassword'" />
                <ResetPassword @emitLogin="login" v-if="$route.name === 'ResetPassword'" />
                <ModifyPassword @emitLogin="login" v-if="$route.name === 'ModifyPassword'" />
            </div>
        </div>
        <Vcode :show="codeShow" @success="success" @close="close" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Vcode from 'vue-puzzle-vcode'
import Register from './components/Register.vue'
import ForgetPassword from './components/Forget-Password.vue'
import ResetPassword from './components/Reset-Password.vue'
import ModifyPassword from './components/Modify-Password.vue'
import { namespace } from 'vuex-class'

interface CodeShowFooType {
    type: boolean;
    name: string;
}
Component.registerHooks([
    'beforeRouteLeave'
])
const userModule = namespace('user')
    @Component({
        components: {
            Register,
            ForgetPassword,
            ResetPassword,
            ModifyPassword,
            Vcode
        }
    })
export default class RegisterIndex extends Vue {
        codeShow = false
        agencyError = ''
        enterprise = ''
        showDialog = false
        toName = ''
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

        codeShowFoo (e: CodeShowFooType) {
            this.codeShow = e.type
            this.refName = e.name
        }

        async login () {
            try {
                await this.getAgencyList()
                await this.selectMall()
                await this.getAllMallInfo()
                await this.$router.replace({ name: 'Home' })
            } catch (e) {
                throw e
            }
        }

        async success () {
            this.codeShow = false
            this.setCodePass(true)
            await (this.$refs[this.refName] as HTMLFormElement).getCode()
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
            if (this.toName !== 'WxBindPhone') this.clearCode()
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
            background: #F5F6FA;
            display: flex;
            justify-content: center;
            position: relative;
            .login-bg{
                position: absolute;
                top: 21%;
            }
        }
    }
</style>
