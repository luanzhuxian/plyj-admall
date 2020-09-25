<template>
    <div class="add-video-course">
        <div class="wrap">
            <div class="content-title" id="basic" ref="basic">
                {{ id ? '编辑视频课程' : '新增视频课程' }}
            </div>
            <el-form
                label-width="150px"
                label-position="left"
                ref="form"
                :model="form"
                :rules="rules"
                @validate="formValidateHandler"
            >
                <el-form-item label="课程名称" prop="courseName" id="courseName">
                    <el-input style="width: 320px" v-model="form.courseName" maxlength="30" placeholder="请输入课程名称" />
                    <span class="tip">（至多可输入30字的课程名称）</span>
                </el-form-item>
                <el-form-item label="课程封面" prop="courseImg" id="courseImg">
                    <UploadImage
                        ref="UploadImage"
                        v-model="form.courseMainImg"
                        :width="750"
                        :height="500"
                        :box-width="100"
                        :box-height="67"
                        :size="2"
                        :count="10"
                        multiple
                        :delete-truth="!id && (!resouceId || (form.courseImg !== resouceImg))"
                        need-edit
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
                    <template>
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
                            <span class="tip" v-if="!userGroup.length">（请先在会员中心-设置用户分组）</span>
                        </el-radio-group>
                        <UserGroup
                            v-show="form.targetGroups === 3"
                            v-model="form.tagIds"
                            @init="userGroupInited"
                        />
                    </template>
                </el-form-item>
                <el-form-item label="选择视频" prop="liveId" id="liveId">
                    <el-button size="small" @click="showSelectVideoDigLog">
                        视频选择
                    </el-button>
                    <span class="tip">（每个视频课程只能选择一个视频资源。视频更新后，已购买的用户学习的是更新后的视频。）</span>
                    <el-table
                        v-if="form.liveId"
                        :data="[liveInfo]"
                        border
                        style="width: 850px; margin-top:20px;"
                    >
                        <el-table-column
                            prop="name"
                            label="视频名称"
                        />
                        <el-table-column label="文件大小（MB）">
                            <template #default="{ row }">
                                {{ (Number(row.fileSize) / 1024 /1024).toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="使用有效期（天）">
                            <template #default="{ row }">
                                <span v-if="row.resourceType === 1">永久有效</span>
                                <template v-else>
                                    <div>截止至 {{ row.validity }}</div>
                                    <div style="color:red">
                                        {{ formatterTimeDesc(row) }}
                                    </div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="operation"
                            label="操作"
                            align="center"
                        >
                            <template>
                                <el-button
                                    @click="removeVideo"
                                    type="text"
                                >
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="是否可试看" prop="supportWatch" id="supportWatch" v-if="form.supportWatchUrl">
                    <el-checkbox v-model="form.supportWatch" :true-label="1" :false-label="0" :disabled="!form.supportWatchUrl">
                        可试看
                    </el-checkbox>
                    <el-button v-if="form.supportWatchUrl" class="ml-10" type="text" size="small" @click="showVideo = true">
                        预览
                    </el-button>
                    <!--TODO.后台暂不支持-->
                    <template v-if="false">
                        <!--试看片段支持删除-->
                        <el-button v-if="form.supportWatchUrl" class="ml-10" type="text" size="small" @click="deleteSupportWatchUrl">
                            删除试看片段
                        </el-button>
                        <span class="tip">（用户可在购买前试看该课程的部分内容，促进用户的购买）</span>
                        <VideoManager
                            v-if="form.supportWatch && !form.supportWatchUrl"
                            @change="videoChange"
                            :list="video"
                            :count="1"
                            :box-width="100"
                            :box-height="100"
                            upload-text="上传试看片段"
                        />
                    </template>
                </el-form-item>
                <el-form-item label="课程简介" prop="courseBrief" id="courseBrief">
                    <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="form.courseBrief"
                        maxlength="50"
                        style="width: 420px;"
                        :rows="5"
                        resize="none"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="主讲人" prop="lecturer" id="lecturer">
                    <el-input style="width: 320px" v-model="form.lecturer" maxlength="16" placeholder="请输入主讲人姓名" />
                </el-form-item>
                <el-form-item label="课程价格" prop="priceType" id="priceType">
                    <!--TODO.暂时不开放-->
                    <div v-if="false">
                        <el-checkbox v-model="form.buyType" disabled>
                            支持单课程购买
                        </el-checkbox>
                    </div>
                    <div>
                        <!--保存后不可修改-->
                        <el-radio-group v-model="form.priceType" :disabled="!!id" @change="priceTypeChange">
                            <el-radio :label="1" name="付费">
                                付费
                            </el-radio>
                            <el-radio :label="0" name="免费">
                                免费
                            </el-radio>
                        </el-radio-group>
                    </div>
                    <div class="tip" v-show="form.priceType === 0">
                        该免费观看截止至
                        <el-date-picker
                            type="date"
                            v-model="form.validityDate"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择截止日期"
                            @change="deadlineChange"
                            :editable="false"
                        />
                        前，均可免费观看
                        <span class="tip"> (到达截止时间之后，该课程将自动下架，所有订购该免费课程的用户，学习时间同步截止，不可继续免费观看视频。)</span>
                    </div>
                    <div v-show="form.priceType === 1" style="margin: 10px 0">
                        课程售价
                        <el-input
                            type="number"
                            style="width: 160px"
                            v-model="form.sellingPrice"
                            @blur="inputSellingPrice(form.sellingPrice)"
                            placeholder="请输入课程售价"
                        />
                        元
                    </div>
                    <div v-show="form.priceType === 1">
                        课程原价
                        <el-input
                            type="number"
                            style="width: 160px"
                            v-model="form.originalPrice"
                            @blur="inputOriginalPrice(form.originalPrice)"
                            placeholder="请输入课程原价"
                        />
                        元
                        <span class="tip">（不填写时不显示课程原价信息）</span>
                    </div>
                </el-form-item>
                <!--付费可设置学习时间-->
                <el-form-item v-show="form.priceType === 1" label="学习时间" prop="validityType" id="validityType">
                    <el-radio-group v-model="form.validityType" @change="changeValidityType">
                        <el-radio :label="1" name="限制">
                            限制学习时间
                        </el-radio>
                        <el-radio :label="0" name="不限制" :disabled="liveInfo.resourceType === 2">
                            不限制学习时间
                        </el-radio>
                    </el-radio-group>
                    <div class="tip" v-if="form.validityType === 1" style="margin-top: 10px">
                        购买课程后
                        <el-input-number
                            v-model="form.validity"
                            :min="1"
                            :step="1"
                            :precision="0"
                        />
                        天内可观看视频学习
                        <span class="tip">（学习时间，即用户需要在有效时间内完成学习，学习时间到期后，默认为已过期状态，不可再进行视频学习）</span>
                        <div class="tip">
                            当视频课程的视频资源使用有效期小于学习时间时，则该视频课程将自动下架。
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="定时开售" prop="isOpenSale" id="isOpenSale">
                    <div>
                        <el-checkbox v-model="form.isOpenSale" :true-label="1" :false-label="0">
                            设置开始售卖时间
                        </el-checkbox>
                        <span class="tip"> (打勾，设置开售时间后未到开售时间课程仅展示不可购买)</span>
                    </div>
                    <div v-if="form.isOpenSale">
                        <el-date-picker
                            v-model="form.regularSaleTime"
                            type="datetime"
                            placeholder="请选择售卖的开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :editable="false"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="商品隐藏" prop="isShow" id="isShow">
                    <el-checkbox v-model="form.isShow" :true-label="0" :false-label="1">
                        上架的商品设置隐藏后，在店铺内不显示，但可以通过链接的方式访问
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="分类" prop="category1">
                    <SelectCategory v-model="classification" show-add :category-type="1" />
                </el-form-item>
                <el-form-item label="编辑图文详情" prop="details" id="details">
                    <PlEditor v-if="isShowEditor" v-model="form.details" />
                </el-form-item>
                <el-form-item label="订购须知" prop="payNotice" id="payNotice">
                    <div>
                        <el-input
                            type="textarea"
                            placeholder="请输入订购须知的内容"
                            v-model="form.payNotice"
                            maxlength="300"
                            style="width: 800px;"
                            :rows="6"
                            resize="none"
                            show-word-limit
                            :editable="false"
                        />
                    </div>
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
            <div class="btn-box">
                <el-button size="mini" plain style="width: 90px;margin-left: 20px" @click="cancel">
                    取消
                </el-button>
                <el-button size="mini" type="primary" plain @click="save(2)">
                    保存
                </el-button>
                <el-button size="mini" type="primary" plain @click="save(1)">
                    保存并上架
                </el-button>
                <el-button size="mini" plain style="width: 90px;margin-left: 20px" @click="preview">
                    预览
                </el-button>
            </div>
        </div>
        <CheckLiveVideo
            ref="videoDialog"
            title="选择视频"
            :default-video="form.liveId"
            @confirm="selectedVideo"
            :show.sync="isShowSelectVideoDigLog"
        />
        <!-- 添加主分类 -->
        <EditMain :show.sync="showAddCategory" />
        <!--预览-->
        <VideoCoursePreview :show.sync="showPreview" :data="form" />
        <!--试看视频预览-->
        <VideoPreview :show.sync="showVideo" :src="form.supportWatchUrl" />
    </div>
</template>
<script>
import PlEditor from './../../../../../../components/common/Pl-Editor.vue'
import UserGroup from './../../../../../../components/common/User-Group.vue'
import UploadImage from './../../../../../../components/file/Image-Manager.vue'
import EditMain from './../../../../../../components/category/Edit-Main.vue'
import CheckLiveVideo from './../../../../../../components/select/Check-Live-Video.vue'
import VideoCoursePreview from './../components/Video-Course-Preview.vue'
import VideoPreview from './../../../../../../components/common/Preview-Video'
import MainImageTheme from './../../../../../../components/goods/Main-Image-Theme.vue'
import VideoManager from './../../../../../../components/file/Video-Manager.vue'
import { addVideoCourse, getVideoDetail } from './../../../../../../apis/product-center/line-teaching/knowledge-course'
import { getResourceInfoById } from './../../../../../../apis/product-center/line-teaching/video-library'
import SelectCategory from './../../../../../../components/category/Select-Category.vue'

import moment from 'moment'
export default {
    name: 'VideoCourseAdd',
    components: {
        PlEditor,
        UploadImage,
        EditMain,
        CheckLiveVideo,
        VideoCoursePreview,
        VideoPreview,
        VideoManager,
        UserGroup,
        MainImageTheme,
        SelectCategory
    },
    data () {
        const checkTagIds = (rule, value, callBack) => {
            if (this.form.targetGroups === 3 && !value.length) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        const checkTime = (rule, value, callBack) => {
            if (this.form.priceType === 0) {
                if (!this.form.validityDate) {
                    callBack(new Error('请设置免费观看时间'))
                }
                if (new Date(this.form.validityDate).getTime() < Date.now()) {
                    callBack(new Error('免费观看时间不得小于当前时间'))
                }
                if (this.form.liveId && this.liveInfo.resourceType !== 1) {
                    if (new Date(this.form.validityDate).getTime() > new Date(this.liveInfo.validity).getTime()) {
                        callBack(new Error('免费观看时间不得大于视频资源使用有效期'))
                    }
                }
            }
            if (this.form.priceType === 1) {
                if (this.form.sellingPrice === '') {
                    callBack(new Error('课程售价不能为空'))
                }
                if (this.form.originalPrice !== '' && (Number(this.form.originalPrice) < Number(this.form.sellingPrice))) {
                    callBack(new Error('课程原价不得低于课程售价'))
                }
            }
            callBack()
        }
        // 只有收费时，有限制学习时间项
        const checkValidity = (rule, value, callBack) => {
            if (this.form.priceType !== 1) { callBack() }
            if (this.form.liveId && this.liveInfo.resourceType !== 1) {
                // 说明视频是资源库购买，有有效期
                const time = new Date(this.liveInfo.validity).getTime()
                // 付费且不限制学习时间
                if (value === 0) {
                    callBack(new Error('课程学习时间不得大于视频资源使用有效期'))
                }
                // 付费且限制学习时间，校验看观看时间天数
                if (value === 1) {
                    const now = Date.now()
                    // 当前视频离过期的天数
                    const remainDay = time < now ? 0 : moment(this.liveInfo.validity).diff(moment(), 'days')
                    if (this.form.validity > remainDay) {
                        callBack(new Error('课程学习时间不得大于视频资源使用有效期'))
                    }
                }
            }
            callBack()
        }

        const checkSupportWatchUrl = (rule, value, callBack) => {
            if (value && !this.form.supportWatchUrl) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }

        const checkregularSaleTime = (rule, value, callBack) => {
            if (value) {
                if (!this.form.regularSaleTime) {
                    callBack(new Error('请设置开始售卖时间'))
                }
                if (new Date(this.form.regularSaleTime).getTime() < Date.now()) {
                    callBack(new Error('开始售卖时间不得小于当前时间'))
                }
                if (this.form.liveId && this.liveInfo.resourceType !== 1) {
                    if (new Date(this.form.regularSaleTime).getTime() > new Date(this.liveInfo.validity).getTime()) {
                        callBack(new Error('开始售卖时间不得大于视频资源使用有效期'))
                    }
                }
                if (!this.form.priceType && this.form.validityDate) {
                    if (new Date(this.form.regularSaleTime).getTime() > new Date(this.form.validityDate).getTime()) {
                        callBack(new Error('开始售卖时间不得大于免费观看时间'))
                    }
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

        return {
            id: '', // 视频课程id
            resouceId: '', // 视频资源Id
            resouceImg: '', // 资源库图片
            isShowEditor: true, // 解决富文本编辑器在再次进入时吸顶问题
            isShowSelectVideoDigLog: false, // 是否显示选择视频弹框
            showAddCategory: false, // 是否显示新建分类
            showPreview: false, // 是否显示预览
            showVideo: false, // 是否预览试看视频
            video: [], // 试看视频上传列表
            form: {
                isShow: 1, // C 端显示隐藏
                courseName: '', // 视频课程名称
                courseImg: '', // 课程封面
                courseMainImg: [], // 课程封面
                liveId: '', // 选择视频的id
                supportWatch: 0, // 是否可试看
                supportWatchUrl: '', // 试看视频url
                courseBrief: '', // 课程简介
                lecturer: '',
                targetGroups: 0,
                tagIds: [],
                priceType: 1,
                buyType: true,
                originalPrice: '', // 课程原价
                sellingPrice: '', // 课程售价
                validityDate: '', // 免费观看截至时间
                validityType: 1, // 是否限制学习时间
                validity: 1, // 有效期
                isOpenSale: 0,
                regularSaleTime: '',
                category1: '',
                category2: '',
                details: '',
                payNotice: '',
                themeModel: null,
                showSales: 1
            },
            liveInfo: {},
            userGroup: [], // 课程分类回显
            classification: [], // 课程分类回显
            rules: {
                courseName: [
                    { required: true, message: '课程名称不能为空', trigger: 'blur' },
                    { max: 50, message: '课程名称不能超过30个字符', trigger: 'blur' },
                    { validator: specialCharacter, message: '不支持输入表情符号' }
                ],
                courseImg: [
                    { required: true, message: '课程封面不能为空', trigger: 'blur' }
                ],
                liveId: [
                    { required: true, message: '请选择视频', trigger: 'none' }
                ],
                supportWatch: [
                    { validator: checkSupportWatchUrl, message: '请上传试看视频' }
                ],
                courseBrief: [
                    { required: true, message: '课程简介不能为空', trigger: 'blur' },
                    { max: 50, message: '课程简介不能超过50个字符', trigger: 'blur' },
                    { validator: specialCharacter, message: '不支持输入表情符号' }
                ],
                lecturer: [
                    { max: 50, message: '主讲人不能超过16个字符', trigger: 'blur' },
                    { validator: specialCharacter, message: '不支持输入表情符号' }
                ],
                tagIds: [
                    { validator: checkTagIds, message: '请至少选择一个用户分组' }
                ],
                priceType: [
                    { required: true },
                    { validator: checkTime, trigger: 'blur' }
                ],
                validityType: [
                    { required: true, message: '请选择是否限制学习时间' },
                    { validator: checkValidity }
                ],
                isOpenSale: [
                    { validator: checkregularSaleTime }
                ],
                category1: [
                    { required: true, message: '请选择课程分类', trigger: 'blur' }
                ],
                details: [
                    { required: true, message: '详情不能为空' }
                ],
                payNotice: [
                    { required: true, message: '订购须知不能为空', trigger: 'blur' },
                    { max: 200, message: '订购须知不能超过300个字符', trigger: 'blur' }
                ]
            },
            isSave: false // 是否保存
        }
    },
    watch: {
        classification: {
            handler () {
                this.form.category1 = this.classification[0]
                this.form.category2 = this.classification[1] ? this.classification[1] : ''
            },
            immediate: true
        },
        '$route.query.resouceId': {
            async handler () {
                try {
                    this.resouceId = this.$route.query.resouceId
                    this.id = ''
                    this.isShowEditor = true
                    this.form.payNotice = this.PAY_NOTICE()
                    // 有资源Id,说明为一键添加的课程
                    await this.getRepositoryDetail()
                } catch (e) {
                    throw e
                }
            },
            immediate: true
        },
        'form.courseMainImg' (arr) {
            this.form.courseImg = arr[0] || ''
        },
        'form.supportWatchUrl' () {
            this.$refs.form.validateField('supportWatch')
        },
        'form.validityDate' () {
            this.$refs.form.validateField('priceType')
            this.$refs.form.validateField('isOpenSale')
        },
        'form.liveId' () {
            this.$refs.form.validateField('priceType')
            this.$refs.form.validateField('isOpenSale')
            this.$refs.form.validateField('validityType')
        }
    },
    async created () {
        try {
            this.id = this.$route.params.id
            this.isShowEditor = true
            this.form.payNotice = this.PAY_NOTICE()
            if (this.id) {
                await this.init()
            } else {
                // 有资源Id,说明为一键添加的课程
                this.getRepositoryDetail()
            }
        } catch (e) {
            throw e
        }
    },
    methods: {
        async init () {
            try {
                const { result } = await getVideoDetail(this.id)
                const { liveInfo, sellingPrice, originalPrice, payNotice, themeModel, category1, category2, showSales } = result
                this.liveInfo = (liveInfo && liveInfo[0]) || {}
                this.liveInfo.isOrigin = true
                // 只有两个分类都存在时才做回填
                if (category2) {
                    this.classification = [category1, category2]
                } else if (category1) {
                    this.classification = [category1]
                }
                delete result.category1Name
                delete result.category2Name
                this.form = {
                    ...result,
                    showSales: Number(showSales),
                    themeModel: themeModel || null,
                    buyType: true,
                    payNotice: payNotice || this.PAY_NOTICE(),
                    originalPrice: originalPrice || '',
                    sellingPrice: sellingPrice || '',
                    liveId: (liveInfo && liveInfo[0] && liveInfo[0].id) || ''
                }
            } catch (e) {
                throw e
            }
        },
        // 处理一键上架数据
        async getRepositoryDetail () {
            try {
                if (!this.resouceId) return
                const {
                    data: {
                        result: {
                            isShow,
                            courseName,
                            courseImg,
                            courseBrief,
                            details,
                            list,
                            supportWatchUrl
                        }
                    }
                } = await getResourceInfoById(this.resouceId)
                // C 端显示隐藏
                this.form.isShow = isShow
                // 课程资源名称
                this.form.courseName = courseName
                // 封面图
                this.form.courseImg = courseImg
                this.resouceImg = courseImg
                this.form.courseMainImg = courseImg ? [courseImg] : []
                // 资源简介
                this.form.courseBrief = courseBrief
                // 图文详情
                this.form.details = details
                const sigleLiveInfo = (list && list[0]) || {}
                if (supportWatchUrl) sigleLiveInfo.supportWatchUrl = supportWatchUrl
                // 主讲人
                this.form.lecturer = sigleLiveInfo.lecturer || ''
                // 设置视频信息
                this.selectedVideo(sigleLiveInfo)
            } catch (e) {
                throw e
            }
        },
        formatterTimeDesc ({ validity }) {
            const time = new Date(validity).getTime()
            const now = Date.now()
            // 已经过期
            if (time < now) {
                return '已过期'
            } else if (time - now <= (1000 * 60 * 60 * 24 * 30)) {
                // 30天内过期
                let [remainDay, remainHours] = [(time - now) / (1000 * 60 * 60)]
                remainHours = parseInt(remainDay % 24)
                remainDay = parseInt(remainDay / 24)
                return remainDay === 0 ? '即将过期' : (remainHours === 0 ? `(剩余${ remainDay }天)` : `(剩余${ remainDay }天${ remainHours }小时)`)
            }
            return ''
        },
        async showSelectVideoDigLog () {
            try {
                if (this.liveInfo.isOrigin) {
                    await this.$confirm({
                        title: '确认要更换视频资源吗？',
                        message: '该视频资源更换后，用户已购买观看该视频所产生的点播流量数据将清空，请谨慎操作。'
                    })
                }
                this.isShowSelectVideoDigLog = true
            } catch (e) {}
        },
        selectedVideo (data) {
            this.liveInfo = data
            this.form.supportWatchUrl = this.liveInfo.resourceType === 2 ? this.liveInfo.supportWatchUrl : ''
            this.form.supportWatch = this.form.supportWatchUrl ? 1 : 0
            this.form.liveId = this.liveInfo.id
            // 当视频资源为（来源：资源库）时，则学习时间不限制置灰不可选择，必须进行学习时间的设置
            if (this.liveInfo.resourceType !== 1) {
                this.form.validityType = 1
            }
            this.$refs.form.clearValidate('liveId')
        },
        deleteSupportWatchUrl () {
            this.video = []
            this.form.supportWatchUrl = ''
        },
        async videoChange (list) {
            this.video = list
            this.form.supportWatchUrl = list[0] || ''
        },
        async removeVideo () {
            try {
                if (this.liveInfo.isOrigin) {
                    await this.$confirm({
                        title: '确认要删除该视频资源吗？',
                        message: '该视频资源删除后，用户已购买观看视频资源并产生的点播流量数据将清空，请谨慎操作。'
                    })
                }
                this.liveInfo = {}
                this.form.supportWatchUrl = ''
                this.form.supportWatch = 0
                this.form.liveId = ''
            } catch (e) {}
        },
        inputSellingPrice (val) {
            if (val === '') return
            let newVal = parseInt(val) === Number(val) ? Number(val) : Number(Number(val).toFixed(2))
            newVal = newVal > 0 ? newVal : 0.01
            this.form.sellingPrice = newVal
        },
        inputOriginalPrice (val) {
            if (val === '') return
            let newVal = parseInt(val) === Number(val) ? Number(val) : Number(Number(val).toFixed(2))
            newVal = newVal > 0 ? newVal : 0.01
            this.form.originalPrice = newVal
        },
        changeValidityType (val) {
            if (val !== 1) {
                this.form.validity = 1
            }
        },
        priceTypeChange () {
            // 只有新增的时候变化，编辑时由用户输入
            if (!this.id) this.form.payNotice = this.PAY_NOTICE()
        },
        PAY_NOTICE () {
            return `1.该精选单课为${ this.form.priceType ? '付费' : '免费' }课程，您未订购课程时，不可直接观看学习，仅可支持试看视频内容；
2.订购课程，并支付成功时，您可进入直接观看视频，您可在购买后随时观看学习课程内容；
3.如果您在观看视频中，出现无法观看的情况，请及时联系机构客服人员；
4.精选单课的内容的最终解释权归机构所有。
${ this.form.priceType ? '' : '5.该免费课程如果提前下架，不会影响已免费订购用户的正常观看学习。' }`
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
        },
        // 表单校验事件
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
        async save (status) {
            try {
                this.submiting = true // 标记正在提交
                await this.$refs.form.validate()
                // 交换图片
                this.form.courseImg = await this.$refs.mainImageTheme.generateImage()
                this.form.validityType = this.form.priceType ? this.form.validityType : 0
                const form = JSON.parse(JSON.stringify(this.form))
                const { liveId, isOpenSale, regularSaleTime } = form
                form.liveInfos = [{ liveId }]
                form.status = status
                form.regularSaleTime = isOpenSale ? regularSaleTime : ''
                delete form.liveId
                delete form.liveInfo
                const lessonId = (this.form.liveInfos && this.form.liveInfos[0] && this.form.liveInfos[0].id) || ''
                if (lessonId) {
                    form.liveInfos[0].id = lessonId
                }
                if (form.priceType === 0) {
                    form.sellingPrice = ''
                    form.originalPrice = ''
                    form.validityType = 1
                    form.validityDate = this.form.validityDate
                }
                if (form.priceType === 1) {
                    form.validityType = this.form.validityType
                    form.validity = this.form.validityType ? this.form.validity : ''
                }
                if (form.targetGroups !== 3) form.tagIds = []

                if (this.id) {
                    form.id = this.id
                }
                form.courseType = 1 // 单课
                await addVideoCourse(form)
                await this.$success('保存成功')
                this.isSave = true
                this.$router.push({ name: 'VideoCourse' })
            } catch (e) {
                if (e) throw e
            }
        },
        cancel () {
            this.$router.push({ name: 'VideoCourse' })
        },
        async preview () {
            await this.$refs.form.validate()
            this.showPreview = true
        },
        userGroupInited (userGroup) {
            this.userGroup = userGroup
        },
        themeConfirmHandler (data) {
            this.form.themeModel = data
        }
    },
    beforeRouteLeave (to, from, next) {
        if (!this.isSave) {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                this.isShowEditor = false
                next()
            })
        } else {
            next()
        }
    }
}
</script>
<style lang="scss" scoped>
.content-title {
    padding-bottom: 24px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
}
.brief-edit {
    display: inline-block;
    padding-left: 10px;
    cursor: pointer;
}

</style>
