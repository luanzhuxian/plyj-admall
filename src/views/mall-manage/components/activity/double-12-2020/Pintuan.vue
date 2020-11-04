<template>
    <Panel custom-class="pintuan-panel" title="众志成团" subtitle="邀请好友一起瓜分奖励">
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.pintuanListItem"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.name">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.price">
                            <span>团购价</span>
                            <b>{{ item.goodsInfo.activityInfo.activityPrice }}</b>
                        </div>
                        <div :class="$style.count">
                            <span v-if="item.goodsInfo.activityInfo.status === 0">
                                {{ `${item.goodsInfo.pageviews}人` }}<i>关注</i>
                            </span>
                            <span v-else>
                                {{ `${item.goodsInfo.activityInfo.number}人` }}<i>参团</i>
                            </span>
                        </div>
                        <div :class="$style.bar">
                            <template v-if="item.goodsInfo.activityInfo.prizePool">
                                <b :class="$style.barLabel">
                                    参团最高瓜分
                                </b>
                                <b :class="$style.barAmount">
                                    {{ item.goodsInfo.activityInfo.prizePool }}元
                                </b>
                            </template>
                            <b :class="$style.barLabel" v-else>
                                超值团购 爱团才会赢
                            </b>
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
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                </div>
                <div :class="$style.info">
                    <div :class="$style.name">
                        高中数学 选修4-4
                    </div>
                    <div :class="$style.price">
                        <span>团购价</span>
                        <b>99.9</b>
                    </div>
                    <div :class="$style.count">
                        99人<i>参团</i>
                    </div>
                </div>
                <div :class="$style.bar">
                    <b :class="$style.barLabel">
                        参团最高瓜分
                    </b>
                    <b :class="$style.barAmount">
                        1000元
                    </b>
                    <div :class="$style.countdownWrapper">
                        距结束：2天23:59:59
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
import Countdown from '../../Countdown.vue'
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

    /* methods */
    getDuration = getDuration
    reset = reset
}
</script>

<style lang="scss">
.pintuan-panel {
    .double-12-panel-container {
        margin-top: 0;
    }
}

</style>
<style lang="scss" module>
.pintuan {
    &-list-item {
        position: relative;
        display: flex;
        box-sizing: border-box;
        margin-top: 20px;
        padding: 10px;
        height: 142px;
        background: #FFFBF1;
        border-radius: 4px;
        &:nth-of-type(1) {
            margin: 0;
        }
        &::after {
            content: '';
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 8px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/logo-mini.png') no-repeat center;
            background-size: 100%;
            z-index: 1;
        }
        .img-wrapper {
            width: 120px;
            height: 80px;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            flex: 1;
            margin-left: 7px;
            width: 0;
            height: 80px;
        }
        .name {
            margin-top: 9px;
            font-size: 14px;
            font-weight: bold;
            line-height: 19px;
            color: #333333;
            @include elps();
        }
        .price {
            display: flex;
            align-items: flex-end;
            margin-top: 4px;
            font-size: 14px;
            line-height: 19px;
            color: #333333;
            > b {
                font-size: 20px;
                color: #D80000;
                @include elps();
                &::before {
                    content: '￥';
                    margin-left: 5px;
                    font-size: 16px;
                }
            }
        }
        .count {
            margin-top: auto;
            padding-right: 6px;
            text-align: right;
            font-size: 12px;
            line-height: 16px;
            color: #333333;
            i {
                color: #D80000;
            }
        }
        .bar {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px 0 30px;
            height: 30px;
            background: linear-gradient(90deg, #FFD371 0%, #F78E13 100%);
            font-size: 14px;
            line-height: 19px;
            color: #FFFFFF;
            z-index: 1;
            &::after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                right: -10px;
                width: 0;
                height: 0;
                border-top: 15px solid transparent;
                border-left: 10px solid #F78E13;
                border-right: 0 solid transparent;
                border-bottom: 15px solid transparent;
            }
            &-amount {
                box-sizing: border-box;
                margin-left: 4px;
                padding: 0 7px;
                height: 19px;
                background: #FFFFFF;
                font-size: 12px;
                color: #E51900;
                @include elps();
            }
        }
        .countdown-wrapper {
            margin-left: auto;
            min-width: 120px;
            font-size: 12px;
            line-height: 16px;
        }
    }
}

</style>
