<template>
    <div class="together wrap">

        <ListHeader icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
                    title="众志成团"
                    description="微信裂变，快速引流"
                    :start-time="start"
                    :end-time="end"
        />

        <el-button
            type="primary"
            round
            @click="$router.push({name:'AddTogether'})"
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
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filterForm.condition"
                    placeholder="搜索内容"
                    clearable
                />
            </el-form-item>
            <el-form-item

                label="活动时间："
            >
                <date-range
                    size="small"
                    :clearable="true"
                    @change="dateChange"
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
                没有查到拼团活动，请确认后重新查询！
            </span>
            <el-table-column
                prop="id"
                label="拼团编号"
                width="180"
                header-align="left"
                align="left"
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
                label="红包奖励总额"
                header-align="center"
                align="center"
            >
                <template #default="{row:{hasReward,prizeList,section}}">
                    <div v-if="hasReward === 1">
                        无
                    </div>
                    <div v-else>
                        <el-popover
                            placement="top"
                            trigger="click"
                        >
                            <ul>
                                <li v-for="(item,index) in prizeList" :key="index">
                                    满 {{ item.numberLimit }} 件,瓜分 {{ item.prize }} 元
                                </li>
                            </ul>
                            <div slot="reference">
                                <span>{{ section }}</span>
                                <el-button style="margin-left:10px !important;padding: 0px;transform: rotate(90deg);width: 23px;min-width: 0;" icon="el-icon-more" round />
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="number"
                label="拼团数量"
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
            <el-table-column
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
                align="right"
                header-align="right"
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
                                @click="$router.push({name:'TogetherBuyData', params:{id: row.id}})"
                            >
                                查看数据
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
                                <el-switch :value="row.status === 0 || row.status === 1" @change="handleConfirmEnd(row.id, row.status)" /> 结束
                            </div>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
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
        <Setting :show.sync="explainFlag" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview.vue'
import { togetherActivityPage, togetherActivityDetail, deleteActivityStatus, endActivityStatus } from '../../../../apis/marketing-manage/together'
import { getSingleGoods } from '../../../../apis/product-center/goods'
import Share from '../../../../components/common/Share'
import ListHeader from '../../../../components/marketing-manage/List-Header'
import { MutationTypes } from '../../../../store/mutation-type'
import Setting from './Together-Buy-Setting'
export default {
    name: 'TogetherBuyList',
    components: {
        GoodsPreview,
        Share,
        ListHeader,
        Setting
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
                type: '2019_02'// 新春开学季类型
            },
            tableData: [],
            showPreview: false,
            singleGoods: {},
            total: 0,
            explainFlag: false, // 活动说明弹窗
            qrcodeText: '', // 分享链接
            qrcodeShow: false, // 分享开关
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
        const togetherBuyInformation = this.marketStatusAuth.find(({ programId }) => programId === '4')
        if (!togetherBuyInformation) return
        const { createTime = '', validity = '' } = togetherBuyInformation
        this.start = createTime
        this.end = validity

        try {
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    beforeDestroy () {
        this.filterForm = {
            current: 1,
            size: 10,
            condition: '',
            status: '',
            startTime: '',
            endTime: '',
            type: '2019_02'// 新春开学季类型
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
            } catch (e) { throw e }
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
                const res = await togetherActivityPage(this.filterForm)
                res.result.records.forEach(item => {
                    item.qrcode = ''
                    item.productLink = `${ this.mallUrl }/detail/product/${ item.id }?noCache=${ Date.now() }`
                    item.iconGengduoShow = false
                })
                const tableData = res.result.records || []
                // 处理下红包奖励
                for (const [i, { hasReward, prizeList }] of tableData.entries()) {
                    if (!hasReward) {
                        if (prizeList.length === 1) {
                            tableData[i].section = `${ prizeList[0].prize } 元`
                        } else {
                            const priesArr = prizeList.map(({ prize }) => prize)
                            const priceMin = Math.min.apply([], priesArr)
                            const priceMax = Math.max.apply([], priesArr)
                            tableData[i].section = `${ priceMin }元 - ${ priceMax }元`
                        }
                    }
                }
                this.tableData = tableData
                this.total = res.result.total
            } catch (e) { throw e }
        },
        // 复制活动
        async handleCopy (id) {
            try {
                const data = await togetherActivityDetail(id)
                await this.$confirm({
                    title: '已复制，进入编辑页面修改活动时间',
                    message: '活动时间不能重复，该活动复制后，进入编辑保存成功后可在活动列表查看',
                    confirmButtonText: '编辑',
                    showClose: false
                })
                this.$router.push({ name: 'EditTogether', params: { id: data.result.id, type: 'duplicate' } })
            } catch (e) {
                throw e
            } finally {
                this.getList()
            }
        },
        async handlePreview (id, status) {
            const res = await getSingleGoods(id)
            if (status > 1) {
                res.result.activeProduct = 1
            }
            this.singleGoods = res.result
            this.showPreview = true
        },
        handleShare (row) {
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
            } catch (e) { throw e }
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
            } catch (e) { throw e }
        },
        // 确认结束本次活动
        async handleConfirmResatartd () {
            await this.$confirm({
                title: '确认要重新开启本次活动吗？',
                message: '确定重新开启本次活动，开启后用户将可继续， 已拼团付费成功用户不受此次更改影响'
            })
            await this.getList()
        },
        async copyLink (row) {
            try {
                await this.$copyText(row.productLink)
                this.$success('复制成功')
            } catch (e) {
                this.$error('复制成功失败，请手动复制')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "src/views/marketing-manage/playing-methods/together-buy/together";
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
