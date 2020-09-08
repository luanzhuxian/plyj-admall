<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            <div :class="$style.typePassword">密码登录</div>
            <div :class="$style.typeCode">验证码登录</div>
        </div>
        <div :class="$style.accountMessage">
            <div :class="$style.phoneNumber">
                +86 <el-input maxlength="11" style="width: 200px" placeholder="请输入手机号" />
            </div>
            <div :class="$style.phoneCode">
                <el-input maxlength="4" style="width: 220px" placeholder="请输入验证码" />
                <div :class="$style.getCode">获取验证码</div>
            </div>
            <div :class="$style.register">
                <el-checkbox v-model="agree" :true-label="1" :false-label="0">
                    <span style="font-size: 14px;color: #333333">保持登录</span>
                </el-checkbox>
                <el-button :class="$style.unregistered" style="color: #999999" type="text">还没注册？</el-button>
                <el-button :class="$style.registering" type="text">立即注册</el-button>
            </div>
            <el-button
                v-enter
                size="large"
                style="width: 100%;border-radius: 121px;"
                type="primary"
                @click.native.prevent="login"
                :loading="loading"
            >
                登录
            </el-button>
            <div>
                <pl-svg width="28" name="icon-wechat" /> 微信一键登录
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
    @Component
export default class App extends Vue {
        agree = false
        loading = false
}
</script>

<style module lang="scss">
.phone-login{
    width: 400px;
    height: 440px;
    padding: 40px;
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
        .phone-code{
            width: 100%;
            display: flex;
            padding-top: 28px;
            padding-bottom: 8px;
            box-shadow: 0px 1px 0px #E7E7E7;
            input{
                padding-left: 0;
            }
            >.get-code{
                padding: 6px 12px;
                font-size: 14px;
                font-weight: 400;
                color: #4F63FF;
                border: 1px solid #4F63FF;
                border-radius: 17px;
            }
        }
        .register{
            margin-top: 30px;
            margin-bottom: 24px;
            >button{
                margin: 0;
            }
            .unregistered{
                margin-left: 90px;
            }
        }
    }
}
</style>
