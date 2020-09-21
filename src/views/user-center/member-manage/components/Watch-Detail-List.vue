<template>
    <el-dialog
        class="select-video"
        :visible="show"
        width="65%"
        title="查看学习进度"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <el-table
            class="content-table"
            :data="table"
            ref="table"
        >
            <el-table-column
                label="课节名称"
                prop="courseName"
            />
            <el-table-column
                label="首次观看时间"
                prop="firstViewingTime"
            />
            <el-table-column
                label="消耗流量"
                prop="dataFlowSizeShow"
            />
            <el-table-column
                label="学习进度"
                prop="learnProgress"
            />
        </el-table>
        <div class="mt-20" style="text-align: center;">
            <el-button type="primary" @click="closeHandler">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getWatchDetailList } from '../../../../apis/member'
export default {
    name: 'WatchDetailList',
    props: {
        show: Boolean,
        courseId: {
            // 当前系列课Id
            type: String,
            default: ''
        },
        userId: {
            // 当前用户id
            type: String,
            default: ''
        }
    },
    data () {
        return {
            table: [],
            total: 0
        }
    },
    watch: {
        async show (val) {
            if (val) {
                await this.getList()
            }
        }
    },
    methods: {
        async getList () {
            try {
                const { data: { result: { records, total } } } = await getWatchDetailList(this.userId, this.courseId)
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
