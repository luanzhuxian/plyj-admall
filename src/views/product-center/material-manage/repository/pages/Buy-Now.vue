<template>
    <div :class="$style.buyNowContainer">
        <Panel title="支付与订单" width="80%" top="40">
            <ul :class="$style.detail">
                <li>
                    <label>课程名称：</label>
                    <div :class="$style.value">
                        {{ detail.courseName }}
                    </div>
                </li>
                <li>
                    <label>资源数量：</label>
                    <div :class="$style.value">
                        {{ detail.videoCount || 1 }}
                    </div>
                </li>
                <li>
                    <label>支付方式：</label>
                    <div :class="$style.payMode">
                        <svg :class="$style.icon" width="28" height="28" aria-hidden="true">
                            <use xlink:href="#icon-wechat" />
                        </svg>
                        <span>微信支付</span>
                    </div>
                </li>
                <li>
                    <label>订单信息：</label>
                    <div :class="$style.description">
                        <div><span>购买机构名称：</span><span>{{ detail.entName }}</span></div>
                        <div><span>企业管理员：</span><span>{{ detail.enterpriseName }}</span></div>
                        <div>
                            <span>订单金额：</span>
                            <span v-if="detail.priceType === 0 || isGive">免费</span>
                            <span v-else>￥ {{ detail.sellingPrice || 0 }}</span>
                        </div>
                        <div>
                            <span>使用有效期：</span>
                            <template v-if="isGive">
                                <span v-if="detail.expirationDate">授权起 {{ detail.expirationDate }} 内有效</span>
                                <span v-else>授权起 {{ detail.validity || 0 }} 天内有效</span>
                            </template>
                            <span v-else>订购起 {{ detail.validity || 0 }} 天内有效</span>
                        </div>
                    </div>
                </li>
                <li>
                    <label>应付金额：</label>
                    <div :class="$style.buyNow">
                        <div v-if="detail.priceType === 0 || isGive">
                            免费
                        </div>
                        <div v-else>
                            ￥ {{ detail.sellingPrice || 0 }}
                        </div>
                        <div>
                            <el-checkbox v-model="checked">
                                <span>我已阅读并同意</span>
                            </el-checkbox>
                            <span style="color:#4F63FF;cursor:pointer" @click="showProtocol = true">《服务协议》</span>
                        </div>
                        <div v-if="!forbiddenPay">
                            <el-button v-if="isGive" :disabled="!checked || detail.isAuthorize === 1" @click="buyNow" type="primary">
                                立即授权
                            </el-button>
                            <el-button v-else :disabled="!checked" @click="buyNow" type="primary">
                                立即订购
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="primary" disabled>
                                体验商城不支持支付
                            </el-button>
                        </div>
                    </div>
                </li>
            </ul>
        </Panel>
        <!--支付弹窗-->
        <el-dialog
            :visible.sync="showPayCode"
            width="330px"
            :show-close="false"
            :close-on-click-modal="false"
        >
            <div :class="$style.payCode">
                <p class="p20">
                    支付金额
                </p>
                <div :class="[$style.p20,$style.prcie]">
                    {{ detail.sellingPrice }} 元
                </div>
                <p>
                    <img v-imgError :src="payCode" alt="">
                </p>
                <p :class="$style.p18">
                    <pl-svg width="16" name="icon-scanning-d5a28" /> 微信扫一扫支付
                </p>
                <div :class="$style.button">
                    <el-button v-if="payStatus === 'WAIT_PAY'" type="primary" @click="payDone" :loading="loading">
                        正在支付
                    </el-button>
                    <el-button v-else-if="payStatus === 'FINISHED' && rechargeStatus === 'WAIT_PAY'" type="primary" @click="payDone" :loading="loading">
                        正在充值
                    </el-button>
                    <el-button v-else-if="payStatus === 'FINISHED' && rechargeStatus === 'SUCCESS'" type="primary" @click="payDone" :loading="loading">
                        购买成功
                    </el-button>
                    <el-button v-else type="danger" @click="retryFailedOrder" :loading="loading">
                        购买错误，请重试
                    </el-button>
                </div>
            </div>
        </el-dialog>

        <!--协议-->
        <Agreement
            :type="7"
            :show.sync="showProtocol"
        />
    </div>
</template>

<script>
import Agreement from '../../../../../components/register/Agreement'
import Panel from '../../../../../components/common/Panel.vue'
import { getBuyDetails, buyNow, getOrderStatus, retryFalidOrder } from '../../../../../apis/line-teaching/repository'
import { mapGetters } from 'vuex'
export default {
    name: 'VideoRepositoryBuyNow',
    components: {
        Agreement,
        Panel
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            checked: false,
            payCode: '',
            showPayCode: false,
            showProtocol: false,
            timer: null,
            loading: true,
            // 等待支付
            payStatus: 'WAIT_PAY',
            // 等待充值
            rechargeStatus: 'WAIT_PAY',
            orderId: '',
            detail: {}
        }
    },
    async activated () {
        try {
            this.checked = false
            await this.getBuyDetails()
        } catch (e) { throw e }
    },
    deactivated () {
        this.loading = true
        this.showPayCode = false
        clearInterval(this.timer)
    },
    computed: {
        ...mapGetters(['forbiddenPay']),
        isGive () {
            return this.detail.giveRecordId !== '0'
        }
    },
    methods: {
        async target () {
            try {
                this.$success(`${ this.isGive ? '授权成功' : '订购成功' }`)
                await this.duration(2)
                const isSingle = this.detail.courseType === 1
                await this.$confirm({
                    // 知识课堂
                    message: `您是否将该${ isSingle ? '单' : '系列' }资源课程一键上架到云课堂-${ isSingle ? '知识课程' : '系列课' }中`,
                    cancelButtonText: '暂不上架',
                    confirmButtonText: '一键上架'
                })
                // 1单课 2系列课
                const name = isSingle ? 'VideoCourseAdd' : 'AddSeriesOfCourses'
                this.$router.replace({ name, query: { resouceId: this.id } })
            } catch (e) {
                if (e === 'cancel') {
                    this.$nextTick(() => {
                        this.$success('该课程资源已自动帮您放入到视频库中')
                        this.$router.replace({ name: 'VideoLibraryList' })
                    })
                }
            }
        },
        async getBuyDetails () {
            try {
                const { giveRecordId } = this.$route.query
                const { data: { result } } = await getBuyDetails({
                    id: this.id,
                    giveRecordId
                })
                this.detail = result
            } catch (e) { throw e }
        },
        async buyNow () {
            try {
                const { id: courseResourceId, giveRecordId } = this.detail
                const { data: { result } } = await buyNow({
                    courseResourceId,
                    giveRecordId
                })
                if (result.sellingPrice === 0 || this.isGive) {
                    this.target()
                    return
                }
                this.payCode = `data:image/gif;base64,${ result.qrCode }`
                this.showPayCode = true
                clearInterval(this.timer)
                this.timer = setInterval(() => {
                    this.getOrderStatus(result.orderId)
                }, 2000)
            } catch (e) { throw e }
        },
        async getOrderStatus (orderId) {
            try {
                this.orderId = orderId
                const { data: { result } } = await getOrderStatus(orderId)
                const {
                    payStatus,
                    rechargeStatus
                } = result
                this.payStatus = payStatus
                this.rechargeStatus = rechargeStatus
                if ((payStatus === 'FINISHED' && rechargeStatus === 'SUCCESS') || rechargeStatus === 'ERROR') {
                    clearInterval(this.timer)
                    this.loading = false
                    this.showPayCode = false
                    await this.$nextTick()
                    this.target()
                }
            } catch (e) { throw e }
        },
        async retryFailedOrder () {
            try {
                this.loading = true
                await retryFalidOrder(this.orderId)
                this.timer = setInterval(() => {
                    this.getOrderStatus(this.orderId)
                }, 2000)
            } catch (e) { throw e }
        },
        payDone () {
            this.showPayCode = false
            this.target()
        },
        duration (seconds) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, seconds * 1000)
            })
        }
    }
}
</script>

<style module lang='scss'>

.buy-now-container {
    .detail {
        padding: 32px 24px;
        box-sizing: border-box;
        font-size: 14px;
        > li {
            margin-bottom: 24px;
            > label {
                display: inline-block;
                width: 200px;
                vertical-align: top;
            }
            > .value {
                display: inline-block;
            }
            > .pay-mode {
                display: inline-flex;
                align-items: center;
                height: 56px;
                padding: 0 24px;
                box-sizing: border-box;
                border: 2px solid #598bf8;
                cursor: pointer;
                line-height: 56px;
                font-size: 18px;
                > .icon {
                    width: 28px;
                    height: 28px;
                    margin-right: 16px;
                }
            }
            > .description {
                display: inline-block;
                width: calc(100% - 200px);
                padding: 24px 30px;
                font-size: 18px;
                background-color: #f8f8f8;
                > div {
                    margin-bottom: 16px;
                    &:nth-last-of-type(1) {
                        margin-bottom: 0;
                    }
                    > span:nth-of-type(1) {
                        display: inline-block;
                        width: 150px;
                    }
                    > span:nth-of-type(2) {
                        font-weight: bold;
                    }
                }
            }
            > .buy-now {
                display: inline-block;
                width: 325px;
                > div:nth-of-type(1) {
                    font-size: 28px;
                    font-weight: bold;
                    color: #ec742e;
                }
                > div:nth-of-type(2) {
                    margin: 18px 0;
                }
                > div:nth-of-type(3) {
                    > button {
                        width: 100%;
                        padding: 15px 8px;
                        font-size: 14px;
                    }
                }
            }
        }
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

</style>
