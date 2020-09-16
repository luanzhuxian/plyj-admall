<template>
    <div class="invoice-details">
        <el-dialog
            :title="title"
            :visible="show"
            @close="$emit('update:show',false)"
            width="443px"
        >
            <div class="detail-Box">
                <div class="detail-content">
                    <span>申请时间：{{ data.createTime }}</span>
                    <!--          ({{ data.applyUserRoleName }})-->
                    <span>申请人：{{ data.userName }}</span>
                    <span v-if="data.invoiceTime">开票时间：{{ data.invoiceTime }}</span>
                    <span v-if="data.invoiceNumber">开票号：{{ data.invoiceNumber }}</span>
                </div>
                <div class="order-box">
                    <div
                        class="order-content"
                        v-for="(items,index) in data.orderInfos"
                        :key="index"
                    >
                        <div class="detail-content">
                            <span>订单编号：{{ items.orderId }}</span>
                            <span>下单时间：{{ items.orderCreateTime }}</span>
                        </div>
                        <div class="detail-content">
                            <span>商品类型：{{ orderTypeText[items.goodsType] }}</span>
                            <span>商品金额：{{ (items.orderAmount - items.freight)/100 }}元</span>
                            <span>开票商品：{{ items.goodsName }} x {{ items.count }}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-content">
                    <span>发票形式：纸质发票</span>
                    <span>开票总额：{{ data.amount/100 }}元 <span v-if="data.coupon || data.scholarship">（优惠金额不支持开具发票）</span></span>
                    <span>发票类型：{{ invoiceTypeText[data.invoiceType] }}</span>
                    <span>发票抬头：{{ data.invoiceTitle }}</span>
                    <span v-if="data.invoiceType > 0">发票税号：{{ data.taxpayerNumber }}</span>
                    <span>发票内容：明细</span>
                    <span>发票备注：{{ data.description }}</span>
                    <span v-if="data.mailingMethod === '1'">收票方式：门店自提</span>
                    <span v-else>收票地址：{{ data.recvName }} {{ data.recvMobile }} {{ data.recvAddr }}</span>
                    <span v-if="data.invoiceType === 0">开票人电话: {{ data.companyPhone }}</span>
                </div>
                <div class="detail-content" v-if="data.mailingMethod === '1'">
                    <span>收票人姓名：{{ data.orderInfos[0].userName }}</span>
                    <span>收票人电话：{{ data.orderInfos[0].mobile }}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getInvoiceDetail } from '../../apis/order'
export default {
    name: 'InvoiceDetails',
    data () {
        return {
            orderStatusText: {
                0: '待开票',
                1: '已开票',
                2: '已取消'
            },
            invoiceTypeText: {
                0: '个人发票',
                1: '企业增值税普票',
                2: '企业增值税专票'
            },
            orderTypeText: {
                VIRTUAL_GOODS: '虚拟商品',
                PHYSICAL_GOODS: '实体商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课程',
                LIVE_GOODS: '直播订单'
            },
            title: '发票详情',
            data: {}

        }
    },
    props: {
        show: Boolean,
        id: {
            type: String,
            required: true
        }
    },
    watch: {
        async show (val) {
            if (val) {
                try {
                    await this.getInvoiceDetail()
                } catch (e) {
                    throw e
                }
            }
        }
    },
    methods: {
        async getInvoiceDetail () {
            try {
                const { data: { result } } = await getInvoiceDetail(this.id)
                this.data = result
                this.title = this.orderStatusText[result.status]
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .invoice-details{
    .detail-Box {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      line-height: 21px;

      > .detail-content {
        display: flex;
        flex-direction: column;
        padding: 16px 0;
        border-bottom: 1px solid #E7E7E7;

        span {
          padding: 6px 0;
        }
      }

      > .detail-content:first-child {
        padding-top: 0;
      }

      .order-box {
        padding: 16px 0;
        border-bottom: 1px solid #E7E7E7;
        font-size: 14px;
        color: #666;

        .order-content {
          padding-bottom: 16px;

          .detail-content {
            display: flex;
            flex-direction: column;
            background-color: #F6F6F6;
            padding: 16px;

            > span {
              padding: 6px 0;
            }

            .commodity {
              padding: 6px 0;
              display: flex;
              flex-direction: row;

              .commodity-title {
                /*width: 124px;*/
              }

              .commodity-content {
                display: flex;
                flex: 1;
                flex-direction: column;
                div {
                  display: flex;
                  /*justify-content: space-between;*/
                  padding: 5px 0;
                  .commodity-name {
                    width: 233px;
                  }

                  .commodity-num {
                    width: 60px;
                    padding-left: 15px;
                  }
                }
                div:first-child{
                  padding-top: 0;
                }
              }
            }
          }

          .detail-content:first-child {
            border-bottom: 1px solid #E7E7E7;
          }
        }

        .order-content:last-child {
          padding-bottom: 0;
        }
      }
    }
  }
</style>
