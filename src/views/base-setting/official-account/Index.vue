<template>
    <div :class="$style.bingWechat">
        <div :class="$style.wechatTitle">公众号服务</div>
        <div :class="$style.progress">
            <router-link tag="div" :class="$style.stepBox" :to="{ name: 'WechatAuth' }">
                <div :class="$style.progressCircle">
                    <pl-svg name="icon-success-8db26" width="16" />
                </div>
                <div :class="$style.text" class="bing-wechat-step">
                    <div :class="$style.title">商城授权 <div :class="$style.line + ' ' + $style.one" /></div>
                    <div class="tip">微信认证服务号授权给雅集</div>
                </div>
            </router-link>

            <router-link
                :class="$style.stepBox"
                tag="div"
                :to="{ name: (auditStatus === 'OPEN_WECHAT_PAYMENT' || auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE') ? 'WechatPay' : $route.name }"
            >
                <div :class="$style.progressCircle" v-if="auditStatus === 'OPEN_WECHAT_PAYMENT' || auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE'">
                    <pl-svg name="icon-success-8db26" width="16" />
                </div>
                <div :class="$style.progressCircleDisabled" v-else />
                <div :class="$style.text" class="bing-wechat-step">
                    <div :class="$style.title">开通微信支付 <div :class="$style.line + ' ' + $style.two" /></div>
                    <div class="tip">微信认证服务号授权给雅集</div>
                </div>
            </router-link>

            <router-link :class="$style.stepBox" tag="div" :to="{ name: applymentState === 'APPLYMENT_STATE_FINISHED' ? 'YajiAuthenticate' : $route.name }">
                <div :class="$style.progressCircle" v-if="auditStatus !== 'OPEN_WECHAT_PAYMENT' && auditStatus !== 'MP_NOT_AUTHORIZED' && auditStatus !== 'MALL_NOT_COMPLETED'">
                    <pl-svg name="icon-success-8db26" width="16" />
                </div>
                <div :class="$style.progressCircleDisabled" v-else />
                <div :class="$style.text" class="bing-wechat-step">
                    <div :class="$style.title">雅集认证</div>
                    <div class="tip">微信认证服务号授权给雅集</div>
                </div>
            </router-link>
        </div>
        <main>
            <router-view />
        </main>
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
    .bing-wechat {
        padding: 36px 40px;
        background-color: #fff;
        .wechatTitle{
            margin-bottom: 40px;
            font-weight: bold;
            font-size: 16px;
        }
    }
    .progress {
        display: flex;
        margin-bottom: 54px;
        margin-left: 120px;
    }
    .stepBox {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        > .text {
            margin-right: 35px;
            .title{
                display: flex;
                align-items: center;
                font-weight: bold;
                .line {
                    margin-left: 45px;
                    width: 120px;
                    height: 1px;
                    background-color: #4F63FF;
                    &.one {
                        background-color: #ccc;
                    }
                    &.two {
                        background-color: #ccc;
                    }
                }
            }
        }
    }
    :global {
        .bing-wechat-step {
            color: #333;
            .tip{
                color: #ccc;
            }
        }
        .router-link-active {
            .bing-wechat-step {
                color: #4F63FF;
                .tip{
                    color: #666;
                }
            }
        }
    }
    .progressCircle {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background-color: #4F63FF;
        border-radius: 50%;
        margin-right: 10px;
    }
    .progressCircleDisabled{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background-color: #E7E7E7;
        border-radius: 50%;
        margin-right: 10px;
    }
</style>
