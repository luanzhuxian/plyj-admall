<template>
    <div :class="$style.newUserPreview">
        <h1>{{ data.activityName }}</h1>
        <h2>新人优惠大礼包 惊喜派送</h2>
        <Countdown
            :start-time="startTime"
            :end-time="endTime"
            :duration="duration"
            :is-start="isStart"
            :is-end="isEnd"
        />

        <div :class="$style.count">
            已有<i v-text="data.claimNum" />人领取了新人优惠大礼包
        </div>

        <div :class="$style.contentBox" v-if="coupons.length">
            <div :class="{ [$style.contentMain]: true, [$style.coupon]: true }">
                <div :class="$style.top">
                    优惠券大礼包 <i class="rmb">
                        ￥<span v-text="totalCouponPrice" />
                    </i>
                </div>
                <div
                    :class="{ [$style.couponList]: true, [$style.few]: coupons.length < 4 }"
                    :style="{ height: coupons.length > 3 ? (seeMoreCoupon ? ((coupons.length * 180 + (coupons.length - 1) * 18) * 330 / 750) + 'px' : 576 * 330 / 750 + 'px') : 'auto' }"
                >
                    <Coupon
                        v-for="(item, i) of coupons"
                        :key="i"
                        :price="item.amount"
                        :type="item.couponType"
                        :limit="item.useLimitAmount"
                        :start="item.useStartTime"
                        :end="item.useEndTime"
                    />
                </div>
                <template v-if="coupons.length > 3">
                    <button :class="$style.moreButton" v-if="!seeMoreCoupon" @click="seeMoreCoupon = true">
                        查看更多优惠券
                    </button>
                    <button v-else style="color: #FA8E59" :class="$style.collapse + ' ' + $style.moreButton" @click="seeMoreCoupon = false">
                        收起 <pl-svg name="icon-shang" width="12" fill="#FA8E59" />
                    </button>
                </template>
            </div>
        </div>

        <div :class="$style.contentBox" v-if="scholarships.length">
            <div :class="{ [$style.contentMain]: true, [$style.scholarship]: true }">
                <div :class="$style.top">
                    新人奖学金<i class="rmb">
                        ￥<span v-text="totalScholarship" />
                    </i>
                </div>
                <div :class="$style.scholarshipWrap">
                    <div :class="$style.scholarshipList">
                        <Scholarship
                            v-for="(item, i) of scholarships"
                            :key="i"
                            :price="item.scholarshipPrice"
                            :days="item.scholarshipEffectiveTime"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.contentBox" class="mb-28" v-if="gifts.length">
            <div :class="{ [$style.contentMain]: true, [$style.gift]: true }">
                <div :class="$style.top">
                    新人礼品 <span class="gray-3 fz-24">注册成为新会员即可获得</span>
                </div>
                <div :class="$style.giftWrap">
                    <div :class="$style.giftList">
                        <Gift
                            v-for="(item, i) of gifts"
                            :key="i"
                            :image="item.giftImage"
                            :name="item.giftName"
                            :start="item.useStartTime"
                            :end="item.useEndTime"
                            :count="gifts.length"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Coupon from './Coupon.vue'
import Countdown from './Countdown.vue'
import Scholarship from './Scholarship.vue'
import Gift from './Gift.vue'
import moment from 'moment'
export default {
    name: 'NewUserPreview',
    components: {
        Coupon,
        Countdown,
        Scholarship,
        Gift
    },
    data () {
        return {
            duration: 0,
            seeMoreCoupon: false
        }
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    watch: {
        data: {
            handler (val) {
                const startTime = moment(val.activityStartTime).valueOf() || 0
                const endTime = moment(val.activityEndTime).valueOf() || 0
                const isStarted = Date.now() - startTime > 0
                const isEnd = Date.now() - endTime > 0
                let duration = 0
                if (!isStarted) {
                    duration = startTime - Date.now()
                }
                if (isStarted && !isEnd) {
                    duration = endTime - Date.now()
                }
                this.duration = duration
            },
            immediate: true
        }
    },
    computed: {
        coupons () {
            return this.data.couponModels.filter(item => !(item.status === 3 || (Number(Date.parse(item.useEndTime)) < Number(Date.parse(this.data.activityStartTime))) || (Number(Date.parse(item.useEndTime)) > Number(Date.parse(this.data.activityStartTime)) && Number(Date.parse(item.useEndTime)) < Number(Date.parse(this.data.activityEndTime))))) || []
        },
        scholarships () {
            return this.data.scholarships || []
        },
        gifts () {
            return this.data.gifts.filter(item => !((Number(Date.parse(item.useEndTime)) < Number(Date.parse(this.data.activityStartTime))) || (Number(Date.parse(item.useEndTime)) > Number(Date.parse(this.data.activityStartTime)) && Number(Date.parse(item.useEndTime)) < Number(Date.parse(this.data.activityEndTime))))) || []
        },
        totalCouponPrice () {
            return this.coupons.length ? this.coupons.map(item => item.amount).reduce((a, b) => (a + b))
                .toFixed(2) : 0
        },
        totalScholarship () {
            return this.scholarships.length ? this.scholarships.map(item => item.scholarshipPrice).reduce((a, b) => (a + b))
                .toFixed(2) : 0
        },
        startTime () {
            return moment(this.data.activityStartTime).valueOf() || 0
        },
        endTime () {
            return moment(this.data.activityEndTime).valueOf() || 0
        },
        // 是否已经开始
        isStart () {
            return Date.now() - this.startTime > 0 && Number(this.data.status) !== 0
        },
        isEnd () {
            return Number(this.data.status) === 0
        }
    }
}
</script>

<style module lang="scss">
  /* 尺寸比例转换 */
  $em: 330 / 750;
  .newUserPreview {
    position: relative;
    padding: 0 12px*$em 58px*$em 12px*$em;
    background: #FA8E59 url("https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser-bg.jpg") no-repeat top center;
    background-size: 100%;
    overflow: hidden;
    > h1 {
      margin-top: 76px*$em;
      margin-bottom: 24px*$em;
      font-size: 60px*$em;
      text-align: center;
      color: #fff;
      font-weight: normal;
    }
    > h2 {
      width: 400px*$em;
      margin: 0 auto;
      text-align: center;
      line-height: 60px*$em;
      font-size: 30px*$em;
      font-weight: normal;
      color: #FC6E1F;
      background-color: #FBEFD7;
      border-radius: 20px * $em;
    }
    > .countdown {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 436px*$em;
      height: 72px*$em;
      margin: 378px*$em auto 0;
      text-align: center;
      font-size: 24px*$em;
      background: linear-gradient(180deg, #F67D3E, #FB621C) no-repeat;
      border-radius: 36px*$em;
      > span {
        color: #FBEFD7;
      }
      > i {
        color: #FBEFD7;
        margin: 0 4px*$em;
      }
      > .timeItem {
        width: 36px*$em;
        line-height: 38px*$em;
        color: #DF5B2F;
        background-color: #FBEFD7;
        border-radius: 6px*$em;
      }
    }
    > .count {
      margin: 10px*$em 0 24px*$em 0;
      text-align: center;
      font-size: 24px*$em;
      color: #fff;
      > i {
        color: #FCF28C;
      }
    }
  }
.contentBox {
    margin-bottom: 42px*$em;
    padding-top: 34px*$em;
    background: url("https://mallcdn.youpenglai.com/static/admall/2.11.0/contetn-head.png") no-repeat top center;
    background-size: 100%;
    > .contentMain {
      width: 680px*$em;
      margin: 0 auto;
      background: #fff linear-gradient(180deg, rgba(251, 89, 23, 0.8), rgba(251, 89, 23, 0) 38px*$em, #fff 38px*$em) no-repeat center 0;
      overflow-y: hidden;
      box-sizing: border-box;
      &.coupon {
        display: flex;
        flex-direction: column;
        align-items: center;
        > .couponList {
          overflow: hidden;
          transition: height .5s linear;
          &.few {
            padding-bottom: 56px*$em;
          }
        }
        > .moreButton {
          width: 450px*$em;
          margin: 38px*$em 0 46px*$em 0;
          line-height: 30px;
          border-radius: 15px;
          color: #fff;
          border: none;
          background-color: #F2B036;
          &.collapse {
            font-size: 30px*$em;
            background: none;
            > svg {
              vertical-align: -4px*$em;
            }
          }
        }
      }
      &.scholarship, &.gift {
        > .top {
          padding: 0 32px*$em;
          box-sizing: border-box;
        }
        > .scholarshipWrap, > .giftWrap {
          width: 100%;
          height: max-content;
          padding: 0 32px*$em 64px*$em 32px*$em;
          box-sizing: border-box;
          overflow: scroll;
          > .scholarshipList,  > .giftList {
            width: max-content;
            font-size: 0;
            overflow-y: hidden;
          }
        }
      }
      > .top {
        width: 630px*$em;
        margin: 56px*$em 0 26px*$em 0;
        font-size: 32px*$em;
        > i {
          font-size: 40px*$em;
          font-weight: bold;
          color: #FF4622;
          &:before {
            font-size: 30px*$em;
          }
        }
      }
    }
}
</style>
