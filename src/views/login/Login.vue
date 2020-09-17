<template>
    <div :class="$style.login">
        <div :class="$style.loginTop">
            <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png">
        </div>
        <div :class="$style.loginBody">
            <div :class="$style.loginBg">
                <phoneLogin @emitLogin="login" @codeShowFoo="codeShowFoo" v-if="$route.name === 'PhoneLogin'" />
                <passwordLogin @emitLogin="login" @codeShowFoo="codeShowFoo" v-if="$route.name === 'PasswordLogin'" />
                <wxLogin @emitLogin="login" v-if="$route.name === 'WxLogin'" />
                <WxBindPassword @emitLogin="login" v-if="$route.name === 'WxBindPassword'" />
                <WxBindPhone @emitLogin="login" v-if="$route.name === 'WxBindPhone'" />
                <CompleteLogin @emitLogin="login" @codeShowFoo="codeShowFoo" v-if="$route.name === 'CompleteLogin'" />
            </div>
        </div>
        <el-dialog
            title="请选择您要登录的机构"
            :visible.sync="showDialog"
            :close-on-click-modal="false"
            width="25%"
            @close="closeDialog"
        >
            <el-form>
                <el-form-item :error="agencyError">
                    <el-select
                        v-model="enterprise"
                        @change="currentAgencyChange"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item of agencyList"
                            :key="item.enterpriseId"
                            :label="item.enterpriseName"
                            :value="item.enterpriseId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="selectAgency"
                    >
                        确 定
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <Vcode :show="codeShow" @success="success" @close="close" />
    </div>
</template>

<script lang=ts>
import { Component, Vue, Watch } from 'vue-property-decorator'
import Vcode from 'vue-puzzle-vcode'
import phoneLogin from './components/Phone-Login.vue'
import wxLogin from './components/Wx-Login.vue'
import passwordLogin from './components/Password-Login.vue'
import WxBindPassword from './components/Wx-Bind-Password.vue'
import WxBindPhone from './components/Wx-Bind-Phone.vue'
import CompleteLogin from './components/Complete-Login.vue'
import { namespace } from 'vuex-class'
// import startQiankun from '../../micro'
const userModule = namespace('user')
@Component({
    components: {
        phoneLogin,
        wxLogin,
        passwordLogin,
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
    @userModule.Getter('token') tokenFoo!: string
    @userModule.Getter('currentStep') currentStepFoo!: number
    @userModule.Getter('agencyCode') agencyCodeFoo!: string
    @userModule.Getter('agencyList') agencyList: any
    @userModule.Mutation('SET_CURRENT_AGENCY') setCurrentAgency: any
    @userModule.Mutation('LOGOUT') logout!: Function
    @userModule.Mutation('SET_CODEPASS') setCodePass!: Function
    @userModule.Action('GET_ALL_MALL_INFO') getAllMallInfo: any
    @Watch('$route.name')
    routeFoo (val: string) {
        return val
    }

    codeShowFoo (e: boolean) {
        console.log(e)
        this.codeShow = e
    }

    async login () {
        try {
            if (this.agencyList.length > 1) {
                this.showDialog = true
                return
            }
            await this.selectAgency()
        } catch (e) {
            throw e
        }
    }

    async selectAgency () {
        if (this.agencyList.length > 1 && !this.enterprise) {
            this.agencyError = '请选择您要登录的机构'
            return
        }
        if (this.agencyList.length as number === 1) {
            this.currentAgencyChange(this.agencyList[0].enterpriseId)
        }
        this.agencyError = ''
        try {
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

    closeDialog () {
        this.logout()
    }

    step () {
        const currentStep: number = Number(sessionStorage.getItem('currentStep')) || 0
        if (currentStep === 1) {
            this.$router.replace({ name: 'Register' })
        } else {
            this.$router.replace({ name: 'Home' })
        }
        // startQiankun()
    }

    success () {
        this.codeShow = false
        this.setCodePass(true)
    }

    close () {
        this.codeShow = false
        this.setCodePass(false)
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
