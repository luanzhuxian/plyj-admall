<template>
    <el-dialog
        class="select-video"
        :visible="show"
        width="65%"
        title="备注信息"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <p>
            <el-button
                @click="addRemark"
                type="primary"
                plain
            >
                添加备注
            </el-button>
        </p>
        <el-table
            class="content-table"
            :data="table"
            ref="table"
        >
            <el-table-column
                label="备注内容"
                prop="lessonsTiltle"
            />
            <el-table-column
                label="添加时间"
                prop="lessonsTiltle"
            />
            <el-table-column
                label="添加人"
                prop="dataFlowSizeShow"
            />
        </el-table>
        <pagination
            v-model="filterForm.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="getList"
            style="margin-top: 12px; padding-bottom: 20px; text-align: center;"
        />

        <div class="mt-20" style="text-align: center;">
            <el-button type="primary" @click="closeHandler">
                确 定
            </el-button>
        </div>
        <!--添加备注-->
        <AddRemark :show.sync="showAddRemark"
                   :user-id="userId"
                   @success="addTagSuccess"
        />
    </el-dialog>
</template>

<script>
import { getRemarkList } from '../../../../apis/member'
import AddRemark from './Add-Remark'
export default {
    name: 'WatchDetailList',
    components: {
        AddRemark
    },
    props: {
        show: Boolean,
        userId: {
            // 当前用户id
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showAddRemark: false,
            table: [],
            total: 0,
            filterForm: {
                mallUserId: '',
                current: 1,
                size: 10
            }
        }
    },
    watch: {
        async show (val) {
            if (val) {
                this.filterForm.mallUserId = this.userId
                await this.getList()
            }
        }
    },
    methods: {
        // 备注
        addRemark () {
            this.showAddRemark = true
        },
        async getList () {
            try {
                const { data: { result: { records, total } } } = await getRemarkList(this.filterForm)
                this.table = records
                this.total = total
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.size = val
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async addTagSuccess () {
            try {
                this.filterForm.current = 1
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        closeHandler () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped lang="scss">
  .tag {
    display: inline-block;
    min-width: 78px;
    margin: 0 4px 4px 0;
    padding: 0 4px;
    border: 1px solid #ec742e;
    line-height: 24px;
    font-size: 12px;
    white-space: nowrap;
    text-align: center;
    color: #ec742e;
  }
</style>
