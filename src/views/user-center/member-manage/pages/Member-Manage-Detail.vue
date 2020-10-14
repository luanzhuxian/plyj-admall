<template>
    <div :class="$style.memberDetail" class="bg-white">
        <!-- 用户基本信息 -->
        <div :class="$style.module">
            <div :class="$style.moduleTitle">用户基本信息</div>
            <BaseInfo
                :avatar="memberDetail.userImage"
                :nick-name="memberDetail.nickName"
                :role-code="memberDetail.roleCode"
                :gender="memberDetail.gender"
                :type="Number(memberDetail.type)"
                :other="memberDetail.other"
                :mobile="memberDetail.mobile"
                :user-name="memberDetail.userName"
                :address="memberDetail.addressPath + memberDetail.address || ''"
                :source="memberDetail.source"
                :tags="memberDetail.tags"
                :create-time="memberDetail.createTime"
                :last-login-time="memberDetail.lastLoginTime"
                :last-purchase-time="memberDetail.lastPurchaseTime"
                :id="memberDetail.id"
                @tagChange="getMemberDetail"
            />
        </div>

        <div :class="$style.module">
            <div :class="$style.moduleTitle">
                <span>备注用户信息</span>
                <el-button v-show="!isEdit" type="text" @click="isEdit = true">编辑</el-button>
                <el-button v-show="isEdit" type="text" @click="saveAddMemberDetail">保存</el-button>
                <el-button v-show="isEdit" class="ml-0" type="text" @click="cancelEdit">取消</el-button>
            </div>
            <div :class="$style.remarkInfo">
                <el-form
                    inline
                    ref="form"
                    label-width="95px"
                    :model="addMemberDetailForm"
                    :rules="rules"
                >
                    <el-form-item label="真实姓名：" prop="name">
                        <el-input style="width: 220px;" v-show="isEdit" v-model="addMemberDetailForm.name" placeholder="请输入真实姓名" />
                        <div :class="$style.width" v-show="!isEdit" v-text="memberDetail.name || '--'" />
                    </el-form-item>

                    <el-form-item label="用户身份：" prop="other">
                        <el-radio-group v-show="isEdit" v-model="addMemberDetailForm.type" @change="typeChange">
                            <el-radio :label="1">家长</el-radio>
                            <el-radio :label="2">学生</el-radio>
                            <el-radio :label="3">
                                <span v-if="addMemberDetailForm.type !== 3">其它</span>
                                <el-input v-else v-model="addMemberDetailForm.other" />
                            </el-radio>
                        </el-radio-group>
                        <div v-show="!isEdit" :class="$style.width" v-text="memberDetail.type === 3 ? memberDetail.other : USER_TYPE[memberDetail.type] || '--'" />
                    </el-form-item>
                    <br>
                    <el-form-item v-show="!isEdit" label="手机号码：">
                        <div :class="$style.width" v-text="memberDetail.mobile || '--'" />
                    </el-form-item>
                    <el-form-item label="生日：">
                        <el-date-picker
                            v-show="isEdit"
                            value-format="yyyy-MM-dd"
                            v-model="addMemberDetailForm.birthday"
                            placeholder="请选择生日"
                        />
                        <div :class="$style.width" v-show="!isEdit">{{ memberDetail.birthday | dateFormat('YYYY-MM-DD') }}</div>
                    </el-form-item>

                    <el-form-item v-show="!isEdit" label="年龄：">
                        <div :class="$style.width" v-text="memberDetail.age" />
                    </el-form-item>

                    <br v-show="!isEdit">

                    <el-form-item label="微信号：" prop="wechatNumber" :required="false">
                        <el-input v-show="isEdit" :class="$style.width" v-model="addMemberDetailForm.wechatNumber" placeholder="请输入微信号" />
                        <div v-show="!isEdit" :class="$style.width" v-text="memberDetail.wechatNumber || '--'" />
                    </el-form-item>

                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-show="isEdit" style="width: 220px;" v-model="addMemberDetailForm.email" placeholder="请输入邮箱" />
                        <div v-show="!isEdit" :class="$style.width" v-text="memberDetail.email || '--'" />
                    </el-form-item>

                    <br v-show="isEdit">

                    <el-form-item label="行业：" prop="industry">
                        <el-input v-show="isEdit" style="width: 220px;" v-model="addMemberDetailForm.industry" placeholder="请输入行业" />
                        <div v-show="!isEdit" :class="$style.width" v-text="memberDetail.industry || '--'" />
                    </el-form-item>

                    <br v-show="!isEdit">

                    <el-form-item label="公司：" prop="company">
                        <el-input v-show="isEdit" style="width: 220px;" v-model="addMemberDetailForm.company" placeholder="请输入公司" />
                        <div v-show="!isEdit" :class="$style.width" v-text="memberDetail.company || '--'" />
                    </el-form-item>

                    <el-form-item label="职位：" prop="workPosition">
                        <el-input v-show="isEdit" style="width: 220px;" v-model="addMemberDetailForm.workPosition" placeholder="请输入职位" />
                        <div v-show="!isEdit" :class="$style.width" v-text="memberDetail.workPosition || '--'" />
                    </el-form-item>

                    <br v-show="isEdit">

                    <el-form-item label="所在区域：" prop="address">
                        <div v-show="isEdit">
                            <CityPicker style="width: 260px;" @selected="selectedCity" :default-value="defaultCity" />
                            <el-input style="width: 260px;" class="ml-10" v-model="addMemberDetailForm.address" placeholder="请输入详细地址" />
                        </div>
                        <div v-show="!isEdit" :class="$style.width" v-text="(memberDetail.addressPath + memberDetail.address) || '--'" />
                    </el-form-item>

                    <br>

                    <el-form-item v-show="!isEdit" label="备注：" style="display: block;">
                        <div class="flex">
                            <div :class="$style.remark" v-text="memberDetail.remark || '--'" />
                            <el-button class="pb-0 pt-0 ml-40" type="text" v-if="memberDetail.remark" @click="more">查看更多</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <DataBar
            style="margin-top: 28px"
            title="用户行为数据"
            :data-list="[
                { title: '近30天自购订单量', data: memberData.currentMonthOrder },
                { title: '累计自购订单量', data: memberData.totalOrder },
                { title: '支付总额', data: memberData.totalAmount/100 },
                { title: '分享订单量', data: memberData.shareOrder }
            ]"
        />

        <pl-tabs id="member-tabs" :value="tabName" :tabs="Tab_List" @tabClick="tabClick" />

        <keep-alive>
            <router-view :order-type="Order_Type" :order-status-map="orderStatusMap" @addRemarkSuccess="getMemberDetail" />
        </keep-alive>
        <!-- 添加标签 -->
        <add-tags
            :show.sync="showAddTagDialog"
            :current-member="memberDetail"
            @confirm="getMemberDetail"
        />
    </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Pagination from '../../../../components/common/Pagination.vue'
import Field from '../../../../components/common/base/Field.vue'
import CityPicker from '../../../../components/common/base/City-Picker.vue'
import AddTags from '../components/Add-Tags.vue'
import WatchDetailList from '../components/Watch-Detail-List.vue'
import DataBar from '../../../../components/user-center/Data-Bar.vue'
import BaseInfo from '../../../../components/user-center/Base-Info.vue'
import SelectCategory from '../../../../components/product-center/category-manage/Select-Category.vue'
import { copyFields } from '../../../../assets/ts/utils'
import {
    isName,
    isWechatNumber
} from '../../../../assets/ts/validate'
import {
    saveMemberInfo,
    getMemberDetail,
    getMemberOrderCount
} from '../../../../apis/member'

const testName = (rule: DynamicObject, value: string, callback: Function) => {
    if (!value) {
        return callback()
    }
    if (isName(20, value)) {
        return callback()
    }
    return callback(new Error(rule.message))
}
const testWechatNumber = (rule: DynamicObject, value: string, callback: Function) => {
    if (!value) {
        return callback()
    }
    if (value && !/[a-zA-Z]/.test(value[0])) {
        callback(new Error('微信号必须以字母开头'))
        return
    }
    if (isWechatNumber(value)) {
        callback()
    } else {
        callback(new Error('请输入6-20位字母、数字、下划线和减号'))
    }
}
const testUserType = (form: DynamicObject) => (rule: DynamicObject, value: string, callback: Function) => {
    if (form.type === 3 && !value) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

@Component({
    components: {
        AddTags,
        Field,
        CityPicker,
        Pagination,
        WatchDetailList,
        SelectCategory,
        DataBar,
        BaseInfo
    }
})
export default class MemberManageDetail extends Vue {
    moment = moment
    // 角色
    roleType = {
        SUPER_ADMIN: '超级管理员',
        ENTERPRISE_ADMIN: '企业级管理',
        ADMIN: '高级管理员',
        EMPLOYEE: '子账号',
        HELPER: 'Helper',
        MEMBERSHIP: '普通会员'
    }

    orderStatusMap= [
        { label: '全部', value: '' },
        { label: '待发货', value: 'WAIT_SHIP' },
        { label: '待收货', value: 'WAIT_RECEIVE' },
        { label: '待付款', value: 'WAIT_PAY' },
        { label: '订单完成', value: 'FINISHED' },
        { label: '订单关闭', value: 'CLOSED' }
    ]

    USER_TYPE = {
        1: '家长',
        2: '学生',
        3: '其他'
    }

    // 用户行为数据Tab
    Tab_List = [
        { name: 'MemberBuyRecord', label: '购买记录', content: '购买记录，是该用户在机构店铺中自行购买课程、商品、直播等的订单记录信息。' },
        { name: 'MemberShareRecord', label: '分享记录', content: '分享订单记录，是该用户将机构店铺中的课程、商品、直播等分享给好友，好友购买成功后与该用户相关的分享订单记录信息。' },
        { name: 'MemberLiveRecord', label: '直播观看记录' },
        { name: 'MemberOnlineProgress', label: '云课堂学习进度' },
        { name: 'MemberRemark', label: '备注' }
    ]

    Order_Type = [
        { value: '', label: '全部' },
        { value: 'PHYSICAL_GOODS', label: '实体商品' },
        { value: 'VIRTUAL_GOODS', label: '虚拟商品' },
        { value: 'EXPERIENCE_CLASS', label: '体验课' },
        { value: 'FORMAL_CLASS', label: '正式课' },
        { value: 'KNOWLEDGE_COURSE', label: '知识课程' },
        { value: 'SERIES_OF_COURSE', label: '系列课' },
        { value: 'GRAPHIC_DATA', label: '图文资料' },
        { value: 'LIVE_GOODS', label: '直播订单' },
        { value: 'VIDEO_GOODS', label: '录播订单' }
    ]

    GENDER = {
        0: '保密',
        1: '男',
        2: '女'
    }

    // 当前用户是否helper
    isHelper = false

    // 用户数据
    memberDetail: DynamicObject = {
        tags: []
    }

    addMemberDetailForm: DynamicObject = {
        name: '',
        type: '',
        birthday: '',
        wechatNumber: '',
        other: '',
        email: '',
        industry: '',
        workPosition: '',
        company: '',
        address: '',
        addressPath: '',
        province: '',
        city: '',
        region: '',
        town: ''
    }

    defaultCity: string[] = []
    // 是否显示添加标签弹框
    showAddTagDialog = false
    // 是否编辑用户备注信息
    isEdit = false
    // 当前所在的tab页
    tabName = ''
    // 用户行为数据统计
    memberData = {
        currentMonthOrder: 0,
        totalOrder: 0,
        totalAmount: 0,
        shareOrder: 0
    }

    rules = {
        name: [
            { validator: testName, message: '请输入1~20位中文或英文的组合', trigger: 'blur' }
        ],
        wechatNumber: [
            { validator: testWechatNumber, trigger: 'blur' }
        ],
        email: [
            { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        company: [
            { max: 100, min: 0, message: '请输入100个字符以内', trigger: 'blur' }
        ],
        industry: [
            { max: 100, min: 0, message: '请输入100个字符以内', trigger: 'blur' }
        ],
        workPosition: [
            { max: 100, min: 0, message: '请输入100个字符以内', trigger: 'blur' }
        ],
        address: [
            { max: 100, min: 0, message: '请输入100个字符以内', trigger: 'blur' }
        ],
        other: [
            { required: false, message: '请输入自定义身份', trigger: 'blur' },
            { validator: testUserType(this.addMemberDetailForm), message: '请输入自定义身份', trigger: 'blur' }
        ]
    }

    @Prop() userId!: string

    @Watch('$route', { immediate: true })
    onRouteChange (to: Route) {
        this.tabName = to.name as string
    }

    // 生命周期函数
    async created () {
        const { isHelper } = this.$route.query
        this.isHelper = isHelper === '1'
        await this.getMemberDetail()
        await this.getMemberOrderCount()
    }

    // methods
    async getMemberDetail () {
        try {
            const { result } = await getMemberDetail(this.userId)
            const { province, city, region, town } = result
            this.memberDetail = result
            this.defaultCity = town ? [province, city, region, town] : [province, city, region]
            if (!result.name) result.name = result.userName
            copyFields(this.addMemberDetailForm, result)
        } catch (e) {
            throw e
        }
    }

    async getMemberOrderCount () {
        try {
            const { result } = await getMemberOrderCount(this.userId)
            this.memberData = result || {}
        } catch (e) {
            throw e
        }
    }

    typeChange (val: number) {
        if (val === 3) {
            this.rules.other.splice(0, 1, { required: true, message: '请输入自定义身份', trigger: 'blur' })
        } else {
            this.rules.other.splice(0, 1, { required: false, message: '请输入自定义身份', trigger: 'blur' })
        }
    }

    selectedCity (val: Array<any>) {
        const form = this.addMemberDetailForm
        const { length } = val

        form.province = length ? val[0].code : ''
        form.city = length ? (val[1].code) : ''
        form.region = length ? (val[2] ? val[2].code : '') : ''
        form.town = length ? (val[3] ? val[3].code : '') : ''
        form.addressPath = length
            ? (
                val[0].name +
                val[1].name +
                (val[2] ? val[2].name : '') +
                (val[3] ? val[3].name : '')
            )
            : ''
    }

    // 保存备注用户信息
    async saveAddMemberDetail () {
        try {
            await (this.$refs.form as HTMLFormElement).validate()
            const params = this.addMemberDetailForm
            if (Number(params.type) === 2) {
                params.industry = ''
                params.workPosition = ''
                params.company = ''
            }
            params.mallUserId = this.userId
            await saveMemberInfo(params)
            this.isEdit = false
            await this.getMemberDetail()
        } catch (e) {
            throw e
        }
    }

    cancelEdit () {
        this.isEdit = false;
        (this.$refs.form as HTMLFormElement).clearValidate()
    }

    async more () {
        await this.$router.push({ name: 'MemberRemark' })
        const tabs = document.querySelector('#member-tabs') as HTMLElement
        tabs.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        })
    }

    async tabClick (data: DynamicObject) {
        this.tabName = data.name
        this.$router.push({ name: data.name, query: this.$route.query })
    }
}
</script>
<style module lang="scss">
    .width {
        width: 220px;
    }
    .member-detail {
        padding: 14px 0;
        margin-left: -7px;
    }
    .module {
        margin-bottom: 20px;
        .module-title {
            font-weight: bold;
            font-size: 16px;
        }
    }
    .remark-info {
        margin-top: 24px;
        padding: 27px 32px;
        border-radius: 20px;
        background-color: #F5F6FA;
        .remark {
            display: inline-block;
            width: 220px;
            @include elps();
        }
    }

</style>
