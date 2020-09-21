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

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
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
        @userModule.Mutation('SET_CURRENT_AGENCY') setCurrentAgency: any
        @userModule.Mutation('LOGOUT') logout!: Function
        @userModule.Mutation('SET_CODEPASS') setCodePass!: Function
        @userModule.Action('GET_ALL_MALL_INFO') getAllMallInfo: any
        @Watch('$route.name')
        onChangeValue (newVal: string) {
            console.log(newVal)
        }

        codeShowFoo (e: CodeShowFooType) {
            this.codeShow = e.type
            this.refName = e.name
        }

        async login () {
            try {
                if (this.agencyList.length > 1) {
                    this.showDialog = true
                    return
                }
                if (!this.agencyList.length) {
                    this.$router.replace({ name: 'Home' })
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
            if (!currentStep) {
                this.$router.replace({ name: 'Home' })
            } else {
                this.$router.replace({ name: 'Register' })
            }
        }

        async success () {
            this.codeShow = false
            this.setCodePass(true)
            await (this.$refs[this.refName] as HTMLFormElement).getCode()
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
            .login-bg{
                position: absolute;
                top: 21%;
            }
        }
    }
</style>
