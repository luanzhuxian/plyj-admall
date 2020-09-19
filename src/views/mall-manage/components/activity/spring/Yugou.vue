<template>
    <div class="yugou">
        <div class="yugou-top">
            <div class="yugou-top__side" />
            <div class="yugou-top__content">
                <h3>预购享翻倍</h3>
                <p v-if="Number(data.otherValue)">
                    {{ `${data.otherValue}人参与 查看更多>` }}
                </p>
                <p v-else>
                    查看更多>
                </p>
            </div>
        </div>
        <ul class="yugou-list" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <div
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    class="yugou-list-item"
                    :key="i"
                >
                    <div class="time">
                        <span v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
                        <span v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
                        <span v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                        <countdown
                            v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                            :duration="getDuration(item.goodsInfo.activityInfo)"
                            format="DD天HH:mm:ss"
                            @finish="() => item.goodsInfo.activityInfo.status += 1"
                        />
                    </div>
                    <div class="info">
                        <div class="main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div class="sub-1">
                            <span>{{ `预交定金￥${item.goodsInfo.activityInfo.price}` }}</span>
                            <span v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.multipleNumber > 1 && item.goodsInfo.activityInfo.activityPrice">{{ `抵￥${item.goodsInfo.activityInfo.activityPrice}` }}</span>
                        </div>
                        <div class="sub-2">
                            {{ `预售到手价：${getTotalPrice(item)}元` }}
                        </div>
                    </div>
                    <div class="img-wrapper">
                        <img :src="item.goodsInfo.productMainImage">
                    </div>
                </div>
            </template>
        </ul>
        <ul class="yugou-list" v-else>
            <li class="yugou-list-item" v-for="(item, i) of 3" :key="i">
                <div class="time">
                    距结束：2天23:59:59
                </div>
                <div class="info">
                    <div class="main">
                        非常好用的蜡笔张三三老师 带您体验课
                    </div>
                    <div class="sub-1">
                        预交定金￥100抵￥200
                    </div>
                    <div class="sub-2">
                        预售到手价：2000元
                    </div>
                </div>
                <div class="img-wrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import Countdown from '../../components/Countdown.vue'
import { getDuration, getTotalPrice } from '../../utils/helper'

export default {
    name: 'Yugou',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        getDuration,
        getTotalPrice
    }
}
</script>

<style scoped lang="scss">
  .yugou {
    &-top {
      &__side {
        border: 32px solid;
        border-bottom: 16px solid;
        border-top: none;
        border-color: transparent transparent #DC4F44 transparent;
      }
      &__content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 68px;
        border-top: 2px solid #F3867E;
        background: #FB2A33;
        font-size: 13px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
        text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.20);
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
      background: #F5574B;
    }
    &-list-item {
      position: relative;
      display: flex;
      margin-top: 20px;
      background: linear-gradient(90deg, #F6AB15 0%, #F5540E 100%);
      border-radius: 10px;
      &:nth-of-type(1) {
        margin: 0;
      }
      .time {
        position: absolute;
        top: -10px;
        left: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 167px;
        height: 29px;
        background: #F59D4B;
        border-radius: 5px;
        color: #FFFFFF;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        @include elps();
        ::v-deep .count-down {
          font-size: 13px;
        }
      }
      .info {
        flex: 1;
        width: 0;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        padding: 0 12px 8px;
        color: #FFFFFF;
      }
      .main {
        font-size: 14px;
        font-weight: bold;
        line-height: 18px;
        @include elps();
      }
      .sub-1 {
        margin-top: 2px;
        padding: 0 6px;
        height: 26px;
        line-height: 26px;
        background: #EA611B;
        font-size: 12px;
        font-family: San Francisco Display;
        font-weight: bold;
        text-align: center;
        @include elps();
      }
      .sub-2 {
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
