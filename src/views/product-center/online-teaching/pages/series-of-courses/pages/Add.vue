<template>
    <div class="wrap">
        <Panel :title="id ? '编辑系列课程' : '新增系列课程'">
            <el-form
                class="wrap"
                ref="form"
                label-width="150px"
                label-position="left"
                :model="form"
                :rules="rules"
                @validate="formValidateHandler"
            >
                <el-form-item label="课程名称" prop="courseName" id="courseName">
                    <el-input
                        style="width: 267px;"
                        v-model="form.courseName"
                        placeholder="请输入课程名称"
                    />
                    <span class="tip"> （至多可输入30字的课程名称）</span>
                </el-form-item>
                <el-form-item label="课程封面" prop="courseImg" id="courseImg">
                    <ImageManager
                        v-model="form.courseMainImg"
                        need-edit
                        :width="750"
                        :height="500"
                        :box-width="100"
                        :box-height="67"
                        :count="10"
                        multiple
                        :delete-truth="!id && (!resouceId || (form.courseImg !== resouceImg))"
                        upload-text="上传封面图"
                    />
                    <p class="tip">
                        支持.jpg .jpeg .png 格式的图片，建议尺寸为750*500，图片最大不能超过2M，最多可上传10张图片；第一张图片为商品封面图片。
                    </p>
                    <MainImageTheme
                        v-if="form.courseMainImg.length"
                        :product-image="form.courseMainImg"
                        @confirm="themeConfirmHandler"
                        @cancel="themeConfirmHandler"
                        head-title="封面主题"
                        :source="2"
                        :product-main-image="form.courseImg"
                        :default-theme="form.themeModel"
                        :default-min-price="form.priceType ? form.sellingPrice || 0 : 0"
                        ref="mainImageTheme"
                    />
                </el-form-item>
                <el-form-item label="观看对象" prop="tagIds" id="tagIds">
                    <el-radio-group v-model="form.targetGroups">
                        <el-radio :label="0">
                            全部用户
                        </el-radio>
                        <el-radio :label="1">
                            Helper可用
                        </el-radio>
                        <el-radio :label="2">
                            普通会员
                        </el-radio>
                        <!--没有设置用户标签的时候，此选项不可选择-->
                        <el-radio :label="3" :disabled="!userGroup.length">
                            部分用户组可用
                        </el-radio>
                        <span style="margin-left: -15px;color: #999999;font-size: 14px;" v-if="!userGroup.length">（请先在会员中心-设置用户分组）</span>
                    </el-radio-group>
                    <UserGroup
                        v-show="form.targetGroups === 3"
                        v-model="form.tagIds"
                        @init="userGroupInit"
                    />
                </el-form-item>
                <el-form-item label="课程描述" prop="courseBrief" id="courseBrief">
                    <el-input
                        v-model="form.courseBrief"
                        type="textarea"
                        :rows="4"
                        :maxlength="50"
                        show-word-limit
                        style="width: 420px;"
                        placeholder="请输入内容"
                    />
                </el-form-item>
                <!--<el-form-item label="课程类型">
          <span>视频课程</span>
        </el-form-item>-->

                <el-form-item label="课程内容" prop="liveInfos" id="liveInfos">
                    <div>
                        <el-button type="primary" plain @click="isShowSelectVideoDigLog = true">
                            选择视频
                        </el-button>
                        <span class="tip ml-10">（已选择{{ courseContent.length }}个视频，最多上传50节）</span>
                        <p class="tip">
                            视频更新后，已购买的用户查看的已更新后的所有视频课程
                        </p>
                        <p class="tip">
                            当系列课中任一视频资源过期或删除时，则该系列课自动下架
                        </p>
                    </div>
                    <div :class="$style.videoList">
                        <div :class="{ [$style.videoItem]: true, [$style.videoHead]: true }">
                            <div :class="{ [$style.videoCell]: true }">
                                课程目录
                            </div>
                            <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                课节标题
                                <span style="color: #f56c6c;">*</span>
                            </div>
                            <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                封面图
                            </div>
                            <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                主讲人
                            </div>
                            <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                添加视频
                            </div>
                            <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                试看
                            </div>
                            <div :class="{ [$style.videoCell]: true }">
                                操作
                            </div>
                        </div>

                        <Draggable
                            :class="$style.itemWrap"
                            ref="itemWrap"
                            tag="div"
                            :list="courseContent"
                            animation="200"
                            ghost-class="ghost"
                        >
                            <el-form
                                :class="{ [$style.videoItem]: true, [$style.border]: true }"
                                v-for="(item, i) of courseContent"
                                :key="i"
                                :model="item"
                                :rules="contentRules"
                                ref="contentForm"
                                :id="`course-count-of-${i}`"
                                @validate="(prop, isPass, message) => courseFormValidateHandler(prop, isPass, message, `course-count-of-${i}`)"
                            >
                                <div
                                    :class="{ [$style.videoCell]: true }"
                                    v-text="item.name"
                                />
                                <el-form-item class="mb-0" :class="{ [$style.videoCell]: true, [$style.border]: true }" prop="title">
                                    <el-input
                                        v-model="item.title"
                                        placeholder="输入该节课标题"
                                    />
                                </el-form-item>
                                <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                    <ImageManager
                                        :count="1"
                                        v-model="item.cover"
                                        :width="700"
                                        :height="500"
                                        :box-width="70"
                                        :box-height="50"
                                        need-edit
                                        disabled-draggable
                                        :delete-truth="!id"
                                    />
                                </div>
                                <el-form-item class="mb-0" :class="{ [$style.videoCell]: true, [$style.border]: true }" prop="teacher">
                                    <el-input
                                        v-model="item.teacher"
                                        placeholder="输入该节课主讲"
                                    />
                                </el-form-item>
                                <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                    <div v-if="item.video" :class="$style.hasVideo">
                                        <pl-svg name="icon-video-24872" width="16" />
                                        <div :class="$style.videoInfo">
                                            <p :class="$style.videoName">
                                                <span v-text="item.video.name" />
                                                <el-button style="margin-left: 5px;" type="text" icon="el-icon-refresh" @click="addVideo(item, true)">
                                                    更新视频
                                                </el-button>
                                            </p>
                                            <p :class="$style.videoSize">
                                                <span v-if="item.video.resourceTime > 60" class="mr-10">{{ (item.video.resourceTime - item.video.resourceTime % 60) / 60 }}分{{ item.video.resourceTime % 60 }}秒</span>
                                                <span v-else class="mr-10">{{ item.video.resourceTime }}秒</span>
                                                <span v-if="item.video.fileSize < 1048576000">{{ (item.video.fileSize / 1024 / 1024).toFixed(2) }}MB</span>
                                                <span v-else>{{ (item.video.fileSize / 1024 / 1024 / 1024).toFixed(2) }}G</span>
                                            </p>
                                            <p v-if="item.video.resourceType === 1">
                                                永久有效
                                            </p>
                                            <div v-else style="line-height: 20px;">
                                                <p class="fz-12 gray-3">
                                                    截止时间：{{ item.video.validity }}
                                                </p>
                                                <p class="fz-12" style="color: red; line-height: 20px;" v-text="item.video.timeDesc" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else :class="$style.noVideo">
                                        <el-button type="primary" size="mini" plain @click="addVideo(item)">
                                            添加视频
                                        </el-button>
                                        <span class="tip ml-10">暂无视频，后期更新</span>
                                    </div>
                                </div>
                                <div :class="{ [$style.videoCell]: true, [$style.border]: true }">
                                    <el-tooltip
                                        v-if="item.video"
                                        class="item"
                                        effect="dark"
                                        content="用户可在购买前试看该课程，促进用户的购买"
                                        placement="bottom-start"
                                    >
                                        <div>
                                            <el-switch v-model="item.supportTrySee" :active-value="1" :inactive-value="0" />
                                            <span class="primary-color-blue ml-10" v-if="item.supportTrySee">可试看</span>
                                            <span v-else class="gray-4 ml-10">关闭</span>
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div :class="{ [$style.videoCell]: true}" @click="deleteCourse(item, i)">
                                    <el-button type="text" class="mr-10">
                                        移除
                                    </el-button>
                                    <div :class="$style.drag">
                                        <pl-svg name="icon-drag-e2b9c" width="16" />
                                    </div>
                                </div>
                            </el-form>
                        </Draggable>

                        <div :class="$style.addClass" @click="addCourse">
                            <pl-svg name="icon-jia" fill="#598BF8" width="24" />
                            <span class="ml-10">添加课节</span>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="课程价格" prop="sellingPrice" id="sellingPrice">
                    <div>
                        <el-radio-group v-model="form.priceType" :disabled="!!id" @change="priceTypeChange">
                            <el-radio :label="1">
                                付费
                            </el-radio>
                            <el-radio :label="0">
                                免费
                            </el-radio>
                        </el-radio-group>
                    </div>
                    <template v-if="form.priceType">
                        <div class="mt-10">
                            <span class="mr-10">售价</span>
                            <el-input type="number" style="width: 80px;" v-model="form.sellingPrice" />
                            <span class="ml-10">元</span>
                        </div>
                        <div class="mt-10">
                            <span class="mr-10">原价</span>
                            <el-input type="number" style="width: 80px;" v-model="form.originalPrice" />
                            <span class="ml-10">元</span>
                            <span class="ml-10 tip">（不填写则不显示课程原价信息）</span>
                        </div>
                        <p class="tip">
                            系列课购买后不限制学习时间，当视频资源过期或删除后，用户将不可观看相应的视频内容
                        </p>
                    </template>
                    <div class="mt-10" v-else>
                        <span>截止至 </span>
                        <el-date-picker
                            type="date"
                            v-model="form.validityDate"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择截止日期"
                            :default-value="videoMaxDeadline"
                            @change="deadlineChange"
                        />
                        <span> 前，用户可免费观看</span>
                        <p class="tip">
                            到达截止时间后，该课程将自动下架，所有订购该免费课程的用户，学习时间同步截止，不可继续免费观看该视频
                        </p>
                    </div>
                </el-form-item>

                <el-form-item label="定时开售" prop="regularSaleTime" id="regularSaleTime">
                    <div class="mb-10">
                        <el-checkbox v-model="form.isOpenSale" :true-label="1" :false-label="0">
                            设置开始售卖时间
                        </el-checkbox>
                        <span class="ml-10 tip">（打勾，设置开售时间后未到开售时间课程仅展示不可购买）</span>
                    </div>
                    <div v-if="form.isOpenSale">
                        <el-date-picker
                            v-model="form.regularSaleTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择售卖的开始时间"
                        />
                    </div>
                </el-form-item>

                <el-form-item label="商品隐藏" prop="isShow" id="isShow">
                    <el-checkbox v-model="form.isShow" :true-label="0" :false-label="1">
                        上架的商品设置隐藏后，在店铺内不显示，但可以通过链接的方式访问
                    </el-checkbox>
                </el-form-item>

                <el-form-item label="分类" prop="category1">
                    <SelectCategory v-model="category" show-add :category-type="2" @change="categoryChange" />
                </el-form-item>

                <el-form-item label="编辑图文详情" prop="details" id="details">
                    <PlEditor v-model="form.details" />
                </el-form-item>

                <el-form-item label="订购须知" prop="payNotice" id="payNotice">
                    <el-input
                        style="width: 500px;"
                        placeholder="请输入订购须知的内容"
                        type="textarea"
                        :rows="10"
                        :maxlength="300"
                        show-word-limit
                        v-model="form.payNotice"
                    />
                </el-form-item>
                <el-form-item label="订购量是否显示">
                    <el-radio-group v-model="form.showSales">
                        <el-radio :label="1">
                            显示 <span class="tip">(用户端详情页显示订购量)</span>
                        </el-radio>
                        <el-radio :label="0">
                            隐藏 <span class="tip">(用户端商品详情页及列表页不展示订购量)</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <hr class="hr mt-20">
            <div class="wrap">
                <el-button plain style="margin-left: 20px" @click="cancle">
                    取消
                </el-button>
                <el-button type="primary" plain @click="save(false)">
                    保存
                </el-button>
                <el-button
                    type="primary"
                    plain
                    @click="save(true)"
                >
                    保存并上架
                </el-button>
                <el-button @click="preview">
                    预览
                </el-button>
            </div>
        </Panel>

        <!-- 批量选择视频 -->
        <SelectVideoCourse
            :show.sync="isShowSelectVideoDigLog"
            @confirm="selectCourse"
            :default="defaultCourse"
        />
        <!-- 单选视频 -->
        <CheckLiveVideo
            title="选择视频"
            :show.sync="showCheckLiveVideo"
            @confirm="checkedVideo"
            :default-video="currentUpdateVideo.video ? currentUpdateVideo.video.id : ''"
        />
        <!--预览-->
        <VideoCoursePreview
            :show.sync="showPreview"
            :data="videoCourseInfo"
        />
    </div>
</template>

<script>
import Panel from './../../../../../../components/common/Panel.vue'
import SelectVideoCourse from './../../../../../../components/select/Select-Video-Course.vue'
import ImageManager from './../../../../../../components/file/Image-Manager.vue'
import PlEditor from './../../../../../../components/common/Pl-Editor.vue'
import UserGroup from './../../../../../../components/common/User-Group.vue'
import Draggable from './../../../../../../components/draggable'
import CheckLiveVideo from './../../../../../../components/select/Check-Live-Video.vue'
import MainImageTheme from './../../../../../../components/goods/Main-Image-Theme.vue'
import VideoCoursePreview from './../components/Video-Course-Preview'

import { SectionToChinese } from '../../../../../../assets/ts/utils'
import { checkLength, isMoney } from '../../../../../../assets/ts/validate'
import { addVideoCourse, getVideoDetail } from './../../../../../../apis/product-center/online-teaching/knowledge-course'
import { getResourceInfoById } from './../../../../../../apis/product-center/online-teaching/library-video'
import moment from 'moment'
import SelectCategory from './../../../../../../components/category/Select-Category.vue'

// 定义章节对象
class CourseSection {
  id = '' // 课节id，可无
  name = '' // 章节名称
  title = '' // 课程标题
  cover = [] // 封面图
  teacher = '' // 主讲人
  video = null // 视频
  supportTrySee = 0 // 支持试看
  constructor ({ name, video = null, title = '', cover = [], teacher = '', supportTrySee = 0, id }) {
      this.name = name
      this.title = title
      this.cover = cover
      this.teacher = teacher
      this.supportTrySee = supportTrySee
      this.video = video
      this.id = id
  }
}
export default {
    name: 'AddSeriesOfCourses',
    components: {
        Panel,
        ImageManager,
        PlEditor,
        UserGroup,
        SelectVideoCourse,
        Draggable,
        CheckLiveVideo,
        VideoCoursePreview,
        MainImageTheme,
        SelectCategory
    },
    data () {
        const checkLiveInfo = (rule, value, callback) => {
            if (!this.form.liveInfos.length) {
                callback(new Error(rule.message))
                return
            }
            callback()
        }
        const checkTagIds = (rule, value, callback) => {
            if (this.form.targetGroups === 3 && !value.length) {
                callback(new Error(rule.message))
            }
            callback()
        }
        const checkPrice = (rule, value, callback) => {
            if (!this.form.priceType) {
                callback()
                return
            }
            if (this.form.originalPrice && !isMoney(this.form.originalPrice)) {
                callback(new Error('价格格式错误'))
                return
            }
            if (this.form.sellingPrice && !isMoney(this.form.sellingPrice)) {
                callback(new Error('价格格式错误'))
                return
            }
            if (this.form.sellingPrice && this.form.originalPrice !== '') {
                if (Number(this.form.sellingPrice) > Number(this.form.originalPrice)) {
                    callback(new Error('原价必须大于售价'))
                    return
                }
            }
            callback()
        }
        const checkregularSaleTime = (rule, value, callBack) => {
            if (!this.form.isOpenSale) {
                callBack()
            }
            if (new Date(this.form.regularSaleTime).getTime() < Date.now()) {
                callBack(new Error('开始售卖时间不得小于当前时间'))
            }
            const validityList = this.courseContent.filter(item => item.video && item.video.validity)
            if (validityList.length) {
                if (new Date(this.form.regularSaleTime).getTime() > new Date(this.videoMaxDeadline).getTime()) {
                    callBack(new Error('开始售卖时间不得大于视频资源使用有效期'))
                }
            }
            if (!this.form.priceType && this.form.validityDate) {
                if (new Date(this.form.regularSaleTime).getTime() > new Date(this.form.validityDate).getTime()) {
                    callBack(new Error('开始售卖时间不得大于免费观看时间'))
                }
            }
            callBack()
        }

        const specialCharacter = (rule, value, callback) => {
            if (value && value.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g)) {
                return callback(new Error('不支持输入表情符号'))
            }
            callback()
        }

        this.checkPrice = checkPrice
        this.checkregularSaleTime = checkregularSaleTime
        return {
            resouceId: '',
            resouceImg: '', // 资源库图片
            isShowSelectVideoDigLog: false,
            showCheckLiveVideo: false,
            showPreview: false,
            videoCourseInfo: {},
            userGroup: [],
            // 选中的视频数据
            courseList: [],
            // 课程内容
            courseContent: [],
            category: [],
            // 当前正在更新的视频
            currentUpdateVideo: {},
            form: {
                targetGroups: 0,
                tagIds: [],
                liveInfos: [],
                // 主图
                courseImg: '',
                // 原图
                courseMainImg: [],
                courseName: '',
                priceType: 1,
                courseType: 2,
                category1: '',
                category2: '',
                sellingPrice: '',
                originalPrice: '',
                isOpenSale: 0,
                regularSaleTime: '',
                details: '',
                courseBrief: '',
                validityDate: '',
                payNotice: '',
                themeModel: null,
                showSales: 1
            },
            rules: {
                courseName: [
                    { required: true, message: '请输入系列课程名称', trigger: 'blur' },
                    { validator: checkLength(30), message: '最多允许输入30个字符', trigger: 'blur' },
                    { validator: specialCharacter, message: '不支持输入表情符号' }
                ],
                courseImg: [
                    { required: true, message: '课程封面不能为空', trigger: 'blur' }
                ],
                category1: [
                    { required: true, message: '请选择分类', trigger: 'blur' }
                ],
                courseBrief: [
                    { required: true, message: '请输入课程描述', trigger: 'blur' },
                    { validator: checkLength(50), message: '最多允许输入50个字符', trigger: 'blur' },
                    { validator: specialCharacter, message: '不支持输入表情符号' }
                ],
                liveInfos: [
                    { validator: checkLiveInfo, message: '请选择课程内容', trigger: 'none' }
                ],
                tagIds: [
                    { validator: checkTagIds, message: '请选择用户分组', trigger: 'none' }
                ],
                details: [{ required: true, message: '请输入系列课程详情', trigger: 'blur' }],
                payNotice: [{ required: true, message: '请输入订购须知', trigger: 'blur' }],
                courseMainImg: [{ required: true, message: '请上传封面图', trigger: 'change' }],
                sellingPrice: [
                    { required: true, message: '请输入价格', trigger: 'blur' },
                    { validator: checkPrice, trigger: 'blur' }
                ],
                regularSaleTime: [{ required: false, message: '请选择开售时间', trigger: 'none' }]
            },
            contentRules: {
                title: [
                    { required: true, message: '请输入课节标题', trigger: 'blur' },
                    { validator: checkLength(20), message: '最多允许输入20个字符', trigger: 'blur' }
                ],
                teacher: [
                    { required: false, trigger: 'blur' },
                    { validator: checkLength(16), message: '最多允许输入16个字符', trigger: 'blur' },
                    { validator: specialCharacter, message: '不支持输入表情符号' }
                ]
            }
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async created () {
        try {
            this.form.payNotice = this.PAY_NOTICE()
            await this.getDetail()
        } catch (e) {
            throw e
        }
    },
    watch: {
        '$route.query.resouceId': {
            async handler () {
                try {
                    this.resouceId = this.$route.query.resouceId
                    this.form.payNotice = this.PAY_NOTICE()
                    // 有资源Id,说明为一键添加的课程
                    await this.getRepositoryDetail()
                } catch (e) {
                    throw e
                }
            },
            immediate: true
        },
        'form.isOpenSale': {
            handler (val) {
                if (!val) {
                    this.form.regularSaleTime = ''
                    this.$nextTick(() => {
                        this.$refs.form && this.$refs.form.clearValidate('regularSaleTime')
                    })
                }
                this.$set(this.rules, 'regularSaleTime', [
                    { required: !!val, message: '请选择开售时间', trigger: 'none' },
                    { validator: this.checkregularSaleTime, trigger: 'blur' }
                ])
            },
            immediate: true
        },
        'form.targetGroups' (val) {
            if (val !== 3) {
                this.form.tagIds = []
            }
        },
        'form.priceType': {
            handler (val) {
                if (!val) {
                    this.form.sellingPrice = ''
                    this.form.originalPrice = ''
                    this.form.validityDate = this.id ? this.form.validityDate : this.videoMaxDeadline
                } else {
                    this.form.validityDate = ''
                }
                this.$set(this.rules, 'sellingPrice', [{ required: Boolean(val), message: '请输入价格', trigger: 'blur' }, { validator: this.checkPrice, trigger: 'blur' }])
                this.$refs.form && this.$refs.form.clearValidate('sellingPrice')
            },
            immediate: true
        },
        'form.validityDate' () {
            this.$refs.form.validateField('regularSaleTime')
        },
        courseContent (list) {
            for (const [i, item] of list.entries()) {
                const ON = SectionToChinese(i + 1)
                item.name = `第${ ON }节`
            }
            this.$refs.form.validateField('regularSaleTime')
        },
        'form.courseMainImg' (list) {
            this.form.courseImg = list[0] ? list[0] : ''
            this.$refs.form && this.$refs.form.clearValidate('courseMainImg')
        }
    },
    computed: {
    // 截止时间最大值
        videoMaxDeadline () {
            const validityList = this.courseContent.map(item => item.video && moment(item.video.validity).valueOf()).sort((a, b) => a - b)
            for (const time of validityList) {
                if (time) return moment(time).format('YYYY-MM-DD HH:mm:ss')
            }
            return `${ moment().format('YYYY-MM-DD') } 23:59:59`
        },
        // 默认选中的视频
        defaultCourse () {
            return [...new Set(this.courseContent.filter(item => item.video).map(item => item.video.id))]
        }
    },
    methods: {
        async getDetail () {
            if (!this.id) return
            try {
                const { result } = await getVideoDetail(this.id)
                const {
                    isShow,
                    courseName,
                    liveInfo,
                    liveInfos,
                    targetGroups,
                    tagIds,
                    courseImg,
                    courseMainImg,
                    priceType,
                    sellingPrice,
                    originalPrice,
                    isOpenSale,
                    regularSaleTime,
                    details,
                    courseBrief,
                    validityDate,
                    payNotice,
                    themeModel,
                    category1,
                    category2,
                    showSales
                } = result
                this.form.regularSaleTime = regularSaleTime
                this.form = {
                    isShow,
                    targetGroups,
                    tagIds,
                    // 只有两个分类都存在时才做回填
                    category1,
                    category2,
                    courseImg,
                    courseMainImg,
                    courseName,
                    priceType: Number(priceType),
                    courseType: 2,
                    sellingPrice,
                    originalPrice,
                    isOpenSale: Number(isOpenSale),
                    regularSaleTime,
                    details,
                    courseBrief,
                    validityDate,
                    themeModel: themeModel || null,
                    payNotice: payNotice || this.PAY_NOTICE(),
                    showSales: Number(showSales)
                }
                // 记录是否为原始视频
                liveInfo.map(item => {
                    item.isOrigin = true
                    return item
                })
                const courseContent = []
                for (const { liveId, lessonsTiltle, lessonsImg, supportWatch, lecturer, id } of liveInfos) {
                    const video = liveInfo.find(item => item.id === liveId)
                    courseContent.push(new CourseSection({
                        id,
                        name: '',
                        title: lessonsTiltle, // 课程标题
                        cover: lessonsImg ? [lessonsImg] : [], // 封面图
                        teacher: lecturer, // 主讲人
                        supportTrySee: supportWatch, // 主讲人
                        video
                    }))
                }
                this.courseContent = courseContent
                if (category2) {
                    this.category = [category1, category2]
                } else if (category1) {
                    this.category = [category1]
                }
            } catch (e) {
                throw e
            }
        },
        categoryChange (val) {
            this.form.category1 = val[0] || ''
            this.form.category2 = val[1] || ''
        },
        // 处理一键上架
        async getRepositoryDetail () {
            try {
                if (!this.resouceId) return
                const {
                    result: {
                        courseName,
                        courseImg,
                        courseBrief,
                        details,
                        list
                    }
                } = await getResourceInfoById(this.resouceId)
                this.form.courseName = courseName
                this.form.courseImg = courseImg
                this.form.courseMainImg = [courseImg]
                this.resouceImg = courseImg
                this.form.courseBrief = courseBrief
                this.form.details = details
                const courseContent = []
                for (const item of list) {
                    courseContent.push(new CourseSection({
                        name: '',
                        title: item.name, // 课程标题
                        cover: item.courseImg ? [item.courseImg] : [], // 封面图
                        teacher: item.lecturer, // 主讲人
                        supportTrySee: 0, // 是否可试看
                        video: item
                    }))
                }
                this.courseContent = courseContent
                this.selectCourse(list)
            } catch (e) {
                throw e
            }
        },
        async preview () {
            const liveInfos = []
            for (const [i, { teacher, cover, title, video, supportTrySee }] of this.courseContent.entries()) {
                liveInfos.push({
                    lecturer: teacher,
                    lessonsImg: cover[0] || this.form.courseImg,
                    lessonsTiltle: title,
                    liveId: video ? video.id : '',
                    sort: i,
                    supportWatch: supportTrySee
                })
            }
            this.form.liveInfos = liveInfos
            await this.$refs.form.validate()
            this.videoCourseInfo = this.form
            this.videoCourseInfo.allLiveInfo = this.courseContent.map((item, index) => {
                const video = item.video || {}
                return {
                    sort: index + 1,
                    liveId: video.id,
                    lessonsImg: item.cover,
                    lessonsTiltle: item.title,
                    lecturer: item.teacher,
                    supportWatch: item.supportTrySee,
                    liveName: video.name || '',
                    resourceTime: video.resourceTime || '',
                    fileSize: video.fileSize || ''
                }
            })
            this.showPreview = true
        },

        /**
     * 初始化用户标签
     * @param userGroup {Array}
     */
        userGroupInit (userGroup) {
            this.userGroup = userGroup
        },
        // 选择课程
        selectCourse (list) {
            if (!list.length) return
            for (const video of list) {
                if (this.courseContent.length === 50) {
                    this.$warning('最多添加50节课')
                    return
                }
                const HAS = this.courseContent.some(item => item.video && video.id === item.video.id)
                if (!HAS) {
                    const ON = SectionToChinese(this.courseContent.length)
                    const course = new CourseSection({
                        name: `第${ ON }节`,
                        video
                    })
                    this.courseContent.push(course)
                }
            }
            this.$nextTick(() => {
                const itemWrap = document.querySelector(`.${ this.$style.itemWrap }`)
                itemWrap.scrollTo(0, itemWrap.scrollHeight)
            })
            this.$nextTick(() => {
                this.form.validityDate = this.id ? this.form.validityDate : this.videoMaxDeadline
            })
        },
        priceTypeChange () {
            // 只有新增的时候变化，编辑时由用户输入
            if (!this.id) this.form.payNotice = this.PAY_NOTICE()
        },
        PAY_NOTICE () {
            return `1.该精品系列课程为${ this.form.priceType ? '付费' : '免费' }课程，您未订购课程时，目录中的课程不可观看学习，仅可查看部分可支持试看的视频；
2.订购课程，并支付成功时，您可进入课程目录，课程内容将全部开放，您可在购买后，随时观看学习课程内容；
3.精品系列课程的内容最终解释权归机构所有，机构可对该系列课中的内容进行随时的调整更新，即购买系列课后，每次进入观看系列课程的内容，以机构最新更新的课程内容为主；
4.如果您在观看视频中，出现无法观看的情况，请及时联系机构客服人员。
${ this.form.priceType ? '' : '5.该免费课程如果提前下架，不会影响已免费订购用户的正常观看学习。' }`
        },
        // 添加课节
        addCourse () {
            if (this.courseContent.length === 50) {
                this.$warning('最多添加50节课')
                return
            }
            const ON = SectionToChinese(this.courseContent.length + 1)
            const course = new CourseSection({
                name: `第${ ON }节`,
                video: null
            })
            this.courseContent.push(course)
            this.$nextTick(() => {
                const itemWrap = document.querySelector(`.${ this.$style.itemWrap }`)
                itemWrap.scrollTo(0, itemWrap.scrollHeight)
            })
        },
        // 确认修改某个视频
        checkedVideo (video) {
            if (this.courseContent.some(item => item.video && video.id === item.video.id)) {
                this.$warning('视频已存在')
                return
            }
            this.currentUpdateVideo.video = video
            this.$nextTick(() => {
                this.form.validityDate = this.id ? this.form.validityDate : this.videoMaxDeadline
            })
        },
        // 修改某个视频
        async addVideo (item, isTip = false) {
            try {
                // 修改原始视频提示用户
                if (isTip && item.video && item.video.isOrigin) {
                    await this.$confirm({
                        title: '确认要更换该课节相对应的视频资源吗？',
                        message: '该视频资源更换后，用户已购买观看该视频所产生的点播流量数据将清空，请谨慎操作。'
                    })
                }
                this.showCheckLiveVideo = true
                this.currentUpdateVideo = item
            } catch (e) {}
        },

        /**
     * 删除课节
     * @param index {Number} 被删除课节的下标
     */
        async deleteCourse (item, index) {
            try {
                if (item.video && item.video.isOrigin) {
                    // 修改原始视频提示用户
                    await this.$confirm({
                        title: '确认要删除该课节内容和相对应的视频资源吗？',
                        message: '该课节内容删除后，用户已购买观看视频资源并产生的点播流量数据将清空，请谨慎操作。'
                    })
                } else {
                    await this.$confirm('确定移除该课节吗？')
                }
                this.courseContent.splice(index, 1)
            } catch (e) {}
        },

        /**
     * 表单校验事件
     * 校验错误时，页面滚动至错误目标处
     * 错误目标用已经设置的元素id获取
     * 元素id时当前字段属性，因此可以用 prop 获取
     * @param prop {String} 错误的字段属性
     * @param isPass {Boolean} 是否校验通过
     * @param message {String} 错误消息（没有时为null）
     */
        formValidateHandler (prop, isPass, message) {
            if (!isPass && message && !this.hasValidate && this.submiting) {
                const el = document.getElementById(prop)
                if (el) {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    })
                    this.$warning(message)
                }
                this.hasValidate = true
            }
            clearTimeout(this.validateTimer)
            this.validateTimer = setTimeout(() => {
                this.hasValidate = false
                this.submiting = false
            }, 1000)
        },

        /**
     * 课程内容表单校验
     * 校验错误时，页面滚动至错误目标处
     * 错误目标用已经设置的元素id获取
     * @param prop {String} 错误的字段属性
     * @param isPass {Boolean} 是否校验通过
     * @param message {String} 错误消息（没有时为null）
     * @param formId {String} 表单元素，用来获取表单元素
     */
        courseFormValidateHandler (prop, isPass, message, formId) {
            if (!isPass && message && !this.hasValidate && this.submiting) {
                const el = document.getElementById(formId)
                if (el) {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    })
                    this.$warning(message)
                }
                this.hasValidate = true
            }
            clearTimeout(this.validateTimer)
            this.validateTimer = setTimeout(() => {
                this.hasValidate = false
                this.submiting = false
            }, 1000)
        },
        cancle () {
            this.$router.push({ name: 'SeriesOfCoursesList' })
        },
        themeConfirmHandler (data) {
            this.form.themeModel = data
        },

        /**
     * 保存
     * @param flag {Boolean} 是否上架
     * @return {Promise<void>}
     */
        async save (flag) {
            this.submiting = true // 标记正在提交
            try {
                const contentForm = this.$refs.contentForm
                const liveInfos = []
                if (this.$refs.mainImageTheme) {
                    this.form.courseImg = await this.$refs.mainImageTheme.generateImage()
                }

                for (const [i, { id, teacher, cover, title, video, supportTrySee }] of this.courseContent.entries()) {
                    liveInfos.push({
                        id,
                        lecturer: teacher,
                        lessonsImg: cover[0] || this.form.courseMainImg[0] || '',
                        lessonsTiltle: title,
                        liveId: video ? video.id : '',
                        sort: i,
                        supportWatch: supportTrySee
                    })
                }
                this.form.liveInfos = liveInfos
                await this.$refs.form.validate()
                for (const form of contentForm) {
                    await form.validate()
                }
                if (!this.courseContent.some(item => item.video)) {
                    return this.$warning('课节目录至少关联一个视频资源')
                }
                if (this.id) {
                    this.form.id = this.id
                }
                this.form.status = flag ? 1 : 2
                // 是否校验时间取决于 免费即限制学习时间；非免费当前不限制学习时间,默认为最大时间
                this.form.validityType = this.form.priceType ? 0 : 1
                // 校验时间则传入 校验的时间点，否则为空
                this.form.validityDate = this.form.validityType ? this.form.validityDate : ''
                await addVideoCourse(this.form)
                this.saved = true
                this.$router.replace({ name: 'SeriesOfCoursesList' })
                this.$destroy()
            } catch (e) {
                if (e) throw e
            }
        },
        // 修改截止时间
        deadlineChange (val) {
            if (moment(val).valueOf() < Date.now()) {
                const TIME = moment().format('YYYY-MM-DD')
                this.$warning(`截止时间必须大于${ TIME }`)
                this.form.validityDate = `${ TIME } 23:59:59`
            } else {
                this.form.validityDate = `${ val } 23:59:59`
            }
        }
    },
    beforeRouteLeave (to, form, next) {
        if (!this.saved) {
            this.$confirm({
                title: '确定离开页面？',
                message: '系统将不会保存您修改的内容'
            }).then(() => {
                next()
            })
            return
        }
        next()
    }
}
</script>

<style module lang="scss">
.content {
    box-shadow: 0 0 2px rgba(0, 0, 0, .2);
}
.videoList {
    position: relative;
    margin-top: 20px;
    border: 1px solid #e7e7e7;
    overflow-x: auto;
}
.itemWrap {
    min-width: max-content;
    max-height: 500px;
    overflow-y: auto;
    border-bottom: 1px solid #e7e7e7;
}
.videoItem {
    display: grid;
    grid-template-columns: 120px 180px 118px 180px 288px 150px 120px;
    align-items: center;
    min-width: max-content;
    padding: 0 18px;
    &:nth-last-of-type(1) {
        margin-bottom: 0;
        .videoCell {
            padding-bottom: 14px;
        }
    }
    &.videoHead {
        line-height: 48px;
        font-weight: bold;
        margin-bottom: 0;
        background-color: #f7f8fc;
        > .videoCell {
            padding: 0 24px;
        }
    }
}
.drag {
    cursor: move;
}
.videoCell {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 14px 24px 0 24px;
    &.border {
        border-right: 1px solid #e7e7e7;
    }
}
.hasVideo {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    > svg {
        transform: translateY(10px);
    }
    > .videoIcon {
        margin-right: 12px;
    }
    > .videoInfo {
        flex: 1;
        margin-left: 12px;
        > .videoName {
            width: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            line-height: 20px;
            > span {
                display: inline-block;
                width: 130px;
                @include elps-wrap(1);
            }
        }
        > .videoSize {
            line-height: 17px;
            font-size: 12px;
            color: #999;
        }
    }
}
.addClass {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 56px;
    font-size: 18px;
    color: #598bf8;
    cursor: pointer;
    background-color: #fff;
    user-select: none;
}
.noVideo {
    user-select: none;
}

</style>
