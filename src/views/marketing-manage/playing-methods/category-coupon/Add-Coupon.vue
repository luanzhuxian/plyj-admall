<template>
    <div class="add-content">
        <div class="wrap">
            <div class="content-title" id="basic" ref="basic">
                基本信息
                <div style="margin-left: 20px" class="purchase-sort-description">
                    品类券仅支持线上购买指定范围内的商品时，满足条件则自动抵扣支付金额；
                </div>
            </div>
            <el-form label-width="150px" :model="form" :rules="rules" ref="ruleForm" label-position="left" class="main-form">
                <el-form-item label-width="170px" label="品类券名称" prop="couponName">
                    <el-input style="width: 320px" @change="getBrief()" v-model="form.couponName" maxlength="50" placeholder="如，品类券（4-12个字）" />
                </el-form-item>
                <el-form-item label="品类券" required>
                    <div class="flex man-l20">
                        <el-form-item prop="useLimitAmount">
                            满 <el-input style="width: 160px" @change="checkLimitAmount(), getBrief()" type="number" v-model="form.useLimitAmount" :disabled="status" maxlength="50" placeholder="请输入满减的金额" />
                        </el-form-item>
                        &nbsp;立减 &nbsp;
                        <el-form-item prop="amount">
                            <el-input style="width: 160px" @change="checkamount(), getBrief()" type="number" v-model="form.amount" :disabled="status" maxlength="50" placeholder="请输入优惠的金额" /> 元
                        </el-form-item>
                        &nbsp;&nbsp;品类券指定商品可用
                    </div>
                    <div class="man-l20" style="color: #999;font-size: 14px">
                        <p>仅支持输入大于0的金额，且满足的金额需 >= 优惠金额；</p>
                        <p>即可设置满100减10元品类券，购买商品时满足此金额，即可减免相应的金额；</p>
                    </div>
                </el-form-item>
                <el-form-item>
                    <span slot="label">
                        <span class="red">*</span>
                        <span>适用方式</span>
                    </span>
                    <div class="man-l20">
                        <el-radio v-model="form.applicableGoods" :label="1">
                            部分商品可用
                        </el-radio>
                        <span class="purchase-sort-description"> (购买减免部分商品和课程金额)</span>
                        <br>
                        <el-button size="mini" type="primary" plain @click="addVisible = true">
                            选择商品
                        </el-button>
                        <div v-if="form.applicableGoodsId.length">
                            <div
                                class="wrap flex-align"
                                v-if="form.status !== '' && form.status !== 2"
                            >
                                <div class="mr-10">
                                    已选择{{ multipleSelection.length }}条
                                </div>
                                <el-button
                                    size="mini"
                                    :disabled="!multipleSelection.length || status"
                                    @click="batchDeleteProduct()"
                                >
                                    批量删除
                                </el-button>
                            </div>
                            <el-table
                                @selection-change="handleSelectionChange"
                                type="index"
                                class="content-table"
                                :data="form.applicableGoodsId"
                                ref="table"
                            >
                                <el-table-column
                                    type="selection"
                                    width="55"
                                />
                                <el-table-column
                                    prop="productMainImage"
                                    label="商品图片"
                                    width="180"
                                    header-align="center"
                                    align="center"
                                >
                                    <template slot-scope="{ row }">
                                        <div>
                                            <img
                                                width="60"
                                                height="60"
                                                :src="row.productMainImage"
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="productName"
                                    label="商品名称"
                                    width="160"
                                />
                                <el-table-column
                                    prop="productTypeText"
                                    label="商品类型"
                                    width="100"
                                />
                                <el-table-column
                                    prop="price"
                                    label="商品价格"
                                    width="100"
                                />
                                <el-table-column
                                    label="操作"
                                    width="100"
                                    align="center"
                                >
                                    <template slot-scope="scope">
                                        <el-button
                                            :disabled="status"
                                            type="text"
                                            size="mini"
                                            style="width: 50px;"
                                            plain
                                            @click="deleteProduct(scope.$index)"
                                        >
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-form-item>
                <div class="content-title">
                    领取规则
                </div>
                <el-form-item>
                    <span slot="label">
                        <span class="red">*</span>
                        <span>领取方式</span>
                        <el-tooltip class="item" effect="dark" placement="bottom">
                            <div slot="content">
                                自行领取：用户可在商品详情页或领取<br>
                                中心中直接领取；<br>
                                活动发放：用户通过参与活动后，可领<br>
                                取。<br>
                            </div>
                            <pl-svg class="pro-type-intro-time" name="icon-jinggao" width="20" />
                        </el-tooltip>
                    </span>
                    <div class="man-l20">
                        <el-radio-group v-model="form.distributionMethod" @change="distributionMethodChange">
                            <el-radio :disabled="status" :label="0">
                                自行领取
                            </el-radio>
                            <el-radio :disabled="status" :label="1">
                                活动发放
                            </el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item v-if="!form.distributionMethod">
                    <span slot="label">
                        <span class="red">*</span>
                        <span>适用用户</span>
                    </span>
                    <div class="man-l20">
                        <el-radio-group v-model="form.receiveLimit">
                            <el-radio :disabled="status" :label="0">
                                所有注册用户
                            </el-radio>
                            <el-radio :disabled="status" :label="1">
                                helper可用
                            </el-radio>
                            <el-radio :disabled="status" :label="2">
                                普通会员
                            </el-radio>
                            <el-radio :disabled="status || !checkListArray || !checkListArray.length" :label="3">
                                部分用户可用<span v-if="!(checkListArray && checkListArray.length)" class="purchase-sort-description"> （请先在会员中心-设置用户分组）</span>
                            </el-radio>
                        </el-radio-group>
                        <div v-if="form.receiveLimit === 3" class="user-category">
                            <el-checkbox-group v-model="form.tagIds">
                                <el-checkbox :disabled="status" style="width: 120px;" v-for="(item,index) in checkListArray" :label="item.id" :key="index">
                                    {{ item.tagName }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="领取次数限制" v-if="!form.distributionMethod" label-width="170px" prop="activityLimit">
                    <el-radio-group v-model="form.activityLimit" @change="activityLimitChange">
                        <el-radio :disabled="status" :label="0">
                            不限制领取次数
                        </el-radio>
                        <div style="padding: 5px" />
                        <el-radio :disabled="status" :label="1">
                            每个账号限领
                        </el-radio>
                        <el-input @change="checkQuantityLimit" :disabled="status || !form.activityLimit" style="width: 110px" v-model="form.quantityLimit" max="100" type="number" placeholder="请输入张数" />
                        <span class="purchase-sort-description"> （领取次数限制最小可领取1张，最多可领取100张）</span>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="!form.distributionMethod && !status" label-width="170px">
                    <span slot="label">
                        <span class="red">*</span>
                        <span>领取时间</span>
                    </span>
                    <el-date-picker
                        v-model="receiveDaterange"
                        @change="receiveDaterangeChange"
                        type="daterange"
                        align="right"
                        start-placeholder="选择开始时间"
                        end-placeholder="选择结束时间"
                        :picker-options="startPickerOptions"
                        format="yyyy-MM-dd"
                        range-separator="至"
                        :editable="false"
                    />
                    <span class="purchase-sort-description"> （品类券在指定的领取时间内，可正常显示和领取）</span>
                </el-form-item>
                <el-form-item v-if="!form.distributionMethod && status" label-width="170px">
                    <span slot="label">
                        <span class="red">*</span>
                        <span>领取时间</span>
                    </span>
                    <el-date-picker
                        :disabled="true"
                        v-model="form.receiveStartTime"
                        type="date"
                        placeholder="选择开始时间"
                        :editable="false"
                    />
                    <span> 至 </span>
                    <el-date-picker
                        @change="chooseReceiveEditEndTime"
                        v-model="form.receiveEndTime"
                        :picker-options="canReceiveEditEndTime"
                        type="date"
                        placeholder="选择结束时间"
                        :editable="false"
                    />
                </el-form-item>

                <el-form-item v-if="!status" label-width="170px">
                    <span slot="label">
                        <span class="red">*</span>
                        <span>用券时间</span>
                    </span>
                    <el-date-picker
                        v-model="useDaterange"
                        type="daterange"
                        align="right"
                        format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="选择开始时间"
                        end-placeholder="选择结束时间"
                        :picker-options="startPickerOptions"
                        :editable="false"
                        @change="useDaterangeChange"
                    />
                    <span class="purchase-sort-description">（机构仅可在使用有效期内对用户订单进行二维码核销操作，请谨慎填写）</span>
                </el-form-item>

                <el-form-item v-else label-width="170px">
                    <span slot="label">
                        <span class="red">*</span>
                        <span>用券时间</span>
                    </span>
                    <el-date-picker
                        :disabled="true"
                        v-model="form.useStartTime"
                        type="date"
                        placeholder="选择开始时间"
                        :editable="false"
                    />
                    <span> 至 </span>
                    <el-date-picker
                        @change="chooseUseEditEndTime"
                        v-model="form.useEndTime"
                        :picker-options="canUseEditEndTime"
                        type="date"
                        placeholder="选择结束时间"
                        :editable="false"
                    />
                </el-form-item>

                <el-form-item label="使用须知" prop="brief">
                    <div class="flex" style="margin-left: 20px;">
                        <el-input
                            :disabled="!Boolean(form.briefEdit)"
                            type="textarea"
                            placeholder="请输入使用须知的内容"
                            v-model="form.brief"
                            maxlength="200"
                            style="width: 420px;"
                            :rows="6"
                            resize="none"
                            show-word-limit
                            :editable="false"
                        />
                        <pl-svg v-if="!form.briefEdit" class="brief-edit" width="24" fill="#4F63FF" name="icon-bianji1" @click="form.briefEdit = 1" />
                    </div>
                </el-form-item>
                <div class="content-title">
                    其他设置
                </div>
                <el-form-item>
                    <span slot="label">
                        <span class="red">*</span>
                        <span>使用限制</span>
                    </span>
                    <div class="man-l20">
                        <el-radio-group v-model="form.scholarship">
                            <div class="use-limit" style="display: flex;flex-direction: column">
                                <el-radio :disabled="status" :label="1">
                                    可与奖学金合并使用<span class="purchase-sort-description"> （奖学金（即红包），是用户通过活动获取的；可支持购买时与品类券同时叠加使用）</span>
                                </el-radio>
                                <el-radio :disabled="status" :label="0">
                                    不可与奖学金合并使用<span class="purchase-sort-description"> （购买时使用该品类券时，不可选择奖学金叠加抵扣；）</span>
                                </el-radio>
                            </div>
                        </el-radio-group>
                        <div style="color: #999;font-size: 14px">
                            <br>
                            <p>秒杀、团购、预购活动均不支持使用品类券和奖学金进行减免；</p>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div class="newcomer-example">
                <div class="newcomer-example-title">
                    品类券示例
                </div>
                <img src="https://mallcdn.youpenglai.com/static/admall/2.0.0/ba5e52bc-8df0-4390-813f-a01dc5efd781.jpeg">
            </div>
        </div>
        <div class="add-btn-wrap" :style="{marginTop: form.distributionMethod ? '40': '40'}">
            <el-button plain round @click="cancel">
                取消
            </el-button>
            <el-button type="primary" plain round @click="preview">
                预览
            </el-button>
            <el-button type="primary" round @click="save">
                保存
            </el-button>
        </div>
        <Preview :show.sync="previewShow">
            <div class="preview-box">
                <img style="width: 100%" src="https://mallcdn.youpenglai.com/static/admall/2.0.0/0e3506df-ff43-41e6-8bca-118f75a21613.png" alt="">
                <div class="coupon-item">
                    <div class="coupon-item-wrap">
                        <div class="main">
                            <div class="coupon-item-left">
                                <div class="left-top">
                                    <div class="coupon-price">
                                        <span>￥</span>{{ form.amount }}
                                    </div>
                                    <div class="coupon-desc">
                                        <div>满{{ form.useLimitAmount }}减{{ form.amount }}</div>
                                        <div>{{ form.couponName }}</div>
                                    </div>
                                </div>
                                <div class="life-time">
                                    <div class="desc-time" v-if="this.form.useStartTime && this.form.useEndTime">
                                        有效期：<i>{{ this.form.useStartTime | dateFormat('YYYY.MM.DD') }}~{{ this.form.useEndTime | dateFormat('YYYY.MM.DD') }}</i>
                                    </div>
                                    <div class="desc-btn" @click="descShow = !descShow">
                                        使用说明
                                        <pl-svg v-if="descShow" class="showInstruction" name="icon-shang" fill="#fff" width="10" />
                                        <pl-svg v-else class="showInstruction" name="icon-xia" fill="#fff" width="10" />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="coupon-item-right"
                            >
                                立即领取
                            </div>
                        </div>
                    </div>
                </div>
                <div class="preview-desc-box" v-if="descShow">
                    <p>{{ form.couponName }}</p>
                    <p>1.优惠内容：部分商品可使用，满{{ form.useLimitAmount }}元立减{{ form.amount }}元</p>
                    <p>2.使用时间：{{ form.useStartTime | dateFormat('YYYY-MM-DD ') }}~{{ form.useEndTime | dateFormat('YYYY-MM-DD ') }}</p>
                    <p>3.使用限制：不可与其他品类券同时使用</p>
                    <p>4.其他限制：{{ form.activityLimit ? '每个账号限领取' + form.quantityLimit + '张，' : '' }} 仅支持线上购买商品使用</p>
                </div>
            </div>
        </Preview>
        <ProductSelector
            :visible.sync="addVisible"
            @confirm="selectGood"
        />
    </div>
</template>

<script>
import moment from 'moment/moment'
import ProductSelector from '../../../../components/product-center/goods/Product-Checkbox.vue'
import Preview from '../../../../components/common/Preview.vue'
import { copyFields, resetForm } from '../../../../assets/ts/utils'
import {
    saveCoupon,
    getCouponDetail,
    updateCoupon,
    getUserTtagList
} from '../../../../apis/marketing-manage/coupon'
import { SessionEnum } from '../../../../enum/storage'

const START_TIME = `${ moment().format('YYYY-MM-DD') } 00:00:00`
// let END_TIME = moment().format('YYYY-MM-DD') + ' 23:59:59'
// let DEFAULT_RECEIVE_TIME = [START_TIME, '2020-03-31 23:59:59']
// let DEFAULT_USE_TIME = [START_TIME, '2020-03-31 23:59:59']
// function setDefaultTime () {
//   // 默认开始时间，默认不得小于当天零点
//   // 默认结束时间，默认不得小于当天23点

//   if (moment(DEFAULT_RECEIVE_TIME[0]).valueOf() < moment(START_TIME).valueOf()) {
//     DEFAULT_RECEIVE_TIME[0] = START_TIME
//   }
//   if (moment(DEFAULT_RECEIVE_TIME[1]).valueOf() < moment(END_TIME).valueOf()) {
//     DEFAULT_RECEIVE_TIME[1] = END_TIME
//   }
//   if (moment(DEFAULT_USE_TIME[0]).valueOf() < moment(START_TIME).valueOf()) { // 领取时间和用券时间重叠
//     DEFAULT_USE_TIME[0] = START_TIME
//   }
//   if (moment(DEFAULT_USE_TIME[1]).valueOf() < moment(END_TIME).valueOf()) {
//     DEFAULT_USE_TIME[1] = END_TIME
//   }
// }
// setDefaultTime()

export default {
    name: 'AddCoupon',
    components: {
        Preview,
        ProductSelector
    },
    data () {
        return {
            productTypeMap: {
                PHYSICAL_GOODS: '实体商品',
                VIRTUAL_GOODS: '虚拟商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课'
            },
            chooseAll: false,
            checkListArray: [],
            previewShow: false,
            addVisible: false,
            id: '',
            status: false,
            startPickerOptions: {
                disabledDate: time => time.getTime() < Date.now() - 8.64e7
            },
            receiveLimit: {
                member: true,
                helper: true
            },
            form: {
                // 品类券类型
                packageType: '',
                couponType: 2,
                // 品类券名称
                couponName: '',
                // 满减
                useLimitAmount: '',
                amount: '',
                // 领取方式
                distributionMethod: 0,
                // 参与限制
                receiveLimit: 0,
                // 领取次数限制
                activityLimit: 0,
                quantityLimit: '',
                // 领券时间
                receiveStartTime: '',
                receiveEndTime: '',
                // 用券时间
                useStartTime: '',
                useEndTime: '',
                // 使用说明
                brief: '',
                briefEdit: 0,
                applicableGoods: 1,
                scholarship: 1,
                tagIds: [],
                applicableGoodsId: []
            },
            rules: {
                productType: [
                    { required: true }
                ],
                couponName: [
                    { required: true, message: '品类券名称不能为空', trigger: 'blur' },
                    { max: 12, message: '品类券名称不能超过12个字符', trigger: 'blur' },
                    { min: 4, message: '品类券名称不能少于4个字符', trigger: 'blur' }
                ],
                useLimitAmount: [
                    { required: true, message: '满减金额不能为空', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: '优惠金额不能为空', trigger: 'blur' }
                ],
                activityLimit: [
                    { required: true, message: '领取次数限制不能为空', trigger: 'blur' }
                ],
                useStartTime: [
                    { required: true, message: '用券时间不能为空', trigger: 'blur' }
                ],
                brief: [
                    { required: true, message: '使用须知不能为空', trigger: 'blur' },
                    { max: 200, message: '使用须知不能超过200个字符', trigger: 'blur' }
                ]
            },
            receiveDaterange: [],
            useDaterange: [],
            canReceiveEditEndTime: {},
            canUseEditEndTime: {},
            editReceiveEndTime: '',
            editUseEndTime: '',
            descShow: true,
            useDaterangeCache: {
                status0: [], // 自行领取, 缓存选择时间
                status1: [] // 活动发放, 缓存选择时间
            },
            multipleSelection: [],
            resultData: {}
        }
    },
    computed: {
        isCopy () {
            return this.$route.name === 'CopyCategoryCoupon'
        }
    },
    watch: {
    },
    async activated () {
    // 此数据是用来告诉选择优惠券页面，新建的优惠券数据，必须手动清空，不然会有数据残留
        this.resultData = {}
        this.getUserTtagListFun()
        const params = this.$route.params
        this.id = params.id
        if (this.id) {
            await this.init()
            this.editReceiveEndTime = JSON.parse(JSON.stringify(this.form.receiveEndTime))
            this.canReceiveEditEndTime = {
                disabledDate: time => time.getTime() < new Date(this.editReceiveEndTime).getTime() - 8.64e7
            }
            this.editUseEndTime = JSON.parse(JSON.stringify(this.form.useEndTime))
            this.canUseEditEndTime = {
                disabledDate: time => time.getTime() < new Date(this.editUseEndTime).getTime() - 8.64e7
            }
        }
        if (!this.id && !this.isCopy) {
            this.receiveDaterangeChange()
            this.useDaterangeChange()
        }
        this.getBrief()
    },
    methods: {
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        batchDeleteProduct () {
            const arrayId = []
            for (const item of this.multipleSelection) {
                arrayId.push(item.id)
            }
            const array = []
            for (const item of this.form.applicableGoodsId) {
                if (!arrayId.includes(item.id)) {
                    array.push(item)
                }
            }
            this.form.applicableGoodsId = array
            if (!this.form.applicableGoodsId.length) {
                this.multipleSelection = []
            }
        },
        deleteProduct (index) {
            this.form.applicableGoodsId.splice(index, 1)
            if (!this.form.applicableGoodsId.length) {
                this.multipleSelection = []
            }
        },
        checkLimitAmount () {
            if (this.form.useLimitAmount.indexOf('.') > 0 && this.form.useLimitAmount.split('.')[1].length > 2) {
                this.form.useLimitAmount = Number(this.form.useLimitAmount).toFixed(2)
            }
        },
        checkamount () {
            if (this.form.amount.indexOf('.') > 0 && this.form.amount.split('.')[1].length > 2) {
                this.form.amount = Number(this.form.amount).toFixed(2)
            }
        },
        async init () {
            try {
                const { result } = await getCouponDetail(this.id)
                if ((result.status === 0 || result.status === 4) && !this.isCopy) {
                    this.status = true
                } else {
                    this.status = false
                }
                this.form.id = ''
                copyFields(this.form, result)
                this.form.tagIds = []
                for (const item of result.couponTagList) {
                    this.form.tagIds.push(item.userTagId)
                }
                for (const item of result.couponProductRList) {
                    item.price = item.minPrice
                    item.id = item.productId
                    item.productTypeText = this.productTypeMap[item.productType]
                }
                this.form.applicableGoodsId = result.couponProductRList || []
                if (this.form.receiveStartTime) {
                    // if ((moment(this.form.receiveStartTime).valueOf() < Date.now()) && this.isCopy) {
                    //   this.form.receiveStartTime = ''
                    //   this.form.receiveEndTime = ''
                    // } else {
                    this.receiveDaterange = [new Date(this.form.receiveStartTime), new Date(this.form.receiveEndTime)]
                    // }
                }
                if (this.form.useStartTime) {
                    // if ((moment(this.form.useStartTime).valueOf() < Date.now()) && this.isCopy) {
                    //   this.form.useStartTime = ''
                    //   this.form.useEndTime = ''
                    // } else {
                    this.useDaterange = [new Date(this.form.useStartTime), new Date(this.form.useEndTime)]
                    // }
                }
                if (this.isCopy) {
                    // 复制状态下，因为在前面两个同级条件判断中，将开始时间和结束时间置空了，需要手动触发赋值
                    this.receiveDaterangeChange()
                    this.useDaterangeChange()
                }
            } catch (e) {
                throw e
            }
        },
        selectGood (pro) {
            const arrayId = []
            for (const item of this.form.applicableGoodsId) {
                arrayId.push(item.id)
            }
            for (const item of pro) {
                if (!arrayId.includes(item.id)) {
                    item.isSelected = false
                    this.form.applicableGoodsId.push(item)
                }
            }
        },
        async getUserTtagListFun () {
            try {
                const { result } = await getUserTtagList()
                this.checkListArray = result
            } catch (e) {
                throw e
            }
        },
        getBrief () {
            if (this.form.briefEdit) return
            this.form.brief = `${ this.form.couponName }` + '\n' +
          '1.优惠内容：部分商品可使用，满' + `${ this.form.useLimitAmount ? this.form.useLimitAmount : '*' }` + '元立减' + `${ this.form.amount ? this.form.amount : '*' }` + '元\n' +
          '2.使用时间：' + `${ this.form.useStartTime ? this.form.useStartTime.split(' ')[0] : '' }` + '~' + `${ this.form.useEndTime ? this.form.useEndTime.split(' ')[0] : '' }` + '\n' +
          '3.使用限制：不可与其他品类券同时使用\n' +
          '4.其他限制：' + `${ this.form.activityLimit ? `每个账号限领取${ this.form.quantityLimit }张，` : '' } ` + '仅支持线上购买商品使用'
        },
        checkQuantityLimit () {
            if (!this.form.quantityLimit || this.form.quantityLimit < 1) this.form.quantityLimit = 1
            if (this.form.quantityLimit > 100) {
                this.form.quantityLimit = 100
            }
        },
        distributionMethodChange () {
            if (!this.form.distributionMethod) { // 0自行领取
                this.form.activityLimit = 0
                this.form.quantityLimit = ''
                // 记录选择活动发放时选择的时间
                this.useDaterangeCache.status1 = this.useDaterange
                this.useDaterange = this.useDaterangeCache.status0
                this.useDaterangeChange()
            } else { // 1活动发放
                // 记录选择自行领取时选择的时间
                this.useDaterangeCache.status0 = this.useDaterange
                this.useDaterange = this.useDaterangeCache.status1
                this.useDaterangeChange()
            }
            this.getBrief()
        },
        activityLimitChange () {
            this.form.activityLimit ? this.form.quantityLimit = 1 : this.form.quantityLimit = ''
            this.getBrief()
        },
        receiveDaterangeChange () {
            if (!this.receiveDaterange) {
                this.form.receiveStartTime = ''
                this.form.receiveEndTime = ''
            }
            if (this.receiveDaterange && this.receiveDaterange.length === 2) {
                this.form.receiveStartTime = `${ moment(this.receiveDaterange[0]).format('YYYY-MM-DD') } 00:00:00`
                this.form.receiveEndTime = `${ moment(this.receiveDaterange[1]).format('YYYY-MM-DD') } 23:59:59`
            }
            this.getBrief()
        },
        useDaterangeChange () {
            if (!this.useDaterange) {
                this.form.useStartTime = ''
                this.form.useEndTime = ''
            }
            if (this.useDaterange && this.useDaterange.length === 2) {
                this.form.useStartTime = `${ moment(this.useDaterange[0]).format('YYYY-MM-DD') } 00:00:00`
                this.form.useEndTime = `${ moment(this.useDaterange[1]).format('YYYY-MM-DD') } 23:59:59`
            }
            this.getBrief()
        },
        cancel () {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            })
                .then(() => {
                    this.$router.back()
                })
        },
        save () {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.saveCoupon()
                } else {
                    return false
                }
            })
        },
        async saveCoupon () {
            if (!this.checkData()) {
                return
            }
            if (this.form.distributionMethod) {
                // this.receiveLimit.member = false
                // this.receiveLimit.helper = false
                this.form.receiveLimit = null
                this.form.activityLimit = null
                this.form.quantityLimit = null
                this.receiveDaterange = null
                this.form.receiveStartTime = null
                this.form.receiveEndTime = null
            }
            const array = []
            for (const item of this.form.applicableGoodsId) {
                array.push(item.id)
            }
            this.form.applicableGoodsId = array
            if (this.id && !this.isCopy) {
                await updateCoupon(this.form)
            } else {
                if (this.isCopy) {
                    delete this.form.id
                }
                const { result } = await saveCoupon(this.form)
                this.resultData = result
            }
            this.$router.back()
            this.$success('保存成功')
        },
        preview () {
            if (!this.checkData()) {
                return
            }
            this.previewShow = true
        },
        checkData () {
            if (!this.form.amount || !this.form.useLimitAmount) {
                this.$warning('满减金额与优惠金额不能为空')
                return false
            }
            if (this.form.amount > 99999.99 || this.form.amount < 0.01 || this.form.useLimitAmount > 99999.99 || this.form.useLimitAmount < 0.01) {
                this.$warning('满减金额与优惠金额不能大于99999.99且小于0.01')
                return false
            }
            if (Number(this.form.amount) > Number(this.form.useLimitAmount)) {
                this.$warning('优惠金额不能大于满减金额')
                return false
            }
            if (!this.form.applicableGoodsId.length) {
                this.$warning('请选择商品')
                return false
            }
            if (!this.form.useStartTime) {
                this.$warning('用券开始时间不能为空')
                return false
            }
            if (!this.form.id && moment(this.form.useStartTime).valueOf() < moment(START_TIME).valueOf()) {
                this.$warning('用券开始时间不能小于当前时间')
                return false
            }
            if (!this.form.useEndTime) {
                this.$warning('用券结束时间不能为空')
                return false
            }
            if (!this.form.distributionMethod) {
                if (this.form.receiveLimit === 3 && !this.form.tagIds.length) {
                    this.$warning('请至少选择一种用户标签')
                    return false
                }
                if (this.form.activityLimit === 1 && !this.form.quantityLimit) {
                    this.$warning('领取张数不能为空')
                    return false
                }
                if (this.form.activityLimit === 1 && this.form.quantityLimit) {
                    if (Number(this.form.quantityLimit) > 100) {
                        this.$warning('最多可领取100张')
                        return false
                    }
                }
                if (!this.form.receiveStartTime) {
                    this.$warning('领取开始时间不能为空')
                    return false
                }
                if (!this.form.id && moment(this.form.receiveStartTime).valueOf() < moment(START_TIME).valueOf()) {
                    this.$warning('领取开始时间不能小于当前时间')
                    return false
                }
                if (!this.form.receiveEndTime) {
                    this.$warning('领取结束时间不能为空')
                    return false
                }
                if (moment(this.form.useStartTime).valueOf() < moment(this.form.receiveStartTime).valueOf()) {
                    this.$warning('用券开始时间不能小于领取开始时间')
                    return false
                }
                if (moment(this.form.useEndTime).valueOf() < moment(this.form.receiveEndTime).valueOf()) {
                    this.$warning('用券结束时间不能小于领取结束时间')
                    return false
                }
            }
            return true
        },
        chooseReceiveEditEndTime () {
            this.form.receiveEndTime = this.form.receiveEndTime ? `${ moment(this.form.receiveEndTime).format('YYYY-MM-DD') } 23:59:59` : null
            if (moment(this.editReceiveEndTime).valueOf() > moment(this.form.receiveEndTime).valueOf()) {
                this.$warning('活动结束时间不能小于当前结束时间')
                this.form.receiveEndTime = JSON.parse(JSON.stringify(this.editReceiveEndTime))
            } else {
                if (this.form.receiveEndTime) this.form.receiveEndTime = `${ moment(this.form.receiveEndTime).format('YYYY-MM-DD') } 23:59:59`
            }
            this.getBrief()
        },
        chooseUseEditEndTime () {
            this.form.useEndTime = this.form.useEndTime ? `${ moment(this.form.useEndTime).format('YYYY-MM-DD') } 23:59:59` : null
            if (moment(this.editUseEndTime).valueOf() > moment(this.form.useEndTime).valueOf()) {
                this.$warning('活动结束时间不能小于当前结束时间')
                this.form.useEndTime = JSON.parse(JSON.stringify(this.editUseEndTime))
            } else {
                if (this.form.useEndTime) this.form.useEndTime = `${ moment(this.form.useEndTime).format('YYYY-MM-DD') } 23:59:59`
            }
            this.getBrief()
        },
        clearData () { // 清除当前数据，还原到页面的初始数据
            // setDefaultTime()
            this.$refs.ruleForm.clearValidate()
            resetForm(this.form, {
                couponName: '',
                distributionMethod: 0,
                // 参与限制
                receiveLimit: 0,
                // 领取次数限制
                activityLimit: 0,
                brief: '',
                packageType: '',
                couponType: 2,
                applicableGoods: 1,
                scholarship: 1
            })
            // this.receiveLimit.member = true
            // this.receiveLimit.helper = true
            this.form.activityLimit = 0
            this.form.amount = ''
            this.form.useLimitAmount = ''
            this.receiveDaterange = []
            this.useDaterange = []
            this.canReceiveEditEndTime = {}
            this.canUseEditEndTime = {}
            this.editReceiveEndTime = ''
            this.editUseEndTime = ''
            this.status = false
            this.form.briefEdit = 0
            this.getBrief()
        }
    },
    async beforeRouteLeave (to, from, next) {
        if (to.name !== 'CategoryCouponList' && to.name !== 'OrgIndex' && to.name !== 'AddLongmenLottery' && to.name !== 'EditLongmenLottery' && to.name !== 'NewcomersAdd' && to.name !== 'NewcomersEdit' && to.name !== 'NewcomersCopy') {
            await this.$confirm({
                title: '放弃编辑？',
                message: '是否要放弃当前品类券编辑，放弃后将不可恢复！'
            })
        }
        if (to.name === 'NewcomersAdd' || to.name === 'NewcomersEdit' || to.name === 'NewcomersCopy') {
            sessionStorage.setItem(SessionEnum.couponResultData, JSON.stringify(this.resultData))
        }
        if (to.name !== 'NewcomersAdd' && to.name !== 'NewcomersEdit' && to.name !== 'NewcomersCopy') {
            sessionStorage.removeItem(SessionEnum.selectedCouponList)
        }
        await this.clearData()
        next()
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (from.name === 'NewcomersEdit' || from.name === 'NewcomersAdd' || from.name === 'NewcomersCopy') {
                vm.form.distributionMethod = 1
            }
        })
    }
}
</script>
<style lang="scss" scoped>
    .add-content{
        padding-bottom: 100px;
    }
  .flex-align {
    display: flex;
    align-items: center;
  }
  .red{
    color: #D0423C;
  }
  .man-l20{
    margin-left: 20px;
  }
  .font-12c{
    font-size: 12px;
    color: #cccccc;
  }
  .main-form {
    ::v-deep .el-form-item__label {
      padding-left: 30px !important;
    }
  }
  .alink {
    color: #598bf8;
    font-size: 12px;
    text-decoration-line: underline;
  }
  /* 商品类型 */
  .pro-type {
    position: relative;
    margin: 0;
    padding: 0 13px !important;
    line-height: 30px;
    overflow: hidden;
    border-radius: 6px;
    ::v-deep .el-radio__input {
      display: none !important;
    }
    ::v-deep .el-radio__label {
      padding-left: 0;
    }
    &.is-checked:after {
      position: absolute;
      right: 0;
      content: '';
      font-size: 12px;
      border-top: 16px solid #4F63FF;
      border-left: 26px solid transparent;
      z-index: 1;
    }
    &.is-checked:before {
      position: absolute;
      right: 0;
      content: '\e625';
      font-size: 12px;
      color: #fff;
      line-height: 12px;
      z-index: 2;
    }
  }
  .pro-type-intro {
    display: inline-block;
    margin-left: 6px;
    margin-right: 30px;
    font-size: 20px;
    transform: translateY(-8px);
    &:hover {
      color: #EC742E;
    }
  }
  .pro-type-intro-time {
    display: inline-block;
    margin-left: 6px;
    font-size: 20px;
    &:hover {
      color: #EC742E;
    }
  }
  .purchase-sort-description {
    font-weight: 400;
    font-size: 14px;
    color: #999;
  }
  .content-title {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      height: 60px;
      padding-left: 30px;
      font-size: 14px;
      font-weight: bold;
      background-color: #fbfbfb;
  }
  .user-category{
      width: 500px;margin-top: 10px;
      background-color: #eee;
      border: 1px solid #ccc;
      padding-left: 10px;
  }

  .newcomer-example{
    position: absolute;
    top: 200px;
    right: 100px;
    .newcomer-example-title{
      color: #666;
      font-size: 16px;
      padding-bottom: 14px;
    }
    img{
      width: 360px;
    }
  }
  .preview-box{
    width: 100%;
    height: 100%;
    background-color: #F1F4F5;
      margin-top: -19px;
  }
  .coupon-item {
    margin-top: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    .coupon-item-wrap {
      position: relative;
      padding: 8px;
      background: url("https://mallcdn.youpenglai.com/static/admall/2.0.0/c9d3afd5-d209-40dd-b89d-1313846d561e.png");
      background-size: 100% 100%;
      overflow: hidden;
      > .main {
        width: 100%;
        display: flex;
        box-sizing: border-box;
      }
    }
  }
  .coupon-item-left {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 30px 0 14px 10px;
  }
  .left-top {
    display: flex;
    align-items: center;
  }
  .coupon-price {
    position: relative;
    margin-left: 25px;
    margin-right: 15px;
    font-size: 40px;
    color: #ED2E50;
    >span {
      font-size: 12px;
    }
  }
  .coupon-type {
    width: 20px;
    padding: 3px 2px;
    line-height: 13px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    background-color: #EC8378;
  }
  .coupon-desc {
    > div {
      &:nth-of-type(1) {
        color: #5A5A5A;
        font-size: 12px;
        font-weight: bold;
      }
      &:nth-of-type(2) {
        color: #5A5A5A;
        font-size: 12px;
      }
    }
  }
  .life-time {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #FFFFFF;
    .desc-time{
        color: #414141;
        width: 182px;
    }
    .desc-btn{
        background-color: #F9B20F;
        width: 70px;
        margin-right: 5px;
        color: #fff;
        font-size: 12px;
        padding: 0 4px;
        border-radius: 8px;
    }
  }
  .coupon-item-right {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 65px;
    padding-left: 10px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
  }
  .instruction {
    padding: 20px 24px;
    word-break: break-all;
    white-space: pre-line;
    font-size: 24px;
    color: #666;
  }
  .preview-desc-box{
    padding: 20px 20px 20px 15px;
    background-color: #FFFFFF;
    font-size: 12px;
    line-height: 18px;
    color: #8e8e8e;
  }
  .brief-edit{
    margin-top: 100px;
    display: inline-block;
    padding-left: 10px;
    cursor: pointer;
  }
  .use-limit{
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: space-around;
  }
  .tabel-box{
    margin-top: 12px;
    width: 800px;
    border-top: 1px solid #CCCCCC;
    border-right: 1px solid #CCCCCC;
    border-left: 1px solid #CCCCCC;
    .tabel-head{
      .head-button{
        display: flex;
        justify-content: space-between;
        padding: 20px 42px 0 20px;
      }
      .head-title{
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #CCCCCC;
        font-size: 12px;
        color: #333333;
        font-weight: bold;
        .empty{
          width: 90px;
        }
        .coupon-img{
          width: 160px;
          padding: 10px;
          img{
            width: 80px;
          }
        }
        .coupon-name{
          width: 160px;
        }
        .coupon-menoy{
          width: 160px;
        }
        .coupon-num{
          width: 160px;
        }
        .coupon-button{
          width: 70px;
        }
      }
      .tabel-content{
        font-weight: normal;
        .choose-btn{
          width: 90px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
</style>
