<template>
    <div :class="[$style.templateC, $style[skinClassNameMap[skinId]]]">
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/bars.png" style="width: 100%;">
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/header.png" style="width: 100%;">
        <div :class="$style.container">
            <!-- 搜索栏 -->
            <div class="module-search" :class="$style.moduleSearch">
                <el-input prefix-icon="el-icon-search" placeholder="搜索商品" />
            </div>
            <!-- 品牌宣传 -->
            <div
                ref="Propagate"
                v-if="data && data.Propagate && (data.Propagate.values.length || isClickable || isEmptyShow)"
                :class="{
                    [$style.module]: true,
                    [$style.modulePropagate]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Propagate'
                }"
                @click="onClick('Propagate')"
            >
                <Propagate :data="Propagate" />
            </div>
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
                <Appointment :data="Appointment" :style-type="2" />
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
            <!-- 名师专栏 -->
            <ModuleWrapper
                ref="Teachers"
                :class="{
                    [$style.module]: true,
                    [$style.moduleTeachers]: true,
                    [$style.pointer]: isClickable === true,
                    [$style.active]: current === 'Teachers'
                }"
                :data="Teachers"
                name="Teachers"
                @on-click="onClick"
            >
                <template>
                    <skin-title
                        v-if="isSkinShow"
                        :class="$style.skinTitle"
                        :data="Teachers.moduleName"
                        :skin-id="skinId"
                    />
                    <h3 :class="$style.title" v-else-if="skinId !== null">
                        {{ Teachers.moduleName }}
                    </h3>
                    <Teachers :data="Teachers" />
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import Live from '../home/Live.vue'
import OnlineCourse from '../home/Online-Course.vue'
import SeriesCourse from '../home/Series-Course.vue'
import ImageText from '../home/Image-Text.vue'
import Popular from '../home/Popular.vue'
import Class from '../home/Class.vue'
import Recommend from '../home/Recommend.vue'
import Appointment from '../home/Appointment.vue'
import Propagate from '../home/Propagate.vue'
import Teachers from '../home/Teachers.vue'
import ModuleWrapper from '../Module-Wrapper.vue'
import SkinTitle from '../skin/Skin-Title.vue'
import { skinClassNameMap, navBarMap } from '../../utils/map'
import { TemplateC as TemplateCType } from '../../utils/types'

@Component({
    components: {
        Live,
        OnlineCourse,
        SeriesCourse,
        ImageText,
        Popular,
        Class,
        Recommend,
        Appointment,
        Propagate,
        Teachers,
        ModuleWrapper,
        SkinTitle
    }
})
export default class TemplateHome extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateCType

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

    get Teachers () {
        return this.data.Teachers || {}
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

.template-c {
    display: flex;
    flex-direction: column;
    width: 375px;
    min-height: 667px;
    background-color: #ededed;
    box-shadow: 0 0 6px #d4d4d4;
}

.container {
    position: relative;
    flex: 1;
}

.active {
    border: 2px solid #f2b036 !important;
}

.module {
    position: relative;
    border: 2px solid transparent;
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

.module-popular {
    .title {
        &::after {
            content: 'HOT';
            position: absolute;
            top: 6px;
            left: 95px;
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

.module-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    color: #999;
    font-size: 13px;
    font-weight: 600;
}

.module-popular,
.module-teachers,
.module-class,
.module-recommend {
    padding: 10px 10px;
}

.module-live,
.module-online-course,
.module-series-course,
.module-image-text,
.module-appointment,
.module-propagate {
    padding: 5px 10px;
}

.pointer {
    cursor: pointer;
}

</style>
