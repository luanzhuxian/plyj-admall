<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            完善资料
        </div>
        <div :class="$style.accountMessage">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                size="large"
            >
                <el-form-item prop="account">
                    <div :class="$style.phoneNumber">
                        <el-input v-model="form.account" maxlength="50" style="width: 300px" placeholder="请输6-50位数字字母组合的账号" />
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.password" :type="passwordType" min="6" max="12" style="width: 300px" placeholder="请输入登录密码" />
                        <img :class="$style.hidePassword" @click="passwordType = 'text'" v-if="passwordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="passwordType = 'password'" v-else src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.confirmPassword" :type="confirmPasswordType" min="6" max="12" style="width: 300px" placeholder="请再次输入登录密码" />
                        <img :class="$style.hidePassword" @click="confirmPasswordType = 'text'" v-if="confirmPasswordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="confirmPasswordType = 'password'" v-else src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
            </el-form>

            <el-checkbox v-model="agree">
                我已阅读并同意<span @click="showAgreement = true" style="color: #4F63FF">《朋来雅集服务协议》</span>
            </el-checkbox>
            <el-button
                size="large"
                style="width: 100%;border-radius: 121px;margin-top: 20px"
                type="primary"
                @click.native.prevent="login()"
                :loading="loading"
            >
                完善资料，进入雅集
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { completeInfo } from '../../../apis/login'
import Agreement from '../../../components/register/Agreement.vue'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
const userModule = namespace('user')

    @Component({
        components: {
            Agreement
        }
    })
export default class CompleteLogin extends Vue {
        showAgreement= false
        form = {
            account: '',
            password: '',
            confirmPassword: ''
        }

        testConfirmPassword = (rule: any, value: any, callback: Function) => {
            if (this.form.password !== value) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback()
            }
        }

        rules = {
            account: [{ required: true, trigger: 'blur', message: '账号不能为空' },
                { min: 6, message: '账号不能小于6位', trigger: 'blur' },
                { max: 50, message: '账号不能大于50位', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, message: '密码不能小于6位', trigger: 'blur' },
                { max: 12, message: '密码不能大于12位', trigger: 'blur' }
            ],
            confirmPassword: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, message: '密码不能小于6位', trigger: 'blur' },
                { max: 12, message: '密码不能大于12位', trigger: 'blur' },
                { validator: this.testConfirmPassword, trigger: 'blur' }
            ]
        }

        loading = false
        agree = false
        passwordType = 'password'
        confirmPasswordType = 'password'

        @Prop(Boolean) codeShow!: boolean;
        @userModule.Getter('codePass') codePass!: boolean
        @userModule.Mutation('SET_CODEPASS') setCodePass!: Function
        @userModule.Action('login') LOGIN!: (form: { account: string; password: string }) => void

        @Emit('emitLogin')
        emitLogin () {
            return true
        }

        @Emit('codeShowFoo')
        codeShowFoo (type: boolean) {
            return type
        }

        mounted (): void {
            this.setCodePass(false)
        }

        async login () {
            // 防止连续敲击回车
            if (this.loading) return
            if (!this.agree) return this.$error('请阅读并同意《朋来雅集服务协议》')
            try {
                await (this.$refs.form as HTMLFormElement).validate()
                if (!this.codePass) {
                    this.codeShowFoo(true)
                    return
                }
                this.loading = true
                await completeInfo(this.form)
                this.emitLogin()
            } catch (e) {
                this.setCodePass(false)
                throw e
            } finally {
                this.loading = false
            }
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
            font-size: 20px;
            font-weight: 600;
            color: #333333;
        }
        .account-message{
            margin-top: 20px;
            input{
                border: none;
            }
            .phone-number{
                width: 100%;
                display: flex;
                align-items: center;
                padding-bottom: 8px;
                box-shadow: 0px 1px 0px #E7E7E7;
                color: #333333;
                font-size: 16px;
                input{
                    padding-left: 0;
                }
            }
            .unregistered-phone{
                padding-top: 2px;
                font-size: 12px;
                font-weight: 400;
                color: #E63600;
            }
            .phone-code{
                width: 100%;
                display: flex;
                align-items: center;
                padding-top: 10px;
                padding-bottom: 8px;
                box-shadow: 0px 1px 0px #E7E7E7;
                input{
                    padding-left: 0;
                }
                .show-password{
                    height: 20px;
                }
                .hide-password{
                    width: 20px;
                }
            }
        }
    }
</style>
