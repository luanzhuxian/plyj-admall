<template>
    <Panel :custom-class="$style.yugouPanel" :title="panelTitle">
        <ul :class="$style.yugouList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.yugouListItem"
                    :key="i"
                >
                    <div :class="$style.countdownWrapper">
                        <span v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
                        <span v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
                        <span v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                        <Countdown
                            v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                            :duration="getDuration(item.goodsInfo.activityInfo)"
                            format="DD天HH:mm:ss"
                            @finish="() => item.goodsInfo.activityInfo.status += 1"
                        />
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.sub">
                            <span>{{ `预交定金￥${item.goodsInfo.activityInfo.price}` }}</span>
                            <span v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.multipleNumber > 1 && item.goodsInfo.activityInfo.activityPrice">{{ `抵￥${item.goodsInfo.activityInfo.activityPrice}` }}</span>
                        </div>
                        <div :class="$style.price">
                            {{ `预售到手价：${getTotalPrice(item)}元` }}
                        </div>
                    </div>
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.yugouList" v-else>
            <li :class="$style.yugouListItem" v-for="(item, i) of 2" :key="i">
                <div :class="$style.countdownWrapper">
                    距结束：2天23:59:59
                </div>
                <div :class="$style.info">
                    <div :class="$style.main">
                        非常好用的蜡笔张三三老师 带您体验课
                    </div>
                    <div :class="$style.sub">
                        预交定金￥100抵￥200
                    </div>
                    <div :class="$style.price">
                        预售到手价：2000元
                    </div>
                </div>
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
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
import { getDuration, getTotalPrice } from '../../../utils/helper'

@Component({
    components: {
        Panel,
        Countdown
    }
})
export default class Yugou extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    panelTitle = {
        name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/ygxfb.png',
        width: 184,
        height: 27
    }

    /* methods */
    getDuration = getDuration
    getTotalPrice = getTotalPrice
}
</script>

<style module lang="scss">
.yugou {
    &-list-item {
        position: relative;
        display: flex;
        margin-top: 20px;
        background: #ba95ff;
        border: 2px solid #222;
        border-radius: 10px;
        &:nth-of-type(1) {
            margin: 0;
        }
        .countdown-wrapper {
            position: absolute;
            top: -10px;
            left: 9px;
            width: 162px;
            line-height: 24px;
            text-align: center;
            background: #ffe701;
            border: 2px solid #222;
            border-radius: 5px;
            color: #ff341b;
            font-size: 13px;
            font-weight: bold;
            @include elps();
        }
        .info {
            flex: 1;
            width: 0;
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            padding: 0 8px 8px;
            color: #fff;
        }
        .main {
            font-size: 14px;
            font-weight: bold;
            line-height: 18px;
            color: #00237a;
            @include elps();
        }
        .sub {
            margin-top: 2px;
            padding: 0 6px;
            height: 26px;
            line-height: 26px;
            background: #8c4cff;
            font-size: 12px;
            font-family: San Francisco Display;
            font-weight: bold;
            text-align: center;
            @include elps();
        }
        .price {
            margin-top: 6px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            @include elps();
        }
        .img-wrapper {
            width: 150px;
            height: 100px;
            border-radius: 50px 10px 10px 50px;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

</style>
