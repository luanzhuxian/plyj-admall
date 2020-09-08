<template>
    <!-- <h1>
        HOME
        <div @click="$router.push({name:'Login'})">用户登录</div>
    </h1> -->
    <div class="home">
        <!-- 常用功能 -->
        <Panel
            custom-class="functions-panel"
            title="常用功能"
            value="更多功能"
            is-link
            link-target="pl-cell__value-text"
            :to="{ name: '' }"
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
                    <router-link class="write-off-panel__item-number" :to="{ name: ' '}" v-text="homeInfo.virtualCount || 0" />
                </div>
                <router-link class="write-off-panel__item-link" :to="{ name: ' '}">
                    <div>查看详情</div>
                </router-link>
            </div>
            <div class="write-off-panel__item">
                <div>
                    <div>课程商品</div>
                    <router-link class="write-off-panel__item-number" :to="{ name: ' '}" v-text="homeInfo.courseCount || 0" />
                </div>
                <router-link class="write-off-panel__item-link" :to="{ name: ' '}">
                    <div>查看详情</div>
                </router-link>
            </div>
        </Panel>

        <!-- 经营数据 -->
        <Panel custom-class="operation-panel" title="经营数据">
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">支付订单量</div>
                <div class="operation-panel__item-total" v-text="homeInfo.orderTotal || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.orderYesterdayAdd || 0}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">收益总额</div>
                <div class="operation-panel__item-total" v-text="homeInfo.revenueTotal || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.revenueYesterdayAdd/100 || 0}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">会员数</div>
                <div class="operation-panel__item-total" v-text="homeInfo.memberTotal || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.memberYesterdayAdds || 0}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">helper数</div>
                <div class="operation-panel__item-total" v-text="homeInfo.helperTotal || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.helperYesterdayAdd || 0}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">月访客人数</div>
                <div class="operation-panel__item-total" v-text="homeInfo.visitorTotal || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.visitorYesterdayAdd || 0}人` }}</div>
            </router-link>
        </Panel>

        <!-- 待办事宜 -->
        <Panel custom-class="to-do-panel" title="待办事宜">
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">支付订单量</div>
                <div class="operation-panel__item-total" v-text="homeInfo.waitShip || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.waitShip || 0}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待退款订单</div>
                <div class="operation-panel__item-total" v-text="homeInfo.waitRefund || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.waitRefund || 0}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待审核Helper</div>
                <div class="operation-panel__item-total" v-text="homeInfo.pendingReviewHelper || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.pendingReviewHelper || 0}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待审核润笔</div>
                <div class="operation-panel__item-total" v-text="homeInfo.shareWaitAudit || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.shareWaitAudit || 0}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待提现审核</div>
                <div class="operation-panel__item-total" v-text="homeInfo.pendingWithdraw || 0" />
                <div class="operation-panel__item-yesterday">{{ `昨日：${homeInfo.pendingWithdraw || 0}人` }}</div>
            </router-link>
        </Panel>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import Panel from '../components/common/Panel.vue'
import {
    getHomeInfo,
    getProductOrder,
    getOrderInfo,
    isBindMobile
    // modifyMobile
} from '../apis/home'
import { getWaitWarrantyResource } from '../apis/line-teaching/repository'
import { getNotificationList, markReaded } from '../apis/base/message'

// const newAuthMap = {
//     MP_NOT_AUTHORIZED: {
//         title: '注册成功',
//         message: '<p>您已成功注册雅集商城，立即授权雅集商城与您的服务号绑定</p><i style="font-size: 13px; color: #999;">注：授权登录账号与服务号管理员账号一致</i>',
//         dangerouslyUseHTMLString: true,
//         confirmButtonText: '立即授权'
//     },
//     OPEN_WECHAT_PAYMENT: {
//         title: '授权成功',
//         message: '您已授权成功，为了保障商城的日常交易支付功能，请立即开通微信支付',
//         confirmButtonText: '立即开通'
//     },
//     OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_EDITTING: {
//         title: '特约商户申请失败',
//         message: '交申请发生错误导致，请尝试重新提交',
//         confirmButtonText: '重新提交'
//     },
//     OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_AUDITING: {
//         title: '特约商户申请中',
//         message: '您的特约商户资料已经提交，请耐心等待微信审核，审核时间1个工作日左右',
//         showCancelButton: false,
//         showClose: false
//     },
//     OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_REJECTED: {
//         title: '特约商户申请失败',
//         message: '请检查您上传的资质，重新申请',
//         confirmButtonText: '重新签约',
//         confirmButtonClass: 'message-box-confirm-btn-warning'
//     },
//     OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_TO_BE_CONFIRMED: {
//         title: '特约商户待账户验证',
//         message: '请使用超级管理员微信，根据页面指引完成账户验证',
//         confirmButtonText: '立即完成账户验证'
//     },
//     OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_TO_BE_SIGNED: {
//         title: '特约商户待账户验证',
//         message: '请使用超级管理员微信，根据页面指引完成账户验证',
//         confirmButtonText: '立即完成账户验证'
//     },
//     OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_SIGNING: {
//         title: '特约商户权限开通中',
//         message: '系统开通相关权限中，请耐心等待',
//         confirmButtonText: '立即查看'
//     },
//     OPEN_WECHAT_PAYMENT_APPLYMENT_STATE_CANCELED: {
//         title: '特约商户申请失败',
//         message: '申请单已被撤销',
//         confirmButtonText: '立即查看'
//     }
// }

const functionsPanelTmpl = [
    {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新人有礼.png',
        name: '新人有礼',
        desc: '新人注册送礼活动',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公众号增粉.png',
        name: '公众号增粉',
        desc: '商城引导关注服务号',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/组合聚惠学.png',
        name: '组合聚惠学',
        desc: '组合商品打包售卖',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/秒杀.png',
        name: '秒杀',
        desc: '多种满减券金额',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png',
        name: '众志成团',
        desc: '商城引导关注服务号',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/预购.png',
        name: '预购',
        desc: '组合商品打包售卖',
        to: {
            name: ''
        }
    }
]

@Component({
    components: {
        Panel
    }
})
export default class Home extends Vue {
    // data
    private functionsPanelTmpl = Object.freeze(functionsPanelTmpl)
    private homeInfo = {}
    // 通知消息
    private latestNotification = {} as DynamicObject
    // 资源库送课列表
    private giveResourceList = []
    // 是否展示资源库送客
    private showGiveResource = false
    private showPhoneTips = false
    private form = {
        // 绑定的手机号
        mobile: '',
        // 验证码
        verifyCode: ''
    }

    // computed
    @Getter agencyCode!: string
    @Getter auditStatus!: string
    @Getter mallNumber!: string
    @Getter regType!: number
    @Getter vMerchantStatus!: DynamicObject
    @Getter upgradeStatus!: DynamicObject
    @Getter wechatPayStatus!: DynamicObject

    async created () {
        try {
            await this.getHomeInfo()
            await this.testBindPhone()
        } catch (e) {
            throw e
        }
    }

    async mounted () {
        try {
            if (this.regType === 2) {
                await this.newCheckStatus()
            } else {
                this.checkStatus()
            }
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

    // methods

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

    // 获取通知消息
    async getNotificationList () {
        try {
            const { result } = await getNotificationList({
                current: 1,
                size: 1,
                toAgencyCode: this.agencyCode
            })
            this.latestNotification = result.records && result.records.length ? result.records[0] : {}
        } catch (e) {
            throw e
        }
    }

    // 获取送课的资源
    async getWaitWarrantyResource () {
        try {
            const { result = [] } = await getWaitWarrantyResource(0)
            this.giveResourceList = result
            if (result && result.length) {
                this.showGiveResource = true
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

    // 新流程检查状态
    async newCheckStatus () {
        // let status = this.auditStatus
        // const wechatPayStatus = this.wechatPayStatus.applymentState
        // if (status === 'OPEN_WECHAT_PAYMENT') {
        //     status += wechatPayStatus ? (`_${ wechatPayStatus }`) : ''
        // }
        // const statusMap = newAuthMap[status]
        // if (statusMap) {
        //     try {
        //         const queryAuthCode = this.$route.query.auth_code || ''
        //         if (queryAuthCode) {
        //             this.setAuthCode(queryAuthCode)
        //             return
        //         }
        //         await this.$confirm(statusMap)
        //         // 如果时未开通授权，点击确定立即授权
        //         if (this.auditStatus === 'MP_NOT_AUTHORIZED') {
        //             this.givePower()
        //             return
        //         }
        //         await this.$router.push({ name: 'BindWechat' })
        //     } catch (e) {
        //         if (e) throw e
        //     }
        // }
    }

    // 老流程检查状态
    checkStatus () {
        // let status = this.auditStatus
        // if (status === 'MICRO_NOT_APPLY') {
        //     // 如果在申请小v商户，还需判断小v商户的申请状态
        //     status += this.vMerchantStatus.applymentState ? (`_${ this.vMerchantStatus.applymentState }`) : ''
        // }
        // if (status === 'MICRO_NOT_UPGRADE') {
        //     status += this.upgradeStatus.applymentState ? (`_${ this.upgradeStatus.applymentState }`) : ''
        // }
        // const statusMap = this.authMap[status]

        // if (status === 'MICRO_NOT_UPGRADE_REJECTED') {
        //     if (this.upgradeStatus.auditDetailModels) {
        //         statusMap.message = this.upgradeStatus.auditDetailModels.map(item => item.rejectReason).join(', ')
        //     }
        // }
        // if (statusMap) {
        //     this.$confirm(statusMap)
        //         .then(() => {
        //             this.$router.push({
        //                 name: 'WechatBind'
        //             })
        //         })
        // }
    }

    async testBindPhone () {
        try {
            const { result } = await isBindMobile()
            this.showPhoneTips = !result
        } catch (e) {
            throw e
        }
    }
}
</script>

<style lang="scss">
.home {
    display: grid;
    grid-template-columns: minmax(710px, 1fr) minmax(580px, 1fr);
    grid-template-rows: 267px 239px 239px;
    grid-gap: 10px;
    padding-bottom: 55px;
    box-sizing: border-box;
    .functions-panel,
    .write-off-panel,
    .operation-panel,
    .to-do-panel {
        padding: 0 36px;
        border: 1px solid #E7E7E7;
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
                color: #333333;
            }
            &-desc {
                margin-top: 4px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                line-height: 16px;
                color: #999999;
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
            color: #333333;
            &-number {
                display: block;
                font-size: 48px;
                font-family: Microsoft YaHei UI;
                font-weight: 600;
                line-height: 64px;
                &:hover {
                    color: #4F63FF;
                }
            }
            &-link {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                margin-left: 40px;
                margin-bottom: 13px;
                color: #4F63FF;
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
            font-size: 16px;
            font-family: Microsoft YaHei UI;
            line-height: 21px;
            color: #333333;
            &-total {
                font-size: 48px;
                font-weight: 600;
                line-height: 64px;
            }
            &-yesterday {
                margin-top: 8px;
                font-size: 16px;
                color: #999999;
            }
            &:hover {
                .operation-panel__item-total,
                .to-do-panel__item-total {
                    color: #4F63FF;
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
            color: #333333;
        }
        &__value {
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #4F63FF;
            &-text {
                cursor: pointer;
            }
        }
    }
}

</style>
