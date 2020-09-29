<template>
    <el-dialog
        title="校验身份"
        :visible.sync="show"
        @close="close"
        width="480px"
    >
        <el-form :class="$style.validate">
            <div class="fz-16">为保护账户安全，使用手机</div>
            <div class="fz-16">{{ mobile | formatAccount }}验证身份</div>
            <el-form-item :error="error" class="mt-20">
                <el-input
                    v-model.trim="verifyCode"
                    style="width: 240px"
                    placeholder="请输入验证码"
                    :class="$style.verifyCode"
                >
                    <SendCode slot="append" :mobile="mobile" />
                </el-input>
            </el-form-item>
            <el-button :class="$style.next" type="primary" round @click="next" :loading="loading">下一步</el-button>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import SendCode from '../Send-Code.vue'
import { checkMobileCode } from '@/apis/common'
@Component({
    components: {
        SendCode
    }
})
export default class ValidateIdentity extends Vue {
    private loading = false
    private verifyCode = ''
    private error = ''
    private show = false
    private mobile = ''

    close () {
        this.$emit('close', false)
    }

    async next () {
        try {
            if (!this.verifyCode) {
                this.error = '请输入验证码'
                return Promise.reject(false)
            }
            this.loading = true
            const { result } = await checkMobileCode({
                smsType: 'ACCOUNT_BIND_PHONE_NUMBER',
                mobile: this.mobile,
                verifyCode: this.verifyCode
            })
            if (result) {
                this.$emit('passed')
                this.show = false
            } else {
                this.$error('验证码错误')
            }
        } catch (e) {
            throw e
        } finally {
            this.loading = false
        }
    }
}
</script>

<style module lang="scss">
.validate {
    display: flex;
    flex-direction: column;
    align-items: center;
    .next {
        display: block;
        margin: 36px auto 14px;
        min-width: 106px;
    }
    .verify-code {
        > input {
            border-right: none !important;
        }
        > div {
            > button {
                color: $--color-primary-blue !important;
            }
        }
    }
}
</style>
