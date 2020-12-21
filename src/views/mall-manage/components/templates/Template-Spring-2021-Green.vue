<template>
    <div :class="$style.templateSpring">
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
                <!-- 直播 -->
                <ModuleWrapper :class="[$style.module, $style.moduleLive]" :data="Live">
                    <Panel custom-class="spring-2021-green-live-panel" title="直播放映室">
                        <Live :data="Live" />
                    </Panel>
                </ModuleWrapper>
                <!-- 抽奖 -->
                <HappyLottery :class="[$style.module, $style.moduleHappyLottery]" :data="currentLottery" v-if="currentLottery && currentLottery.id && ~[1, 2].indexOf(currentLottery.status)" />
                <!-- 签到 -->
                <!-- <NewyearSign :class="[$style.module, $style.moduleNewyearSign]" :data="currentSign" v-if="currentSign && currentSign.id && ~[0, 1].indexOf(currentSign.status)" /> -->
                <!-- 福利红包 -->
                <section
                    id="RedPackage"
                    v-if="data && data.RedPackage && (data.RedPackage.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleRedPackage]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'RedPackage'
                    }"
                    @click="onClick('RedPackage')"
                >
                    <RedPackage :data="RedPackage" />
                </section>
                <!-- 优惠券 -->
                <section
                    id="Coupon"
                    v-if="data && data.Coupon && (data.Coupon.values.length || isClickable || isEmptyShow)"
                    class="spring-2021-green-coupon"
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
                <!-- 秒杀 -->
                <ModuleWrapper
                    id="Miaosha"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleMiaosha]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Miaosha'
                    }"
                    :data="Miaosha"
                    @on-click="onClick('Miaosha')"
                >
                    <Miaosha :data="Miaosha" />
                </ModuleWrapper>
                <!-- 拼团 -->
                <ModuleWrapper
                    id="Pintuan"
                    :class="{
                        [$style.module]: true,
                        [$style.modulePintuan]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Pintuan'
                    }"
                    :data="Pintuan"
                    @on-click="onClick('Pintuan')"
                >
                    <Pintuan :data="Pintuan" />
                </ModuleWrapper>
                <!-- 预购 -->
                <ModuleWrapper
                    id="Yugou"
                    class="spring-2021-green-yugou"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleYugou]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Yugou'
                    }"
                    :data="Yugou"
                    @on-click="onClick('Yugou')"
                >
                    <Yugou :data="Yugou" />
                </ModuleWrapper>
                <!-- 组合课 -->
                <ModuleWrapper
                    id="Package"
                    :class="{
                        [$style.module]: true,
                        [$style.modulePackage]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Package'
                    }"
                    :data="Package"
                    @on-click="onClick('Package')"
                >
                    <Package :data="Package" />
                </ModuleWrapper>
                <!-- 精品推荐 -->
                <ModuleWrapper
                    id="Popular"
                    :class="{
                        [$style.module]: true,
                        [$style.modulePopular]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Popular'
                    }"
                    :data="Popular"
                    @on-click="onClick('Popular')"
                >
                    <Popular :data="Popular" />
                </ModuleWrapper>
                <!-- 版权信息 -->
                <div :class="$style.moduleCopyright">
                    — 技术支持 朋来科技 —
                </div>
            </div>
        </div>
        <img
            src="https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/tabbar.png"
            style="width: 100%;"
        >
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Live from '../activity/spring-2021/Live.vue'
import RedPackage from '../activity/spring-2021/Red-Package.vue'
import Coupon from '../activity/double-12-2020/Coupon.vue'
import Miaosha from '../activity/spring-2021/Miaosha.vue'
import Pintuan from '../activity/spring-2021/Pintuan.vue'
import Yugou from '../activity/spring-2021/Yugou.vue'
import Package from '../activity/spring-2021/Package.vue'
import Popular from '../activity/spring-2021/Popular.vue'
import HappyLottery from '../activity/spring-2021/Happy-Lottery.vue'
// import NewyearSign from '../activity/spring-2021/Newyear-Sign.vue'
import Panel from '../activity/double-12-2020/Panel.vue'
import ModuleWrapper from '../Module-Wrapper.vue'
import { TemplateSpring2021 as TemplateSpring } from '../../utils/types'

const mall = namespace('mall')

@Component({
    components: {
        Live,
        RedPackage,
        Coupon,
        Miaosha,
        Pintuan,
        Yugou,
        Package,
        Popular,
        HappyLottery,
        // NewyearSign,
        Panel,
        ModuleWrapper
    }
})
export default class TemplateSpring2021Green extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateSpring

    @Prop(Number) tmplType!: number
    @Prop({
        type: Boolean,
        default: true
    }) readonly isClickable!: boolean

    @Prop(Boolean) isEmptyShow!: boolean
    @Prop(Boolean) isPreview!: boolean
    @Prop(String) current!: string

    /* computed */
    @mall.Getter currentLottery!: object
    @mall.Getter currentSign!: object

    get Live () {
        return this.data.Live || { values: [] }
    }

    get RedPackage () {
        return this.data.RedPackage || { values: [] }
    }

    get Coupon () {
        return this.data.Coupon || { values: [] }
    }

    get Miaosha () {
        return this.data.Miaosha || { values: [] }
    }

    get Pintuan () {
        return this.data.Pintuan || { values: [] }
    }

    get Yugou () {
        return this.data.Yugou || { values: [] }
    }

    get Package () {
        return this.data.Package || { values: [] }
    }

    get Popular () {
        return this.data.Popular || { values: [] }
    }

    /* methods */
    onClick (name: string) {
        if (!this.isClickable) return
        this.$emit('select', name)
    }
}
</script>

<style lang="scss">
.spring-2021-green-live-panel {
    background-color: #FFC70C;
    border-radius: 8px;
    > .double-12-panel-title {
        padding-top: 10px;
        height: auto;
        background: transparent;
        &::before {
            position: absolute;
            left: 36px;
            bottom: 10px;
            display: block;
            content: '';
            width: 22px;
            height: 6px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/diandian.png') no-repeat center;
            background-size: 100%;
            transform: rotateY(180deg);
        }
        &::after {
            position: absolute;
            right: 36px;
            bottom: 10px;
            display: block;
            content: '';
            width: 22px;
            height: 6px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/diandian.png') no-repeat center;
            background-size: 100%;
        }
        > span {
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #7A1417;
        }
    }
    > .double-12-panel-container {
        padding-top: 0px;
        > .live-list {
            .first {
                border: none;
            }
            .others {
                border-color: #ffffff;
                > label {
                    border: none;
                }
            }
        }
    }
    .double-12-panel-button {
        border: 1px solid #7A1417;
        color: #7A1417;
    }
}
.spring-2021-green-coupon {
    > .coupon-wrapper {
        &::before {
            background-color: #05A19A;
        }
        &::after {
            background-color: #05A19A;
        }
        > .coupon-title {
            background: none;
        }
    }
}
.spring-2021-green-yugou {
    .img-wrapper::before {
        display: none;
    }
}
</style>

<style lang="scss" module>
.template-spring {
    display: flex;
    flex-direction: column;
    width: 375px;
    min-height: 667px;
    background-color: #05A19A;
    box-shadow: 0 0 6px #d4d4d4;
}

.background {
    background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/bg.png) no-repeat center top;
    background-size: 100% auto;
    flex: 1;
}

.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 247px 0 0;
}

.module {
    position: relative;
    border: 2px solid transparent;
    &.active {
        border: 2px solid #FEECC7;
    }
    &:nth-child(1) {
        padding-top: 0px !important;
    }
}

.module-live {
    padding: 0 12px;
}
.module-coupon {
    padding: 10px 12px;
}
.module-miaosha,
.module-pintuan,
.module-package,
.module-popular {
    padding: 10px 0 0;
}
.module-yugou {
    padding: 10px 0 20px;
}
.module-happy-lottery,
.module-newyear-sign {
    padding: 10px 0 10px;
}

.module-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    color: #FEECC7;
    font-size: 13px;
    font-weight: 600;
}

.pointer {
    cursor: pointer;
}

</style>
