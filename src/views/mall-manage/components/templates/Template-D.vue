<template>
    <div :class="[$style.templateD, $style[skinClassNameMap[skinId]]]">
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/bars.png" style="width: 100%;">
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/header.png" style="width: 100%;">
        <div :class="$style.container">
            <!-- 搜索栏 -->
            <div :class="$style.moduleSearch">
                <el-input prefix-icon="el-icon-search" placeholder="搜索商品" />
            </div>
            <!-- BANNER -->
            <div
                ref="Banner"
                v-if="data && data.Banner && (data.Banner.values.length || isClickable || isEmptyShow)"
                :class="{
                    [$style.module]: true,
                    [$style.moduleBanner]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Banner'
                }"
                @click="onClick('Banner')"
            >
                <div :class="$style.wrapper">
                    <Banner :data="Banner" :tmpl-type="tmplType" />
                </div>
            </div>
            <!-- 优惠券 -->
            <div
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
            </div>
            <!-- 活动 -->
            <ModuleWrapper
                ref="Activity"
                :class="{
                    [$style.module]: true,
                    [$style.moduleActivity]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Activity'
                }"
                :data="Activity"
                name="Activity"
                size="small"
                @on-click="onClick"
            >
                <Activity :data="Activity" />
            </ModuleWrapper>
            <!-- 直播 -->
            <ModuleWrapper
                ref="Live"
                :class="{
                    [$style.module]: true,
                    [$style.moduleLive]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Live'
                }"
                :data="Live"
                name="Live"
                @on-click="onClick"
            >
                <Live :data="Live" />
            </ModuleWrapper>
            <!-- 单课 -->
            <ModuleWrapper
                ref="OnlineCourse"
                :class="{
                    [$style.module]: true,
                    [$style.moduleOnlineCourse]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'OnlineCourse'
                }"
                :data="OnlineCourse"
                name="OnlineCourse"
                @on-click="onClick"
            >
                <OnlineCourse :data="OnlineCourse" />
            </ModuleWrapper>
            <!-- 系列课 -->
            <ModuleWrapper
                ref="SeriesCourse"
                :class="{
                    [$style.module]: true,
                    [$style.moduleSeriesCourse]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'SeriesCourse'
                }"
                :data="SeriesCourse"
                name="SeriesCourse"
                @on-click="onClick"
            >
                <SeriesCourse :data="SeriesCourse" />
            </ModuleWrapper>
            <!-- 图文资料 -->
            <ModuleWrapper
                ref="ImageText"
                :class="{
                    [$style.module]: true,
                    [$style.moduleImageText]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'ImageText'
                }"
                :data="ImageText"
                name="ImageText"
                @on-click="onClick"
            >
                <ImageText :data="ImageText" />
            </ModuleWrapper>
            <!-- 预约 -->
            <ModuleWrapper
                ref="Appointment"
                :class="{
                    [$style.module]: true,
                    [$style.moduleAppointment]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Appointment'
                }"
                :data="Appointment"
                name="Appointment"
                size="small"
                @on-click="onClick"
            >
                <Appointment :data="Appointment" :slides-per-view="2" />
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
                <template>
                    <SkinTitle
                        v-if="isSkinShow"
                        :class="$style.skinTitle"
                        :data="Miaosha.moduleName"
                        :skin-id="skinId"
                    />
                    <h3 :class="$style.title" v-else-if="skinId !== null">
                        {{ Miaosha.moduleName }}
                    </h3>
                    <Miaosha :data="Miaosha" />
                </template>
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
                <template>
                    <SkinTitle
                        v-if="isSkinShow"
                        :class="$style.skinTitle"
                        :data="Package.moduleName"
                        :skin-id="skinId"
                    />
                    <h3 :class="$style.title" v-else-if="skinId !== null">
                        {{ Package.moduleName }}
                    </h3>
                    <Package :data="Package" />
                </template>
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
                <template>
                    <SkinTitle
                        v-if="isSkinShow"
                        :class="$style.skinTitle"
                        :data="Pintuan.moduleName"
                        :skin-id="skinId"
                    />
                    <h3 :class="$style.title" v-else-if="skinId !== null">
                        {{ Pintuan.moduleName }}
                    </h3>
                    <Pintuan :data="Pintuan" />
                </template>
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
                <template>
                    <SkinTitle
                        v-if="isSkinShow"
                        :class="$style.skinTitle"
                        :data="Yugou.moduleName"
                        :skin-id="skinId"
                    />
                    <h3 :class="$style.title" v-else-if="skinId !== null">
                        {{ Yugou.moduleName }}
                    </h3>
                    <Yugou :data="Yugou" />
                </template>
            </ModuleWrapper>
            <!-- 品牌宣传 -->
            <ModuleWrapper
                ref="Propagate"
                :class="{
                    [$style.module]: true,
                    [$style.modulePropagate]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Propagate'
                }"
                :data="Propagate"
                name="Propagate"
                size="small"
                @on-click="onClick"
            >
                <Propagate :data="Propagate" />
            </ModuleWrapper>
            <!-- 热销单品-->
            <ModuleWrapper
                ref="Popular"
                :class="{
                    [$style.module]: true,
                    [$style.modulePopular]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Popular'
                }"
                :data="Popular"
                name="Popular"
                @on-click="onClick"
            >
                <template>
                    <SkinTitle
                        v-if="isSkinShow"
                        :class="$style.skinTitle"
                        :data="Popular.moduleName"
                        :skin-id="skinId"
                    />
                    <h3 :class="$style.title" v-else-if="skinId !== null">
                        {{ Popular.moduleName }}
                    </h3>
                    <Popular :data="Popular" />
                </template>
            </ModuleWrapper>
            <!-- 精品课程 -->
            <ModuleWrapper
                ref="Class"
                :class="{
                    [$style.module]: true,
                    [$style.moduleClass]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Class'
                }"
                :data="Class"
                name="Class"
                @on-click="onClick"
            >
                <template>
                    <SkinTitle
                        v-if="isSkinShow"
                        :class="$style.skinTitle"
                        :data="Class.moduleName"
                        :skin-id="skinId"
                    />
                    <h3 :class="$style.title" v-else-if="skinId !== null">
                        {{ Class.moduleName }}
                    </h3>
                    <Class :data="Class" />
                </template>
            </ModuleWrapper>
            <!-- 精品推荐 -->
            <div
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
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Recommend.moduleName"
                    :skin-id="skinId"
                />
                <div :class="$style.title" v-else-if="skinId !== null">
                    — {{ Recommend.moduleName }} —
                </div>
                <Recommend :data="Recommend" />
            </div>
            <!-- 版权信息 -->
            <footer :class="$style.moduleCopyright">
                — 技术支持 朋来科技 —
            </footer>
        </div>
        <!-- 底部tabbar -->
        <img :src="navBarMap.get(skinId)" style="width: 100%;">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Live from '../home/Live.vue'
import OnlineCourse from '../home/Online-Course.vue'
import SeriesCourse from '../home/Series-Course.vue'
import ImageText from '../home/Image-Text.vue'
import Banner from '../home/Banner.vue'
import Appointment from '../home/Appointment.vue'
import Propagate from '../home/Propagate-Small.vue'
import Coupon from '../home/activity/Coupon.vue'
import Miaosha from '../home/activity/Miaosha.vue'
import Pintuan from '../home/activity/Pintuan.vue'
import Yugou from '../home/activity/Yugou.vue'
import Activity from '../home/activity/Activity.vue'
import Package from '../home/activity/Package.vue'
import Popular from '../home/Popular.vue'
import Class from '../home/Class.vue'
import Recommend from '../home/Recommend.vue'
import ModuleWrapper from '../Module-Wrapper.vue'
import SkinTitle from '../skin/Skin-Title.vue'
import { skinClassNameMap, navBarMap } from '../../utils/map'
import { TemplateD as TemplateDType } from '../../utils/types'

@Component({
    components: {
        Live,
        OnlineCourse,
        SeriesCourse,
        ImageText,
        Banner,
        Appointment,
        Propagate,
        Coupon,
        Miaosha,
        Pintuan,
        Yugou,
        Activity,
        Package,
        Popular,
        Class,
        Recommend,
        ModuleWrapper,
        SkinTitle
    }
})
export default class TemplateD extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateDType

    @Prop(Number) tmplType!: number
    @Prop(Number) skinId!: number
    @Prop({
        type: Boolean,
        default: true
    }) readonly isClickable!: boolean

    @Prop(Boolean) isEmptyShow!: boolean
    @Prop(Boolean) isPreview!: boolean
    @Prop(String) current!: string

    /* data */
    skinClassNameMap = Object.freeze(skinClassNameMap)
    navBarMap = Object.freeze(navBarMap)

    /* computed */
    get Banner () {
        return this.data.Banner || {}
    }

    get Coupon () {
        return this.data.Coupon || {}
    }

    get Activity () {
        return this.data.Activity || {}
    }

    get Live () {
        return this.data.Live || {}
    }

    get OnlineCourse () {
        return this.data.OnlineCourse || {}
    }

    get SeriesCourse () {
        return this.data.SeriesCourse || {}
    }

    get ImageText () {
        return this.data.ImageText || {}
    }

    get Appointment () {
        return this.data.Appointment || {}
    }

    get Propagate () {
        return this.data.Propagate || {}
    }

    get Miaosha () {
        return this.data.Miaosha || {}
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

    get Popular () {
        return this.data.Popular || {}
    }

    get Class () {
        return this.data.Class || {}
    }

    get Recommend () {
        return this.data.Recommend || {}
    }

    get isSkinShow () {
        return skinClassNameMap.has(this.skinId)
    }

    /* methods */
    onClick (name: string) {
        if (!this.isClickable) return
        this.$emit('select', name)
    }
}
</script>

<style module lang="scss">
@import '../skin/common.scss';

.template-d {
    display: flex;
    flex-direction: column;
    width: 375px;
    min-height: 667px;
    background-color: #f4f5f9;
    box-shadow: 0 0 6px #d4d4d4;
}
.container {
    position: relative;
    background: #f4f5f9;
    flex: 1;
}
.module {
    position: relative;
    border: 2px solid transparent;
    &.active {
        border: 2px solid #f2b036;
    }
    .title {
        display: flex;
        align-items: center;
        color: #333;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        margin-bottom: 10px;
        &::before {
            display: inline-block;
            content: '';
            width: 3px;
            height: 19px;
            background: #fe7700;
            margin-right: 7px;
        }
    }
}

.module-search {
    position: relative;
    display: flex;
    justify-content: center;
    padding-top: 6px;
    width: 100%;
    height: 44px;
    background-color: #ededed;
    > div {
        width: 350px;
        > input {
            border: none;
            border-radius: 20px;
            &::placeholder {
                color: #bcbcbc;
                font-size: 14px;
                font-weight: bolder;
                text-align: center;
            }
        }
        > span > i {
            position: relative;
            left: 124px;
            height: 30px;
            font-size: 14px;
            font-weight: bolder;
        }
    }
}

.module-banner {
    background: #ededed;
    .wrapper {
        padding: 12px;
        background: #fff;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
    }
}

.module-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    color: #999;
    font-size: 13px;
    font-weight: 600;
}

.module-package,
.module-miaosha,
.module-pintuan,
.module-yugou,
.module-popular,
.module-class,
.module-recommend {
    padding: 10px 12px;
}

.module-activity,
.module-coupon,
.module-live,
.module-online-course,
.module-series-course,
.module-image-text,
.module-appointment,
.module-propagate {
    padding: 5px 12px;
}

</style>
