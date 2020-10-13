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
                            所有注册用户
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
                                <pl-svg width="16" name="icon-jinggao" class="tips-icon" />
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
                    <el-form-item label="核销补尾款时间" required>
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
                                <pl-svg width="16" name="icon-jinggao" class="tips-icon" />
                            </el-tooltip>
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
                        <span class="inp-tips"> 活动库存设置不影响原商品库存，2个库存互相独立（例如即活动库存50，商品库存50，实际库存为100）</span>
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
        <ProductRadio activity-type="PREORDERACTIVITY" :visible.sync="addVisible" @confirm="confirmGoods" />
    </div>
</template>

<script>
import GoodsPreview from '../../../../../components/product-center/goods/Goods-Preview'
import ProductRadio from '../../../../../components/product-center/goods/Product-Radio.vue'
import { getSingleGoods } from '../../../../../apis/product-center/goods'
import {
    createBookingActivity,
    updateBookingActivity,
    bookingActivityDetail
} from '../../../../../apis/marketing-manage/booking'
import { goPage } from '../../../../../assets/ts/utils'
import moment from 'moment/moment'
const DEFAULT_RECEIVE_TIME = ['2019-12-01 00:00:00', '2019-12-11 23:59:59']
const DEFAULT_USE_TIME = ['2019-12-12 00:00:00', '2019-12-12 23:59:59']
let START_TIME = moment().format('YYYY-MM-DD HH:mm:ss')
let END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
const setDefaultTime = () => {
    // 默认开始时间，默认不得小于当前时间
    // 默认结束时间，默认不得小于当天23点
    START_TIME = moment().format('YYYY-MM-DD HH:mm:ss')
    END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
    if (
        moment(DEFAULT_RECEIVE_TIME[0]).valueOf() < moment(START_TIME).valueOf()
    ) {
        DEFAULT_RECEIVE_TIME[0] = moment(START_TIME)
            .add(1, 'hour')
            .format('YYYY-MM-DD HH:mm:ss')
    }
    if (moment(DEFAULT_RECEIVE_TIME[1]).valueOf() < moment(END_TIME).valueOf()) {
        DEFAULT_RECEIVE_TIME[1] = moment(DEFAULT_RECEIVE_TIME[0]).isBefore(END_TIME)
            ? END_TIME
            : moment(END_TIME)
                .add(1, 'day')
                .format('YYYY-MM-DD HH:mm:ss')
    }
    if (moment(DEFAULT_USE_TIME[0]).valueOf() < moment(START_TIME).valueOf()) {
    // 核销补尾款时间，晚于活动时间一天
        DEFAULT_USE_TIME[0] = `${ moment(DEFAULT_RECEIVE_TIME[1])
            .add(1, 'day')
            .format('YYYY-MM-DD') } 00:00:00`
    }
    if (moment(DEFAULT_USE_TIME[1]).valueOf() < moment(END_TIME).valueOf()) {
        DEFAULT_USE_TIME[1] = `${ moment(DEFAULT_RECEIVE_TIME[1])
            .add(1, 'day')
            .format('YYYY-MM-DD') } 23:59:59`
    }
}
setDefaultTime()

export default {
    name: 'AddBooking',
    components: {
        GoodsPreview,
        ProductRadio
    },
    data () {
        return {
            id: '',
            type: '',
            marketingForm: {
                brief:
          '1.任何注册用户均可参与；\n2.填写购买下单基本信息，完成线上支付定金即定金支付成功，定金不可退；\n3.在活动尾款支付时间内，到店核销支付尾款，过期或已使用定金不可退。',
                countdown: 3,
                activityStartTime: moment(Date.now() + (1000 * 60 * 60)).format('YYYY-MM-DD HH:mm:ss'),
                activityEndTime: '',
                price: 10,
                stock: 100,
                multiple: true,
                multipleNumber: 10,
                product: null,
                useStartTime: moment(Date.now() + (1000 * 60 * 60 * 24)).format('YYYY-MM-DD HH:mm:ss'),
                useEndTime: ''
            },
            activityStatus: 0,
            addVisible: false,
            showPreview: false,
            singleGoods: null,
            rules: {
                price: [{ required: true, message: '请添加商品价格', trigger: 'blur' }],
                brief: [{ required: true, message: '请添加活动备注', trigger: 'blur' }],
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
    created () {
    // 如果不是新建活动，则请求列表进行展示
        if (this.$route.params.id) {
            this.id = this.$route.params.id
            this.type = this.$route.params.type
            this.getBookingActivityDetail(this.id)
        }
    },
    mounted () {
        window.addEventListener('beforeunload', this.beforeunload)
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.beforeunload)
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'AddBooking' && to.name !== 'BookingBuyList') {
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
            e.returnValue = '123'
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
            const { data } = await bookingActivityDetail(id)
            this.marketingForm = {
                countdown: data.result.countdown,
                activityStartTime: data.result.activityStartTime,
                activityEndTime: data.result.activityEndTime,
                price: data.result.price,
                stock: data.result.stock,
                product: {
                    productMainImage: data.result.productMainImage,
                    productName: data.result.productName,
                    id: data.result.productId
                },
                brief: data.result.brief,
                multiple: data.result.multiple === 1,
                multipleNumber: data.result.multipleNumber,
                useStartTime: data.result.useStartTime,
                useEndTime: data.result.useEndTime
            }
            this.activityStatus = this.type ? 0 : data.result.status
        },
        dateChange (val) {
            this.marketingForm.activityStartTime = this.activityStatus === 1
                ? this.marketingForm.activityStartTime
                : val.start
            this.marketingForm.activityEndTime = val.end
        },
        dateUseChange (val) {
            this.marketingForm.useStartTime = val.start
            this.marketingForm.useEndTime = val.end
        },
        openAddListDialog () {
            this.addVisible = true
        },
        async handlePreview (formName) {
            if (
                !this.marketingForm.activityStartTime ||
        !this.marketingForm.activityEndTime
            ) {
                this.$error('请选择活动时间')
                return false
            }
            if (!this.marketingForm.useStartTime || !this.marketingForm.useEndTime) {
                this.$error('请核销尾款时间')
                return false
            }
            if (
                this.activityStatus !== 1 &&
        moment(this.marketingForm.activityStartTime).valueOf() <
          moment().valueOf()
            ) {
                this.$error('活动开始时间不能小于当前时间')
                return false
            }
            if (
                moment(this.marketingForm.activityEndTime).valueOf() <
        moment(this.marketingForm.activityStartTime).valueOf()
            ) {
                this.$error('活动结束时间不能小于开始时间')
                return false
            }
            if (
                moment(this.marketingForm.activityEndTime).valueOf() >
        moment(this.marketingForm.useEndTime).valueOf()
            ) {
                this.$error('活动结束时间不能大于核销结束时间')
                return false
            }
            if (
                moment(this.marketingForm.useStartTime).valueOf() <
        moment(this.marketingForm.activityStartTime).valueOf()
            ) {
                this.$error('核销尾款开始时间不能小于活动开始时间')
                return false
            }
            if (
                moment(this.marketingForm.useEndTime).valueOf() <
        moment(this.marketingForm.activityEndTime).valueOf()
            ) {
                this.$error('核销尾款结束时间不能小于活动结束时间')
                return false
            }
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
            }
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
            } catch (e) {
                throw e
            }
        },
        async confirmGoods (pro) {
            this.marketingForm.product = pro
        },
        removeProduct () {
            this.marketingForm.product = null
        },
        async submitForm (formName) {
            if (
                !this.marketingForm.activityStartTime ||
        !this.marketingForm.activityEndTime
            ) {
                this.$error('请选择活动时间')
                return false
            }
            if (
                this.activityStatus !== 1 &&
        moment(this.marketingForm.activityStartTime).valueOf() <
          moment().valueOf()
            ) {
                this.$error('活动开始时间不能小于当前时间')
                return false
            }
            if (
                moment(this.marketingForm.activityEndTime).valueOf() <
        moment(this.marketingForm.activityStartTime).valueOf()
            ) {
                this.$error('活动结束时间不能小于开始时间')
                return false
            }
            if (
                moment(this.marketingForm.activityEndTime).valueOf() >
        moment(this.marketingForm.useEndTime).valueOf()
            ) {
                this.$error('活动结束时间不能大于核销结束时间')
                return false
            }
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
            }
            if (!this.marketingForm.useStartTime || !this.marketingForm.useEndTime) {
                this.$error('请核销尾款时间')
                return false
            }
            if (
                moment(`${ moment(this.marketingForm.useStartTime).format('YYYY-MM-DD') } 23:59:59`).valueOf() < moment(this.marketingForm.activityStartTime).valueOf()
            ) {
                this.$error('核销尾款开始时间不能小于活动开始时间')
                return false
            }
            if (
                moment(this.marketingForm.useEndTime).valueOf() <
        moment(this.marketingForm.activityEndTime).valueOf()
            ) {
                this.$error('核销尾款结束时间不能小于活动结束时间')
                return false
            }
            try {
                await this.$refs[formName].validate()
                const params = {
                    id: this.id ? (this.type ? '' : this.id) : '',
                    countdown: this.marketingForm.countdown,
                    activityStartTime: this.marketingForm.activityStartTime,
                    activityEndTime: this.marketingForm.activityEndTime,
                    price: this.marketingForm.price,
                    stock: this.marketingForm.stock,
                    productId: this.marketingForm.product.id,
                    brief: this.marketingForm.brief,
                    multiple: this.marketingForm.multiple ? 1 : 0,
                    multipleNumber: this.marketingForm.multipleNumber,
                    useStartTime: this.marketingForm.useStartTime,
                    useEndTime: this.marketingForm.useEndTime
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
                    goPage(this, gomMes.data.result, warnMessage, 'BookingBuyList')
                } else {
                    gomMes = await createBookingActivity(params)
                    warnMessage = '创建成功'
                    goPage(this, gomMes.data.result, warnMessage, 'BookingBuyList')
                }
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
.add-marketing {
    .marketing-top {
        display: flex;
        align-items: center;
        height: 52px;
        padding-left: 24px;
        color: #2e2e2e;
        border-bottom: 1px solid #e7e7e7;
        background-color: #fff;
        ::v-deep .el-icon-back {
            margin-right: 32px;
            color: #598bf8;
            font-size: 24px;
            font-weight: bolder;
            cursor: pointer;
        }
        span {
            color: #333;
            font-size: 16px;
            font-weight: bold;
        }
    }
    .marketing-content {
        width: 1614px;
        margin: 20px auto 80px auto;
        background-color: #fff;
        box-shadow: 0 3px 8px rgba(44, 48, 58, .08);
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
