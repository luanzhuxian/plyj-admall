<template>
    <div :class="$style.pintuan">
        <div :class="$style.pintuanTop">
            <div :class="$style.pintuanTopSide" />
            <div :class="$style.pintuanTopContent">
                <h3>新春团购大联欢</h3>
                <p v-if="Number(data.otherValue)">
                    {{ `还有${data.otherValue}个团 点击查看>` }}
                </p>
                <p v-else>
                    查看更多>
                </p>
            </div>
        </div>
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.pintuanListItem"
                    :key="i"
                >
                    <div :class="$style.label">
                        众志成团
                    </div>
                    <div :class="$style.ribbon">
                        <span v-if="item.goodsInfo.activityInfo.status === 0">
                            {{ `${item.goodsInfo.pageviews}人关注` }}
                        </span>
                        <span v-else>
                            {{ `${item.goodsInfo.activityInfo.number}人参团` }}
                        </span>
                    </div>
                    <div :class="$style.countdownWrapper" v-if="item.goodsInfo.activityInfo.preActivity && item.goodsInfo.activityInfo.preActivity !== 0">
                        <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
                        <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
                        <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已成功</span>
                        <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 3">已结束</span>
                        <Countdown
                            v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                            :duration="getDuration(item.goodsInfo.activityInfo)"
                            format="DD天HH:mm:ss"
                            @finish="() => reset(item)"
                        />
                    </div>
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.sub1">
                            <div :class="$style.sub1Left">
                                <span v-if="item.goodsInfo.activityInfo.prizePool">
                                    成团瓜分
                                </span>
                                <span v-else>新春有礼</span>
                            </div>
                            <div :class="$style.sub1Right" v-if="item.goodsInfo.activityInfo.prizePool">
                                {{ `${item.goodsInfo.activityInfo.prizePool}元` }}
                            </div>
                        </div>
                        <div :class="$style.sub2">
                            <PlSvg name="icon-tuangoujia" width="40" height="20" fill="#FF4B00" />
                            <span :class="$style.sub2Price">{{ item.goodsInfo.activityInfo.activityPrice }}</span>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.pintuanList" v-else>
            <li
                v-for="(item, i) of 3"
                :key="i"
                :class="$style.pintuanListItem"
            >
                <div :class="$style.label">
                    众志成团
                </div>
                <div :class="$style.ribbon">
                    9999人参团
                </div>
                <div :class="$style.countdownWrapper">
                    距结束：2天23:59:59
                </div>
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                </div>
                <div :class="$style.info">
                    <div :class="$style.main">
                        神奇的逻辑思维游戏畅销书
                    </div>
                    <div :class="$style.sub1">
                        <div :class="$style.sub1Left">
                            成团瓜分
                        </div>
                        <div :class="$style.sub1Right">
                            99999元
                        </div>
                    </div>
                    <div :class="$style.sub2">
                        <PlSvg name="icon-tuangoujia" width="40" height="20" fill="#FF4B00" />
                        <span :class="$style.sub2Price">10000</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Countdown from '../../Countdown.vue'
import { getDuration, reset } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Pintuan extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getDuration = getDuration
    reset = reset
}
</script>

<style module lang="scss">
.pintuan {
    &-top {
        &-side {
            border: 32px solid;
            border-bottom: 16px solid;
            border-top: none;
            border-color: transparent transparent #fe834f transparent;
        }
        &-content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 68px;
            border-top: 2px solid #ffb89a;
            background: #fd6c2f;
            font-size: 13px;
            font-family: Microsoft YaHei;
            color: #fff;
            text-shadow: 0 1px 1px rgba(0, 0, 0, .20);
            > h3 {
                font-size: 24px;
                font-weight: bold;
            }
            > p {
                margin-top: 4px;
            }
        }
    }
    &-list {
        padding: 26px 16px 24px;
        background: #f6501d;
    }
    &-list-item {
        position: relative;
        display: flex;
        margin-top: 20px;
        background: linear-gradient(180deg, #ffeabf 0%, #fcd29f 100%);
        border-radius: 20px 10px 20px 10px;
        &:nth-of-type(1) {
            margin: 0;
        }
        .label {
            position: absolute;
            top: 0;
            left: 0;
            width: 85px;
            line-height: 24px;
            text-align: center;
            background: #fb7d55;
            border-radius: 20px 0 20px 0;
            overflow: hidden;
            font-size: 12px;
            font-family: Microsoft YaHei;
            color: #fff;
        }
        .ribbon {
            position: absolute;
            right: -11px;
            bottom: 9px;
            width: 80px;
            height: 30px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/d7554918-27ed-4ba4-b71a-61e9c66aad2e.png') no-repeat center;
            background-size: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            padding-bottom: 4px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            color: #724e12;
            @include elps();
        }
        .countdown-wrapper {
            position: absolute;
            top: -16px;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 168px;
            line-height: 26px;
            background: linear-gradient(180deg, #ffeabf 0%, #fcd29f 100%);
            box-shadow: 0 2px 4px #a02e09;
            border-radius: 10px 5px 5px 5px;
            color: #ff4b00;
            font-size: 13px;
            font-family: San Francisco Display;
            font-weight: bold;
            @include elps();
        }
        .img-wrapper {
            width: 150px;
            height: 100px;
            border-radius: 20px 0 0 10px;
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
            justify-content: flex-end;
            flex-direction: column;
            padding: 0 10px 8px;
        }
        .main {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 18px;
            color: #ec535b;
            text-shadow: 0 1px 1px rgba(0,0,0,.16);
            @include elps();
        }
        .sub-1 {
            display: inline-flex;
            align-items: center;
            text-align: center;
            margin-top: 6px;
            width: fit-content;
            max-width: 100%;
            height: 17px;
            line-height: 15px;
            border: 1px solid #ec6ba4;
            border-radius: 2px;
            @include elps();
            &-left {
                padding: 3px;
                min-width: 52px;
                font-size: 12px;
                color: #fff;
                background: #ff6767;
                overflow: hidden;
            }
            &-right {
                flex: 1;
                @include elps();
                padding: 0 5px;
                font-size: 12px;
                font-family: San Francisco Display;
                background: #ff0;
                color: #db4d7d;
            }
        }
        .sub-2 {
            display: flex;
            align-items: flex-end;
            margin-top: 9px;
            font-size: 18px;
            font-family: San Francisco Display;
            font-weight: bold;
            color: #ff4b00;
            &-price {
                margin-left: 2px;
                @include elps();
                &::before {
                    content: '￥';
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                }
            }
        }
    }
}

</style>
