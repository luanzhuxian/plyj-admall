<template>
    <div class="video-course">
        <CourseHead />
        <div class="content wrap">
            <search-box>
                <el-form-item label="搜索内容：">
                    <el-input
                        v-model.trim="filterForm.searchParam"
                        @change="search"
                        placeholder="请输入课程名称"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="分类：">
                    <SelectCategory check-strictly v-model="category" :category-type="1" @change="categoryChange" />
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="filterForm.status" @change="search">
                        <el-option label="全部" :value="''" />
                        <el-option label="出售中" :value="1" />
                        <el-option label="已下架" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间：">
                    <date-range
                        size="small"
                        :clearable="true"
                        :init="initTime"
                        @change="dateChange"
                        range-separator="至"
                    />
                </el-form-item>
                <div />
                <div />
                <el-form-item>
                    <el-button
                        round
                        type="primary"
                        @click="search"
                    >
                        查询
                    </el-button>
                    <el-button round type="primary" plain @click="resetFilterForm">
                        清空筛选条件
                    </el-button>
                    <el-button
                        round
                        type="primary"
                        @click="$router.push({ name: 'AddKnowledgeCourse' })"
                    >
                        新增
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
                        label="课程图片"
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
                        label="课程名称"
                        prop="courseName"
                    />
                    <el-table-column label="分类">
                        <template #default="{ row }">
                            知识课程{{ row.category2Name ? `/${ row.category2Name }` : '' }}
                        </template>
                    </el-table-column>
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
                    <el-table-column label="课程价格（元）">
                        <template #default="{ row }">
                            {{ row.priceType === 1? row.sellingPrice : '免费' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="订购量"
                        width="150"
                    >
                        <template #default="{ row }">
                            <div style="display:inline-flex;width: 40px">
                                {{ row.orderCount }}
                            </div>
                            <el-switch @change="showCourseSalesChange(row)" v-model="row.showSales" :active-value="1"
                                       :inactive-value="0"
                            />
                            <span class="primary-color-blue ml-10" v-if="row.showSales">显示</span>
                            <span v-else class="gray-4 ml-10">隐藏</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="false"
                        label="点播次数"
                        prop="demandCount"
                    />
                    <el-table-column
                        label="添加时间"
                        prop="createTime"
                    />
                    <el-table-column
                        label="操作"
                        align="right"
                        header-align="right"
                        width="100"
                    >
                        <template #default="{ row }">
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
                                    <a @click="$router.push({ name: 'KnowledgeCourseDetail', params: { liveId: row.liveIds }, query: { courseResourceId: row.id, isFree: row.priceType === 1? '0': '1'} })">
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
import {
    getVideoList,
    getVideoDetail,
    updateVideoStatus,
    showCourseSales,
    showCourse
} from './../../../../../../apis/product-center/online-teaching/knowledge-course'
import { mapGetters } from 'vuex'
import Share from './../../../../../../components/common/Share.vue'
import VideoCoursePreview from './../components/Video-Course-Preview'
import SendCourse from './../components/Send-Course.vue'
import SelectCategory from '../../../../../../components/category/Select-Category.vue'
import CourseHead from './../components/Course-Head'

export default {
    name: 'List',
    components: {
        Share,
        VideoCoursePreview,
        SendCourse,
        SelectCategory,
        CourseHead
    },
    data () {
        return {
            showPreview: false,
            showSendCourseDialog: false, // 是否显示送课弹框
            selectedCourseId: '', // 当前选择的课程Id
            videoCourseInfo: {},
            qrcodeShow: false,
            qrcodeText: '',
            initTime: [],
            category: [],
            filterForm: {
                current: 1,
                size: 10,
                courseType: 1,
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
    decreated () {
        this.filterForm = {
            current: 1,
            size: 10,
            courseType: 1,
            searchParam: '',
            categoryId: '',
            status: '',
            startTime: '',
            endTime: ''
        }
    },
    computed: {
        ...mapGetters('goods', ['categoryTree']),
        localCategoryTree () {
            const tree = JSON.parse(JSON.stringify(this.categoryTree))
            tree.unshift({
                id: '',
                categoryName: '全部'
            })
            return tree
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
            } catch (e) {
                throw e
            }
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
            } catch (e) {
                throw e
            }
        },
        async categoryChange (val) {
            try {
                this.filterForm.categoryId = val[1] || val[0]
                await this.search()
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
                await this.search()
            } catch (e) {
                throw e
            }
        },
        clearData () {
            this.filterForm = {
                current: 1,
                size: 10,
                courseType: 1,
                searchParam: '',
                category1: '',
                category2: '',
                status: '',
                startTime: '',
                endTime: ''
            }
            this.initTime = []
            this.category = []
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
        async getList () {
            try {
                const { result: { records, total } } = await getVideoList(this.filterForm)
                this.tableData = records || []
                this.total = total
                // 考虑到删除的情况：当列表总数大于0，且当前页没有数据时，请求前一页的数据
                if (this.total && !this.tableData.length && this.filterForm.current > 1) {
                    this.filterForm.current--
                    this.getList()
                }
            } catch (e) {
                throw e
            }
        },
        async preview (id) {
            try {
                const { result } = await getVideoDetail(id)
                this.videoCourseInfo = result
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
                        message: '单视频课程下架后可修改，您是否确定要下架后进行编辑吗？'
                    })
                    await updateVideoStatus(id, 'OFF')
                }
                this.$router.push({ name: 'EditKnowledgeCourse', params: { id } })
            } catch (e) {
                throw e
            }
        },
        async deleteVideo (id, isOn, operate) {
            try {
                if (isOn) {
                    await this.$alert('课程资源下架后可删除')
                    return
                }
                await this.$confirm({
                    title: '确定要删除单视频课程吗？',
                    message: '该视频课程删除后将不可恢复。'
                })
                await updateVideoStatus(id, operate)
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
                        title: '确定要下架该视频课程吗？',
                        message: '下架后用户将无法正常购买该视频课程。'
                    })
                }
                await updateVideoStatus(id, operate)
                await this.getList()
                this.$success('操作成功')
            } catch (e) {
                throw e
            }
        },
        async share (id) {
            this.qrcodeText = `${ this.$store.getters['user/mallUrl'] }/detail/curriculum/${ id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        },
        async showOrder (id) {
            this.$router.push({ name: 'OnlineSchoolOrder', query: { courseId: id } })
        },
        sendCourse (id) {
            this.selectedCourseId = id
            this.showSendCourseDialog = true
        }
    }
}
</script>
