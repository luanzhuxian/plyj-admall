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
                        众志成团 活动设置 <span class="sub-detail-title">无论几人 参团，活动截止均视为拼团成功，不退款</span>
                    </p>
                    <el-form-item
                        label="活动规则"
                        prop="activityBrief"
                    >
                        <el-input
                            v-model="marketingForm.activityBrief"
                            type="textarea"
                            maxlength="500"
                            placeholder="请输入活动备注"
                            resize="none"
                            :rows="5"
                            style="width: 420px;"
                            show-word-limit
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
                            <UserGroup
                                v-model="marketingForm.userTagIdList"
                                v-show="marketingForm.receiveLimit === 3 && userTagList.length > 0"
                                @init="groupInit"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="可拼团数"
                    >
                        <div class="font-14">
                            1团
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="团购商品"
                        prop="product"
                        required
                    >
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
                            </el-button> <span class="inp-tips">（拼团活动商品不与其余任何活动共享，不可使用优惠券）</span>
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="团购库存"
                        prop="stock"
                    >
                        <el-input-number :max="99999999" :min="1" size="mini" step-strictly v-model="marketingForm.stock" /> 件
                        <span class="inp-tips">（该库存独立于商品库存，商品库存售罄不影响活动库存）</span>
                    </el-form-item>
                    <el-form-item label="商品限购">
                        <el-checkbox v-model="marketingForm.activityLimit">
                            限制每人购买的数量
                        </el-checkbox>
                        <div v-if="marketingForm.activityLimit">
                            <span>每个账号可购买的数量为</span>
                            <el-input
                                style="width: 120px;"
                                :maxlength="4"
                                :min="1"
                                :disabled="activityStatus === 1"
                                v-model="marketingForm.activityLimitNumber"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="团购价位"
                        prop="price"
                    >
                        <el-input-number :disabled="activityStatus === 1" :min="0" :max="99999999.99" size="mini" v-model="marketingForm.price" /> 元 <span class="inp-tips">（金额不得高于原商品价位）</span>
                    </el-form-item>
                    <el-form-item
                        label="活动预热"
                        prop="countdown"
                    >
                        提前 <el-input-number :disabled="activityStatus === 1" :min="0" :max="999" size="mini" step-strictly v-model="marketingForm.countdown" /> 天显示
                        <span class="inp-tips"> （该时间内有活动预告，上架将确认仅显示该预告）</span>
                    </el-form-item>
                    <el-form-item
                        label="是否隐藏团购价"
                    >
                        <el-checkbox v-model="marketingForm.hidePrice">
                            隐藏定价
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item
                        label="活动时间"
                        required
                    >
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.activityStartTime, marketingForm.activityEndTime]"
                                type="datetime"
                                @change="dateChange"
                                disable-before
                                clearable
                                :disabled-start-time="activityStatus === 1"
                            />
                            <el-tooltip class="item" effect="dark" content="开始时间不得小于当前时间，结束时间不得晚于商品下架时间" placement="bottom">
                                <pl-svg name="icon-jinggao" class="tips-icon" width="14" fill="#ec742e" />
                            </el-tooltip>
                        </div>
                    </el-form-item>
                    <el-form-item required label="核销时间" v-if="marketingForm.product && marketingForm.product.productType !== 'PHYSICAL_GOODS'">
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.validityPeriodStart, marketingForm.validityPeriodEnd]"
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
                                <pl-svg name="icon-jinggao" class="tips-icon" width="14" fill="#ec742e" />
                            </el-tooltip>
                            <span class="inp-tips">（核销时间为线下到店进行核销的时间，仅适用于该活动商品）</span>
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="成团瓜分奖励"
                        prop="prizePool"
                    >
                        <el-radio-group :disabled="activityStatus === 1" v-model="marketingForm.hasReward">
                            <el-radio :label="1">
                                无奖励
                            </el-radio>
                            <el-radio :label="0">
                                有红包奖池（达到某一阶梯奖励，成团后可瓜分该阶梯奖池）
                            </el-radio>
                        </el-radio-group>
                        <template v-if="marketingForm.hasReward === 0">
                            <div class="award">
                                开奖 1 次
                            </div>
                            <div style="margin-bottom:9px" v-for="(item,index) in marketingForm.prizeList" :key="index">
                                达到 <el-input-number :disabled="activityStatus === 1" :max="marketingForm.stock" :min="1" size="mini" v-model="item.numberLimit" /> 件，
                                奖励红包 <el-input-number :disabled="activityStatus === 1" :max="99999999.99" :min="1" size="mini" v-model="item.prize" /> 元
                                <el-button :disabled="activityStatus === 1" v-if="marketingForm.prizeList.length > 1" type="danger" @click="marketingForm.prizeList.splice(index,1)" icon="el-icon-close" style="padding:4px;margin-left:10px" round />
                            </div>
                            <el-button :disabled="activityStatus === 1" v-if="marketingForm.prizeList.length < 6" type="primary" @click="marketingForm.prizeList.push({numberLimit:marketingForm.prizeList[marketingForm.prizeList.length - 1]['numberLimit'] + 1,prize:1})" plain style="width: 116px;">
                                添加奖池阶梯
                            </el-button>
                            <div>
                                奖学金领取当日起，
                                <el-input
                                    style="width: 60px;"
                                    :min="1"
                                    :maxlength="3"
                                    :disabled="activityStatus === 1"
                                    v-model.number="marketingForm.timeout"
                                />
                                天内可使用，
                                <el-input
                                    style="width: 60px;"
                                    :min="1"
                                    :maxlength="3"
                                    :disabled="activityStatus === 1"
                                    v-model.number="marketingForm.expiration"
                                />
                                天内未领取，奖池失效
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">
                                        <div>有效期按自然天计算</div>
                                        <div>如：设置奖学金发放当日起 10 天内可用，则用户在 12月1日 12：00 时领取奖学金</div>
                                        <div>则该奖学金的可用时间为 12月1日 12：00 至 12月10日 23：59：59</div>
                                    </div>
                                    <pl-svg name="icon-jinggao" class="tips-icon" width="14" fill="#ec742e" />
                                </el-tooltip>
                            </div>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="add-btn-wrap">
            <el-button
                type="default"
                round
                @click="cancel"
            >
                取消
            </el-button>
            <el-button
                type="primary"
                round
                plain
                @click="handlePreview('marketingForm')"
            >
                预览
            </el-button>
            <el-button
                type="primary"
                round
                :loading="loading"
                @click="submitForm('marketingForm')"
            >
                保存
            </el-button>
        </div>
        <GoodsPreview
            :show.sync="showPreview"
            :data="singleGoods"
        />
        <ProductSelector
            new-year-type="2019_02"
            :visible.sync="addVisible"
            @confirm="selectGood"
        />
    </div>
</template>

<script>
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview'
import ProductSelector from '../../../../components/product-center/goods/Product-Radio.vue'
import { getSingleGoods } from '../../../../apis/product-center/goods'
import { goPage } from '../../../../assets/ts/utils'
import { createTogetherActivity, updateTogetherActivity, togetherActivityDetail } from '../../../../apis/marketing-manage/together'
import moment from 'moment/moment'
import UserGroup from '../../../../components/common/User-Group.vue'

export default {
    name: 'AddTogether',
    components: {
        GoodsPreview,
        ProductSelector,
        UserGroup
    },
    data () {
        return {
            loading: false,
            id: '',
            type: '',
            marketingForm: {
                activityBrief: '1.任何注册用户均可参团；\n2.填写购买下单基本信息，完成线上支付即参团成功；\n3.将活动分享给好友，邀请好友加团购，当达到成团人数后，即团购成功，一起瓜分线上奖池；\n4.若参与人数未达到成团人数，则不可瓜分线上奖池。',
                countdown: 3,
                activityStartTime: moment(Date.now() + (1000 * 60 * 60)).format('YYYY-MM-DD HH:mm:ss'),
                activityEndTime: '',
                validityPeriodStart: moment(Date.now() + (1000 * 60 * 60 * 24)).format('YYYY-MM-DD HH:mm:ss'), // 核销时间
                validityPeriodEnd: '', // 核销时间
                price: 19.9,
                stock: 99,
                prizePool: 0,
                product: null,
                receiveLimit: 0,
                type: '2019_02', // 新春开学季类型
                activityLimit: false, // 活动是否限购 0：不限  1：限制
                activityLimitNumber: 1, // 限购数量
                userTagIdList: [], // 标签
                hidePrice: false, // 是否隐藏定价（0-展示；1-隐藏）
                hasReward: 1, // 成团有无奖金池（0-有；1-无）
                prizeList: [{ numberLimit: 1, prize: 1 }], // 阶级奖池数组
                productType: '', // 是否实体
                expiration: 180, // 奖学金过期时间
                timeout: 180// 奖学金失效时间
            },
            userTagList: [], // 用户标签
            activityStatus: 0,
            singleGoods: null,
            showPreview: false,
            addVisible: false,
            selectedGoods: null,
            rules: {
                activityBrief: [
                    { required: true, message: '请添加活动细则', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请添加拼团商品价格', trigger: 'blur' }
                ],
                stock: [
                    { required: true, message: '请添加拼团商品库存', trigger: 'blur' }
                ],
                prizePool: [
                    // { required: true, message: '请输入奖池金额', trigger: 'blur' }
                ],
                countdown: [
                    { required: true, message: '请设置预热时间', trigger: 'blur' }
                ],
                activityStartTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                activityEndTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
    // 如果不是新建活动，则请求列表进行展示
        if (this.$route.params.id) {
            this.id = this.$route.params.id
            this.type = this.$route.params.type
            this.getTogetherActivityDetail(this.id)
        }
    },
    mounted () {
        window.addEventListener('beforeunload', this.beforeunload)
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.beforeunload)
    },
    beforeRouteLeave (to, from, next) {
        if ((to.name !== 'AddTogether' || to.name !== 'EditTogether') && to.name !== 'TogetherBuyList') {
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
        groupInit (val) {
            this.userTagList = val
        },
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
        async getTogetherActivityDetail (id) {
            try {
                const { result } = await togetherActivityDetail(id)
                Object.assign(this.marketingForm, {
                    activityBrief: result.activityBrief,
                    countdown: result.countdown,
                    activityStartTime: result.activityStartTime,
                    activityEndTime: result.activityEndTime,
                    price: result.price,
                    stock: result.stock,
                    prizePool: result.prizePool,
                    product: {
                        productType: result.productType,
                        validityPeriodStart: result.validityPeriodStart,
                        validityPeriodEnd: result.validityPeriodEnd,
                        productMainImage: result.productMainImage,
                        productName: result.productName,
                        id: result.productId
                    },
                    type: '2019_02', // 新春开学季类型
                    receiveLimit: result.receiveLimit,
                    activityLimit: result.activityLimit === 1, // 活动是否限购 0：不限  1：限制
                    activityLimitNumber: result.activityLimitNumber, // 限购数量
                    userTagIdList: result.userTagIdList, // 标签
                    hidePrice: result.hidePrice === 0, // 是否隐藏定价（0-展示；1.-隐藏）
                    hasReward: result.hasReward, // 成团有无奖金池（0-有；1-无）
                    prizeList: result.prizeList.length === 0 ? [{ numberLimit: 1, prize: 0 }] : result.prizeList, // 阶级奖池数组
                    productType: result.productType, // 是否实体
                    validityPeriodStart: result.validityPeriodStart, // 核销时间
                    validityPeriodEnd: result.validityPeriodEnd, // 核销时间
                    expiration: result.expiration, // 奖学金失效时间
                    timeout: result.timeout // 奖学金过期时间
                })
                this.activityStatus = this.type ? 0 : result.status
            } catch (e) { throw e }
        },
        dateChange (val) {
            this.marketingForm.activityStartTime = this.activityStatus === 1 ? this.marketingForm.activityStartTime : val.start
            this.marketingForm.activityEndTime = val.end
        },
        // 核销时间change
        dateVerifyChange (val) {
            this.marketingForm.validityPeriodStart = val.start
            this.marketingForm.validityPeriodEnd = val.end
        },
        openAddListDialog () {
            this.addVisible = true
        },
        removeProduct () {
            this.marketingForm.product = null
        },
        selectGood (pro) {
            this.marketingForm.product = pro
        },
        async handlePreview (formName) {
            // 自定义校验
            const provideValidate = this.provideValidate()
            if (!provideValidate) return
            try {
                await this.$refs[formName].validate()
                let { result } = await getSingleGoods(this.marketingForm.product.id)
                result = { ...result, activityProductModel: { ...this.marketingForm, status: this.activityStatus || 0 }, activeProduct: 2 }
                this.singleGoods = result
                this.showPreview = true
            } catch (e) { throw e }
        },
        // 验证奖池阶梯
        validateStair (arr) {
            // 判断
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i].numberLimit === undefined || arr[i].prize === undefined) {
                    return { status: false, msg: '阶梯件数和阶梯阶梯红包不可为空' }
                }
                if (parseInt(arr[i].numberLimit) !== parseFloat(arr[i].numberLimit)) {
                    return { status: false, msg: '阶梯件数为整数' }
                }
                if (i > 0) {
                    if (arr[i].numberLimit === arr[i - 1].numberLimit) {
                        return { status: false, msg: '阶梯件数不能相等' }
                    }
                }
            }
            return { status: true }
        },
        async submitForm (formName) {
            // 自定义校验
            const provideValidate = this.provideValidate()
            if (!provideValidate) return
            try {
                this.loading = true
                await this.$refs[formName].validate()
                const Form = this.marketingForm
                const params = {
                    id: this.id ? (this.type ? '' : this.id) : '',
                    activityBrief: Form.activityBrief,
                    countdown: Form.countdown,
                    activityStartTime: Form.activityStartTime,
                    activityEndTime: Form.activityEndTime,
                    price: Form.price,
                    stock: Form.stock,
                    prizePool: Form.prizePool || 0,
                    productId: Form.product.id,
                    type: '2019_02', // 新春开学季类型
                    receiveLimit: Form.receiveLimit,
                    activityLimit: Form.activityLimit ? 1 : 0, // 活动是否限购 0：不限  1：限制
                    activityLimitNumber: Form.activityLimit ? parseInt(Form.activityLimitNumber) : null, // 限购数量
                    userTagIdList: Form.userTagIdList, // 标签
                    hidePrice: Form.hidePrice ? 0 : 1, // 是否隐藏定价（0-展示；Form.-隐藏）
                    hasReward: Form.hasReward, // 成团有无奖金池（0-有；1-无）
                    prizeList: Form.prizeList.sort((pre, next) => pre.numberLimit - next.numberLimit), // 排序阶级奖池数组
                    expiration: parseInt(Form.expiration), // 奖学金失效时间
                    timeout: parseInt(Form.timeout), // 奖学金过期时间
                    validityPeriodStart: Form.validityPeriodStart, // 核销时间
                    validityPeriodEnd: Form.validityPeriodEnd // 核销时间
                }
                // 判断商品是否参加了其他活动，否则跳转，是则提示
                let [gomMes, warnMessage] = [{}]
                if (this.id) {
                    if (this.type) {
                        gomMes = await createTogetherActivity(params)
                        warnMessage = '复制成功'
                    } else {
                        gomMes = await updateTogetherActivity(params)
                        warnMessage = '修改成功'
                    }
                    goPage(this, gomMes.result, warnMessage, 'TogetherBuyList')
                } else {
                    gomMes = await createTogetherActivity(params)
                    warnMessage = '创建成功'
                    goPage(this, gomMes.result, warnMessage, 'TogetherBuyList')
                }
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
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
            // 选择线上且虚拟
            if (this.marketingForm.product && this.marketingForm.product.productType !== 'PHYSICAL_GOODS') {
                if (!this.marketingForm.validityPeriodStart || !this.marketingForm.validityPeriodEnd) {
                    this.$error('请选择核销时间时间')
                    return false
                }
                if (moment(this.marketingForm.validityPeriodStart).valueOf() < moment(this.marketingForm.activityStartTime).valueOf()) {
                    this.$error('核销开始时间不能小于活动开始时间')
                    return false
                }
                if (moment(this.marketingForm.validityPeriodEnd).valueOf() < moment(this.marketingForm.activityEndTime).valueOf()) {
                    this.$error('核销结束时间不能小于活动结束时间')
                    return false
                }
            }
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
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
            // 验证红包奖池
            if (this.marketingForm.hasReward === 0) {
                const { status, msg } = this.validateStair(this.marketingForm.prizeList)
                if (!status) {
                    this.$error(msg)
                    return false
                }
                if (this.marketingForm.timeout < 1 || this.marketingForm.timeout > 365) {
                    this.$error('奖学金过期时间为 1 至 365 天')
                    return false
                }
                if (this.marketingForm.expiration < 1 || this.marketingForm.expiration > 365) {
                    this.$error('奖学金失效时间为 1 至 365 天')
                    return false
                }
            }
            return true
        }
    }
}
</script>

<style scoped lang="scss">
.add-marketing {
    padding-bottom: 100px;
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
        background: #fff;
        .content-detail {
            padding-bottom: 20px;
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
                width: 528px;
                padding: 10px;
                box-sizing: border-box;
                background: #ccc;
                border: 1px solid #ccc;
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
