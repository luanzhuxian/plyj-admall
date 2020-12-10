<template>
    <div :class="$style.singleCourseWrapper">
        <div :class="$style.singleCourseHead">
            <PlSvg name="icon-play-btn-green-1dc86" width="18" height="20" />
            <b>{{ data.moduleName }}</b>
            <div :class="$style.singleCourseHeadMore">
                查看全部
                <i class="el-icon-arrow-right" />
            </div>
        </div>
        <div :class="$style.singleCourseHeadSub" v-if="data.otherValue > 0">
            {{ `${data.otherValue}个精选单课，等你来学习` }}
        </div>
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(course, index) of data.values">
                <li
                    v-if="course.goodsInfo"
                    :class="{
                        [$style.long]: isOdd && index === 0,
                        [$style.marginT0]: (index === 0) || (!isOdd && index === 1)
                    }"
                    :key="index"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="course.goodsInfo.courseImg + '?x-oss-process=style/thum-small'">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.top" v-text="course.goodsInfo.courseName" />
                        <div :class="$style.middle" v-if="course.goodsInfo.lecturer">
                            {{ `主讲人：${course.goodsInfo.lecturer}` }}
                        </div>
                        <div :class="$style.bottom">
                            <span
                                :class="{
                                    [$style.bottomPrice]: true,
                                    [$style.money]: !!course.goodsInfo.sellingPrice
                                }"
                                v-text="course.goodsInfo.sellingPrice || '免费'"
                            />
                            <del
                                :class="{
                                    [$style.bottomOrigin]: true,
                                    [$style.money]: !!course.goodsInfo.originalPrice
                                }"
                                v-text="course.goodsInfo.originalPrice"
                                v-if="course.goodsInfo.originalPrice"
                            />
                            <div :class="$style.bottomBtn">
                                {{ getBtnText(course.goodsInfo) }}
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.list" v-else>
            <li :class="[$style.long, $style.marginT0]">
                <div :class="$style.imgWrapper">
                    <img :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/default.png' + '?x-oss-process=style/thum-middle'">
                </div>
                <div :class="$style.info">
                    <div :class="$style.top">
                        少儿英语三节名师英语体验
                    </div>
                    <div :class="$style.middle">
                        主讲人：王老师
                    </div>
                    <div :class="$style.bottom">
                        <span :class="[$style.bottomPrice, $style.money]">7500</span>
                        <del :class="[$style.bottomOrigin, $style.money]">9800</del>
                        <div :class="$style.bottomBtn">
                            立即订购
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'
import { getBtnText } from '../../utils/helper'

@Component
export default class SingleCourse extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* computed */
    get isOdd () {
        return !!(this.data.values.length % 2)
    }

    /* methods */
    getBtnText = getBtnText
}
</script>

<style module lang="scss">
.single-course-wrapper {
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
}
.single-course-head {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    > b {
        margin-left: 8px;
        font-size: 16px;
        color: #333;
    }
    &-sub {
        font-size: 11px;
        line-height: 16px;
        color: #1592e6;
    }
    &-more {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 12px;
        color: #999;
    }
}
.list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 16px;
    > li {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        width: 160px;
        height: 185px;
        overflow: hidden;
        .img-wrapper {
            position: relative;
            width: 100%;
            height: 107px;
            border-radius: 10px 10px 0 0;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 7px 0 5px;
        }
        .top {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 18px;
            color: #000;
            text-align: justify;
            @include elps();
        }
        .middle {
            margin-top: 1px;
            font-size: 10px;
            color: #666;
            @include elps();
        }
        .bottom {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-price {
                font-size: 16px;
                font-weight: bold;
                color: #fe7700;
                @include elps();
                &.money::before {
                    content: '￥';
                    font-size: 10px;
                }
            }
            &-origin {
                margin-left: 3px;
                font-size: 10px;
                color: #999;
                @include elps();
                &.money::before {
                    content: '￥';
                }
            }
            &-btn {
                flex-shrink: 0;
                margin-left: auto;
                width: 62px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                background-color: #fe7700;
                border-radius: 4px;
                font-size: 13px;
                color: #fff;
            }
        }
        &.long {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 94px;
            .img-wrapper {
                width: 140px;
                height: 94px;
                border-radius: 10px;
            }
            .info {
                padding: 4px 0 4px 10px;
                width: 0;
            }
            .middle {
                margin-top: 6px;
                font-size: 12px;
            }
        }
        &.margin-t-0 {
            margin-top: 0;
        }
    }
}

</style>
