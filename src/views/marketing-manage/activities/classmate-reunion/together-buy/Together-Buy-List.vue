<template>
    <div class="together">
        <div class="together-top">
            <div class="together-top-left">
                <div class="together-top-title">
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/marketing-gameplay/icon_together.png">
                    众志成团 <span>- 微信裂变，快速引流</span>
                </div>
                <div class="activity-date">
                    <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />使用有效期：{{ start | dateFormat('YYYY.MM.DD') }} - {{ end | dateFormat('YYYY.MM.DD') }}
                </div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="$router.push({name:'AddTogether'})"
                    class="add-btn"
                >
                    新建拼团
                    <i class="el-icon-plus el-icon--right" />
                </el-button>
            </div>
        </div>
        <div class="together-tab">
            <div class="tab current">
                活动列表
            </div>
        </div>
        <el-form
            :inline="true"
            :model="filterForm"
            class="wrap border-bottom mb-20"
        >
            <el-form-item
                class="mb-0"
                label=""
            >
                <el-select
                    v-model="filterForm.status"
                    placeholder="请选择"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        key="全部活动"
                        label="全部活动"
                        value=""
                    />
                    <el-option
                        key="未开始"
                        label="未开始"
                        value="0"
                    />
                    <el-option
                        key="进行中"
                        label="进行中"
                        value="1"
                    />
                    <el-option
                        key="已成功"
                        label="已成功"
                        value="2"
                    />
                    <el-option
                        key="已结束"
                        label="已结束"
                        value="3"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input
                    style="width: 180px;"
                    v-model="filterForm.condition"
                    placeholder="搜索内容"
                    clearable
                />
            </el-form-item>
            <el-form-item
                class="mb-0"
                label="活动时间："
            >
                <date-range
                    size="small"
                    :clearable="true"
                    @change="dateChange"
                />
            </el-form-item>
            <el-form-item class="mb-0">
                <el-button
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" class="mt-10" stripe>
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到拼团活动，请确认后重新查询！
            </span>
            <el-table-column
                prop="id"
                label="拼团编号"
                width="180"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="status"
                label="活动状态"
                width="100"
                header-align="center"
                align="center"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0">未开始</span>
                    <span v-if="scope.row.status === 1">进行中</span>
                    <span v-if="scope.row.status === 2">已成功</span>
                    <span v-if="scope.row.status === 3">已结束</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="productName"
                label="拼团商品"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="payCount"
                label="拼团人数"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="stock"
                label="人数上限"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="price"
                label="拼团单价"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-columna
                prop="totalAmount"
                label="拼团总价"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="overStock"
                label="剩余库存"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    {{ row.overStock - row.number }}
                </template>
            </el-table-column>
            <el-table-column
                prop="togetherDate"
                label="活动时间"
                width="300"
                header-align="center"
                align="center"
            >
                <template slot-scope="scope">
                    {{ scope.row.activityStartTime }} - {{ scope.row.activityEndTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                @click="$router.push({name:'TogetherBuyDetail', params:{id: row.id}})"
                            >
                                详情
                            </a>
                            <a
                                @click="$router.push({name:'TogetherBuyDetail', params:{id: row.id}})"
                            >
                                查看
                            </a>
                            <a
                                @click="$router.push({name:'TogetherBuyData', params:{id: row.id}})"
                            >
                                数据
                            </a>
                            <!-- 未开始/已成功/已结束的活动均支持删除 -->
                            <a
                                v-if="row.status === 0 || row.status === 2 || row.status === 3"
                                :key="row.id"
                                @click="deleteData(row.id, row.status)"
                            >
                                删除
                            </a>
                            <a @click="handleCopy(row.id)">
                                复制
                            </a>
                            <a @click="handlePreview(row.productId, row.status)">
                                预览
                            </a>
                            <a @click="handleShare(row)">
                                分享
                            </a>
                            <!-- 进行中 + 未开始 活动均支持结束操作 -->
                            <div v-if="row.status === 0 || row.status === 1" class="switch-box">
                                <el-switch :value="row.status === 0 ||row.status === 1" @change="handleConfirmEnd(row.id, row.status)" /> 结束
                            </div>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-model="filterForm.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="getList"
            style="margin-top: 12px;text-align: center;"
        />
        <GoodsPreview
            :show.sync="showPreview"
            :data="singleGoods"
        />
        <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GoodsPreview from '../../../../../components/product-center/goods/Goods-Preview.vue'
import { togetherActivityPage, togetherActivityDetail, deleteActivityStatus, endActivityStatus } from '../../../../../apis/marketing-manage/together'
import { getSingleGoods } from '../../../../../apis/product-center/goods'
import Share from '../../../../../components/common/Share'
import { MutationTypes } from '../../../../../store/mutation-type'
export default {
    name: 'TogetherBuyList',
    components: {
        GoodsPreview,
        Share
    },
    data () {
        return {
            filterForm: {
                current: 1,
                size: 10,
                condition: '',
                status: '',
                startTime: '',
                endTime: ''
            },
            tableData: [],
            showPreview: false,
            singleGoods: {},
            total: 0,
            qrcodeText: '', // 分享链接
            qrcodeShow: false, // 分享开关
            start: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters({
            mallUrl: 'user/mallUrl',
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async created () {
        if (!this.marketStatusAuth) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const togetherBuyInformation = this.marketStatusAuth.find(({ programId }) => programId === '4')
        this.start = togetherBuyInformation.createTime || ''
        this.end = togetherBuyInformation.validity || ''
        this.getList()
    },
    deactivated () {
        this.filterForm = {
            current: 1,
            size: 10,
            condition: '',
            status: '',
            startTime: '',
            endTime: ''
        }
    },
    methods: {
        ...mapActions([MutationTypes.getMarketStatusAuth]),
        iconGengduoEnter (row) {
            row.iconGengduoShow = true
        },
        iconGengduoLeave (row) {
            row.iconGengduoShow = false
        },
        async dateChange (val) {
            this.filterForm.current = 1
            this.filterForm.startTime = val.start
            this.filterForm.endTime = val.end
            try {
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async search () {
            this.filterForm.current = 1
            try {
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            this.filterForm.current = 1
            this.filterForm.size = val
            try {
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        // 获取列表数据
        async getList () {
            try {
                const { data: res } = await togetherActivityPage(this.filterForm)
                res.result.records.forEach(item => {
                    item.qrcode = ''
                    item.productLink = `${ this.mallUrl }/detail/product/${ item.id }?noCache=${ Date.now() }`
                    item.iconGengduoShow = false
                })
                this.tableData = res.result.records || []
                this.total = res.result.total
            } catch (e) {
                throw e
            }
        },
        // 复制活动
        async handleCopy (id) {
            try {
                const { data } = await togetherActivityDetail(id)
                await this.$confirm({
                    title: '已复制，进入编辑页面修改活动时间',
                    message: '活动时间不能重复，该活动复制后，进入编辑保存成功后可在活动列表查看',
                    confirmButtonText: '编辑',
                    showClose: false
                })
                this.$router.push({ name: 'AddTogether', params: { id: data.result.id, type: 'duplicate' } })
            } catch (e) {
                throw e
            } finally {
                this.getList()
            }
        },
        async handlePreview (id, status) {
            const { data: res } = await getSingleGoods(id)
            if (status > 1) {
                res.result.activeProduct = 1
            }
            this.singleGoods = res.result
            this.showPreview = true
        },
        async handleShare (row) {
            this.qrcodeText = `${ this.mallUrl }/detail/product/${ row.productId }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        },
        async deleteData (id, status) {
            try {
                // status 0-未开始 1-进行中 2-已成功 3-已结束
                // setStatus 4-软删除 5-物理删除
                let setStatus
                if (status === 0) { // 未开始 的活动做删除操作为 物理删除，数据库也会清除该活动
                    await this.$confirm('确认要删除此活动吗？')
                    setStatus = 5
                }

                if (status === 2 || status === 3) { // 已结束/已成功 的活动做删除操作为 软删除
                    await this.$confirm({
                        title: '确认要删除此活动吗？',
                        message: '活动删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                    })
                    setStatus = 4
                }
                await deleteActivityStatus({ id, status: setStatus })
                this.getList()
                this.$success('操作成功')
            } catch (e) {
                throw e
            }
        },
        // 确认结束本次活动
        async handleConfirmEnd (id) {
            try {
                await this.$confirm({
                    title: '确认要结束本次活动吗？',
                    message: '结束活动将不影响已付费拼团成功用户'
                })
                await endActivityStatus({ id, status: 3 })
                this.getList()
                this.$success('操作成功')
            } catch (e) {
                throw e
            }
        },
        // 确认结束本次活动
        async handleConfirmResatartd () {
            try {
                this.$confirm({
                    title: '确认要重新开启本次活动吗？',
                    message: '确定重新开启本次活动，开启后用户将可继续， 已拼团付费成功用户不受此次更改影响'
                })
            } catch (e) {
                throw e
            } finally {
                this.getList()
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import "together";
.icon-gengduo {
  position: absolute;
  top: 50%;
  color: #007bff;
  font-weight: bolder;
  cursor: pointer;
  transform: translate(200px, -50%);
  transition: transform .3s ease;
}
::v-deep .el-table__row {
  &:hover {
    .icon-gengduo {
      transform: translate(0, -50%);
    }
  }
}
.more-ctrl {
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  a {
    line-height: 30px;
    font-size: 12px;
    padding: 0 24px;
    &:hover {
      background-color: #EEEEEE;
    }
  }
}
</style>
