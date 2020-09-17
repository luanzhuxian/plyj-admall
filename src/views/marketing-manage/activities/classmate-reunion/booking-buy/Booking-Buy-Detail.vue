<template>
    <div class="together">
        <div class="together-data-top">
            <div class="together-title">
                <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/marketing-gameplay/icon_together.png">
                预购
            </div>
            <div class="activity-status">
                <span v-if="activityDetail.status === 0">未开始</span>
                <span v-if="activityDetail.status === 1">进行中</span>
                <span v-if="activityDetail.status === 2">已结束</span>
            </div>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'BookingBuyDetail'},
                {label:'活动数据',name:'BookingBuyData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div class="detail">
            <el-button
                type="primary"
                plain
                size="mini"
                @click="$router.push({name:'AddBooking', params:{id: activityDetail.id}})"
                v-if="activityDetail.status === 0 || activityDetail.status === 1"
            >
                编辑
            </el-button>
            <ul class="detail-wrap">
                <li>
                    <label>活动细则：</label>
                    <div class="rule" v-html="activityDetail.brief" />
                </li>
                <li>
                    <label>适用用户：</label>
                    <div class="value">
                        所有注册用户
                    </div>
                </li>
                <li>
                    <label>活动预热：</label>
                    <div class="value">
                        提前 {{ activityDetail.countdown || 0 }} 天预热
                    </div>
                </li>
                <li>
                    <label>活动时间：</label>
                    <div class="value">
                        {{ activityDetail.activityStartTime }} - {{ activityDetail.activityEndTime }}
                    </div>
                </li>
                <li>
                    <label>活动商品：</label>
                    <div class="product">
                        <img v-imgError :src="activityDetail.productMainImage">
                        <div class="title">
                            {{ activityDetail.productName }}
                        </div>
                    </div>
                </li>
                <li>
                    <label>核销补尾款时间：</label>
                    <div class="value">
                        {{ activityDetail.useStartTime }} - {{ activityDetail.useEndTime }}
                    </div>
                </li>
                <li>
                    <label>定金价位：</label>
                    <div class="value">
                        {{ activityDetail.price }}元
                    </div>
                </li>
                <li>
                    <label>预购库存：</label>
                    <div class="value">
                        {{ activityDetail.stock }}件
                    </div>
                </li>
                <li v-if="activityDetail.multiple">
                    <label>定金翻倍：</label>
                    <div class="value">
                        {{ activityDetail.multipleNumber }}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { bookingActivityDetail } from '../../../../../apis/marketing-manage/booking'
export default {
    data () {
        return {
            activityDetail: {}
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    created () {
        this.getBookingActivityDetail(this.id)
    },
    methods: {
        async getBookingActivityDetail (id) {
            const { data } = await bookingActivityDetail(id)
            this.activityDetail = data.result
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "booking";
  .detail{
    margin: 32px 0 0 32px;
    .detail-wrap{
      margin-top: 32px;
      font-size: 18px;
      li{
        display: flex;
        margin-top: 20px;
        label{
          color: #666666;
          margin-right: 10px;
        }
        .value{
          font-weight: bold;
          color: #333333;
        }
        .rule{
          font-weight: bold;
          color: #333333;
          word-break: break-all;
          white-space: pre-wrap
        }
        .product{
          border: 1px solid #CCCCCC;
          padding: 7px;
          display: flex;
          width: 420px;
          position: relative;
          img {
            width: 100px;
            height: 100px;
            margin-right: 10px;
          }
          .title{
            width: 290px;
            line-height: 1.6;
            word-break: break-all;
            color: #666666;
          }
        }
      }
    }
  }
</style>
