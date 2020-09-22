<template>
    <div class="redeem-code-list">
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filterForm.activityName"
                    placeholder="请输入兑换活动名称"
                    clearable
                />
            </el-form-item>
            <el-form-item label="状态：">
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
                        value="1"
                    />
                    <el-option
                        key="进行中"
                        label="进行中"
                        value="2"
                    />
                    <el-option
                        key="已停止"
                        label="已停止"
                        value="3"
                    />
                    <el-option
                        key="已结束"
                        label="已结束"
                        value="4"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="使用时间：">
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
                没有查到兑换活动，请确认后重新查询！
            </span>
            <el-table-column
                prop="name"
                label="兑换活动名称"
            />
            <el-table-column
                prop="exchangeCodeTotal"
                label="生成兑换码数"
                width="100"
            />
            <el-table-column
                prop="activeTotal"
                label="激活兑换码数"
                width="100"
            />
            <el-table-column
                prop="useExchangeCodeTotal"
                label="已使用兑换码数"
                width="110"
            />
            <el-table-column
                label="适用商品"
                width="115"
            >
                <template #default="scope">
                    {{ scope.row.productList.length }}
                    <el-button type="text" @click="handleViewProduct(scope.$index)" v-if="scope.row.productList.length > 0">
                        查看
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="useTotal"
                label="已兑换商品数量"
                width="110"
            />
            <el-table-column
                prop="userTotal"
                label="参与人数"
                width="100"
            />
            <el-table-column
                prop="status"
                label="活动状态"
                width="100"
            >
                <template #default="{row}">
                    <span v-if="row.status === 1">未开始</span>
                    <span v-if="row.status === 2">进行中</span>
                    <span v-if="row.status === 3">已停止</span>
                    <span v-if="row.status === 4">已结束</span>
                </template>
            </el-table-column>
            <el-table-column
                label="使用时间"
                width="300"
            >
                <template #default="{row}">
                    {{ row.startTime +' - '+ row.endTime }}
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
                                @click="$router.push({name:'RedeemCodeActivityDetail', params:{id: row.activityId}})"
                            >
                                详情
                            </a>
                            <a
                                v-if="row.status !== 3 || row.status !== 4"
                                @click="$router.push({name:'EditRedeemCode', params:{id: row.activityId}})"
                            >
                                编辑
                            </a>
                            <a
                                @click="handleCopy(row.activityId)"
                            >
                                复制
                            </a>
                            <a
                                v-if="row.status === 2"
                                @click="handleStop(row.activityId)"
                            >
                                停止
                            </a>
                            <a
                                v-if="row.status === 3"
                                @click="handleResume(row.activityId)"
                            >
                                开启
                            </a>
                            <a
                                v-if="row.status !== 4"
                                @click="handleConfirmEnd(row.activityId)"
                            >
                                结束
                            </a>
                            <a
                                v-if="row.status !== 1"
                                @click="$router.push({name:'RedeemCodeDataDetail', params:{id: row.activityId}})"
                            >
                                查看数据
                            </a>
                            <!-- 未开始/已结束的活动均支持删除 -->
                            <a
                                v-if="row.status === 4"
                                :key="row.activityId"
                                @click="handleDelete(row.activityId, row.status)"
                            >
                                删除
                            </a>
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
        <el-dialog title="查看商品" :visible.sync="showProductModal">
            <el-table :data="productList" height="450">
                <el-table-column
                    label="商品图片"
                    header-align="center"
                    align="center"
                >
                    <template #default="scope">
                        <img width="60" height="60" :src="scope.row.productMainImg">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="productName"
                    label="商品名称"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="商品类型"
                    header-align="center"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.productType === 2 ? '单课' : '系列课' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="售价(元)"
                    header-align="center"
                    align="center"
                >
                    <template #default="{row}">
                        {{ row.price / 100 }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    header-align="center"
                    align="center"
                >
                    <template #default="scope">
                        {{ STATUS_TEXT[scope.row.status] }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { getRedeemCodeData, redeemCodeEnd, redeemCodeDelete, redeemCodeStop, redeemCodeResume } from '../../../../apis/marketing-manage/redeem-code'
export default {
    name: 'RedeemCodeList',
    data () {
        return {
            filterForm: {
                current: 1,
                size: 10,
                activityName: '',
                status: '',
                startDate: '',
                endDate: ''
            },
            total: 0,
            tableData: [],
            productList: [],
            showProductModal: false,
            STATUS_TEXT: {
                1: '出售中',
                2: '已下架'
            }
        }
    },
    async created () {
        try {
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getList () {
            try {
                const { result } = await getRedeemCodeData(this.filterForm)
                this.tableData = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        async dateChange (val) {
            try {
                this.filterForm.startDate = val.start
                this.filterForm.endDate = val.end
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            try {
                this.filterForm.size = val
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async search () {
            try {
                this.filterForm.current = 1
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        handleCopy (id) {
            this.$router.push({ name: 'DuplicateRedeemCode', params: { id, type: 'duplicate' } })
        },
        async handleConfirmEnd (id) {
            try {
                await this.$confirm({
                    title: '确认要结束此活动？',
                    message: '活动结束后，用户将不可参与该活动，停止后将不影响已领取活动奖励的用户'
                })
                await redeemCodeEnd(id)
                this.$success('结束活动')
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async handleStop (id) {
            try {
                await this.$confirm('确认要停止此活动？')
                await redeemCodeStop(id)
                this.$success('停止活动')
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async handleResume (id) {
            try {
                await redeemCodeResume(id)
                this.$success('开启活动')
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async handleDelete (id) {
            try {
                await this.$confirm({
                    title: '确认删除此活动？删除后不可恢复。',
                    message: '活动删除后，将不可看活动期间的相关数据！请谨慎进行删除操作。'
                })
                await redeemCodeDelete(id)
                await this.$success('删除成功')
                if (this.tableData.length === 1 && this.filterForm.current !== 1) this.filterForm.current--
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        handleViewProduct (index) {
            this.productList = this.tableData[index].productList
            this.showProductModal = true
        }
    }
}
</script>
