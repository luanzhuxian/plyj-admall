<template>
    <div :class="$style.bingWechat">
        <div :class="$style.wechatTitle">公众号服务</div>
        <div :class="$style.progress">
            <div :class="$style.stepBox" @click="nav('WechatAuth')">
                <div :class="$style.progressCircle">
                    <pl-svg name="icon-success-8db26" width="16" />
                </div>
                <div :class="$style.text" class="bing-wechat-step">
                    <div :class="$style.title">商城授权 <div :class="$style.line + ' ' + $style.one" /></div>
                    <div class="tip">微信认证服务号授权给雅集</div>
                </div>
            </div>

            <div :class="$style.stepBox" @click="nav('WechatPay')">
                <div :class="$style.progressCircle" v-if="auditStatus === 'OPEN_WECHAT_PAYMENT' || auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE'">
                    <pl-svg name="icon-success-8db26" width="16" />
                </div>
                <div :class="$style.progressCircleDisabled" v-else />
                <div :class="$style.text" class="bing-wechat-step">
                    <div :class="$style.title">开通微信支付 <div :class="$style.line + ' ' + $style.two" /></div>
                    <div class="tip">填写信息完成认证开通支付功能</div>
                </div>
            </div>

            <div :class="$style.stepBox" @click="nav('YajiAuth')">
                <div :class="$style.progressCircle" v-if="auditStatus !== 'OPEN_WECHAT_PAYMENT' && auditStatus !== 'MP_NOT_AUTHORIZED' && auditStatus !== 'MALL_NOT_COMPLETED'">
                    <pl-svg name="icon-success-8db26" width="16" />
                </div>
                <div :class="$style.progressCircleDisabled" v-else />
                <div :class="$style.text" class="bing-wechat-step">
                    <div :class="$style.title">雅集认证</div>
                    <div class="tip">人工审核后即可完成雅集认证</div>
                </div>
            </div>
        </div>
        <main>
            <component :is="page" />
        </main>
    </div>
</template>

<script lang="ts">
import WechatAuth from './pages/Wechat-Auth.vue'
import WechatPay from './pages/Wechat-Pay.vue'
import YajiAuth from './pages/Yaji-Auth.vue'
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
type PageType = 'WechatAuth' | 'WechatPay' | 'YajiAuth'
const statusPages: Map<string[], PageType> = new Map([
    [['MP_NOT_AUTHORIZED', 'OPEN_WECHAT_PAYMENT', 'AUDITING', 'AUTHENTICATE'], 'WechatAuth'],
    [['OPEN_WECHAT_PAYMENT', 'AUDITING', 'AUTHENTICATE'], 'WechatPay'],
    [['AUDITING', 'AUTHENTICATE'], 'YajiAuth']
])

@Component({
    components: {
        WechatAuth,
        WechatPay,
        YajiAuth
    }
})
export default class BindWechat extends Vue {
    page: PageType = 'WechatAuth'

    @userModule.Getter('auditStatus') auditStatus!: string;
    @userModule.Getter('currentStep') currentStep!: number;
    @userModule.Getter('wechatPayStatus') wechatPayStatus!: DynamicObject;

    get applymentState () {
        return this.wechatPayStatus.applymentState
    }

    async created () {
        // 根据注册状态切换到不同的页面
        const { auditStatus } = this
        for (const statusKeys of [...statusPages.keys()].reverse()) {
            if (statusKeys.includes(auditStatus)) {
                this.nav(statusPages.get(statusKeys) as PageType)
                break
            }
        }
    }

    // methods
    nav (page: PageType) {
        const { auditStatus } = this
        for (const statusPage of statusPages) {
            if (statusPage.includes(page) && statusPage[0].includes(auditStatus)) {
                this.page = page
                break
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
