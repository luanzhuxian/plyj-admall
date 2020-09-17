<template>
    <div class="main hover-up">
        <div class="inter-item" :class="bgClass" @click="gotoRouter">
            <div class="inter-item-content">
                <h1 :class="{deactive: deactive}">
                    {{ title }} <img v-if="freeFlag" style="width: 32px" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/免费icon.png">
                </h1>
                <p class="desc" v-html="desc" />
                <template v-if="showUnlock">
                    <p :class="deactive ? 'deactive' : 'active'" class="count" v-if="count === -1">
                        {{ openStatus ? '已设置引导关注' : '未设置引导关注' }}
                    </p>
                    <p :class="deactive ? 'deactive' : 'active'" class="count" v-else>
                        当前活动：{{ count }}个
                    </p>
                    <p v-if="expired" :class="{'expired-deactive': deactive}" class="expired">
                        使用有效期：{{ expired }}
                    </p>
                </template>
            </div>
            <div class="inter-item-icon">
                <i
                    class="inter-item-unlock"
                    :class="{
                        orange: orangeLock
                    }"
                    v-if="hasLock && showUnlock"
                />
                <i :class="bgClass? '': iconClass" class="inter-icon" />
            </div>
            <div class="item-flag">
                <i class="inter-item-xian-flag" v-if="xianFlag" />
                <i class="inter-item-flag" v-if="newFlag" />
            </div>
        </div>
        <div class="lock" v-if="!showUnlock && !isLongmenXian" @click="goUnpaidDetail">
            <pl-svg width="56" name="icon-lock-8eb42" />
        </div>
        <div class="longmen-xian-lock" v-if="!showUnlock && isLongmenXian" @click="goUnpaidDetail">
            <div>
                立即解锁 &nbsp;<pl-svg width="17" name="icon-lock-8eb42" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InterItem',
    props: {
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        openStatus: {
            type: Boolean,
            default: false
        },
        expired: {
            type: String,
            default: '长期有效'
        },
        router: {
            type: String,
            required: true
        },
        query: {
            type: Object,
            default () {
                return {}
            }
        },
        params: {
            type: Object,
            default () {
                return {}
            }
        },
        iconClass: {
            type: String,
            default: ''
        },
        bgClass: {
            type: String,
            default: ''
        },
        newFlag: {
            type: Boolean,
            default: false
        },
        xianFlag: {
            type: Boolean,
            default: false
        },
        freeFlag: {
            type: Boolean,
            default: false
        },
        hasLock: Boolean,
        showUnlock: {
            type: Boolean,
            default: false
        },
        deactive: {
            type: Boolean,
            default: false
        },
        // 是否使用橙色的锁
        orangeLock: Boolean,
        loading: Boolean
    },
    computed: {
        isLongmenXian () {
            return !!(this.params.programId === '1' || this.params.programId === '3' || this.params.programId === '4' || this.params.programId === '5')
        }
    },
    methods: {
        gotoRouter () {
            if (this.router) {
                this.$router.push({
                    name: this.router,
                    query: { ...this.query },
                    params: { ...this.params }
                })
            }
        },
        goUnpaidDetail () {
            if (this.loading) return
            const isLongmen = !!(this.params.programId === '2' || this.params.programId === '6' || this.params.programId === '7')
            if (isLongmen) {
                this.$alert('龙门节专属活动，若要开通请联系城市经理或者客服')
                return
            }
            this.$router.push({
                name: 'MarketingUnpaidDetail',
                params: { ...this.params }
            })
        }
    }
}
</script>

<style scoped lang="scss">
  .main {
    position: relative;
    margin-right: 34px;
    margin-bottom: 32px;
  }
  .inter-item {
    position: relative;
    width: 300px;
    height: 156px;
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(0,34,61,.2);
    cursor: pointer;

    .inter-item-content {
      position: absolute;
      left: 24px;
      top: 24px;
      z-index: 1;
      h1 {
        margin-bottom: 8px;
        font-size: 20px;
        color: #333;
        cursor: pointer;

        &.deactive {
          color: #999;
        }
      }

      p {
        color: #999;
        font-size: 12px;

        &.active {
          color: #598bf8;
        }

        &.deactive {
          color: #999;
        }

        &.expired-deactive {
          color: #ccc;
        }
      }

      .desc {
        width: 132px;
        height: 24px;
        margin-bottom: 20px;
      }
    }

    .inter-item-icon {
      position: absolute;
      top: 15px;
      right: 0;
      width: 112px;
      height: 121px;
    }

    .item-flag{
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      .inter-item-flag {
        width: 25px;
        height: 28px;
        margin-right: 7px;
        background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_icon_new.png');
      }
      .inter-item-xian-flag{
        width: 25px;
        height: 28px;
        margin-right: 7px;
        background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/icon-xian.png');
      }
    }

    .inter-item-unlock {
      position: absolute;
      z-index: 1;
      width: 27px;
      height: 27px;
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/icon_unlock_.png');
      background-size: 27px;
      &.orange {
        background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/abc3f899-f680-4f9c-a3c2-77c4585b374d.png');
      }
    }

    .inter-icon {
      display: inline-block;
      top: 0;
      width: 112px;
      height: 121px;
      background-size: 100%;
      &:before {
        display: none;
      }
    }

    .icon-helper {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_helper.png');
    }

    .icon-coupon {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_coupon.png');
    }

    .icon-newgift {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_new gift.png');
    }

    .icon-invitation {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_Invitation.png');
    }

    .icon-straight {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_straight.png');
    }

    .icon-seckill {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_couponpng.png');
    }

    .icon-group-buy {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_assemble.png');
    }

    .icon-pre-buy {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/img_make ap.png');
    }

    .icon-years-taste {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/2ae3635b-3ac8-4b14-97ed-f3ddabfe1ea8.png');
    }

    .icon-spring-ploughing {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/3bbe37f3-3258-4422-9ba6-4bc22e12fd89.png');
    }

    .icon-old-and-new {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/d0efa380-0998-426c-8ca6-2e1e4a6b5ec1.png');
    }

    .icon-new-year-coupon {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/d08d5982-09b0-481b-aee0-e2f9a5ffd478.png');
    }

    .icon-new-year-category-coupon {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/category-coupon.png');
    }

    .icon-new-year-group-buy {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/973e5a2a-0849-4caa-9c4a-5877abed78c7.png');
    }

    .icon-new-year-pre-buy {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/f0769311-f3f4-48a4-9e36-5a1df2079ce0.png');
    }

    .icon-redeem-code {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.10.0/redeem_code.png');
    }

    .icon-new-year-new-gift {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/02d5f25c-710b-47a4-9505-3279da0adbf1.png');
    }
    .icon-course-package {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/course-package.png');
    }
    .icon-longmen-course-package {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/龙门组合聚会学.png');
    }
    .icon-longmen-seckill {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/龙门节秒杀.png');
    }
    .icon-mp-weixin{
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.11.1/mp-weixin.png');
    }
    /*.icon-logmen-festival {*/
    /*  background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/logmen-festival.png');*/
    /*}*/
    /*.icon-longmen-sign {*/
    /*  background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/longmen-sign.png');*/
    /*}*/
    /*.icon-public-benefit {*/
    /*  background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/public-benefit.png');*/
    /*}*/

    &.bg-longmen-sign {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/营销中心背景签到.png');
    }
    &.bg-public-benefit {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/营销中心背景公益.png');
    }
    &.bg-logmen-festival {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/营销中心背景抽奖.png');
    }
    &.bg-second-buy {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/营销中心背景秒杀.png');
    }
    &.bg-together-buy {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/营销中心背景团购.png');
    }
    &.bg-booking-buy {
      background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/营销中心背景预购.png');
    }
  }

  .lock {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: -34px;
    width: 300px;
    height: 156px;
    margin-right: 34px;
    margin-bottom: 32px;
    background: rgba(0,0,0,.4);
    box-shadow: 0 4px 12px rgba(0,34,61,.2);
    cursor: pointer;
    z-index: 1;
  }

  .longmen-xian-lock{
    width: 300px;
    height: 156px;
    position: absolute;
    top: 0;
    right: -34px;
    z-index: 111;
    margin-right: 34px;
    margin-bottom: 32px;
    >div{
      display: inline-flex;
      align-items: center;
      margin-top: 100px;
      margin-left: 24px;
      padding: 4px 8px;
      font-size: 16px;
      font-weight:400;
      color: #ffffff;
      border-radius: 5px;
      background-color: #EC742E;
      cursor: pointer;
    }
  }

  .bg-longmen-sign,.bg-public-benefit,.bg-logmen-festival{
    .inter-item-content{
      h1,.desc{
        color: #ffffff;
      }
      p{
        &.count{
          color: #FDE700;
        }
        &.expired{
          color: #03B1CC;
        }
      }
    }
  }

  .bg-second-buy,.bg-together-buy,.bg-booking-buy{
    .inter-item-content{
      h1,.desc{
        color: #ffffff;
      }
      p{
        &.count{
          color: #ffffff;
        }
        &.expired{
          color: #ffffff;
        }
      }
    }
  }

</style>
