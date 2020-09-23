<template>
    <Panel :custom-class="$style.pintuanPanel" :title="panelTitle">
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.pintuanListItem"
                    :key="i"
                >
                    <label>众志成团</label>
                    <div :class="$style.ribbon">
                        <span v-if="item.goodsInfo.activityInfo.status === 0">
                            {{ `${item.goodsInfo.pageviews}人关注` }}
                        </span>
                        <span v-else>
                            {{ `${item.goodsInfo.activityInfo.number}人参团` }}
                        </span>
                    </div>
                    <div :class="$style.countdownWrapper">
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
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.sub" v-if="item.goodsInfo.activityInfo.prizePool">
                            <div :class="$style.sub-left">
                                成团瓜分
                            </div>
                            <div :class="$style.subRight">
                                {{ item.goodsInfo.activityInfo.prizePool }}
                            </div>
                        </div>
                        <div :class="$style.price">
                            <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/tgj.png" width="40" />
                            <b>{{ item.goodsInfo.activityInfo.activityPrice }}</b>
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
                <label>
                    众志成团
                </label>
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
                    <div :class="$style.sub">
                        <div :class="$style.subLeft">
                            成团瓜分
                        </div>
                        <div :class="$style.subRight">
                            99999
                        </div>
                    </div>
                    <div :class="$style.price">
                        <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/tgj.png" width="40" />
                        <b>99999</b>
                    </div>
                </div>
            </li>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import Countdown from '../../components/Countdown.vue'
import { getDuration, reset } from '../../../utils/helper'

@Component({
    components: {
        Panel,
        Countdown
    }
})
export default class Pintuan extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    panelTitle = {
        name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zzct.png',
        width: 163,
        height: 27
    }

    /* methods */
    getDuration = getDuration
    reset = reset
}
</script>

<style module lang="scss">
.pintuan {
    &-list-item {
        position: relative;
        display: flex;
        margin-top: 20px;
        background: #fff;
        border-radius: 10px;
        border: 2px solid #222;
        &:nth-of-type(1) {
            margin: 0;
        }
        label {
            position: absolute;
            top: 6px;
            left: 6px;
            width: 56px;
            line-height: 17px;
            text-align: center;
            background: #ffe100;
            border-radius: 3px;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #00237a;
            border: 1px solid #222;
        }
        .ribbon {
            position: absolute;
            right: -9px;
            bottom: 5px;
            box-sizing: border-box;
            width: 73px;
            height: 28px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/ribbon.png') no-repeat center;
            background-size: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            padding-bottom: 3px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            color: #00237a;
            @include elps();
        }
        .countdown-wrapper {
            position: absolute;
            top: -12px;
            right: -4px;
            width: 166px;
            line-height: 22px;
            text-align: center;
            background: #ffe701;
            border: 2px solid #222;
            border-radius: 10px 5px 5px 5px;
            box-shadow: 0 2px 4px #a02e09;
            color: #ff341b;
            font-size: 13px;
            font-weight: bold;
            @include elps();
        }
        .img-wrapper {
            width: 147px;
            height: 98px;
            border-radius: 10px 0 0 10px;
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
            padding: 0 6px 7px;
        }
        .main {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 17px;
            color: #000;
            text-shadow: 0 1px 1px rgba(0, 0, 0, .16);
            @include elps();
        }
        .sub {
            display: inline-flex;
            align-items: center;
            text-align: center;
            margin-top: 5px;
            width: fit-content;
            max-width: 100%;
            height: 17px;
            line-height: 17px;
            border: 1px solid #ff331b;
            border-radius: 2px;
            @include elps();
            &-left {
                padding: 3px;
                min-width: 52px;
                font-size: 12px;
                font-family: PingFang SC;
                font-weight: bold;
                color: #fff;
                background: #ff331b;
            }
            &-right {
                flex: 1;
                padding: 0 5px;
                font-size: 12px;
                background: #ffe701;
                color: #ff331b;
                @include elps();
            }
        }
        .price {
            display: flex;
            align-items: flex-end;
            margin-top: 9px;
            padding-right: 50px;
            > b {
                position: relative;
                top: 1px;
                margin-left: 2px;
                font-size: 18px;
                font-family: Helvetica;
                color: #ff331b;
                @include elps();
                &::before {
                    content: '￥';
                    font-size: 12px;
                }
            }
            img {
                margin-bottom: 2px;
            }
        }
    }
}

</style>
