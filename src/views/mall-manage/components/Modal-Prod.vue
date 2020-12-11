<template>
    <el-dialog
        class="modal-product"
        :class="$style.modalProduct"
        :title="title"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="show"
        @close="close"
    >
        <template>
            <div :class="$style.searchGroup">
                <div :class="$style.searchGroupInput">
                    <el-input
                        v-model.trim="searchValue"
                        type="text"
                        clearable
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="search"
                        @clear="search"
                    />
                    <el-button round type="primary" @click="search">
                        查询
                    </el-button>
                </div>
                <i class="el-icon-refresh" @click="refresh" />
            </div>
            <CustomTable
                ref="productTable"
                v-if="show"
                :data="productList"
                :options="options"
                selection-type="checkbox"
                :default-checkbox="defaultCheckbox"
                :selected-list="selectedList"
                :is-checkbox-selectable="checker"
                @update-checkbox="onCheckboxChange"
            />
            <Pagination
                v-model="pagination.current"
                :total="pagination.total"
                :size="pagination.size"
                @change="onPageChange"
            />
            <div :class="$style.btnGroup">
                <el-button type="primary" @click="confirm" round>
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CustomTable from './Custom-Table.vue'
import { modalTitleMap, ModalType, ProductStatus } from '../utils/map'
import { getGoods } from '../../../apis/product-center/goods'
import {
    getCoupon,
    getPintuan,
    getYugou,
    getMiaosha,
    getDistribution,
    getImageTextList
} from '../../../apis/mall'
import { getSpringPloughingList } from '../../../apis/marketing-manage/new-year/spring-ploughing'
import { getVideoList } from '../../../apis/product-center/online-teaching/knowledge-course'
import { getRedPackageList } from '../../../apis/marketing-manage/red-package'
import {
    activityTableOptionsProducer,
    couponTableOptions,
    productTableOptions,
    packageTableOptions,
    distributionTableOptions,
    courseTableOptions,
    imageTextTableOptions,
    redPackageTableOptions
} from '../utils/config'
import { fenToYuan } from '../utils/helper'

const productChecker = () => true
const packageChecker = (row: { status: number }) => row.status !== 2
const pintuanChecker = (row: { status: number }) => row.status !== 3
const yugouChecker = (row: { status: number }) => row.status !== 2
const miaoshaChecker = (row: { status: number }) => row.status !== 2
const couponChecker = (row: { status: number }) => row.status !== 0 && row.status !== 3
const courseChecker = (row: { status: number | string }) => row.status !== '2' && row.status !== 2
const redPackageChecker = (row: { activityStatus: number }) => row.activityStatus !== 2 && row.activityStatus !== 3

const statusMap1 = {
    0: '未开始',
    1: '进行中',
    2: '已成功',
    3: '已结束'
}

const statusMap2 = {
    0: '未开始',
    1: '进行中',
    2: '已结束'
}

// 对应模块 id, moduleType
const modalMap: DynamicObject = {
    2: {
        id: 'Product',
        method: '',
        options: productTableOptions,
        checker: productChecker
    },
    3: {
        id: 'Class',
        method: '',
        options: productTableOptions,
        checker: productChecker
    },
    8: {
        id: 'PinTuan',
        method: getPintuan,
        options: activityTableOptionsProducer({
            priceLabel: '拼团单价',
            statusMap: statusMap1
        }),
        checker: pintuanChecker
    },
    9: {
        id: 'Coupon',
        method: getCoupon,
        options: couponTableOptions,
        checker: couponChecker
    },
    10: {
        id: 'MiaoSha',
        method: getMiaosha,
        options: activityTableOptionsProducer({
            priceLabel: '秒杀价',
            statusMap: statusMap2
        }),
        checker: miaoshaChecker
    },
    11: {
        id: 'YuGou',
        method: getYugou,
        options: activityTableOptionsProducer({
            priceLabel: '定金',
            statusMap: statusMap2
        }),
        checker: yugouChecker
    },
    16: {
        id: 'Package',
        method: '',
        options: packageTableOptions,
        checker: packageChecker
    },
    18: {
        id: 'Distribution',
        method: '',
        options: distributionTableOptions,
        checker: packageChecker
    },
    // 单课
    21: {
        id: 'SingleCourse',
        method: '',
        options: courseTableOptions,
        checker: courseChecker
    },
    // 系列课
    22: {
        id: 'SeriesCourse',
        method: '',
        options: courseTableOptions,
        checker: courseChecker
    },
    // 图文资料
    23: {
        id: 'ImageText',
        method: '',
        options: imageTextTableOptions,
        checker: courseChecker
    },
    24: {
        id: 'RedPackage',
        method: '',
        options: redPackageTableOptions,
        checker: redPackageChecker
    }
}

@Component({
    components: { CustomTable }
})
export default class ModalProd extends Vue {
    // 名字不要改
    name = 'ModalProd'

    /* props */
    @Prop(Boolean) show!: boolean
    @Prop(String) title!: string

    // 弹窗的类型 2：商品 3：课程 8：拼团 9：领券 10：秒杀 11：预购, 16：组合课 18: 分销 21：单课 22：系列课
    @Prop({
        type: Number,
        default: 0
    }) readonly type!: number

    @Prop({
        type: Array,
        default () {
            return []
        }
    }) readonly range!: string[]

    @Prop({
        type: Array,
        default () {
            return []
        }
    }) readonly defaultCheckbox!: []

    @Prop(Boolean) reserveSelection!: boolean

    /* data */
    searchValue = ''
    searchHistory = ''
    productList = []
    selectedList = []
    // 装修的时候才需要 editorListIndex，表示当前装修数据在列表中的位置
    editorListIndex!: number
    pagination = {
        current: 1,
        size: 4,
        total: 0
    }

    checker = productChecker
    options = []

    /* watch */
    @Watch('show')
    onChange (val: boolean) {
        val ? this.getData() : this.clear()
    }

    created () {
        if (this.type) {
            this.init(this.type)
        }
    }

    /* methods */

    init (modalType: number) {
        const { options, checker } = modalMap[modalType]
        this.options = options
        this.checker = checker
    }

    getRowKeys (row: { id: string }) {
        return row.id
    }

    getData () {
        if (this.type === ModalType.ProductModal || this.type === ModalType.ClassModal) {
            this.getProduct()
        } else if (this.type === ModalType.PackageModal) {
            this.getPackage()
        } else if (this.type === ModalType.DistributionModal) {
            this.getDistribution()
        } else if (this.type === ModalType.SingleCourseModal || this.type === ModalType.SeriesCourseModal) {
            this.getCourse()
        } else if (this.type === ModalType.ImageTextModal) {
            this.getImageText()
        } else if (this.type === ModalType.RedPackageModal) {
            this.getRedPackage()
        } else {
            this.getActivity()
        }
    }

    // 团购、预购、秒杀、优惠券
    async getActivity () {
        const request = modalMap[this.type].method
        try {
            const params = {
                keyword: this.searchHistory,
                size: this.pagination.size,
                current: this.pagination.current,
                ...(this.type === ModalType.MiaoshaModal ? {
                    startTime: this.range[0],
                    endTime: this.range[1]
                } : null),
                type: ''
            }
            const { result }: any = await request(params)
            this.productList = result.records
            this.pagination.total = result.total
            if (this.reserveSelection) {
                // @ts-ignore
                this.$refs.productTable.setDefaultSelection(result.records, { id: 'value' })
            }
        } catch (e) {
            throw e
        }
    }

    // 商品、课程
    async getProduct () {
        try {
            const params = {
                type: 'ALL',
                productStatus: ProductStatus.OnSell, // 0：已删除 1：下架 2：上架  3：草稿箱
                size: this.pagination.size,
                current: this.pagination.current,
                ...(this.searchHistory ? { productName: this.searchHistory } : null), // 搜索内容
                isHidden: 1 // 不展示首页隐藏的课程
            }
            const { result }: any = await getGoods(params)
            for (const item of result.records) {
                item.skuEntityList.sort((a: { price: number }, b: { price: number }) => a.price - b.price)
            }
            this.productList = result.records
            this.pagination.total = result.total
            if (this.reserveSelection) {
                // @ts-ignore
                this.$refs.productTable.setDefaultSelection(result.records)
            }
        } catch (e) {
            throw e
        }
    }

    // 组合课
    async getPackage () {
        try {
            const params = {
                batchType: 1, // 组合课
                current: this.pagination.current,
                size: this.pagination.size,
                startTime: '',
                endTime: '',
                status: '1',
                ...(this.searchHistory ? { condition: this.searchHistory } : null) // 搜索内容
            }
            const { result }: any = await getSpringPloughingList(params)
            this.productList = result.records
            this.pagination.total = result.total
            if (this.reserveSelection) {
                // @ts-ignore
                this.$refs.productTable.setDefaultSelection(result.records)
            }
        } catch (e) {
            throw e
        }
    }

    // 分销商品
    async getDistribution () {
        try {
            const params = {
                keyWords: this.searchHistory,
                current: this.pagination.current,
                size: this.pagination.size
            }
            const { result }: any = await getDistribution(params)
            this.productList = result.records
            this.pagination.total = result.total
            if (this.reserveSelection) {
                // @ts-ignore
                this.$refs.productTable.setDefaultSelection(result.records)
            }
        } catch (e) {
            throw e
        }
    }

    // 查知识课程
    async getCourse () {
        try {
            const params = {
                courseType: this.type === ModalType.SingleCourseModal ? 1 : 2, // 1: 单课 2: 系列课
                status: '1', // 已上架课程
                searchParam: this.searchHistory,
                current: this.pagination.current,
                size: this.pagination.size,
                isHidden: 1 // 不展示首页隐藏的课程
            }
            const { result }: any = await getVideoList(params)
            this.productList = result.records
            this.pagination.total = result.total
        } catch (error) {
            throw error
        }
    }

    // 查图文资料
    async getImageText () {
        try {
            const params = {
                searchParam: this.searchHistory,
                current: this.pagination.current,
                size: this.pagination.size
            }
            const { result }: any = await getImageTextList(params)
            this.productList = result.records
            this.pagination.total = result.total
        } catch (error) {
            throw error
        }
    }

    // 查福利红包
    async getRedPackage () {
        try {
            const params = {
                activityStatus: '0, 1',
                page: this.pagination.current,
                size: this.pagination.size
            }
            const { result } = await getRedPackageList(params)
            // 过滤未开始/进行中、未隐藏的福利红包
            this.productList = result.records
                .filter((item: { activityStatus: number; showStatus: number }) => ~[0, 1].indexOf(item.activityStatus) && item.showStatus)
                .map((item: { price: number }) => {
                    item.price = fenToYuan(item.price)
                    return item
                })
            this.pagination.total = result.total
        } catch (error) {
            throw error
        }
    }

    onCheckboxChange (selectedList = []) {
        this.selectedList = selectedList
    }

    onPageChange (current: number) {
        this.pagination.current = current
        this.getData()
    }

    search () {
        this.searchHistory = this.searchValue
        this.getData()
    }

    refresh () {
        this.searchHistory = ''
        this.searchValue = ''
        this.pagination.current = 1
        this.selectedList = []
        // @ts-ignore
        this.$refs.productTable.clear()
        this.getData()
    }

    clear () {
        this.searchValue = ''
        this.searchHistory = ''
        this.pagination.current = 1
        this.pagination.total = 0
        this.productList = []
        this.selectedList = []
        // @ts-ignore
        this.$refs.productTable.clear()
    }

    close () {
        this.clear()
        this.$emit('update:show', false)
    }

    confirm () {
        const { selectedList } = this
        // const selectedList = this.selectedList.filter(select => !this.defaultCheckbox.some(item => (item.value === select.id)))
        this.$emit('update', {
            type: this.type,
            selectedList,
            index: this.editorListIndex
        })

        this.close()
    }

    /**
     * @param modalType {Number} 模块的id
     * @param index {Number} 在当前模块values列表中的位置
     * @param range {Array} 秒杀模块场次
     */
    async open ({ modalType, index, range = [] }: { modalType: number; index: number; range: string[] }) {
        this.editorListIndex = index
        this.init(modalType)
        this.$emit('update:type', Number(modalType))
        this.$emit('update:title', modalTitleMap[modalType])
        this.$emit('update:range', range)
        await this.$nextTick()
        this.$emit('update:show', true)
    }
}
</script>

<style lang="scss">
.modal-product {
    img {
        // width: 100%;
        object-fit: cover;
    }
    .el-icon-refresh {
        font-size: 24px;
        cursor: pointer;
        &::before {
            color: #4F63FF;
        }
    }
    .el-dialog {
        min-width: 790px;
    }
}

</style>
<style module lang="scss">
.modal-product {
    min-width: 1300px;
    .search-group {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-input {
            display: flex;
            align-items: center;
            position: relative;
        }
        button {
            margin-left: 10px;
        }
    }

    .btn-group {
        margin-top: 32px;
        text-align: center;
    }
}

</style>
