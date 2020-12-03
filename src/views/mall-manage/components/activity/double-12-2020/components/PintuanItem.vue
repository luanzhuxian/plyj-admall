<template>
    <li v-if="data.goodsInfo && data.goodsInfo.activityInfo" :class="$style.pintuanListItem">
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
        </div>
        <div :class="$style.info">
            <div :class="$style.name">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.price">
                <span>团购价</span>
                <b>{{ data.goodsInfo.activityInfo.activityPrice }}</b>
            </div>
            <div :class="$style.count">
                <span v-if="data.goodsInfo.activityInfo.status === 0">
                    {{ `${data.goodsInfo.pageviews}人` }}<i>关注</i>
                </span>
                <span v-else>
                    {{ `${data.goodsInfo.activityInfo.number}人` }}<i>参团</i>
                </span>
            </div>
            <div :class="$style.bar">
                <template v-if="data.goodsInfo.activityInfo.prizePool">
                    <b :class="$style.barLabel">
                        参团最高瓜分
                    </b>
                    <b :class="$style.barAmount">
                        {{ data.goodsInfo.activityInfo.prizePool }}元
                    </b>
                </template>
                <b :class="$style.barLabel" v-else>
                    超值团购 爱团才会赢
                </b>
                <div :class="$style.countdownWrapper">
                    <slot name="countdown">
                        <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 0">距开始：</span>
                        <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 1">距结束：</span>
                        <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 2">已成功</span>
                        <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 3">已结束</span>
                        <Countdown
                            v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                            :duration="getDuration(data.goodsInfo.activityInfo)"
                            format="DD天HH:mm:ss"
                            @finish="() => reset(item)"
                        />
                    </slot>
                </div>
            </div>
        </div>
    </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModuleItem } from '../../../../utils/types'
import Countdown from '../../../Countdown.vue'
import { getDuration, reset } from '../../../../utils/helper'

@Component({
    components: {
        Countdown
    }
})
export default class PintuanItem extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateModuleItem

    /* methods */
    getDuration = getDuration
    reset = reset
}
</script>

<style lang="scss" module>
.pintuan-list-item {
    position: relative;
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    height: 142px;
    background: #FFFBF1;
    border-radius: 4px;
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

</style>
