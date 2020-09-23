<template>
    <div :class="$style.yugou">
        <div :class="$style.background">
            <div :class="$style.navBar">
                <div :class="$style.navLink">
                    <span>查看更多</span>
                    <i class="el-icon-arrow-right" />
                </div>
            </div>
        </div>
        <ul :class="$style.yugouList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.yugouList"
                    :key="i"
                >
                    <div :class="$style.time">
                        <div :class="$style.timeLeft">
                            <span v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                            <span v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                            <span v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                        </div>
                        <div :class="$style.timeRight" v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)">
                            <Countdown
                                :duration="getDuration(item.goodsInfo.activityInfo)"
                                format="DD天HH:mm:ss"
                                @finish="() => item.goodsInfo.activityInfo.status += 1"
                            />
                        </div>
                    </div>
                    <div :class="$style.yugouListItemWrapper">
                        <div :class="$style.imgWrapper">
                            <img v-imgError :src="item.goodsInfo.productMainImage">
                        </div>
                        <div :class="$style.info">
                            <div :class="$style.main">
                                {{ item.goodsInfo.productName }}
                            </div>
                            <div :class="$style.sub1">
                                {{ `预售到手价：${getTotalPrice(item)}元` }}
                            </div>
                            <div :class="$style.sub2">
                                <span>{{ `预交定金￥${item.goodsInfo.activityInfo.price}` }}</span>
                                <span v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.multipleNumber > 1 && item.goodsInfo.activityInfo.activityPrice">{{ `抵￥${item.goodsInfo.activityInfo.activityPrice}` }}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.yugouList" v-else>
            <li :class="$style.yugouListItem" v-for="(item, i) of 3" :key="i">
                <div :class="$style.time">
                    <div :class="$style.timeLeft">
                        距结束
                    </div>
                    <div :class="$style.timeRight">
                        02天23:59:59
                    </div>
                </div>
                <div :class="$style.yugouListItemWrapper">
                    <div :class="$style.imgWrapper">
                        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/class/mod-popular-3.jpg" alt="">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            非常好用的蜡笔张三三老师 带您体验课
                        </div>
                        <div :class="$style.sub1">
                            预售到手价：2000元
                        </div>
                        <div :class="$style.sub2">
                            预交定金￥100抵￥200
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Countdown from '../../components/Countdown.vue'
import { getDuration, getTotalPrice } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Yugou extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    getDuration = getDuration
    getTotalPrice = getTotalPrice
}
</script>

<style module lang="scss">
  .yugou {
    background: rgba(213, 55, 150, 1);
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .background {
      height: 226px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-yugou.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    .nav-bar {
      padding: 20px 10px 23px;
      display: flex;
      justify-content: flex-end;
    }
    .nav-link {
      width: 92px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: #FFF;
      border-radius: 146px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #D661A8;
      .el-icon-arrow-right {
        font-size: 14px;
        font-weight: bold;
      }
    }
    &-list {
      position: relative;
      top: -226px;
      padding: 70px 10px 25px;
      margin-bottom: -226px;
      &-item {
        margin-bottom: 10px;
        padding: 10px 8px 8px;
        background: #FFF;
        border-radius: 10px;
        overflow: hidden;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
        &-wrapper {
          display: flex;
        }
        .time {
          display: inline-flex;
          align-items: center;
          text-align: center;
          margin-bottom: 7px;
          height: 17px;
          line-height: 15px;
          border: 1px solid #EC6BA4;
          border-radius: 2px;
          overflow: hidden;
          &-left {
            width: 47px;
            font-size: 12px;
            color: #FFF;
            background: #FF6767;
            overflow: hidden;
          }
          &-right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 85px;
            font-size: 12px;
            font-family: San Francisco Display;
            color: #DB4D7D;
          }
        }
        .img-wrapper {
          margin-right: 10px;
          width: 132px;
          height: 88px;
          border-radius: 10px;
          overflow: hidden;
        }
        .info {
          flex: 1;
          width: 0;
          line-height: 18px;
        }
        .main {
          margin-bottom: 9px;
          height: 38px;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          @include elps-wrap(2);
          text-align: justify;
        }
        .sub-1 {
          margin-bottom: 6px;
          line-height: 18px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          color: #999999;
          @include elps();
        }
        .sub-2 {
          line-height: 18px;
          font-size: 12px;
          font-family: San Francisco Display;
          font-weight: bold;
          color: #EA618E;
          @include elps();
        }
      }
    }
  }
</style>
