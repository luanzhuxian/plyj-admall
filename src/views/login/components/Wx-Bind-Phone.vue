<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            绑定已注册手机号
        </div>
        <div :class="$style.accountMessage">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                size="large"
            >
                <el-form-item prop="mobile">
                    <div :class="$style.phoneNumber">
                        +86 <el-input v-model="form.mobile" type="number" maxlength="11" style="width: 200px" placeholder="请输入手机号" />
                    </div>
                </el-form-item>
                <el-form-item prop="identifyingCode">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.identifyingCode" maxlength="4" style="width: 180px" placeholder="请输入验证码" />
                        <get-code ref="child" @errorMobile="errorMobile" :mobile="form.mobile" sms-type="AGENT_USER_LOGIN" />
                    </div>
                </el-form-item>
            </el-form>

            <!--            <p :class="$style.unregisteredPhone">该手机号还未注册雅集，请先注册雅集~</p>-->
            <el-button
                size="large"
                style="width: 100%;border-radius: 121px;"
                type="primary"
                @click.native.prevent="login('form')"
                :loading="loading"
            >
                登录
            </el-button>
            <div :class="$style.register">
                <el-button type="text" @click="$router.replace({name:'WxBindPassword'})">账号绑定</el-button>
                <el-button type="text" @click="goLogin()">已有账号，马上跳转登陆</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import GetCode from '@/components/common/Get-Code.vue'
import { WxBind } from '../../../apis/account-set'
import { testPhone } from '../../../assets/ts/validate'
import { Component, Vue, Emit } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'
import { SessionEnum } from '@/enum/storage'
const userModule = namespace('user')

    @Component({ components: { GetCode } })
export default class WxBindPhone extends Vue {
        form = {
            mobile: '',
            identifyingCode: ''
        }

        rules = {
            mobile: [
                { required: true, trigger: 'blur', message: '手机号不能为空' },
                { validator: testPhone, trigger: 'blur', message: '请输入11位手机号码' }
            ],
            identifyingCode: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 4, message: '密码不能小于6位', trigger: 'blur' }
            ]
        }

        loading = false
        @userModule.Action('mobileLogin') LOGIN!: (form: { mobile: string; identifyingCode: string }) => void
        @Getter smsType!: string[]

        @Emit('emitLogin')
        emitLogin () {
            return true
        }

        errorMobile () {
            (this.$refs.form as HTMLFormElement).validateField('mobile')
        }

        async getCode () {
            try {
                await (this.$refs.child as HTMLFormElement).getCode()
            } catch (e) {
                throw e
            }
        }

        async login (formName: string) {
            // 防止连续敲击回车
            if (this.loading) return
            try {
                await (this.$refs[formName] as HTMLFormElement).validate()
                this.loading = true
                await this.LOGIN(this.form)
                const code = sessionStorage.getItem(SessionEnum.redirectCode) as string
                await WxBind(code)
                this.clearCode()
                this.emitLogin()
            } catch (e) {
                // this.refreshSafeCode()
                throw e
            } finally {
                this.loading = false
            }
        }

        goLogin () {
            this.clearCode()
            this.$router.replace({ name: 'PhoneLogin' })
        }

        clearCode () {
            sessionStorage.removeItem(SessionEnum.redirectCode)
            sessionStorage.removeItem(SessionEnum.redirectState)
            sessionStorage.removeItem(SessionEnum.loginState)
        }
}
</script>

<style module lang="scss">
    .phone-login{
        width: 360px;
        height: 400px;
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
                margin-top: 30px;
                >button{
                    margin: 0;
                    .c999{
                        color: #999999
                    }
                }
            }
            .wechat-text{
                width: 100%;
                height:60px ;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                font-weight: 400;
                color: #333333;
                img{
                    width: 24px;
                    margin-right: 10px;
                }
            }
        }
    }
</style>
