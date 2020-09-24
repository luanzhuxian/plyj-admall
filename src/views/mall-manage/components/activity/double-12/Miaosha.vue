<template>
    <div :class="$style.miaosha">
        <div :class="$style.wrapper" v-if="data.values.length">
            <ul :class="$style.miaoshaTime">
                <div>
                    <PlSvg name="icon-miaoshazhuanchang" width="39" height="40" />
                </div>
                <li
                    :class="{
                        [$style.miaoshaTimeItem]: true,
                        [$style.current]: currentIndex === 0
                    }"
                    v-if="data.values[0]"
                    @click.stop="currentModule === 'MiaoSha' ? currentIndex = 0 : $parent.onClick('MiaoSha')"
                >
                    <div :class="$style.wrapper" v-if="data.values[0].range && data.values[0].range.length">
                        <div :class="$style.status">
                            <span>
                                {{ getTimeStatus(data.values[0].range) }}
                            </span>
                        </div>
                        <div :class="$style.time">
                            {{ getDate(data.values[0].range[0], 'HH:mm') }}
                        </div>
                    </div>
                </li>
                <span :class="$style.border" v-if="data.values[1]" />
                <li
                    :class="{
                        [$style.miaoshaTimeItem]: true,
                        [$style.current]: currentIndex === 1
                    }"
                    v-if="data.values[1]"
                    @click.stop="currentModule === 'MiaoSha' ? currentIndex = 1 : $parent.onClick('MiaoSha')"
                >
                    <div :class="$style.wrapper" v-if="data.values[1].range && data.values[1].range.length">
                        <div :class="$style.status">
                            {{ getTimeStatus(data.values[1].range) }}
                        </div>
                        <div :class="$style.time">
                            {{ getDate(data.values[1].range[0], 'HH:mm') }}
                        </div>
                    </div>
                </li>
                <span :class="$style.border" v-if="data.values[2]" />
                <li
                    :class="{
                        [$style.miaoshaTimeItem]: true,
                        [$style.current]: currentIndex === 2
                    }"
                    v-if="data.values[2]"
                    @click.stop="currentModule === 'MiaoSha' ? currentIndex = 2 : $parent.onClick('MiaoSha')"
                >
                    <div :class="$style.wrapper" v-if="data.values[2].range && data.values[2].range.length">
                        <div :class="$style.status">
                            {{ getTimeStatus(data.values[2].range) }}
                        </div>
                        <div :class="$style.time">
                            {{ getDate(data.values[2].range[0], 'HH:mm') }}
                        </div>
                    </div>
                </li>
                <div>
                    <PlSvg name="icon-jinruzhuanchang" width="52" height="54" style="margin: 0 -18px;" />
                </div>
            </ul>
            <div v-for="(item, index) of data.values" :key="index">
                <ul
                    :class="$style.miaoshaList"
                    v-if="item.goodsInfo.length"
                    v-show="index === currentIndex"
                >
                    <template v-for="(prod, i) of item.goodsInfo">
                        <li
                            :class="$style.miaoshaListItem"
                            v-if="prod.activityInfo"
                            :key="i"
                        >
                            <div :class="$style.imgWrapper">
                                <img :src="prod.productMainImage">
                                <div :class="$style.countdownWrapper">
                                    <span :class="$style.text" v-if="prod.activityInfo.status === 0">距开始</span>
                                    <span :class="$style.text" v-if="prod.activityInfo.status === 1">距结束</span>
                                    <span :class="$style.text" v-if="prod.activityInfo.status === 2">已结束</span>
                                    <countdown
                                        v-if="~[0, 1].indexOf(prod.activityInfo.status)"
                                        :duration="getDuration(prod.activityInfo)"
                                        @finish="() => prod.activityInfo.status += 1"
                                    >
                                        <template #default="{time}">
                                            <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                                            <span :class="$style.colon">天</span>
                                            <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                                            <span :class="$style.colon">:</span>
                                            <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                                            <span :class="$style.colon">:</span>
                                            <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                                        </template>
                                    </countdown>
                                </div>
                            </div>
                            <div :class="$style.info">
                                <div :class="$style.main">
                                    {{ prod.productName }}
                                </div>
                                <div :class="$style.current">
                                    <PlSvg name="icon-miaoshajia" width="30" height="19" />
                                    <span :class="$style.price">
                                        {{ prod.activityInfo.activityPrice }}
                                    </span>
                                </div>
                                <div :class="$style.sub">
                                    <div :class="$style.subLeft">
                                        <div :class="$style.original">
                                            <span v-if="prod.productSkuModels && prod.productSkuModels.length && getPrice(prod.productSkuModels)('originalPrice')">
                                                原价:<span :class="$style.price">{{ getPrice(prod.productSkuModels)('originalPrice') }}</span>
                                            </span>
                                        </div>
                                        <div :class="$style.progress">
                                            <div :class="$style.progressInner" :style="{ width: `${(Number(prod.activityInfo.number) - Number(prod.activityInfo.activityStock)) / Number(prod.activityInfo.number) * 100}%` }" />
                                        </div>
                                        <div :class="$style.saled" v-if="prod.activityInfo.status === 0">
                                            {{ `${prod.pageviews}人已关注` }}
                                        </div>
                                        <div :class="$style.saled" v-if="prod.activityInfo.status > 0 && prod.activityInfo.activityStock > 0">
                                            {{ `已抢${Number(prod.activityInfo.number) - Number(prod.activityInfo.activityStock)}件` }}
                                        </div>
                                        <div :class="$style.saled" v-if="prod.activityInfo.status > 0 && prod.activityInfo.activityStock === 0" style="color: #999999;">
                                            已抢完
                                        </div>
                                    </div>
                                    <div :class="{
                                        [$style.subRight]: true,
                                        [$style.disabled]: prod.activityInfo.status !== 1
                                    }">
                                        <PlSvg
                                            v-if="~[0, 1].indexOf(prod.activityInfo.status)"
                                            name="icon-qiang"
                                            width="19"
                                        />
                                        <PlSvg
                                            v-else
                                            name="icon-jieshu"
                                            width="24"
                                            height="11"
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div :class="$style.wrapper" v-else>
            <ul :class="$style.miaoshaTime">
                <div>
                    <PlSvg name="icon-miaoshazhuanchang" width="39" height="40" />
                </div>
                <li :class="$style.miaoshaTimeItem">
                    <div :class="$style.wrapper">
                        <div :class="$style.status">
                            已开抢
                        </div>
                        <div :class="$style.time">
                            14:00
                        </div>
                    </div>
                </li>
                <span :class="$style.border" />
                <li :class="[$style.miaosha-time-item, $style.current]">
                    <div :class="$style.wrapper">
                        <div :class="$style.status">
                            进行中
                        </div>
                        <div :class="$style.time">
                            15:00
                        </div>
                    </div>
                </li>
                <span :class="$style.border" />
                <li :class="$style.miaoshaTimeItem">
                    <div :class="$style.wrapper">
                        <div :class="$style.status">
                            即将开抢
                        </div>
                        <div :class="$style.time">
                            16:00
                        </div>
                    </div>
                </li>
                <div>
                    <PlSvg name="icon-jinruzhuanchang" width="52" height="54" style="margin: 0 -18px;" />
                </div>
            </ul>
            <ul :class="$style.miaoshaList">
                <li :class="$style.miaoshaListItem" v-for="(item, i) of 3" :key="i">
                    <div :class="$style.imgWrapper">
                        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/:class/mod$style.-popular-3.jpg" alt="">
                        <div :class="$style.countdownWrapper">
                            <span :class="$style.text">距开始</span>
                            <i :class="$style.block">02</i>天
                            <i :class="$style.block">23</i>:
                            <i :class="$style.block">59</i>:
                            <i :class="$style.block">59</i>
                        </div>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            神奇的逻辑思维游戏畅销书
                        </div>
                        <div :class="$style.current">
                            <PlSvg name="icon-miaoshajia" width="30" height="19" />
                            <span :class="$style.price">10000</span>
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <div :class="$style.original">
                                    原价:
                                    <span :class="$style.price">15000</span>
                                </div>
                                <div :class="$style.progress">
                                    <div :class="$style.progress-inner" :style="{ width: '50%' }" />
                                </div>
                                <div :class="$style.saled">
                                    已抢40件
                                </div>
                            </div>
                            <div :class="$style.subRight">
                                <PlSvg name="icon-qiang" width="19" />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import moment from 'moment'
import Countdown from '../../Countdown.vue'
import { getPrice, getDate, getDuration } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Miaosha extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    @Prop(String) currentModule!: string

    /* data */
    // 选中的秒杀场次索引
    currentIndex = 0

    /* methods */
    getPrice = getPrice
    getDate = getDate
    getDuration = getDuration
    getTimeStatus ([start, end]: string[]) {
        let msg = ''
        const timestamp = Date.now()
        const startTs = moment(start).valueOf()
        const endTs = moment(end).valueOf()
        if (timestamp < startTs) msg = '未开始'
        if (timestamp >= startTs && timestamp < endTs) msg = '进行中'
        if (timestamp >= endTs) msg = '已结束'
        return msg
    }
}
</script>

<style module lang="scss">
  .miaosha {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &-time {
      padding: 16px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .border {
        width: 1px;
        height: 13px;
        background: #FFFFFF;
      }
      &-item {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFFFFF;
        text-align: center;
        min-width: 72px;
        &.current {
          .status {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
          }
          .time {
            background: #FFFFFF;
            color: #E0030C;
          }
        }
        .status {
          margin-bottom: 8px;
          font-size: 15px;
          font-weight: bold;
          line-height: 20px;
          text-shadow: 0px 2px 4px rgba(148, 7, 7, 0.40);
        }
        .time {
          box-sizing: border-box;
          display: inline-block;
          width: 60px;
          height: 20px;
          line-height: 18px;
          border: 1px solid #FFFFFF;
          box-shadow: 0px 2px 4px rgba(148, 7, 7, 0.4);
          border-radius: 99px;
          text-align: center;
        }
      }
    }
    &-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &-item {
        display: flex;
        margin-bottom: 10px;
        padding: 8px;
        width: 100%;
        background-color: #FFF;
        border-radius: 10px;
        overflow: hidden;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
        .img-wrapper {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          margin-right: 8px;
          width: 140px;
          height: 94px;
          .countdown-wrapper {
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 26px;
            font-size: 12px;
            background: rgba(0, 0, 0, 0.65);
            color: #FFF;
          }
          .block {
              display: inline-block;
              box-sizing: border-box;
              padding: 0 2px;
              height: 18px;
              line-height: 18px;
              background: rgba(174, 174, 174, .64);
              border-radius: 2px;
          }
        }
        .info {
          flex: 1;
          width: 0;
          display: flex;
          justify-content: center;
          flex-direction: column;
          position: relative;
        }
        .main {
          font-size: 14px;
          font-weight: bold;
          line-height: 20px;
          color: #000000;
          @include elps();
        }
        .current {
          margin-bottom: 1px;
          display: flex;
          align-items: flex-end;
          color: #FE3C5E;
          @include elps();
          .price {
            flex: 1;
            width: 0;
            margin-left: 2px;
            font-size: 20px;
            font-family: San Francisco Display;
            font-weight: bold;
            @include elps();
            &:before {
              content: '￥';
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: bold;
            }
          }
        }
        .sub {
          display: flex;
          align-items: flex-end;
          &-left {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .original {
              display: flex;
              align-items: flex-end;
              margin-bottom: 7px;
              height: 16px;
              font-size: 10px;
              color: #999999;
              @include elps();
              .price {
                flex: 1;
                width: 0;
                font-family: San Francisco Display;
                text-decoration: line-through;
                @include elps();
                &:before {
                  content: '￥';
                  font-family: Microsoft YaHei;
                }
              }
            }
            .progress {
              width: 122px;
              height: 7px;
              background: #FFD2D2;
              border-radius: 103px;
              overflow: hidden;
              &-inner {
                height: 7px;
                background: #F55959;
                border-radius: 103px;
              }
            }
            .saled {
              font-size: 10px;
              font-weight: 600;
              color: #FE3C5E;
            }
          }
          &-right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 36px;
            background: linear-gradient(231deg, rgba( 238, 144, 111, 1) 0%, rgba(233, 70, 115, 1) 100%);
            border-radius: 50%;
            overflow: hidden;
            color: #ffffff;
            &.disabled {
              background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
            }
          }
        }
      }
    }
  }
</style>
