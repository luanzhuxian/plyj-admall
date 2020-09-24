<template>
    <div class="add-live wrap">
        <Panel :title="id ? '编辑直播' : '添加直播'" width="95%" top="20">
            <el-form
                label-position="left"
                label-width="150px"
                style="padding: 26px 24px;"
                :model="form"
                :rules="rules"
                ref="form"
            >
                <el-form-item required label="直播互动类型">
                    <el-radio-group :disabled="isLiveStart" v-model="form.liveType">
                        <el-radio v-for="(item,index) in playTypeList" :key="index" :label="item.value">
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                    <div class="sid-gray" style="margin-left: 0">
                        （{{ form.liveType === 'live' ? '实时在线直播需要下载PC端或手机端app的直播工具，登录后开始进行实时直播，该直播方式将消耗直播分钟数' : '该形式需选择视频进行直播，使用该形式将消耗您的点播流量' }}）
                    </div>
                </el-form-item>
                <el-form-item required label="直播形式">
                    <el-radio :disabled="!!id" @change="e => { form.userRange = 1 }" v-model="form.liveMode" label="public">
                        公开课
                        <span class="sid-gray">（雅集商城显示入口）</span>
                    </el-radio>
                    <el-radio :disabled="!!id" @change="e => { form.isNeedSignUp = 0; form.userRange = 2 }" v-model="form.liveMode" label="private">
                        私享课
                        <span class="sid-gray">（仅有权限的用户可见）</span>
                    </el-radio>
                </el-form-item>
                <el-form-item label="直播标题" prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="请输入1-15字标题"
                        style="width: 267px;"
                    />
                </el-form-item>
                <el-form-item label="直播房间" prop="roomId">
                    <el-select :disabled="!!id" @change="checkRoom" v-model="form.roomId" placeholder="请选择房间">
                        <el-option
                            v-for="(item,index) in rooms"
                            :key="index"
                            :label="item.roomName"
                            :value="item.roomId"
                        />
                    </el-select>
                    <el-button :disabled="(useRooms >= maxRooms) || !!id" @click="showAddRoom = true" type="text" style="margin-left: 16px;">
                        新增房间
                    </el-button>
                    <span class="sid-gray" v-if="form.liveType === 'video'">（不消耗直播分钟数，消耗点播流量）</span>
                    <!-- <span class="sid-gray">（至多可设置 {{ useRooms }} / {{ maxRooms }} 个直播频道）</span> -->
                </el-form-item>
                <el-form-item label="分享链接" prop="roomMode">
                    <el-radio :disabled="!!id" v-model="form.roomMode" :label="2">
                        专属链接
                        <span class="sid-gray">（每一场直播生成一个专属链接）</span>
                    </el-radio>
                    <el-radio :disabled="!!id" v-model="form.roomMode" :label="1">
                        房间固定链接
                        <span class="sid-gray">（每个房间固定链接，一个直播间一个，不因直播场次更换而更换）</span>
                    </el-radio>
                </el-form-item>
                <el-form-item label="开播时间" prop="liveStartTime">
                    <date-range
                        type="datetime"
                        :disabled-start-time="isLiveStart"
                        disable-before
                        @change="dateChange"
                        :init="[form.liveStartTime, form.liveEndTime]"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="主讲人" maxlength="16" prop="lecturerName">
                    <el-input
                        maxlength="16"
                        v-model="form.lecturerName"
                        placeholder="请输入主讲人姓名"
                        style="width: 267px;"
                    />
                </el-form-item>
                <el-form-item required label="观看对象" prop="userRange">
                    <span v-if="form.liveMode === 'public'">普通会员</span>
                    <template v-else>
                        <el-radio :disabled="form.liveMode === 'private'" v-model="form.userRange" :label="1">
                            普通会员
                        </el-radio>
                        <el-radio v-model="form.userRange" :label="2">
                            部分用户可用
                            <span class="sid-gray">（仅有权限的用户可见）</span>
                        </el-radio>
                        <template v-if="form.userRange === 2">
                            <div style="margin-top: 20px">
                                <div v-if="form.viewObjectModel.users && form.viewObjectModel.users.length">
                                    <span>已选择 {{ form.viewObjectModel.users.length }} 人</span>
                                    <el-button style="margin-left: 10px" @click="showSelectStu = true">
                                        编辑学员
                                    </el-button>
                                </div>
                                <el-button v-else @click="showSelectStu = true">
                                    添加学员
                                </el-button>
                            </div>
                        </template>
                    </template>
                </el-form-item>
                <el-form-item label="直播预告" prop="noticeImg">
                    <div>
                        <el-radio :disabled="isLiveStart" v-model="showNotice" :label="0">
                            不显示
                        </el-radio>
                        <el-radio :disabled="isLiveStart" v-model="showNotice" :label="1">
                            显示
                        </el-radio>
                    </div>
                    <div class="mt-20" v-if="showNotice === 1">
                        直播开始前 <el-input-number :disabled="isLiveStart" v-model="form.noticeBeforeDay" :min="0" /> 天显示
                    </div>
                    <div :class="{ 'disabled-edit': isLiveStart }">
                        <upload-image
                            v-if="showNotice === 1"
                            :count="1"
                            class="mt-20"
                            need-edit
                            :width="750"
                            :height="500"
                            :box-width="100"
                            :box-height="67"
                            v-model="noticeImgList"
                            upload-text="上传封面图"
                        />
                        <div class="mask" />
                    </div>
                </el-form-item>
                <el-form-item label="直播封面" prop="coverImg">
                    <div :class="{ 'disabled-edit': isLiveStart }">
                        <upload-image
                            :count="1"
                            need-edit
                            :width="750"
                            :height="500"
                            :box-width="100"
                            :box-height="67"
                            v-model="coverImgList"
                            upload-text="上传封面图"
                        />
                        <div class="mask" />
                    </div>
                </el-form-item>
                <el-form-item label="选择视频库视频" prop="videoLibId" required v-if="form.liveType === 'video'">
                    <el-button :disabled="isLiveStart || isLiveEnd" @click="showVideoList = true" type="primary" plain>
                        选择视频({{ form.videoLibId !== '0' ? 1 : 0 }})
                    </el-button>
                    <span class="sid-gray">每次直播只能选择一个视频</span>
                </el-form-item>
                <el-form-item label="是否付费观看" prop="isPay">
                    <div>
                        <el-radio :disabled="!!id" v-model="form.isPay" :label="0">
                            <span>免费</span><span class="sid-gray">(勾选，则用户免费观看直播)</span>
                        </el-radio>
                        <el-radio v-model="form.isPay" :label="1" :disabled="!mchId || !!id">
                            <span>付费</span>
                            <span v-if="mchId" class="sid-gray">(勾选，用户需支付一定费用观看直播)</span>
                            <span v-else class="sid-gray">
                                <i>(您还未开通微信支付，请先开通)</i>
                                <el-button v-if="regType === 2" type="text" class="ml-10" @click="$router.push({ name: 'WechatPay' })">
                                    立即开通
                                </el-button>
                                <el-button v-else type="text" class="ml-10" @click="$router.push({ name: 'WechatBind' })">
                                    立即开通
                                </el-button>
                            </span>
                        </el-radio>
                    </div>
                    <div class="mt-20" v-if="form.isPay === 0">
                        <el-radio :disabled="!!id" v-model="roomTokenRadio" :label="0">
                            <span>直播间不需要口令</span>
                        </el-radio>
                        <el-radio :disabled="!!id" v-model="roomTokenRadio" @change.once="e => { !form.roomToken ? setRoomToken() : '' }" :label="1">
                            <span>开启直播间口令</span>
                        </el-radio>
                        <template v-if="roomTokenRadio === 1">
                            <el-input style="width: 125px" disabled :value="form.roomToken" />
                            <el-button :disabled="!!id" class="ml-10" @click="setRoomToken()">
                                刷新
                            </el-button>
                            <span class="sid-gray">（开启直播间口令后，学生进入直播间需要输入口令）</span>
                        </template>
                    </div>
                    <div class="mt-20" v-if="form.isPay === 1">
                        支付金额 <el-input-number :disabled="!!id" v-model="form.paidAmount" :min="0.01" /> 元<span class="sid-gray">(当前场次直播，一个用户收取费用)</span>
                    </div>
                </el-form-item>
                <el-form-item prop="isNeedSignUp" label="观看直播报名" required>
                    <div>
                        <el-radio :disabled="!!id" v-model="form.isNeedSignUp" :label="0">
                            不报名
                        </el-radio>
                        <el-radio :disabled="!!id || form.liveMode === 'private'" v-model="form.isNeedSignUp" :label="1">
                            报名
                            <span class="sid-gray">（报名后进入直播间需用户填写信息）</span>
                        </el-radio>
                    </div>
                    <div v-if="form.isNeedSignUp === 1">
                        <div>参与活动需报名后参与，请设置报名内容（设置成功后不可更改）</div>
                        <el-checkbox :disabled="!!id" v-model="form.isHaveName" :true-label="1" :false-label="0">
                            姓名
                        </el-checkbox>
                        <el-checkbox :disabled="!!id" v-model="form.isHaveTelphone" :true-label="1" :false-label="0">
                            电话
                        </el-checkbox>
                        <el-checkbox :disabled="!!id" v-model="form.isHaveGrade" :true-label="1" :false-label="0">
                            年级
                        </el-checkbox>
                        <el-checkbox :disabled="!!id" v-model="form.isHaveRegion" :true-label="1" :false-label="0">
                            所在区域
                        </el-checkbox>
                        <span style="margin: 0 20px 0 30px">自定义</span>
                        <el-input :disabled="!!id" style="width: 150px" maxlength="6" v-model="form.isHaveCustomer" placeholder="请输入标题名称" />
                        <span class="sid-gray">（至多可输入6个字的标题名称）</span>
                    </div>
                </el-form-item>
                <el-form-item label="是否支持回放" required>
                    <span v-if="form.liveType === 'live'">不支持（直播结束后可手动添加回看）</span>
                    <span v-else-if="form.liveType === 'video'">支持（直播结束后可手动取消回看）</span>
                    <div v-if="false">
                        <el-radio v-model="form.supportReview" :label="1">
                            支持
                        </el-radio>
                        <el-radio v-model="form.supportReview" :label="0">
                            不支持
                        </el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="添加商品" prop="productList">
                    <el-button :disabled="(form.courseList.length + form.productList.length) >= maxProduct" type="primary" plain @click="showSelectPro = true">
                        添加商品({{ form.productList.length }})
                    </el-button>
                    <el-button :disabled="(form.courseList.length + form.productList.length) >= maxProduct" type="primary" plain @click="showSelectKnowledge = true">
                        添加知识课程({{ form.courseList.length }})
                    </el-button>
                    <span class="sid-gray">（最多可添加 20 个商品或课程）</span>
                    <div class="selected-list">
                        <!-- 商品 -->
                        <el-table v-if="form.productList.length" key="pro-table" :data="form.productList">
                            <el-table-column prop="img" label="商品图片">
                                <template #default="{ row }">
                                    <img v-imgError style="width: 82px; height: 82px" :src="row.productMainImage" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column prop="productName" label="商品名称" />
                            <el-table-column prop="price" label="价格 (元)">
                                <template #default="{ row }">
                                    {{ row.price || '免费' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="originPrice" label="操作">
                                <template #default="{ $index }">
                                    <el-button type="danger" plain @click="form.productList.splice($index,1)">
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <!-- 系列课 -->
                        <el-table v-if="form.courseList.length" key="course-table" :data="form.courseList" style="margin-top: 20px">
                            <el-table-column prop="img" label="课程图片">
                                <template #default="{ row }">
                                    <img v-imgError style="width: 82px; height: 82px" :src="row.productMainImage" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column prop="productName" label="课程名称" />
                            <el-table-column prop="courseType" label="类型">
                                <template #default="{ row }">
                                    {{ row.productType === 2 ? '单课程' : '系列课' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="价格 (元)">
                                <template #default="{ row }">
                                    {{ row.price || '免费' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="originPrice" label="操作">
                                <template #default="{ $index }">
                                    <el-button type="danger" plain @click="form.courseList.splice($index,1)">
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
                <el-form-item label="奖项设置" prop="couponList">
                    <el-button type="primary" plain @click="showSelectCoupon = true">
                        添加优惠券({{ couponList.length }})
                    </el-button>
                    <el-table :data="couponList" v-if="couponList.length">
                        <el-table-column label="名称" prop="couponName" />
                        <el-table-column label="使用时间" width="120">
                            <template #default="{ row }">
                                <span>{{ row.useStartTime | dateFormat('MM/DD') }}~{{ row.useEndTime | dateFormat('MM/DD') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设置发放量" width="900">
                            <template #default="scope">
                                设置发放量&nbsp;
                                <el-input-number v-model="form.couponList[scope.$index].grantNum" :min="1" />
                                &nbsp;份&nbsp;&nbsp;&nbsp;&nbsp;
                                直播后&nbsp;
                                <el-input-number v-model="form.couponList[scope.$index].afterMinuteShow" :min="0" />
                                &nbsp;分钟显示
                                &nbsp;&nbsp;&nbsp;&nbsp;每人最多限领
                                <el-input-number v-model="form.couponList[scope.$index].limitNum" :min="1" />
                                &nbsp;张
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template #default="scope">
                                <el-button type="danger" @click="removeCoupon(scope.$index)">
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <hr class="hr">
                <div class="mt-24">
                    <el-button @click="cancel">
                        取消
                    </el-button>
                    <el-button type="primary" @click="confirm">
                        {{ id ? '保存' : '确定' }}
                    </el-button>
                </div>
            </el-form>
        </Panel>

        <!-- 选择商品 -->
        <ProductCheckbox
            :visible.sync="showSelectPro"
            :max-select-num="maxProduct - form.courseList.length"
            :default-list="form.productList"
            @confirm="selectProducts"
        />
        <!-- 选择知识课程 -->
        <KnowledgeProduct
            :visible.sync="showSelectKnowledge"
            :max-select-num="maxProduct - form.productList.length"
            :default-list="form.courseList"
            @confirm="selectKnowledge"
        />
        <!-- 优惠券 -->
        <SelectCoupon
            :show.sync="showSelectCoupon"
            @confirm="selectedCoupon"
            :init-coupon-array="form.couponList"
            :coupon-status="4"
            package-type="2019_01,2019_02"
            coupon-type="1,2"
            :max-select="10"
        />
        <!--选择视频库视频-->
        <CheckLiveVideo
            ref="videoDialog"
            :is-upload="true"
            :default-video="form.videoLibId === '0' ? '' : form.videoLibId"
            @confirm="confirmVideo"
            :show.sync="showVideoList"
        />
        <AddRoom
            :show.sync="showAddRoom"
            :room-count="useRooms"
            @success="roomCreated"
        />
        <SelectStudents
            :show.sync="showSelectStu"
            :selected-users-from-father="form.viewObjectModel.users"
            @confirm="checkStudents"
        />
    </div>
</template>

<script>
import Panel from './../../../../../../components/common/Panel.vue'
import UploadImage from './../../../../../../components/file/Image-Manager'
import SelectCoupon from './../../../../../../components/coupon/Select-Coupon.vue'
import CheckLiveVideo from './../../../../../../components/select/Check-Live-Video.vue'
import AddRoom from './../components/Add-Room.vue'
import SelectStudents from './../components/Select-Students'
import ProductCheckbox from './../../../../../marketing-manage/activities/longmen-festival/components/Product-Checkbox'
import KnowledgeProduct from './../../../../../marketing-manage/activities/longmen-festival/components/Knowledge-Product'
import {
    addLive,
    updateLive,
    getRoomStatus,
    getActiveCompleteInfo,
    getFreeRooms as getRoomsInfo // 获取可以创建直播活动的直播房间
} from './../../../../../../apis/product-center/line-teaching/live'
import { getTagList } from './../../../../../../apis/member'
import { copyFields } from './../../../../../../assets/ts/utils'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    name: 'AddLive',
    components: {
        Panel,
        UploadImage,
        SelectCoupon,
        CheckLiveVideo,
        AddRoom,
        SelectStudents,
        ProductCheckbox,
        KnowledgeProduct
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        const validateNoticeImg = (rule, value, callback) => {
            if (this.showNotice && !this.form.noticeImg) {
                callback(new Error(rule.message))
            } else {
                callback()
            }
        }
        const validateVideoLibId = (rule, value, callback) => {
            if (this.form.liveType === 'video' && this.form.videoLibId === '0') {
                callback(new Error('请选择视频库视频'))
            } else {
                callback()
            }
        }
        const validateIsNeedSignUp = (rule, value, callback) => {
            if (value) {
                const keys = ['isHaveName', 'isHaveTelphone', 'isHaveGrade', 'isHaveRegion', 'isHaveCustomer']
                const flag = keys.some(key => this.form[key])
                if (!flag) {
                    callback(new Error('请至少选择一个报名项'))
                    return
                }
                callback()
            } else {
                callback()
            }
        }
        // 观看对象
        const validateUserRange = (rule, value, callback) => {
            // 部分用户可见
            if (value === 2) {
                if (this.form.viewObjectModel.users.length) {
                    callback()
                } else {
                    callback(new Error('请至少选择一个用户'))
                }
            }
            callback()
        }
        return {
            maxProduct: 20, // 选择商品最大数量
            showVideoList: false, // 选择视频弹窗
            showAddRoom: false, // 新增房间弹框
            playTypeList: [{ label: '实时在线直播互动', value: 'live' }, { label: '录播视频直播互动', value: 'video' }],
            showSelectPro: false,
            showSelectKnowledge: false,
            showSelectCoupon: false,
            phone: '', // 选择用户手机号
            couponList: [],
            noticeImgList: [],
            coverImgList: [],
            // 用户标签
            userTagList: [],
            // 最大创建房间数
            maxRooms: 0,
            // 已使用房间数
            useRooms: 0,
            // 可选择房间
            rooms: [],
            showNotice: 0,
            showPay: 0,
            roomTokenRadio: 0, // 直播口令radio选择
            showSelectStu: false, // 选择学员弹窗
            detail: {}, // 直播详情
            form: {
                isShow: 1,
                liveType: 'live', // 直播 live 视频 video
                liveMode: 'public', // 直播形式 public公开课，private私享课
                roomMode: 2, // 房间模式  1:固定房间地址  2:动态房间地址
                roomId: '', // 直播房间ID
                roomName: '', // 直播房间名称
                lecturerName: '', // 主讲人
                videoLibId: '0',
                couponList: [],
                coverImg: '',
                // 开始时间默认延后一小时，结束时间暂定默认延后25小时
                liveStartTime: moment(Date.now() + (1000 * 60 * 60)).format('YYYY-MM-DD HH:mm:ss'),
                liveEndTime: moment(Date.now() + (1000 * 60 * 60 * 25)).format('YYYY-MM-DD HH:mm:ss'),
                name: '',
                noticeBeforeDay: 0,
                noticeImg: '',
                productList: [],
                courseList: [],
                isPay: 0,
                paidAmount: 0,
                roomToken: '', // 直播口令
                isNeedSignUp: 0,
                isHaveName: 0,
                isHaveTelphone: 0,
                isHaveGrade: 0,
                isHaveRegion: 0,
                isHaveCustomer: '',
                // 支持回放：0不支持，1支持
                supportReview: 1,
                // 观看对象
                userRange: 1,
                viewObjectModel: {
                    users: []
                }
            },
            rules: {
                coverImg: [
                    { required: true, message: '请上传直播封面', trigger: 'blur' }
                ],
                noticeImg: [
                    { required: false, message: '请上传预告封面', trigger: 'blur' },
                    { validator: validateNoticeImg, message: '请上传直播封面', trigger: 'blur' }
                ],
                liveStartTime: [
                    { required: true, message: '请选择开播时间', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '输入直播标题', trigger: 'blur' },
                    { min: 1, max: 15, message: '输入1~15字标题', trigger: 'blur' }
                ],
                roomId: [
                    { required: true, message: '请选择直播房间', trigger: 'blur' }
                ],
                userRange: [
                    { validator: validateUserRange, message: '请至少选择一个用户分组或用户', trigger: 'blur' }
                ],
                productList: [
                    { required: false, message: '请选择商品', trigger: 'blur' }
                ],
                couponList: [
                    { required: false, message: '请选择优惠券', trigger: 'blur' }
                ],
                videoLibId: [
                    { validator: validateVideoLibId, message: '请选择视频库视频', trigger: 'blur' }
                ],
                isPay: [
                    { required: true, message: '请选择付费方式', trigger: 'blur' }
                ],
                isNeedSignUp: [
                    { validator: validateIsNeedSignUp, message: '请至少选择一个报名项', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters('user', ['mchId', 'regType']),
        // 直播中
        isLiveStart () {
            return this.detail.particularStatue === 4
        },
        // 直播结束
        isLiveEnd () {
            return this.detail.statue === 0
        }
    },
    watch: {
        showNotice (val) {
            if (val) {
                this.rules.noticeImg[0].required = true
                this.form.noticeImg = this.noticeImgList[0] || ''
            } else {
                this.rules.noticeImg[0].required = false
                this.form.noticeImg = ''
                this.form.noticeBeforeDay = ''
                this.$refs.form.clearValidate('noticeImg')
            }
            this.$set(this.rules, 'noticeImg', this.rules.noticeImg)
        },
        noticeImgList (val) {
            this.form.noticeImg = val[0] || ''
        },
        coverImgList (val) {
            this.form.coverImg = val[0] || ''
        }
    },
    async activated () {
        try {
            // 获取需要的公共数据
            await Promise.all([
                this.getRoomsInfo(),
                this.getTagList()
            ])

            if (this.id) {
                await this.getDetail()
            }

            // 是否有权限
            if (this.id) {
                const { result: { enable } } = await getRoomStatus(this.form.roomId)
                if (enable === 3) {
                    this.$router.go(-1)
                }
            }
        } catch (e) { throw e }
    },
    deactivated () {
        this.$destroy()
    },
    methods: {
    // 选择学员
        checkStudents (list) {
            this.form.viewObjectModel.users = list || []
        },
        // 新增房间成功
        async roomCreated () {
            try {
                await this.getRoomsInfo()
            } catch (e) { throw e }
        },
        // 选择房间
        checkRoom (val) {
            const roomInfo = this.rooms && this.rooms.find(({ roomId }) => val === roomId)
            this.form.roomName = roomInfo.roomName
        },
        // 获取可以创建直播活动的直播房间
        async getRoomsInfo () {
            try {
                const { result } = await getRoomsInfo()
                this.useRooms = result.useRooms || 0
                this.maxRooms = result.maxRooms || 0
                this.rooms = result.rooms || []
            } catch (e) { throw e }
        },
        // 获取用户分组
        async getTagList () {
            try {
                const { result } = await getTagList()
                this.userTagList = result
            } catch (e) { throw e }
        },
        // 设置口令
        setRoomToken () {
            this.form.roomToken = this.getRandom(this.form.roomToken)
        },
        // 生成随机直播口令
        getRandom (oldToken) {
            const newToken = Math.floor((Math.random() * (10000 - 1000)) + 1000)
            return newToken === oldToken ? this.getRandom(oldToken) : newToken
        },
        // 选择视频
        confirmVideo ({ id }) {
            this.form.videoLibId = id
        },
        dateChange ({ start, end }) {
            this.form.liveStartTime = start || ''
            this.form.liveEndTime = end || ''
        },
        async getDetail () {
            try {
                const { result } = await getActiveCompleteInfo(this.id)
                const {
                    coverImg,
                    noticeImg,
                    couponList,
                    roomId,
                    roomName
                } = result
                // 判断 isPay 字段
                result.isPay = result.isPay === 1 ? 1 : 0
                // 是否有口令
                this.roomTokenRadio = result.roomToken ? 1 : 0
                this.coverImgList = [coverImg]
                if (noticeImg) {
                    this.noticeImgList = [noticeImg]
                }
                for (const item of couponList) {
                    item.id = item.couponId
                }
                this.couponList = couponList
                if (noticeImg) {
                    this.showNotice = 1
                }
                if (roomId && roomName && this.rooms.every(({ roomId: roomId_ }) => roomId_ !== roomId)) {
                    this.rooms.push({ roomId, roomName })
                }
                this.detail = result
                copyFields(this.form, result)
            } catch (e) { throw e }
        },
        // 用于提交之前数据的一些处理
        beforeComfirm () {
            if (this.form.liveType === 'live') {
                this.form.videoLibId = '0'
                this.form.supportReview = 0
            }
            if (this.form.liveType === 'video') {
                this.form.supportReview = 1
            }
            // 若免费金额置为0
            if (this.form.isPay === 0) {
                this.form.paidAmount = 0
            }
            // 若收费密码置为空
            if (this.form.isPay === 1) {
                this.form.roomToken = ''
            }
            // 若不报名
            if (!this.form.isNeedSignUp) {
                const keys = ['isHaveName', 'isHaveTelphone', 'isHaveGrade', 'isHaveRegion']
                let key
                for (let i = 0; i < keys.length; i++) {
                    key = keys[i]
                    this.form[key] = 0
                }
                this.form.isHaveCustomer = ''
            }
            // 若是公开课
            if (this.form.liveMode === 'public') {
                this.form.userRange = 1
            }
            // 若是普通会员
            if (this.form.userRange === 1) {
                this.form.viewObjectModel = {
                    users: []
                }
            }
            this.form.paidAmount = Number(this.form.paidAmount.toFixed(2))
            this.form.roomToken = this.roomTokenRadio === 1 ? this.form.roomToken : ''
        },
        async confirm () {
            try {
                await this.$refs.form.validate()
                // 判断是否选中付费
                if (this.form.isPay === 1 && !this.form.paidAmount) {
                    return this.$warning('最小支付金额应大于 0 元')
                }
                // 是否有口令
                if (this.form.isPay === 0 && this.roomTokenRadio === 1) {
                    const reg = /^\d{4}$/
                    if (!reg.test(this.form.roomToken)) {
                        return this.$warning('请输入4位密码')
                    }
                }
                this.beforeComfirm()
                // productType    商品类型  1：商品    2：单课程   3：系列课
                const productList = this.form.productList.map(({ id }) => ({ id, productType: 1 }))
                const courseList = this.form.courseList.map(item => ({
                    id: item.id,
                    productType: item.productType
                }))
                const form = {
                    ...this.form,
                    productList,
                    courseList
                }
                if (this.id) {
                    form.id = this.id
                    await updateLive(form)
                } else {
                    await addLive(form)
                }
                this.$router.replace({ name: 'SeriesOverview' })
            } catch (e) { throw e }
        },
        cancel () {
            this.$router.go(-1)
        },
        selectKnowledge (list) {
            this.form.courseList = list.map(item => {
                item.productName = item.courseName
                item.productType = item.courseType === 1 ? 2 : 3
                item.price = item.sellingPrice
                item.originPrice = item.originalPrice
                item.productMainImage = item.courseImg
                return item
            })
        },
        selectProducts (list) {
            for (const pro of list) {
                pro.price = Math.min(...pro.skuEntityList.map(({ price }) => price !== 0 ? price : 0))
                pro.originPrice = Math.max(...pro.skuEntityList.map(({ originPrice }) => originPrice !== 0 ? originPrice : 0))
            }
            this.form.productList = list
        },
        selectedCoupon (data) {
            for (const item of data) {
                const temp = this.form.couponList.find(formItem => formItem.couponId === item.id)
                const grantNum = temp ? temp.grantNum || 1 : 1
                const afterMinuteShow = temp ? temp.limitNum || 1 : 1
                const limitNum = temp ? temp.afterMinuteShow || 0 : 0
                item.grantNum = grantNum
                item.limitNum = limitNum
                item.afterMinuteShow = afterMinuteShow
            }
            this.couponList = [...data]
            this.form.couponList = this.couponList.map(item => ({
                afterMinuteShow: item.afterMinuteShow,
                couponId: item.id,
                id: item.id,
                grantNum: item.grantNum,
                limitNum: item.limitNum
            }))
        },
        removeCoupon (i) {
            this.couponList.splice(i, 1)
        }
    }
}
</script>

<style scoped lang="scss">

.disabled-edit {
    position: relative;
    display: inline-block;
    > .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: not-allowed;
    }
}
.add-live {
    padding-bottom: 40px;
}
.selected-list {
    margin-top: 20px;
}
.sid-left {
    margin-left: 6px;
}
.sid-gray {
    margin-left: 6px;
    color: #999;
    font-size: 12px;
}

.el-table {
    border: 1px solid #ebeef5;
}

</style>
