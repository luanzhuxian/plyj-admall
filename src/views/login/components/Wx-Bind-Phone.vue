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
                        <div :class="$style.getCode" v-if="getCodeing">{{ time }}s</div>
                        <div :class="$style.getCode" v-else @click="getCode()">获取验证码</div>
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
                <el-button type="text" @click="$router.push({name:'WxBindPassword'})">账号绑定</el-button>
                <el-button type="text" @click="goLogin()">已有账号，马上跳转登陆</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { WxBind } from '../../../apis/account-set'
import { testPhone } from '../../../assets/ts/validate'
import { Component, Vue, Emit } from 'vue-property-decorator'
import { getVerifyCodeFunc } from '../../../apis/common'
import { Getter, namespace } from 'vuex-class'
import { sessionEnum } from '@/enum/storage'
// import { GET_ALL_MALL_INFO } from '../../../store/mutation-type'
const userModule = namespace('user')

@Component
export default class WxBindPhone extends Vue {
        form = {
            mobile: '',
            identifyingCode: ''
        }

        codeForm = {
            mobile: '',
            smsType: 'AGENT_USER_LOGIN' as SmsType
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

        getCodeing = false
        time = 60
        timer: any = null
        loading = false
        @userModule.Action('mobileLogin') LOGIN!: (form: { mobile: string; identifyingCode: string }) => void
        @Getter smsType!: string[]

        @Emit('emitLogin')
        emitLogin () {
            return true
        }

        async getCode () {
            if (this.getCodeing) return
            clearInterval(this.timer)
            let validateField = true
            await (this.$refs.form as HTMLFormElement).validateField('mobile', (mobileError: any) => {
                if (mobileError) validateField = false
            })
            if (!validateField) return
            this.codeForm.mobile = this.form.mobile
            await getVerifyCodeFunc(this.codeForm)
            this.getCodeing = true
            this.timer = setInterval(() => {
                this.time--
                if (!this.time) {
                    this.getCodeing = false
                    this.time = 60
                    clearInterval(this.timer)
                }
            }, 1000)
        }

        async login (formName: string) {
            // 防止连续敲击回车
            if (this.loading) return
            try {
                await (this.$refs[formName] as HTMLFormElement).validate()
                this.loading = true
                await this.LOGIN(this.form)
                const code = sessionStorage.getItem(sessionEnum.redirectCode) as string
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
            this.$router.push({ name: 'PhoneLogin' })
        }

        clearCode () {
            sessionStorage.removeItem(sessionEnum.redirectCode)
            sessionStorage.removeItem(sessionEnum.redirectState)
            sessionStorage.removeItem('login_state')
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
