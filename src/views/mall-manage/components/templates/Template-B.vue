<template>
    <div class="template-b" :class="[$style.templateB, $style[skinClassNameMap[skinId]]]">
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/bars.png" style="width: 100%;">
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/header.png" style="width: 100%;">
        <div :class="$style.container">
            <!-- 搜索栏 -->
            <div class="module-search" :class="$style.moduleSearch">
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
                    <Banner :data="Banner" :tmpl-id="tmplId" />
                </div>
            </div>
            <!-- 广告 -->
            <ModuleWrapper
                ref="Adv"
                v-if="tmplId === 4"
                :class="{
                    [$style.module]: true,
                    [$style.moduleAdv]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Adv'
                }"
                :data="Adv"
                name="Adv"
                size="small"
                @on-click="onClick"
            >
                <Adv :data="Adv" />
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
            <!-- 热销单品 -->
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
import Adv from '../home/Adv.vue'
import Popular from '../home/Popular.vue'
import Class from '../home/Class.vue'
import Recommend from '../home/Recommend.vue'
import Appointment from '../home/Appointment.vue'
import Propagate from '../home/Propagate-Small.vue'
import ModuleWrapper from '../Module-Wrapper.vue'
import SkinTitle from '../skin/Skin-Title.vue'
import { skinClassNameMap, navBarMap } from '../../utils/map'
import { TemplateB as TemplateBType } from '../../utils/types'

@Component({
    components: {
        Live,
        OnlineCourse,
        SeriesCourse,
        ImageText,
        Banner,
        Adv,
        Popular,
        Class,
        Recommend,
        Appointment,
        Propagate,
        ModuleWrapper,
        SkinTitle
    }
})
export default class TemplateB extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateBType

    @Prop(Number) tmplId!: number
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

    get Adv () {
        return this.data.Adv || {}
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

    get Popular () {
        return this.data.Popular || {}
    }

    get Class () {
        return this.data.Class || {}
    }

    get Appointment () {
        return this.data.Appointment || {}
    }

    get Propagate () {
        return this.data.Propagate || {}
    }

    get Recommend () {
        return this.data.Recommend || {}
    }

    get isSkinShow () {
        return skinClassNameMap.has(this.skinId)
    }

    /* methods */
    onClick (name: string) {
        if (!this.isClickable) return false
        this.$emit('select', name)
    }
}
</script>

<style lang="scss">
.template-b {
    .module-search {
        position: relative;
        display: flex;
        justify-content: center;
        padding-top: 6px;
        width: 100%;
        height: 44px;
        background-color: #ededed;
        ::v-deep .el-input {
            width: 350px;
            input {
                border: none;
                border-radius: 20px;
                &::placeholder {
                    color: #bcbcbc;
                    font-size: 14px;
                    font-weight: bolder;
                    text-align: center;
                }
            }
            .el-input__icon {
                position: relative;
                left: 124px;
                height: 30px;
                font-size: 14px;
                font-weight: bolder;
            }
        }
    }
}
</style>
<style module lang="scss">
@import '../skin/common.scss';

.template-b {
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

.module-popular {
    padding: 7px 12px;
    .title {
        position: relative;
        color: #333;
        font-size: 18px;
        margin-bottom: 10px;
        &::after {
            content: 'HOT';
            position: absolute;
            top: 0;
            left: 68px;
            display: inline-flex;
            padding: 0 4px;
            color: #fff;
            font-size: 12px;
            background: linear-gradient(60deg, #fe7700 35%, rgba(255, 255, 255, .5), #fe7700 75%);
            background-size: 200%;
            border-radius: 12px;
            animation: bgc-move 2s ease infinite;
        }
    }
    @keyframes bgc-move {
        0% {
            background-position: 150% 0;
        }
        100% {
            background-position: -50% 0;
        }
    }
}

.module-class {
    padding: 7px 12px;
    .title {
        color: #333;
        font-size: 18px;
        margin-bottom: 10px;
    }
}

.module-recommend {
    padding: 0 12px;
    background: linear-gradient(225deg, rgba(223, 228, 243, 1) 0%, rgba(236, 234, 247, 1) 100%);
    .title {
        padding: 20px 0 17px;
        text-align: center;
        color: #f2b036;
        font-size: 18px;
        font-weight: bolder;
        letter-spacing: 7px;
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
    background-color: #eae9f7;
}

.module-live,
.module-online-course,
.module-series-course,
.module-image-text,
.module-adv,
.module-appointment,
.module-propagate {
    padding: 5px 12px;
}
</style>
