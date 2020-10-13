<template>
    <div class="backorder wrap">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="form.graphicName"
                    placeholder="请输入图文名称"
                    clearable
                    @keyup.enter.native="getList"
                />
            </el-form-item>
            <el-form-item label="分类：">
                <SelectCategory v-model="category" :category-type="3" check-strictly show-all @change="categoryChange" />
            </el-form-item>
            <el-form-item label="添加时间：">
                <date-range
                    :clearable="true"
                    disable-after
                    size="small"
                    @change="dateChange"
                    start-label="申请时间："
                    range-separator="至"
                    end-label=""
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="form.status"
                    @change="search()"
                >
                    <el-option
                        value=""
                        label="全部"
                    />
                    <el-option
                        value="1"
                        label="出售中"
                    />
                    <el-option
                        value="2"
                        label="已下架"
                    />
                </el-select>
            </el-form-item>
            <div />
            <div />
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button round type="primary" @click="$router.push({name: 'AddBooksMaterials'})">
                    新增图文
                </el-button>
            </el-form-item>
            <!--      <el-form-item class="mb-0 right-btn">-->
            <!--        <el-button-->
            <!--          @click="changeExport"-->
            <!--          style="width: 98px;"-->
            <!--          type="primary"-->
            <!--          plain-->
            <!--          v-if="table && table.length"-->
            <!--        >-->
            <!--          导出售后单-->
            <!--        </el-button>-->
            <!--      </el-form-item>-->
        </search-box>
        <el-table
            size="small"
            :data="table"
        >
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到信息，请确认后重新查询！
            </span>
            <el-table-column
                label="封面图"
                width="150"
                header-align="left"
                align="left"
            >
                <template #default="{row}">
                    <img
                        height="50"
                        :src="row.graphicMainImg || row.graphicImgs[0]"
                        v-img-error
                        v-viewer
                        :class="{ mongolian: row.productStatus === 2 }"
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="图文名称"
                prop="graphicName"
                width="200"
            />
            <el-table-column
                label="分类"
                width="200"
            >
                <template #default="{row}">
                    {{ row.category2Name? `${row.category1Name}/${row.category2Name}`:row.category1Name }}
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                prop="statusText"
                width="150"
            >
                <template #default="{row}">
                    {{ row.statusText }}
                    <el-switch
                        class="switch"
                        v-model="row.isShow"
                        @change="isShowSwitchChange(row)"
                        active-color="#598BF8"
                        :active-value="1"
                        :inactive-value="0"
                    />
                    <span v-if="row.isShow" style="color: #598BF8">
                        显示
                    </span>
                    <span v-else style="color: #ccc">
                        隐藏
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="价格（元）"
                prop=""
                width="120"
            >
                <template #default="{row}">
                    {{ row.sellingPrice? row.sellingPrice: '免费' }}
                </template>
            </el-table-column>
            <el-table-column
                label="订购量"
                width="150"
            >
                <template #default="{row}">
                    {{ row.orderCount }}
                    <el-switch
                        class="switch"
                        v-model="row.showSales"
                        @change="showSalesSwitchChange(row)"
                        active-color="#598BF8"
                        :active-value="1"
                        :inactive-value="0"
                    />
                    <span v-if="row.showSales" style="color: #598BF8">
                        显示
                    </span>
                    <span v-else style="color: #ccc">
                        隐藏
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="添加时间"
                prop="createTime"
                width="200"
            />
            <el-table-column
                label="内容预览"
                prop="graphicBrief"
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
                            <a @click="preview(row)">
                                预览
                            </a>
                            <a @click="editBoosMaterials(row)">
                                编辑
                            </a>
                            <a v-if="row.status === 2" @click="updateStatusBooksMaterials(row,'ON')">
                                上架
                            </a>
                            <a v-if="row.status === 1" @click="updateStatusBooksMaterials(row,'OFF')">
                                下架
                            </a>
                            <a v-if="row.status === 2" @click="updateStatusBooksMaterials(row,'DELETE')">
                                删除
                            </a>
                            <a @click="showShare(row)">
                                分享
                            </a>
                            <a @click="$router.push({name:'OnlineSchoolOrder',params:{graphicId:row.id}})">
                                查看订单
                            </a>
                            <a @click="$router.push({name:'BooksMaterialsData',params:{id:row.id}})">
                                数据详情
                            </a>
                            <a v-if="row.status === 1 && row.sellingPrice" @click="sendBooks(row.id)">
                                赠送
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            @change="getList"
            @sizeChange="sizeChange"
            :total="total"
            :sizes="true"
            v-model="form.current"
            style="margin-bottom: 70px;"
        />
        <Share :show.sync="qrcode.qrcodeShow" :thumbnail="qrcode.thumbnail" :qrcode-text="qrcode.qrcodeText" ref="share" />
        <SendBooks
            ref="sendBooks"
            :show.sync="showSendBooks"
            :books-id="selectedBooksId"
            @confirm="search"
        />
        <BooksMaterialsPreview :show.sync="showPreview" :data="detail" />
    </div>
</template>
<script>
import SelectCategory from './../../../../../../components/category/Select-Category.vue'
import Share from './../../../../../../components/common/Share'
import SendBooks from './../components/Send-Books.vue'
import BooksMaterialsPreview from './../components/Books-Materials-Preview'
import { getBooksList, showSalesBooksMaterials, showBooksMaterials, updateStatusBooksMaterials } from './../../../../../../apis/product-center/online-teaching/books-materials'
import { mapGetters } from 'vuex'
import { resetForm } from '../../../../../../assets/ts/utils'
export default {
    name: 'BooksMaterialsList',
    components: {
        SelectCategory,
        Share,
        SendBooks,
        BooksMaterialsPreview
    },
    data () {
        return {
            category: [],
            showPreview: false,
            detail: {},
            showSendBooks: false,
            selectedBooksId: '',
            qrcode: {
                qrcodeShow: false,
                qrcodeText: '',
                thumbnail: ''
            },
            form: {
                current: 1,
                size: 10,
                status: '',
                graphicName: '',
                startTime: '',
                endTime: '',
                categoryId: '',
                subCategoryId: ''
            },
            table: [],
            total: 0
        }
    },
    computed: {
        ...mapGetters('user', ['mallUrl'])
    },
    async created () {
        try {
            await this.init()
        } catch (e) {
            throw e
        }
    },
    async activated () {
        try {
            await this.init()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async init () {
            resetForm(this.form, {
                current: 1,
                size: 10
            })
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async categoryChange (value) {
            this.form.categoryId = value[0] || ''
            this.form.subCategoryId = value[1] || ''
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async search () {
            try {
                this.form.current = 1
                this.getList()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            try {
                this.form.current = 1
                this.form.size = val
                this.getList()
            } catch (e) {
                throw e
            }
        },
        async getList () {
            try {
                const { result } = await getBooksList(this.form)
                this.table = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        sendBooks (id) {
            this.selectedBooksId = id
            this.showSendBooks = true
        },
        async editBoosMaterials (row) {
            try {
                if (row.status === 1) {
                    await this.$confirm('图文资料信息下架后可修改，您是否确定要下架图文资料进行编辑吗？')
                    await updateStatusBooksMaterials({
                        id: row.id,
                        operate: 'OFF'
                    })
                    this.$router.push({ name: 'EditBooksMaterials', params: { id: row.id } })
                } else {
                    this.$router.push({ name: 'EditBooksMaterials', params: { id: row.id } })
                }
            } catch (e) {
                throw e
            }
        },
        async updateStatusBooksMaterials (row, type) {
            try {
                const data = {
                    id: row.id,
                    operate: type
                }
                console.log(data)
                await updateStatusBooksMaterials(data)
                this.$success('操作成功')
                this.search()
            } catch (e) {
                throw e
            }
        },
        async preview (row) {
            this.detail = row
            this.showPreview = true
        },
        async showShare (row) {
            this.qrcode.qrcodeText = `${ this.mallUrl }/detail/image-text/${ row.id }?noCache=${ Date.now() }`
            this.qrcode.qrcodeShow = true
            this.qrcode.thumbnail = row.graphicMainImg || row.graphicImgs[0]
        },
        async dateChange (val) {
            try {
                this.form.startTime = val.start
                this.form.endTime = val.end
                this.getList()
            } catch (e) {
                throw e
            }
        },
        async isShowSwitchChange (row) {
            try {
                const data = {
                    id: row.id,
                    status: row.isShow
                }
                await showBooksMaterials(data)
                this.getList()
            } catch (e) {
                if (row.isShow) {
                    row.isShow = 0
                } else {
                    row.isShow = 1
                }
                throw e
            }
        },
        async showSalesSwitchChange (row) {
            try {
                const data = {
                    id: row.id,
                    status: row.showSales
                }
                await showSalesBooksMaterials(data)
                this.getList()
            } catch (e) {
                if (row.showSales) {
                    row.showSales = 0
                } else {
                    row.showSales = 1
                }
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.backorder {
    min-height: calc(100vh - 110px);
    padding-bottom: 30px;
    background-color: #fff;
    .right-btn {
        position: absolute;
        right: 40px;
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

    ::v-deep .el-table {
        .cell {
            padding: 0 !important;
        }
    }
}

</style>
