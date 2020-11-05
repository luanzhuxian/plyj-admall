<template>
    <div class="wrap">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filterForm.keyword"
                    placeholder="请输入活动名称"
                    clearable
                    @input="nameInput"
                />
            </el-form-item>
            <el-form-item label="活动状态：">
                <el-select
                    v-model="filterForm.activityStatus"
                    placeholder="请选择"
                    @change="search"
                    clearable
                >
                    <el-option
                        key="全部"
                        label="全部"
                        value=""
                    />
                    <el-option
                        key="暂停"
                        label="暂停"
                        value="PAUSE"
                    />
                    <el-option
                        key="开启"
                        label="开启"
                        value="OPEN"
                    />
                    <el-option
                        key="结束"
                        label="结束"
                        value="END"
                    />
                </el-select>
            </el-form-item>
            <br>
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
        <el-button
            round
            type="primary"
            @click="$router.push({name:'AddMarketing'})"
            style="margin-top: 20px;"
        >
            新建活动 <i class="el-icon-plus el-icon--right" />
        </el-button>
        <el-table
            :data="tableData"
            class="mt-10"
            stripe
        >
            <el-table-column
                prop="activityName"
                label="活动名称"
                size="small"
            />
            <el-table-column
                prop="activityStartTime"
                label="开始时间"
                width="250"
            />
            <el-table-column
                prop="activityEndTime"
                label="结束时间"
                width="250"
            />
            <el-table-column
                prop="activeObject"
                label="活动对象"
                width="150"
            />
            <el-table-column
                label="活动状态"
                width="120"
            >
                <template slot-scope="scope">
                    <span v-text="statusMap[scope.row.activityStatus]" />
                </template>
            </el-table-column>
            <el-table-column
                prop="productNum"
                label="已添加商品数"
                width="150"
            />
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
                                @click="$router.push({name:'EditMarketing', params:{id: row.id}})"
                            >
                                编辑
                            </a>
                            <a
                                @click="changeStatus(row.id, row.activityStatus)"
                            >
                                {{ row.activityStatus === 'OPEN' ? '暂停活动' : '开启活动' }}
                            </a>
                            <a
                                @click="removeActive(row.id)"
                            >
                                删除
                            </a>
                            <!--TODO.后台暂不支持-->
                            <!--<a
                                v-if="false"
                                @click="$router.push({name:'MarketingManageData', params:{id: row.id}})"
                            >
                                查看数据
                            </a>-->
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            @change="getList"
            :total="total"
            v-model="filterForm.current"
        />
    </div>
</template>

<script>
import {
    removeMarketingActivityProduct,
    marketingActivityPage,
    updateMarketingActivityStatus
} from '../../../../apis/marketing-manage/helper'
import { DelayExec } from '../../../../assets/ts/utils'
const delay = new DelayExec(300)

export default {
    data () {
        return {
            statusMap: {
                PAUSE: '暂停',
                OPEN: '开启',
                END: '结束'
            },
            formInline: {
                user: '',
                region: '',
                startDate: '',
                endDate: ''
            },
            filterForm: {
                current: 1,
                size: 10,
                keyword: '',
                activityStatus: ''
                // startTime: '',
                // endTime: ''
            },
            // endDate: "",
            tableData: [],
            total: 0
        }
    },
    async created () {
        this.getList()
    },
    decreated () {
    // 重置搜索条件
        this.filterForm = {
            current: 1,
            size: 10,
            keyword: '',
            activityStatus: ''
        }
    },
    methods: {
        search () {
            this.filterForm.current = 1
            this.getList()
        },
        async getList () {
            const res = await marketingActivityPage(this.filterForm)
            this.tableData = res.result.records
            this.total = res.result.total
            for (const item of this.tableData) {
                item.activeObject = 'Helper'
            }
        },
        // 修改活动状态
        async changeStatus (id, status) {
            if (status === 'END') {
                return this.$alert('活动已结束，无法操作')
            }
            await this.$confirm({
                title: `确定${ status === 'OPEN' ? '暂停活动' : '开启活动' }吗?`
            })

            try {
                await updateMarketingActivityStatus({ id, status })
                this.getList()
                this.$success('操作成功')
            } catch (e) {
                throw e
            }
        },
        // 删除当前活动
        async removeActive (id) {
            try {
                await this.$confirm('确定删除吗？')
                await removeMarketingActivityProduct(id)
                this.$success('删除成功')
                this.getList()
            } catch (e) {
                throw e
            }
        },
        async nameInput () {
            this.filterForm.current = 1
            await delay.exec()
            this.getList()
        }
    }
}
</script>

<style scoped lang="scss">
  .marketing-management{
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    background-color: #ffffff;
    ::v-deep .el-form-item__label{
      color: #333333;
      font-size: 12px;
      font-weight: bold;
    }
  }
</style>
