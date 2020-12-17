<template>
    <div class="video-course wrap">
        <div class="content">
            <search-box>
                <el-form-item label="搜索内容：">
                    <el-input
                        v-model.trim="filterForm.searchParam"
                        @change="search"
                        placeholder="请输入系列课的名称"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="分类：">
                    <SelectCategory check-strictly v-model="category" :category-type="2" @change="categoryChange" />
                </el-form-item>
                <el-form-item label="添加时间：">
                    <date-range
                        size="small"
                        :clearable="true"
                        @change="dateChange"
                        :init="initTime"
                        type="datetime"
                        range-separator="至"
                    />
                </el-form-item>

                <el-form-item label="状态：">
                    <el-select v-model="filterForm.status" @change="search">
                        <el-option label="全部" :value="''" />
                        <el-option label="出售中" :value="1" />
                        <el-option label="已下架" :value="2" />
                    </el-select>
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
                        type="primary"
                        round
                        @click="$router.push({ name: 'AddSeriesOfCourses' })"
                    >
                        新增
                    </el-button>
                    <el-button
                        type="text"
                        @click="resetFilterForm">
                        清空筛选条件
                    </el-button>
                </el-form-item>
            </search-box>
            <div>
                <el-table
                    class="content-table"
                    :data="tableData"
                    ref="table"
                >
                    <el-table-column
                        label="封面图"
                        header-align="left"
                        align="left"
                    >
                        <template #default="{ row }">
                            <img
                                width="90"
                                height="60"
                                v-img-error
                                v-viewer
                                :src="row.courseImg"
                                class="rounded-circle"
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="系列课程名称"
                        prop="courseName"
                    />
                    <el-table-column label="分类">
                        <template #default="{ row }">
                            系列课{{ row.category2Name ? `/${ row.category2Name }` : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="课程类型">
                        <template #default>
                            视频
                        </template>
                    </el-table-column>
                    <el-table-column label="课程价格（元）">
                        <template #default="{ row }">
                            {{ row.priceType === 1? row.sellingPrice : '免费' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="课程数量">
                        <template #default="{ row }">
                            {{ row.courseCount }}
                            <el-button v-if="row.courseCount" type="text" @click="checkCourses(row.id)">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="订购量"
                        width="150"
                    >
                        <template #default="{ row }">
                            {{ row.orderCount }}
                            <div style="display: inline-flex; vertical-align: middle; margin-left: 10px">
                                <el-switch @change="showCourseSalesChange(row)" v-model="row.showSales" :active-value="1" :inactive-value="0" />
                                <span class="primary-color-blue ml-10" v-if="row.showSales">显示</span>
                                <span v-else class="gray-4 ml-10">隐藏</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="添加时间"
                        prop="createTime"
                        width="140"
                    />
                    <el-table-column label="状态" width="150">
                        <template #default="{ row }">
                            {{ row.status == 1 ? '出售中' : '已下架' }}
                            <!-- 上架中 -->
                            <div
                                style="display: inline-flex; vertical-align: middle; margin-left: 10px"
                                v-if="row.status == 1"
                            >
                                <el-switch
                                    @change="showCourse(row)"
                                    :value="row.isShow"
                                    :active-value="1"
                                    :inactive-value="0"
                                />
                                <span class="primary-color-blue ml-10" v-if="row.isShow">显示</span>
                                <span v-else class="gray-4 ml-10">隐藏</span>
                            </div>
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
                                    <a @click="preview(row.id)">
                                        预览
                                    </a>
                                    <a @click="edit(row.id, row.status == 1)">
                                        编辑
                                    </a>
                                    <a v-if="row.status == 2" @click="updateStatus(row.id, 'ON')">
                                        上架
                                    </a>
                                    <a v-if="row.status == 1" @click="updateStatus(row.id, 'OFF')">
                                        下架
                                    </a>
                                    <a :key="row.id + 'delete'" @click="deleteVideo(row.id, row.status == 1, 'DELETE')">
                                        删除
                                    </a>
                                    <a @click="share(row.id)">
                                        分享
                                    </a>
                                    <a @click="showOrder(row.id)">
                                        查看订单
                                    </a>
                                    <a @click="$router.push({ name: 'CoursesSeriesDataDetail', params: { id: row.id }, query: { isFree: row.priceType === 1? '0': '1'} })">
                                        数据详情
                                    </a>
                                    <!--只有 非免费 && 上架 课程支持送课-->
                                    <a v-if="(row.status == 1) && (row.priceType === 1) && row.sellingPrice" @click="sendCourse(row.id)">
                                        送课
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
                    style="margin-top: 12px; padding-bottom: 20px; text-align: center;"
                />
            </div>

            <!--查看当前课程列表-->
            <CourseList
                :show.sync="showCourseList"
                :course-id="selectedCourseId"
            />
            <!--预览-->
            <VideoCoursePreview :show.sync="showPreview" :data="videoCourseInfo" />
            <!--分享-->
            <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
            <!--送课-->
            <SendCourse
                ref="sendCourse"
                :show.sync="showSendCourseDialog"
                :course-id="selectedCourseId"
                @confirm="getList"
            />
        </div>
    </div>
</template>

<script>
import { getSeriesCourseList, getCourseDetail, updateCourseStatus } from './../../../../../../apis/product-center/online-teaching/series-of-courses'
import { showCourse, showCourseSales } from './../../../../../../apis/product-center/online-teaching/knowledge-course'
import CourseList from './../components/Course-list'
import VideoCoursePreview from './../components/Video-Course-Preview'
import Share from './../../../../../../components/common/Share'
import SendCourse from '../../knowledge-course/components/Send-Course'
import SelectCategory from './../../../../../../components/product-center/category-manage/Select-Category.vue'

export default {
    name: 'SeriesOfCoursesList',
    components: {
        CourseList,
        VideoCoursePreview,
        Share,
        SendCourse,
        SelectCategory
    },
    data () {
        return {
            showPreview: false,
            showSendCourseDialog: false, // 是否显示送课弹框
            showCourseList: false, // 是否显示课程列表
            selectedCourseId: '', // 当前选择的课程Id
            videoCourseInfo: {},
            qrcodeShow: false,
            qrcodeText: '',
            initTime: [],
            category: [],
            filterForm: {
                current: 1,
                size: 10,
                courseType: 2,
                searchParam: '',
                categoryId: '',
                status: '',
                startTime: '',
                endTime: ''
            },
            selectedOptions: [''],
            tableData: [],
            total: 0
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
    // C 端显示隐藏
        async showCourse ({ id, isShow }) {
            try {
                const show = isShow === 1
                if (show) {
                    await this.$confirm({
                        title: '确定要隐藏该商品在商城的显示吗？',
                        message: '隐藏后用户仅在商城不可见该商品，不影响商品已参加的活动，指定发送给用户时用户可见'
                    })
                }
                await showCourse({ id, status: show ? 0 : 1 })
                this.$success(`${ show ? '隐藏' : '显示' }成功`)
                await this.getList()
            } catch (e) { throw e }
        },
        async showCourseSalesChange (row) {
            try {
                if (!row.showSales) {
                    row.showSales = 1
                    await this.$confirm({
                        title: '确定要隐藏该课程的订购量？',
                        message: '隐藏后订购量在商城的列表页和详情页中均不展示'
                    })
                    row.showSales = 0
                    await showCourseSales({ courseId: row.id, status: row.showSales })
                    this.$success('操作成功')
                } else {
                    await showCourseSales({ courseId: row.id, status: row.showSales })
                    this.$success('操作成功')
                }
            } catch (e) {
                throw e
            }
        },
        async dateChange (val) {
            try {
                this.filterForm.startTime = val.start
                this.filterForm.endTime = val.end
                await this.search()
            } catch (e) { throw e }
        },
        async search () {
            try {
                this.filterForm.current = 1
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async categoryChange (val) {
            try {
                this.filterForm.categoryId = val[1] || val[0]
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async resetFilterForm () {
            try {
                this.clearData()
                await this.search()
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
        clearData () {
            this.filterForm = {
                current: 1,
                size: 10,
                courseType: 2,
                searchParam: '',
                status: '',
                startTime: '',
                endTime: ''
            }
            this.initTime = []
            this.category = []
        },
        async getList () {
            try {
                const { result: { records, total } } = await getSeriesCourseList(this.filterForm)
                this.tableData = records || []
                this.total = total
                // 考虑到删除的情况：当列表总数大于0，且当前页没有数据时，请求前一页的数据
                if (this.total && !this.tableData.length && this.filterForm.current > 1) {
                    this.filterForm.current--
                    await this.getList()
                }
            } catch (e) {
                throw e
            }
        },
        checkCourses (id) {
            this.selectedCourseId = id
            this.showCourseList = true
        },
        async preview (id) {
            try {
                const { result } = await getCourseDetail(id)
                this.videoCourseInfo = result
                this.videoCourseInfo.allLiveInfo = result.liveInfos.map((item, index) => {
                    const liveInfo = result.liveInfo.find(iItem => item.liveId === iItem.id)
                    return {
                        sort: index + 1,
                        liveId: item.liveId,
                        lessonsImg: item.lessonsImg,
                        lessonsTiltle: item.lessonsTiltle,
                        lecturer: item.lecturer,
                        supportWatch: item.supportWatch,
                        liveName: (liveInfo && liveInfo.name) || '',
                        resourceTime: (liveInfo && liveInfo.resourceTime) || '',
                        fileSize: (liveInfo && liveInfo.fileSize) || ''
                    }
                })
                this.showPreview = true
            } catch (e) {
                throw e
            }
        },
        async edit (id, isOn) {
            try {
                if (isOn) {
                    await this.$confirm({
                        title: '',
                        message: '课程资源下架后可修改，您是否确定要下架后进行编辑吗？'
                    })
                    await updateCourseStatus(id, 'OFF')
                }
                this.$router.push({ name: 'EditSeriesOfCourses', params: { id } })
            } catch (e) {
                throw e
            }
        },
        async deleteVideo (id, isOn, operate) {
            try {
                if (isOn) {
                    await this.$alert('系列课下架后可删除')
                    return
                }
                await this.$confirm({
                    title: '确认删除该视频课程',
                    message: '删除后将不可恢复？'
                })
                await updateCourseStatus(id, operate)
                this.$success('删除成功')
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async updateStatus (id, operate) {
            try {
                if (operate === 'OFF') {
                    await this.$confirm({
                        title: '确定要下架该系列课吗？',
                        message: '下架后用户将无法正常购买该系列课。'
                    })
                }
                await updateCourseStatus(id, operate)
                await this.getList()
                this.$success('操作成功')
            } catch (e) {
                throw e
            }
        },
        share (id) {
            this.qrcodeText = `${ this.$store.getters['user/mallUrl'] }/detail/curriculum/${ id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        },
        showOrder (id) {
            this.$router.push({ name: 'OnlineSchoolOrder', query: { courseId: id } })
        },
        sendCourse (id) {
            this.selectedCourseId = id
            this.showSendCourseDialog = true
        }
    }
}
</script>

<style scoped lang="scss">
.video-course {
    background-color: #fff;
}

</style>
