<template>
    <div class="pay-and-order wrap">
        <Panel title="流量套餐" width="95%" top="20">
            <div class="main">
                <el-form label-width="152px" label-position="left">
                    <el-form-item label="说明：">
                        <p class="tips">
                            直播功能需提前购买套餐开通房间，开通房间后才可进行直播，目前支持购买多种直播套餐；
                        </p>
                        <p class="tips">
                            购买套餐可获得直播观看时长，并可获得活动赠送的相应直播观看时长和录播所需的点播流量；
                        </p>
                        <p class="tips red">
                            直播观看时长：
                        </p>
                        <p class="tips">
                            机构购买的是用户观看时长，当前直播时间内所有用户观看时间的合计即为观看时长，比如说机构直播时间100分钟，有20名用户观看即观看时长为100*20=2000分钟；<span class="red">购买直播观看时长套餐可赠送相应的点播流量；</span>
                        </p>
                        <p class="tips red">
                            点播流量：
                        </p>
                        <p class="tips">
                            是用户在商城通过线上课程观看视频或通过直播功能观看录播视频时，所需要消耗的流量，赠送的点播流量可进行叠加使用；
                        </p>
                        <p class="tips red">
                            视频库存储空间：
                        </p>
                        <p class="tips">
                            是视频库中可上传视频文件大小的累加，<span class="red">首次开通房间，可免费获赠20G的视频库存储空间；</span>且存储空间不足时，可购买存储空间加油包，扩大视频库的存储空间；
                        </p>

                        <Bought class="mt-30" />
                    </el-form-item>
                    <el-form-item label="方案：">
                        <div
                            class="set-meal-box"
                            v-for="(item1, i) of setMealData"
                            :key="i"
                        >
                            <div class="set-meal-row">
                                <div
                                    class="img"
                                    v-for="(item2, j) of item1"
                                    :key="j"
                                    :class="{ active: currentMeal === item2 }"
                                    @click="select(item2)"
                                >
                                    <img :src="item2.img" alt="">
                                    <div class="selected">
                                        <pl-svg name="icon-duihao" fill="#fff" width="20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="计算购买套餐：">
                        <div class="wechat-pay-view">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-wechat" />
                            </svg>
                            <span>微信支付</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="订单信息：">
                        <div class="order-detail-view">
                            <div class="order-detail-row-view">
                                <div class="order-detail-item-view">
                                    <label>购买机构名：</label>
                                    <span v-text="enterpriseSaveModel.entName || mallSaveModel.mallName" />
                                </div>
                            </div>
                            <div class="order-detail-row-view">
                                <div class="order-detail-item-view">
                                    <label>企业管理员：</label>
                                    <span v-text="entPersonSaveModel.idName" />
                                </div>
                            </div>
                            <div class="order-detail-row-view">
                                <div class="order-detail-item-view">
                                    <label>订单金额：</label>
                                    ￥<span v-text="currentMeal.presentPrice" />
                                </div>
                            </div>
                            <div class="order-detail-row-view" v-if="currentMeal.originalPrice - currentMeal.presentPrice">
                                <div class="order-detail-item-view">
                                    <label>优惠金额：</label>
                                    <span>￥{{ currentMeal.originalPrice - currentMeal.presentPrice }}</span>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="应付金额：">
                        <div class="payment-view" v-if="currentMeal.presentPrice">
                            {{ `￥${currentMeal.presentPrice}` }}
                            <span>
                                <span>(购买后</span>
                                <span v-if="currentMeal.duration">
                                    {{ `, 剩余观看分钟数：${currentMeal.duration + (surplus.available || 0)}` }}
                                </span>
                                <span v-if="currentMeal.storageSize">
                                    {{ `, 剩余空间：${((surplus.remainderStorageSize_G || 0) + currentMeal.storageSize / 1024).toFixed(2)}G` }}
                                </span>
                                <span v-if="currentMeal.flowSize">
                                    {{ `, 剩余流量：${((surplus.remainderDataFlowSizeH || 0) / 1024 + currentMeal.flowSize / 1024).toFixed(2)}G` }}
                                </span>
                                <span>)</span>
                            </span>
                            <!--<span>{{ `（购买后剩余观看分钟数：${currentMeal.duration + surplus.available}）` }}</span>-->
                        </div>
                    </el-form-item>
                    <el-form-item label="" class="agreement-protocol-view">
                        <el-checkbox v-model="isAgreementProtocol">
                            我已阅读并同意 <a style="color: #007bff;" href="javascript:;" @click="showProtocol = true">《服务协议》</a>
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item v-if="!forbiddenPay">
                        <el-button class="confirm-btn-view" type="primary" :disabled="!isAgreementProtocol" @click="buy">
                            确认购买
                        </el-button>
                    </el-form-item>
                    <el-form-item v-else>
                        <el-button class="confirm-btn-view" type="primary" disabled>
                            体验商城不支持支付
                        </el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <span class="help-view">目前仅支持线下开票，若有需要订单，完成后联系我们029-84046883，<br>若有问题请联系我们，我们会及时响应</span>
                    </el-form-item>
                </el-form>
            </div>
        </Panel>

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
                    {{ currentMeal.presentPrice }} 元
                </div>
                <p>
                    <img :src="payCode" alt="">
                </p>
                <p class="p18">
                    <pl-svg width="16" name="icon-scanning-d5a28" /> 微信扫一扫支付
                </p>
                <div class="button">
                    <el-button v-if="payStatus === 'WAIT_PAY'" type="primary" :loading="loading">
                        正在支付
                    </el-button>
                    <el-button v-else-if="payStatus === 'FINISHED' && rechargeStatus === 'WAIT_PAY'" type="primary" :loading="loading">
                        正在支付
                    </el-button>
                    <el-button v-else-if="payStatus === 'FINISHED' && rechargeStatus === 'SUCCESS'" type="primary" @click="payDone" :loading="loading">
                        支付成功
                    </el-button>
                    <el-button v-else type="danger" @click="retryFailedOrder" :loading="loading">
                        支付失败，请重试
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <Agreement
            :type="6"
            :show.sync="showProtocol"
        />
    </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'

import Panel from '../../../../components/common/Panel.vue'
import Agreement from '../../../../components/register/Agreement.vue'
import Bought from './../compoonents/Bought.vue'

import { getVideoLibInfo } from './../../../../apis/product-center/online-teaching/knowledge-course'
import {
    getSurplusMinute,
    getPayCode,
    getSetMeal,
    getRoomStatus,
    getOrderDetail,
    retryFalidOrder
} from './../../../../apis/product-center/online-teaching/live'
const userModule = namespace('user')

@Component({
    components: {
        Panel,
        Agreement,
        Bought
    }
})
export default class PayAndOrder extends Vue {
    /**
     * 要显示的数据类型，课传多个，以‘,’分格
     * 0 全部
     * 1 直播
     * 2 空间
     * 3 流量
     */
    @Prop({
        type: String,
        default: '0'
    }) readonly type!: string

    // 是否续费 '0'-首次开通 '1'-续费
    @Prop(String) readonly isRenew!: string

    @Getter forbiddenPay!: string
    @userModule.Getter entPersonSaveModel!: string
    @userModule.Getter mallSaveModel!: string
    @userModule.Getter enterpriseSaveModel!: string

    currentMeal = {
        id: ''
    }

    enable = 0 // 直播间状态，3 未开通
    surplus = {}
    setMealData: any[] = []
    loading = true
    payStatus = 'WAIT_PAY' // 等待支付
    rechargeStatus = 'WAIT_PAY' // 等待充值
    showProtocol = false
    showPayCode = false
    isAgreementProtocol = false
    payCode = ''
    orderId = ''
    timer = -1

    async activated () {
        // 直播间状态
        const { result } = await getRoomStatus()
        this.enable = result.enable
        // 没有开通直播间，并且type为0，去开通直播间
        if (this.enable === 3 && this.type === '0') {
            await this.$router.replace({ name: 'SetMeal' })
            return
        }
        // 是否续费，续费时显示所有套餐
        if (this.isRenew === '1') {
            this.getSetMeal()
            const { result: time } = await getSurplusMinute()
            const { result: storage } = await getVideoLibInfo()
            this.surplus = Object.assign(storage, time)
        } else {
            // 不是续费，是在未开通直播的情况下，从开通直播套餐页面跳转而来，跳过来的时候，携带了当时选择的套餐
            const currentMeal = sessionStorage.getItem('SetMealModel')
            if (!currentMeal) {
                await this.$router.replace({ name: 'Home' })
                return
            }
            this.setMealData = [[JSON.parse(currentMeal)]]
            this.currentMeal = this.setMealData[0][0]
        }
    }

    deactivated () {
        this.loading = true
        this.showPayCode = false
        clearInterval(this.timer)
    }

    private async getSetMeal () {
        let { result } = await getSetMeal()
        // 计算套餐中包含的总的直播分钟数 赠送+购买
        for (const item of result) {
            item.duration = item.rechargeMinute + item.giveMinute
        }

        /*
        * 套餐类型
        * 1 纯直播分钟
        * 2 流量加油包
        * 3 直播时间 + 流量加油
        * 4 空间包
        * 7 直播时间 + 流量 + 空间
        * */
        // 未开通直播，过滤掉包含直播的卡
        if (this.enable === 3) {
            result = result.filter((item: any) => !item.duration)
        }
        switch (this.type) {
            case '1': // 需要直播分钟数
                result = result.filter((item: any) => Number(item.duration))
                break
            case '2': // 需要空间
                result = result.filter((item: any) => Number(item.storageSize))
                break
            case '3': // 需要流量
                result = result.filter((item: any) => Number(item.flowSize))
        }
        if (!result.length) {
            this.$alert('暂无适合的套餐')
            return this.$router.go(-1)
        }
        for (const item of result) {
            item.originalPrice /= 100
            item.presentPrice /= 100
        }
        while (result.length) {
            this.setMealData.push(result.splice(0, 2))
        }
        this.currentMeal = this.setMealData[0][0]
    }

    private select (item: any) {
        this.currentMeal = item
    }

    private async buy () {
        const { result } = await getPayCode(this.currentMeal.id)
        this.payCode = `data:image/gif;base64,${ result.qrCode }`
        this.showPayCode = true
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            this.getOrderStatus(result.orderId)
        }, 1500)
    }

    // 获取订单支付状态
    private async getOrderStatus (orderId: string) {
        this.orderId = orderId
        const { result } = await getOrderDetail(orderId)
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
            this.payDone()
        }
    }

    private async retryFailedOrder () {
        this.loading = true
        await retryFalidOrder(this.orderId)
        this.timer = setInterval(() => {
            this.getOrderStatus(this.orderId)
        }, 1500)
    }

    private async payDone () {
        this.showPayCode = false
        if (this.$route.params.backRouteName) {
            await this.$router.push({ name: this.$route.params.backRouteName })
            return
        }
        this.$router.go(-1)
    }
}
</script>
<style scoped lang="scss">
.main {
    padding: 32px 24px;
    .set-meal-box {
        position: relative;
        margin-bottom: 20px;
        box-sizing: border-box;
        transition: box-shadow .2s linear;
    }
    .set-meal-row {
        display: flex;
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
        > .img {
            position: relative;
            height: 181px;
            margin-right: 16px;
            font-size: 0;
            border-radius: 10px;
            overflow: hidden;
            > img {
                width: 554px;
                height: 181px;
            }
            .selected {
                position: absolute;
                right: 0;
                top: 0;
                display: none;
                align-items: center;
                border-top: 22px #598bf8;
                border-right: 22px #598bf8;
                border-bottom: 22px transparent;
                border-left: 22px transparent;
                border-style: solid;
                transform: scaleX(1.8);
                > svg {
                    position: absolute;
                    top: -19px;
                    left: -6px;
                    transform: scaleX(.4);
                }
            }
            &.active {
                background-color: #598bf8;
                > img {
                    filter: opacity(.95);
                }
                .selected {
                    display: inline-flex;
                }
                &:after {
                    position: absolute;
                    content: '';
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    border: 3px solid #598bf8;
                    background-color: rgba(0, 0, 0, 0);
                    border-radius: 10px;
                }
            }
        }
    }
    /* 目前用户电脑分辨率存在1366，所以在临界点1620尺寸下，换行显示套餐 */
    @media screen and (max-width: 1620px) {
        .set-meal-box {
            margin-bottom: 0;
        }
        .set-meal-row {
            display: block;
            > .img {
                display: inline-block;
            }
        }
    }
    .wechat-pay-view {
        width: 130px;
        height: 48px;
        border: 1px solid #ccc;
        line-height: 48px;
        padding: 0 20px;

        svg {
            width: 27px;
            height: 22px;
            vertical-align: middle;
        }

        span {
            margin-left: 11px;
            font-size: 12px;
            color: #333;
        }
    }

    .order-detail-view {
        padding: 24px 32px;
        background-color: #faf7f8;
        .order-detail-row-view {
            display: flex;
            height: 20px;
            line-height: 20px;
            margin-bottom: 16px;
            &:last-child {
                margin-bottom: 0;
            }

            .order-detail-item-view {
                flex: 1;
                font-size: 14px;
                white-space: nowrap;

                label,
                span {
                    color: #666;
                }
            }

            > :nth-child(2) {
                margin-left: 20px;
            }
        }
    }

    .payment-view {
        font-size: 20px;
        font-weight: bold;
        color: #f5c367;

        span {
            font-size: 14px;
            color: #999;
            font-weight: normal;
        }
    }
    .confirm-btn-view {
        width: 325px;
        height: 48px;
    }

    .help-view {
        width: 400px;
        font-size: 12px;
        line-height: 16px;
        color: #999;
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
.tips {
    line-height: 24px;
    &.red {
        color: #d0423c;
    }
}

</style>
