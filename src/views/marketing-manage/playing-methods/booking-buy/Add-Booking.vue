<template>
    <div class="add-marketing">
        <div class="marketing-content">
            <div class="content-detail">
                <el-form
                    ref="marketingForm"
                    :model="marketingForm"
                    :rules="rules"
                    label-width="155px"
                    label-position="left"
                >
                    <p class="detail-title">
                        预购活动设置
                        <span class="sub-detail-title">参与预购活动的商品，均不支持线上退款</span>
                    </p>
                    <el-form-item label="活动细则" prop="brief">
                        <el-input
                            v-model="marketingForm.brief"
                            type="textarea"
                            maxlength="500"
                            show-word-limit
                            placeholder="请输入活动备注"
                            resize="none"
                            :rows="5"
                            style="width: 420px;"
                        />
                    </el-form-item>
                    <el-form-item label="适用用户" prop="type">
                        <div class="font-14">
                            <el-radio-group :disabled="activityStatus === 1" v-model="marketingForm.receiveLimit">
                                <el-radio :label="0">
                                    所有注册用户
                                </el-radio>
                                <el-radio :label="1">
                                    helper可用
                                </el-radio>
                                <el-radio :label="2">
                                    普通会员
                                </el-radio>
                                <el-radio :disabled="userTagList.length === 0" :label="3">
                                    部分用户组可用
                                    <span v-if="userTagList.length === 0">（请先在会员管理-设置用户分组）</span>
                                </el-radio>
                            </el-radio-group>
                            <div class="user-box" v-if="marketingForm.receiveLimit === 3 && userTagList.length > 0">
                                <el-checkbox-group v-model="marketingForm.userTagIdList">
                                    <el-checkbox v-for="(item,index) in userTagList" style="width: 120px;" :label="item.id" :key="index">
                                        {{ item.tagName }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="活动预热" prop="countdown">
                        提前
                        <el-input-number
                            :disabled="activityStatus === 1"
                            :min="0"
                            :max="999"
                            size="mini"
                            step-strictly
                            v-model="marketingForm.countdown"
                        />天显示
                        <span class="inp-tips"> （该时间内有活动预告，上架将确认仅显示该预告）</span>
                    </el-form-item>
                    <el-form-item label="活动时间" required>
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.activityStartTime, marketingForm.activityEndTime]"
                                type="datetime"
                                @change="dateChange"
                                disable-before
                                clearable
                                :disabled-start-time="activityStatus === 1"
                            />
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="开始时间不得小于当前时间，结束时间不得晚于商品下架时间"
                                placement="bottom"
                            >
                                <pl-svg width="16" :key="1" name="icon-jinggao" class="tips-icon" fill="#333" />
                            </el-tooltip>
                        </div>
                    </el-form-item>

                    <el-form-item label="活动商品" prop="product" required>
                        <div class="together-product" v-if="marketingForm.product">
                            <div class="product">
                                <img :src="marketingForm.product.productMainImage">
                                <div class="title">
                                    {{ marketingForm.product.productName }}
                                </div>
                                <div class="remove" @click="removeProduct" v-if="type || activityStatus !== 1">
                                    移除
                                </div>
                            </div>
                            <div class="tips">
                                只能添加一个商品，仅支持该商品 下所有规格同时一个价位参与
                            </div>
                        </div>
                        <div v-else>
                            <el-button type="primary" plain style="width: 116px;" @click="openAddListDialog">
                                选择商品
                            </el-button>
                            <span class="inp-tips">（预购活动商品不与其余任何活动共享，不可使用优惠券）</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="补尾款时间" required>
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.useStartTime, marketingForm.useEndTime]"
                                type="date"
                                @change="dateUseChange"
                                disable-before
                                clearable
                                :disabled-start-time="activityStatus === 1"
                            />
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="开始时间不得小于当前时间，结束时间不得晚于商品下架时间"
                                placement="bottom"
                            >
                                <pl-svg width="16" :key="2" name="icon-jinggao" class="tips-icon" fill="#333" />
                            </el-tooltip>
                            <span class="inp-tips" v-if="marketingForm.payMethod === 0">（补尾款时间为线上支付尾款的时间，逾期未付则定金不退）</span>
                            <span class="inp-tips" v-else>（补尾款时间，即线下到店核销时间，核销后补齐尾款）</span>
                        </div>
                    </el-form-item>
                    <el-form-item required label="核销时间" v-if="marketingForm.product && marketingForm.product.productType !== 'PHYSICAL_GOODS' && marketingForm.payMethod === 0">
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.validityPeriodStart, marketingForm.validityPeriodEnd]"
                                type="date"
                                @change="dateVerifyChange"
                                disable-before
                                clearable
                                :disabled-start-time="activityStatus === 1"
                            />
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="核销开始时间不能小于补尾款开始时间，核销结束时间不能小于补尾款结束时间"
                                placement="bottom"
                            >
                                <pl-svg :key="3" name="icon-jinggao" class="tips-icon" fill="#333" width="16" />
                            </el-tooltip>
                            <span class="inp-tips">（核销时间为线下到店进行核销的时间，仅适用于该活动商品）</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="商品限购">
                        <el-checkbox v-model="marketingForm.activityLimit">
                            限制每人购买的数量
                        </el-checkbox>
                        <div v-if="marketingForm.activityLimit">
                            <span>每个账号可购买的数量为</span>
                            <el-input
                                style="width: 120px;"
                                :min="1"
                                :maxlength="4"
                                :disabled="activityStatus === 1"
                                v-model.number="marketingForm.activityLimitNumber"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label="定金价位" prop="price">
                        <el-input
                            style="width: 120px;"
                            :maxlength="8"
                            v-range="{min:0.01,fixed:2}"
                            v-model="marketingForm.price"
                            :disabled="activityStatus === 1"
                        /> 元
                        <span class="inp-tips">（金额不得高于原商品价位，统一定金价根据规格商品价位补尾款）</span>
                    </el-form-item>
                    <el-form-item label="尾款支付方式">
                        <el-radio-group :disabled="activityStatus === 1" v-model="marketingForm.payMethod">
                            <el-radio :label="0">
                                线上 （实体商品仅支持该方式支付尾款）
                            </el-radio>
                            <el-radio :disabled="marketingForm.productType" :label="1">
                                线下
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="定金翻倍" prop="multiple">
                        <el-checkbox v-model="marketingForm.multiple" :disabled="activityStatus === 1" />
                        <span class="inp-tips">（定金翻倍后金额不得超过商品规格金额的50%）</span>
                        <div v-if="marketingForm.multiple" style="margin-top: 15px">
                            <el-input-number
                                :min="1"
                                :max="99999"
                                size="mini"
                                v-model="marketingForm.multipleNumber"
                                :disabled="activityStatus === 1"
                            /> 倍
                        </div>
                    </el-form-item>
                    <el-form-item label="活动库存" prop="stock" v-if="marketingForm.product">
                        <el-input-number :max="99999999" :min="1" size="mini" step-strictly v-model="marketingForm.stock" /> 单
                        <span class="inp-tips"> （该库存独立于商品库存，商品库存售罄不影响活动库存）</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="content-btn">
                <el-button type="default" @click="cancel" style="width: 80px;">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    plain
                    @click="handlePreview('marketingForm')"
                    style="width: 80px;margin-left: 20px;"
                >
                    预览
                </el-button>
                <el-button
                    type="primary"
                    @click="submitForm('marketingForm')"
                    style="width: 80px;margin-left: 20px;"
                >
                    保存
                </el-button>
            </div>
        </div>
        <GoodsPreview :show.sync="showPreview" :data="singleGoods" />
        <ProductRadio new-year-type="2019_02" :visible.sync="addVisible" @confirm="confirmGoods" />
    </div>
</template>

<script>
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview'
import ProductRadio from '../../../../components/product-center/goods/Product-Radio.vue'
import { getSingleGoods } from '../../../../apis/product-center/goods'
import {
    createBookingActivity,
    updateBookingActivity,
    bookingActivityDetail,
    getUserTagList
} from '../../../../apis/marketing-manage/booking'
import { goPage } from '../../../../assets/ts/utils'
import moment from 'moment/moment'

export default {
    name: 'AddBookingBuy',
    components: {
        GoodsPreview,
        ProductRadio
    },
    data () {
        return {
            id: '',
            type: '',
            marketingForm: {
                brief: '1.任何注册用户均可参与；\n2.填写购买下单基本信息，完成线上支付定金即定金支付成功，定金不可退；\n3.线下付尾款，请在在活动尾款支付时间内，到店核销支付尾款，过期或已使用定金不可退；\n4.线上付尾款，在活动尾款支付时间内，在线付清尾款金额，到店核销享受相应服务，过期未付清尾款则定金不可退。',
                countdown: 3,
                activityStartTime: moment(Date.now() + (1000 * 60 * 60)).format('YYYY-MM-DD HH:mm:ss'),
                activityEndTime: '',
                // 核销时间
                validityPeriodStart: moment(Date.now() + (1000 * 60 * 60 * 48)).format('YYYY-MM-DD HH:mm:ss'),
                // 核销时间
                validityPeriodEnd: '',
                price: 10,
                stock: 100,
                multiple: true,
                multipleNumber: 10,
                product: null,
                useStartTime: moment(Date.now() + (1000 * 60 * 60 * 24)).format('YYYY-MM-DD HH:mm:ss'),
                useEndTime: '',
                receiveLimit: 0,
                // 新春开学季类型
                type: '2019_02',
                // 活动是否限购 0：不限  1：限制
                activityLimit: false,
                // 限购数量
                activityLimitNumber: 1,
                // 标签
                userTagIdList: [],
                // 支付方式 0：线上  1：线下
                payMethod: 0,
                // 是否实体商品
                productType: false
            },
            // 用户标签
            userTagList: [],
            activityStatus: 0,
            addVisible: false,
            showPreview: false,
            singleGoods: null,
            rules: {
                price: [
                    { required: true, message: '请添加定金价位', trigger: 'blur' }
                ],
                brief: [
                    { required: true, message: '请添加活动备注', trigger: 'blur' }
                ],
                countdown: [
                    { required: true, message: '请设置预热时间', trigger: 'blur' }
                ],
                activityStartTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                activityEndTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                useStartTime: [
                    { required: true, message: '请选择核销时间', trigger: 'blur' }
                ],
                useEndTime: [
                    { required: true, message: '请选择核销时间', trigger: 'blur' }
                ]
            }
        }
    },
    async created () {
    // 如果不是新建活动，则请求列表进行展示
        if (this.$route.params.id) {
            this.id = this.$route.params.id
            this.type = this.$route.params.type
            this.getBookingActivityDetail(this.id)
        }
        // 获取用户分组
        try {
            const { result } = await getUserTagList()
            this.userTagList = result
        } catch (e) { throw e }
    },
    mounted () {
        window.addEventListener('beforeunload', this.beforeunload)
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.beforeunload)
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'BookingBuyList' && to.name !== 'BookingBuyList') {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                next()
            })
        } else {
            next()
        }
    },
    methods: {
        beforeunload (e) {
            e.returnValue = ''
        },
        cancel () {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                this.$router.back()
            })
        },
        async getBookingActivityDetail (id) {
            const { result } = await bookingActivityDetail(id)
            Object.assign(this.marketingForm, {
                countdown: result.countdown,
                activityStartTime: result.activityStartTime,
                activityEndTime: result.activityEndTime,
                price: result.price,
                stock: result.stock,
                product: {
                    productType: result.productType,
                    productMainImage: result.productMainImage,
                    productName: result.productName,
                    id: result.productId
                },
                brief: result.brief,
                multiple: result.multiple === 1,
                multipleNumber: result.multipleNumber,
                useStartTime: result.useStartTime,
                useEndTime: result.useEndTime,
                // 新春开学季类型
                type: '2019_02',
                receiveLimit: result.receiveLimit,
                // 活动是否限购 0：不限  1：限制
                activityLimit: result.activityLimit === 1,
                // 限购数量
                activityLimitNumber: result.activityLimitNumber,
                // 标签
                userTagIdList: result.userTagIdList,
                // 支付方式 0：线上  1：线下
                payMethod: result.payMethod,
                // 核销时间
                validityPeriodStart: result.validityPeriodStart,
                // 核销时间
                validityPeriodEnd: result.validityPeriodEnd
            })
            this.activityStatus = this.type ? 0 : result.status
        },
        dateChange (val) {
            this.marketingForm.activityStartTime = this.activityStatus === 1 ? this.marketingForm.activityStartTime : val.start
            this.marketingForm.activityEndTime = val.end
        },
        dateUseChange (val) {
            this.marketingForm.useStartTime = val.start
            this.marketingForm.useEndTime = val.end
        },
        // 核销时间change
        dateVerifyChange (val) {
            this.marketingForm.validityPeriodStart = val.start
            this.marketingForm.validityPeriodEnd = val.end
        },
        openAddListDialog () {
            this.addVisible = true
        },
        async handlePreview (formName) {
            // 自定义校验
            const provideValidate = this.provideValidate()
            if (!provideValidate) return
            try {
                await this.$refs[formName].validate()
                let { result } = await getSingleGoods(this.marketingForm.product.id)
                result = {
                    ...result,
                    activityProductModel: {
                        ...this.marketingForm,
                        status: this.activityStatus || 0
                    },
                    activeProduct: 4
                }
                this.singleGoods = result
                this.showPreview = true
            } catch (e) { throw e }
        },
        async confirmGoods (pro) {
            this.marketingForm.product = pro
            // 虚拟商品VIRTUAL_GOODS，实体商品PHYSICAL_GOODS，正式课FORMAL_CLASS，体验课EXPERIENCE_CLASS
            if (pro.productType === 'PHYSICAL_GOODS') {
                this.marketingForm.payMethod = 0
                this.marketingForm.productType = true
            } else {
                this.marketingForm.productType = false
            }
        },
        removeProduct () {
            this.marketingForm.product = null
        },
        async submitForm (formName) {
            // 自定义校验
            const provideValidate = this.provideValidate()
            if (!provideValidate) return
            try {
                await this.$refs[formName].validate()
                const Form = this.marketingForm
                const params = {
                    id: this.id ? (this.type ? '' : this.id) : '',
                    countdown: Form.countdown,
                    activityStartTime: Form.activityStartTime,
                    activityEndTime: Form.activityEndTime,
                    price: Form.price,
                    stock: Form.stock,
                    productId: Form.product.id,
                    brief: Form.brief,
                    multiple: Form.multiple ? 1 : 0,
                    multipleNumber: Form.multipleNumber,
                    useStartTime: Form.useStartTime,
                    useEndTime: Form.useEndTime,
                    // 新春开学季类型
                    type: '2019_02',
                    receiveLimit: Form.receiveLimit,
                    // 活动是否限购 0：不限  1：限制
                    activityLimit: Form.activityLimit ? 1 : 0,
                    // 限购数量
                    activityLimitNumber: Form.activityLimit ? parseInt(Form.activityLimitNumber) : null,
                    // 标签
                    userTagIdList: Form.userTagIdList,
                    // 支付方式 0：线上  1：线下
                    payMethod: Form.payMethod,
                    // 核销时间
                    validityPeriodStart: Form.validityPeriodStart,
                    // 核销时间
                    validityPeriodEnd: Form.validityPeriodEnd
                }
                // 判断商品是否参加了其他活动，否则跳转，是则提示
                let [gomMes, warnMessage] = [{}]
                if (this.id) {
                    if (this.type) {
                        gomMes = await createBookingActivity(params)
                        warnMessage = '复制成功'
                    } else {
                        gomMes = await updateBookingActivity(params)
                        warnMessage = '修改成功'
                    }
                    goPage(this, gomMes.data, warnMessage, 'BookingBuyList')
                } else {
                    gomMes = await createBookingActivity(params)
                    warnMessage = '创建成功'
                    goPage(this, gomMes.data, warnMessage, 'BookingBuyList')
                }
            } catch (e) { throw e }
        },
        // 校验函数
        provideValidate () {
            if (!this.marketingForm.activityStartTime || !this.marketingForm.activityEndTime) {
                this.$error('请选择活动时间')
                return false
            }
            if (this.activityStatus !== 1 && moment(this.marketingForm.activityStartTime).valueOf() < moment().valueOf()) {
                this.$error('活动开始时间不能小于当前时间')
                return false
            }
            if (moment(this.marketingForm.activityEndTime).valueOf() < moment(this.marketingForm.activityStartTime).valueOf()) {
                this.$error('活动结束时间不能小于开始时间')
                return false
            }
            if (moment(this.marketingForm.activityEndTime).valueOf() > moment(this.marketingForm.useEndTime).valueOf()) {
                this.$error('活动结束时间不能大于补尾款结束时间')
                return false
            }
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
            }
            if (!this.marketingForm.useStartTime || !this.marketingForm.useEndTime) {
                this.$error('请选择补尾款时间')
                return false
            }
            if (moment(`${ moment(this.marketingForm.useStartTime).format('YYYY-MM-DD') } 23:59:59`).valueOf() < moment(this.marketingForm.activityStartTime).valueOf()) {
                this.$error('补尾款开始时间不能小于活动开始时间')
                return false
            }
            if (moment(this.marketingForm.useEndTime).valueOf() < moment(this.marketingForm.activityEndTime).valueOf()) {
                this.$error('补尾款结束时间不能小于活动结束时间')
                return false
            }
            // 选择线上且虚拟
            if (this.marketingForm.product && this.marketingForm.product.productType !== 'PHYSICAL_GOODS' && this.marketingForm.payMethod === 0) {
                if (!this.marketingForm.validityPeriodStart || !this.marketingForm.validityPeriodEnd) {
                    this.$error('请选择核销时间时间')
                    return false
                }
                if (moment(this.marketingForm.validityPeriodStart).valueOf() < moment(this.marketingForm.useStartTime).valueOf()) {
                    this.$error('核销开始时间不能小于补尾款开始时间')
                    return false
                }
                if (moment(this.marketingForm.validityPeriodEnd).valueOf() < moment(this.marketingForm.useEndTime).valueOf()) {
                    this.$error('核销结束时间不能小于补尾款结束时间')
                    return false
                }
            }
            // 选择部分用户组
            if (this.marketingForm.receiveLimit === 3 && this.marketingForm.userTagIdList.length === 0) {
                this.$error('请选择用户标签')
                return false
            }
            if (this.marketingForm.activityLimit && Number(this.marketingForm.activityLimitNumber) < 1) {
                this.$error('限购数量最少为1')
                return false
            }
            if (Number(this.marketingForm.price) <= 0) {
                this.$error('定金价位大于 0 元')
                return false
            }
            return true
        }
    }
}
</script>

<style scoped lang="scss">
.add-marketing {
    .marketing-content {
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
            .user-box {
                width: 500px;margin-top: 10px;
                background-color: #eee;
                border: 1px solid #ccc;
                padding-left: 10px;
            }
            .detail-title {
                display: flex;
                align-items: center;
                height: 60px;
                margin-bottom: 24px;
                padding-left: 30px;
                color: #333;
                font-size: 14px;
                font-weight: bold;
                background-color: #fbfbfb;
                .sub-detail-title {
                    color: #999;
                    margin-left: 32px;
                    font-weight: normal;
                }
            }
            .activity-rule {
                width: 405px;
                border: 1px solid #ccc;
                font-size: 12px;
                line-height: 16px;
                overflow-y: auto;
                padding: 7px 8px 8px 11px;
                color: #666;
            }
            .award {
                color: #333;
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
                color: #999;
                font-size: 14px;
            }
            ::v-deep .separator {
                margin: 0 6px;
                color: #a8a8a8;
                font-size: 12px;
            }
            .together-product {
                display: flex;
                align-items: flex-start;
                .product {
                    border: 1px solid #ccc;
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
                .tips {
                    color: #999;
                    width: 210px;
                    line-height: 1.6;
                    margin-left: 10px;
                }
            }
            .detail-table {
                display: flex;
                flex-direction: column;
                margin: 24px 0 0 24px;
                padding-bottom: 32px;
                .width-1 {
                    width: 122px;
                }
                .width-2 {
                    width: 196px;
                }
                .width-3 {
                    width: 88px;
                }
                .width-4 {
                    width: 114px;
                }
                .width-5 {
                    width: 130px;
                }
                .width-6 {
                    width: 500px;
                }
                .width-7 {
                    width: 60px;
                }
                .radius-top {
                    border-radius: 10px 10px 0 0;
                }
                .radius-left {
                    border-radius: 10px 0 0 0;
                }
                .radius-right {
                    border-radius: 0 10px 0 0;
                }
                .border-left {
                    border-left: 1px solid #e7e7e7;
                }
                .border-right {
                    border-right: 1px solid #e7e7e7;
                }
                .border-bottom {
                    border-bottom: 1px solid #e7e7e7;
                }
                .table-title {
                    display: flex;
                    align-items: center;
                    .title-group {
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                        &:last-of-type {
                            margin-right: 0;
                        }
                        .title-dark {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 60px;
                            color: #000;
                            font-size: 14px;
                            font-weight: bold;
                            background-color: #f8f8f8;
                        }
                        .title-light {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 60px;
                            color: #000;
                            font-size: 14px;
                            font-weight: bold;
                            border-top: 1px solid #e7e7e7;
                            border-bottom: 1px solid #e7e7e7;
                        }
                    }
                }
                .table-item {
                    display: flex;
                    align-items: stretch;
                    .item-img {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 60px;
                        margin-right: 10px;
                        border-bottom: 1px solid #e7e7e7;
                        border-left: 1px solid #e7e7e7;
                        border-right: 1px solid #e7e7e7;
                        img {
                            width: 74px;
                            height: 50px;
                            object-fit: cover;
                        }
                    }
                    .item-info {
                        display: flex;
                        align-items: stretch;
                        justify-content: center;
                        min-height: 60px;
                        margin-right: 10px;
                        border-bottom: 1px solid #e7e7e7;
                        .item-item {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-right: 1px solid #e7e7e7;
                            &:first-of-type {
                                border-left: 1px solid #e7e7e7;
                            }
                            & > span {
                                display: block;
                                width: 80%;
                                text-align: center;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                    }
                    .item-sku {
                        display: flex;
                        align-items: stretch;
                        justify-content: center;
                        min-height: 60px;
                        .item-vertical {
                            display: flex;
                            flex-direction: column;
                            border-right: 1px solid #e7e7e7;
                            .item-item {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                min-height: 60px;
                                border-bottom: 1px solid #e7e7e7;
                                & > span {
                                    display: block;
                                    width: 80%;
                                    text-align: center;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                    .item-del {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 60px;
                        margin-left: 10px;
                        border-left: 1px solid #e7e7e7;
                        border-right: 1px solid #e7e7e7;
                        i {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            min-height: 60px;
                            border-bottom: 1px solid #e7e7e7;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .content-btn {
            box-sizing: border-box;
            margin-left: 24px;
            padding: 30px 0;
            border-top: 1px solid #e7e7e7;
        }
    }
}

</style>
