<template>
    <div :class="$style.wechat">
        <div :class="$style.progress">
            <div :class="$style.title">公众号服务</div>
            <div :class="$style.main">
                <router-link tag="div" :class="$style.step" :to="{ name: 'WechatAuth' }">
                    <div :class="$style.done" v-if="auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE'">
                        <pl-svg name="icon-success-8db26" width="20" />
                    </div>
                    <div :class="$style.circle" v-else>1</div>
                    <div :class="$style.highlight">
                        <div :class="$style.text">
                            商城授权<div :class="$style.line" />
                        </div>
                        <div :class="$style.tips">微信认证服务号授权给雅集</div>
                    </div>
                </router-link>

                <router-link tag="div" :class="$style.step" :to="{ name: (auditStatus === 'OPEN_WECHAT_PAYMENT' || auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE') ? 'WechatPay' : $route.name }">
                    <div :class="$style.done" v-if="auditStatus === 'AUTHENTICATE'">
                        <pl-svg name="icon-success-8db26" width="20" />
                    </div>
                    <div :class="$style.circle + ' ' + (auditStatus === 'OPEN_WECHAT_PAYMENT' ? 'disabled' : '')" v-else>
                        2
                    </div>
                    <div :class="auditStatus === 'AUTHENTICATE' ? $style.highlight : ''">
                        <div :class="$style.text">
                            开通微信支付<div :class="$style.line" />
                        </div>
                        <div :class="$style.tips">填写信息完成认证开通支付功能</div>
                    </div>
                </router-link>

                <router-link tag="div" :class="$style.step" :to="{ name: applymentState === 'APPLYMENT_STATE_FINISHED' ? 'YajiAuthenticate' : $route.name }">
                    <div :class="$style.done" v-if="auditStatus === 'AUTHENTICATE'">
                        <pl-svg name="icon-success-8db26" width="20" />
                    </div>
                    <div :class="$style.circle + ' ' + ((auditStatus === 'OPEN_WECHAT_PAYMENT' || auditStatus === 'AUDITING') ? 'disabled' : '')" v-else>
                        3
                    </div>
                    <div :class="auditStatus === 'AUTHENTICATE' ? $style.highlight : ''">
                        <div :class="$style.text">
                            雅集认证
                        </div>
                        <div :class="$style.tips">人工审核后即可完成雅集认证</div>
                    </div>
                </router-link>
            </div>
            <router-view />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'BindWechat',
    computed: {
        ...mapGetters({
            auditStatus: 'user/auditStatus',
            wechatPayStatus: 'user/wechatPayStatus',
            currentStep: 'user/currentStep'
        }),
        applymentState () {
            return this.wechatPayStatus.applymentState
        }
    },
    mounted () {
        this.nav()
    },
    activated () {
        this.nav()
    },
    methods: {
        async nav () {
            const auditStatus = this.auditStatus
            console.log(auditStatus)
            try {
                if (this.$route.name !== 'WechatAuth' && auditStatus === 'MP_NOT_AUTHORIZED') {
                    await this.$router.replace({ name: 'WechatAuth', query: this.$route.query })
                    return
                }
                if (this.$route.name !== 'WechatPay' && auditStatus === 'OPEN_WECHAT_PAYMENT') {
                    await this.$router.replace({ name: 'WechatPay', query: this.$route.query })
                    return
                }
                if (this.$route.name !== 'YajiAuthenticate' && (auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE')) {
                    await this.$router.replace({ name: 'YajiAuthenticate', query: this.$route.query })
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style module lang="scss">
    .wechat {
        position: relative;
        padding-bottom: 100px;
        .progress{
            background: #fff;
            padding: 36px 40px;
            .title{
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 40px;
            }
            .main{
                display: flex;
                align-items: center;
                margin-left: 138px;
                margin-bottom: 46px;
                .step {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    .circle {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 40px;
                        height: 40px;
                        background-color: #4F63FF;
                        border-radius: 50%;
                        font-size: 16px;
                        margin-right: 10px;
                        color: #fff;
                        .disabled {
                            background-color: #4F63FF;
                        }
                    }
                    .done {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 40px;
                        height: 40px;
                        border: 2px solid #4F63FF;
                        border-radius: 50%;
                        font-size: 16px;
                        margin-right: 10px;
                        color: #4F63FF;
                    }
                    .text {
                        display: flex;
                        align-items: center;
                        font-weight: bold;
                        color: #999;
                        .line{
                            width: 120px;
                            height: 1px;
                            background: #ccc;
                            margin: 0 40px;
                        }
                        .tips{
                            color: #999;
                        }
                    }
                    .highlight {
                        .text{
                            color: #333;
                            .line{
                                background: #4F63FF;
                            }
                            .tips{
                                color: #666;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
