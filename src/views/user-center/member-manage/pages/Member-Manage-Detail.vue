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
                :type="memberDetail.type"
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
                <el-button v-if="!isEdit" type="text" @click="isEdit = true">编辑</el-button>
                <el-button v-if="isEdit" type="text" @click="saveAddMemberDetail">保存</el-button>
                <el-button v-if="isEdit" class="ml-0" type="text" @click="isEdit = false">取消</el-button>
            </div>
            <div :class="$style.remarkInfo">
                <search-box inline ref="searchBox" gap-column="20px" padding="0">
                    <el-form-item label="真实姓名：" style="margin-right: 128px;">
                        <el-input style="width: 220px;" v-if="isEdit" v-model="addMemberDetailForm.name" placeholder="请输入真实姓名" />
                        <span v-else v-text="memberDetail.name || '--'" />
                    </el-form-item>

                    <el-form-item label="用户身份：" style="display: inline-block;">
                        <el-radio-group v-if="isEdit" v-model="addMemberDetailForm.type">
                            <el-radio :label="1">家长</el-radio>
                            <el-radio :label="2">学生</el-radio>
                            <el-radio :label="3">
                                <span v-if="addMemberDetailForm.type !== 3">其它</span>
                                <el-input v-else v-model="addMemberDetailForm.other" />
                            </el-radio>
                        </el-radio-group>
                        <span v-else v-text="memberDetail.type === 3 ? memberDetail.other : USER_TYPE[memberDetail.type] || '--'" />
                    </el-form-item>

                    <el-form-item v-show="!isEdit" label="手机号码：" style="margin-right: 116px;">
                        <span v-text="memberDetail.mobile || '--'" />
                    </el-form-item>
                    <br v-show="isEdit">
                    <el-form-item label="生日：" style="margin-right: 116px;">
                        <el-date-picker
                            v-if="isEdit"
                            value-format="yyyy-MM-dd"
                            v-model="addMemberDetailForm.birthday"
                            placeholder="请选择生日"
                        />
                        <span v-else>{{ memberDetail.birthday | dateFormat('YYYY-MM-DD') }}</span>
                    </el-form-item>

                    <el-form-item label="年龄：" style="margin-right: 116px;">
                        <el-input-number
                            :min="0"
                            :max="199"
                            :precision="0"
                            disabled
                            v-if="isEdit"
                            v-model="addMemberDetailForm.age"
                            placeholder="请输入年龄"
                        />
                        <span v-else v-text="memberDetail.age" />
                    </el-form-item>

                    <el-form-item label="微信号：">
                        <el-input v-if="isEdit" v-model="addMemberDetailForm.wechatNumber" placeholder="请输入微信号" />
                        <span v-else v-text="memberDetail.wechatNumber || '--'" />
                    </el-form-item>
                    <el-form-item label="邮箱：" style="margin-right: 116px;">
                        <el-input style="width: 220px;" v-if="isEdit" v-model="addMemberDetailForm.email" placeholder="请输入邮箱" />
                        <span v-else v-text="memberDetail.email" />
                    </el-form-item>

                    <el-form-item label="行业：" style="margin-right: 116px;">
                        <el-input v-if="isEdit" v-model="addMemberDetailForm.industry" placeholder="请输入行业" />
                        <span v-else v-text="memberDetail.industry" />
                    </el-form-item>

                    <el-form-item label="公司：">
                        <el-input v-if="isEdit" v-model="addMemberDetailForm.company" placeholder="请输入公司" />
                        <span v-else v-text="memberDetail.company" />
                    </el-form-item>
                    <el-form-item label="职位：" style="margin-right: 116px;">
                        <el-input v-if="isEdit" style="width: 220px;" v-model="addMemberDetailForm.workPosition" placeholder="请输入职位" />
                        <span v-else v-text="memberDetail.workPosition" />
                    </el-form-item>

                    <el-form-item label="所在区域：">
                        <template v-if="isEdit">
                            <CityPicker style="width: 260px;" @selected="selectedCity" :default-value="defaultCity" />
                            <br>
                            <el-input style="width: 260px;" class="mt-10" v-model="addMemberDetailForm.address" placeholder="请输入详细地址" />
                        </template>
                        <span v-else v-text="(memberDetail.addressPath + memberDetail.address) || '--'" />
                    </el-form-item>
                    <br>
                    <el-form-item v-if="!isEdit" label="备注：" style="display: block;">
                        <div class="flex">
                            <span :class="$style.remark" v-text="memberDetail.remark || '--'" />
                            <el-button class="pb-0 pt-0 ml-40" type="text" v-if="memberDetail.remark">查看更多</el-button>
                        </div>
                    </el-form-item>
                </search-box>
            </div>
        </div>

        <DataBar
            style="margin-top: 28px"
            title="用户行为数据"
            :data-list="[
                { title: '用户行为数据', data: memberData.currentMonthOrder },
                { title: '累计自购订单量', data: memberData.totalOrder },
                { title: '支付总额', data: memberData.totalAmount/100 },
                { title: '分享订单量', data: memberData.shareOrder }
            ]"
        />

        <pl-tabs :value="tabName" :tabs="Tab_List" @tabClick="tabClick" />

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
    saveMemberInfo,
    getMemberDetail,
    getMemberOrderCount
} from '../../../../apis/member'

const checkSpecialKey = (str: string): boolean => {
    const reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
    for (let i = 0; i < str.length; i++) {
        if (str.match(reg)) {
            return false
        }
    }
    return true
}

const validateInput = (rule: any, value: string, callback: any) => {
    if (!checkSpecialKey(value)) {
        callback(new Error('当前字段不支持表情符号'))
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
        age: '',
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
            { validator: validateInput, trigger: 'blur' }
        ],
        email: [
            { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
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
            copyFields(this.addMemberDetailForm, result)
            // this.addMemberDetailForm = {
            //     name,
            //     type,
            //     birthday,
            //     wechatNumber,
            //     other,
            //     age,
            //     email,
            //     industry,
            //     workPosition,
            //     company,
            //     address,
            //     addressPath,
            //     province,
            //     city,
            //     region,
            //     town
            // }
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
            // await (this.$refs.form as HTMLFormElement).validate()
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

    async more () {
        this.$router.push({ name: 'MemberRemark' })
    }

    async tabClick (data: DynamicObject) {
        this.tabName = data.name
        this.$router.push({ name: data.name })
    }
}
</script>
<style module lang="scss">
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
            width: 150px;
            @include elps();
        }
    }

</style>
