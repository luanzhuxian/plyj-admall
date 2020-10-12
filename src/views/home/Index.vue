<template>
    <div>
        <!-- 顶部提醒 -->
        <div class="notification-bar" v-if="latestNotification.content && latestNotification.readed === '0'">
            <div>
                <PlSvg class="notification-bar__icon" name="icon-sound" width="18" />
                <b
                    v-if="latestNotification.version"
                    class="notification-bar__content"
                    @click="goDetail"
                >
                    {{ latestNotification.title }}
                </b>
                <b v-else>
                    {{ latestNotification.content }}
                </b>
                <el-button
                    v-if="latestNotification.forwardUrl"
                    class="notification-bar__btn"
                    type="text"
                    @click="goMend"
                >
                    修改资料
                </el-button>
            </div>
            <div class="notification-bar__more">
                <span>
                    {{ latestNotification.createTime | dateFormat('YYYY-MM-DD ') }}
                </span>
                <el-button
                    class="notification-bar__btn"
                    type="text"
                    @click="$router.push({ name:'Notification' })"
                >
                    更多通知
                </el-button>
            </div>
        </div>

        <div class="home">
            <!-- 常用功能 -->
            <Panel
                custom-class="functions-panel"
                title="常用功能"
                value="更多功能"
                is-link
                link-target="pl-cell__value-text"
                :to="{ name: 'MarketingManage' }"
            >
                <div v-for="(item, key) in functionsPanelTmpl" :key="key">
                    <router-link class="functions-panel__item" :to="item.to">
                        <img class="functions-panel__item-icon" :src="item.icon" alt="">
                        <div class="functions-panel__item-info">
                            <div class="functions-panel__item-name" v-text="item.name" />
                            <div class="functions-panel__item-desc" v-text="item.desc" />
                        </div>
                    </router-link>
                </div>
            </Panel>

            <!-- 待核销订单 -->
            <Panel custom-class="write-off-panel" title="待核销订单">
                <div class="write-off-panel__item">
                    <div>
                        <div>虚拟商品</div>
                        <router-link
                            class="write-off-panel__item-number"
                            :to="{
                                name: 'OrderList',
                                query: {
                                    status: 'WAIT_RECEIVE',
                                    productType: 'VIRTUAL_GOODS'
                                }
                            }"
                            v-text="homeInfo.virtualCount || 0"
                        />
                    </div>
                    <router-link
                        class="write-off-panel__item-link"
                        :to="{
                            name: 'OrderList',
                            query: {
                                status: 'WAIT_RECEIVE',
                                productType: 'VIRTUAL_GOODS'
                            }
                        }"
                    >
                        <PlSvg name="icon-arrow-right-large-59f85" width="25" />
                        <div>查看详情</div>
                    </router-link>
                </div>
                <div class="write-off-panel__item">
                    <div>
                        <div>课程商品</div>
                        <!--<router-link class="write-off-panel__item-number" to="/admall/orders-manage/courses-list?status=WAIT_RECEIVE" v-text="homeInfo.courseCount || 0" />-->
                        <router-link
                            class="write-off-panel__item-number"
                            :to="{
                                name: 'CoursesList',
                                query: {
                                    status: 'WAIT_RECEIVE'
                                }
                            }"
                            v-text="homeInfo.courseCount || 0"
                        />
                    </div>
                    <router-link
                        class="write-off-panel__item-link"
                        :to="{
                            name: 'CoursesList',
                            query: {
                                status: 'WAIT_RECEIVE'
                            }
                        }"
                    >
                        <PlSvg name="icon-arrow-right-large-59f85" width="25" />
                        <div>查看详情</div>
                    </router-link>
                </div>
            </Panel>

            <!-- 经营数据 -->
            <Panel custom-class="operation-panel" title="经营数据">
                <div class="operation-panel__item" :to="{ name: '' }">
                    <div class="operation-panel__item-name">支付订单量</div>
                    <div class="operation-panel__item-total" v-text="homeInfo.orderTotal || 0" />
                    <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.orderYesterdayAdd || 0}单` }}</div>
                </div>
                <div class="operation-panel__item" :to="{ name: '' }">
                    <div class="operation-panel__item-name">收益总额</div>
                    <div class="operation-panel__item-total" v-text="homeInfo.revenueTotal || 0" />
                    <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.revenueYesterdayAdd/100 || 0}元` }}</div>
                </div>
                <div class="operation-panel__item" :to="{ name: '' }">
                    <div class="operation-panel__item-name">会员数</div>
                    <div class="operation-panel__item-total" v-text="homeInfo.memberTotal || 0" />
                    <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.memberYesterdayAdds || 0}人` }}</div>
                </div>
                <div class="operation-panel__item" :to="{ name: '' }">
                    <div class="operation-panel__item-name">helper数</div>
                    <div class="operation-panel__item-total" v-text="homeInfo.helperTotal || 0" />
                    <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.helperYesterdayAdd || 0}人` }}</div>
                </div>
                <div class="operation-panel__item" :to="{ name: '' }">
                    <div class="operation-panel__item-name">月访客人数</div>
                    <div class="operation-panel__item-total" v-text="homeInfo.visitorTotal || 0" />
                    <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.visitorYesterdayAdd || 0}人` }}</div>
                </div>
            </Panel>

            <!-- 待办事宜 -->
            <Panel custom-class="to-do-panel" title="待办事宜">
                <router-link class="to-do-panel__item" :to="{ name: 'OrderList', query: { status: 'WAIT_SHIP' } }">
                    <div class="to-do-panel__item-name">待发货订单</div>
                    <div class="to-do-panel__item-total" v-text="homeInfo.waitShip || 0" />
                    <div class="to-do-panel__item-yesterday">{{ `昨日：${ homeInfo.yesterdayWaitShip || 0 }单` }}</div>
                    <span class="to-do-panel__item-red-dot" v-if="homeInfo.waitShip" />
                </router-link>
                <router-link class="to-do-panel__item" :to="{ name: 'Backorder', query: { status: 'WaitReview' } }">
                    <div class="to-do-panel__item-name">待退款订单</div>
                    <div class="to-do-panel__item-total" v-text="homeInfo.waitRefund || 0" />
                    <div class="to-do-panel__item-yesterday">{{ `昨日：${ homeInfo.yesterdayWaitRefund || 0 }单` }}</div>
                    <span class="to-do-panel__item-red-dot" v-if="homeInfo.waitRefund" />
                </router-link>
                <router-link class="to-do-panel__item" :to="{ name: 'HelperReviewList' }">
                    <div class="to-do-panel__item-name">待审核Helper</div>
                    <div class="to-do-panel__item-total" v-text="homeInfo.pendingReviewHelper || 0" />
                    <div class="to-do-panel__item-yesterday">{{ `昨日：${ homeInfo.yesterdayPendingReviewHelper || 0 }人` }}</div>
                    <span class="to-do-panel__item-red-dot" v-if="homeInfo.pendingReviewHelper" />
                </router-link>
                <router-link class="to-do-panel__item" :to="{ name: 'RunbiManage', query: { status: 'AWAIT' } }">
                    <div class="to-do-panel__item-name">待审核润笔</div>
                    <div class="to-do-panel__item-total" v-text="homeInfo.shareWaitAudit || 0" />
                    <div class="to-do-panel__item-yesterday">{{ `昨日：${ homeInfo.yesterdayShareWaitAudit || 0 }人` }}</div>
                    <span class="to-do-panel__item-red-dot" v-if="homeInfo.shareWaitAudit" />
                </router-link>
                <router-link class="to-do-panel__item" :to="{ name: 'WithdrawDepositManage', query: { status: 'AWAIT' } }">
                    <div class="to-do-panel__item-name">待提现审核</div>
                    <div class="to-do-panel__item-total" v-text="homeInfo.pendingWithdraw || 0" />
                    <div class="to-do-panel__item-yesterday">{{ `昨日：${homeInfo.yesterdayPendingWithdraw || 0 }人` }}</div>
                    <span class="to-do-panel__item-red-dot" v-if="homeInfo.pendingWithdraw" />
                </router-link>
            </Panel>
        </div>

        <CreateMall :created-mall-show.sync="createdMallShow" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Panel from '../../components/common/Panel.vue'
import CreateMall from '../../components/common/select-mall/Create-Mall.vue'
import {
    getHomeInfo,
    getProductOrder,
    getOrderInfo
} from '../../apis/home'
import { getWaitWarrantyResource } from '../../apis/product-center/online-teaching/library-repository'
import { getNotificationList, markReaded } from '../../apis/base/message'
import { getAuthUrl, setAuthCode } from '../../apis/base/register'
import { MutationTypes } from '@/store/mutation-type'

const user = namespace('user')

const newAuthMap: DynamicObject = {
    MP_NOT_AUTHORIZED: {
        title: '注册成功',
        message: '<p>您已成功注册雅集商城，立即授权雅集商城与您的服务号绑定</p><i style="font-size: 13px; color: #999;">注：授权登录账号与服务号管理员账号一致</i>',
        dangerouslyUseHTMLString: true,
        confirmButtonText: '立即授权'
    },
    OPEN_WECHAT_PAYMENT: {
        title: '授权成功',
        message: '您已授权成功，为了保障商城的日常交易支付功能，请立即开通微信支付',
        confirmButtonText: '立即开通'
    },
    OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_EDITTING: {
        title: '特约商户申请失败',
        message: '交申请发生错误导致，请尝试重新提交',
        confirmButtonText: '重新提交'
    },
    OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_AUDITING: {
        title: '特约商户申请中',
        message: '您的特约商户资料已经提交，请耐心等待微信审核，审核时间1个工作日左右',
        showCancelButton: false,
        showClose: false
    },
    OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_REJECTED: {
        title: '特约商户申请失败',
        message: '请检查您上传的资质，重新申请',
        confirmButtonText: '重新签约',
        confirmButtonClass: 'message-box-confirm-btn-warning'
    },
    OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_TO_BE_CONFIRMED: {
        title: '特约商户待账户验证',
        message: '请使用超级管理员微信，根据页面指引完成账户验证',
        confirmButtonText: '立即完成账户验证'
    },
    OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_TO_BE_SIGNED: {
        title: '特约商户待账户验证',
        message: '请使用超级管理员微信，根据页面指引完成账户验证',
        confirmButtonText: '立即完成账户验证'
    },
    OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_SIGNING: {
        title: '特约商户权限开通中',
        message: '系统开通相关权限中，请耐心等待',
        confirmButtonText: '立即查看'
    },
    OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_CANCELED: {
        title: '特约商户申请失败',
        message: '申请单已被撤销',
        confirmButtonText: '立即查看'
    }
}

const functionsPanelTmpl = [
    {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新人有礼.png',
        name: '新人有礼',
        desc: '新人注册送礼活动',
        to: {
            name: 'NewcomersGiftList'
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公众号增粉.png',
        name: '公众号增粉',
        desc: '商城引导关注服务号',
        to: {
            name: 'MpWeixin'
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/组合聚惠学.png',
        name: '组合聚惠学',
        desc: '组合商品打包售卖',
        to: {
            name: 'CoursePackage',
            params: {
                programId: '1'
            }
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/秒杀.png',
        name: '秒杀',
        desc: '多种满减券金额',
        to: {
            name: 'SecondBuy',
            params: {
                programId: '3'
            }
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png',
        name: '众志成团',
        desc: '商城引导关注服务号',
        to: {
            name: 'NewYearTogetherBuy',
            params: {
                programId: '4'
            }
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/预购.png',
        name: '预购',
        desc: '组合商品打包售卖',
        to: {
            name: 'NewYearBookingBuy',
            params: {
                programId: '5'
            }
        }
    }
]

@Component({
    components: {
        Panel,
        CreateMall
    }
})
export default class Home extends Vue {
    /* data */
    private functionsPanelTmpl = Object.freeze(functionsPanelTmpl)
    private homeInfo = {}
    // 通知消息
    private latestNotification: DynamicObject = {}
    // 资源库送课列表
    private giveResourceList = []
    // 是否展示资源库送客
    private showGiveResource = false
    private showPhoneTips = false
    private createdMallShow = false
    private countdown = '获取验证码'
    private form = {
        // 绑定的手机号
        mobile: '',
        // 验证码
        verifyCode: ''
    }

    /* computed */
    @user.Getter agencyCode!: string
    @user.Getter auditStatus!: string
    @user.Getter mallNumber!: string
    @user.Getter currentStep!: number
    @user.Getter regType!: number
    @user.Getter agencyList!: any
    // @user.Getter vMerchantStatus!: DynamicObject
    @user.Getter upgradeStatus!: DynamicObject
    @user.Getter wechatPayStatus!: DynamicObject

    async created () {
        try {
            await this.getHomeInfo()
        } catch (e) {
            throw e
        }
    }

    async mounted () {
        try {
            // if (this.regType === 2) {
            //     await this.newCheckStatus()
            // } else {
            //     this.checkStatus()
            // }
            if (this.currentStep === 1) {
                this.createdMallShow = true
            }
            await this.newCheckStatus()
        } catch (e) {
            throw e
        }
    }

    async activated () {
        try {
            await Promise.all([
                this.getWaitWarrantyResource(),
                this.getNotificationList()
            ].map(p => p.catch(e => {
                console.error(e)
                return { result: null }
            })))
        } catch (e) {
            throw e
        }
    }

    /* methods */
    @user.Action [MutationTypes.agencyUserInfo]: () => void

    // 获取送课的资源
    async getWaitWarrantyResource () {
        try {
            const { result } = await getWaitWarrantyResource(0)
            this.giveResourceList = result || []
            if (result && result.length) {
                this.showGiveResource = true
            }
        } catch (e) {
            throw e
        }
    }

    async getNotificationList () {
        try {
            const { result } = await getNotificationList({
                current: 1,
                size: 1,
                toAgencyCode: this.agencyCode
            })
            this.latestNotification = result.records[0] || {}
        } catch (e) {
            throw e
        }
    }

    // 获取首页数据
    async getHomeInfo () {
        try {
            const requests = [
                getHomeInfo(),
                getProductOrder(),
                getOrderInfo()
            ]
            const [
                { result: homeInfo },
                { result: productOrder },
                { result: orderInfo }
            ] = await Promise.all(requests.map(p => p.catch(e => {
                console.error(e)
                return { result: null }
            })))
            this.homeInfo = {
                ...homeInfo,
                ...productOrder,
                ...orderInfo
            }
        } catch (e) {
            throw e
        }
    }

    markReaded () {
        const ids = []
        ids.push(this.latestNotification.sequenceNbr)
        markReaded(ids)
    }

    goDetail () {
        this.markReaded()
        this.$router.push({
            name: 'NotificationDetail',
            params: {
                id: this.latestNotification.version
            }
        })
    }

    goMend () {
        this.markReaded()
        this.$router.push({ name: this.latestNotification.forwardUrl })
    }

    // 新流程检查状态
    async newCheckStatus () {
        let status = this.auditStatus
        const wechatPayStatus = this.wechatPayStatus.applymentState
        if (status === 'OPEN_WECHAT_PAYMENT') {
            status += wechatPayStatus ? (`_${ wechatPayStatus }`) : ''
        }
        const statusMap = newAuthMap[status]
        if (statusMap) {
            try {
                const queryAuthCode = this.$route.query.auth_code || ''
                if (queryAuthCode) {
                    this.setAuthCode(queryAuthCode as string)
                    return
                }
                await this.$confirm(statusMap)
                // 如果时未开通授权，点击确定立即授权
                if (this.auditStatus === 'MP_NOT_AUTHORIZED') {
                    this.givePower()
                    return
                }
                await this.$router.push({ name: 'WechatPay' })
            } catch (e) {
                if (e) throw e
            }
        }
    }

    // 老流程检查状态
    // checkStatus () {
    //     let status = this.auditStatus
    //     if (status === 'MICRO_NOT_APPLY') {
    //         // 如果在申请小v商户，还需判断小v商户的申请状态
    //         status += this.vMerchantStatus.applymentState ? (`_${ this.vMerchantStatus.applymentState }`) : ''
    //     }
    //     if (status === 'MICRO_NOT_UPGRADE') {
    //         status += this.upgradeStatus.applymentState ? (`_${ this.upgradeStatus.applymentState }`) : ''
    //     }
    //     const statusMap = authMap[status]
    //
    //     if (status === 'MICRO_NOT_UPGRADE_REJECTED') {
    //         if (this.upgradeStatus.auditDetailModels) {
    //             statusMap.message = this.upgradeStatus.auditDetailModels.map((item: DynamicObject) => item.rejectReason).join(', ')
    //         }
    //     }
    //     if (statusMap) {
    //         this.$confirm(statusMap)
    //             .then(() => {
    //                 this.$router.push({
    //                     name: 'WechatBind'
    //                 })
    //             })
    //     }
    // }

    // 微信服务号授权
    async givePower () {
        try {
            const { result } = await getAuthUrl()
            location.href = result
        } catch (e) {
            throw e
        }
    }

    // 微信服务号授权完成接口
    async setAuthCode (authCode: string) {
        try {
            const { result } = await setAuthCode(this.mallNumber, encodeURIComponent(authCode))
            if (result.authResult) {
                this.$success('授权成功!')
                await this.$router.push({ name: 'WechatPay' })
            } else {
                this.repeatAuth('授权失败，请重试')
            }
        } catch (e) {
            if (e.name === 'ResponseError') {
                this.repeatAuth(JSON.parse(e.message).message)
                return
            }
            this.repeatAuth('授权失败，请重试')
            throw e
        } finally {
            this[MutationTypes.agencyUserInfo]()
        }
    }

    // 重新授权
    repeatAuth (message: string) {
        this.$confirm({
            title: '温馨提示',
            message,
            confirmButtonText: '重新授权',
            cancelButtonText: '我再看看'
        })
            .then(() => {
                this.givePower()
            })
            .catch(() => {
                this.$router.replace({ name: 'Home' })
            })
    }
}
</script>

<style lang="scss">
.home {
    min-width: 1300px;
    display: grid;
    grid-template-columns: minmax(710px, 1fr) minmax(580px, 1fr);
    grid-template-rows: 267px 239px 239px;
    grid-gap: 10px;
    padding-bottom: 55px;
    box-sizing: border-box;

    &-link {
        cursor: pointer;
        &:hover,
        &:focus {
            color: mix(#fff, #4f63ff, 20%);
        }
        &:active {
            color: mix(#fff, #4f63ff, 10%);
        }
    }

    .functions-panel,
    .write-off-panel,
    .operation-panel,
    .to-do-panel {
        padding: 0 36px;
        border: 1px solid #e7e7e7;
    }

    .operation-panel,
    .to-do-panel {
        grid-column-start: 1;
        grid-column-end: 3;
    }

    .functions-panel {
        &__item {
            display: inline-flex;
            &-icon {
                width: 48px;
                height: 48px;
                object-fit: cover;
            }
            &-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 10px;
            }
            &-name {
                font-size: 14px;
                font-family: Microsoft YaHei;
                line-height: 19px;
                color: #333;
            }
            &-desc {
                margin-top: 4px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                line-height: 16px;
                color: #999;
            }
        }
        > .pl-cell-group > .pl-panel__content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-row-gap: 40px;
            padding-top: 16px;
        }
    }
    .write-off-panel {
        > .pl-cell-group > .pl-panel__content {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-around;
            padding-top: 16px;
            padding-left: 36px;
        }
        &__item {
            display: flex;
            font-size: 14px;
            font-family: Microsoft YaHei UI;
            line-height: 19px;
            color: #333;
            &-number {
                display: block;
                font-size: 48px;
                font-family: Microsoft YaHei UI;
                font-weight: 600;
                line-height: 64px;
                &:hover {
                    color: #4f63ff;
                }
            }
            &-link {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                margin-left: 40px;
                margin-bottom: 13px;
                color: #4f63ff;
                @extend .home-link;
                > svg {
                    margin-bottom: 5px;
                }
            }
        }
    }
    .operation-panel,
    .to-do-panel {
        > .pl-cell-group > .pl-panel__content {
            display: grid;
            grid-template-columns: repeat(5, auto);
            justify-content: space-around;
            // padding-left: 36px;
        }
        &__item {
            position: relative;
            padding: 0 5px;
            font-size: 16px;
            font-family: Microsoft YaHei UI;
            line-height: 21px;
            color: #333;
            &-total {
                font-size: 48px;
                font-weight: 600;
                line-height: 64px;
            }
            &-yesterday {
                margin-top: 8px;
                font-size: 16px;
                color: #999;
            }
            &-red-dot {
                position: absolute;
                top: 0;
                right: 0;
                width: 4px;
                height: 4px;
                border-radius: 2px;
                background-color: $--color-red-1;
            }
            &:hover {
                .to-do-panel__item-total {
                    color: #4f63ff;
                }
            }
        }
    }

    .pl-cell {
        padding: 24px 0;
        &__title {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #333;
        }
        &__value {
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #4f63ff;
            &-text {
                @extend .home-link;
            }
        }
    }
}

.notification-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    height: 52px;
    padding: 0 24px;
    background-color: #fff;
    border: 1px solid #e7e7e7;
    font-size: 16px;
    &__icon {
        margin-right: 20px;
    }
    &__content {
        color: #4f63ff;
        cursor: pointer;
    }
    &__btn {
        font-size: 16px;
    }
    &__more {
        > .notification-bar__btn {
            margin-left: 32px;
            color: #4f63ff;
        }
    }
}

</style>
