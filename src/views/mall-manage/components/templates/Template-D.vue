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
                id="Banner"
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
            <!-- 分类 -->
            <ModuleWrapper
                id="Classify"
                :class="{
                    [$style.module]: true,
                    [$style.moduleClassify]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Classify'
                }"
                :data="Classify"
                size="small"
                @on-click="onClick('Classify')"
            >
                <Classify :data="Classify" />
            </ModuleWrapper>
            <!-- 福利红包 -->
            <div :class="$style.redPackage" v-if="isRedPackageShow">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/rp-banner.png" alt="">
            </div>
            <!-- 优惠券 -->
            <div
                id="Coupon"
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
                id="Activity"
                :class="{
                    [$style.module]: true,
                    [$style.moduleActivity]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Activity'
                }"
                :data="Activity"
                size="small"
                @on-click="onClick('Activity')"
            >
                <Activity :data="Activity" />
            </ModuleWrapper>
            <!-- 直播 -->
            <ModuleWrapper
                id="Live"
                :class="{
                    [$style.module]: true,
                    [$style.moduleLive]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Live'
                }"
                :data="Live"
                @on-click="onClick('Live')"
            >
                <Live :data="Live" />
            </ModuleWrapper>
            <!-- 单课 -->
            <ModuleWrapper
                id="SingleCourse"
                :class="{
                    [$style.module]: true,
                    [$style.moduleSingleCourse]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'SingleCourse'
                }"
                :data="SingleCourse"
                @on-click="onClick('SingleCourse')"
            >
                <SingleCourse :data="SingleCourse" />
            </ModuleWrapper>
            <!-- 系列课 -->
            <ModuleWrapper
                id="SeriesCourse"
                :class="{
                    [$style.module]: true,
                    [$style.moduleSeriesCourse]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'SeriesCourse'
                }"
                :data="SeriesCourse"
                @on-click="onClick('SeriesCourse')"
            >
                <SeriesCourse :data="SeriesCourse" />
            </ModuleWrapper>
            <!-- 图文资料 -->
            <ModuleWrapper
                id="ImageText"
                :class="{
                    [$style.module]: true,
                    [$style.moduleImageText]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'ImageText'
                }"
                :data="ImageText"
                @on-click="onClick('ImageText')"
            >
                <ImageText :data="ImageText" />
            </ModuleWrapper>
            <!-- 预约 -->
            <ModuleWrapper
                id="Appointment"
                :class="{
                    [$style.module]: true,
                    [$style.moduleAppointment]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Appointment'
                }"
                :data="Appointment"
                size="small"
                @on-click="onClick('Appointment')"
            >
                <Appointment :data="Appointment" :slides-per-view="2" />
            </ModuleWrapper>
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
                id="Yugou"
                :class="{
                    [$style.module]: true,
                    [$style.moduleYugou]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Yugou'
                }"
                :data="Yugou"
                @on-click="onClick('Yugou')"
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
                id="Propagate"
                :class="{
                    [$style.module]: true,
                    [$style.modulePropagate]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Propagate'
                }"
                :data="Propagate"
                size="small"
                @on-click="onClick('Propagate')"
            >
                <Propagate :data="Propagate" />
            </ModuleWrapper>
            <!-- 热销单品-->
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
                id="Class"
                :class="{
                    [$style.module]: true,
                    [$style.moduleClass]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Class'
                }"
                :data="Class"
                @on-click="onClick('Class')"
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
                id="Recommend"
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
                    {{ Recommend.moduleName }}
                </div>
                <Recommend :data="Recommend" />
            </div>
            <!-- 版权信息 -->
            <div :class="$style.moduleCopyright">
                — 技术支持 朋来科技 —
            </div>
        </div>
        <!-- 底部tabbar -->
        <img :src="navBarMap.get(skinId)" style="width: 100%;">
    </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Live from '../home/Live.vue'
import SingleCourse from '../home/Single-Course.vue'
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
import Classify from '../home/Classify.vue'
import Package from '../home/activity/Package.vue'
import Popular from '../home/Popular.vue'
import Class from '../home/Class.vue'
import Recommend from '../home/Recommend.vue'
import ModuleWrapper from '../Module-Wrapper.vue'
import SkinTitle from '../skin/Skin-Title.vue'
import { skinClassNameMap, navBarMap } from '../../utils/map'
import { TemplateD as TemplateDType } from '../../utils/types'
import SkinMixin from '../skin/mixin'

const mall = namespace('mall')

@Component({
    components: {
        Live,
        SingleCourse,
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
        Classify,
        Package,
        Popular,
        Class,
        Recommend,
        ModuleWrapper,
        SkinTitle
    }
})
export default class TemplateD extends mixins(SkinMixin) {
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
    @mall.Getter('isRedPackageShow') isRedPackageShow!: boolean

    get Banner () {
        return this.data.Banner || { values: [] }
    }

    get Classify () {
        return this.data.Classify || { values: [] }
    }

    get Coupon () {
        return this.data.Coupon || { values: [] }
    }

    get Activity () {
        return this.data.Activity || { values: [] }
    }

    get Live () {
        return this.data.Live || { values: [] }
    }

    get SingleCourse () {
        return this.data.SingleCourse || { values: [] }
    }

    get SeriesCourse () {
        return this.data.SeriesCourse || { values: [] }
    }

    get ImageText () {
        return this.data.ImageText || { values: [] }
    }

    get Appointment () {
        return this.data.Appointment || { values: [] }
    }

    get Propagate () {
        return this.data.Propagate || { values: [] }
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

    get Class () {
        return this.data.Class || { values: [] }
    }

    get Recommend () {
        return this.data.Recommend || { values: [] }
    }

    get isSkinShow () {
        return skinClassNameMap.has(this.skinId)
    }

    mounted () {
        if (this.skinId === 23) {
            this.setSkinTitleClassName()
        }
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

.module-classify,
.module-activity,
.module-coupon,
.module-live,
.module-single-course,
.module-series-course,
.module-image-text,
.module-appointment,
.module-propagate {
    padding: 5px 12px;
}

.module-classify {
    margin-top: 5px;
}

.red-package {
    display: block;
    box-sizing: border-box;
    padding: 5px 12px;
    height: 82px;
    text-align: center;
    > img {
        width: 339px;
        height: 72px;
        object-fit: cover;
    }
}

.pointer {
    cursor: pointer;
}

</style>
