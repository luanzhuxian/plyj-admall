<template>
    <div class="wrap">
        <div class="list-header">
            <div class="header">
                <img width="48" class="mr-10" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公众号增粉.png">
                <div>
                    <div class="font-weight-bold">公众号增粉</div>
                    <div class="description">商城引导关注服务号，快速增粉</div>
                </div>
            </div>
            <div class="active-time">
                <!-- <pl-svg width="16" name="icon-riqi" fill="#999" class="mr-10" /> -->
                有效期：长期有效
            </div>
        </div>
        <el-button type="primary" round @click="$router.push({ name: 'MpWeixinAdd' })">
            新建活动
            <i class="el-icon-plus el-icon--right" />
        </el-button>
        <el-button type="text" @click="showExplanation = true">
            活动说明
        </el-button>
        <el-table :data="tableData">
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                暂未创建公众号增粉活动！
            </span>
            <el-table-column label="公众号名称" prop="name" align="left" header-align="left" />
            <el-table-column label="活动时间">
                长期有效
            </el-table-column>
            <el-table-column label="展示区域" prop="regionScope" />
            <el-table-column label="状态">
                <template #default="{row}">
                    {{ row.status === 1 ? '开启中' : '未开启' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="right" header-align="right">
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a @click="handleUpdateStatus(row.id, row.status, 1)" v-if="row.status === 0 || row.status === 2">
                                开启
                            </a>
                            <a @click="handleUpdateStatus(row.id, row.status, 2)" v-if="row.status === 1">
                                关闭
                            </a>
                            <a @click="$router.push({name: 'MpWeixinEdit', params: {id: row.id}})">
                                编辑
                            </a>
                            <a @click="handleUpdateStatus(row.id, row.status, 3)" v-if="row.status !== 3">
                                删除
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            v-model="pagination.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="query"
        />
        <MpWeixinSetting :show.sync="showExplanation" />
    </div>
</template>
<script>
import MpWeixinSetting from './Setting'
import Pagination from '../../../../components/common/Pagination.vue'
import { mpWeixinQuery, updateMmpWeixinStatus } from '../../../../apis/marketing-manage/mp-weixin'
export default {
    name: 'List',
    components: {
        MpWeixinSetting,
        Pagination
    },
    data () {
        return {
            tableData: [],
            showExplanation: false,
            pagination: {
                current: 1,
                size: 10
            },
            total: 0
        }
    },
    created () {
        this.query()
    },
    methods: {
        async sizeChange (val) {
            this.pagination.current = 1
            this.pagination.size = val
            try {
                await this.query()
            } catch (e) {
                throw e
            }
        },
        async query () {
            try {
                const { result } = await mpWeixinQuery(this.pagination)
                result.records && result.records.forEach(item => {
                    const arr = []
                    item.regionScope.includes('1') && arr.push('商城首页')
                    item.regionScope.includes('2') && arr.push('商品详情页底部')
                    item.regionScope.includes('3') && arr.push('直播界面')
                    item.regionScope = arr.join('，')
                })
                this.tableData = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        async handleUpdateStatus (id, status, updateStatus) {
            if (updateStatus === 2) {
                await this.$confirm({
                    title: '关闭',
                    message: '确认要关闭此公众号增粉活动吗？'
                })
            }
            if (updateStatus === 3) {
                await this.$confirm({
                    title: '删除',
                    message: status === 1 ? '开启中，确认要删除此公众号增粉活动吗？' : '确认要删除此公众号增粉活动吗？'
                })
            }
            await updateMmpWeixinStatus(id, { status: updateStatus })
            if (updateStatus === 1) await this.$success('已开启')
            if (updateStatus === 2) await this.$success('已关闭')
            if (updateStatus === 3) {
                await this.$success('删除成功')
                if (this.tableData.length === 1 && this.pagination.current !== 1) this.pagination.current--
            }
            this.query()
        }
    }
}
</script>

<style lang="scss" scoped>
    .list-header {
        background: #F5F6FA;
        display: flex;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        .header{
            display: flex;
            align-items: center;
        }
        .description {
            font-size: 12px;
            color: #A8A8A8;
            margin-top: 4px;
        }
    }
    .active-time{
        font-size: 12px;
        color: #999;
        margin-left: 100px;
        margin-top: 10px;
    }
</style>
