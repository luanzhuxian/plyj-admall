<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            注册雅集
        </div>
        <el-button
            v-if="!form.wxCode"
            size="large"
            style="width: 100%;border-radius: 121px;margin-top: 20px"
            type="success"
            plain
            @click.native.prevent="$router.push({name:'WxLogin'})"
            :loading="loading"
        >
            <div :class="$style.wxButton">
                <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/wechat.png" style="width: 20px" alt="">微信注册
            </div>
        </el-button>
        <div
            v-if="!form.wxCode"
            :class="$style.loginOr">
            <div />
            <span>或</span>
            <div />
        </div>
        <div :class="$style.accountMessage">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                size="large"
            >
                <el-form-item prop="bindPhone">
                    <div :class="$style.phoneNumber">
                        +86 <el-input v-model="form.bindPhone" type="number" maxlength="11" style="width: 200px" placeholder="请输入手机号" />
                    </div>
                </el-form-item>
                <el-form-item prop="verifyCode">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.verifyCode" maxlength="4" style="width: 220px" placeholder="请输入验证码" />
                        <get-code ref="child" @errorMobile="errorMobile" :mobile="form.bindPhone" sms-type="AGENCY_MOBILE_REGISTER" />
                    </div>
                </el-form-item>
                <el-form-item prop="account">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.account" maxlength="50" style="width: 300px" placeholder="请输入6-50位数字字母组合的账号" />
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.password" :type="passwordType" min="6" max="12" style="width: 300px" placeholder="请输入密码" />
                        <img :class="$style.hidePassword" @click="passwordType = 'text'" v-show="passwordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="passwordType = 'password'" v-show="passwordType === 'text'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.confirmPassword" :type="confirmPasswordType" min="6" max="12" style="width: 300px" placeholder="再次输入密码" />
                        <img :class="$style.hidePassword" @click="confirmPasswordType = 'text'" v-show="confirmPasswordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="confirmPasswordType = 'password'" v-show="confirmPasswordType === 'text'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
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
                :disabled="!agree"
            >
                完成入驻，进入雅集
            </el-button>
            <div :class="{
                [$style.register]: true,
                [$style.bindRegister]: !form.wxCode
            }">
                <el-button v-if="form.wxCode" type="text" @click="$router.replace({name: 'WxBindPhone'})">绑定已有账号</el-button>
                <el-button type="text" @click="$router.replace({name: 'PhoneLogin'})"><span :class="$style.c999">已有账号？</span>马上登录</el-button>
            </div>
            <!--            <el-button @click="WxLogin" type="text" style="width: 100%">-->
            <!--                <div :class="$style.wechatText"><img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/wechat.png" alt="">微信一键登录</div>-->
            <!--            </el-button>-->
        </div>
        <Agreement :show.sync="showAgreement" type="1" />
    </div>
</template>

<script lang="ts">
import { testPhone, testAccount } from '../../../assets/ts/validate'
import { Component, Vue, Emit } from 'vue-property-decorator'
import Agreement from '../../../components/register/Agreement.vue'
import GetCode from '@/components/common/Get-Code.vue'
import { namespace } from 'vuex-class'
import { SessionEnum } from '@/enum/storage'
const userModule = namespace('user')

    @Component({
        components: {
            Agreement,
            GetCode
        }
    })
export default class Register extends Vue {
        testConfirmPassword = (rule: any, value: any, callback: Function) => {
            if (this.form.password !== value) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback()
            }
        }

        showAgreement= false
        form = {
            bindPhone: '',
            verifyCode: '',
            account: '',
            password: '',
            confirmPassword: '',
            registeredSource: 'PC',
            wxCode: ''
        }

        agree = false
        passwordType = 'password'
        confirmPasswordType = 'password'

        rules = {
            bindPhone: [
                { required: true, trigger: 'blur', message: '手机号不能为空' },
                { validator: testPhone, trigger: 'blur', message: '请输入11位手机号码' }
            ],
            verifyCode: [
                { required: true, message: '验证码不能为空', trigger: 'blur' },
                { min: 4, message: '验证码不能小于4位', trigger: 'blur' }
            ],

            account: [{ required: true, trigger: 'blur', message: '账号不能为空' },
                { validator: testAccount, trigger: 'blur', message: '请输入6-50位数字字母组合的账号' }
            ],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, message: '密码不能小于6位', trigger: 'blur' },
                { max: 18, message: '密码不能大于18位', trigger: 'blur' }
            ],
            confirmPassword: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, message: '密码不能小于6位', trigger: 'blur' },
                { max: 18, message: '密码不能大于18位', trigger: 'blur' },
                { validator: this.testConfirmPassword, trigger: 'blur' }
            ]

        }

        loading = false
        @userModule.Action('register') register!: (form: Record<string, any>) => void

        @Emit('emitLogin')
        emitLogin () {
            return true
        }

        mounted (): void {
            this.form.wxCode = sessionStorage.getItem(SessionEnum.redirectCode) || ''
            document.addEventListener('keydown', this.keyupEnter)
        }

        beforeDestroy (): void {
            document.removeEventListener('keydown', this.keyupEnter)
        }

        keyupEnter (e: any) {
            if (e.keyCode === 13 && this.agree) this.login()
        }

        errorMobile () {
            (this.$refs.form as HTMLFormElement).validateField('bindPhone')
        }

        async getCode () {
            try {
                await (this.$refs.child as HTMLFormElement).getCode()
            } catch (e) {
                throw e
            }
        }

        async login () {
            // 防止连续敲击回车
            if (this.loading) return
            if (!this.agree) return this.$error('请阅读并同意《朋来雅集服务协议》')
            try {
                await (this.$refs.form as HTMLFormElement).validate()
                this.loading = true
                await this.register(this.form)
                this.emitLogin()
            } catch (e) {
                // this.refreshSafeCode()
                throw e
            } finally {
                this.loading = false
            }
        }
}
</script>

<style module lang="scss">
    .c999{
        color: #999999
    }
    .phone-login{
        width: 400px;
        padding: 40px;
        border-radius: 10px;
        background-color: #ffffff;
        >img{
            position: absolute;
            top: 0;
            right: 0;
        }
        .login-type{
            display: flex;
            justify-content: center;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
        }
        .wx-button{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                margin-right: 10px;
            }
        }

        .login-or{
            display: flex;
            align-items: center;
            padding-top: 20px;
            div{
                width: 145px;
                border-bottom: 1px solid #F5F6FA;
            }
            span{
                padding: 0 8px;
                font-size: 14px;
                font-weight: 400;
                color: #999999;
            }

        }
        .account-message{
            margin-top: 36px;
            border-radius: 10px;
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
                font-size: 14px;
            }
            .unregistered-phone{
                padding-top: 2px;
                font-size: 12px;
                font-weight: 400;
                color: #E63600;
            }
            .phone-code{
                width: 100%;
                height: 52px;
                display: flex;
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
                >.get-code{
                    display: flex;
                    align-items: center;
                    padding: 6px 12px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #4F63FF;
                    border: 1px solid #4F63FF;
                    border-radius: 17px;
                    cursor: pointer;
                }
            }
            .register{
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                >button{
                    margin: 0;
                }
            }
            .bind-register{
                justify-content: center;
            }
        }
    }
</style>
