<template>
    <div :class="$style.orderDetailContainer">
        <div :class="$style.content">
            <div :class="$style.infoTop">
                <h1>已支付</h1>
                <p>订单编号： {{ detail.id }}</p>
            </div>
            <div :class="$style.infoList">
                <div :class="$style.organization">
                    <h6>机构信息</h6>
                    <div :class="$style.otherInfo">
                        <p>
                            <span>机构名称:</span>
                            <span>{{ detail.entName }}</span>
                        </p>
                        <p>
                            <span>管理员手机号:</span>
                            <span>{{ detail.enterpriseUserMobile | formatAccount }}</span>
                        </p>
                    </div>
                </div>
                <div :class="$style.listItem">
                    <h6>课程信息</h6>
                    <div :class="$style.itemGoods">
                        <img v-imgError width="60" height="60" :src="detail.courseImg || 'https://mallcdn.youpenglai.com/static/plmall/videoDefaul.jpg'" alt="">
                        <div :class="$style.goodsInfo">
                            <p>
                                <span :class="$style.infoTitle">{{ detail.resourceName }}</span>
                                <span :class="$style.infoPrice">
                                    <span>￥{{ detail.sellingPrice || 0 }}</span>
                                    <span>x 1</span>
                                </span>
                            </p>
                            <p :class="$style.infoResource">
                                <el-tooltip placement="top" effect="light">
                                    <ul slot="content">
                                        <li style="padding: 5px 0" v-for="(item,index) in detail.source.split(',')" :key="index">
                                            {{ item }}
                                        </li>
                                    </ul>
                                    <span>来源: {{ detail.source }}</span>
                                </el-tooltip>
                            </p>
                            <p :class="$style.infoTotal">
                                小计: ￥{{ detail.sellingPrice || 0 }}
                            </p>
                        </div>
                        <div :class="$style.goodsSales">
                            <p>发票状态</p>
                            <span>不支持</span>
                        </div>
                    </div>
                </div>
                <div :class="$style.listItem">
                    <h6>交易信息</h6>
                    <p>
                        <span>支付方式</span>
                        <span>微信支付</span>
                    </p>
                    <p>
                        <span>支付流水号</span>
                        <span>{{ detail.serialNo }}</span>
                    </p>
                    <p>
                        <span>下单时间</span>
                        <span>{{ detail.createTime }}</span>
                    </p>
                    <p>
                        <span>支付时间</span>
                        <span>{{ detail.payTime }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { getRepositoryOrderDetail } from '../../../../apis/subscription-service'
  @Component({

  })
export default class LiveServiceOrder extends Vue {
            detail = {
                source: ''
            }

            async created () {
                try {
                    await this.getDetail()
                } catch (e) { throw e }
            }

            async getDetail () {
                try {
                    const { result } = await getRepositoryOrderDetail(this.$route.params.id)
                    this.detail = result
                } catch (e) { throw e }
            }
}
</script>

<style module lang='scss'>

.order-detail-container {
    > .content {
        padding: 28px 0 28px 180px;
        box-sizing: border-box;
        background: #fff;
        > .info-top {
            > h1 {
                font-size: 24px;
            }
            > p {
                font-size: 20px;
                line-height: 40px;
            }
        }
        > .info-list {
            display: flex;
            flex-direction: column;
            width: 1360px;
            margin-top: 24px;
            padding: 0 24px 24px;
            background-color: #fbfbfb;
            box-shadow: 0 3px 8px 0 rgba(44, 48, 58, .08);
            > div {
                > h6 {
                    margin: 24px 0 16px 0;
                    color: #5a5a5a;
                    font-size: 18px;
                    font-weight: bolder;
                }
            }
            > .organization {
                border-bottom: 1px solid #e9e9e9;
                &:last-of-type {
                    border: none;
                }
                > .other-info {
                    margin-bottom: 16px;
                    > p {
                        display: inline-flex;
                        margin-right: 10px;
                        > span {
                            margin-right: 30px;
                            &:last-of-type {
                                color: #222;
                                font-size: 14px;
                                font-weight: bolder;
                            }
                        }
                    }
                }
            }
            > .list-item {
                border-bottom: 1px solid #e7e7e7;
                > p {
                    margin-bottom: 16px;
                    > span {
                        &:first-of-type {
                            display: inline-flex;
                            width: 200px;
                            color: #5a5a5a;
                        }
                        &:last-of-type {
                            color: #222;
                            font-size: 14px;
                            font-weight: bolder;
                        }
                    }
                }
                > .item-goods {
                    display: flex;
                    margin-bottom: 25px;
                    > img {
                        width: 60px;
                        height: 60px;
                        margin-right: 12px;
                        object-fit: cover;
                    }
                    > .goods-info {
                        width: 256px;
                        > p:first-of-type {
                            display: flex;
                            justify-content: space-between;
                        }
                        .info-title {
                            display: inline-flex;
                            width: 200px;
                            color: #454553;
                            font-size: 12px;
                        }
                        .info-price {
                            display: inline-flex;
                            flex-direction: column;
                            align-items: flex-end;
                            color: #000;
                            font-size: 12px;
                        }
                        .info-resource {
                            margin-top: 2px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-size: 12px;
                            color: #999;
                            cursor: pointer;
                        }
                        .info-total {
                            margin-top: 2px;
                            text-align: right;
                            color: #000;
                            font-size: 14px;
                        }
                    }
                    > .goods-sales {
                        display: inline-flex;
                        flex-direction: column;
                        margin-left: 50px;
                        > p {
                            color: #000;
                            font-size: 14px;
                        }
                        > span {
                            display: inline-flex;
                            align-items: center;
                            margin-top: 10px;
                            color: #999;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
}

</style>
