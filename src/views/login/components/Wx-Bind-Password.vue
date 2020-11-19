<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            绑定已注册账号
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
                        <el-input v-model="form.account" maxlength="11" style="width: 300px" placeholder="请输入账户" />
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.password" :type="passwordType" min="6" max="12" style="width: 300px" placeholder="请输入密码" />
                        <img :class="$style.hidePassword" @click="passwordType = 'text'" v-show="passwordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="passwordType = 'password'" v-show="passwordType === 'text'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
            </el-form>

            <!--            <p v-show="invalidData.invalidAccount" :class="$style.unregisteredPhone">该账号不存在，请联系管理员登录</p>-->
            <el-button
                size="large"
                style="width: 100%;border-radius: 121px;"
                type="primary"
                @click.native.prevent="login('form')"
                :loading="loading"
            >
                登录并绑定
            </el-button>
            <div :class="$style.register">
                <el-button type="text" @click="$router.replace({name:'WxBindPhone'})">手机号绑定</el-button>
                <el-button type="text" @click="goLogin()">已有账号，马上跳转登陆</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { WxBind } from '../../../apis/account-set'
import { Component, Vue, Emit } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'
import { SessionEnum } from '@/enum/storage'
import { MutationTypes } from '@/store/mutation-type'
const userModule = namespace('user')

@Component
export default class WxBindPassword extends Vue {
        toName = ''
        form = {
            account: '',
            password: ''
        }

        rules = {
            account: [{ required: true, trigger: 'blur', message: '账号不能为空' },
                { min: 6, message: '账号不能小于6位', trigger: 'blur' },
                { max: 50, message: '账号不能大于50位', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, message: '密码不能小于6位', trigger: 'blur' },
                { max: 18, message: '密码不能大于18位', trigger: 'blur' }
            ]
        }

        loading = false
        passwordType = 'password'
        @userModule.Mutation(MutationTypes.logout) logout!: Function
        @userModule.Action('login') LOGIN!: (form: { account: string; password: string }) => void
        @Getter smsType!: string[]

        @Emit('emitLogin')
        emitLogin () {
            return true
        }

        async login (formName: string) {
            try {
                await (this.$refs[formName] as HTMLFormElement).validate()
                this.loading = true
                await this.LOGIN(this.form)
                const code = sessionStorage.getItem(SessionEnum.redirectCode) as string
                if (!code) {
                    this.$alert('CODE已失效，请重新扫码登陆')
                    await this.$router.replace({ name: 'WxLogin' })
                    return false
                }
                await WxBind(code)
                this.clearCode()
                this.emitLogin()
            } catch (e) {
                this.logout()
                throw e
            } finally {
                setTimeout(() => {
                    this.loading = false
                }, 1000)
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

        beforeRouteLeave (to: any, from: any, next: any): void {
            this.toName = to.name
            next()
        }

        destroyed (): void {
            if (this.toName !== 'WxBindPhone' && this.toName !== 'WxBindPassword' && this.toName !== 'RegisterAccount') this.clearCode()
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
