<template>
    <div class="marketing-content">
        <div class="content-detail">
            <div class="wrap">
                <el-button
                    v-if="detail.status !== 4 && detail.status !== 3"
                    type="primary"
                    @click="$router.push({ name: 'EditRedeemCode', params: { id } })"
                >
                    编 辑
                </el-button>
            </div>
            <el-form
                label-width="150px"
                label-position="left"
            >
                <p class="detail-title">
                    基本信息
                </p>
                <el-form-item label="兑换码名称">
                    {{ detail.name }}
                </el-form-item>
                <el-form-item label="兑换码数量">
                    {{ detail.exchangeCodeNumber }} 个兑换码
                </el-form-item>
                <el-form-item label="兑换码使用条件">
                    每个兑换码可兑换 {{ detail.exchangeTotal }} 个商品
                </el-form-item>
                <el-form-item label="使用时间">
                    {{ useTime }}
                </el-form-item>
                <el-form-item
                    label="使用说明"
                >
                    <pre>{{ detail.activityRule }}</pre>
                </el-form-item>
                <el-form-item
                    label="适用商品"
                >
                    <!--知识课程列表-->
                    <div class="detail-table" v-if="detail.productList && detail.productList.length">
                        <el-table :data="detail.productList" border>
                            <el-table-column label="课程图片">
                                <template #default="{row}">
                                    <img :src="row.productMainImg" width="60" height="60">
                                </template>
                            </el-table-column>
                            <el-table-column prop="productName" label="课程名称" />
                            <el-table-column label="类型">
                                <template #default="scope">
                                    {{ scope.row.productType === 2 ? '单课' : '系列课' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="状态">
                                <template #default="scope">
                                    {{ STATUS_TEXT[scope.row.status] }}
                                </template>
                            </el-table-column>
                            <el-table-column label="价格(元)">
                                <template #default="{row}">
                                    {{ row.price / 100 }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-btn">
            <el-button type="default" @click="cancel" style="width: 80px;">
                返回
            </el-button>
        </div>
    </div>
</template>

<script>
import { getRedeemCodeById } from '../../../../apis/marketing-manage/redeem-code'
import moment from 'moment'
export default {
    name: 'RedeemCodeActivityDetail',
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            detail: {},
            STATUS_TEXT: {
                1: '出售中',
                2: '已下架'
            },
            useTime: ''
        }
    },
    async created () {
        if (this.id) {
            try {
                const { data: { result } } = await getRedeemCodeById(this.id)
                this.detail = result
                this.useTime = `${ moment(result.startTime).format('YYYY-MM-DD') } - ${ moment(result.endTime).format('YYYY-MM-DD') }`
            } catch (e) {
                throw e
            }
        }
    },
    methods: {
        cancel () {
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped lang="scss">
  .marketing-content {
    width: 1614px;
    margin: 20px auto 80px auto;
    background-color: #ffffff;
    box-shadow: 0 3px 8px rgba(44, 48, 58, 0.08);
    .content-detail {
      ::v-deep .el-form-item__content {
        margin-left: 180px !important;
      }
      ::v-deep .el-form-item {
        margin-bottom: 32px;
        .el-form-item__label {
          padding-left: 30px !important;
        }
      }
      .detail-title {
        display: flex;
        align-items: center;
        height: 60px;
        margin-bottom: 24px;
        padding-left: 30px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        background-color: #fbfbfb;
        .sub-detail-title {
          color: #999999;
          margin-left: 32px;
          font-weight: normal;
        }
      }
      .activity-rule {
        width: 405px;
        border: 1px solid #cccccc;
        font-size: 12px;
        line-height: 16px;
        overflow-y: auto;
        padding: 7px 8px 8px 11px;
        color: #666666;
      }
      .award {
        color: #333333;
        font-size: 12px;
      }
      .activity-date {
        display: flex;
        align-items: center;
        .tips-icon {
          margin: 0 15px;
        }
        .date-tips {
          color: #d0423c;
        }
      }
      .inp-tips {
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
      }
      ::v-deep .separator {
        margin: 0 6px;
        color: #a8a8a8;
        font-size: 12px;
      }
      .together-product {
        display: flex;
        align-items: flex-start;
        margin-top: 14px;
        .product {
          border: 1px solid #cccccc;
          padding: 7px;
          display: flex;
          width: 420px;
          position: relative;
          img {
            width: 100px;
            height: 100px;
            margin-right: 10px;
          }
          .title {
            width: 260px;
            line-height: 1.6;
            word-break: break-all;
          }
          .remove {
            position: absolute;
            right: 7px;
            bottom: 0;
            color: #598bf8;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
      .detail-table {
        padding-right: 32px;
      }
    }
    .content-btn {
      box-sizing: border-box;
      margin-left: 24px;
      padding: 30px 0;
      border-top: 1px solid #e7e7e7;
    }
  }
</style>
