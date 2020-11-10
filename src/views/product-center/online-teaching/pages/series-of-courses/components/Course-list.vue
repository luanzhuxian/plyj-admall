<template>
    <el-dialog
        class="select-video"
        :visible="show"
        title="课程目录"
        width="65%"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <el-table
            class="content-table"
            :data="table"
            ref="table"
            height="500px"
        >
            <el-table-column label="目录" width="60px">
                <template #default="{ row }">
                    第{{ row.sort }}节
                </template>
            </el-table-column>
            <el-table-column
                label="课节图片"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <img
                        width="60"
                        height="60"
                        v-img-error
                        v-viewer
                        :src="row.lessonsImg"
                        class="rounded-circle"
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="课节标题"
                prop="lessonsTiltle"
            />
            <el-table-column
                label="主讲人"
            >
                <template #default="{ row }">
                    {{ row.lecturer || '--' }}
                </template>
            </el-table-column>
            <el-table-column
                label="视频名称"
                prop="liveName"
            >
                <template #default="{ row }">
                    {{ row.liveName? row.liveName : '暂无待更新' }}
                </template>
            </el-table-column>
            <el-table-column
                label="视频时长"
            >
                <template #default="{ row }">
                    <template v-if="row.liveName">
                        {{ row.resourceTime > 60? `${(row.resourceTime - row.resourceTime % 60) / 60}分${row.resourceTime % 60}秒` : `${row.resourceTime}秒` }}
                    </template>
                    <template v-else>
                        --
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                label="文件大小"
            >
                <template #default="{ row }">
                    <template v-if="row.liveName">
                        {{ row.fileSize > 1048576000? `${(row.fileSize / 1024 / 1024 / 1024).toFixed(2)}G` : `${(row.fileSize / 1024 / 1024).toFixed(2)}MB` }}
                    </template>
                    <template v-else>
                        --
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="是否可试看">
                <template #default="{ row }">
                    <template v-if="row.liveName">
                        {{ row.supportWatch ? '可试看' : '不支持' }}
                    </template>
                    <template v-else>
                        --
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            :current-size="filterForm.size"
            :current-page="filterForm.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="pageChange"
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
import { getCourseDetail } from './../../../../../../apis/product-center/online-teaching/series-of-courses'
export default {
    name: 'CourseList',
    props: {
        show: Boolean,
        courseId: {// 当前系列课Id
            type: String,
            default: ''
        }
    },
    data () {
        return {
            originalTable: [],
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
                await this.getAllList()
            } else {
            }
        }
    },
    methods: {
        async getAllList () {
            try {
                const { result } = await getCourseDetail(this.courseId)
                this.originalTable = result.liveInfos.map((item, index) => {
                    const liveInfo = result.liveInfo.find(iItem => item.liveId === iItem.id)
                    return {
                        sort: index + 1,
                        lessonsImg: item.lessonsImg,
                        lessonsTiltle: item.lessonsTiltle,
                        lecturer: item.lecturer,
                        supportWatch: item.supportWatch,
                        liveName: (liveInfo && liveInfo.name) || '',
                        resourceTime: (liveInfo && liveInfo.resourceTime) || '',
                        fileSize: (liveInfo && liveInfo.fileSize) || ''
                    }
                })
                this.total = this.originalTable.length
                this.filterForm.size = 10
                this.filterForm.current = 1
                this.getList()
            } catch (e) {
                throw e
            }
        },
        getList () {
            this.table = this.originalTable.filter((item, index) => index < this.filterForm.current * this.filterForm.size && index >= this.filterForm.size * (this.filterForm.current - 1))
        },
        sizeChange (val) {
            this.filterForm.size = val
            this.getList()
        },
        pageChange (val) {
            this.filterForm.current = val
            this.getList()
        },
        closeHandler () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped lang="scss">

.content-table {
    ::v-deep .el-table__empty-block {
        min-height: 0;
    }
}

</style>
