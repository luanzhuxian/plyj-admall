<template>
    <div class="order-detail" v-if="Object.keys(detailInfo).length">
        <div class="detail-info">
            <div class="info-top">
                <h1>
                    {{ detailInfo.status === 'WAIT_RECEIVE' && (detailInfo.orderType === 'VIRTUAL_GOODS' || detailInfo.orderType === 'FORMAL_CLASS' || detailInfo.orderType === 'EXPERIENCE_CLASS') ? '待使用' : orderStatusText[detailInfo.status] }}
                    <div class="discount" v-if="detailInfo.orderType === 'KNOWLEDGE_COURSE' || detailInfo.orderType === 'SERIES_OF_COURSE' || detailInfo.orderType === 'LIVE_GOODS' || detailInfo.orderType === 'VIDEO_GOODS' || detailInfo.orderType === 'GRAPHIC_DATA'">
                        <div class="discount-text">
                            {{ orderTypeText[detailInfo.orderType] }}
                        </div>
                    </div>

                    <div class="discount" v-if="detailInfo.orderSource > 1">
                        <div class="discount-text">
                            {{ activeStatusText[detailInfo.orderSource] }}
                        </div>
                    </div>

                    <div class="discount" v-if="detailInfo.couponAmount || detailInfo.scholarship">
                        <div class="discount-text scholarship-text">
                            优惠
                        </div>
                    </div>
                </h1>
                <p>订单编号：{{ detailInfo.id }}</p>
                <div class="top-btn">
                    <el-button
                        @click="shipmentsVisible = true"
                        v-if="detailInfo.orderType === 'PHYSICAL_GOODS' && detailInfo.status === 'WAIT_SHIP' && detailInfo.aftersaleStatus !== 'PROCESSING'"
                        round
                    >
                        发货
                    </el-button>
                    <el-button
                        @click="afterVisible = true"
                        v-if="canApplyRefund"
                        round
                    >
                        申请售后
                    </el-button>
                    <el-button
                        @click="closeOrderVisible = true"
                        v-if="detailInfo.status === 'WAIT_PAY'"
                        round
                    >
                        关闭订单
                    </el-button>
                </div>
            </div>
            <div class="info-list">
                <div
                    class="list-item-other"
                >
                    <h6> {{ detailInfo.orderType === 'PHYSICAL_GOODS' ? '收货人' : '联系人' }}信息</h6>
                    <div class="other-info">
                        <p>
                            <span>{{ detailInfo.orderType === 'PHYSICAL_GOODS' ? '收货人' : '联系人' }}姓名:</span>
                            <span v-text="detailInfo.consigneeName" />
                        </p>
                        <p>
                            <span>{{ detailInfo.orderType === 'PHYSICAL_GOODS' ? '收货人' : '联系人' }}电话:</span>
                            <span
                                v-text="detailInfo.consigneeMobile"
                                style="width: 135px;"
                            />
                        </p>
                        <p v-if="detailInfo.orderType === 'PHYSICAL_GOODS'">
                            <span>收货地址:</span>
                            <span v-text="detailInfo.address" />
                        </p>
                        <el-button
                            type="text"
                            @click="consigneeVisible = true"
                            v-if="detailInfo.orderType === 'PHYSICAL_GOODS' && detailInfo.status !== 'WAIT_RECEIVE' && detailInfo.status !== 'FINISHED' && detailInfo.status !== 'CLOSED'"
                        >
                            修改信息
                        </el-button>
                    </div>
                </div>
                <div
                    class="list-item-other"
                    v-if="detailInfo.orderType === 'PHYSICAL_GOODS' && Object.keys(detailInfo.shippingInfoModel).length"
                >
                    <h6>物流信息</h6>
                    <div class="other-info">
                        <p>
                            <span>配送方式:</span>
                            <span v-text="detailInfo.shippingInfoModel.logisticsCompany" />
                        </p>
                        <p>
                            <span>快递单号:</span>
                            <span v-text="detailInfo.shippingInfoModel.logisticsNo" />
                        </p>
                        <el-button v-if="detailInfo.status === 'FINISHED' || detailInfo.status === 'CLOSED'" type="text" disabled>
                            修改信息
                        </el-button>
                        <el-button type="text" v-else @click="ModifyShipVisible = true">
                            修改信息
                        </el-button>
                    </div>
                </div>
                <div
                    class="list-item-other"
                    v-if="redeemCodeModels.length && detailInfo.status !== 'CLOSED' && detailInfo.status !== 'WAIT_PAY' && redeemCodeModels[0].code"
                >
                    <h6>使用信息</h6>
                    <div class="redeem-code-items">
                        <p>核销码: </p>
                        <div class="items-group">
                            <div
                                class="items-item"
                                v-for="(item,index) of detailInfo.redeemCodeModels"
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
                                    v-if="!item.operatorTime && item.userName"
                                />
                                <span
                                    v-text="item.userMobile"
                                    v-if="!item.operatorTime && item.userMobile"
                                />
                                <span v-if="item.status === 1">核销方式：<template v-if="item.redeemMode === 1">扫码核销</template><template v-if="item.redeemMode === 2">无码核销</template></span>
                                <el-button v-if="item.status === 0" @click="uncodedVerification(item.id)" type="text">
                                    核销
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="product-list"
                >
                    <h6 v-if="detailInfo.orderType === 'PHYSICAL_GOODS' || detailInfo.orderType === 'VIRTUAL_GOODS'">商品信息</h6>
                    <h6 v-else-if="detailInfo.orderType === 'RED_ENVELOPE'">福利红包信息</h6>
                    <h6 v-else>课程信息</h6>
                    <template>
                        <div
                            class="item-goods"
                        >
                            <img
                                width="60"
                                height="60"
                                v-viewer
                                :src="detailInfo.orderType === 'RED_ENVELOPE'?'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-packet-order-icon.png':detailInfo.goodsModel.img"
                            >
                            <div class="goods-info">
                                <p>
                                    <span
                                        class="info-title"
                                        v-text="detailInfo.goodsModel.name"
                                    />
                                    <span class="info-price">
                                        <span>
                                            <template v-if="detailInfo.orderSource === 2">（团购价）</template>
                                            <template v-if="detailInfo.orderSource === 3">（秒杀价）</template>
                                            <template v-if="detailInfo.orderSource === 7">（公益价）</template>
                                            ￥{{ detailInfo.goodsModel.sellingPrice/100 }}</span>
                                        <span>x{{ detailInfo.goodsModel.count }}</span>
                                    </span>
                                </p>
                                <p class="info-info" v-if="detailInfo.orderType !== 'KNOWLEDGE_COURSE' && detailInfo.orderType !== 'SERIES_OF_COURSE' && detailInfo.orderType !== 'GRAPHIC_DATA' && detailInfo.orderType !== 'LIVE_GOODS' && detailInfo.orderType !== 'VIDEO_GOODS' && detailInfo.orderType !== 'RED_ENVELOPE'">
                                    规格: {{ detailInfo.goodsModel.sku }}
                                    <span v-if="detailInfo.goodsModel.subSku">,{{ detailInfo.goodsModel.subSku }}</span>
                                </p>
                                <p v-if="detailInfo.orderType === 'KNOWLEDGE_COURSE' || detailInfo.orderType === 'SERIES_OF_COURSE' || detailInfo.orderType === 'GRAPHIC_DATA'" class="info-info">
                                    <!--                  此处cout应为系列课节数，此处有误-->
                                    {{ detailInfo.goodsModel.contentCount }}节
                                </p>
                                <p class="info-info" v-if="detailInfo.orderType === 'RED_ENVELOPE'">
                                    满{{ detailInfo.goodsModel.sku }}抵{{ detailInfo.goodsModel.subSku }}
                                </p>
                                <p class="info-total">
                                    小计: ￥{{ detailInfo.goodsModel.goodsTotalPrice/100 }}
                                </p>
                            </div>
                            <template v-if="detailInfo.rebate && detailInfo.sharer">
                                <div
                                    class="goods-sales"
                                    v-if="detailInfo.sharer"
                                >
                                    <p>分享人姓名</p>
                                    <span v-text="detailInfo.sharer" />
                                </div>
                                <div
                                    class="goods-sales"
                                    v-if="detailInfo.rebate"
                                >
                                    <p>润笔金额</p>
                                    <span>{{ detailInfo.rebate }}元</span>
                                </div>
                            </template>
                            <div
                                class="goods-sales"
                                v-if="detailInfo.aftersaleStatus !== 'NO_AFTER_SALES'"
                            >
                                <p>售后状态</p>
                                <el-button
                                    type="text"
                                    @click="$router.push({ name: 'BackorderDetail', params: { id: detailInfo.orderRefundsModel.id } })"
                                >
                                    <!--审核状态-业务状态-->
                                    {{ detailInfo.orderRefundsModel.auditStatus === 2 ? `${auditStatusText[detailInfo.orderRefundsModel.auditStatus]} - ${businessStatusText[detailInfo.orderRefundsModel.businessStatus]}`:auditStatusText[detailInfo.orderRefundsModel.auditStatus] }}
                                </el-button>
                            </div>
                            <div
                                class="goods-sales"
                                v-if="detailInfo.status !== 'CLOSED' && detailInfo.status !== 'WAIT_PAY' && !isAftersale"
                            >
                                <p>发票状态</p>
                                <el-button
                                    type="text"
                                    @click="$router.push({ name: 'ApplyInvoice', query: { id, userId: detailInfo.userId } })"
                                    v-if="canApplyInvoice"
                                >
                                    申请发票
                                </el-button>
                                <span
                                    class="goods-state-text"
                                    v-if="!detailInfo.supportInvoice || this.detailInfo.amount === this.detailInfo.freight || detailInfo.orderSource > 1"
                                >
                                    不支持
                                </span>
                                <span
                                    v-else
                                    class="goods-state-text"
                                    v-text="invoiceStatusText[detailInfo.invoiceInfoModel.status]"
                                />
                            </div>
                        </div>
                    </template>
                    <template v-if="detailInfo.goodsModel && (detailInfo.goodsModel.couponeAmount || detailInfo.scholarship || detailInfo.welfareRedEnvelope)">
                        <p>
                            <span>参与活动</span>
                            <!-- 根据优惠券类型显示 1-满减券 2-品类券 -->
                            <span>优惠订单</span>
                        </p>
                        <p v-if="detailInfo.goodsModel.couponeAmount">
                            <span>{{ detailInfo.couponName }}</span>
                            <span>-{{ detailInfo.goodsModel.couponeAmount/100 }}元</span>
                        </p>
                        <p v-if="detailInfo.welfareRedEnvelope">
                            <span>福利红包</span>
                            <span>-{{ detailInfo.welfareRedEnvelope/100 }}元</span>
                        </p>
                    </template>
                    <template v-if="detailInfo.orderSource === 2">
                        <p>
                            <span>参与活动</span>
                            <span>团购-百人拼团（活动商品不支持退款）</span>
                        </p>
                        <p>
                            <span>成团金额</span>
                            <span>{{ detailInfo.amount/100 - detailInfo.freight/100 }}元</span>
                        </p>
                    </template>
                    <template v-if="detailInfo.orderSource === 3">
                        <p>
                            <span>参与活动</span>
                            <span>秒杀活动</span>
                        </p>
                    </template>
                    <template v-if="detailInfo.orderSource === 4">
                        <p>
                            <span>参与活动</span>
                            <span>预购-提前享（活动商品不支持退款）</span>
                        </p>
                        <p>
                            <span>定金翻倍</span>
                            <span>{{ detailInfo.orderIntentionAmountDouble }}倍</span>
                        </p>
                        <p>
                            <span>抵用金额</span>
                            <span>{{ detailInfo.orderIntentionAmount/100 * detailInfo.orderIntentionAmountDouble }}元</span>
                        </p>
                        <p>
                            <span>应付尾款</span>
                            <span>{{ detailInfo.orderAmountTailMoney/100 }}元</span>
                        </p>
                    </template>
                    <template v-if="detailInfo.orderSource === 5">
                        <p>
                            <span>参与活动</span>
                            <span>春耘计划</span><span>（{{ detailInfo.activityName }}）</span>
                        </p>
                        <p>
                            <span>活动优惠</span>
                            <span>{{ (detailInfo.discount)/10 }}折
                                <template>（优惠{{ (detailInfo.goodsModel.goodsTotalPrice - detailInfo.amount - detailInfo.freight)/100 }}元）</template>
                            </span>
                        </p>
                    </template>
                    <template v-if="detailInfo.orderSource === 6">
                        <p>
                            <span>参与活动</span>
                            <span>组合聚惠学</span><span>（{{ detailInfo.activityName }}）</span>
                        </p>
                        <p>
                            <span>活动优惠</span>
                            <span>{{ (detailInfo.discount)/10 }}折
                                <template>（优惠{{ (detailInfo.goodsModel.goodsTotalPrice - detailInfo.amount - detailInfo.freight)/100 }}元）</template>
                            </span>
                        </p>
                    </template>
                    <template v-if="detailInfo.orderSource === 7">
                        <p>
                            <span>参与活动</span>
                            <span>公益活动</span> <span>（{{ detailInfo.activityName }}）</span>
                        </p>
                    </template>
                    <template v-if="detailInfo.orderSource === 8">
                        <p>
                            <span>参与活动</span>
                            <span>兑换码活动</span> <span>（{{ detailInfo.activityName }}）</span>
                        </p>
                        <p>
                            <span>兑换码号</span>
                            <span>{{ detailInfo.exchangeCode }}</span>
                        </p>
                    </template>
                    <!--                    <template v-if="detailInfo.orderSource === 9">-->
                    <!--                        <p>-->
                    <!--                            <span>参与活动</span>-->
                    <!--                            <span>福利红包满减</span>-->
                    <!--                        </p>-->
                    <!--                    </template>-->
                    <p v-if="detailInfo.scholarship">
                        <span>奖学金（红包）</span>
                        <span>-{{ detailInfo.scholarship/100 }}元</span>
                    </p>
                    <p>
                        <span>订单金额</span>
                        <span>{{ (detailInfo.amount - detailInfo.freight)/100 }}元</span>
                    </p>
                    <p v-if="detailInfo.orderType === 'PHYSICAL_GOODS'">
                        <span>运费</span>
                        <span>{{ detailInfo.freight/100 }}元</span>
                    </p>
                    <p>
                        <span>应付金额</span>
                        <span>{{ detailInfo.amount/100 }}元</span>
                    </p>
                    <p>
                        <span>实付金额</span>
                        <span v-if="detailInfo.orderPayTransInfos && detailInfo.orderPayTransInfos.length && detailInfo.orderPayTransInfos.find(item => item.payStatus === 'SUCCESS')">{{ detailInfo.amount/100 }}元</span>
                        <span v-else>0元</span>
                    </p>
                    <p v-if="detailInfo.orderPostscript">
                        <span>备注</span>
                        <span v-text="detailInfo.orderPostscript" />
                    </p>
                    <p
                        v-if="detailInfo.invoiceInfoModel"
                    >
                        <span>
                            发票信息
                            <i
                                class="sub-title"
                            >({{ invoiceStatusText[detailInfo.invoiceInfoModel.status] }})</i>
                        </span>
                        <span class="item-invoice">
                            <span>
                                {{ detailInfo.invoiceInfoModel.invoiceType === 0 ? '个人':'单位' }}
                                <el-button class="ml-20" type="text" @click="getInvoiceDetail ()">
                                    查看详情
                                </el-button>
                            </span>
                            <template v-if="Number(detailInfo.invoiceInfoModel.invoiceType) === 0">
                                <span v-if="detailInfo.invoiceInfoModel.mailingMethod === '1'">收票方式：门店自提 </span>
                                <span v-else>收票方式：邮寄 </span>
                                <span>开票人姓名: {{ detailInfo.invoiceInfoModel.invoiceTitle }}</span>
                                <span>开票人电话: {{ detailInfo.invoiceInfoModel.companyPhone }}</span>
                                <span v-if="detailInfo.invoiceInfoModel.invoiceNumber">发票编号: {{ detailInfo.invoiceInfoModel.invoiceNumber }}</span>
                            </template>
                            <template v-if="Number(detailInfo.invoiceInfoModel.invoiceType) === 1">
                                <span v-if="detailInfo.invoiceInfoModel.mailingMethod === '1'">收票方式：门店自提 </span>
                                <span v-else>收票方式：邮寄 </span>
                                <span>发票抬头: {{ detailInfo.invoiceInfoModel.invoiceTitle }}</span>
                                <span>发票税号: {{ detailInfo.invoiceInfoModel.taxpayerNumber }}</span>
                                <span v-if="detailInfo.invoiceInfoModel.invoiceNumber">发票编号: {{ detailInfo.invoiceInfoModel.invoiceNumber }}</span>
                            </template>
                        </span>
                    </p>
                </div>
                <div class="list-item-other" v-if="productDetailModels.length">
                    <div>
                        <h6>
                            {{ detailInfo.orderType === 'PHYSICAL_GOODS'? '用户信息（订单未完成可修改）':'学员信息（仅待使用的核销码可修改信息）' }}
                        </h6>
                        <div v-for="(items,index) in productDetailModels" :key="index">
                            <div class="custom-info">
                                <div class="info-title">
                                    <span><pl-svg width="18" name="icon-yonghu1-03ec9" /> 用户{{ index + 1 }}</span>
                                    <span>
                                        <el-button type="text" size="medium" :disabled="detailInfo.status === 'FINISHED' || detailInfo.status === 'CLOSED'" @click="editCustom(items,index)">编辑</el-button>
                                    </span>
                                </div>
                                <div class="info-content">
                                    <div v-for="(item,index1) in items" :key="index1">
                                        <span>{{ item.fieldName }}：</span>
                                        <span v-if="item.fieldValue">{{ item.fieldValue }}</span>
                                        <span v-else style="color: #999;font-weight: normal">未填写</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="list-item-other"
                    v-if="redeemCodeModels.length && redeemCodeModels[0].userMobile && redeemCodeModels[0].userName"
                >
                    <h6>学员信息（仅待使用的核销码可修改信息）</h6>
                    <div class="custom-info" v-for="(item,index) in redeemCodeModels" :key="index">
                        <div class="info-title">
                            <span><pl-svg width="18" name="icon-yonghu1-03ec9" /> 学员{{ index+1 }}</span>
                            <span>
                                <el-button type="text" size="medium" :disabled="item.status !== 0" @click="editStudentInfo(item, index)">编辑</el-button>
                            </span>
                        </div>
                        <div class="info-content">
                            <div>
                                <span>姓名：</span>
                                <span>{{ item.userName }}</span>
                            </div>
                            <div>
                                <span>电话：</span>
                                <span>{{ item.userMobile }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="list-item-other"
                    v-if="detailInfo.orderPayTransInfos.length && detailInfo.orderSource !== 8"
                >
                    <h6>交易信息</h6>
                    <template
                        v-if="detailInfo.orderPayTransInfos && detailInfo.orderPayTransInfos.length && detailInfo.orderPayTransInfos.find(item => item.payStatus === 'SUCCESS')"
                    >
                        <div class="other-info" v-for="(item,index) in detailInfo.orderPayTransInfos" :key="index">
                            <p v-if="item.paymentMethodName">
                                <span v-if="item.type === 'REFUND'">退款方式</span>
                                <span v-else>支付方式</span>
                                <span v-text="item.paymentMethodName" />
                            </p>
                            <p v-if="item.serialNo">
                                <span>本地支付流水号</span>
                                <span v-text="item.serialNo" />
                            </p>
                            <p v-if="item.transactionId && item.type !== 'REFUND'">
                                <span>微信支付流水号</span>
                                <span v-text="item.transactionId" />
                            </p>
                            <p v-if="detailInfo.createTime && item.type !== 'REFUND'">
                                <span>下单时间</span>
                                <span v-text="detailInfo.createTime" />
                            </p>
                            <p v-if="item.callbackTime">
                                <span v-if="item.type === 'REFUND'">退款时间</span>
                                <span v-else>支付时间</span>
                                <span v-text="item.callbackTime" />
                            </p>
                            <p v-if="detailInfo.confimTime">
                                <span>确认收货时间</span>
                                <span v-text="detailInfo.confimTime" />
                            </p>
                            <p v-if="detailInfo.endTime">
                                <span>订单关闭时间</span>
                                <span v-text="detailInfo.endTime" />
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
        <!-- 发货 -->
        <Shipments
            :show.sync="shipmentsVisible"
            :order-id="id"
            :products="detailInfo.goodsModel"
            @success="getOrderDetail"
        />
        <!-- 修改发货物流信息 -->
        <ModifyShip
            :show.sync="ModifyShipVisible"
            :order-id="id"
            :products="detailInfo.goodsModel"
            @success="getOrderDetail"
        />
        <!-- 申请售后-->
        <ApplyAfter
            :show.sync="afterVisible"
            :order-id="id"
            :apply-after-data="detailInfo.goodsModel"
            @success="getOrderDetail"
        />
        <!--关闭订单-->
        <CloseOrder
            :show.sync="closeOrderVisible"
            :order-id="id"
            @success="getOrderDetail"
        />
        <EditCustom
            :show.sync="editCustomVisible"
            :custom-title="customTitle"
            :custom-item="customItem"
            @customConfirm="customConfirm"
        />
        <EditStudent
            :show.sync="editStudenVisible"
            :student-item="studentItem"
            @studentConfirm="studentConfirm"
        />
        <ModifyConsigneeInformation
            :order-id="detailInfo.id"
            :user-id="detailInfo.userId"
            :consignee-data="consigneeData"
            :show.sync="consigneeVisible"
            @success="getOrderDetail"
        />
        <InvoiceDetails
            :show.sync="InvoiceDetailsVisible"
            :id="invoiceId"
        />
    </div>
</template>

<script>
import {
    getOrderDetail,
    updateStudentInfo,
    updateCustomForm,
    singleAuditredeemcode
} from '../../../apis/order'
import Shipments from '../../../components/order-center/Shipments.vue'
import ModifyShip from '../../../components/order-center/Modify-Ship.vue'
import ApplyAfter from '../../../components/order-center/Apply-After.vue'
import CloseOrder from '../../../components/order-center/Close-Order.vue'
import EditCustom from '../../../components/order-center/Edit-Custom.vue'
import EditStudent from '../../../components/order-center/Edit-Student.vue'
import ModifyConsigneeInformation from '../../../components/order-center/Modify-Consignee-Information.vue'
import InvoiceDetails from '../../../components/order-center/Invoice-Details.vue'

export default {
    name: 'OrderDetail',
    components: {
        Shipments,
        ModifyShip,
        ApplyAfter,
        CloseOrder,
        EditCustom,
        EditStudent,
        ModifyConsigneeInformation,
        InvoiceDetails
    },
    data () {
        return {
            // 申请售后
            afterVisible: false,
            // 关闭订单
            closeOrderVisible: false,
            // 修改发货物流信息
            ModifyShipVisible: false,
            // 修改收货人信息
            consigneeVisible: false,
            // 收货人信息数据
            consigneeData: {},
            // 发票详情id
            invoiceId: '',
            InvoiceDetailsVisible: false,
            orderStatusText: {
                ALL_ORDER: '全部订单',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                WAIT_PAY_TAIL_MONEY: '待付尾款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            },
            auditStatusText: {
                0: '取消售后',
                1: '待审核',
                2: '审核通过',
                3: '审核驳回'
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
            invoiceStatusText: {
                0: '待开票',
                1: '已开票',
                2: '已取消',
                3: '已作废'
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
                GRAPHIC_DATA: '图文资料',
                LIVE_GOODS: '直播',
                VIDEO_GOODS: '录播'
            },
            // 展示信息对象与简写引用
            detailInfo: {},
            // 操作记录
            operationRecordList: [],
            productInfoModel: {},
            productDetailModels: [],
            redeemCodeModels: [],
            // 当前自定义表单index
            studentIndex: '',
            studentInfoModels: [],
            // 当前自定义表单index
            customIndex: '',
            // 发货
            shipmentsVisible: false,
            // 编辑自定义表单
            editCustomVisible: false,
            // 自定义表单title
            customTitle: '编辑学员信息',
            // 编辑指定学员表单
            editStudenVisible: false,
            // 自定义表单item
            customItem: [],
            // 指定学员表单item
            studentItem: {},
            // 学员信息核销时间UI显示状态
            showRedeemTime: false
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
    // 是否允许售后
        canApplyRefund () {
            // 申请条件 不等于待付款、订单关闭，订单可申请售后，订单没有申请过售后
            if (this.detailInfo.status === 'WAIT_SHIP') {
                return !!(!(this.detailInfo.redeemCodeModels ? this.detailInfo.redeemCodeModels.some(operatorTime => operatorTime) : false) && this.detailInfo.status !== 'WAIT_PAY' && this.detailInfo.status !== 'CLOSED' && this.detailInfo.status !== 'FINISHED' && this.detailInfo.supportAfterSales === 1 && this.detailInfo.aftersaleStatus === 'NO_AFTER_SALES' && this.detailInfo.amount && this.detailInfo.orderSource < 2)
            }
            return !!(!(this.detailInfo.redeemCodeModels ? this.detailInfo.redeemCodeModels.some(operatorTime => operatorTime) : false) && this.detailInfo.status !== 'WAIT_PAY' && this.detailInfo.status !== 'CLOSED' && this.detailInfo.status !== 'FINISHED' && this.detailInfo.supportAfterSales === 1 && this.detailInfo.aftersaleStatus === 'NO_AFTER_SALES' && this.detailInfo.amount > this.detailInfo.freight && this.detailInfo.orderSource < 2)
        },
        canApplyInvoice () {
            // 申请条件 不等于待付款、订单关闭，订单可申请发票，订单没有申请过发票
            return !!(this.detailInfo.supportInvoice && !this.detailInfo.invoiceInfoModel && this.detailInfo.amount > this.detailInfo.freight && this.detailInfo.orderSource < 2)
        },
        isAftersale () {
            return this.detailInfo.aftersaleStatus === 'PROCESSING' || this.detailInfo.aftersaleStatus === 'PROCESSING_COMPLETED'
        }
    // customShow () { // 商品中有需要自定义表单的商品时，显示用户信息/学员信息
    //   return this.productDetailModels.filter(item => item.needStudentInfo === 2).length
    // }
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
                const { result } = await getOrderDetail(this.id)
                result.goodsModel.orderStatus = result.status
                this.consigneeData = {
                    name: result.consigneeName,
                    mobile: result.consigneeMobile,
                    address: result.address
                }
                this.detailInfo = result || {}
                const {
                    record,
                    redeemCodeModels,
                    studentInfoModels,
                    productCustomInfo
                } = this.detailInfo
                this.operationRecordList = record || []
                this.studentInfoModels = studentInfoModels || []
                for (const item of redeemCodeModels) {
                    item.code = item.code.replace(/^(\d{4})\d{4}(\d+)/, '$1****$2')
                    if (item.operatorTime) this.showRedeemTime = true
                }
                this.redeemCodeModels = redeemCodeModels || []
                if (productCustomInfo) {
                    this.productDetailModels = JSON.parse(productCustomInfo)
                    // if (this.detailInfo.orderType === 'PHYSICAL_GOODS') {
                    //    实体订单可有多个商品，只显示需要自定义表单商品的表单信息
                    //   this.productCustomDetailModels = this.productDetailModels.filter(item => item.customForm && item.customForm.length && item.needStudentInfo === 2)
                    // }
                }
                if (this.detailInfo.orderType === 'PHYSICAL_GOODS') this.customTitle = '编辑用户信息'
            } catch (e) {
                throw e
            }
        },
        // 获取发票详情
        async getInvoiceDetail () {
            this.invoiceId = this.detailInfo.invoiceId
            this.InvoiceDetailsVisible = true
        },
        // 保存学员信息
        async saveEditStudentInfo (item) {
            const sutdent = {
                id: item.id,
                name: item.userName,
                mobile: item.userMobile
            }
            try {
                await updateStudentInfo(sutdent)
            } catch (e) {
                throw e
            }
        },
        editStudentInfo (item, index) {
            this.studentIndex = index
            this.editStudenVisible = true
            this.studentItem = item
        },
        async studentConfirm (val) {
            try {
                await this.saveEditStudentInfo(val)
                this.studentItem = val
                this.redeemCodeModels[this.studentIndex] = val
                this.$success('保存学员信息成功')
            } catch (e) {
                throw e
            }
        },
        // 保存自定义表单信息
        async updateCustomForm (data) {
            try {
                await updateCustomForm({ id: this.id, productCustomInfo: JSON.stringify(data) })
                if (this.detailInfo.orderType === 'PHYSICAL_GOODS') {
                    this.$success('保存用户信息成功')
                } else {
                    this.$success('保存学员信息成功')
                }
            } catch (e) {
                throw e
            }
        },
        editCustom (items, index) {
            this.editCustomVisible = true
            this.customItem = items
            this.customIndex = index
        },
        async customConfirm (val) {
            this.productDetailModels[this.customIndex] = val
            this.customItem = val
            try {
                await this.updateCustomForm(this.productDetailModels)
            } catch (e) {
                throw e
            }
        },
        async uncodedVerification (id) {
            await this.$confirm({
                message: '您正在使用 <span style="color: #D0423C">后台无码方式</span> 核销，确认核销吗？',
                dangerouslyUseHTMLString: true
            })
            try {
                await singleAuditredeemcode({ redeemId: id })
                this.$success('核销成功')
                await this.getOrderDetail()
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
            & .scholarship-text{
              background-color: #F2B036;
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
          font-size: 20px;
          line-height: 40px;
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
          h6 {
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
                button {
                  margin-left: 10px;
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
              width: 300px;
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
