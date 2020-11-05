<template>
    <div class="courses-series-of-courses-data wrap">
        <PlTabs
            :value="$route.name"
            :tabs="[
                { label: '课程数据', name: 'CoursesSeriesOfCoursesData' },
                { label: '用户数据', name: 'UsersSeriesOfCoursesData' },
            ]"
            @tabClick="data => $router.push({ name: data.name })"
        />
        <div class="content">
            <search-box>
                <el-form-item label="搜索内容：">
                    <el-input
                        v-model.trim="filterForm.keyword"
                        placeholder="请输入课节的名称"
                        clearable
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
                    <el-button type="primary" round plain @click="resetFilterForm">
                        清空筛选条件
                    </el-button>
                    <el-button
                        round
                        class="button"
                        type="primary"
                        :disabled="!table.length"
                        plain
                        @click="showExport = true"
                    >
                        导出数据
                    </el-button>
                </el-form-item>
            </search-box>
            <div>
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
                        label="文件大小"
                    >
                        <template #default="{ row }">
                            <template v-if="row.videoId">
                                {{ row.videoCapacity > 1048576000? `${(row.videoCapacity / 1024 / 1024 / 1024).toFixed(2)}G` : `${(row.videoCapacity / 1024 / 1024).toFixed(2)}MB` }}
                            </template>
                            <template v-else>
                                --
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="视频时长"
                        prop="watchTime"
                    >
                        <template #default="{ row }">
                            <template v-if="row.videoId">
                                {{ row.resourceTime > 60? `${(row.resourceTime - row.resourceTime % 60) / 60}分${row.resourceTime % 60}秒` : `${row.resourceTime}秒` }}
                            </template>
                            <template v-else>
                                --
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="消耗点播流量"
                        prop="dataFlowSizeShow"
                    >
                        <template #default="{ row }">
                            <template v-if="row.videoId">
                                {{ row.dataFlowSizeShow }}
                            </template>
                            <template v-else>
                                --
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="观看学员数" align="right" header-align="right">
                        <template #default="{ row }">
                            {{ row.students }}
                            <el-button v-if="Number(row.students)" type="text" @click="checkWatchStudentList(row.videoId)">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    v-model="filterForm.current"
                    :sizes="true"
                    :total="total"
                    @sizeChange="sizeChange"
                    @change="getList"
                    style="margin-top: 12px; padding-bottom: 20px; text-align: center;"
                />
            </div>
        </div>
        <WatchStudentList
            :show.sync="showWatchStudentList"
            :course-id="id"
            :live-id="selectedSingleCourseId"
        />

        <!-- 导出 -->
        <ExportData :show.sync="showExport" :form="filterForm" @confirm="exportData" />
    </div>
</template>

<script>
import moment from 'moment'
import ExportData from '../../components/Export-Data'
import { getCourseList, exportCourseDataList } from '../../../../../../../apis/product-center/online-teaching/series-of-courses'
import { createObjectUrl } from '../../../../../../../assets/ts/upload'
import WatchStudentList from '../../components/Watch-Students-List'
export default {
    name: 'CoursesSeriesOfCoursesData',
    data () {
        return {
            showExport: false,
            id: '',
            selectedSingleCourseId: '',
            showWatchStudentList: false,
            table: [],
            total: 0,
            filterForm: {
                current: 1,
                size: 10,
                courseResourceId: '',
                keyword: ''
            }
        }
    },
    components: {
        WatchStudentList,
        ExportData
    },
    async created () {
        try {
            this.id = this.$route.params.id
            this.filterForm.courseResourceId = this.id
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    decreated () {
        this.clearData()
    },
    methods: {
        async getList () {
            try {
                const { result: { records, total } } = await getCourseList(this.filterForm)
                this.table = records
                this.total = total
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
        async resetFilterForm () {
            try {
                this.clearData()
                this.filterForm.courseResourceId = this.id
                await this.search()
            } catch (e) {
                throw e
            }
        },
        clearData () {
            this.filterForm = {
                current: 1,
                size: 10,
                keyword: ''
            }
        },
        async exportData (data) {
            try {
                const form = {
                    courseId: this.filterForm.courseResourceId,
                    type: 'NETSCHOOL',
                    keyword: data.keyword
                }
                const dataList = await exportCourseDataList(form)
                const url = createObjectUrl(dataList)
                const aElement = document.createElement('a')
                aElement.href = url
                aElement.download = `数据详情${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }..xls`
                aElement.click()
                aElement.remove()
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
        checkWatchStudentList (id) {
            this.selectedSingleCourseId = id
            this.showWatchStudentList = true
        }
    }
}
</script>

<style scoped lang="scss">
</style>
