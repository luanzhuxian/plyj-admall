<template>
    <div :class="$style.login">
        <div :class="$style.loginTop">
            <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png">
            {{ $router.name }}
        </div>
        <div :class="$style.loginBody">
            <div :class="$style.loginBg">
                <phoneLogin @emitLogin="login" v-if="$route.name === 'PhoneLogin'" />
                <passwordLogin @emitLogin="login" v-if="$route.name === 'PasswordLogin'" />
                <wxLogin @emitLogin="login" v-if="$route.name === 'WxLogin'" />
                <WxBindPassword @emitLogin="login" v-if="$route.name === 'WxBindPassword'" />
                <WxBindPhone @emitLogin="login" v-if="$route.name === 'WxBindPhone'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import phoneLogin from './components/Phone-Login.vue'
import wxLogin from './components/Wx-Login.vue'
import passwordLogin from './components/Password-Login.vue'
import WxBindPassword from './components/Wx-Bind-Password.vue'
import WxBindPhone from './components/Wx-Bind-Phone.vue'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
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
        agencyError = ''

    @userModule.Getter('token') tokenFoo!: string
    @userModule.Getter('currentStep') currentStepFoo!: number
    @userModule.Getter('agencyCode') agencyCodeFoo!: string
    @userModule.Getter('agencyList') agencyListFoo: any
    @userModule.Mutation('SET_CURRENT_AGENCY') setCurrentAgency: any
    @userModule.Action('GET_ALL_MALL_INFO') getAllMallInfo: any

    @Watch('$route.name')
    onChangeValue (newVal: string) {
        console.log(newVal)
    }

    async login () {
        try {
            if (this.agencyListFoo.length > 1) {
                // this.showDialog = true
                return
            }
            await this.selectAgency()
        } catch (e) {
            throw e
        }
    }

    async selectAgency () {
        // if (this.agencyListFoo.length > 1 && !this.enterprise) {
        //     this.agencyError = '请选择您要登录的机构'
        //     return
        // }
        if (this.agencyListFoo.length as number === 1) {
            this.currentAgencyChange(this.agencyListFoo[0].enterpriseId)
        }
        this.agencyError = ''
        try {
            // await this.$store.dispatch(GET_ALL_MALL_INFO)
            await this.getAllMallInfo()
            this.step()
        } catch (e) {
            throw e
        }
    }

    // 选中机构
    currentAgencyChange (val: object) {
        // 把选择的机构缓存起来
        this.setCurrentAgency({ agencyCode: val })
    }

    step () {
        const currentStep: number = Number(sessionStorage.getItem('currentStep')) || 0
        if (!currentStep) {
            this.$router.replace({ name: 'Home' })
        } else {
            this.$router.replace({ name: 'Register' })
        }
    }

    mounted () {
        console.log(this.$route.name)
    }

    destroyed (): void {
        sessionStorage.removeItem('redirect_code')
        sessionStorage.removeItem('redirect_state')
        sessionStorage.removeItem('login_state')
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
