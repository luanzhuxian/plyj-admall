<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            <div :class="$style.typePassword">密码登录</div>
            <div :class="$style.typeCode" @click="passwordLogin">验证码登录</div>
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
                        <el-input v-model="form.account" maxlength="11" style="width: 300px" placeholder="请输入手机号" />
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.password" :type="passwordType" style="width: 300px" placeholder="请输入密码" />
                        <img :class="$style.hidePassword" @click="passwordType = 'text'" v-if="passwordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="passwordType = 'password'" v-else src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
            </el-form>

            <!--            <p v-show="invalidData.invalidAccount" :class="$style.unregisteredPhone">该账号不存在，请联系管理员登录</p>-->

            <div :class="$style.register">
                <el-checkbox v-model="agree">
                    <span style="font-size: 14px;color: #333333">保持登录</span>
                </el-checkbox>
                <el-button :class="$style.registering" type="text"><span :class="$style.unregistered">还没注册？</span>立即注册</el-button>
            </div>
            <el-button
                size="large"
                style="width: 100%;border-radius: 121px;"
                type="primary"
                @click.native.prevent="login('form')"
                :loading="loading"
            >
                登录
            </el-button>
            <el-button @click="WxLogin" type="text" style="width: 100%">
                <div :class="$style.wechatText"><img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/wechat.png" alt="">微信一键登录</div>
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'
const userModule = namespace('user')

@Component
export default class PasswordLogin extends Vue {
    form = {
        account: '',
        password: ''
    }

        rules = {
            account: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, message: '密码不能小于6位', trigger: 'blur' }
            ]
        }

        agencyError= ''
        agree = false
        loading = false
        passwordType = 'password'

    @userModule.Getter('token') tokenFoo!: string
    @userModule.Getter('currentStep') currentStepFoo!: number
    @userModule.Getter('agencyCode') agencyCodeFoo!: string
    @userModule.Getter('agencyList') agencyListFoo: any
    @userModule.Action('login') LOGIN!: (form: { account: string; password: string }) => void
    @userModule.Mutation('SET_CURRENT_AGENCY') setCurrentAgency: any
    @userModule.Action('GET_ALL_MALL_INFO') getAllMallInfo: any
    @Getter smsType!: string[]

    @Emit('phoneLogin')
    passwordLogin () {
        return true
    }

    @Emit('WxLogin')
    WxLogin () {
        return true
    }

    async login (formName: string) {
        // 防止连续敲击回车
        if (this.loading) return
        try {
            await (this.$refs[formName] as HTMLFormElement).validate()
            this.loading = true
            await this.LOGIN(this.form)
            if (this.agencyListFoo.length > 1) {
                // this.showDialog = true
                return
            }
            await this.selectAgency()
        } catch (e) {
            // this.refreshSafeCode()
            throw e
        } finally {
            this.loading = false
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
                margin-top: 30px;
                margin-bottom: 24px;
                >button{
                    margin: 0;
                }
                .registering{
                    margin-left: 100px;
                    .unregistered{
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
