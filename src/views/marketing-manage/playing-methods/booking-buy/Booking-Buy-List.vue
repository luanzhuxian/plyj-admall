<template>
    <div class="wrap">
        <ListHeader icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/预购.png"
                    title="预购"
                    description="分批支付，提前享受"
                    :start-time="start"
                    :end-time="end"
        />
        <el-button
            type="primary"
            round
            @click="$router.push({name:'AddBookingBuy'})"
        >
            创建活动
            <i class="el-icon-plus el-icon--right" />
        </el-button>
        <el-button type="text" @click="explainFlag = true">
            活动说明
        </el-button>

        <search-box class="mt-24">
            <el-form-item label="状态：">
                <el-select
                    v-model="filterForm.status"
                    placeholder="请选择"
                    @change="search"
                    style="width: 128px;"
                    clearable
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
                        key="已结束"
                        label="已结束"
                        value="2"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filterForm.condition"
                    placeholder="搜索内容"
                    clearable
                />
            </el-form-item>
            <el-form-item label="活动时间：">
                <date-range
                    size="small"
                    :clearable="true"
                    @change="dateChange"
                    range-separator="至"
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button type="text" @click="resetFilter">
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="tableData" class="mt-10" ref="table">
            <span slot="empty" class="empty">
                <pl-svg width="16" name="icon-empty" style="margin-right: 4px" />
                没有查到预购活动，请确认后重新查询！
            </span>
            <el-table-column
                type="expand"
            >
                <template #default="{ row }">
                    <el-table
                        v-if="row.skuModelList && row.skuModelList.length"
                        style="width: 100%;"
                        :ref="`child-table-${row.id}`"
                        :data="row.skuModelList">
                        <el-table-column label="规格"
                                         header-align="center"
                                         align="center">
                            <template>
                                <span v-text="row.skuCode1Name" />
                                <template v-if="row.skuCode2Name">
                                    <span>/</span>
                                    <span v-text="row.skuCode2Name" />
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="depositPrice"
                            label="定金"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            prop="multipleNumber"
                            label="翻倍数量"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            prop="stock"
                            label="剩余库存"
                            header-align="center"
                            align="center"
                        />
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                label="预购编号"
                width="190"
                header-align="left"
                align="left"
            >
                <template #default="{ row }">
                    {{ row.id }}
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="活动状态"
                width="140"
                header-align="center"
                align="center"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0">未开始</span>
                    <span v-if="scope.row.status === 1">进行中</span>
                    <span v-if="scope.row.status === 2">已结束</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="productName"
                label="商品名称"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="payCount"
                label="购买商品数量"
                header-align="center"
                align="center"
            />
            <el-table-column
                label="尾款支付"
                header-align="center"
                align="center"
            >
                <template #default="{row}">
                    {{ row.payMethod === 0 ? '线上' : '线下' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="togetherDate"
                label="活动时间"
                width="360"
                header-align="center"
                align="center"
            >
                <template slot-scope="scope">
                    {{ scope.row.activityStartTime }} - {{ scope.row.activityEndTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a @click="$router.push({name:'EditBookingBuy', params:{id: row.id}})"
                               v-if="row.status === 0 || row.status === 1"
                            >
                                编辑
                            </a>
                            <a @click="$router.push({name: 'BookingBuyDetail', params: { id: row.id }})">
                                详情
                            </a>
                            <a @click="$router.push({name: 'BookingBuyData', params: { id: row.id }})">
                                查看数据
                            </a>
                            <!-- 未开始/已结束的活动均支持删除 -->
                            <a
                                v-if="row.status === 0 || row.status === 2"
                                :key="row.id"
                                @click="deleteData(row.id, row.status)"
                            >
                                删除
                            </a>
                            <a
                                @click="handleCopy(row.id)"
                            >
                                复制
                            </a>
                            <a
                                @click="handlePreview(row.productId, row.status)"
                            >
                                预览
                            </a>
                            <a
                                @click="handleShare(row)"
                            >
                                分享
                            </a>
                            <div v-if="row.status === 0 || row.status === 1" class="switch-box">
                                <el-switch :value="row.status === 0 || row.status === 1" @change="handleConfirmEnd(row.id, row.status)" /> 结束
                            </div>
                            <!-- 活动中/进行中 的活动均支持手动结束 -->
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

        <!--活动说明弹窗-->
        <el-dialog
            :visible.sync="explainFlag"
            width="50%"
            class="explain"
        >
            <div class="title" slot="title">
                <pl-svg name="icon-jinggao" class="tips-icon mr-10" fill="#ec742e" width="32" style="margin-right: 10px;" />
                <span>活动说明</span>
            </div>
            <div class="explain-content" slot="">
                <ul>
                    <li>活动说明：</li>
                    <li>1.设置活动，活动定金支付金额，可设置翻倍金额，支持任何商品；</li>
                    <li>2.活动期间购买只需缴纳定金（不可退）；</li>
                    <li>3.线下支付该阶段尾款（订单核销）,或核销时间内线上支付尾款；</li>
                    <li>4.结束以时间和数量购买完截止；</li>
                </ul>
                <div>*商品可设置限购，活动可在活动页核销或订单页核销</div>
                <ul>
                    <li>活动设置：</li>
                    <li>第一步    打开“营销中心”，找到“预购”活动；</li>
                    <li>第二步    点开“创建活动”，开始创建活动；</li>
                    <li>1.活动细则，该活动细则在活动期间将在用户端显示；</li>
                    <li>2.选择适合用户，可以选择helper用户，全部用户，普通会员，选择某些分组可见；</li>
                    <li>3.选择活动商品，默认所有商品规格均有，设置活动总库存为该商品下所有规格商品的总库存，库存售罄活动完成；</li>
                    <li>4.设置限购，一个用户限制购买几个商品；</li>
                    <li>5.选择商品预交定金金额，活动期间支付定金，支付尾款阶段支付商品尾款，设置定金翻倍金额，设置翻倍后，尾款支付将减去定金和翻倍金额支付；</li>
                    <li>6.选择活动时间，指在该时间段内，该商品以活动价显示，选择补尾款时间，在该时间内补交尾款；</li>
                    <li>7.活动预热，设置该时间后，将在活动开始前显示该活动预告；</li>
                </ul>
            </div>
            <div class="footer">
                <el-button type="primary" round @click="explainFlag = false">
                    我知道了
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview.vue'
import Share from '../../../../components/common/Share'
import ListHeader from '../../components/List-Header'
import { bookingActivityPage, duplicateBookingActivity, updateActivityStatus } from '../../../../apis/marketing-manage/booking'
import { getSingleGoods } from '../../../../apis/product-center/goods'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'BookingBuyList',
    components: {
        GoodsPreview,
        Share,
        ListHeader
    },
    data () {
        return {
            filterForm: {
                current: 1,
                size: 10,
                condition: '',
                status: '',
                startTime: '',
                endTime: '',
                // 新春开学季类型
                type: '2019_02'
            },
            tableData: [],
            singleGoods: {},
            total: 0,
            showPreview: false,
            // 活动说明弹窗
            explainFlag: false,
            // 分享链接
            qrcodeText: '',
            // 分享开关
            qrcodeShow: false,
            start: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth',
            mallUrl: 'user/mallUrl'
        })
    },
    async created () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const bookingBuyInformation = this.marketStatusAuth.find(({ programId }) => programId === '5')
        if (!bookingBuyInformation) return
        const { createTime = '', validity = '' } = bookingBuyInformation
        this.start = createTime
        this.end = validity
        this.getList()
    },
    beforeDestroy () {
        this.filterForm = {
            current: 1,
            size: 10,
            condition: '',
            status: '',
            startTime: '',
            endTime: '',
            // 新春开学季类型
            type: '2019_02'
        }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
        iconGengduoEnter (row) {
            row.iconGengduoShow = true
        },
        iconGengduoLeave (row) {
            row.iconGengduoShow = false
        },
        resetFilter () {
            this.filterForm = {
                current: 1,
                size: 10,
                condition: '',
                status: '',
                startTime: '',
                endTime: '',
                // 新春开学季类型
                type: '2019_02'
            }
            this.$refs.dateRange.clear()
            this.getList()
        },
        async dateChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.startTime = val.start
                this.filterForm.endTime = val.end
                await this.getList()
            } catch (e) { throw e }
        },
        async search () {
            try {
                this.filterForm.current = 1
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.size = val
                await this.getList()
            } catch (e) { throw e }
        },
        // 获取列表数据
        async getList () {
            try {
                const { result } = await bookingActivityPage(this.filterForm)
                result.records.forEach(item => {
                    item.qrcode = ''
                    item.productLink = `${ this.mallUrl }/detail/product/${ item.id }?noCache=${ Date.now() }`
                    item.iconGengduoShow = false
                })
                this.tableData = result.records || []
                this.total = result.total
            } catch (e) { throw e }
        },
        expendSku (row) {
            row.expanded = !row.expanded
            this.$refs.skuTable.toggleRowExpansion(row, row.expanded)
            // 订单子表关闭后，也关闭商品子表
            if (!row.expanded) {
                row.skuModelList.forEach(item => {
                    item.expanded = false
                })
            }
        },
        // 复制活动
        async handleCopy (id) {
            try {
                const data = await duplicateBookingActivity(id)
                await this.$confirm({
                    title: '已复制，进入编辑页面修改活动时间',
                    message: '活动时间不能重复，该活动复制后，进入编辑保存成功后可在活动列表查看',
                    confirmButtonText: '编辑',
                    showClose: false
                })
                this.$router.push({ name: 'EditBookingBuy', params: { id: data.result.id, type: 'duplicate' } })
            } catch (e) {
                throw e
            } finally {
                this.getList()
            }
        },
        async handlePreview (id, status) {
            const { result } = await getSingleGoods(id)
            if (status > 1) {
                result.activeProduct = 1
            }
            this.singleGoods = result
            this.showPreview = true
        },
        async handleShare (row) {
            this.qrcodeText = `${ this.mallUrl }/detail/product/${ row.productId }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        },
        // 删除活动
        async deleteData (id, status) {
            try {
                // status 0-未开始 1-进行中 2-已结束

                // setStatus 4-软删除 5-物理删除

                let setStatus
                // 未开始 的活动做删除操作为 物理删除，数据库也会清除该活动
                if (status === 0) {
                    await this.$confirm('确认要删除此活动吗？')
                    setStatus = 5
                }

                // 已结束 的活动做删除操作为 软删除
                if (status === 2) {
                    await this.$confirm({
                        title: '确认要删除此活动吗？',
                        message: '活动删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                    })
                    setStatus = 4
                }
                await updateActivityStatus({ id, status: setStatus })
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
                    message: '结束活动将不影响已付费成功用户'
                })
                await updateActivityStatus({ id, status: 2 })
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
                    message: '确定重新开启本次活动，开启后用户将可继续， 已付费成功用户不受此次更改影响'
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
  @import "booking";
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
  .explain {
    .title {
      display: flex;
      align-items: center;
      > span {
        color: #333333;
        font-size: 18px;
        font-weight: bold;
      }
      > i {
        font-size: 32px;
        color: #EC742E;
        margin-right: 10px;
      }
    }
    .footer {
      text-align: center;
    }
    ::v-deep.el-dialog__body {
      padding: 0 65px 32px 65px;
      > .explain-content {
        > div {
          color: #EC742E;
          margin-bottom: 20px;
        }
        > ul {
          > li {
            margin-bottom: 20px;
          }
          > li:nth-of-type(1) {
            font-size: 16px;
            font-weight: 800;
          }
        }
      }
    }
  }
</style>
