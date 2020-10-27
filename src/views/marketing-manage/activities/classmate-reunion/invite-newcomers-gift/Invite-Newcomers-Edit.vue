<template>
    <div class="add-product">
        <div class="add-content">
            <div class="content-title" id="basic" ref="basic">
                赢取豪礼设置
            </div>
            <el-form :model="form.invitingEventsEntity" ref="form" :rules="rules" label-position="left" label-width="150px" class="form">
                <el-form-item v-if="false" label="活动名称" prop="activityName">
                    <el-input v-model="form.invitingEventsEntity.activityName" maxlength="24" show-word-limit clearable placeholder="请输入活动名称" style="width:400px" />
                </el-form-item>
                <el-form-item label="活动时间" prop="activityEndTime">
                    <div v-if="form.invitingEventsEntity.status===2">
                        <el-date-picker
                            v-model="form.invitingEventsEntity.activityStartTime"
                            disabled
                            type="datetime"
                            placeholder="开始日期"
                            :editable="false"
                        />
                        至
                        <el-date-picker
                            v-model="form.invitingEventsEntity.activityEndTime"
                            :picker-options="startPickerOptions"
                            type="datetime"
                            placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="23:59:59"
                            :editable="false"
                        />
                    </div>
                    <el-date-picker
                        v-else
                        v-model="activityDaterange"
                        @change="activityDaterangeChange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="startPickerOptions"
                        :default-time="['00:00:00', '23:59:59']"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item label="开启礼品条件" prop="invitedPeopleNumber">
                    注册绑定手机号用户数量<br>
                    <el-input-number v-model="form.invitingEventsEntity.invitedPeopleNumber" :min="1" step-strictly :disabled="form.invitingEventsEntity.status===2" label="满足人数" /> 人 &nbsp;&nbsp; 即可获得开启礼品1次
                </el-form-item>
                <el-form-item label="邀新奖品">
                    <div>
                        <el-button @click="selectGift">
                            新增礼品
                        </el-button>
                        <el-button @click="selectTicket">
                            选择优惠券
                        </el-button>
                        &nbsp;&nbsp; 至多可设置10个奖品
                    </div>
                    <Gift ref="gift" :gift-data="giftData" @giftDataFun="giftDataFun" :status="form.invitingEventsEntity.status" />
                    <Ticket ref="ticket" :status="form.invitingEventsEntity.status" />
                </el-form-item>
                <el-form-item label="活动介绍" prop="activityBrief">
                    <el-input type="textarea" v-model="form.invitingEventsEntity.activityBrief" placeholder="请输入活动详情介绍，仅用于该活动限时" :autosize="{ minRows: 5}" maxlength="500" show-word-limit style="width:420px" />
                </el-form-item>
            </el-form>
            <div class="example">
                <p class="f-mb20">
                    赢取豪礼示例：
                </p>
                <img width="300" style="vertical-align: middle;" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/invite-newcomer-preview_v3.png">
            </div>
            <div class="f-p30 f-bt1 f-cb">
                <el-button @click="$router.back()" style="width:80px;">
                    取消
                </el-button>
                <el-button type="primary" plain @click="preview()" style="width:80px;margin-right:30px">
                    预览
                </el-button>
                <el-button type="primary" plain @click="submitForm('form')" style="width:80px;">
                    保存
                </el-button>
            </div>
        </div>
        <Preview :show.sync="previewShow">
            <img class="f-w1" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/invite-newcomer-long-preview_v2.png">
        </Preview>
    </div>
</template>

<script>
import { saveInviting, getInvitingDetail, updateInviting } from '../../../../../apis/marketing-manage/inviting'
import moment from 'moment/moment'
import Preview from '../../../../../components/common/Preview.vue'
import Gift from '../../../../../components/select/Gift.vue'
import Ticket from '../../../../../components/select/Ticket.vue'
const DEFAULT_TIME = ['2019-11-10 00:00:00', '2019-12-12 23:59:59']
let START_TIME = moment().format('YYYY-MM-DD HH:mm:ss')
let END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
const setDefaultTime = () => {
    // 默认开始时间，默认不得小于当天零点
    // 默认结束时间，默认不得小于当天23点
    START_TIME = moment().format('YYYY-MM-DD HH:mm:ss')
    END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
    // 活动时间超出预设的时间后，向后延申
    if (moment(DEFAULT_TIME[0]).valueOf() < moment(START_TIME).valueOf()) {
        DEFAULT_TIME[0] = moment(START_TIME).add(1, 'hour')
            .format('YYYY-MM-DD HH:mm:ss')
    }
    if (moment(DEFAULT_TIME[1]).valueOf() < moment(END_TIME).valueOf()) {
        DEFAULT_TIME[1] = moment(DEFAULT_TIME[0]).isBefore(END_TIME) ? END_TIME : moment(END_TIME).add(1, 'day')
            .format('YYYY-MM-DD HH:mm:ss')
    }
}
setDefaultTime()
export default {
    name: 'InviteNewcomersEdit',
    components: {
        Preview,
        Gift,
        Ticket
    },
    data () {
        return {
            giftData: [],
            previewShow: false,
            id: '',
            startPickerOptions: {
                disabledDate: time => time.getTime() < Date.now() - 8.64e7
            },
            startPickerOptions2: {
                disabledDate: time => time.getTime() < new Date(this.endTime).getTime()
            },
            form: {
                invitingEventsEntity: {
                    // 活动名称
                    activityName: '双十二助力红包',
                    // 活动时间
                    activityEndTime: DEFAULT_TIME[1],
                    activityStartTime: DEFAULT_TIME[0],
                    // 邀请人数
                    invitedPeopleNumber: 3,
                    // 活动介绍
                    activityBrief: '1.在活动有效期内，每用户发起活动并成功邀请3位好友注册成为店铺会员，即可获得1次翻好礼的机会；用户可多次发活动，即可获得相应次数翻好礼\n' +
            '2.奖品：用户可随机获得大额满减券或小礼品；\n' +
            '3.用户领取成功后，满减券将自动存入“我的卡包”中；礼品将自动存入“我的礼品”中，使用有效期内用户可随时查看使用；\n' +
            '4.“我的礼品”中存放的礼品需在该礼品使用有效期内到店兑换；过期或未到兑换时间使用时不予兑换，请妥善保管。',
                    status: ''
                },
                invitingEventsGiftEntities: [],
                mallInvitingEventsCouponEntities: []
            },
            rules: {
                activityName: [
                    { required: true, message: '请选择活动名称', trigger: 'blur' }
                ],
                activityEndTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                invitedPeopleNumber: [
                    { required: true, message: '请填写开启礼品条件', trigger: 'blur' }
                ],
                activityBrief: [
                    { required: true, message: '请填写活动介绍', trigger: 'blur' }
                ]
            },
            activityDaterange: DEFAULT_TIME,
            selectedTicket: [],
            endTime: ''
        }
    },
    computed: {
        isCopy () {
            return this.$route.name === 'InviteNewcomersCopy'
        }
    },
    async activated () {
        this.form.invitingEventsEntity.status = ''
        this.$refs.gift.remove = true
        this.$refs.ticket.remove = true
        this.form.mallInvitingEventsCouponEntities = []
        this.id = this.$route.params.id
        if (this.id) {
            this.init()
        } else {
            // 再次编辑 + 复制都会进入if中，只有新加时会进入当前页
            this.resetData()
        }
        this.$parent.showTop = false
    },
    methods: {
        giftDataFun (val) {
            this.form.invitingEventsGiftEntities = val
        },
        async init () {
            try {
                const res = await getInvitingDetail(this.id)
                this.form.invitingEventsEntity = res.result.invitingEventsEntity
                this.form.invitingEventsGiftEntities = res.result.invitingEventsGiftEntities
                this.selectedTicket = res.result.mallInvitingEventsCouponEntities
                this.endTime = res.result.invitingEventsEntity.activityEndTime
                if (this.isCopy) {
                    this.form.invitingEventsEntity.status = ''
                }
                for (const i in this.selectedTicket) {
                    this.selectedTicket[i].id = this.selectedTicket[i].coupon
                }
                this.activityDaterange = [res.result.invitingEventsEntity.activityStartTime, res.result.invitingEventsEntity.activityEndTime]
                this.giftData = this.form.invitingEventsGiftEntities
                this.$refs.ticket.selectedTicket = this.selectedTicket
                if (this.form.invitingEventsEntity.status === 2) {
                    this.$refs.gift.remove = false
                    this.$refs.ticket.remove = false
                }
            } catch (e) {
                throw e
            }
        },
        // 时间格式转换
        activityDaterangeChange () {
            if (!this.activityDaterange) {
                this.form.invitingEventsEntity.activityStartTime = ''
                this.form.invitingEventsEntity.activityEndTime = ''
            }
            if (this.activityDaterange && this.activityDaterange.length === 2) {
                this.form.invitingEventsEntity.activityStartTime = moment(this.activityDaterange[0]).format('YYYY-MM-DD HH:mm:ss')
                this.form.invitingEventsEntity.activityEndTime = moment(this.activityDaterange[1]).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        resetData () {
            setDefaultTime()
            this.form.invitingEventsEntity.activityStartTime = DEFAULT_TIME[0]
            this.form.invitingEventsEntity.activityEndTime = DEFAULT_TIME[1]
            this.form.invitingEventsEntity.invitedPeopleNumber = 3
            this.form.invitingEventsEntity.activityBrief = '1.在活动有效期内，每用户发起活动并成功邀请3位好友注册成为店铺会员，即可获得1次翻好礼的机会；用户可多次发活动，即可获得相应次数翻好礼\n' +
        '2.奖品：用户可随机获得大额满减券或小礼品；\n' +
        '3.用户领取成功后，满减券将自动存入“我的卡包”中；礼品将自动存入“我的礼品”中，使用有效期内用户可随时查看使用；\n' +
        '4.“我的礼品”中存放的礼品需在该礼品使用有效期内到店兑换；过期或未到兑换时间使用时不予兑换，请妥善保管。'
            this.form.invitingEventsGiftEntities = []
            this.form.mallInvitingEventsCouponEntities = []
            this.activityDaterange = DEFAULT_TIME
            this.selectedTicket = []
            this.giftData = this.form.invitingEventsGiftEntities
            this.$refs.ticket.selectedTicket = this.selectedTicket
        },
        // 提交表单
        submitForm (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.selectedTicket = this.$refs.ticket.selectedTicket
                    if (this.form.invitingEventsGiftEntities.length + this.selectedTicket.length === 0) {
                        this.$warning('请选择邀新奖品')
                    } else if (this.form.invitingEventsGiftEntities.length + this.selectedTicket.length > 10) {
                        this.$warning('至多可设置10个奖品')
                    } else {
                        this.save()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        async save () {
            for (const i in this.selectedTicket) {
                this.form.mallInvitingEventsCouponEntities[i] = {
                    coupon: this.selectedTicket[i].id,
                    stock: this.selectedTicket[i].stock,
                    couponName: this.selectedTicket[i].couponName
                }
            }
            if (this.id && !this.isCopy) {
                await updateInviting(this.id, this.form)
            } else {
                // 新增活动删除礼品id
                for (const i in this.form.invitingEventsGiftEntities) {
                    delete this.form.invitingEventsGiftEntities[i].id
                }
                await saveInviting(this.form)
            }
            this.$router.back()
            this.$success('保存成功')
        },
        preview () {
            this.previewShow = true
        },
        selectGift () {
            this.$refs.gift.newGift()
        },
        selectTicket () {
            this.$refs.ticket.selectTicket()
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'InviteNewcomersList' && to.name !== 'InviteNewcomersSetting' && to.name !== 'CouponList') {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            })
                .then(() => {
                    next()
                })
        } else {
            next()
        }
    }
}
</script>

<style lang="scss" scoped>
.f-w1{width:100%;}
.f-mb20{margin-bottom:20px;}
.f-p30{padding:30px;}
.f-bt1{border-top:1px solid #e7e7e7;}
.f-cb{clear: both;}
.add-content {
  .content-title {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    height: 60px;
    padding-left: 30px;
    font-size: 14px;
    font-weight: bold;
    background-color: #fbfbfb;
  }
}
.form{
  float:left;
  padding:20px 30px;
  margin-right:30px;
}
</style>
