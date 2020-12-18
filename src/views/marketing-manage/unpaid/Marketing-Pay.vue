<template>
    <div class="pay-content-box">
        <div class="content-title">
            支付与订单
        </div>
        <div class="precautions">
            *已线下报名参与主题课，营销方案包将自动开通，无需重复购买
        </div>
        <el-form label-width="150px" label-position="left" class="main-form">
            <el-form-item label="营销方案">
                <span class="description">{{ getBaseMarketData.programName }}</span>
            </el-form-item>

            <el-form-item label="活动内容">
                <div class="inter-item" :class="bgClass">
                    <div class="inter-item-content">
                        <h1>
                            {{ getBaseMarketData.programName }}
                        </h1>
                        <p class="desc">
                            <span v-if="programId === '1'">组合商品打包售卖，<br>立享优惠</span>
                            <span v-if="programId === '2'">粽行四海，端午安康</span>
                            <span v-if="programId === '3'">限时抢购，引导用户消费</span>
                            <span v-if="programId === '4'">微信裂变，快速引流</span>
                            <span v-if="programId === '5'">分批支付提前享服务</span>
                            <span v-if="programId === '6'">学子携手，贡献爱心</span>
                            <span v-if="programId === '7'">抽奖嗨翻天</span>
                            <span v-if="programId === '8'">支持多商品兑换，使用即可减免商品费用</span>
                            <span v-if="programId === '9'">低价购买福利红包，支付抵扣享优惠</span>
                            <span v-if="programId === '10'">低成本高引流，多种主题任意选</span>
                            <span v-if="programId === '11'">打卡签到答题，即可参与抽奖，有机会获得智慧礼</span>
                        </p>
                        <p class="active count">
                            当前活动：0个
                        </p>
                        <p class="deactive expired">
                            使用有效期： <span v-if="parseInt(getBaseMarketData.validityNumber/365)">{{ parseInt(getBaseMarketData.validityNumber/365) }} 年</span>
                            <span v-if="getBaseMarketData.validityNumber - 365*parseInt(getBaseMarketData.validityNumber/365)"> {{ getBaseMarketData.validityNumber - 365*parseInt(getBaseMarketData.validityNumber/365) }} 天</span>
                        </p>
                    </div>
                    <div v-if="!bgClass" class="inter-item-icon">
                        <img v-if="programId === '1'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/组合聚惠学.png">
                        <img v-if="programId === '2'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/粽粽有礼.png">
                        <img v-if="programId === '3'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/秒杀.png">
                        <img v-if="programId === '4'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png">
                        <img v-if="programId === '5'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/预购.png">
                        <img v-if="programId === '6'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公益行动.png">
                        <img v-if="programId === '7'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/龙门抽大奖.png">
                        <img v-if="programId === '8'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/兑换码.png">
                        <img v-if="programId === '9'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/福利红包.png">
                        <img v-if="programId === '10'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/抽奖乐翻天.png">
                        <img v-if="programId === '11'" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/打卡聪明年.png">
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="支付方式">
                <div class="pay-wechat">
                    <pl-svg width="28" name="icon-wechat" />
                    微信支付
                </div>
            </el-form-item>

            <el-form-item label="订单信息">
                <div class="order-information">
                    <el-form-item>
                        <span slot="label" class="information-label">
                            订购店铺：
                        </span>
                        <span class="information-description">{{ getBaseMarketData.mallName }}</span>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label" class="information-label">
                            订购机构：
                        </span>
                        <span class="information-description">{{ getBaseMarketData.entName }}</span>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label" class="information-label">
                            方案金额：
                        </span>
                        <span class="information-description">￥{{ getBaseMarketData.presentPrice }}</span>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label" class="information-label">
                            使用有效期：
                        </span>
                        <span class="information-description">订购起 <span v-if="parseInt(getBaseMarketData.validityNumber/365)">{{ parseInt(getBaseMarketData.validityNumber/365) }} 年</span> <span
                            v-if="getBaseMarketData.validityNumber - 365*parseInt(getBaseMarketData.validityNumber/365)"
                        > {{ getBaseMarketData.validityNumber - 365*parseInt(getBaseMarketData.validityNumber/365) }} 天</span>内有效</span>
                    </el-form-item>
                </div>
            </el-form-item>
            <el-form-item label="应付金额">
                <div class="price-box">
                    <span>￥{{ getBaseMarketData.presentPrice }}</span>
                </div>
                <div>
                    <el-checkbox v-model="agree" :true-label="1" :false-label="0">
                        <span style="font-size: 12px">我已阅读并同意</span>
                    </el-checkbox>
                    <el-button type="text" @click="showAgreement = true">
                        《服务协议》
                    </el-button>
                </div>
                <el-button :disabled="!agree" class="buy" type="primary" size="large" @click="buy">
                    立即订购
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            :visible.sync="showPayCode"
            width="330px"
            :show-close="false"
            :close-on-click-modal="false"
        >
            <div class="pay-code">
                <p class="p20">
                    支付金额
                </p>
                <div class="p20 prcie">
                    {{ getBaseMarketData.presentPrice }} 元
                </div>
                <p>
                    <img :src="payCode" alt="">
                </p>
                <p class="p18">
                    <pl-svg width="16" name="icon-scanning-d5a28" />
                    微信扫一扫支付
                </p>
                <div class="button">
                    <el-button v-if="payStatus === 'WAIT_PAY'" type="primary" :loading="loading">
                        正在支付
                    </el-button>
                    <el-button v-else-if="payStatus === 'FINISHED' && rechargeStatus === 'WAIT_PAY'" type="primary"
                               :loading="loading"
                    >
                        正在支付
                    </el-button>
                    <el-button v-else-if="payStatus === 'FINISHED' && rechargeStatus === 'SUCCESS'" type="primary"
                               @click="payDone" :loading="loading"
                    >
                        支付成功
                    </el-button>
                    <el-button v-else type="danger" @click="retryFailedOrder" :loading="loading">
                        支付失败，请重试
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <Agreement :show.sync="showAgreement" type="1" />
    </div>
</template>

<script>
import Agreement from '../../../components/register/Agreement'
import { retryFalidOrder } from '../../../apis/product-center/online-teaching/live'
import { getBaseMarket, getMarketPayCode, getMarketPayStatus } from '../../../apis/marketing-manage/gameplay'
import { mapActions } from 'vuex'
import { MutationTypes } from '../../../store/mutation-type'
export default {
    name: 'CoursePackagePay',
    components: { Agreement },
    props: {
        programId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            getBaseMarketData: {},
            agree: 0,
            loading: true,
            // 等待支付
            payStatus: 'WAIT_PAY',
            // 等待充值
            rechargeStatus: 'WAIT_PAY',
            showPayCode: false,
            payCode: '',
            showAgreement: false,
            bgClass: ''
        }
    },
    async created () {
        try {
            await this.getBaseMarket()
        } catch (e) {
            throw e
        }
    },
    beforeDestroy () {
        this.loading = true
        this.showPayCode = false
        this.bgClass = ''
        clearInterval(this.timer)
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
        // 查询年年翻活动详情
        async getBaseMarket () {
            try {
                const { result } = await getBaseMarket(this.programId)
                this.getBaseMarketData = result
            } catch (e) {
                throw e
            }
        },
        async buy () {
            try {
                const data = await getMarketPayCode(this.getBaseMarketData.id)
                this.payCode = `data:image/gif;base64,${ data.result.qrCode }`
                this.showPayCode = true
                clearInterval(this.timer)
                this.timer = setInterval(() => {
                    this.getOrderStatus(data.result.orderId)
                }, 1500)
            } catch (e) {
                throw e
            }
        },
        // 获取订单支付状态
        async getOrderStatus (orderId) {
            this.orderId = orderId
            try {
                const { result } = await getMarketPayStatus(orderId)
                const {
                    payStatus,
                    rechargeStatus
                } = result
                this.payStatus = payStatus
                this.rechargeStatus = rechargeStatus
                if ((payStatus === 'FINISHED' && rechargeStatus === 'SUCCESS') || rechargeStatus === 'ERROR') {
                    clearInterval(this.timer)
                    this.loading = false
                }
                // 支付成功后，退出到入口页面
                if (payStatus === 'FINISHED' && rechargeStatus === 'SUCCESS') {
                    await this.$success('支付成功')
                    await this[MutationTypes.getMarketStatusAuth]()
                    this.payDone()
                }
            } catch (e) {
                throw e
            }
        },
        async retryFailedOrder () {
            try {
                this.loading = true
                await retryFalidOrder(this.orderId)
                this.timer = setInterval(() => {
                    this.getOrderStatus(this.orderId)
                }, 1500)
            } catch (e) {
                throw e
            }
        },
        payDone () {
            this.showPayCode = false
            switch (this.programId) {
                case '1':
                    this.$router.replace({ name: 'CoursePackage' })
                    break
                case '2':
                    this.$router.replace({ name: 'GeneralCoursePackage' })
                    break
                case '3':
                    this.$router.replace({ name: 'SecondBuy' })
                    break
                case '4':
                    this.$router.replace({ name: 'NewYearTogetherBuy' })
                    break
                case '5':
                    this.$router.replace({ name: 'NewYearBookingBuy' })
                    break
                case '6':
                    this.$router.replace({ name: 'LongmenPublicBenefit' })
                    break
                case '7':
                    this.$router.replace({ name: 'LongmenLottery' })
                    break
                case '8':
                    this.$router.replace({ name: 'RedeemCode' })
                    break
                case '9':
                    this.$router.replace({ name: 'RedPackage' })
                    break
                case '10':
                    this.$router.replace({ name: 'HappyLottery' })
                    break
                case '11':
                    this.$router.replace({ name: 'NewYearSignIn' })
                    break
            }
            // 粽粽有礼信息
            // 秒杀信息
            // 团购信息
            // 预购信息
            // 公益活动
            // 龙门抽奖
        }
    }
}
</script>

<style lang="scss" scoped>
.main-form {
    margin-top: 32px;

    ::v-deep .el-form-item__label {
        padding-left: 30px !important;
    }
}
.pay-content-box {
    background-color: #fff;
    .content-title {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        height: 60px;
        margin-top: 37px;
        padding-left: 30px;
        font-size: 14px;
        font-weight: bold;
        border-top: 1px solid #e7e7e7;
        background-color: #fbfbfb;
    }

    .precautions {
        padding-left: 24px;
        font-size: 14px;
        font-weight: 400;
        color: #ec742e;
    }

    .description {
        font-size: 14px;
        font-weight: 400;
        color: #333;
    }

    .inter-item {
        position: relative;
        width: 300px;
        height: 156px;
        padding: 15px 0 20px 24px;
        margin-right: 34px;
        margin-bottom: 32px;
        background-color: #fff;
        box-shadow: 0 4px 12px rgba(0, 34, 61, .2);
        cursor: pointer;

        .inter-item-content {
            position: absolute;
            left: 15px;
            top: 20px;
            z-index: 1;

            h1 {
                margin-bottom: 8px;
                font-size: 16px;
                color: #333;
                cursor: pointer;
            }

            p {
                color: #999;
                font-size: 12px;
                line-height: 16px;

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
                margin-bottom: 18px;
            }
        }

        .inter-item-icon {
            position: absolute;
            top: 15px;
            right: 0;
            width: 112px;
            height: 121px;
            img{
                width: 100px;
                height: 100px;
                margin-top: 10px;
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
    }

    .price-box {
        padding-bottom: 22px;
        font-size: 36px;
        font-weight: bold;
        color: #ec742e;
    }

    .buy {
        width: 325px;
        height: 48px;
        margin-top: 18px;
        font-size: 14px;
    }

    .pay-wechat {
        width: 164px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid #598bf8;
        font-size: 18px;
        color: #333;
        font-weight: 400;

        svg {
            margin-right: 16px;
        }
    }

    .order-information {
        width: 633px;
        padding: 24px 0 12px;
        background: #f8f8f8;

        .information-label {
            display: flex;
            justify-content: flex-end;
            font-size: 18px;
            font-weight: 400;
            color: #666;
        }

        .information-description {
            padding-left: 20px;
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    }

    .pay-code {
        text-align: center;

        .p18 {
            font-size: 18px;
        }

        .p20 {
            font-size: 20px;
        }

        img {
            width: 200px;
        }

        .button {
            margin-top: 20px;
        }

        .prcie {
            margin-top: 5px;
            color: #ec742e;
            font-weight: bold;
        }
    }
}

</style>
