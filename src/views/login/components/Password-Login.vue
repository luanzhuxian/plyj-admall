<template>
    <div :class="$style.phoneLogin">
        <img @click="$router.push({name:'WxLogin'})" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/QRLogin.png" alt="">
        <div :class="$style.loginType">
            <div :class="$style.typePassword">密码登录</div>
            <div :class="$style.typeCode" @click="$router.push({name:'PhoneLogin'})">验证码登录</div>
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
                        <el-input v-model="form.account" maxlength="50" style="width: 300px" placeholder="请输入账号" />
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
                @click.native.prevent="login()"
                :loading="loading"
            >
                登录
            </el-button>
            <div :class="$style.register">
                <el-button type="text" @click="$router.push({name:'ForgetPassword'})"><span :class="$style.c999">忘记密码</span></el-button>
                <el-button type="text" @click="$router.push({name:'Register'})"><span :class="$style.c999">还没注册？</span>立即注册</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { testAccount } from '@/assets/ts/validate'
import { MutationTypes } from '@/store/mutation-type'
const userModule = namespace('user')

@Component
export default class PasswordLogin extends Vue {
    form = {
        account: '',
        password: ''
    }

    rules = {
        account: [{ required: true, trigger: 'blur', message: '账号不能为空' },
            { validator: testAccount, trigger: 'blur', message: '请输入6-50位数字字母组合的账号' }
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, message: '密码不能小于6位', trigger: 'blur' },
            { max: 12, message: '密码不能大于12位', trigger: 'blur' }
        ]
    }

    loading = false
    passwordType = 'password'

    @Prop(Boolean) codeShow!: boolean;
    @userModule.Getter('codePass') codePass!: boolean
    @userModule.Mutation(MutationTypes.setCodePass) setCodePass!: Function
    @userModule.Mutation(MutationTypes.setCodeShow) setCodeShow!: Function
    @userModule.Action('login') LOGIN!: (form: { account: string; password: string }) => void

    @Emit('emitLogin')
    emitLogin () {
        return true
    }

    mounted (): void {
        this.setCodePass(false)
        document.addEventListener('keydown', this.keyupEnter)
    }

    beforeDestroy (): void {
        document.removeEventListener('keydown', this.keyupEnter)
    }

    keyupEnter (e: any) {
        if (e.keyCode === 13) this.login()
    }

    async login () {
        // 防止连续敲击回车
        if (this.loading) return
        try {
            await (this.$refs.form as HTMLFormElement).validate()
            if (!this.codePass) {
                this.setCodeShow(true)
                return
            }
            this.loading = true
            await this.LOGIN(this.form)
            this.emitLogin()
        } catch (e) {
            throw e
        } finally {
            this.setCodePass(false)
            this.loading = false
        }
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
            .type-password{
                padding-right: 32px;
                font-size: 24px;
                font-weight: 600;
                color: #333333;
            }
            .type-code{
                padding-top: 6px;
                font-size: 20px;
                font-weight: 400;
                color: #999999;
            }
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
        }
    }
</style>
