<template>
    <div class="books-materials-data wrap">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="form.keyword"
                    placeholder="请输入用户昵称/手机号"
                    clearable
                    @keyup.enter.native="search"
                />
            </el-form-item>
            <el-form-item label="首次学习时间：">
                <date-range
                    :clearable="true"
                    disable-after
                    size="small"
                    @change="dateChange"
                    start-label="首次学习时间："
                    range-separator="至"
                    end-label=""
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
                <el-button
                    round
                    type="primary"
                    plain
                    :disabled="!table.length"
                    @click="showExport = true"
                >
                    导出数据
                </el-button>
                <el-button
                    round
                    type="primary"
                    plain
                    @click="clearForm()"
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
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
                label="用户名称"
            >
                <template #default="{row}">
                    <div :class="{'is-not-watch': !row.firstStudyTime}">
                        {{ row.realName || row.nickName }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="手机号"
                prop="mobile"
                width="120"
            />
            <el-table-column prop="userTags" label="用户分组">
                <template #default="{row}">
                    <template v-if="row.userTags && row.userTags.length">
                        <div class="tag">
                            <el-popover
                                placement="bottom-end"
                                trigger="hover"
                            >
                                <ul class="tag-user-list">
                                    <li v-for="(item, index) of row.userTags" :key="index" v-text="item" />
                                </ul>
                                <div slot="reference">
                                    <span v-for="(item, index) in row.userTags.slice(0, 3)" :key="index">{{ item }} </span>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                    <div v-else>
                        无
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="支付优惠"
                prop="payDiscounts"
                width="120"
            />
            <el-table-column
                label="实付金额（元）"
                width="120"
            >
                <template #default="{ row }">
                    {{ row.payment }}
                </template>
            </el-table-column>
            <el-table-column
                label="分享人"
            >
                <template #default="{ row }">
                    {{ row.shareUserName ? row.shareUserName: '无' }}
                </template>
            </el-table-column>
            <el-table-column
                label="首次学习时间"
                prop="firstStudyTime"
                width="150"
            />
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template #default="{ row }">
                    <!--非送课学员才有订单-->
                    <el-button type="text" v-if="row.id && row.transactionId !== '0'" @click="$router.push({ name: 'OnlineSchoolOrderDetail', params: { id: row.id } })">
                        查看订单
                    </el-button>
                    <!--未观看视频学员支持取消赠送-->
                    <el-button type="text" v-if="row.transactionId === '0' && !row.firstStudyTime" @click="cancleSend(row)">
                        取消赠送
                    </el-button>
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
        <ExportOrder
            :show.sync="showExport"
            :search-form="form"
        />
    </div>
</template>
<script>
import ExportOrder from './../components/Export-Order'
import { getBooksMaterialsData, giveBooksMaterials } from './../../../../../../apis/product-center/online-teaching/books-materials'
import { resetForm } from '../../../../../../assets/ts/utils'
export default {
    name: 'BooksMaterialsData',
    components: { ExportOrder },
    data () {
        return {
            showExport: false,
            form: {
                graphicId: '',
                keyword: '',
                startTime: '',
                endTime: '',
                current: '',
                size: ''
            },
            table: [],
            total: 0
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async created () {
        this.form.graphicId = this.id
        try {
            await this.search()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async clearForm () {
            try {
                resetForm(this.form)
                await this.search()
            } catch (e) {
                throw e
            }
        },
        search () {
            this.form.current = 1
            this.getList()
        },
        sizeChange (val) {
            this.form.current = 1
            this.form.size = val
            this.getList()
        },
        async getList () {
            try {
                const { result } = await getBooksMaterialsData(this.form)
                this.table = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            this.search()
        },
        async cancleSend (row) {
            try {
                await this.$confirm('确认要取消赠送吗？')
                await giveBooksMaterials(
                    this.form.graphicId,
                    {
                        deleteUserIdList: [row.userId]
                    }
                )
                await this.search()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.books-materials-data {
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
    .is-not-watch::after {
        content: '未观看';
        display: inline-block;
        margin-right: 4px;
        padding: 0 4px;
        border: 2px solid #ec5144;
        line-height: 14px;
        font-size: 10px;
        color: #ec5144;
    }
}

</style>
