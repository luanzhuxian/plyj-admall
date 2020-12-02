<template>
    <!--<PlMask :show="show" @close="close">
    <div class="goods-content-bg">
      <div class="goods-content" title="滚动转轮，上下滚动">

      </div>
    </div>
  </PlMask>-->
    <Preview :show="show" @close="close">
        <div v-if="show">
            <div class="header" :class="[$route.name.includes('Courses')? 'header2':'header1']" />
            <swiper :options="swiperOption" class="banner">
                <swiperSlide
                    v-for="(img, index) of banners"
                    :key="index"
                >
                    <img
                        class="bannerImg"
                        v-if="img.indexOf('video/')> -1"
                        :src="img + '?x-oss-process=video/snapshot,t_5000,m_fast'"
                        :key="img"
                        alt=""
                    >
                    <img
                        class="bannerImg"
                        v-else
                        :src="img"
                        :key="img"
                        alt=""
                    >
                </swiperSlide>
            </swiper>
            <!-- 团购未开始预览 -->
            <div class="activity-bar together" v-if="data.activityProductModel.status === 0 && data.activeProduct === 2">
                <div class="pre-text" />
                <div class="line" />
                <div>
                    <together-count-down
                        @done="countFinished"
                        activity-text="距活动开始仅剩"
                        :endtime="data.activityProductModel.activityStartTime"
                    />
                    <div class="desc">
                        活动商品数量{{ data.activityProductModel.stock }}件，成团最多瓜分{{ data.activityProductModel.prizePool }}元
                    </div>
                </div>
            </div>
            <!-- 团购进行中预览 -->
            <div class="activity-bar now-together" v-if="data.activityProductModel.status === 1 && data.activeProduct === 2">
                <div class="now-text" />
                <div class="line" />
                <div>
                    <together-count-down
                        @done="countFinished"
                        activity-text="距活动结束仅剩"
                        :endtime="data.activityProductModel.activityEndTime"
                    />
                    <div class="desc">
                        <div class="progress">
                            <div class="percent" :style="{width: (data.activityProductModel.number / data.activityProductModel.stock) * 100 + '%' }" />
                        </div>
                        <div>{{ data.activityProductModel.stock || 0 }}人</div>
                    </div>
                </div>
            </div>
            <div class="activity-bar second" v-if="data.activeProduct === 3">
                <!-- 秒杀未开始预览 -->
                <div class="activity-product" v-if="data.activityProductModel.status === 0">
                    <div class="price">
                        <div class="second-price">
                            {{ data.activityProductModel.price }}
                        </div>
                        <del class="original" v-if="(minPrice !== maxPrice || maxOriginalPrice !== maxPrice) && maxOriginalPrice" v-text="maxOriginalPrice" />
                    </div>
                    <div class="desc">
                        活动限量{{ data.activityProductModel.stock }}件
                    </div>
                </div>
                <!-- 秒杀进行中预览 -->
                <div class="activity-product" v-if="data.activityProductModel.status === 1">
                    <div class="price">
                        <div class="second-price">
                            {{ data.activityProductModel.price }}
                        </div>
                        <del class="original" v-if="(minPrice !== maxPrice || maxOriginalPrice !== maxPrice) && maxOriginalPrice" v-text="maxOriginalPrice" />
                        <div class="number">
                            已抢 {{ data.activityProductModel.number }}
                        </div>
                    </div>
                    <div class="desc">
                        <div class="progress">
                            <div class="percent" :style="{width: (data.activityProductModel.number / data.activityProductModel.stock) * 100 + '%' }" />
                        </div>
                        <div>共 {{ data.activityProductModel.stock || 0 }} 件</div>
                    </div>
                </div>
                <book-count-down
                    @done="countFinished"
                    activity-text="距离结束"
                    v-if="data.activityProductModel.status === 1"
                    :endtime="data.activityProductModel.activityEndTime"
                />
                <book-count-down
                    @done="countFinished"
                    activity-text="距离开始"
                    v-if="data.activityProductModel.status === 0"
                    :endtime="data.activityProductModel.activityStartTime"
                />
            </div>
            <div class="activity-bar booking" v-if="data.activityProductModel.status === 0 && data.activeProduct === 4">
                <div class="pre-text" />
                <div class="line" />
                <div>
                    <together-count-down
                        @done="countFinished"
                        activity-text="距活动开始仅剩"
                        :endtime="data.activityProductModel.activityStartTime"
                    />
                    <div class="desc">
                        预交定金翻{{ data.activityProductModel.multipltNumber }}倍，最低{{ data.activityProductModel.lowestPrice }}元可得商品
                    </div>
                </div>
            </div>
            <div class="activity-bar now-booking" v-if="data.activityProductModel.status === 1 && data.activeProduct === 4">
                <div class="now-text" />
                <div class="line" />
                <div>
                    <together-count-down
                        @done="countFinished"
                        activity-text="距活动结束仅剩"
                        :endtime="data.activityProductModel.activityEndTime"
                    />
                    <div class="desc">
                        <div class="progress">
                            <div class="percent" :style="{width: (data.activityProductModel.number / data.activityProductModel.stock) * 100 + '%' }" />
                        </div>
                        <div>{{ data.activityProductModel.stock || 0 }}人</div>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="info-top">
                    <div class="info-top-left">
                        <div class="price" v-if="data.activeProduct === 4 && data.preActivity === 2">
                            定金&nbsp;<span>{{ data.activityProductModel.price || bookMinPrice.depositPrice }}</span>
                            抵&nbsp;<span>{{ data.activityProductModel.depositTotal || bookMinPrice.depositPrice * bookMinPrice.multipleNumber }}</span>
                        </div>
                        <div class="price" v-else-if="data.activeProduct !== 1 && data.activeProduct !== 4 && data.preActivity === 2">
                            {{ data.activityProductModel.price }}
                        </div>
                        <div class="price" v-else>
                            <span>{{ minPrice }}</span>
                            <span v-if="minPrice&&maxPrice&&(minPrice !== maxPrice)">~{{ maxPrice }}</span>
                            <del v-if="maxOriginalPrice&&((minPrice !== maxOriginalPrice))" v-text="maxOriginalPrice" />
                        </div>
                        <div class="buy-count" v-if="data.salesVolume || data.pageviews">
                            <span v-if="data.salesVolume === 0">正在热销中</span>
                            <template v-else-if="data.salesVolume > 0 && data.salesVolume < 10">
                                <span v-text="data.pageviews" />人关注
                            </template>
                            <template v-else-if="data.salesVolume >= 10">
                                <span v-text="data.salesVolume" />人{{ $route.name.includes('Courses')?'报名':'购买' }}
                            </template>
                        </div>
                    </div>
                    <div class="info-top-right" v-if="realRebate">
                        <div class="right-top">
                            <span>润笔</span>
                            <span>
                                ￥<i v-if="minRebate" v-text="minRebate" />
                                <i v-if="minRebate && maxRebate && (minRebate !== maxRebate)">~</i>
                                <i v-if="maxRebate && (minRebate !== maxRebate)" v-text="maxRebate" />
                                润笔
                            </span>
                        </div>
                        <p>分享下单即可获得润笔</p>
                    </div>
                </div>

                <div class="pro-name" v-text="data.productName" />
                <div class="pro-desc" v-text="data.productDesc" />
                <div class="tags">
                    <div v-for="(item, i) of data.labelModels" :key="i" v-text="item.labelName" />
                </div>
                <div class="daterange" v-if="data.productType !== 'PHYSICAL_GOODS'">
                    <i class="el-icon-date icon-date" />
                    <span class="date-title">有效期：</span>
                    <span class="date-content" v-if="data.validityPeriodStart && data.validityPeriodEnd">{{ data.validityPeriodStart.split(' ')[0].replace(/-/g,'.') }}<span v-if="data.validityPeriodStart.split(' ')[0] !== data.validityPeriodEnd.split(' ')[0]">-{{ data.validityPeriodEnd.split(' ')[0].replace(/-/g,'.') }}</span></span>
                    <span class="date-content" v-else>长期有效</span>
                </div>
            </div>

            <div class="fields" v-if="data.productType === 'PHYSICAL_GOODS'">
                <span>快递</span>
                <span>快递：普通快递</span>
            </div>
            <div class="fields" v-if="data.productSkuModels[0]">
                <span>选择</span>
                <span>
                    已选择：“
                    <i v-text="data.productSkuModels[0].skuCode1Name" />
                    <template v-if="data.productSkuModels[0].skuCode2Name">
                        ，<i v-text="data.productSkuModels[0].skuCode2Name" />
                    </template>
                    ”
                </span>
            </div>

            <div class="detail-comment">
                <div class="tab">
                    <!--<span :class="{ tabComment: true, active: tab === 1}" @click="tab = 1">雅客评论</span>-->
                    <span :class="{ tabDetail: true, active: tab === 2}" @click="tab = 2">{{ $route.name.includes('Courses')?'课程':'商品' }}详情</span>
                </div>
                <div class="comment" v-show="tab === 1">
                    123333
                </div>
                <div class="detail" v-show="tab === 2" v-html="data.detail" />
            </div>
        </div>
    </Preview>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import TogetherCountDown from './Count-Down'
import BookCountDown from './Book-Count-Down'
// import PlMask from '../common/PlMask.vue'
import Preview from '../../common/Preview.vue'
export default {
    name: 'GoodsPreview',
    components: {
        swiper,
        swiperSlide,
        TogetherCountDown,
        BookCountDown,
        // PlMask,
        Preview
    },
    data () {
        return {
            swiperOption: {
                autoplay: true,
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            tab: 2
        }
    },
    props: {
        show: Boolean,
        data: {
            type: Object,
            default () {
                return {
                    mediaInfoIds: [],
                    productSkuModels: [],
                    productName: '',
                    salesVolume: 0,
                    productDesc: '',
                    labelModels: [],
                    detail: '',
                    productMainImage: ''
                }
            }
        },
        type: {
            type: String,
            default: ''
        }
    },
    computed: {
        realRebate () {
            const rebate = this.data.productSkuModels.find(item => Boolean(item.realRebate))
            return rebate ? rebate.realRebate : ''
        },
        rebateList () {
            return this.data.productSkuModels.map(item => item.realRebate) || []
        },
        maxRebate () {
            return Math.max(...this.rebateList)
        },
        minRebate () {
            return Math.min(...this.rebateList)
        },
        priceList () {
            return this.data.productSkuModels.map(item => item.price) || []
        },
        maxPrice () {
            return Math.max(...this.priceList)
        },
        minPrice () {
            return Math.min(...this.priceList)
        },
        bookMinPrice () {
            return this.data.activityProductModel.skuModelList.filter(item => item.depositPrice * item.multipleNumber - item.depositPrice === Math.max(...this.data.activityProductModel.skuModelList.map(item => item.depositPrice * item.multipleNumber - item.depositPrice) || []))[0]
        },
        originalPriceList () {
            return this.data.productSkuModels.map(item => item.originalPrice) || []
        },
        maxOriginalPrice () {
            return Math.max(...this.originalPriceList)
        },
        // 处理banner, 用主图替换banner中的第一个图片
        banners () {
            const { mediaInfoIds = [], productMainImage } = this.data
            if (mediaInfoIds.length && productMainImage) {
                if (mediaInfoIds[0].indexOf('video/') === -1) {
                    // 第一个不是video，直接替换
                    return [productMainImage, ...mediaInfoIds.slice(1)]
                }
                // 第一个是视频，替换第二个，为了不影响源数据，需要复制一遍数组
                const BANNER = [...mediaInfoIds]
                BANNER.splice(1, 1, productMainImage)
                return BANNER
            }
            return []
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        countFinished () {
            this.$set(this.detail, 'serverTime', '')
            this.$set(this.detail, 'shoppingTimeLong', '')
        }
    }
}
</script>
<style scoped lang="scss">
  $em: 330 / 750;
  .header1 {
    height: 76px * $em;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/page-top1.png");
    background-size: 100%;
  }
  .header2 {
    height: 76px * $em;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/page-top2.png");
    background-size: 100%;
  }
  .bannerImg {
    width: 750px * $em;
    height: 500px * $em;
    object-fit: cover;
  }
  .banner {
    overflow: hidden;
  }
  /*&::-webkit-scrollbar {*/
    /*display: none;*/
  /*}*/
  /*&::-moz-viewport-scroll {*/
    /*display: none;*/
  /*}*/
  .activity-bar{
    height: 50px;
    display: flex;
    align-items: center;
    &.together{
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/pre_bg.png");
      background-size: 100% 100%;
      padding: 0 10px;
      .pre-text{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/pre_text.png") no-repeat;
        background-size: 100% 100%;
        width: 31px;
        height: 32px;
      }
    }
    &.now-together{
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/now_bg.png") no-repeat;
      background-size: 100% 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .now-text{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/now_text.png") no-repeat;
        background-size: 100% 100%;
        width: 31px;
        height: 32px;
      }
    }
    .line{
      width: 1px;
      height: 33px;
      background: #ffffff;
      margin: 0 8px;
    }
    .desc{
      display: flex;
      color: #ffffff;
      align-items: center;
      font-size: 10px;
      height: 17px;
      margin-top: 1px;
      .progress{
        width: 200px;
        height: 5px;
        background: rgba(255, 255, 255, .5);
        border-radius: 103px;
        display: flex;
        align-items: center;
        margin-right: 8px;
        .percent{
          height: 5px;
          background: #ffffff;
          border-radius: 103px;
        }
      }
    }
    &.second{
      height: 60px;
      background: #FF3323;
      padding-left: 24px;
      justify-content: space-between;
      .price{
        display: flex;
        align-items: baseline;
        .second-price{
          font-size: 26px;
          color: #ffffff;
          display: flex;
          align-items: baseline;
          &:before{
            content: '¥';
            font-size: 12px;
          }
        }
        .original{
          font-size: 13px;
          color: #FFD9CE;
          margin-left: 10px;
          &:before{
            content: '¥';
            font-size: 13px;
          }
        }
      }
      .number{
        color: #EEEEEE;
        font-size: 13px;
        margin-left: 10px;
      }
      .desc{
        display: flex;
        color: #ffffff;
        align-items: center;
        font-size: 10px;
        height: 17px;
        margin-top: 1px;
        .progress{
          width: 138px;
          height: 5px;
          background: rgba(255, 255, 255, .5);
          border-radius: 103px;
          display: flex;
          align-items: center;
          margin-right: 8px;
          .percent{
            height: 5px;
            background: #ffffff;
            border-radius: 103px;
          }
        }
      }
    }
    &.booking{
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_bg.png");
      background-size: 100% 100%;
      padding: 0 10px;
      .pre-text{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_text.png") no-repeat;
        background-size: 100% 100%;
        width: 31px;
        height: 32px;
      }
    }
    &.now-booking{
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_bg.png") no-repeat;
      background-size: 100% 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .now-text{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_text.png") no-repeat;
        background-size: 100% 100%;
        width: 31px;
        height: 32px;
      }
    }
  }
  .product-info {
    padding: 12px * $em 24px * $em;
    background-color: #fff;
  }
  .info-top {
    display: flex;
  }
  .info-top-left {
    flex: 1;
    .price {
      span {
        font-size: 56px * $em;
        margin-right: 16px * $em;
        color: #FE7700;
      }
      span:first-child {
        &:before {
          content: '¥';
          font-size: 38px * $em;
        }
      }
      del {
        font-size: 26px * $em;
        color: #999;
        &:before {
          content: '¥';
        }
      }
    }
    .buy-count {
      font-size: 24px * $em;
      color: #FE7700;
    }
  }
  .info-top-right {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 12px;
    .right-top {
      > span {
        &:nth-of-type(1) {
          display: inline-block;
          width: 40px;
          line-height: 20px;
          margin-right: 15px * $em;
          color: #fff;
          border-radius: 24px * $em;
          text-align: center;
          background-color: #FE7700;
        }
      }
    }
    > p {
      color: #999;
      margin-top: 6px;
    }
  }
  .pro-name {
    margin-top: 26px * $em;
    color: #000;
    line-height: 36px * $em;
    font-size: 28px * $em;
  }
  .pro-desc {
    margin-top: 12px * $em;
    font-size: 12px;
    color: #666;
  }
  .tags {
    margin-top: 28px * $em;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin-bottom: 12px * $em;
      margin-right: 5px;
      padding: 3px 6px;
      font-size: 12px;
      color: #666;
      border: 1px solid #E1E2E6;
      background-color: #f6f7fa;
    }
  }
  .daterange{
    border-top: 1px solid #ddd;
    padding-top: 5px;
    font-size: 12px;
    .icon-date{
      color: #cccccc;
      padding-right: 5px;
    }
    .date-title{
      color: #999;
    }
    .date-content{
      color: #333333;
    }
  }
  .fields {
    display: flex;
    align-items: center;
    height: 88px * $em;
    padding: 0 24px * $em;
    margin-top: 20px * $em;
    background-color: #fff;
    > span {
      font-size: 28px * $em;
      color: #000;
      &:nth-of-type(1) {
        color: #999;
        margin-right: 40px * $em;
      }
    }
  }
  .detail-comment {
    margin-top: 20px * $em;
    background-color: #fff;
    .tab {
      position: relative;
      display: flex;
      line-height: 90px * $em;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid #e7e7e7;
      &:after {
        position: absolute;
        content: '';
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        height: 26px * $em;
        width: 2px;
        background-color: #f0f0f0;
      }
      > span {
        position: relative;
        display: block;
        color: #999;
        font-size: 26px * $em;
        text-align: center;
        cursor: pointer;
        &.active {
          color: #000;
          &:after {
            position: absolute;
            content: '';
            bottom: 0;
            left: 0;
            height: 2px;
            width: 100%;
            background-color: #000;
          }
        }
      }
    }
    .detail {
      padding: 10px;
      ::v-deep img {
        width: 100% !important;
      }
    }
    .comment {
      padding: 10px;
    }
  }
</style>
