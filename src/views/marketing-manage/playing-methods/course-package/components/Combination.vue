<template>
    <div :class="{ [$style.combination]: true, readonly}">
        <div :class="$style.content">
            <el-form
                ref="form"
                :model="model"
                :rules="rules"
                label-width="154px"
                label-position="left"
            >
                <el-form-item label="封面图:" prop="imageUrl">
                    <img v-if="readonly" v-viewer :src="model.imageUrl" alt="" :class="$style.readonlyValue">
                    <ImageManager
                        v-else
                        v-model="imageList"
                        need-edit
                        :width="750"
                        :height="500"
                        :box-width="100"
                        :box-height="67"
                        :count="1"
                    />
                    <span style="color: #999999;font-size: 14px;">( 支持.jpg .jpeg .png .bmp 格式的图片，建议尺寸为750*500，图片最大不能超过2M )</span>
                </el-form-item>

                <el-form-item label="活动时间:" prop="endTime">
                    <span v-if="readonly" :class="$style.readonlyValue">{{ model.startTime }}~{{ model.endTime }}</span>
                    <date-range
                        v-else
                        clearable
                        disable-before
                        :init="defaultDate"
                        :disabled-start-time="model.id && status === 1"
                        @change="dateChange"
                    />
                </el-form-item>

                <el-form-item label="组合商品:" prop="productModelList">
                    <div>
                        <div v-if="!readonly" style="margin-bottom: 10px">
                            <el-button type="primary" plain @click="addProduct('showProductBox')" :disabled="model.productModelList.length >= maxGoodsNum || status === 1">
                                添加商品/课程
                            </el-button>
                            <el-button type="primary" plain @click="addProduct('showCourseBox')" :disabled="model.productModelList.length >= maxGoodsNum || status === 1">
                                添加知识课程
                            </el-button>
                            <span class="gray-3" style="margin-left: 8px">{{ `${model.productModelList.length}/${maxGoodsNum}` }}</span>
                            <span class="gray-3">（最多添加 {{ maxGoodsNum }} 个商品或知识课程，该商品下仅选中的规格可组合价购买）</span>
                        </div>
                        <!-- 商品列表 -->
                        <el-table
                            ref="prodTable"
                            :class="$style.prodTable"
                            v-if="selectedProductList.length"
                            :data="selectedProductList"
                        >
                            <el-table-column
                                width="100"
                                fixed
                            >
                                <template slot-scope="{ row }">
                                    <img v-img-error width="71" height="48" :src="(row.image || row.productImage) + '?x-oss-process=style/thum-small'">
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="productName"
                                label="商品名称"
                                width="150"
                            />
                            <el-table-column
                                prop="price"
                                label="价格（元）"
                                width="80"
                            />
                            <el-table-column
                                label="规格"
                                width="80"
                            >
                                <template slot-scope="{ row }">
                                    {{ row.skuCode1Name + (row.skuCode2Name ? `/${row.skuCode2Name}` : '') }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="核销时间"
                                width="450"
                            >
                                <template slot-scope="{ row }">
                                    <date-range
                                        v-if="row.productType !== 'PHYSICAL_GOODS' && !readonly"
                                        type="date"
                                        disable-before
                                        start-label=""
                                        end-label=""
                                        clearable
                                        :init="row.validityPeriodStart && row.validityPeriodEnd ? [row.validityPeriodStart, row.validityPeriodEnd] : []"
                                        @change="date => setProDate(date, row)"
                                    />

                                    <p v-else-if="row.productType !== 'PHYSICAL_GOODS'">
                                        {{ row.validityPeriodStart }} ~ {{ row.validityPeriodEnd }}
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="最小购买数量"
                                :width="readonly ? '': 200 "
                            >
                                <template slot-scope="{ row }">
                                    <el-input-number
                                        v-if="!readonly"
                                        :value="row.count"
                                        :min="1"
                                        :max="99999"
                                        @change="val => countChange(val, row)"
                                    />
                                    <span v-else v-text="row.count" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                v-if="!readonly"
                                label="操作"
                                align="right"
                                header-align="right"
                            >
                                <template slot-scope="{ row }">
                                    <el-button
                                        type="text"
                                        size="mini"

                                        :disabled="status === 1"
                                        @click="removePro(row)"
                                    >
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 知识课程列表 -->
                        <el-table
                            ref="courseTable"
                            :class="$style.prodTable"
                            v-if="selectedCourseList.length"
                            :data="selectedCourseList"
                        >
                            <el-table-column
                                width="100"
                                fixed
                            >
                                <template slot-scope="{ row }">
                                    <img v-img-error width="71" height="48" :src="(row.image || row.productImage) + '?x-oss-process=style/thum-small'">
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="productName"
                                label="知识课程名称"
                                width="150"
                            />
                            <el-table-column
                                width="100"
                                label="类型"
                            >
                                <template #default="{ row }">
                                    {{ row.productType==='KNOWLEDGE_COURSE' ? '视频课程' : '系列课' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="price"
                                label="价格（元）"
                                :width="readonly ? '': 810 "
                            />
                            <el-table-column
                                v-if="!readonly"
                                label="操作"
                                align="right"
                                header-align="right"
                            >
                                <template slot-scope="{ row }">
                                    <el-button
                                        type="text"
                                        size="mini"

                                        :disabled="status === 1"
                                        @click="removePro(row)"
                                    >
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>

                <el-form-item label="组合购买折扣:" prop="discount">
                    <span v-if="readonly" :class="$style.readonlyValue" v-text="model.discount" />
                    <el-input-number
                        v-else
                        v-model="model.discount"
                        :precision="1"
                        :max="9.9"
                        :step="1"
                        :min="1"
                        placeholder="请输入折扣"
                        :disabled="model.id && status === 1"
                        style="width: 130px;"
                    />
                    折
                    <span class="gray-3">（该活动页组合下单，将以该折扣价结算）</span>
                </el-form-item>

                <el-form-item label="组合库存:" prop="stock">
                    <el-input-number
                        v-if="!readonly"
                        v-model.number="model.stock"
                        :min="model.id && status === 1 ? 0 : 1"
                        :max="99999"
                        :precision="0"
                    />
                    <span :class="$style.readonlyValue" v-else v-text="model.stock" /> 组
                    <span class="gray-3">（该库存独立于商品库存，商品库存售罄不影响活动库存）</span>
                </el-form-item>

                <el-form-item label="附赠礼品:" prop="giftModelList">
                    <div>
                        <div v-if="!readonly">
                            <el-checkbox
                                v-model="model.haveGift"
                                :true-label="1"
                                :false-label="0"
                            >
                                <span class="fz-12">增加礼品</span>
                            </el-checkbox>
                            <span class="fz-12">（打开该选项，该组合订单支付成功后附赠礼品券，线下兑换）</span>
                        </div>
                        <div class="mt-10" v-if="!readonly && model.haveGift">
                            <el-button type="primary" plain @click="showAddPresent = true" :disabled="model.giftModelList.length >= MAX_GIFT_LENGTH">
                                添加礼品
                            </el-button>
                            <el-button type="primary" plain @click="showCouponBox = true" :disabled="model.giftModelList.length >= MAX_GIFT_LENGTH">
                                添加优惠券
                            </el-button>
                            <span class="gray-3" style="margin-left: 8px">{{ `${model.giftModelList.length}/${MAX_GIFT_LENGTH}` }}</span>
                            <span class="gray-3">（最多可设置{{ MAX_GIFT_LENGTH }}个奖品，只要支付成功均会获得以下设置奖品各一份）</span>
                        </div>
                        <!-- 礼品列表 -->
                        <el-table
                            v-if="model.haveGift && selectedPresentList.length"
                            :class="$style.table"
                            :data="selectedPresentList"
                        >
                            <el-table-column label="礼品名称" prop="giftName" />

                            <el-table-column label="兑换时间">
                                <template #default="{ row }">
                                    <span>{{ row.useStartTime | dateFormat('YYYY-MM-DD') }}</span>
                                    <br>
                                    <span>{{ row.useEndTime | dateFormat('YYYY-MM-DD') }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column :label="status === 1 ? '剩余库存' : '库存数量'">
                                <template #default="{ row }">
                                    <span v-if="readonly" v-text="row.stock" />
                                    <!--
                    最小库存限制，
                    如果是编辑活动，且活动处于进行中，且是原来存在的礼品，最小库存可以为0
                   -->
                                    <el-input-number
                                        v-else
                                        v-model="row.stock"
                                        :min="row.giftId && status === 1 ? 0 : 1"
                                        :max="99999"
                                        :precision="0"
                                    />
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="!readonly"
                                label="操作"
                                align="right"
                                header-align="right"
                                width="120"
                            >
                                <template #default="scope">
                                    <!-- <template v-if="!scope.row.giftId"> -->
                                    <el-button
                                        type="text"
                                        size="mini"

                                        @click="editPresent(scope.row, scope.$index)"
                                    >
                                        编辑
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"

                                        @click="removePresent(scope.row)"
                                    >
                                        删除
                                    </el-button>
                                    <!-- </template> -->
                                </template>
                            </el-table-column>
                        </el-table>
                        <span v-else-if="readonly && !model.haveGift">无</span>
                        <!-- 优惠券列表 -->
                        <el-table
                            v-if="model.haveGift && selectedConponList.length"
                            :class="$style.table"
                            :data="selectedConponList"
                        >
                            <el-table-column
                                prop="giftName"
                                label="优惠券名称"
                            />
                            <el-table-column
                                prop="amount"
                                label="优惠券金额（元）"
                            />
                            <el-table-column :label="status === 1 ? '剩余库存' : '库存数量'">
                                <template #default="{ row }">
                                    <span v-if="readonly" v-text="row.stock" />
                                    <el-input-number
                                        v-else
                                        v-model="row.stock"
                                        :min="row.giftId && status === 1 ? 0 : 1"
                                        :max="99999"
                                        :precision="0"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                v-if="!readonly"
                                label="操作"
                                align="right"
                                header-align="right"
                                width="80"
                            >
                                <template slot-scope="{ row }">
                                    <el-button
                                        type="text"
                                        size="mini"

                                        @click="removePresent(row)"
                                    >
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <!-- 添加商品组件 -->
        <ProductSelector
            :visible.sync="showProductBox"
            :max-select="maxGoodsNum"
            :default-selected="model.productModelList"
            @confirm="selectProduct"
        />
        <!-- 添加知识课程 当前仅支持添加上架状态的单课 -->
        <model-course
            status="1"
            :show.sync="showCourseBox"
            :max-select="maxGoodsNum"
            :default-selected="model.productModelList"
            @confirm="selectCourse"
        />
        <!-- 添加礼品组件 -->
        <EditPresent
            :show.sync="showAddPresent"
            :init-date="[]"
            :start-min-date="model.startTime || 0"
            :end-min-date="model.endTime || 0"
            :gift-detail.sync="editPresentData"
            date-type="date"
            @confirm="addPresent"
        />
        <!-- 添加优惠券 -->
        <model-coupon
            :show.sync="showCouponBox"
            title="优惠券"
            hide-status
            status="4"
            :max-select="maxCouponLength()"
            :default-selected="defaultCoupon()"
            @confirm="addCoupon"
        />
    </div>
</template>

<script>
import moment from 'moment'
import ImageManager from '../../../../../components/file/Image-Manager.vue'
import ProductSelector from '../../../../../components/product-center/goods/Product-Sku-Selector.vue'
import EditPresent from '../../../../../components/common/Edit-Present.vue'
import ModelCourse from '../../../components/Modal-Course.vue'
import ModelCoupon from '../../../components/Modal-Coupon.vue'
import { checkNumber } from '../../../../../assets/ts/validate'

export default {
    name: 'Combination',
    components: {
        ImageManager,
        ProductSelector,
        EditPresent,
        ModelCourse,
        ModelCoupon
    },
    props: {
        readonly: Boolean,
        status: {
            type: Number,
            default: -1 // 0：未开始 1：进行中 2：已结束
        },

        /**
     * 数据模块,表示单个组合对象
     * name {string}              组合名字
     * imageUrl {string}          封面图
     * startTime {string}         开始时间
     * endTime {string}           结束时间
     * productModelList {array}   商品列表
     * discount {number}          折扣
     * stock {number}             库存
     * haveGift {number}          附赠礼品：0 无礼品 1 有礼品
     * giftModelList {array}      礼品列表
     */
        model: {
            type: Object,
            default () {
                return null
            }
        },
        // 序号
        index: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        const checkPresent = (rule, value, callBack) => {
            if (this.model.haveGift && !value.length) {
                callBack(new Error('请添加礼品'))
            } else {
                const activityStartTime = moment(this.model.startTime).valueOf()
                const activityEndTime = moment(this.model.endTime).valueOf()

                for (const item of value) {
                    // 优惠券
                    if (item.giftType === 0) {
                        const useStartTime = moment(item.useStartTime).valueOf()
                        const useEndTime = moment(item.useEndTime).valueOf()

                        if (useStartTime > activityEndTime) {
                            return callBack(new Error(`优惠券开始使用时间不能晚于活动结束时间${ this.model.endTime }`))
                        }
                        if (useEndTime < activityStartTime) {
                            return callBack(new Error(`优惠券结束使用时间不能早于活动开始时间${ this.model.startTime }`))
                        }
                    }
                    // 礼品
                    if (item.giftType === 1) {
                        const useStartTime = moment(item.useStartTime).valueOf()
                        const useEndTime = moment(item.useEndTime).valueOf()

                        if (useStartTime < activityStartTime) {
                            return callBack(new Error(`礼品开始兑换时间不能早于活动开始时间${ this.model.startTime }`))
                        }
                        if (useEndTime < activityEndTime) {
                            return callBack(new Error(`礼品结束使用时间不能早于活动结束时间${ this.model.endTime }`))
                        }
                    }
                }
                callBack()
            }
        }
        // 检查商品和商品的核销时间
        const checkProducts = (rule, value, callBack) => {
            if (!value.length) {
                callBack(new Error('请添加商品'))
            } else {
                const errors = [] // 记录错误次数
                for (const prod of value) {
                    if (prod.productType === 'KNOWLEDGE_COURSE' || prod.productType === 'SERIES_OF_COURSE') {
                        continue
                    }
                    if (prod.productType !== 'PHYSICAL_GOODS') {
                        const activityEnd = moment(this.model.endTime).valueOf()
                        const prodEnd = moment(prod.validityPeriodEnd).valueOf()
                        prod.error = false
                        if (!prod.validityPeriodEnd) {
                            callBack(new Error('请填写核销时间'))
                            prod.error = true
                            errors.push(1)
                        }
                        if (prodEnd < activityEnd) {
                            callBack(new Error(`核销结束时间不能早于活动结束时间${ this.model.endTime }`))
                            prod.error = true
                            errors.push(1)
                        }
                    }
                }
                // 没有错误时，执行正确
                if (!errors.length) {
                    value.map(item => delete item.error)
                    callBack()
                }
            }
        }
        const checkDate = (rule, value, callBack) => {
            const startVal = moment(this.model.startTime).valueOf()
            const now = Date.now()
            const startDay = moment(this.model.startTime).format('YYYY-DD-MM')
            if (startVal < now && startDay !== moment().format('YYYY-DD-MM') && this.status !== 1) {
                callBack(new Error('活动开始时间不得小于当前时间'))
            } else {
                callBack()
            }
        }

        return {
            maxGoodsNum: 20,
            MAX_GIFT_LENGTH: 20,
            showProductBox: false,
            showCourseBox: false,
            showAddPresent: false,
            showCouponBox: false,
            productList: new Map(),
            imageList: [],
            defaultDate: [],
            // initValidityPeriod: [],
            editPresentData: null,
            editPresentIndex: null,
            rules: {
                imageUrl: [{ required: true, message: '请上传封面' }],
                stock: [
                    { required: true, message: '请输入库存', trigger: 'blur' },
                    { validator: checkNumber(99999, this.status === 1 ? 0 : 1, 0), trigger: 'blur' }
                ],
                endTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' },
                    { validator: checkDate, trigger: 'blur' }
                ],
                discount: [
                    { required: true, message: '请输入折扣', trigger: 'blur' },
                    { validator: checkNumber(9.9, 1, 1), trigger: 'blur' }
                ],
                productModelList: [{ validator: checkProducts, trigger: 'none' }],
                giftModelList: [{ validator: checkPresent, trigger: 'blur' }]
            },
            getRowKeys (row) {
                return row.id
            }
        }
    },
    computed: {
        selectedProductList () {
            if (!this.model.productModelList.length) {
                return []
            }
            return this.model.productModelList.filter(item => item.productType && item.productType !== 'KNOWLEDGE_COURSE' && item.productType !== 'SERIES_OF_COURSE')
        },
        selectedCourseList () {
            if (!this.model.productModelList.length) {
                return []
            }
            return this.model.productModelList.filter(item => item.productType && (item.productType === 'KNOWLEDGE_COURSE' || item.productType === 'SERIES_OF_COURSE'))
        },
        selectedPresentList () {
            if (!this.model.giftModelList.length) {
                return []
            }
            return this.model.giftModelList.filter(item => item.giftType && item.giftType === 1)
        },
        selectedConponList () {
            if (!this.model.giftModelList.length) {
                return []
            }
            return this.model.giftModelList.filter(item => item.giftType === 0)
        }
    },
    watch: {
        imageList (val) {
            this.model.imageUrl = val[0] || ''
            this.$refs.form.clearValidate('imageUrl')
        }
    },
    methods: {
        init () {
            for (const item of this.model.productModelList) {
                if (item.productType && item.productType !== 'KNOWLEDGE_COURSE' && item.productType !== 'SERIES_OF_COURSE') {
                    this.productList.set(item.skuCode1 + item.skuCode2, item)
                }
                if (item.productType && (item.productType === 'KNOWLEDGE_COURSE' || item.productType === 'SERIES_OF_COURSE')) {
                    this.productList.set(item.productId, item)
                }
            }
            this.imageList = this.model.imageUrl ? [this.model.imageUrl] : []
            if (this.model.startTime && this.model.endTime) {
                this.defaultDate = [this.model.startTime, this.model.endTime]
            }
            // this.initValidityPeriod = []
        },
        async dateChange ({ start = '', end = '' }) {
            this.model.startTime = start
            this.model.endTime = end
            if (this.$refs.form) {
                this.$refs.form.validateField('productModelList')
            }
            // this.initValidityPeriod = []
        },
        selectProduct (data = []) {
            data = data.map(item => ({
                productId: item.productId, // 商品ID
                productName: item.productName, // 商品名称
                skuCode1: item.skuCode1, // SKU_1主键
                skuCode1Name: item.skuCode1Name, // 规格名称1
                skuCode2: item.skuCode2, // SKU_2主键
                skuCode2Name: item.skuCode2Name, // 规格名称2
                price: item.price, // 现价
                productType: item.productType, // 类型
                count: 1, // 商品数量
                image: item.skuImage || item.image,
                validityPeriodStart: '',
                validityPeriodEnd: '',

                /**
         * 用来标记哪个商品存在错误状态
         * 原因: 当父级el-form-item组件处于错误状态时，它内部的表单组件都会受其影响，变成红色，
         * 为了解决这个问题，所以给每个商品的核销时间（date-range）组件添加class "no-error"，
         * class "no-error" 受 error 控制，当error为false时，"no-error" 生效，将强制改变输入框边框颜色
         */
                error: false
            }))
            // 存入商品Map集合，以sku为key，不必担心商品重复
            for (const prod of data) {
                // 如果新选择的商品已存在于productList中，则获取核销时间复制给新选择的商品，
                if (!this.productList.get(prod.skuCode1 + prod.skuCode2)) {
                    this.productList.set(prod.skuCode1 + prod.skuCode2, prod)
                }
            }
            // 删除取消选中的商品
            for (const [key, value] of this.productList.entries()) {
                if (value.productType === 'KNOWLEDGE_COURSE' || value.productType === 'SERIES_OF_COURSE') continue
                if (data.findIndex(prod => prod.skuCode1 + prod.skuCode2 === key) === -1) {
                    this.productList.delete(key)
                }
            }
            this.model.productModelList = Array.from(this.productList.values()).slice(0, this.maxGoodsNum)
            this.$refs.form.clearValidate()
        },
        selectCourse (data = []) {
            data = data.map(item => ({
                productId: item.id, // 商品ID
                productName: item.courseName, // 商品名称
                skuCode1: '', // SKU_1主键
                skuCode1Name: '', // 规格名称1
                skuCode2: '', // SKU_2主键
                skuCode2Name: '', // 规格名称2
                price: item.sellingPrice, // 现价
                productType: item.courseType === 1 ? 'KNOWLEDGE_COURSE' : 'SERIES_OF_COURSE', // 类型
                count: 1, // 商品数量
                image: item.courseImg,
                validityPeriodStart: '',
                validityPeriodEnd: ''
            }))
            for (const prod of data) {
                if (!this.productList.get(prod.productId)) {
                    this.productList.set(prod.productId, prod)
                }
            }
            // 删除取消选中的课程
            for (const [key, value] of this.productList.entries()) {
                if (value.productType !== 'KNOWLEDGE_COURSE' && value.productType !== 'SERIES_OF_COURSE') continue
                if (data.findIndex(prod => prod.productId === key) === -1) {
                    this.productList.delete(key)
                }
            }
            this.model.productModelList = Array.from(this.productList.values()).slice(0, this.maxGoodsNum)
            this.$refs.form.clearValidate()
        },
        // 设置最小购买量
        countChange (val, item) {
            item.count = Number.parseInt(val) || 1
        },
        // 设置商品核销时间
        setProDate ({ start = '', end = '' }, prod) {
            prod.validityPeriodStart = start
            prod.validityPeriodEnd = end
        },
        addProduct (show) {
            // if (!this.model.endTime) {
            //   this.$warning('请先选择组合活动时间')
            //   return
            // }
            this[show] = true
        },
        async removePro (item) {
            try {
                await this.$confirm('您确定移除吗？')
                const index = this.model.productModelList.findIndex(prod => (prod.productId === item.productId))
                if (index > -1) {
                    this.model.productModelList.splice(index, 1)
                    const key = item.productType === 'KNOWLEDGE_COURSE' || item.productType === 'SERIES_OF_COURSE' ? item.productId : item.skuCode1 + item.skuCode2
                    this.productList.delete(key)
                }
            } catch (error) {
                throw error
            }
        },
        addPresent (data) {
            data = data.giftDetail
            if (this.editPresentData) {
                // 编辑
                this.model.giftModelList.splice(this.editPresentIndex, 1, {
                    giftType: 1,
                    giftId: data.id || '',
                    giftName: data.giftName,
                    giftBrief: data.giftBrief,
                    giftImage: data.giftImage,
                    stock: data.stock,
                    useStartTime: data.useStartTime,
                    useEndTime: data.useEndTime
                })
                this.editPresentData = null
            } else {
                // 新增
                this.model.giftModelList.push({
                    giftType: 1,
                    giftId: data.id || '',
                    giftName: data.giftName,
                    giftBrief: data.giftBrief,
                    giftImage: data.giftImage,
                    stock: data.stock,
                    useStartTime: data.useStartTime,
                    useEndTime: data.useEndTime
                })
            }
            this.$refs.form.clearValidate()
        },
        editPresent (data, index) {
            this.editPresentData = {
                id: data.id || '',
                giftName: data.giftName,
                giftBrief: data.giftBrief,
                giftImage: data.giftImage,
                stock: data.stock,
                useStartTime: data.useStartTime,
                useEndTime: data.useEndTime
            }
            this.editPresentIndex = index
            this.showAddPresent = true
        },
        async removePresent (item) {
            try {
                await this.$confirm('您确定移除吗？')
                const index = this.model.giftModelList.findIndex(present => item.giftType === 1 ? (present.giftId === item.giftId) : (present.couponId === item.couponId))
                if (index > -1) {
                    this.model.giftModelList.splice(index, 1)
                }
                if (!this.model.giftModelList.length) {
                    this.model.haveGift = 0
                }
            } catch (error) {
                throw error
            }
        },
        maxCouponLength () {
            const currentGiftLength = this.model.giftModelList.filter(item => item.giftType === 1).length
            return this.MAX_GIFT_LENGTH - currentGiftLength
        },
        defaultCoupon () {
            return this.model.giftModelList.filter(item => item.giftType === 0)
        },
        addCoupon (data = []) {
            this.model.giftModelList = this.model.giftModelList.filter(item => item.giftType === 1)
            for (const item of data) {
                this.model.giftModelList.push({
                    giftType: 0,
                    couponId: item.id,
                    giftName: item.couponName,
                    amount: item.amount,
                    giftBrief: item.brief,
                    giftImage: '',
                    stock: 1,
                    useStartTime: item.useStartTime,
                    useEndTime: item.useEndTime
                })
            }
            this.$refs.form.clearValidate()
        },
        async validateForm () {
            try {
                await this.$refs.form.validate()
                return true
            } catch (e) {
                this.$error('信息填写有误，请检查')
                return false
            }
        }
    }
}
</script>

<style module lang="scss">
.combination {
    position: relative;
    // width: 856px;
    margin-bottom: 20px;
    // border: 1px solid #ccc;
}
.prod-table {
    margin-bottom: 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
}
.table {
    margin-top: 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
}
img.readonly-value {
    width: 107px;
    height: 72px;
    object-fit: cover;
}
span.readonly-value {
    font-size: 12px;
    font-weight: bold;
}
.remove-pro {
    position: absolute;
    right: 0;
}
.price {
    color: #ec742e;
    font-weight: bold;
}

</style>
<style scoped lang="scss">
.readonly {
    ::v-deep .el-form-item__label {
        font-size: 14px !important;
        color: #999;
    }
}

</style>
