<template>
    <div class="redeem-code wrap">
        <!-- 作为兑换码页面的总入口文件 -->
        <router-view />
        <el-dialog title="如何创建兑换码" />
        <el-dialog
            :visible.sync="showGuidePage"
        >
            <div class="guide-title">
                如何创建兑换码
            </div>
            <swiper :options="swiperOption" class="guide-swiper">
                <swiper-slide>
                    <div class="guide-content">
                        <div class="guide-content-title">
                            活动说明：
                        </div>
                        <ul class="steps-ul">
                            <li><pl-svg name="icon-listIcon-8d886" width="20" class="mr-10" style="opacity: .4" />设置发放的兑换码活动：时间，个数，兑换知识课程课、系列课</li>
                            <li><pl-svg name="icon-listIcon-8d886" width="20" class="mr-10" style="opacity: .6" />活动期间均支持兑换未下架的商品</li>
                            <li><pl-svg name="icon-listIcon-8d886" width="20" class="mr-10" style="opacity: .8" />一个未作废的兑换码可以兑换兑换范围内的任意商品</li>
                            <li><pl-svg name="icon-listIcon-8d886" width="20" class="mr-10" />时间结束或商品兑换完，该兑换码均无法兑换</li>
                        </ul>
                        <div class="guide-content-title">
                            创建步骤：
                        </div>
                        <div class="steps">
                            <span class="dot" />第一步
                        </div>
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.10.0/redeemcode_list.png" width="736" height="414">
                    </div>
                </swiper-slide>
                <swiper-slide>
                    <div class="guide-content">
                        <div class="guide-content-title">
                            创建步骤：
                        </div>
                        <div class="steps">
                            <span class="dot" />第二步
                        </div>
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.10.0/redeemcode_create.png" width="736" height="414">
                    </div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination" />
            </swiper>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { isHasRead } from '../../../../apis/marketing-manage/redeem-code'
import moment from 'moment'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'RedeemCode',
    components: {
        swiper,
        swiperSlide
    },
    data () {
        return {
            programId: '',
            showGuidePage: false,
            swiperOption: {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                loop: true
            }
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async mounted () {
        try {
            const { result } = await isHasRead()
            this.showGuidePage = !result
        } catch (e) {
            throw e
        }
    },
    async activated () {
        const routeName = this.$route
        if (routeName.path.indexOf('redeem-code/') !== -1) {
            this.programId = '8'
        }
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
            return
        }
        const redeemCodeInformation = this.marketStatusAuth.find(({ programId }) => programId === '8')
        const redeemCodeStatus = !!(redeemCodeInformation && moment(redeemCodeInformation.validity).valueOf() > moment().valueOf())
        const status = !!(this.programId === '8' && !redeemCodeStatus)
        if (status) this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    }
}
</script>
<style lang="scss" scoped>
  .redeem-code {
    min-height: calc(100vh - 52px);
    background-color: #fff;
    padding-bottom: 30px;
    .guide-title{
      color: #333;
      font-size: 24px;
      font-family: "Microsoft YaHei";
      font-weight: bold;
      text-align: center;
    }
    .guide-swiper{
      padding-bottom: 50px;
      .guide-content{
        width:736px;
        margin: 0 auto;
        .steps-ul{
          padding: 16px 24px;
          background: #F8F8F8;
          border-radius:18px;
          li{
            font-size: 18px;
            line-height: 50px;
          }
        }
        .guide-content-title{
          font-weight: bold;
          font-size: 18px;
          color: #333;
          margin: 32px 0 12px 10px;
        }
        .steps{
          font-weight: bold;
          font-size: 18px;
          margin: 12px 0;
          color: #4F63FF;
          .dot{
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #4F63FF;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
      }
    }
  }
  ::v-deep .swiper-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    padding: 0 10px;
    height: 18px;
    margin: auto;
    background: rgba(89, 139, 248, .2);
    border-radius: 36px;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    bottom: 8px;
    cursor: pointer;
    .swiper-pagination-bullet {
      opacity: 1;
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
    }
    .swiper-pagination-bullet-active {
      background: rgba(89, 139, 248, .6);
      width: 13px;
      border-radius: 36px;
    }
  }
</style>
