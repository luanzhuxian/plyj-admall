<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            <div :class="$style.typePassword">密码登录</div>
            <div :class="$style.typeCode">验证码登录</div>
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
                        <el-input v-model="form.identifyingCode" type="number" maxlength="4" style="width: 220px" placeholder="请输入验证码" />
                        <div :class="$style.getCode" v-if="getCodeing">{{ time }}</div>
                        <div :class="$style.getCode" v-else @click="getCode()">获取验证码</div>
                    </div>
                </el-form-item>
            </el-form>

            <!--            <p :class="$style.unregisteredPhone">该手机号还未注册雅集，请先注册雅集~</p>-->

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
            <el-button type="text" style="width: 100%">
                <div :class="$style.wechatText"><img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/wechat.png" alt="">微信一键登录</div>
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { testPhone } from '../../../assets/ts/validate'
import { Component, Vue } from 'vue-property-decorator'
import { getVerifyCodeFunc } from '../../../apis/common'
import { Getter, namespace } from 'vuex-class'
// import { GET_ALL_MALL_INFO } from '../../../store/mutation-type'
const userModule = namespace('user')
type formType = {
    name: string;
    age: number;
}
    @Component
export default class PhoneLogin extends Vue {
        form = {
            mobile: '',
            identifyingCode: ''
        }

        codeForm = {
            mobile: '',
            smsType: 'AGENT_USER_LOGIN' as SmsType
        }

        agencyError = ''
        rules = {
            mobile: [
                { required: true, trigger: 'blur', message: '账号不能为空' },
                { validator: testPhone, trigger: 'blur' }
            ],
            identifyingCode: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 4, message: '密码不能小于6位', trigger: 'blur' }
            ]
        }

        getCodeing = false
        time = 60
        timer: any = null
        agree = false
        loading = false

        @userModule.Getter('token') tokenFoo!: string
        @userModule.Getter('currentStep') currentStepFoo!: number
        @userModule.Getter('agencyCode') agencyCodeFoo!: string
        @userModule.Getter('agencyList') agencyListFoo: any
        @userModule.Action('mobileLogin') LOGIN!: (form: { mobile: string; identifyingCode: string }) => void

        @userModule.Mutation('SET_CURRENT_AGENCY') setCurrentAgency: any
        @userModule.Action('GET_ALL_MALL_INFO') getAllMallInfo: any
        @Getter smsType!: string[]

        async getCode () {
            if (this.getCodeing) return
            clearInterval(this.timer)
            this.codeForm.mobile = this.form.mobile
            const data = await getVerifyCodeFunc(this.codeForm)
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
                const data = await this.LOGIN(this.form)
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
            font-size: 20px;
            font-weight: 400;
            color: #999999;
        }
        .type-code{
            font-size: 24px;
            font-weight: 600;
            color: #333333;
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
            font-size: 16px;
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
