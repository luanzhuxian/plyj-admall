<template>
    <div :class="$style.imageText">
        <div :class="$style.imageTextHead">
            <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/file-red.png">
            <b>{{ data.moduleName }}</b>
            <div :class="$style.imageTextHeadMore">
                查看全部
                <i class="el-icon-arrow-right" />
            </div>
        </div>
        <div :class="$style.imageTextHeadSub" v-if="data.otherValue > 0">
            {{ `${data.otherValue}个图文资料，等你来学习` }}
        </div>
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <li v-if="item.goodsInfo" :key="index">
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.graphicMainImg + '?x-oss-process=style/thum-small'">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.top" v-text="item.goodsInfo.graphicName" />
                        <div :class="$style.middle" v-if="item.goodsInfo.author">
                            {{ `作者：${item.goodsInfo.author}` }}
                        </div>
                        <div :class="$style.bottom">
                            <span
                                :class="{
                                    [$style.bottomPrice]: true,
                                    [$style.money]: !!item.goodsInfo.sellingPrice
                                }"
                                v-text="item.goodsInfo.sellingPrice || '免费'"
                            />
                            <del
                                :class="{
                                    [$style.bottomOrigin]: true,
                                    [$style.money]: !!item.goodsInfo.originalPrice
                                }"
                                v-text="item.goodsInfo.originalPrice"
                                v-if="item.goodsInfo.originalPrice"
                            />
                            <div :class="$style.bottomBtn">
                                {{ getBtnText(item.goodsInfo) }}
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.list" v-else>
            <li :class="$style.long">
                <div :class="$style.imgWrapper">
                    <img :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/default.png' + '?x-oss-process=style/thum-middle'">
                </div>
                <div :class="$style.info">
                    <div :class="$style.top">
                        舞蹈考级教程说明
                    </div>
                    <div :class="$style.middle">
                        作者：王老师
                    </div>
                    <div :class="$style.bottom">
                        <span :class="[$style.bottomPrice, $style.money]">299</span>
                        <del :class="[$style.bottomOrigin, $style.money]">1000</del>
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
export default class ImageText extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

     /* methods */
     getBtnText = getBtnText
}
</script>

<style module lang="scss">
.image-text {
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
}
.image-text-head {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    > img {
        width: 18px;
        height: 18px;
        object-fit: cover;
    }
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
        margin-top: 10px;
        width: 100%;
        height: 94px;
        overflow: hidden;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        .img-wrapper {
            position: relative;
            width: 140px;
            height: 94px;
            border-radius: 10px;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 4px 0 4px 10px;
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
            margin-top: 3px;
            font-size: 12px;
            color: #666;
            @include elps();
            &:nth-of-type(1) {
                margin-top: 5px;
            }
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
    }
}

</style>
