<template>
    <div :class="$style.templateDragonGate">
        <img
            src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/bars.png"
            style="width: 100%; height: 20px;"
        >
        <img
            src="https://mallcdn.youpenglai.com/static/admall/mall-management/a47ad2c0-5839-4d45-bab6-3ee455e0945c.png"
            style="width: 100%; height: 38px;"
        >
        <div :class="$style.background">
            <div :class="$style.container">
                <!-- 优惠券 -->
                <section
                    ref="Coupon"
                    v-if="data && data.Coupon && (data.Coupon.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleCoupon]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Coupon'
                    }"
                    @click="onClick('Coupon')"
                >
                    <Coupon :data="Coupon" />
                </section>
                <!-- 直播 -->
                <section :class="$style.moduleLive" v-if="isLiveShow">
                    <Live :data="liveInfo" />
                </section>
                <!-- 公益 -->
                <ModuleWrapper
                    v-if="Charity.values && Charity.values.length"
                    ref="Charity"
                    :class="$style.moduleCharity"
                    :data="Charity"
                >
                    <Charity :data="Charity" />
                </ModuleWrapper>
                <!-- 活动-->
                <ModuleWrapper
                    v-if="Activity.values && Activity.values.length && (Activity.values[0].haveSigninActivity || Activity.values[0].haveLuckDrawActivity)"
                    ref="Activity"
                    :class="$style.moduleActivity"
                    :data="Activity"
                >
                    <Activity :data="Activity" />
                </ModuleWrapper>
                <!-- 秒杀 -->
                <ModuleWrapper
                    ref="Miaosha"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleMiaosha]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Miaosha'
                    }"
                    :data="Miaosha"
                    name="Miaosha"
                    @on-click="onClick"
                >
                    <Miaosha :data="Miaosha" />
                </ModuleWrapper>
                <!-- 分销 -->
                <ModuleWrapper
                    ref="Distribution"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleDistribution]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Distribution'
                    }"
                    :data="Distribution"
                    name="Distribution"
                    @on-click="onClick"
                >
                    <Distribution :data="Distribution" />
                </ModuleWrapper>
                <!-- 拼团 -->
                <ModuleWrapper
                    ref="Pintuan"
                    :class="{
                        [$style.module]: true,
                        [$style.modulePintuan]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Pintuan'
                    }"
                    :data="Pintuan"
                    name="Pintuan"
                    @on-click="onClick"
                >
                    <Pintuan :data="Pintuan" />
                </ModuleWrapper>
                <!-- 预购 -->
                <ModuleWrapper
                    ref="Yugou"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleYugou]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Yugou'
                    }"
                    :data="Yugou"
                    name="Yugou"
                    @on-click="onClick"
                >
                    <Yugou :data="Yugou" />
                </ModuleWrapper>
                <!-- 组合课 -->
                <ModuleWrapper
                    ref="Package"
                    :class="{
                        [$style.module]: true,
                        [$style.modulePackage]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Package'
                    }"
                    :data="Package"
                    name="Package"
                    @on-click="onClick"
                >
                    <Package :data="Package" />
                </ModuleWrapper>
                <!-- 精品推荐 -->
                <section
                    ref="Recommend"
                    v-if="data && data.Recommend && (data.Recommend.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleRecommend]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Recommend'
                    }"
                    @click="onClick('Recommend')"
                >
                    <Panel :custom-class="$style.panel" :title="panelTitle" hide-button>
                        <Recommend :data="Recommend" btn-color="#FF341B" border="2px solid #222222" />
                    </Panel>
                </section>
                <!-- 版权信息 -->
                <footer :class="$style.moduleCopyright">
                    — 技术支持 朋来科技 —
                </footer>
            </div>
        </div>
        <img
            src="https://mallcdn.youpenglai.com/static/admall/mall-management/tabbar-dragon-gate.png"
            style="width: 100%;"
        >
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Live from '../activity/dragon-gate/Live.vue'
import Coupon from '../activity/dragon-gate/Coupon.vue'
import Charity from '../activity/dragon-gate/Charity.vue'
import Activity from '../activity/dragon-gate/Activity.vue'
import Miaosha from '../activity/dragon-gate/Miaosha.vue'
import Distribution from '../activity/dragon-gate/Distribution.vue'
import Pintuan from '../activity/dragon-gate/Pintuan.vue'
import Yugou from '../activity/dragon-gate/Yugou.vue'
import Package from '../activity/dragon-gate/Package.vue'
import Recommend from '../home/Recommend.vue'
import Panel from '../activity/dragon-gate/Panel.vue'
import ModuleWrapper from '../Module-Wrapper.vue'
import { TemplateDragonGate as TemplateDragonGateType } from '../../utils/types'

const mall = namespace('mall')

@Component({
    components: {
        Live,
        Coupon,
        Charity,
        Activity,
        Miaosha,
        Distribution,
        Pintuan,
        Yugou,
        Package,
        Recommend,
        Panel,
        ModuleWrapper
    }
})
export default class TemplateDragonGate extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateDragonGateType

    @Prop(Number) tmplId!: number
    @Prop({
        type: Boolean,
        default: true
    }) readonly isClickable!: boolean

    @Prop(Boolean) isEmptyShow!: boolean
    @Prop(Boolean) isPreview!: boolean
    @Prop(String) current!: string

    /* data */
    panelTitle = Object.freeze({
        name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/jptj.png',
        width: 163,
        height: 27
    })

    /* computed */
    @mall.Getter liveInfo!: { liveModel: { statue: number; hasNotice: boolean }[] }
    @mall.Getter hasNwEvent!: boolean

    get Coupon () {
        return this.data.Coupon || {}
    }

    get Charity () {
        return this.data.Charity || {}
    }

    get Activity () {
        return this.data.Activity || {}
    }

    get Miaosha () {
        return this.data.Miaosha || {}
    }

    get Distribution () {
        return this.data.Distribution || {}
    }

    get Pintuan () {
        return this.data.Pintuan || {}
    }

    get Yugou () {
        return this.data.Yugou || {}
    }

    get Package () {
        return this.data.Package || {}
    }

    get Recommend () {
        return this.data.Recommend || {}
    }

    get isLiveShow () {
        const { liveInfo } = this
        if (!liveInfo.liveModel || !liveInfo.liveModel.length) {
            return false
        }
        const list = liveInfo.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
        return !!list.length
    }

    /* methods */
    onClick (name: string) {
        if (!this.isClickable) return
        this.$emit('select', name)
    }
}
</script>

<style scoped lang="scss">
.template-dragon-gate {
    display: flex;
    flex-direction: column;
    width: 375px;
    min-height: 667px;
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/main-bg.png') repeat center;
    background-size: 100%;
    box-shadow: 0 0 6px #d4d4d4;
}
.background {
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/main-top.png') no-repeat center top;
    background-size: 100% auto;
    flex: 1;
}
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 260px 0 0;
}

.module {
    position: relative;
    border: 2px solid transparent;
    &.active {
        border: 2px solid #fff;
    }
    &:nth-child(1) {
        padding-top: 0 !important;
    }
}

.btn-top {
    position: relative;
    box-sizing: border-box;
    margin: 0 auto 8px;
    padding: 6px;
    width: 329px;
    height: 50px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 8px 12px rgba(121, 30, 5, .2);
    &-bg {
        background: linear-gradient(180deg, rgba(255, 193, 74, 1) 0%, rgba(255, 113, 56, 1) 100%);
        border-radius: 5px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 38px;
        color: #fff;
        letter-spacing: 2px;
        text-align: center;
    }
    > svg {
        position: absolute;
        top: 28px;
        right: -25px;
        transform: translateY(-50%);
    }
}

.module-coupon {
    padding-bottom: 20px;
}
.module-live,
.module-charity,
.module-activity,
.module-miaosha,
.module-distribution,
.module-pintuan,
.module-yugou,
.module-package,
.module-recomend {
    padding: 20px 12px;
}

.module-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
}
.panel {
    padding-top: 32px;
}

</style>
