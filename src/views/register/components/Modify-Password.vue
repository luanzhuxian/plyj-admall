<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            修改密码
        </div>
        <div :class="$style.accountMessage">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                size="large"
            >
                <el-form-item prop="oldPassword">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.oldPassword" :type="oldPasswordType" min="6" max="12" style="width: 300px" placeholder="请输入你的当前密码" />
                        <img :class="$style.hidePassword" @click="oldPasswordType = 'text'" v-show="oldPasswordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="oldPasswordType = 'password'" v-show="oldPasswordType === 'text'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.password" :type="passwordType" min="6" max="12" style="width: 300px" placeholder="设置你的新密码" />
                        <img :class="$style.hidePassword" @click="passwordType = 'text'" v-show="passwordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="passwordType = 'password'" v-show="passwordType === 'text'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.confirmPassword" :type="confirmPasswordType" min="6" max="12" style="width: 300px" placeholder="请再次设置你的新密码" />
                        <img :class="$style.hidePassword" @click="confirmPasswordType = 'text'" v-show="confirmPasswordType === 'password'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/hide-password.png" alt="">
                        <img :class="$style.showPassword" @click="confirmPasswordType = 'password'" v-show="confirmPasswordType === 'text'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/see-password.png" alt="">
                    </div>
                </el-form-item>
            </el-form>
            <el-button
                size="large"
                style="width: 100%;border-radius: 121px;"
                type="primary"
                @click.native.prevent="modifyPassword('form')"
                :loading="loading"
            >
                确认修改
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { modifyPassword } from '../../../apis/base/register'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ModifyPassword extends Vue {
        form = {
            oldPassword: '',
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
            oldPassword: [
                { required: true, message: '当前密码不能为空', trigger: 'blur' },
                { min: 6, message: '当前密码不能小于6位', trigger: 'blur' },
                { max: 12, message: '当前密码不能大于12位', trigger: 'blur' }
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
        oldPasswordType = 'password'
        passwordType = 'password'
        confirmPasswordType = 'password'

        async modifyPassword (formName: string) {
        // 防止连续敲击回车
            if (this.loading) return
            try {
                await (this.$refs[formName] as HTMLFormElement).validate()
                this.loading = true
                const form = {
                    lastPassword: this.form.oldPassword,
                    password: this.form.password
                }
                const data = await modifyPassword(form)
                if (!data) return this.$error('操作失败')
                this.$router.replace({ name: 'Home' })
            } catch (e) {
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
        height: 380px;
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
            margin-top: 36px;
            border-radius: 10px;
            input{
                border: none;
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
            }
            .register{
                display: flex;
                justify-content: center;
                margin-top: 20px;
                >button{
                    margin: 0;
                }
            }
        }
    }
</style>
