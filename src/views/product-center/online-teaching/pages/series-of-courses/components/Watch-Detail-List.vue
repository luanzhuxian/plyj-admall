<template>
    <el-dialog
        class="select-video"
        :visible="show"
        width="65%"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <span style="position: absolute; top: 20px; left: 32px;">
            说明：统计流量消耗有一定的时间延迟，请耐心等待，稍后可刷新查看
        </span>
        <el-table
            class="content-table"
            :data="table"
            ref="table"
        >
            <el-table-column
                label="课节名称"
                prop="lessonsTiltle"
            />
            <el-table-column
                label="观看时长"
                prop="watchTimeShow"
            >
                <template #default="{ row }">
                    {{ row.watchTimeShow ? row.watchTimeShow : '0秒' }}
                </template>
            </el-table-column>
            <el-table-column
                label="消耗流量"
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
            <el-button type="primary" round @click="closeHandler">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getWatchDetailList } from './../../../../../../apis/product-center/online-teaching/series-of-courses'
export default {
    name: 'WatchDetailList',
    props: {
        show: Boolean,
        courseId: {// 当前系列课Id
            type: String,
            default: ''
        },
        userId: {// 当前用户id
            type: String,
            default: ''
        }
    },
    data () {
        return {
            table: [],
            total: 0,
            filterForm: {
                current: 1,
                size: 10
            }
        }
    },
    watch: {
        async show (val) {
            if (val) {
                this.filterForm = {
                    courseResourceId: this.courseId,
                    userId: this.userId,
                    current: 1,
                    size: 10
                }
                await this.getList()
            }
        }
    },
    methods: {
        async getList () {
            try {
                const { result: { records, total } } = await getWatchDetailList(this.filterForm)
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
