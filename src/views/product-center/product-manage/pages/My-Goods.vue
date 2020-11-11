<template>
    <div class="my-goods wrap">
        <search-box>
            <el-form-item label="商品名称：">
                <el-input
                    v-model="filter.productName"
                    placeholder="商品名称"
                    clearable
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="商品分类：">
                <el-cascader
                    clearable
                    :options="localCategoryTree"
                    v-model="selectedOptions"
                    @change="categoryChange"
                    :props="propsSet"
                />
            </el-form-item>
            <el-form-item label="推荐商品：">
                <el-select :disabled="filter.productStatus === 3" v-model="filter.recommendStatus" @change="search" clearable>
                    <el-option
                        v-for="item in recommendStatusMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="商品状态：">
                <el-select
                    v-model="filter.productStatus"
                    @change="search"
                >
                    <el-option
                        v-for="item of statusMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="商品类型：">
                <el-select v-model="filter.productType" @change="search" clearable>
                    <el-option v-for="item of productType" :value="item.value" :key="item.value" :label="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间：">
                <date-range
                    @change="dateChange"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" round>
                    查询
                </el-button>
                <el-button type="text" @click="clear">
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>
        <div class="mt-24" style="display: flex; justify-content: space-between; align-items: center;">
            <div v-if="$route.name !== 'DraftBox'">
                <el-button size="middle" round type="primary" @click="$router.push({name: 'AddProduct', params: { productType: 'PHYSICAL_GOODS' } })">
                    新增实体商品
                </el-button>
                <el-button size="middle" round type="primary" @click="$router.push({name: 'AddProduct', params: { productType: 'VIRTUAL_GOODS' } })">
                    新增虚拟商品
                </el-button>
            </div>
            <span v-if="$route.name === 'DraftBox'" style="color: #666;">
                草稿箱中的最多可以储存50条信息
            </span>
        </div>
        <div v-if="$route.name !== 'AllProduct'" class="mt-24">
            <span class="mr-10">
                已选择{{ multipleSelectionId.length }}个
            </span>
            <el-button round v-if="$route.name !== 'NotSell' && $route.name !== 'DraftBox'" @click="batchUpdate(1)" :disabled="!multipleSelectionId.length">
                批量下架
            </el-button>
            <el-button round v-if="$route.name === 'NotSell'" @click="batchUpdate(2)" :disabled="!multipleSelectionId.length">
                批量上架
            </el-button>
            <el-button round v-if="$route.name === 'NotSell' || $route.name === 'DraftBox'" @click="batchUpdate(0)" :disabled="!multipleSelectionId.length">
                批量删除
            </el-button>
        </div>
        <div class="sort mt-24" v-if="$route.name !== 'DraftBox'">
            <Sort :data="sortData" v-model="filter.sortCondition" @change="getGoods()" />
        </div>

        <el-table
            :data="table"
            @selection-change="handleSelectionChange"
            ref="table"
            style="min-width: 1100px"
        >
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg :key="2" name="icon-empty" style="margin-right: 4px;" width="16" />
                {{ emptyText }}
            </span>
            <el-table-column
                type="selection"
                v-if="$route.name !== 'AllProduct'"
                align="left"
                width="45"
            />
            <el-table-column
                width="100"
                align="center"
            >
                <template slot-scope="{ row }">
                    <div :class="{'pro-image': true, 'recommend-flag': row.recommendFlag }">
                        <img
                            height="50"
                            :src="row.productMainImage"
                            v-img-error
                            v-viewer
                            :class="{ mongolian: row.productStatus === 1 }"
                        >
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称" min-width="200">
                <template slot-scope="{ row }">
                    <p :style="{color:row.productStatus === 1 ? '#999' : ''}" v-text="row.productName" />
                    <ul class="tag-list">
                        <li
                            v-for="(item, i) of row.labelList" :key="i" v-text="item"
                            :style="{borderColor:row.productStatus === 1 ? '#999' : '' ,color:row.productStatus === 1 ? '#999' : ''}"
                        />
                    </ul>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="商品分类" width="150">
                <template slot-scope="{ row }">
                    <span :style="{color:row.productStatus === 1 ? '#999' : ''}">{{ row.categoryName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="实际售价(元)" width="120">
                <template slot-scope="{ row }">
                    <span :style="{color:row.productStatus === 1 ? '#999' : ''}">{{ row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalStock" label="总库存" width="120">
                <template slot-scope="{ row }">
                    <p>
                        <span v-text="row.totalStock" />
                        <pl-svg
                            :key="3"
                            class="icon-bianji1"
                            width="16"
                            v-if="$route.name !== 'DraftBox'"
                            name="icon-bianji1"
                            @click="editStock(row.skuEntityList)"
                        />
                    </p>
                    <div v-if="row.sellOut.length || row.stockWarning.length" class="no-stock">
                        <div class="warning-text" v-if="row.sellOut.length === row.skuEntityList.length">
                            <i class="el-icon-warning-outline color-orange" />
                            全部售罄
                        </div>
                        <div class="stock" v-else>
                            <span class="warning-text" v-if="row.sellOut.length">
                                <i class="el-icon-warning-outline color-orange" />
                                部分售罄
                            </span>
                            <span class="warning-text" v-else>
                                <i class="el-icon-warning-outline color-orange" />
                                低库存
                            </span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="实际销量" width="150">
                <template #default="{ row }">
                    {{ row.salesVolume }}
                    <div style="display: inline-flex; vertical-align: middle; margin-left: 10px">
                        <el-switch @change="showProductSalesChange(row)" v-model="row.showSales" :active-value="1" :inactive-value="0" />
                        <span class="primary-color-blue ml-10" v-if="row.showSales">显示</span>
                        <span v-else class="gray-4 ml-10">隐藏</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="productStatusText" label="商品状态" width="150">
                <template slot-scope="{ row }">
                    <span :style="{ color: row.productStatus === 1 ? '#999' : '' }">{{ row.productStatusText }}</span>
                    <!-- 上架中 -->
                    <div
                        style="display: inline-flex; vertical-align: middle; margin-left: 10px"
                        v-if="row.productStatus === 2"
                    >
                        <el-switch
                            @change="showProduct(row)"
                            :value="row.isShow"
                            :active-value="1"
                            :inactive-value="0"
                        />
                        <span class="primary-color-blue ml-10" v-if="row.isShow">显示</span>
                        <span v-else class="gray-4 ml-10">隐藏</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="添加时间"
                width="150"
            />
            <el-table-column
                label="操作"
                align="center"
                width="120"
                fixed="right"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <button v-if="row.productStatus !== 3 && $route.name !== 'DraftBox'" @click="handlePreview(row.id)">
                                预览
                            </button>
                            <button v-if="row.productStatus === 2 && $route.name !== 'DraftBox'" @click="updateGoodsStatus(1, row)">
                                下架
                            </button>
                            <button v-if="row.productStatus === 1 && $route.name !== 'DraftBox'" @click="updateGoodsStatus(2, row)">
                                上架
                            </button>
                            <button @click="goEdit(row)">
                                编辑
                            </button>
                            <button @click="$router.push({name:'GoodsOrderList',query:{ keyword: row.id}})">
                                查看订单
                            </button>
                            <button v-if="row.productStatus === 3 || $route.name === 'DraftBox'" @click="updateGoodsStatus(0, row)">
                                删除
                            </button>
                            <button v-if="$route.name !== 'DraftBox'" type="text" @click="showShare(row)">
                                分享
                            </button>
                            <template v-if="row.productStatus !== 3">
                                <button class="ml-0" type="text" @click="handleCopy(row.id)">
                                    复制
                                </button>
                                <button class="ml-0" type="text" @click="updateGoodsStatus(0, row)">
                                    删除
                                </button>
                                <button v-if="row.recommendFlag" class="ml-0" @click="cancelRecommend(row.recommendId)">
                                    取消推荐
                                </button>
                                <button v-if="!row.recommendFlag" class="ml-0" @click="openRecommendDialog(row)">
                                    设置推荐
                                </button>
                            </template>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total="total" :sizes="true" v-model="filter.current" @change="getGoods" @sizeChange="sizeChange" />
        <GoodsPreview
            :show.sync="showPreview"
            :data="singleGoods"
        />

        <el-dialog :visible.sync="showTip">
            <div slot="title" class="tipTtitle">
                <i class="el-icon-warning-outline color-orange fz-33" /> 提示
            </div>
            <div class="tip-content">
                <p>店铺显示销量：</p>
                <p>是指机构为营销需要，对商品在前台店铺中显示的销售量，可通过人工进行调整，已达到促进店铺销量的效果。</p>
                <p>店铺显示销量，调整公式为：</p>
                <p>显示销量=实际销量 +新增销量（如果未进行设置调整，则默认店铺显示销量=实际销售量）</p>
                <p>
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/tip.png" width="260" alt="">
                </p>
            </div>
            <div slot="footer">
                <el-button type="primary" size="middle" @click="showTip = false">
                    我知道了
                </el-button>
            </div>
        </el-dialog>

        <el-dialog
            :visible.sync="showEditStock"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="编辑库存"
            @closed="stockClosed"
        >
            <el-table
                :data="currentEditStock"
                style="border-top: 1px solid #ebeef5;"
            >
                <el-table-column label="规格名称">
                    <template slot-scope="{ row }">
                        <span v-text="row.skuCode1Name" />
                        <template v-if="row.skuCode2Name">
                            ,<span v-text="row.skuCode2Name" />
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="剩余库存（件）">
                    <template slot-scope="{ row }">
                        <span>{{ row.stock }}</span>
                        <span style="margin-left: 8px;color: #D95C58;" v-if="Number(row.stock) === 0">(已售罄)</span>
                        <span style="margin-left: 8px;color: #D95C58;" v-if="Number(row.stock) !== 0 && Number(row.stock) <= 5">(低库存)</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="库存调整"
                    width="300"
                >
                    <template slot-scope="{ row }">
                        <el-input-number
                            v-model="row.num"
                            @change="stockChang(row)"
                            :min="Number(-row.stock)"
                            :max="Number(99999999 - row.stock)"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="调整后库存"
                    prop="stockRevise"
                />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="middle" @click="saveStockChang">
                    保存
                </el-button>
            </span>
        </el-dialog>
        <!-- 商品推荐-->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="recommendVisible"
            title="商品推荐"
            class="recommend"
            @close="closeRecommendDialog"
        >
            <el-tabs type="card" v-model="tabsActive">
                <el-tab-pane label="设置推荐" name="setRecommend">
                    <el-table :data="recommendTable">
                        <el-table-column
                            label="商品图片"
                            width="150"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <img
                                    width="60"
                                    height="60"
                                    :src="row.productMainImage"
                                    v-viewer
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="productName"
                            label="商品名称"
                            width="300"
                        />
                        <el-table-column
                            property="createTime"
                            label="添加时间"
                            width="200"
                        />
                        <el-table-column
                            label="设置推荐"
                        >
                            <template slot-scope="{ row }">
                                <span style="margin-right: 6px">当前</span>
                                <span>
                                    <el-input-number
                                        v-model="row.sort"
                                        :min="1"
                                        :max="recommendNumberInfo.nextNumber"
                                        :disabled="!recommendNumberInfo.canAdd"
                                    />
                                    <span style="margin-left: 6px">位</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 32px;text-align: center;">
                        <el-button
                            type="primary"
                            style="width: 70px;"
                            @click="setRecommend(recommendTable[0].id,recommendTable[0].sort)"
                        >
                            确定
                        </el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已推荐商品" name="showRecommend">
                    <el-form
                        :inline="true"
                        v-model="recommendedForm"
                        class="wrap border-bottom"
                    >
                        <el-form-item>
                            <el-select
                                v-model="recommendedForm.productType"
                                @change="searchProduct(1)"
                                style="width: 100px;"
                            >
                                <el-option
                                    v-for="(item,index) of recommendProductType"
                                    :key="index"
                                    :label="item.dictDataValue"
                                    :value="item.dictDataKey"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-cascader
                                :props="{ expandTrigger: 'hover', value:'id', label:'categoryName', children:'childs' }"
                                :options="categoryList"
                                v-model="categoryArray"
                                @change="searchProduct(1)"
                            />
                        </el-form-item>
                        <el-form-item style="margin-left: 40px;" class="mb-0">
                            <el-input
                                placeholder="商品名称"
                                style="width: 180px;"
                                v-model="recommendedForm.productName"
                            />
                            <el-button
                                type="primary"
                                style="width: 98px;margin-left: 10px;"
                                round
                                @click="searchProduct(1)"
                            >
                                查询
                            </el-button>
                            <el-button
                                type="text"
                                @click="refreshProduct"
                            >
                                清空筛选条件
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        ref="singleTable"
                        :data="recommendedTable"
                        empty-text="请输入商品信息进行搜索"
                    >
                        <el-table-column
                            label="商品图片"
                            width="150"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <img
                                    width="60"
                                    height="60"
                                    :src="row.productMainImage"
                                    v-viewer
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="productName"
                            label="商品名称"
                            width="300"
                        />
                        <el-table-column
                            property="createTime"
                            label="添加时间"
                            width="200"
                        />
                        <el-table-column
                            label="推荐排行"
                        >
                            <template slot-scope="{ row }">
                                <span>当前排位<span style="margin-left:4px;color: #EC742E;">{{ row.serialNo }}</span></span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <Pagination
                        :size="recommendedForm.size"
                        :total="recommendTotal"
                        v-model="recommendedForm.current"
                        @change="searchProduct"
                        style="margin-top: 12px;text-align: center;"
                    />
                    <div style="margin-top: 32px;text-align: center;">
                        <el-button
                            type="primary"
                            style="width: 70px;"
                            @click="closeRecommendDialog"
                        >
                            确定
                        </el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <Share
            :show.sync="showShareDialog"
            :qrcode-text="currentShareShow.qrcodeText"
            qrcode-image-name="分享二维码："
            :thumbnail="currentShareShow.thumbnail"
        />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDataDictionary } from '../../../../apis/common'
import {
    cancelRecommend,
    copyProduct,
    createAddRecommend,
    getCurrentNumber,
    getCategoryTreePlatform,
    getGoods,
    getRecommendProduct,
    getSingleGoods,
    modifyStock,
    setShowSales,
    updateGoodsStatus,
    getIsActivityProduct,
    showProductSales,
    showProduct
} from '../../../../apis/product-center/goods'
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview.vue'
import Sort from '../../../../components/product-center/goods/Sort.vue'
import Share from '../../../../components/common/Share.vue'

const msg = [
    '删除',
    '下架',
    '上架'
]
export default {
    name: 'ProductList',
    components: {
        GoodsPreview,
        Sort,
        Share
    },
    data () {
        return {
            propsSet: {
                label: 'categoryName',
                children: 'childs',
                value: 'id',
                checkStrictly: true
            },
            selectedOptions: [''],
            showTip: false,
            showEditStock: false,
            showShareDialog: false,
            currentEditStock: null,
            editStockTable: [],
            filter: {
                type: 'GOODS',
                categoryId: '',
                subCategoryId: '',
                productType: '',
                productName: '',
                recommendStatus: '',
                startTime: '',
                endTime: '',
                productStatus: '',
                sortCondition: '',
                current: 1,
                size: 10
            },
            sortData: [
                {
                    label: '综合',
                    value: '',
                    ovonic: false
                },
                {
                    label: '新品',
                    value: 'NEW',
                    ovonic: false
                },
                {
                    label: '人气',
                    ovonic: true,
                    ovonicValue: {
                        descending: 'POPULARITY_DOWN',
                        ascending: 'POPULARITY_UP'
                    }
                },
                {
                    label: '销量',
                    ovonic: true,
                    ovonicValue: {
                        descending: 'SALES_VOLUME_DOWN',
                        ascending: 'SALES_VOLUME_UP'
                    }
                },
                {
                    label: '价格',
                    ovonic: true,
                    ovonicValue: {
                        descending: 'PRICE_DOWN',
                        ascending: 'PRICE_UP'
                    }
                }
            ],
            isBatch: true,
            table: [],
            total: 0,
            showPreview: false,
            multipleSelection: [],
            multipleSelectionId: [],
            singleGoods: {},
            statusMap: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '出售中',
                    value: 2
                },
                {
                    label: '草稿箱',
                    value: 3
                },
                {
                    label: '已下架',
                    value: 1
                },
                {
                    label: '已售罄',
                    value: 4
                }
            ],
            recommendStatusMap: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '已推荐',
                    value: 'Y'
                },
                {
                    label: '未推荐',
                    value: 'N'
                }
            ],
            // 商品推荐
            tabsActive: 'setRecommend',
            recommendVisible: false,
            // 设置推荐列表
            recommendTable: [],
            // 已推荐列表
            // 搜索条件
            recommendedForm: {
                recommendType: 1,
                categoryId: '',
                subCategoryId: '',
                productType: 'ALL_GOODS',
                productName: '',
                current: 1,
                size: 4
            },
            // 产品类型数据字典
            recommendProductType: [],
            // 分类数据
            categoryList: [],
            // 分类中间变量
            categoryArray: [''],
            // 搜索结果计数
            recommendTotal: 0,
            // 搜索结果
            recommendedTable: [],
            recommendNumberInfo: {},
            emptyText: '暂无商品，给店铺添加您的商品吧！',
            currentShareShow: {
                qrcodeText: '',
                thumbnail: ''
            }
        }
    },
    async created () {
        try {
            this.filter.productType = this.$route.query.productType || ''
            this.filter.productStatus = this.$route.query.status || ''
            await this.search()
        } catch (e) {
            throw e
        }
    },
    computed: {
        ...mapGetters({
            productType: 'productType',
            categoryTree: 'goods/categoryTree',
            logo: 'user/logo',
            mallUrl: 'user/mallUrl'
        }),
        localCategoryTree () {
            const tree = JSON.parse(JSON.stringify(this.categoryTree))
            tree.unshift({
                id: '',
                categoryName: '全部'
            })
            return tree
        }
    },
    watch: {
        categoryArray (val) {
            if (val.length) {
                this.recommendedForm.categoryId = val[0] || ''
                this.recommendedForm.subCategoryId = val[1] || ''
            }
        },
        'filter.productStatus' (val) {
            if (val === 3) this.filter.recommendStatus = ''
        }
    },
    methods: {
        // 商品 C 端显示隐藏
        async showProduct ({ id, isShow }) {
            try {
                const show = isShow === 1
                if (show) {
                    await this.$confirm({
                        title: '确定要隐藏该商品在商城的显示吗？',
                        message: '隐藏后用户仅在商城不可见该商品，不影响商品已参加的活动，指定发送给用户时用户可见'
                    })
                }
                await showProduct({ productId: id, status: show ? 0 : 1 })
                this.$success(`${ show ? '隐藏' : '显示' }成功`)
                await this.getGoods()
            } catch (e) {
                throw e
            }
        },
        async showProductSalesChange (row) {
            try {
                if (!row.showSales) {
                    row.showSales = 1
                    await this.$confirm({
                        title: '确定要隐藏该商品的实际销量？',
                        message: '隐藏后订购量在商城的列表页和详情页中均不展示'
                    })
                    row.showSales = 0
                    await showProductSales({ productId: row.id, status: row.showSales })
                    this.$success('操作成功')
                } else {
                    await showProductSales({ productId: row.id, status: row.showSales })
                    this.$success('操作成功')
                }
            } catch (e) {
                throw e
            }
        },
        async search () {
            this.emptyText = '未搜索到相关商品'
            this.filter.current = 1
            await this.getGoods()
        },
        async clear () {
            this.filter = {
                type: 'GOODS',
                categoryId: '',
                subCategoryId: '',
                productType: '',
                productName: '',
                recommendStatus: '',
                startTime: '',
                endTime: '',
                productStatus: '',
                sortCondition: '',
                current: 1,
                size: 10
            }
            this.$refs.dateRange.clear()
            await this.getGoods()
        },
        async goEdit (row) {
            if (row.productStatus === 1 || row.productStatus === 3) {
                this.$router.push({ name: 'EditProduct', params: { id: row.id }, query: { toName: this.$route.name } })
            } else {
                await this.$confirm('商品信息下架后可修改，您是否确定要下架商品进行编辑吗？')
                await updateGoodsStatus(1, [row.id])
                this.$router.push({ name: 'EditProduct', params: { id: row.id }, query: { toName: this.$route.name } })
            }
        },
        async sizeChange (val) {
            this.filter.size = val
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async getGoods () {
            try {
                if (this.filter.productStatus === 3) {
                    this.filter.recommendStatus = ''
                }
                const res = await getGoods(this.filter)
                for (const item of res.result.records) {
                    // 准备好二维码字段
                    item.qrcode = ''
                    // 设置库存警告
                    item.sellOut = item.skuEntityList.filter(item => item.stock === 0)
                    item.stockWarning = item.skuEntityList.filter(item => item.stock <= 5)
                    // 设置编辑库存时需要的属性
                    item.sort = 1
                    for (const skuItem of item.skuEntityList) {
                        skuItem.num = 0
                        skuItem.stockRevise = skuItem.stock
                    }
                    item.iconGengduoShow = false
                }
                this.table = res.result.records
                this.total = res.result.total
            } catch (e) {
                throw e
            }
        },
        stockChang (row) {
            row.num = parseInt(row.num)
            row.stockRevise = row.stock + row.num
        },
        stockClosed () {
            for (const items of this.table) {
                items.sort = 1
                for (const item of items.skuEntityList) {
                    item.num = 0
                    item.stockRevise = item.stock
                }
            }
        },
        async saveStockChang () {
            const find = this.currentEditStock.filter(item => item.num !== 0)
            if (find.length) {
                const data = []
                for (const item of find) {
                    data.push({ id: item.id, stockRevise: item.num, oldStock: item.stock })
                }
                try {
                    await modifyStock(data)
                    this.$success('编辑库存成功')
                    await this.getGoods()
                } catch (e) {
                    throw e
                }
            }
            this.showEditStock = false
        },
        async dateChange ({ start, end }) {
            this.filter.startTime = start
            this.filter.endTime = end
            await this.search()
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
            this.multipleSelectionId = []
            for (const i of val) {
                this.multipleSelectionId.push(i.id)
            }
        },
        async handlePreview (id) {
            const res = await getSingleGoods(id)
            this.showPreview = true
            this.singleGoods = res.result
        },
        async updateGoodsStatus (type, row) {
            if (type === 0 && row.productStatus === 2 && this.$route.name !== 'DraftBox') {
                this.$alert('下架商品后可删除商品')
                return
            }

            try {
                if (type === 1) {
                    const data = await getIsActivityProduct(row.id)
                    if (data && data.result) {
                        await this.$confirm({
                            title: '确认要下架这个商品吗？',
                            message: '该课程正在参与营销活动，下架后商品将从营销活动中删除'
                        })
                    } else {
                        await this.$confirm({
                            title: '确认要下架这个商品吗？',
                            message: '该商品下架后，在店铺中用户不可再进行下单操作'
                        })
                    }
                }
                if (type === 0 && this.$route.name !== 'DraftBox') {
                    await this.$confirm({
                        title: '确认要删除这个商品吗？',
                        message: '该商品被删除后不可恢复'
                    })
                }
                if (type === 0 && this.$route.name === 'DraftBox') {
                    await this.$confirm({
                        title: '确认要删除这个商品草稿吗？',
                        message: '该商品草稿被删除后将不可恢复'
                    })
                }
                await updateGoodsStatus(type, [row.id])
                this.$success(`${ msg[type] }成功`)
                await this.getGoods()
            } catch (e) {
                throw e
            }
        },
        async batchUpdate (type) {
            try {
                if (type === 1) {
                    await this.$confirm({
                        title: '确认要下架这个商品吗？',
                        message: '该商品下架后，在店铺中用户不可再进行下单操作'
                    })
                }
                if (type === 0 && this.$route.name !== 'DraftBox') {
                    await this.$confirm({
                        title: '确认要删除选择的商品吗？',
                        message: '商品被删除后不可恢复'
                    })
                }
                if (type === 0 && this.$route.name === 'DraftBox') {
                    await this.$confirm({
                        title: '确认要删除选中的商品草稿吗？',
                        message: '商品草稿被删除后将不可恢复'
                    })
                }
                await updateGoodsStatus(type, this.multipleSelectionId)
                this.$success(`商品批量${ msg[type] }成功`)
                await this.getGoods()
                this.multipleSelection = []
            } catch (e) {
                throw e
            }
        },
        async handleCopy (id) {
            try {
                const { result } = await copyProduct(id)
                await this.$confirm({
                    title: '已复制成功，是否进入编辑页面？',
                    message: '该商品复制后，复制商品请在-已下架中查看',
                    confirmButtonText: '编辑'
                })
                this.$router.push({ name: 'EditProduct', params: { id: result } })
            } catch (e) {
                throw e
            } finally {
                this.search()
            }
        },
        async categoryChange (value) {
            this.filter.categoryId = value[0] || ''
            this.filter.subCategoryId = value[1] || ''
            this.filter.current = 1
            await this.search()
        },
        async showShare (row) {
            this.currentShareShow = {
                qrcodeText: `${ this.mallUrl }/detail/product/${ row.id }`,
                thumbnail: row.productMainImage
            }
            this.showShareDialog = true
        },
        async setShowSales () {
            try {
                let { value } = await this.$prompt({
                    title: '请输入显示的销量',
                    inputType: 'number'
                })
                value = Math.abs(value)
                if (!Number(value)) {
                    this.$error('请输入正确的销量')
                    return
                }
                await setShowSales(this.multipleSelectionId, value)
                this.$success('设置成功')
            } catch (e) {
                throw e
            }
        },
        copyLink (row) {
            this.$copyText(row.productLink)
                .then(() => {
                    this.$success('复制成功')
                })
                .catch(() => {
                    this.$error('复制成功失败，请手动复制')
                })
        },
        editStock (sku) {
            this.currentEditStock = sku
            this.showEditStock = true
        },
        // 商品推荐相关
        // 取消推荐
        async cancelRecommend (id) {
            await this.$confirm('确定取消该商品推荐？')
            try {
                await cancelRecommend({ cancelList: [id], recommendType: 1 })
                this.$success('取消推荐成功')
                await this.getGoods()
            } catch (e) {
                this.$error('取消推荐失败')
            }
        },
        // 设置推荐表格展示
        async openRecommendDialog (row) {
            if (row.productStatus !== 2) {
                this.$warning('请上架商品后，再进行商品推荐')
                return false
            }
            // 商品类型为1
            const data = await getCurrentNumber({ recommendType: 1 })
            if (data.result) {
                this.recommendNumberInfo = data.result
                if (!this.recommendNumberInfo.canAdd) {
                    this.$alert('榜单商品已满30，请整理榜单后重新加入')
                    return false
                }
                row.sort = this.recommendNumberInfo.nextNumber
            }
            this.recommendTable = [row]
            await this.getSearchData()
            await this.searchProduct(1)
            this.recommendVisible = true
        },
        // 设置推荐
        async setRecommend (id, sort) {
            try {
                await createAddRecommend({ productId: id, serialNo: sort, recommendType: 1 })
                await this.getGoods()
                this.recommendVisible = false
                this.$success('设置推荐成功')
            } catch (e) {
                this.$error('设置推荐失败')
            }
        },
        // 获取已推荐基础数据
        async getSearchData () {
            const data = await getDataDictionary('goodsType')
            this.recommendProductType = data.result || []
            const res = await getCategoryTreePlatform()
            if (res && res.result && res.result.length) {
                res.result.unshift({ categoryName: '全部分类', id: '' })
                this.categoryList = res.result
            }
        },
        // 搜索商品以便展示推荐
        async searchProduct (page) {
            try {
                this.recommendedForm.current = page || this.recommendedForm.current
                const { result } = await getRecommendProduct(this.recommendedForm)
                this.recommendedTable = result.records
                this.recommendTotal = result.total
            } catch (e) {
                throw e
            }
        },
        refreshProduct () {
            this.recommendedForm = {
                recommendType: 1,
                categoryId: '',
                subCategoryId: '',
                productType: 'ALL_GOODS',
                productName: '',
                current: 1,
                size: 4
            }
            this.categoryArray = ['']
            this.searchProduct(1)
        },
        // 关闭弹窗并清理数据
        closeRecommendDialog () {
            this.recommendTable = []
            this.recommendedTable = []
            this.recommendedForm = {
                recommendType: 1,
                categoryId: '',
                subCategoryId: '',
                productType: 'ALL_GOODS',
                productName: '',
                current: 1,
                size: 4
            }
            this.categoryArray = ['']
            this.recommendVisible = false
            this.tabsActive = 'setRecommend'
        },
        iconGengduoEnter (row) {
            row.iconGengduoShow = true
        },
        iconGengduoLeave (row) {
            row.iconGengduoShow = false
        }
    }
}
</script>

<style lang="scss" scoped>
  .more-ctrl {
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;

    a {
      line-height: 30px;
      font-size: 12px;

      &:hover {
        background-color: #EEEEEE;
      }
    }
  }

  .share-qrcode {
    display: flex;
    flex-direction: column;
    padding: 28px 12px;

    a {
      width: max-content;
      margin-left: 8px;
      color: $--color-primary-blue;
      font-size: 14px;
      text-decoration: underline;
    }

    &-row {
      display: flex;
      align-items: center;

      &:nth-of-type(1) {
        margin-bottom: 24px;
      }
    }

    &-title {
      width: 110px;
      font-size: 18px;
      color: #000;
    }

    &-link {
      display: inline-flex;
      justify-content: space-between;
      flex: 1;
      padding: 10px 20px;
      line-height: 40px;
      background-color: #F5F7FC;

      > span {
        flex: 1;
        padding-right: 10px;
        line-height: 20px;
        color: #000;
      }
    }

    &-img {
      > img {
        width: 120px;
        height: 120px;
        border: 1px dashed #888;
        box-sizing: border-box;
        object-fit: contain;
      }

      > p {
        font-size: 16px;
        color: #000;
        margin-top: 6px;
      }

      > a {
        vertical-align: 8px;
      }
    }
  }

  .my-goods {
    min-height: calc(100vh - 110px);
    padding-bottom: 30px;
    background-color: #ffffff;

    img {
      object-fit: cover;
    }

    .mongolian {
      filter: grayscale(.5) opacity(.5);
    }

    .empty {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 12px;
        margin-right: 8px;
      }
    }

    .product-sort {
      > div {
        display: inline-flex;
      }
    }

    .icon-gengduo {
      position: absolute;
      top: 50%;
      right: 0;
      display: inline-block;
      cursor: pointer;
      transform: translate(100px, -50%);
      transition: transform .3s ease;
    }

    .no-stock {
      > .stock {
        color: #999;
      }

      .stock-warning-list {
        > li {
          display: flex;
          flex-direction: column;

          > span:nth-of-type(1) {
            display: inline-block;
            max-width: 180px;
            @include elps();
          }
        }
      }
    }

    .warning-text {
      color: #d9736e;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;

      > li {
        margin-right: 6px;
        margin-bottom: 6px;
        padding: 1px 3px;
        line-height: 16px;
        border: 1px solid #ec742e;
        font-size: 12px;
        color: #ec742e;
        word-break: break-all;
      }
    }

    .pro-image {
      position: relative;
      display: inline-block;
      color: transparent; /* 隐藏奇怪的三个点 */
      > img {
        width: auto;
      }

      &.recommend-flag:before {
        position: absolute;
        left: 0;
        top: 0;
        content: '推荐';
        padding: 2px 4px;
        font-size: 8px;
        line-height: 11px;
        color: #fff;
        background-color: #F2B036;
      }
    }

    .tipTtitle {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
    }

    .tip-content {
      line-height: 19px;

      p {
        &:nth-of-type(2n + 1) {
          color: #598bf8;
          margin-bottom: 4px;
        }

        &:nth-of-type(2n) {
          color: #999;
          margin-bottom: 24px;
          width: 580px;
        }
      }
    }

    ::v-deep .el-table__row {
      .icon-bianji1 {
        display: none;
        margin-left: 10px;
        font-weight: bolder;
        color: #598bf8;
        cursor: pointer;
        font-size: 14px;
      }

      &:hover {
        .icon-bianji1 {
          display: inline-block;
        }
      }
    }
  }
</style>
