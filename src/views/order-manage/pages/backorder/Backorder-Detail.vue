<template>
    <div class="order-detail" v-if="Object.keys(detailInfo).length">
        <div class="detail-info">
            <div class="info-top">
                <h1>
                    <template v-if="detailInfo.auditStatus === 1">
                        待审核
                    </template>
                    <template v-if="detailInfo.auditStatus === 2 && (detailInfo.businessStatus === 1 || detailInfo.businessStatus === 2 || detailInfo.businessStatus === 3)">
                        退换货
                    </template>
                    <template v-if="detailInfo.auditStatus === 2 && (detailInfo.businessStatus === 4 || detailInfo.businessStatus === 5 || detailInfo.businessStatus === 7)">
                        退款中
                    </template>
                    <template v-if="detailInfo.auditStatus === 2 && detailInfo.businessStatus === 6">
                        已完成
                    </template>
                    <template v-if="detailInfo.auditStatus === 0">
                        取消售后
                    </template>
                    <template v-if="detailInfo.auditStatus === 3">
                        审核驳回
                    </template>
                    <div class="discount" v-if="detailInfo.orderType === 'KNOWLEDGE_COURSE' || detailInfo.orderType === 'SERIES_OF_COURSE' || detailInfo.orderType === 'LIVE_GOODS' || detailInfo.orderType === 'VIDEO_GOODS'">
                        <div class="discount-text">
                            {{ orderTypeText[detailInfo.orderType] }}
                        </div>
                    </div>

                    <div class="discount" v-if="detailInfo.orderSource > 1">
                        <div class="discount-text">
                            {{ activeStatusText[detailInfo.orderSource] }}
                        </div>
                    </div>
                </h1>
                <p><span>售后单号：</span>{{ detailInfo.id }}</p>
                <p><span>订单编号：</span>{{ detailInfo.orderDetailsModel.id }}</p>
                <p>
                    <span>订单状态：</span>
                    <template v-if="detailInfo.orderDetailsModel.status === 'WAIT_RECEIVE' && (detailInfo.orderDetailsModel.orderType === 'VIRTUAL_GOODS' || detailInfo.orderDetailsModel.orderType === 'FORMAL_CLASS' || detailInfo.orderDetailsModel.orderType === 'EXPERIENCE_CLASS')">
                        待使用
                    </template>
                    <template v-else>
                        {{ orderStatusText[detailInfo.orderDetailsModel.status] }}
                    </template>
                </p>
                <p><span>售后方式：</span>{{ detailInfo.serviceType === 1 ? '退货退款' : '仅退款' }}</p>
                <!--        <p v-if="orderDetailsModel.orderType === 'PHYSICAL_GOODS'">-->
                <!--          <span>货物状态：</span>{{ detailInfo.orderDetailsModel.status === 'FINISHED'? '已收到货' : '未收到货' }}-->
                <!--        </p>-->
                <p v-if="detailInfo.reasonForReturn">
                    <span>退货原因：</span>{{ detailInfo.reasonForReturn }}
                </p>
                <p><span>申&nbsp;&nbsp;请&nbsp;人：</span>{{ detailInfo.operatorName }}</p>
                <p><span>申请时间：</span>{{ detailInfo.createTime }}</p>
                <p style="max-width: 1000px" v-if="detailInfo.content">
                    <span>问题描述：</span>{{ detailInfo.content }}
                </p>
                <p v-if="detailInfo.urls.length">
                    <span>问题描述：</span>
                    <span class="image-list">
                        <span class="wapper">
                            <img v-imgError
                                 v-viewer
                                 v-for="(img, i) of detailInfo.urls"
                                 :style="{gridTemplateRows: `repeat(${Math.floor(detailInfo.urls.length / 3)}, '144px')`}"
                                 :key="i"
                                 :src="img + '?x-oss-process=style/thum'"
                                 alt="退款图片"
                            >
                        </span>
                    </span>
                </p>
                <div class="top-btn">
                    <el-button
                        @click="TurndownVisible = true"
                        v-if="detailInfo.auditStatus === 1"
                    >
                        驳回
                    </el-button>
                    <el-button
                        @click="ordersListAgree"
                        v-if="detailInfo.auditStatus === 1"
                    >
                        通过
                    </el-button>
                </div>
            </div>
            <div class="info-list">
                <div
                    class="list-item-other"
                >
                    <h6>收货人信息</h6>
                    <div class="other-info">
                        <p>
                            <span>收货人姓名:</span>
                            <span v-text="orderDetailsModel.consigneeName" />
                        </p>
                        <p>
                            <span>收货电话:</span>
                            <span
                                v-text="orderDetailsModel.consigneeMobile"
                                style="width: 135px;"
                            />
                        </p>
                        <p v-if="orderDetailsModel.orderType === 'PHYSICAL_GOODS'">
                            <span>收货地址:</span>
                            <span v-text="orderDetailsModel.address" />
                        </p>
                    </div>
                </div>
                <div
                    class="list-item-other"
                    v-if="orderDetailsModel.orderType === 'PHYSICAL_GOODS' && Object.keys(orderDetailsModel.shippingInfoModel).length"
                >
                    <h6>物流信息</h6>
                    <div class="other-info">
                        <p>
                            <span>配送方式:</span>
                            <span v-text="orderDetailsModel.shippingInfoModel.logisticsCompany" />
                        </p>
                        <p>
                            <span>快递单号:</span>
                            <span v-text="orderDetailsModel.shippingInfoModel.logisticsNo" />
                        </p>
                    </div>
                </div>
                <div
                    class="list-item-other"
                    v-if="orderDetailsModel.redeemCodeModels.length && orderDetailsModel.status !== 'CLOSED'"
                >
                    <h6>使用信息</h6>
                    <div class="redeem-code-items">
                        <p>核销码: </p>
                        <div class="items-group">
                            <div
                                class="items-item"
                                v-for="(item,index) of orderDetailsModel.redeemCodeModels"
                                :key="index"
                            >
                                <span
                                    :class="(item.status !== 0) ? 'used' : ''"
                                    v-text="item.code"
                                    style="width: 120px;"
                                />
                                <span>
                                    {{ codeStatus[item.status] }}
                                </span>
                                <span v-if="item.operatorUserName">核销人员：{{ item.operatorUserName }}</span>
                                <span
                                    v-text="item.operatorTime"
                                    v-if="showRedeemTime"
                                    style="width: 150px;"
                                />
                                <span
                                    v-text="item.userName"
                                    style="width: 80px;"
                                    v-if="!item.operatorTime"
                                />
                                <span
                                    v-text="item.userMobile"
                                    v-if="!item.operatorTime"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="product-list"
                >
                    <h6>商品信息</h6>
                    <template>
                        <div
                            class="item-goods"
                        >
                            <img
                                width="60"
                                height="60"
                                v-viewer
                                :src="orderDetailsModel.goodsModel.img"
                            >
                            <div class="goods-info">
                                <p>
                                    <span
                                        class="info-title"
                                        v-text="orderDetailsModel.goodsModel.name"
                                    />
                                    <span class="info-price">
                                        <span>
                                            <template v-if="orderDetailsModel.orderSource === 2">（团购价）</template>
                                            <template v-if="orderDetailsModel.orderSource === 3">（秒杀价）</template>
                                            <template v-if="orderDetailsModel.orderSource === 7">（公益价）</template>
                                            ￥{{ orderDetailsModel.goodsModel.sellingPrice/100 }}</span>
                                        <span>x{{ orderDetailsModel.goodsModel.count }}</span>
                                    </span>
                                </p>
                                <p class="info-info">
                                    规格: {{ orderDetailsModel.goodsModel.sku }}
                                    <span v-if="orderDetailsModel.goodsModel.subSku">,{{ orderDetailsModel.goodsModel.subSku }}</span>
                                </p>
                                <p class="info-total">
                                    小计: ￥{{ orderDetailsModel.goodsModel.goodsTotalPrice/100 }}
                                </p>
                            </div>
                            <template>
                                <div
                                    class="goods-sales"
                                    v-if="orderDetailsModel.helperName"
                                >
                                    <p>分享人姓名</p>
                                    <span v-text="orderDetailsModel.helperName" />
                                </div>
                                <div
                                    class="goods-sales"
                                    v-if="orderDetailsModel.realRebate"
                                >
                                    <p>润笔金额</p>
                                    <span>{{ orderDetailsModel.realRebate }}元</span>
                                </div>
                            </template>
                            <div
                                class="goods-sales"
                                v-if="orderDetailsModel.aftersaleStatus !== 'NO_AFTER_SALES'"
                            >
                                <p>售后状态</p>
                                <a
                                    class="goods-state-text"
                                >
                                    <!--审核状态-业务状态-->
                                    {{ detailInfo.auditStatus === 2 ? `${auditStatusText[detailInfo.auditStatus]} - ${businessStatusText[detailInfo.businessStatus]}`:auditStatusText[detailInfo.auditStatus] }}
                                </a>
                            </div>
                        </div>
                    </template>
                    <template v-if="orderDetailsModel.goodsModel && orderDetailsModel.goodsModel.couponAmount">
                        <p>
                            <span>参与活动</span>
                            <!-- 根据优惠券类型显示 1-满减券 2-品类券 -->
                            <span>优惠订单</span>
                        </p>
                        <p>
                            <span>{{ orderDetailsModel.couponName }}</span>
                            <span>-{{ orderDetailsModel.goodsModel.couponAmount/100 }}元</span>
                        </p>
                    </template>
                    <template v-if="orderDetailsModel.orderSource === 2">
                        <p>
                            <span>参与活动</span>
                            <span>团购-百人拼团（活动商品不支持退款）</span>
                        </p>
                        <p>
                            <span>成团金额</span>
                            <span>{{ orderDetailsModel.amount/100 - orderDetailsModel.freight/100 }}元</span>
                        </p>
                    </template>
                    <template v-if="orderDetailsModel.orderSource === 3">
                        <p>
                            <span>参与活动</span>
                            <span>秒杀活动</span>
                        </p>
                    </template>
                    <template v-if="orderDetailsModel.orderSource === 4">
                        <p>
                            <span>参与活动</span>
                            <span>预购-提前享（活动商品不支持退款）</span>
                        </p>
                        <p>
                            <span>定金翻倍</span>
                            <span>{{ orderDetailsModel.orderIntentionAmountDouble }}倍</span>
                        </p>
                        <p>
                            <span>抵用金额</span>
                            <span>{{ orderDetailsModel.orderIntentionAmount/100 * orderDetailsModel.orderIntentionAmountDouble }}元</span>
                        </p>
                        <p>
                            <span>应付尾款</span>
                            <span>{{ orderDetailsModel.orderAmountTailMoney/100 }}元</span>
                        </p>
                    </template>
                    <template v-if="orderDetailsModel.orderSource === 5">
                        <p>
                            <span>参与活动</span>
                            <span>春耘计划</span><span>（{{ orderDetailsModel.activityName }}）</span>
                        </p>
                        <p>
                            <span>活动优惠</span>
                            <span>{{ (orderDetailsModel.discount)/10 }}折
                                <template>（优惠{{ (orderDetailsModel.goodsModel.goodsTotalPrice - orderDetailsModel.amount - orderDetailsModel.freight)/100 }}元）</template>
                            </span>
                        </p>
                    </template>
                    <template v-if="orderDetailsModel.orderSource === 6">
                        <p>
                            <span>参与活动</span>
                            <span>组合聚惠学</span><span>（{{ orderDetailsModel.activityName }}）</span>
                        </p>
                        <p>
                            <span>活动优惠</span>
                            <span>{{ (orderDetailsModel.discount)/10 }}折
                                <template>（优惠{{ (orderDetailsModel.goodsModel.goodsTotalPrice - orderDetailsModel.amount - orderDetailsModel.freight)/100 }}元）</template>
                            </span>
                        </p>
                    </template>
                    <template v-if="orderDetailsModel.orderSource === 7">
                        <p>
                            <span>参与活动</span>
                            <span>公益活动</span> <span>（{{ orderDetailsModel.activityName }}）</span>
                        </p>
                    </template>
                    <template v-if="orderDetailsModel.orderSource === 8">
                        <p>
                            <span>参与活动</span>
                            <span>兑换码活动</span> <span>（{{ orderDetailsModel.activityName }}）</span>
                        </p>
                        <p>
                            <span>兑换码号</span>
                            <span>{{ orderDetailsModel.exchangeCode }}</span>
                        </p>
                    </template>
                    <p v-if="orderDetailsModel.scholarship">
                        <span>红包</span>
                        <span>-{{ orderDetailsModel.scholarship/100 }}元</span>
                    </p>
                    <p>
                        <span>订单金额</span>
                        <span>{{ (orderDetailsModel.amount - orderDetailsModel.freight)/100 }}元</span>
                    </p>
                    <p v-if="orderDetailsModel.orderType === 'PHYSICAL_GOODS'">
                        <span>运费</span>
                        <span>{{ orderDetailsModel.freight/100 }}元</span>
                    </p>
                    <p>
                        <span>实付金额</span>
                        <span v-if="orderDetailsModel.orderPayTransInfos && orderDetailsModel.orderPayTransInfos.length && orderDetailsModel.orderPayTransInfos.find(item => item.payStatus === 'SUCCESS')">{{ orderDetailsModel.amount/100 }}元</span>
                        <span v-else>0元</span>
                    </p>
                    <p>
                        <span>应退金额</span>
                        <span>{{ detailInfo.refundableAmount / 100 }}元</span>
                    </p>
                    <p>
                        <span>实退金额</span>
                        <span>{{ detailInfo.refundsAmount /100 }}元</span>
                        <!--0 取消售后 1 待审核 2 审核通过 3 退款驳回-->
                        <b v-if="detailInfo.auditStatus === 1" v-show="!isShowEditInfoForm" class="modify-amount" @click="modifyAmount">修改金额</b>
                        <i
                            class="modify-amount-form"
                            v-if="isShowEditInfoForm"
                        >
                            <el-input
                                type="number"
                                v-model="editInfoForm.actualRefund"
                                style="width: 100px;margin-right: 10px;"
                                @blur="editInfoForm.actualRefund = testMoney(editInfoForm.actualRefund, '修改金额')"
                            />
                            <el-select v-model="editInfoForm.operationMemo" @change="changeOperationMemo()">
                                <el-option
                                    v-for="(item,index) of editInfoList"
                                    :key="index"
                                    :label="item.dictDataValue"
                                    :value="item.dictDataKey"
                                />
                            </el-select>
                            <a @click="makeSureModifyAmount">保存</a>
                            <a @click="closeModifyAmount">取消</a>
                        </i>
                    </p>
                    <p v-if="orderDetailsModel.message">
                        <span>备注</span>
                        <span v-text="orderDetailsModel.message" />
                    </p>
                    <p
                        v-if="orderDetailsModel.invoiceInfoModel"
                    >
                        <span>
                            发票信息
                            <i
                                class="sub-title"
                            >({{ invoiceStatusText[orderDetailsModel.invoiceInfoModel.status] }})</i>
                        </span>
                        <span class="item-invoice">
                            <span>
                                {{ orderDetailsModel.invoiceInfoModel.invoiceType === 1 ? '个人':'单位' }}
                                <el-button class="ml-20" type="text" @click="getInvoiceDetail ()">
                                    查看详情
                                </el-button>
                            </span>
                            <template v-if="Number(orderDetailsModel.invoiceInfoModel.invoiceType) === 1">
                                <span v-if="orderDetailsModel.invoiceInfoModel.mailingMethod === '1'">提取方式：门店自提 </span>
                                <span v-else>提取方式：邮寄 </span>
                                <span>姓名: {{ orderDetailsModel.invoiceInfoModel.invoiceTitle }}</span>
                                <span>电话: {{ orderDetailsModel.invoiceInfoModel.companyPhone }}</span>
                                <span
                                    v-if="orderDetailsModel.invoiceInfoModel.invoiceNo"
                                >发票编号: {{ orderDetailsModel.invoiceInfoModel.invoiceNo }}</span>
                            </template>
                            <template v-if="Number(orderDetailsModel.invoiceInfoModel.invoiceType) === 2">
                                <span v-if="orderDetailsModel.invoiceInfoModel.mailingMethod === '1'">提取方式：门店自提 </span>
                                <span v-else>提取方式：邮寄 </span>
                                <span>发票抬头: {{ orderDetailsModel.invoiceInfoModel.invoiceTitle }}</span>
                                <span>发票税号: {{ orderDetailsModel.invoiceInfoModel.taxpayerNumber }}</span>
                                <span
                                    v-if="orderDetailsModel.invoiceInfoModel.invoiceNo"
                                >发票编号: {{ orderDetailsModel.invoiceInfoModel.invoiceNo }}</span>
                            </template>
                        </span>
                    </p>
                </div>

                <div
                    class="list-item-other"
                    v-if="orderDetailsModel.orderPayTransInfos && orderDetailsModel.orderPayTransInfos.length"
                >
                    <h6>交易信息</h6>
                    <template
                        v-if="orderDetailsModel.orderPayTransInfos && orderDetailsModel.orderPayTransInfos.length && orderDetailsModel.orderPayTransInfos.find(item => item.payStatus === 'SUCCESS')"
                    >
                        <div class="other-info" v-for="(item,index) in orderDetailsModel.orderPayTransInfos" :key="index">
                            <p v-if="item.paymentMethodName">
                                <span v-if="item.type === 'REFUND'">退款方式</span>
                                <span v-else>支付方式</span>
                                <span v-text="item.paymentMethodName" />
                            </p>
                            <p v-if="item.serialNo && item.type !== 'REFUND'">
                                <span>支付流水号</span>
                                <span v-text="item.serialNo" />
                            </p>
                            <p v-if="orderDetailsModel.createTime && item.type !== 'REFUND'">
                                <span>下单时间</span>
                                <span v-text="orderDetailsModel.createTime" />
                            </p>
                            <p v-if="item.callbackTime">
                                <span v-if="item.type === 'REFUND'">退款时间</span>
                                <span v-else>支付时间</span>
                                <span v-text="item.callbackTime" />
                            </p>
                            <p v-if="orderDetailsModel.confimTime">
                                <span>确认收货时间</span>
                                <span v-text="orderDetailsModel.confimTime" />
                            </p>
                            <p v-if="orderDetailsModel.endTime">
                                <span>订单关闭时间</span>
                                <span v-text="orderDetailsModel.endTime" />
                            </p>
                        </div>
                    </template>
                    <div class="other-info" v-else>
                        <p v-if="detailInfo.createTime">
                            <span>下单时间</span>
                            <span v-text="detailInfo.createTime" />
                        </p>
                    </div>
                </div>

                <div
                    class="list-item-other other-records"
                    v-if="operationRecordList.length"
                    id="records"
                >
                    <h6>操作记录</h6>
                    <div class="operator-content">
                        <template v-for="(item, index) of operationRecordList">
                            <div :key="index + '_massage'" v-text="item.message" class="operator-message" />
                            <p :key="index + '_operatorTime'" class="operatorTime">
                                <span>操作时间:</span>
                                <span v-text="item.operatorTime" />
                            </p>
                            <p :key="index + '_operatorUser'" class="operatorUser">
                                <span>操作人员:</span>
                                <span v-text="item.operatorUserName" />
                            </p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <InvoiceDetails
            :show.sync="InvoiceDetailsVisible"
            :id="invoiceId"
        />
        <BackorderTurndown
            :show.sync="TurndownVisible"
            :order-id="detailInfo.id"
            @success="getOrderDetail()"
        />
    </div>
</template>

<script>
import { getBackorderDetail, returnOrdersListAgree, modifyActualRefund } from '../../../../apis/order'
import { getDataDictionary } from '../../../../apis/common'
import { isMoney } from '../../../../assets/ts/validate'
import InvoiceDetails from '../../../../components/order-center/Invoice-Details.vue'
import BackorderTurndown from '../../../../components/order-center/Backorder-Turndown.vue'
export default {
    name: 'BackOrderDetail',
    components: {
        InvoiceDetails,
        BackorderTurndown
    },
    data () {
        return {
            // 驳回
            TurndownVisible: false,
            // 发票详情id
            invoiceId: '',
            InvoiceDetailsVisible: false,
            // 是否展示修改金额form
            isShowEditInfoForm: false,
            editInfoList: [],
            editInfoForm: {
                id: '', // 退单id
                actualRefund: '', // 实际退款金额（分）
                operationMemo: '', // 退款原因数据字典key
                operationContent: '' // 退款原因数据字典content
            },
            orderStatusText: {
                ALL_ORDER: '全部订单',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                WAIT_PAY_TAIL_MONEY: '待付尾款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            },
            activeStatusText: {
                0: '优惠券订单',
                1: '普通订单',
                2: '团购订单',
                3: '秒杀订单',
                4: '预购订单',
                5: '春耘订单',
                6: '组合课订单',
                7: '公益订单',
                8: '兑换码订单'
            },
            auditStatusText: {
                0: '取消售后',
                1: '待审核',
                2: '审核通过',
                3: '退款驳回'
            },
            businessStatusText: {
                1: '待退货',
                2: '待收货',
                3: '退货完成',
                4: '待退款',
                5: '退款中',
                6: '退款成功',
                7: '退款失败'
            },
            invoiceStatusText: {
                0: '待开票',
                1: '已开票',
                2: '已取消'
            },
            codeStatus: {
                0: '待使用',
                1: '已使用',
                2: '退款中',
                3: '已退款',
                4: '已过期',
                8: '无效票',
                9: '未开始'
            },
            aftersaleStatusText: {
                NO_AFTER_SALES: '无售后',
                PROCESSING: '处理中',
                PROCESSING_COMPLETED: '处理完成'
            },
            orderTypeText: {
                VIRTUAL_GOODS: '虚拟商品',
                PHYSICAL_GOODS: '实体商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课程',
                LIVE_GOODS: '直播',
                VIDEO_GOODS: '录播'
            },
            // 展示信息对象与简写引用
            detailInfo: {},
            // 操作记录
            operationRecordList: [],
            productInfoModel: {},
            productDetailModels: [],
            productCustomDetailModels: [],
            redeemCodeModels: [],
            // 学员信息核销时间UI显示状态
            showRedeemTime: false,
            // 订单详情
            orderDetailsModel: {}
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
        customShow () { // 商品中有需要自定义表单的商品时，显示用户信息/学员信息
            return this.productDetailModels.filter(item => item.needStudentInfo === 2).length
        }
    },
    async created () {
        try {
            await this.getOrderDetail()
        } catch (e) {
            throw e
        }
    },
    methods: {
    // 获取页面展示数据
        async getOrderDetail () {
            try {
                const { result } = await getBackorderDetail(this.id)
                this.detailInfo = result || {}
                const {
                    record,
                    orderDetailsModel
                } = this.detailInfo
                this.orderDetailsModel = orderDetailsModel || {}
                this.operationRecordList = record || []
                for (const item of orderDetailsModel.redeemCodeModels) {
                    item.code = item.code.replace(/^(\d{4})\d{4}(\d+)/, '$1****$2')
                    if (item.operatorTime) this.showRedeemTime = true
                }
                this.redeemCodeModels = orderDetailsModel.redeemCodeModels || []
                if (this.detailInfo.orderType === 'PHYSICAL_GOODS') this.customTitle = '编辑用户信息'
            } catch (e) {
                throw e
            }
        },
        // 获取发票详情
        async getInvoiceDetail () {
            this.invoiceId = this.detailInfo.orderDetailsModel.invoiceId
            this.InvoiceDetailsVisible = true
        },
        async ordersListAgree () {
            let warningText = ''
            let title = ''
            if (this.detailInfo.orderDetailsModel.status === '') warningText = '提示：订单异常无货物状态及物流信息，请及时核实货物信息，以免造成财物损失！'
            if ((this.detailInfo.orderDetailsModel.status === 'WAIT_RECEIVE' || this.detailInfo.orderDetailsModel.status === 'FINISHED') && this.detailInfo.serviceType === 2) {
                title = '是否同意该“仅退款”售后申请？'
                if (this.detailInfo.orderDetailsModel.orderType === 'PHYSICAL_GOODS') warningText = '提示：该商品已发货，请及时核实货物信息，以免造成财物损失！'
                if (this.detailInfo.orderDetailsModel.orderType !== 'PHYSICAL_GOODS') warningText = ''
            }
            if (this.detailInfo.orderDetailsModel.status === 'WAIT_SHIP' && this.detailInfo.serviceType === 2) title = '是否同意该“仅退款”售后申请？'
            if (this.detailInfo.serviceType === 1) title = '确定同意该退款申请？同意后请及时核实货物退回信息。'
            await this.$confirm({
                title,
                message: warningText,
                confirmButtonText: '同意'
            })
            try {
                await returnOrdersListAgree({ id: this.detailInfo.id })
                this.$success('操作成功')
                this.getOrderDetail()
            } catch (e) {
                throw e
            }
        },
        // 修改金额
        modifyAmount () {
            try {
                this.getEditInfoList()
                this.isShowEditInfoForm = true
            } catch (e) {
                throw e
            }
        },
        // 获取驳回原因字典
        async getEditInfoList () {
            try {
                const { result } = await getDataDictionary('REASONMODIFIEDAMOUNT')
                this.editInfoList = result || []
            } catch (e) {
                throw e
            }
        },
        changeOperationMemo () {
            for (const item of this.editInfoList) {
                if (item.dictDataKey === this.editInfoForm.operationMemo) {
                    this.editInfoForm.operationContent = item.dictDataValue
                }
            }
        },
        // 金额验证
        testMoney (money, text = '') {
            if (!money) {
                return ''
            }
            if (money > 99999999) {
                this.$warning(`${ text }最高不可超过99999999`)
                return ''
            }
            if (!isMoney(money)) {
                this.$error('请输入正确的金额')
                return ''
            }
            return Number(money)
        },
        // 确认提交申请
        async makeSureModifyAmount () {
            try {
                const { actualRefund, operationMemo, operationContent } = this.editInfoForm
                const { refundableAmount } = this.detailInfo
                if (!actualRefund || !operationMemo) return this.$warning('请输入修改金额并选择原因')
                if (!this.testMoney(actualRefund, '修改金额')) return
                if (Math.round(actualRefund * 100) > refundableAmount) return this.$warning('修改金额应该小于等于应退金额')
                await this.$confirm({
                    title: '确认修改实际退款金额吗？修改后将不可更改。',
                    dangerouslyUseHTMLString: true,
                    message: `
            <div style="margin-left: 10px; font-size: 16px;">
                应退金额：￥${ refundableAmount / 100 }
                <br/>
                修改金额：￥${ actualRefund }
                <br/>
                实退金额：￥${ actualRefund }
                <br/>
                修改原因：${ operationContent }
            </div>
          `
                })
                await this.submitModifyAmount()
            } catch (e) {
                throw e
            }
        },
        // 关闭申请输入页面
        closeModifyAmount () {
            this.editInfoForm = {
                id: '',
                actualRefund: '',
                operationMemo: '',
                operationContent: ''
            }
            this.isShowEditInfoForm = false
        },
        // 修改金额
        async submitModifyAmount () {
            try {
                const form = JSON.parse(JSON.stringify(this.editInfoForm))
                form.actualRefund = Math.round(form.actualRefund * 100)
                form.id = this.id
                await modifyActualRefund(form)
                await this.getOrderDetail()
                this.isShowEditInfoForm = false
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .order-detail {
    min-height: calc(100vh - 60px);
    padding-bottom: 30px;
    background-color: #fff;
    .detail-info {
      padding: 28px 0 28px 180px;
      color: #333;
      .info-top {
        position: relative;
        h1 {
          display: flex;
          align-items: center;
          font-size: 24px;
          .discount {
            position: relative;
            display: inline-flex;
            margin-right: 2px;
            margin-left: 4px;
            & .discount-text {
              padding: 0 7px;
              font-size: 14px;
              font-weight: 400;
              color: #fff;
              background-color: #ec742e;
            }
          }
          span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin: 0 10px 0 40px;
            border-radius: 50%;
            background-color: #598bf8;

            i {
              color: #fff;
              font-size: 14px;
            }
          }

          a {
            color: #598bf8;
            font-size: 16px;
            font-weight: 500;
          }
        }
        p {
          >span {
            display: inline-flex;
            justify-content: flex-end;
            width: 110px;
            margin-left: -10px;
            padding-right: 10px;
          }
          max-width: 1360px;
          margin-left: 10px;
          font-size: 20px;
          line-height: 40px;
        }
        .image-list {
          display: inline-block;
          padding-bottom: 20px;
          vertical-align: text-top;
          font-size: 0;
          .wapper {
            display: grid;
            grid-template-columns: repeat(3, 144px);
            grid-gap: 10px;
            > img {
              width: 144px;
              height: 144px;
              object-fit: cover;
            }
          }
        }
        .top-btn {
          position: absolute;
          right: 174px;
          bottom: 12px;
        }
      }

      .info-list {
        display: flex;
        flex-direction: column;
        width: 1360px;
        margin-top: 24px;
        padding: 0 24px 24px;
        background-color: #fbfbfb;
        box-shadow: 0 3px 8px 0 rgba(44, 48, 58, .08);

        .list-item-other {
          border-bottom: 1px solid #e9e9e9;
          &:last-of-type {
            border: none;
          }
          > h6 {
            margin: 24px 0 16px 0;
            color: #5a5a5a;
            font-size: 18px;
            font-weight: bolder;
          }
          .other-info {
            margin-bottom: 16px;
            > p {
              margin-bottom: 16px;
              span {
                &:first-of-type {
                  display: inline-flex;
                  min-width: 150px;
                }
                &:last-of-type {
                  color: #222;
                  font-size: 14px;
                  font-weight: bolder;
                }
              }
            }
          }
          .redeem-code-items {
            display: flex;
            margin-bottom: 24px;
            > p {
              margin-right: 20px;
              color: #5a5a5a;
              font-size: 14px;
            }
            .items-group {
              .items-item {
                margin-bottom: 16px;
                color: #333;
                font-size: 14px;
                font-weight: 600;
                &:last-of-type {
                  margin-bottom: 0;
                }
                > span {
                  display: inline-flex;
                  margin-right: 32px;
                  &:last-of-type {
                    margin-right: 0;
                  }
                }
                .used {
                  color: #999;
                }
              }
            }
          }
          .custom-info {
            width: 440px;
            padding: 8px 16px 16px 16px;
            margin-bottom: 24px;
            background-color: #fff;
            border: 1px solid #e7e7e7;
            .info-title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #e7e7e7;
              margin-bottom: 14px;
              span {
                &:first-of-type {
                  color: #ec742e;
                  font-size: 16px;
                  font-weight: bold;
                }
              }
            }
            .info-content {
              div {
                display: flex;
                justify-content: space-between;
                padding: 3px;
                span {
                  width: 200px;
                  font-size: 16px;
                  color: #222;
                  &:last-of-type {
                    display: inline-flex;
                    justify-content: flex-end;
                    font-weight: bold;
                  }
                }
              }
            }
          }
        }
        .product-list {
          border-bottom: 1px solid #e7e7e7;
          &:last-of-type {
            border: none;
          }
          > h6 {
            margin: 24px 0 16px 0;
            color: #5a5a5a;
            font-size: 18px;
            font-weight: bolder;
          }
          .item-goods {
            display: flex;
            margin-bottom: 25px;
            > img {
              margin-right: 12px;
              object-fit: cover;
            }
            .goods-info {
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
              .info-info {
                margin-top: 2px;
                color: #999;
                font-size: 12px;
              }
              .info-total {
                margin-top: 2px;
                text-align: right;
                color: #000;
                font-size: 14px;
              }
            }
            .goods-sales {
              display: inline-flex;
              flex-direction: column;
              margin-left: 50px;
              .goods-state-btn {
                display: inline-flex;
                align-items: center;
                margin-top: 10px;
                color: #598bf8;
                font-size: 14px;
                text-decoration: underline;
              }
              .goods-state-text {
                display: inline-flex;
                align-items: center;
                margin-top: 10px;
                color: #999;
                font-size: 14px;
              }
              p {
                color: #000;
                font-size: 14px;
              }
              span {
                margin-top: 6px;
                color: #000;
                font-size: 18px;
                font-weight: bolder;
              }
            }
          }
          .item-invoice {
            display: inline-flex;
            flex-direction: column;
            > span {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              color: #222;
              font-size: 14px;
              font-weight: normal;
              > a {
                margin-left: 30px;
                color: #598bf8;
                font-size: 12px;
                font-weight: normal;
                text-decoration: underline;
              }
              &:first-of-type {
                font-weight: bolder;
              }
              &:last-of-type {
                margin-bottom: 0;
                font-weight: normal;
              }
            }
          }
          > p {
            margin-bottom: 16px;
            span {
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
            .modify-amount {
              margin-left: 40px;
              text-decoration: underline;
              font-weight: 400;
              color: #598BF8;
              cursor: pointer;
            }
            .modify-amount-form {
              margin-left: 30px;

              > a {
                color: #598BF8;
                font-size: 12px;
                margin-left: 24px;
              }
            }
          }
          .sub-title {
            margin-left: 12px;
            color: #999;
          }
        }
        .other-records {
          .operator-content {
            display: grid;
            width: max-content;
            grid-template-columns: repeat(3, auto);
            grid-gap: 24px 30px;
          }
          .operator-message {
            font-weight: bold;
            &:nth-of-type(1) {
              color: #ec742e;
            }
          }
          .operatorTime, .operatorUser {
            color: #222;
            > span:last-of-type {
              margin-left: 10px;
              font-weight: bolder;
            }
          }
        }
      }
    }
  }
</style>
