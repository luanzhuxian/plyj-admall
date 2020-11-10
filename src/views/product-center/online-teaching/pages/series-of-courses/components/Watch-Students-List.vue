<template>
    <el-dialog
        class="select-video"
        :visible="show"
        width="65%"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <el-table
            class="content-table"
            :data="table"
            ref="table"
        >
            <el-table-column
                label="用户昵称"
                prop="nickName"
            />
            <el-table-column
                label="真实姓名"
                prop="realName"
            >
                <template #default="{row}">
                    {{ row.realName ? row.realName : '--' }}
                </template>
            </el-table-column>
            <el-table-column
                label="手机号"
                prop="mobile"
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
                label="首次点播时间"
                prop="createTime"
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
import { getWatchStudentList } from './../../../../../../apis/product-center/online-teaching/series-of-courses'
export default {
    name: 'WatchStudentList',
    props: {
        show: Boolean,
        courseId: {// 当前系列课Id
            type: String,
            default: ''
        },
        liveId: {// 当前系列课单课节视频id
            type: String,
            default: ''
        }
    },
    data () {
        return {
            table: [],
            total: 0,
            filterForm: {
                courseResourceId: '',
                liveId: '',
                current: 1,
                size: 10
            }
        }
    },
    watch: {
        async show (val) {
            if (val) {
                this.filterForm.courseResourceId = this.courseId
                this.filterForm.liveId = this.liveId
                await this.getList()
            } else {
            }
        }
    },
    methods: {
        async getList () {
            try {
                const { result: { records, total } } = await getWatchStudentList(this.filterForm)
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
