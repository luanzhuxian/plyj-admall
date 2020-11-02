<template>
    <div class="together">
        <ListHeader icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/秒杀.png"
                    title="秒杀"
                    description="限时抢购，引导用户消费"
                    :start-time="start"
                    :end-time="end"
        />
        <el-button type="primary" round @click="$router.push({ name: 'AddSecond' })">
            新建活动
            <i class="el-icon-plus el-icon--right" />
        </el-button>
        <el-button type="text" @click="showExplanation = true">
            活动说明
        </el-button>
        <!-- <pl-tabs
            value="SecondBuyList"
            :tabs="[
                {label:'活动列表',name:'SecondBuyList'},
                {label:'活动设置',name:'SecondBuySetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        /> -->

        <search-box class="mt-24">
            <el-form-item label="活动状态：">
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
            </el-form-item>
        </search-box>
        <el-table :data="tableData" class="mt-10" stripe>
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到秒杀活动，请确认后重新查询！
            </span>
            <el-table-column
                prop="id"
                label="秒杀编号"
                width="180"
                header-align="left"
                align="left"
            />
            <el-table-column
                prop="productName"
                label="秒杀商品"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="productType"
                label="类型"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="categoryName"
                label="商品分类"
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
            />
            <el-table-column
                prop="activityTime"
                label="活动时间"
                width="300"
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
                <template #default="scope">
                    <span v-if="scope.row.status === 0">未开始</span>
                    <span v-if="scope.row.status === 1">进行中</span>
                    <span v-if="scope.row.status === 2">已结束</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="payCount"
                label="购买人数"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-column
                label="购买订单总额/元"
                width="120"
                header-align="center"
                align="center"
            >
                <template #default="{row}">
                    {{ row.payAmount/100 }}
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
                            <a
                                @click="$router.push({name:'SecondBuyDetail', params:{id: row.id}})"
                            >
                                详情
                            </a>
                            <a
                                @click="$router.push({name:'SecondBuyData', params:{id: row.id}})"
                            >
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
                            <a @click="handleCopy(row.id)">
                                复制
                            </a>
                            <a @click="handlePreview(row.productId, row.status)">
                                预览
                            </a>
                            <a @click="handleShare(row)">
                                分享
                            </a>
                            <div v-if="row.status === 0 || row.status === 1" class="switch-box">
                                <el-switch :value="row.status === 0 || row.status === 1" @change="handleConfirmEnd(row.id, row.status)" /> 结束
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
        <Setting :show.sync="showExplanation" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview.vue'
import { secondActivityPage, duplicateSecondActivity, updateActivityStatus } from '../../../../apis/marketing-manage/second'
import { getSingleGoods } from '../../../../apis/product-center/goods'
import Share from '../../../../components/common/Share'
import Setting from './Second-Buy-Setting'
import ListHeader from '../../components/List-Header'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'SecondBuyList',
    components: {
        GoodsPreview,
        Share,
        Setting,
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
                endTime: ''
            },
            tableData: [],
            showPreview: false,
            singleGoods: {},
            total: 0,
            // 分享链接
            qrcodeText: '',
            // 分享开关
            qrcodeShow: false,
            start: '',
            end: '',
            showExplanation: false
        }
    },
    computed: {
        ...mapGetters({
            mallUrl: 'user/mallUrl',
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async created () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const secondBuyInformation = this.marketStatusAuth.find(({ programId }) => programId === '3')
        if (!secondBuyInformation) return
        const { createTime = '', validity = '' } = secondBuyInformation
        this.start = createTime
        this.end = validity
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
        this.getList()
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
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
                const { result } = await secondActivityPage(this.filterForm)
                result.records.forEach(item => {
                    item.qrcode = ''
                    item.productLink = `${ this.mallUrl }/detail/product/${ item.id }?noCache=${ Date.now() }`
                    item.iconGengduoShow = false
                })
                this.tableData = result.records || []
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        // 复制活动
        async handleCopy (id) {
            try {
                const data = await duplicateSecondActivity(id)
                await this.$confirm({
                    title: '已复制，进入编辑页面修改活动时间',
                    message: '活动时间不能重复，该活动复制后，进入编辑保存成功后可在活动列表查看',
                    confirmButtonText: '编辑',
                    showClose: false
                })
                this.$router.push({ name: 'AddSecond', params: { id: data.result.id, type: 'duplicate' } })
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
                    title: '确认要结束秒杀活动吗？',
                    message: '限时秒杀活动停止后，用户不可以秒杀活动价格购买商品！ 结束后将不影响已购买秒杀商品的用户'
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
  @import "second";
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
