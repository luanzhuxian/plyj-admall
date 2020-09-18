<template>
    <div class="my-courses wrap">
        <search-box label-width="90px">
            <el-form-item label="课程名称：">
                <el-input
                    v-model="filter.productName"
                    placeholder="课程名称"
                    clearable
                    @change="search(1)"
                />
            </el-form-item>
            <el-form-item label="课程分类：">
                <el-cascader
                    clearable
                    :options="localCategoryTree"
                    v-model="selectedOptions"
                    @change="categoryChange"
                    :props="propsSet"
                />
            </el-form-item>
            <el-form-item v-if="filter.productStatus !== 3" label="推荐课程：">
                <el-select v-model="filter.recommendStatus" @change="search(1)" clearable>
                    <el-option
                        v-for="item in recommendStatusMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="课程类型：">
                <el-select v-model="filter.productType" @change="search(1)" clearable>
                    <el-option v-for="item of productType" :value="item.value" :key="item.value" :label="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="课程状态：">
                <el-select
                    v-model="filter.productStatus"
                    @change="search(1)"
                >
                    <el-option
                        v-for="item of statusMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
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
            <el-form-item label=" ">
                <el-button round type="primary" @click="search(1)">
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <div class="mt-24" style="display: flex; justify-content: space-between; align-items: center;">
            <div v-if="$route.name !== 'DraftBoxCourses'">
                <el-button round type="primary" @click="$router.push({name: 'AddCourses', params: { productType: 'FORMAL_CLASS' } })">
                    新增课程
                </el-button>
            </div>
            <span v-if="$route.name === 'DraftBoxCourses'" style="color: #666;">
                草稿箱中的最多可以储存50条信息
            </span>
        </div>
        <div class="mt-24" v-if="$route.name !== 'AllCourses'">
            <span class="mr-10">
                已选择{{ multipleSelectionId.length }}个
            </span>
            <el-button v-if="$route.name !== 'NotSellCourses' && $route.name !== 'DraftBoxCourses'" @click="batchUpdate(1)" :disabled="!multipleSelectionId.length">
                批量下架
            </el-button>
            <el-button v-if="$route.name === 'NotSellCourses'" @click="batchUpdate(2)" :disabled="!multipleSelectionId.length">
                批量上架
            </el-button>
            <el-button v-if="$route.name === 'NotSellCourses' || $route.name === 'DraftBoxCourses'" @click="batchUpdate(0)" :disabled="!multipleSelectionId.length">
                批量删除
            </el-button>
        </div>
        <div class="sort mt-24" v-if="$route.name !== 'DraftBoxCourses'">
            <Sort :data="sortData" v-model="filter.sortCondition" @change="this.getGoods" />
        </div>

        <el-table :data="table" @selection-change="handleSelectionChange" ref="table">
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" style="margin-right: 4px;" width="16" />
                {{ emptyText }}
            </span>
            <el-table-column
                type="selection"
                v-if="$route.name !== 'AllCourses'"
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
                            v-img-error
                            v-viewer
                            height="50"
                            :src="row.productMainImage"
                            alt=""
                            :class="{ mongolian: row.productStatus === 1 }"
                        >
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="productName" label="课程名称">
                <template slot-scope="{ row }">
                    <p :style="{color:row.productStatus === 1 ? '#999' : ''}" v-text="row.productName" />
                    <ul class="tag-list">
                        <li v-for="(item, i) of row.labelList" :key="i" v-text="item" :style="{borderColor:row.productStatus === 1 ? '#999' : '' ,color:row.productStatus === 1 ? '#999' : ''}" />
                    </ul>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="课程分类" width="140">
                <template slot-scope="{ row }">
                    <span :style="{color:row.productStatus === 1 ? '#999' : ''}">{{ row.categoryName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="实际售价(元)" width="140">
                <template slot-scope="{ row }">
                    <span :style="{color:row.productStatus === 1 ? '#999' : ''}">{{ row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalStock" label="总名额" width="140">
                <template slot-scope="{ row }">
                    <p>
                        <span v-text="row.totalStock" />
                        <pl-svg width="16" class="icon-bianji1" v-if="$route.name !== 'DraftBoxCourses'" name="icon-bianji1" @click="editStock(row.skuEntityList)" />
                    </p>
                    <div v-if="row.sellOut.length || row.stockWarning.length" class="no-stock">
                        <div class="warning-text" v-if="row.sellOut.length === row.skuEntityList.length">
                            <i class="el-icon-warning-outline fz-18" style="color: #d9736e;" />
                            全部售罄
                        </div>
                        <div class="stock" v-else>
                            <span class="warning-text" v-if="row.sellOut.length"><i class="el-icon-warning-outline fz-18" style="color: #d9736e;" /> 部分售罄</span>
                            <span class="warning-text" v-else><i class="el-icon-warning-outline fz-18" style="color: #d9736e;" /> 低名额</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="实际销量"
                width="150"
            >
                <template #default="{ row }">
                    {{ row.salesVolume }}
                    <div style="display: inline-flex; vertical-align: middle; margin-left: 10px">
                        <el-switch @change="showCourseSalesChange(row)" v-model="row.showSales" :active-value="1" :inactive-value="0" />
                        <span class="primary-color-blue ml-10" v-if="row.showSales">显示</span>
                        <span v-else class="gray-4 ml-10">隐藏</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="productStatusText"
                label="课程状态"
                width="150"
            >
                <template slot-scope="{ row }">
                    <span :style="{color:row.productStatus === 1 ? '#999' : ''}">{{ row.productStatusText }}</span>
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
                header-align="center"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a v-if="row.productStatus !== 3 && $route.name !== 'DraftBoxCourses'" @click="handlePreview(row.id)">
                                预览
                            </a>
                            <a v-if="row.productStatus === 2 && $route.name !== 'DraftBoxCourses'" @click="updateGoodsStatus(1, row)">
                                下架
                            </a>
                            <a v-if="row.productStatus === 1 && $route.name !== 'DraftBoxCourses'" @click="updateGoodsStatus(2, row)">
                                上架
                            </a>
                            <a @click="goEdit(row)">
                                编辑
                            </a>
                            <a v-if="row.hasOrder" @click="$router.push({name:'CoursesAllOrder',params:{id:row.id}})">
                                查看订单
                            </a>
                            <a v-if="row.productStatus === 3 || $route.name === 'DraftBoxCourses'" @click="updateGoodsStatus(0, row)">
                                删除
                            </a>
                            <a v-if="$route.name !== 'DraftBox'" @click="showShare(row)">
                                分享
                            </a>
                            <template v-if="row.productStatus !== 3">
                                <a @click="handleCopy(row.id)">
                                    复制
                                </a>
                                <a @click="updateGoodsStatus(0, row)">
                                    删除
                                </a>
                                <a v-if="row.recommendFlag" class="ml-0" @click="cancelRecommend(row.recommendId)">
                                    取消推荐
                                </a>
                                <a v-if="!row.recommendFlag" class="ml-0" @click="openRecommendDialog(row)">
                                    设置推荐
                                </a>
                            </template>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total="total" v-model="filter.current" @change="getGoods" />
        <GoodsPreview
            :show.sync="showPreview"
            :data="singleGoods"
            :type="'CLASS'"
        />
        <el-dialog :visible.sync="showTip">
            <div slot="title" class="tipTtitle">
                <i class="el-icon-warning-outline fz-18" style="color: #d9736e;" /> 提示
            </div>
            <div class="tip-content">
                <p>店铺显示销量：</p>
                <p>是指机构为营销需要，对课程在前台店铺中显示的销售量，可通过人工进行调整，已达到促进店铺销量的效果。</p>
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
            title="编辑名额"
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
                <el-table-column label="剩余名额">
                    <template slot-scope="{ row }">
                        <span>{{ row.stock }}</span>
                        <span style="margin-left: 8px;color: #D95C58;" v-if="Number(row.stock) === 0">(已售罄)</span>
                        <span style="margin-left: 8px;color: #D95C58;" v-if="Number(row.stock) !== 0 && Number(row.stock) <= 5">(低名额)</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="名额调整"
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
                    label="调整后名额"
                    prop="stockRevise"
                />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="middle" @click="saveStockChang">
                    保存
                </el-button>
            </span>
        </el-dialog>
        <!-- 课程推荐-->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="recommendVisible"
            title="课程推荐"
            @close="closeRecommendDialog"
        >
            <el-tabs type="card" v-model="tabsActive">
                <el-tab-pane label="设置推荐" name="setRecommend">
                    <el-table :data="recommendTable">
                        <el-table-column
                            label="课程图片"
                            width="150"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <img
                                    width="90"
                                    height="60"
                                    :src="row.productMainImage"
                                    v-viewer
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="productName"
                            label="课程名称"
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
                <el-tab-pane label="已推荐课程" name="showRecommend">
                    <el-form
                        :inline="true"
                        v-model="recommendedForm"
                    >
                        <el-form-item>
                            <el-select
                                v-model="recommendedForm.productType"
                                @change="searchProduct"
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
                                @change="searchProduct"
                            />
                        </el-form-item>
                        <el-form-item style="margin-left: 40px;">
                            <el-input
                                placeholder="课程名称"
                                style="width: 180px;"
                                v-model="recommendedForm.productName"
                            />
                            <el-button
                                type="primary"
                                style="width: 98px;margin-left: 10px;"
                                @click="searchProduct"
                            >
                                搜索
                            </el-button>
                            <el-button
                                type="primary"
                                @click="refreshProduct"
                            >
                                清空搜索条件
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        ref="singleTable"
                        :data="recommendedTable"
                        empty-text="请输入课程信息进行搜索"
                    >
                        <el-table-column
                            label="课程图片"
                            width="150"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <img
                                    width="90"
                                    height="60"
                                    :src="row.productMainImage"
                                    v-viewer
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="productName"
                            label="课程名称"
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
                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :current-page="recommendedForm.current"
                        :page-size="recommendedForm.size"
                        :total="recommendTotal"
                        @current-change="setPageSize"
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
        <Share :show.sync="qrcode.qrcodeShow" :thumbnail="qrcode.thumbnail" :qrcode-text="qrcode.qrcodeText" ref="share" />
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
} from '../../../../apis/goods'
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview.vue'
import Sort from '../../../../components/product-center/goods/Sort.vue'
import Share from '../../../../components/common/Share.vue'

const msg = [
    '删除',
    '下架',
    '上架'
]
export default {
    components: {
        GoodsPreview,
        Sort,
        Share
    },
    data () {
        return {
            qrcode: {
                qrcodeShow: false,
                qrcodeText: '',
                thumbnail: ''
            },
            propsSet: {
                label: 'categoryName',
                children: 'childs',
                value: 'id',
                checkStrictly: true
            },
            showTip: false,
            showEditStock: false,
            currentEditStock: null,
            editStockTable: [],
            selectedOptions: [''],
            filter: {
                type: 'CLASS',
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
            // statusMap: {
            //   SoldOutCourses: 4,
            //   AllCourses: '',
            //   SellingCourses: 2,
            //   NotSellCourses: 1,
            //   DraftBoxCourses: 3
            // },
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
            // 课程推荐
            tabsActive: 'setRecommend',
            recommendVisible: false,
            // 设置推荐列表
            recommendTable: [],
            // 已推荐列表
            // 搜索条件
            recommendedForm: {
                recommendType: 2,
                categoryId: '',
                subCategoryId: '',
                productType: 'ALL_CLASS',
                productName: '',
                current: 1,
                size: 4
            },
            // 课程类型
            productType: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '正式课',
                    value: 'FORMAL_CLASS'
                },
                {
                    label: '体验课',
                    value: 'EXPERIENCE_CLASS'
                }
            ],
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
            emptyText: '暂无课程，给店铺添加您的课程吧！'
        }
    },
    async created () {
        await this.getGoods()
    },
    computed: {
        ...mapGetters({
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
        }
    },
    methods: {
    // 课程 C 端显示隐藏
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
            } catch (e) { throw e }
        },
        async showCourseSalesChange (row) {
            try {
                if (!row.showSales) {
                    row.showSales = 1
                    await this.$confirm({
                        title: '确定要隐藏该课程的实际销量？',
                        message: '隐藏后订购量再商城的列表页和详情页中均不展示'
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
        async search (page) {
            this.emptyText = '未搜索到相关课程'
            await this.getGoods(page)
        },
        async goEdit (row) {
            if (row.productStatus === 1 || row.productStatus === 3) {
                this.$router.push({ name: 'EditCourses', params: { id: row.id }, query: { toName: this.$route.name } })
            } else {
                await this.$confirm('课程信息下架后可修改，您是否确定要下架课程进行编辑吗？')
                await updateGoodsStatus(1, [row.id])
                this.$router.push({ name: 'EditCourses', params: { id: row.id }, query: { toName: this.$route.name } })
            }
        },
        async getGoods (page) {
            try {
                this.filter.current = page || this.filter.current
                if (this.filter.productStatus === 3) {
                    this.filter.recommendStatus = ''
                }
                const res = await getGoods(this.filter)
                for (const item of res.result.records) {
                    // 准备好二维码字段
                    item.qrcode = ''
                    item.productLink = `${ this.mallUrl }/detail/product/${ item.id }?noCache=${ Date.now() }`
                    // 设置名额警告
                    item.sellOut = item.skuEntityList.filter(item => item.stock === 0)
                    item.stockWarning = item.skuEntityList.filter(item => item.stock <= 5)
                    // 设置编辑名额时需要的属性
                    item.sort = 1
                    for (const skuItem of item.skuEntityList) {
                        skuItem.num = 0
                        skuItem.stockRevise = skuItem.stock
                    }
                }
                this.table = res.result.records
                this.total = res.result.total
                if (res.result.records.length === 0 && this.filter.current > 1) {
                    this.filter.current = this.filter.current - 1
                    await this.getGoods()
                }
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
                    this.$success('编辑名额成功')
                    await this.getGoods()
                } catch (e) {
                    throw e
                }
            }
            this.showEditStock = false
        },
        dateChange ({ start, end }) {
            this.filter.startTime = start
            this.filter.endTime = end
            this.search(1)
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
            if (type === 0 && row.productStatus === 2 && this.$route.name !== 'DraftBoxCourses') {
                this.$alert('下架课程后可删除课程')
                return
            }

            try {
                if (type === 1) {
                    const data = await getIsActivityProduct(row.id)
                    if (data && data.result) {
                        await this.$confirm({
                            title: '确认要下架这个课程吗？',
                            message: '该课程正在参与营销活动，下架后课程将从营销活动中删除'
                        })
                    } else {
                        await this.$confirm({
                            title: '确认要下架这个课程吗？',
                            message: '该课程下架后，在店铺中用户不可再进行下单操作'
                        })
                    }
                }
                if (type === 0 && this.$route.name !== 'DraftBoxCourses') {
                    await this.$confirm({
                        title: '确认要删除这个课程吗？',
                        message: '该课程被删除后不可恢复'
                    })
                }
                if (type === 0 && this.$route.name === 'DraftBoxCourses') {
                    await this.$confirm({
                        title: '确认要删除这个课程草稿吗？',
                        message: '该课程草稿被删除后将不可恢复'
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
                        title: '确认要下架这个课程吗？',
                        message: '该课程下架后，在店铺中用户不可再进行下单操作'
                    })
                }
                if (type === 0 && this.$route.name !== 'DraftBoxCourses') {
                    await this.$confirm({
                        title: '确认要删除选择的课程吗？',
                        message: '课程被删除后不可恢复'
                    })
                }
                if (type === 0 && this.$route.name === 'DraftBoxCourses') {
                    await this.$confirm({
                        title: '确认要删除选中的课程草稿吗？',
                        message: '课程草稿被删除后将不可恢复'
                    })
                }
                await updateGoodsStatus(type, this.multipleSelectionId)
                this.$success(`课程批量${ msg[type] }成功`)
                await this.getGoods()
                this.multipleSelection = []
            } catch (e) {
                throw e
            }
        },
        async handleCopy (id) {
            try {
                const res = await copyProduct(id)
                await this.$confirm({
                    title: '已复制成功，是否进入编辑页面？',
                    message: '该课程复制后，复制课程请在-已下架中查看',
                    confirmButtonText: '编辑'
                })
                this.$router.push({ name: 'EditCourses', params: { id: res.result } })
            } catch (e) {
                throw e
            } finally {
                this.getGoods()
            }
        },
        async saleChange (order) {
            this.filter.saleSort = order
            await this.getGoods()
        },
        async categoryChange (value) {
            this.filter.categoryId = value[0] || ''
            this.filter.subCategoryId = value[1] || ''
            this.filter.current = 1
            await this.search(1)
        },
        async showShare (row) {
            this.qrcode.qrcodeText = `${ this.mallUrl }/detail/product/${ row.id }?noCache=${ Date.now() }`
            this.qrcode.qrcodeShow = true
            this.qrcode.thumbnail = row.productMainImage
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
        // 课程推荐相关
        // 取消推荐
        async cancelRecommend (id) {
            await this.$confirm('确定取消该课程推荐？')
            try {
                await cancelRecommend({ cancelList: [id], recommendType: 2 })
                this.$success('取消推荐成功')
                await this.getGoods()
            } catch (e) {
                this.$error('取消推荐失败')
            }
        },
        // 设置推荐表格展示
        async openRecommendDialog (row) {
            if (row.productStatus !== 2) {
                this.$warning('请上架课程后，再进行课程推荐')
                return false
            }
            // 课程类型为2
            const data = await getCurrentNumber({ recommendType: 2 })
            if (data.result) {
                this.recommendNumberInfo = data.result
                if (!this.recommendNumberInfo.canAdd) {
                    this.$alert('榜单课程已满30，请整理榜单后重新加入')
                    return false
                }
                row.sort = this.recommendNumberInfo.nextNumber
            }
            this.recommendTable = [row]
            await this.getSearchData()
            await this.searchProduct()
            this.recommendVisible = true
        },
        // 设置推荐
        async setRecommend (id, sort) {
            try {
                await createAddRecommend({ productId: id, serialNo: sort, recommendType: 2 })
                await this.getGoods()
                this.recommendVisible = false
            } catch (e) {
                this.$error('设置推荐失败')
            }
        },
        // 获取已推荐基础数据
        async getSearchData () {
            const data = await getDataDictionary('courseType')
            this.recommendProductType = data.result || []
            const res = await getCategoryTreePlatform()
            if (res && res.result && res.result.length) {
                res.result.unshift({ categoryName: '全部分类', id: '' })
                this.categoryList = res.result
            }
        },
        // 搜索课程以便展示推荐
        async searchProduct () {
            try {
                const data = await getRecommendProduct(this.recommendedForm)
                if (data && data.result && data.result.records) {
                    // 如果当前页面没有数据，且页码大于1，则请求上一页
                    if (data.result.records.length === 0 && this.recommendedForm.current > 1) {
                        this.recommendedForm.current--
                        this.searchProduct()
                        return
                    }
                    this.recommendedTable = data.result.records
                    this.recommendTotal = data.result.total
                } else {
                    this.recommendedTable = []
                    this.recommendTotal = 0
                }
            } catch (e) {
                throw e
            }
        },
        refreshProduct () {
            this.recommendedForm = {
                recommendType: 2,
                categoryId: '',
                subCategoryId: '',
                productType: 'ALL_CLASS',
                productName: '',
                current: 1,
                size: 4
            }
            this.categoryArray = ['']
            this.searchProduct()
        },
        // 分页设置页码并查询
        setPageSize (e) {
            this.recommendedForm.current = e
            this.searchProduct()
        },
        // 关闭弹窗并清理数据
        closeRecommendDialog () {
            this.recommendTable = []
            this.recommendedTable = []
            this.recommendedForm = {
                recommendType: 2,
                categoryId: '',
                subCategoryId: '',
                productType: 'ALL_CLASS',
                productName: '',
                current: 1,
                size: 4
            }
            this.categoryArray = ['']
            this.recommendVisible = false
            this.tabsActive = 'setRecommend'
        }
    }
}
</script>

<style lang="scss" scoped>
  .my-courses{
    min-height: calc(100vh - 110px);
    padding-bottom: 30px;
    background-color: #ffffff;
    img{
      object-fit: cover;
    }
    .mongolian{
      filter: grayscale(.5) opacity(.5);
    }
    .empty{
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 12px;
        margin-right: 8px;
      }
    }
    .product-sort{
      >div{
        display: inline-flex;
      }
    }
    .icon-gengduo {
      margin: 0 5px;
      display: inline-block;
      cursor: pointer;
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
      > svg {
        margin-right: 3px;
      }
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
        width: 90px;
        height: 60px;
        object-fit: cover;
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
      > .icon-jinggao {
        margin-right: 10px;
      }
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
    ::v-deep .el-button--mini {
      width: 66px;
    }
    ::v-deep .el-tag{
      border-radius: 0;
      // font-size: 12px;
      // height: 16px;
      // line-height: 15px
    }
    ::v-deep .el-table th.is-right {
      text-align: left
    }
    ::v-deep .el-dialog{
      .el-dialog__body{
        padding: 0 0 32px 0 !important;
        .el-form{
          padding: 12px 32px;
          border-top: 1px solid #E7E7E7;
          border-bottom: 1px solid #E7E7E7;
          .el-form-item{
            margin-bottom: 0;
          }
        }
        .text-btn{
          margin-left: 16px;
          color: $--color-primary-blue;
          font-size: 12px;
          cursor: pointer;
        }
        ::v-deep .el-pager{
          .active , & > li:hover{
            color: #EC742E;
          }
        }
      }
    }
  }
</style>
