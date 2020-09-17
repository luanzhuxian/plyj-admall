<template>
    <div
        :class="{ [$style.combination]: true, readonly}"
    >
        <div :class="$style.name">
            <span>组合{{ index + 1 }}</span>
            <div>
                <template v-if="showHide || !model.status || !model.id">
                    <span class="gray-3 mr-10" v-text="model.status ? '开启' : '隐藏'" />
                    <el-tooltip class="item" effect="dark" content="隐藏后用户将不可见" placement="top-start" :disabled="!model.status">
                        <el-switch
                            v-if="!readonly"
                            v-model="model.status"
                            :active-value="1"
                            :inactive-value="0"
                            style="margin-top: -2px"
                        />
                    </el-tooltip>
                </template>
                <el-button class="ml-20" v-if="!readonly && status !== 1 || !model.id" type="text" @click="remove">
                    移除
                </el-button>
            </div>
        </div>

        <div :class="$style.content">
            <el-form
                label-width="136px"
                label-position="left"
                :model="model"
                :rules="rules"
                ref="form"
            >
                <el-form-item label="组合名:" prop="name">
                    <span v-if="readonly" :class="$style.readonlyValue" v-text="model.name" />
                    <el-input v-else style="width: 320px;" v-model="model.name" clearable />
                </el-form-item>

                <el-form-item label="封面图:" prop="imageUrl">
                    <img v-if="readonly" v-viewer :src="model.imageUrl" alt="" :class="$style.readonlyValue">
                    <ImageManager
                        v-else
                        :width="750"
                        :height="500"
                        :box-width="100"
                        :box-height="67"
                        need-edit
                        :count="1"
                        v-model="imageList"
                    />
                </el-form-item>

                <el-form-item label="组合活动时间:" prop="endTime">
                    <span v-if="readonly" :class="$style.readonlyValue">{{ model.startTime }}~{{ model.endTime }}</span>
                    <date-range
                        v-else
                        :init="defaultDate"
                        @change="dateChange"
                        disable-before
                        clearable
                        :disabled-start-time="model.id && status === 1"
                    />
                </el-form-item>

                <el-form-item label="组合商品:" prop="productModelList">
                    <div>
                        <div v-if="!readonly">
                            <el-button type="primary" plain @click="addProduct" :disabled="model.productModelList.length >= 6 || status === 1">
                                添加商品/课程 ({{ model.productModelList.length }})
                            </el-button>
                            <span class="gray-3">（最多添加6个商品，该商品下仅选中的规格可组合价购买）</span>
                        </div>
                        <!-- 商品列表 -->
                        <div :class="$style.productList">
                            <div
                                v-for="(item, i) of model.productModelList"
                                :class="{
                                    [$style.proItem]: true,
                                    [$style.noError]: !item.error
                                }"
                                :key="i"
                            >
                                <img :src="item.productImage + '?x-oss-process=style/thum-small'" alt="">
                                <div :class="$style.proRight">
                                    <span :class="$style.proName" v-text="item.productName" />
                                    <div>
                                        <p :class="$style.proSku">
                                            <span v-text="item.skuCode1Name" />
                                            <template v-if="item.skuCode2Name">
                                                <span>/</span>
                                                <span v-text="item.skuCode2Name" />
                                            </template>
                                        </p>

                                        <p class="gray-3">
                                            该组合包含的最小购买量
                                            <el-input-number
                                                v-if="!readonly"
                                                @change="val => countChange(val, item, i)"
                                                :value="item.count"
                                                :min="1"
                                                :max="99999"
                                                :class="$style.proCount"
                                            />
                                            <span v-else v-text="item.count" />
                                            个
                                        </p>

                                        <date-range
                                            :init="[item.validityPeriodStart, item.validityPeriodEnd]"
                                            v-if="item.productType !== 'PHYSICAL_GOODS' && !readonly"
                                            disable-before
                                            class="mt-10"
                                            start-label="核销时间"
                                            end-label=""
                                            type="date"
                                            @change="date => setProDate(date, item)"
                                            clearable
                                        />

                                        <p v-else-if="item.productType !== 'PHYSICAL_GOODS'" :class="$style.proSku">
                                            核销时间：{{ item.validityPeriodStart }} ~ {{ item.validityPeriodEnd }}
                                        </p>
                                    </div>
                                    <span :class="$style.price" v-text="'￥' + item.price" />
                                    <el-button
                                        v-if="isCopy ? true : (!readonly && !item.id)"
                                        :class="$style.removePro"
                                        type="text"
                                        :disabled="status === 1"
                                        @click="removePro(item, i)"
                                    >
                                        移除
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="组合购买折扣:" prop="discount">
                    <span v-if="readonly" :class="$style.readonlyValue" v-text="model.discount" />
                    <el-input
                        v-else
                        type="number"
                        style="width: 80px;"
                        v-model.trim.number="model.discount"
                        :disabled="model.id && status === 1"
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
                                :disabled="model.id && status === 1"
                            >
                                <span class="fz-12">增加礼品</span>
                            </el-checkbox>
                            <span class="fz-12">（打开该选项，该组合订单支付成功后附赠礼品券，线下兑换）</span>
                        </div>
                        <el-table
                            v-if="model.haveGift"
                            :class="$style.table"
                            :data="model.giftModelList"
                        >
                            <el-table-column label="礼品名称" prop="giftName" />
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
                                        :min="row.id && status === 1 ? 0 : 1"
                                        :max="99999"
                                        :precision="0"
                                    />
                                </template>
                            </el-table-column>

                            <el-table-column label="兑换时间" width="170">
                                <template #default="{ row }">
                                    <span>{{ row.useStartTime | dateFormat('YYYY-MM-DD') }}</span>
                                    <br>
                                    <span>{{ row.useEndTime | dateFormat('YYYY-MM-DD') }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="!readonly"
                                label="操作"
                                align="right"
                                header-align="right"
                                width="80"
                            >
                                <template #default="{ row, $index }">
                                    <template v-if="isCopy ? true : !row.id">
                                        <el-button
                                            type="text"
                                            @click="editPresent(row, $index)"
                                        >
                                            编辑
                                        </el-button>
                                        <el-button
                                            type="text"
                                            @click="removePresent($index)"
                                        >
                                            删除
                                        </el-button>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>
                        <span v-else-if="readonly">无</span>
                        <div class="mt-10" v-if="!readonly && model.haveGift && model.giftModelList.length < 6">
                            <el-button
                                type="text"
                                :disabled="status === 1"
                                @click="showAddPresent = true"
                            >
                                添加礼品
                            </el-button>
                            <span class="gray-3">（最多可设置6个奖品，只要支付成功均会获得以下设置奖品各一份）</span>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <!-- 添加商品组件 -->
        <ProductSelector
            :visible.sync="showProductBox"
            @confirm="selectProduct"
            :max-select="6"
            :default-selected="model.productModelList"
        />

        <!-- 添加礼品组件 -->
        <EditPresent
            :show.sync="showAddPresent"
            :init-date="[new Date(), '2020-12-31 23:59:59']"
            @confirm="addPresent"
            :end-min-date="model.endTime || 0"
            :gift-detail.sync="editPresentData"
            date-type="date"
        />
    </div>
</template>

<script>
import moment from 'moment'
import ImageManager from '../../../../../../components/file/Image-Manager.vue'
import ProductSelector from '../../../../../../components/goods/Product-Sku-Selector.vue'
import EditPresent from '../../../../../../components/common/Edit-Present.vue'
import { checkNumber } from '../../../../../../assets/ts/validate'
export default {
    name: 'Combination',
    components: {
        ImageManager,
        ProductSelector,
        EditPresent
    },
    props: {
        isCopy: Boolean,
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
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        // 检查商品和商品的核销时间
        const checkProducts = (rule, value, callBack) => {
            if (!value.length) {
                callBack(new Error('请添加商品'))
            } else {
                const errors = [] // 记录错误次数
                for (const pro of value) {
                    if (pro.productType !== 'PHYSICAL_GOODS') {
                        const activityEnd = moment(this.model.endTime).valueOf()
                        const proEnd = moment(pro.validityPeriodEnd).valueOf()
                        pro.error = false
                        if (!pro.validityPeriodEnd) {
                            callBack(new Error('请填写核销时间'))
                            pro.error = true
                            errors.push(1)
                        }
                        if (proEnd < activityEnd) {
                            callBack(new Error(`核销结束时间不能早于活动结束时间${ this.model.endTime }`))
                            pro.error = true
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
            showAddPresent: false,
            showProductBox: false,
            productList: new Map(),
            imageList: [],
            editPresentData: null,
            editPresentIndex: null,
            rules: {
                name: [{ required: true, message: '请输入组合名称', trigger: 'blur' }],
                imageUrl: [{ required: true, message: '请上传封面' }],
                stock: [
                    { required: true, message: '请输入库存', trigger: 'blur' },
                    { validator: checkNumber(99999, this.status === 1 ? 0 : 1, 0), trigger: 'blur' }
                ],
                giftModelList: [{ validator: checkPresent, message: '请添加礼品', trigger: 'blur' }],
                endTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' },
                    { validator: checkDate, trigger: 'blur' }
                ],
                discount: [
                    { required: true, message: '请输入折扣', trigger: 'blur' },
                    { validator: checkNumber(9.9, 1, 1), trigger: 'blur' }
                ],
                productModelList: [{ validator: checkProducts, trigger: 'none' }]
            }
            // initValidityPeriod: []
        }
    },
    watch: {
        imageList (val) {
            this.model.imageUrl = val[0] || ''
            this.$refs.form.clearValidate('imageUrl')
        }
    },
    computed: {
    // 是否显示隐藏按钮
        showHide () {
            if (this.list.length < 2) {
                return false
            }
            return this.list.filter(item => item.status === 1 && item.id).length > 1
        },
        defaultDate () {
            return this.model.startTime ? [this.model.startTime, this.model.endTime] : ['', '']
        }
    },
    created () {
        for (const pro of this.model.productModelList) {
            this.productList.set(pro.skuCode1 + pro.skuCode2, pro)
        }
        this.imageList = this.model.imageUrl ? [this.model.imageUrl] : []
    },
    methods: {
        selectProduct (data = []) {
            data = data.map(item => {
                const pro = this.productList.get(item.skuCode1 + item.skuCode2) || {}
                return {
                    productId: item.productId, // 商品ID
                    productName: item.productName, // 商品名称
                    skuCode1: item.skuCode1, // SKU_1主键
                    skuCode1Name: item.skuCode1Name, // 规格名称1
                    skuCode2: item.skuCode2, // SKU_2主键
                    skuCode2Name: item.skuCode2Name, // 规格名称2
                    price: item.price, // 现价
                    productType: item.productType, // 类型
                    count: pro.count || 1, // 商品数量
                    productImage: item.skuImage || item.image || item.productImage,
                    validityPeriodStart: this.model.startTime,
                    validityPeriodEnd: this.model.endTime,

                    /**
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
        validityPeriodStart: this.model.startTime,
        validityPeriodEnd: this.model.endTime,
        /**
         * 用来标记哪个商品存在错误状态
         * 原因: 当父级el-form-item组件处于错误状态时，它内部的表单组件都会受其影响，变成红色，
         * 为了解决这个问题，所以给每个商品的核销时间（date-range）组件添加class "no-error"，
         * class "no-error" 受 error 控制，当error为false时，"no-error" 生效，将强制改变输入框边框颜色
         */
                    error: false
                }
            })
            // 存入商品Map集合，以sku为key，不必担心商品重复
            for (const pro of data) {
                // 如果新选择的商品已存在于productList中，则获取核销时间复制给新选择的商品，
                const oldPro = this.productList.get(pro.skuCode1 + pro.skuCode2)
                if (!oldPro) {
                    this.productList.set(pro.skuCode1 + pro.skuCode2, pro)
                }
                // if (oldPro) {
                // pro.validityPeriodStart = oldPro.validityPeriodStart
                // pro.validityPeriodEnd = oldPro.validityPeriodEnd
                // pro.id = oldPro.id
                // Object.assign(oldPro, pro)
                // }
                // Object.assign(oldPro, pro)
            }
            // this.model.productModelList = Array.from(this.productList.values()).slice(0, 6)
            this.model.productModelList = data
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
        },
        async dateChange ({ start, end }) {
            this.model.startTime = start || ''
            this.model.endTime = end || ''
            if (this.$refs.form) {
                this.$refs.form.validateField('productModelList')
            }
            // this.initValidityPeriod = [this.model.startTime, '2020-12-31 23:59:59']
        },
        remove (e) {
            this.$confirm('您确定移除该组合吗')
                .then(() => {
                    this.$emit('remove', e)
                })
        },
        removePresent (index) {
            this.$confirm('您确定移除该礼品吗')
                .then(() => {
                    /* eslint-disable vue/no-mutating-props */
                    this.model.giftModelList.splice(index, 1)
                    if (!this.model.giftModelList.length) {
                        this.model.haveGift = 0
                    }
                })
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
        async validateForm () {
            try {
                await this.$refs.form.validate()
                return true
            } catch (e) {
                this.$error(`组合${ this.index + 1 }填写有误，请检查`)
                return false
            }
        },
        countChange (val, item) {
            item.count = Number.parseInt(val) || 1
        },
        removePro (item, index) {
            this.model.productModelList.splice(index, 1)
            this.productList.delete(item.skuCode1 + item.skuCode2)
        },
        // 设置商品核销时间
        setProDate ({ start, end }, pro) {
            pro.validityPeriodStart = start || ''
            pro.validityPeriodEnd = end || ''
        },
        addProduct () {
            if (!this.model.endTime) {
                this.$warning('请先选择组合活动时间')
                return
            }
            this.showProductBox = true
        }
    }
}
</script>

<style module lang="scss">
.combination {
    position: relative;
    width: 856px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
}
.name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    font-size: 12px;
    font-weight: bold;
    line-height: 36px;
    background-color: #fbfbfb;
    border-bottom: 1px solid #ccc;
}
.content {
    padding: 20px 24px;
    background-color: #fff;
}
.table {
    margin-top: 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
}
.product-list {
    > .pro-item {
        display: flex;
        align-items: center;
        width: 650px;
        margin-top: 10px;
        padding: 7px;
        background-color: #f7f7f7;
        font-size: 0;
        box-sizing: border-box;
        &.no-error {
            input {
                border-color: #dcdfe6 !important;
            }
        }
        .pro-count {
            input {
                border-color: #dcdfe6 !important;
            }
        }
        > img {
            width: 82px;
            height: 82px;
            object-fit: cover;
        }
        > .pro-right {
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            margin-left: 14px;
            padding: 7px 0;
            color: #666;
            font-size: 14px;
            line-height: 20px;
            > span {
                @include elps-wrap(1);
            }
            > .pro-name {
                width: 500px;
                @include elps();
            }
        }
        .pro-sku {
            color: #999;
        }
    }
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
