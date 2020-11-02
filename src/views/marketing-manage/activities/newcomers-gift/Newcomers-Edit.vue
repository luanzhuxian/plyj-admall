<template>
    <div class="add-content">
        <el-form label-width="150px" :model="form" :rules="rules" ref="ruleForm" label-position="left" class="main-form">
            <div class="content-title">
                基本信息
            </div>
            <el-form-item label="活动名称" prop="activityName">
                <el-input
                    maxlength="12"
                    show-word-limit
                    style="width: 320px"
                    v-model="form.activityName"
                    clearable
                    placeholder="请输入活动名称"
                />
                <div class="form-item-tips">
                    至多可输入12个字的活动名称
                </div>
            </el-form-item>
            <el-form-item :error="dateError">
                <div slot="label">
                    <span class="red">*</span>活动时间
                </div>
                <date-range
                    :init="(form.activityStartTime && form.activityEndTime) ? [form.activityStartTime, form.activityEndTime] : []"
                    @change="dateChange"
                    disable-before
                    :clearable="form.status !== 2"
                    :disabled-start-time="form.status === 2"
                />
            </el-form-item>
            <el-form-item>
                <div slot="label">
                    <span class="red">*</span>活动对象
                </div>
                <div style="display: flex; align-items: center">
                    新注册会员<el-tooltip
                        effect="dark"
                        placement="bottom"
                    >
                        <div slot="content" style="width: 180px; line-height: 2">
                            <div>新注册会员是指登录商城未绑定手机号的用户，均为新注册会员；</div>
                            <div>新注册会员在活动时间内完成绑定手机号操作后，均可获得新人优惠大礼包；</div>
                        </div>
                        <pl-svg width="20" name="icon-jinggao" style="margin-left: 5px" fill="#999999" />
                    </el-tooltip>
                </div>
            </el-form-item>
            <el-form-item label="活动细则" prop="activityBrief">
                <el-input
                    type="textarea"
                    placeholder="请输入活动细则的内容"
                    v-model="form.activityBrief"
                    maxlength="500"
                    style="width: 420px"
                    :rows="10"
                    resize="none"
                    show-word-limit
                />
            </el-form-item>
            <div class="content-title">
                礼品信息
            </div>
            <el-form-item label="发放数量" :error="publishNumError">
                <div slot="label">
                    发放数量
                    <div class="label-tips">
                        活动开始后不可修改
                    </div>
                </div>
                <div class="form-item-setting">
                    可设置领取新人优惠大礼包的最高限额
                </div>
                <el-radio v-model="form.limited" @change="changeLimited" :disabled="form.status === 2" :label="0">
                    不限
                </el-radio>
                <el-radio v-model="form.limited" @change="changeLimited" :disabled="form.status === 2" :label="1">
                    发放
                </el-radio>
                <el-input-number v-model="form.publishNum" style="width: 150px" @change="changePubNum" controls-position="right" :min="form.id ? (form.claimNum ? Number(form.claimNum) : 1) : 1" :max="99999" step-strictly :disabled="form.limited === 0" placeholder="请输入发放量" /> 份新人优惠大礼包<span class="form-item-tips">（新人优惠大礼包全部被新注册会员领取成功之后，该新人有礼活动将自动结束）</span>
                <div class="form-item-tips" v-if="form.limited === 0">
                    （活动时间内，不限制领取新人优惠大礼包的数量）
                </div>
                <div class="form-item-tips" v-else>
                    （如设置新人礼品，请保证礼品数量充足，避免出现活动参与人数过多，导致礼品库存不足的情况发生）
                </div>
            </el-form-item>
            <el-form-item>
                <div slot="label">
                    可领取礼品<span class="red">*</span>
                </div>
                <div class="form-item-setting">
                    新人有礼活动可赠送优惠券、奖学金和礼品，可根据实际情况进行组合赠送<br>用户满足条件即可一键获取已添加的新人优惠大礼包。
                </div>
                <div class="man-t10">
                    <el-checkbox v-model="checkbox1">
                        优惠券
                    </el-checkbox>
                    <span class="form-item-tips">（可添加的优惠券类型包括满减券和品类券）</span>
                </div>
                <div class="cliam-content" v-if="checkbox1">
                    <div>
                        <el-button type="primary" plain :disabled="form.couponModels.length > 9" @click="chooseCouponShow = true">
                            选择优惠券
                        </el-button>
                        <span class="form-item-tips">（至多可选择10张优惠券）</span>
                    </div>
                    <div class="tabel-box" v-if="form.couponModels.length">
                        <el-button type="text" class="batch-btn" :disabled="selectionCoupon.length === 0" @click="batchDelete(selectionCoupon, 'couponModels')">
                            批量删除
                        </el-button>
                        <el-table :data="form.couponModels" @selection-change="handleSelectionCoupon">
                            <el-table-column
                                type="selection"
                                width="50"
                                align="right"
                            />
                            <el-table-column label="优惠券类型">
                                <template #default="{row}">
                                    {{ row.couponType === 1 ? '满减券' : '品类券' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="优惠券名称" prop="couponName" />
                            <el-table-column label="面值">
                                <template #default="{row}">
                                    满{{ row.useLimitAmount }}减{{ row.amount }}元
                                </template>
                            </el-table-column>
                            <el-table-column label="赠送数量" width="70">
                                1
                            </el-table-column>
                            <el-table-column width="170">
                                <template slot="header">
                                    用券有效期<el-tooltip
                                        effect="dark"
                                        placement="bottom"
                                    >
                                        <div slot="content" style="width: 180px; line-height: 2">
                                            用券有效期是优惠券领取成功后，在商城中购买相应的商品时可使用的时间；用券时间过期后，优惠劵将自动过期，不可继续使用。
                                        </div>
                                        <pl-svg width="16" name="icon-jinggao" style="margin-left: 5px" fill="#999999" />
                                    </el-tooltip>
                                </template>
                                <template #default="{row}">
                                    {{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}
                                    <div class="date-tips" v-if="Number(Date.parse(row.useEndTime)) > Number(Date.parse(form.activityStartTime)) && Number(Date.parse(row.useEndTime)) < Number(Date.parse(form.activityEndTime))">
                                        用券有效期过期后，新用户不可领取
                                    </div>
                                    <div class="date-tips" v-if="row.status === 3 || (Number(Date.parse(row.useEndTime)) < Number(Date.parse(form.activityStartTime)))">
                                        {{ row.status === 3 ? `${row.couponType === 1 ? '满减券已失效，新用户不可领取' : '品类券已失效，新用户不可领取'}` : '用券有效期已过期，新用户不可领取' }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="right">
                                <template #default="scope">
                                    <el-button type="text" @click="deleteGifts(scope.$index, 'couponModels')">
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="man-t10">
                    <el-checkbox v-model="checkbox2">
                        奖学金
                    </el-checkbox>
                    <span class="form-item-tips">（奖学金即为线上红包，该红包可用于商城消费抵现，不支持提现，转发给其他人。）</span>
                </div>
                <div class="cliam-content" v-if="checkbox2">
                    <div>
                        <el-button type="primary" plain :disabled="form.scholarships.length > 5" @click="addScholarshipShow = true; scholarship = {}">
                            添加奖学金
                        </el-button>
                        <span class="form-item-tips">（至多可添加6个奖学金）</span>
                    </div>
                    <div class="tabel-box" v-if="form.scholarships.length">
                        <el-button type="text" class="batch-btn" :disabled="selectionScholarships.length === 0" @click="batchDelete(selectionScholarships, 'scholarships')">
                            批量删除
                        </el-button>
                        <el-table :data="form.scholarships" @selection-change="handleSelectionScholarships">
                            <el-table-column
                                type="selection"
                                width="50"
                                align="right"
                            />
                            <el-table-column label="奖学金名称">
                                新人奖学金
                            </el-table-column>
                            <el-table-column label="金额（元）" prop="scholarshipPrice" />
                            <el-table-column label="赠送数量" width="70">
                                1
                            </el-table-column>
                            <el-table-column width="170">
                                <template slot="header">
                                    有效时间<el-tooltip
                                        effect="dark"
                                        placement="bottom"
                                    >
                                        <div slot="content" style="width: 180px; line-height: 2">
                                            有效时间是奖学金领取成功后，在商城中购买相应的商品时可使用的时间；有效时间过期后，奖学金将自动过期，不可继续抵扣金额。<br> 有效期按自然天计算。<br> 如：设置奖学金领取当日起10天内可用，则用户在12月1日12:12:12领取奖学金，则该奖学金的可用时间为12月1日12:12:12至12月11日的12:12:11.
                                        </div>
                                        <pl-svg width="16" name="icon-jinggao" style="margin-left: 5px" fill="#999999" />
                                    </el-tooltip>
                                </template>
                                <template #default="{row}">
                                    奖学金领取当日起{{ row.scholarshipEffectiveTime }}日内使用，过期自动作废
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="right">
                                <template #default="scope">
                                    <el-button type="text" @click="deleteGifts(scope.$index, 'scholarships')">
                                        移除
                                    </el-button>
                                    <el-button type="text" @click="editScholarship(scope.$index, scope.row)" v-if="form.status !== 2">
                                        编辑
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="man-t10">
                    <el-checkbox v-model="checkbox3">
                        礼品
                    </el-checkbox>
                    <span class="form-item-tips">（用户可出示礼品兑换二维码进行核销兑换）</span>
                </div>
                <div class="cliam-content" v-if="checkbox3">
                    <div>
                        <el-button type="primary" :disabled="form.gifts.length > 5" plain @click="addPresentShow = true; present = {}">
                            添加礼品
                        </el-button>
                        <span class="form-item-tips">（至多可添加6个礼品）</span>
                    </div>
                    <div class="tabel-box" v-if="form.gifts.length">
                        <el-button :disabled="selectionGifts.length === 0" type="text" class="batch-btn" @click="batchDelete(selectionGifts, 'gifts')">
                            批量删除
                        </el-button>
                        <el-table :data="form.gifts" @selection-change="handleSelectionGifts">
                            <el-table-column
                                type="selection"
                                width="50"
                                align="right"
                            />
                            <el-table-column label="礼品图片">
                                <template #default="{row}">
                                    <img :src="row.giftImage" width="60" height="60" v-viewer>
                                </template>
                            </el-table-column>
                            <el-table-column label="礼品名称" prop="giftName" />
                            <el-table-column label="赠送数量" width="70">
                                1
                            </el-table-column>
                            <el-table-column width="170">
                                <template slot="header">
                                    兑换有效期<el-tooltip
                                        effect="dark"
                                        placement="bottom"
                                    >
                                        <div slot="content" style="width: 180px; line-height: 2">
                                            兑换有效期是礼品可进行线下核销兑换礼品的时间，兑换时间过期后，核销二维码时将不可正常核销兑换。
                                        </div>
                                        <pl-svg width="16" name="icon-jinggao" style="margin-left: 5px" fill="#999999" />
                                    </el-tooltip>
                                </template>
                                <template #default="{row}">
                                    {{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}
                                    <div class="date-tips" v-if="Number(Date.parse(row.useEndTime)) > Number(Date.parse(form.activityStartTime || new Date())) && Number(Date.parse(row.useEndTime)) < Number(Date.parse(form.activityEndTime || new Date()))">
                                        兑换有效期过期后，新用户不可领取
                                    </div>
                                    <div class="date-tips" v-if="Number(Date.parse(row.useEndTime)) < Number(Date.parse(form.activityStartTime || new Date()))">
                                        兑换有效期已过期，新用户不可领取
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="right">
                                <template #default="scope">
                                    <el-button type="text" @click="deleteGifts(scope.$index, 'gifts')">
                                        移除
                                    </el-button>
                                    <el-button type="text" @click="editGifts(scope.$index, scope.row)" v-if="form.status !== 2">
                                        编辑
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-form-item>
            <div class="content-title">
                其它信息
            </div>
            <el-form-item label="品牌曝光">
                <el-checkbox v-model="form.logoShow" class="mr-10" /><span class="form-item-setting">展示品牌logo</span><span class="form-item-tips">（勾选品牌logo将在海报中显示，不勾选则不显示）</span>
                <div v-if="form.logoShow">
                    <UploadImage
                        need-edit
                        v-model="imageList"
                        :width="300"
                        :height="300"
                        :count="1"
                        @change="changeLogoUrl"
                    />
                    <span class="purchase-sort-description">只支持.jpg .png 格式，最多上传1张，大小为2M以内</span>
                </div>
            </el-form-item>
            <div class="btn-box">
                <el-button size="mini" plain style="width: 90px;margin-left: 20px" @click="cancel">
                    取消
                </el-button>
                <el-button size="mini" type="primary" plain style="width: 90px" @click="save">
                    保存
                </el-button>
            </div>
        </el-form>
        <div class="newcomer-example">
            <div class="newcomer-example-title">
                新人有礼示例
            </div>
            <img width="360" src="https://mallcdn.youpenglai.com/static/admall/2.11.0/newcomer.png">
        </div>
        <SelectCoupon
            ref="chooseCoupon"
            :show.sync="chooseCouponShow"
            :can-add="true"
            :init-coupon-array="form.couponModels"
            package-type="2019_02"
            coupon-type="1,2"
            :max-select="10"
            @confirm="SelectedCoupon"
        />
        <AddPresent :show.sync="addPresentShow" :form="present" />
        <AddScholarship :show.sync="addScholarshipShow" :form="scholarship" />
    </div>
</template>

<script>
import moment from 'moment/moment'
import SelectCoupon from '../../components/Select-Coupon.vue'
import {
    saveNewcomerActivitys,
    getNewcomerActivitysDeatil,
    updateNewcomerActivitys
} from '../../../../apis/marketing-manage/newcomers'
import AddPresent from './Add-Present'
import AddScholarship from './Add-Scholarship'
import UploadImage from '../../../../components/common/file/Image-Manager.vue'
export default {
    name: 'NewcomersEdit',
    components: {
        UploadImage,
        AddScholarship,
        AddPresent,
        SelectCoupon
    },
    data () {
        const validatePass = (rule, value, callback) => {
            if (value) {
                if (value.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g)) {
                    callback(new Error('不支持输入表情符号'))
                }
                callback()
            }
        }
        return {
            chooseCouponShow: false,
            status: false,
            startPickerOptions: {
                disabledDate: time => time.getTime() < Date.now() - 8.64e7
            },
            form: {
                activityName: '新人有礼注册活动',
                activityStartTime: '',
                activityEndTime: '',
                // 使用说明
                activityBrief: `1.在活动有效期内，新用户注册成为店铺的会员，且成功绑定手机号，即可领取优惠大礼包1份；
2.每个账号限领一次；
3.优惠大礼包的礼品类型包括：优惠券（包括满减券和品类券）、奖学金和礼品；
4.用户领取成功后，优惠券将自动存入“我的卡包”中，使用有效期内用户可随时查看使用；奖学金将自动存入“我的奖学金”中，使用有效期内用户可随时查看使用；礼品可自动存入“我的礼品”中，兑换有效期内用户可随时进行礼品兑换。`,
                couponModels: [],
                limited: 0,
                publishNum: undefined,
                scholarships: [],
                gifts: [],
                logoUrl: '',
                logoShow: 0
            },
            dateError: '',
            publishNumError: '',
            rules: {
                activityName: [
                    { required: true, message: '活动名称不能为空', trigger: 'blur' },
                    { max: 12, message: '活动名称不能超过12个字符', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                activityStartTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                activityEndTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                activityBrief: [
                    { required: true, message: '活动细则不能为空', trigger: 'blur' },
                    { max: 500, message: '活动细则不能超过500个字符', trigger: 'blur' }
                ],
                publishNum: [
                    { required: true, message: '发放量不能为空', trigger: 'blur' }
                ]
            },
            checkbox1: false,
            checkbox2: false,
            checkbox3: false,
            addPresentShow: false,
            addScholarshipShow: false,
            scholarship: {},
            present: {},
            imageList: [],
            selectionCoupon: [],
            selectionScholarships: [],
            selectionGifts: []
        }
    },
    computed: {
        isCopy () {
            return this.$route.name === 'NewcomersCopy'
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async activated () {
        this.$parent.showTop = false
        this.form.status = ''
        this.dateError = ''
        this.publishNumError = ''
        this.form.activityStartTime = ''
        this.form.activityEndTime = ''
        if (this.id) {
            await this.init()
        }
    },
    methods: {
        async init () {
            try {
                const { result } = await getNewcomerActivitysDeatil(this.id)
                for (const item of result.couponModels) {
                    item.isSelected = false
                }
                this.checkbox1 = result.couponModels.length > 0
                this.checkbox2 = result.scholarships.length > 0
                this.checkbox3 = result.gifts.length > 0
                this.form = { ...result, publishNum: result.limited === 0 ? undefined : result.publishNum }
                if (this.isCopy) {
                    this.form.status = ''
                    this.form.activityStartTime = ''
                    this.form.activityEndTime = ''
                    for (const item of this.form.scholarships) {
                        item.id = ''
                    }
                    for (const item of this.form.gifts) {
                        item.id = ''
                    }
                }
                this.imageList = (this.form.logoShow && this.form.logoUrl) ? [this.form.logoUrl] : []
            } catch (e) {
                throw e
            }
        },
        handleSelectionCoupon (val) {
            this.selectionCoupon = val
        },
        handleSelectionScholarships (val) {
            this.selectionScholarships = val
        },
        handleSelectionGifts (val) {
            this.selectionGifts = val
        },
        async batchDelete (selection, giftType) {
            await this.$confirm({
                title: '确定要全部删除吗？'
            })
            this.form[giftType] = this.form[giftType].filter(item => selection.indexOf(item) < 0)
        },
        async deleteGifts (index, giftType) {
            await this.$confirm({
                title: '确定要删除吗？'
            })
            this.form[giftType].splice(index, 1)
        },
        editScholarship (index, item) {
            this.scholarship = { ...item, scholarshipId: String(index) }
            this.addScholarshipShow = true
        },
        editGifts (index, item) {
            this.present = { ...item, giftId: String(index) }
            this.addPresentShow = true
        },
        cancel () {
            this.$router.back()
        },
        async save () {
            try {
                await this.$refs.ruleForm.validate()
                await this.saveCoupon()
            } catch (e) {
                if (e) throw e
            }
        },
        async saveCoupon () {
            if (!this.checkData()) {
                return
            }
            for (const item of this.form.couponModels) {
                delete item.isSelected
            }
            this.form.logoUrl = this.imageList[0] || ''
            this.form.couponModels = this.checkbox1 ? this.form.couponModels : []
            this.form.scholarships = this.checkbox2 ? this.form.scholarships : []
            this.form.gifts = this.checkbox3 ? this.form.gifts : []
            try {
                if (this.id && !this.isCopy) {
                    await updateNewcomerActivitys(this.id, this.form)
                } else {
                    await saveNewcomerActivitys(this.form)
                }
            } catch (e) {
                throw e
            }
            this.$router.back()
            this.$success('保存成功')
        },
        changeLimited () {
            if (this.form.limited === 0) {
                this.publishNumError = ''
            }
            // this.form.publishNum = this.form.id ? this.form.publishNum : undefined
        },
        changePubNum (e) {
            if (e) {
                this.publishNumError = ''
            } else {
                this.publishNumError = '请输入发放量'
            }
        },
        changeLogoUrl (val) {
            this.imageList = val
            this.form.logoUrl = this.imageList[0] || ''
        },
        checkData () {
            const { checkbox1, checkbox2, checkbox3, form } = this
            const { activityStartTime, activityEndTime, couponModels, scholarships, gifts, logoShow, logoUrl } = form
            const startTime = moment(activityStartTime).valueOf()
            const endTime = moment(activityEndTime).valueOf()
            if (!startTime || !endTime) {
                this.$warning('请选择活动时间')
                return false
            }
            if (this.form.limited === 1 && !this.form.publishNum) {
                this.$warning('请输入发放量')
                return false
            }
            if ((!checkbox1 && !checkbox2 && !checkbox3)) {
                this.$warning('可领取礼品不能为空')
                return false
            }
            if (checkbox1 && !couponModels.length) {
                this.$warning('优惠券不能为空')
                return false
            }
            if (checkbox2 && !scholarships.length) {
                this.$warning('奖学金不能为空')
                return false
            }
            if (checkbox3 && !gifts.length) {
                this.$warning('礼品不能为空')
                return false
            }
            if (logoShow && !logoUrl && !this.imageList.length) {
                this.$warning('请上传展示品牌logo')
                return false
            }
            return true
        },
        SelectedCoupon (data) {
            const array = []
            for (const item of data) {
                const models = {}
                models.id = item.id
                models.couponName = item.couponName
                models.useLimitAmount = item.useLimitAmount
                models.amount = item.amount
                models.isSelected = false
                models.useStartTime = item.useStartTime
                models.useEndTime = item.useEndTime
                models.couponType = item.couponType
                models.status = item.status
                array.push(models)
            }
            this.form.couponModels = array
        },
        // 清除当前数据，还原到页面的初始数据
        clearData () {
            // setDefaultTime()
            this.$refs.ruleForm.clearValidate()
            this.form = {
                activityName: '新人有礼注册活动',
                activityStartTime: '',
                activityEndTime: '',
                // 使用说明
                activityBrief: `1.在活动有效期内，新用户注册成为店铺的会员，且成功绑定手机号，即可领取优惠大礼包1份；
2.每个账号限领一次；
3.优惠大礼包的礼品类型包括：优惠券（包括满减券和品类券）、奖学金和礼品；
4.用户领取成功后，优惠券将自动存入“我的卡包”中，使用有效期内用户可随时查看使用；奖学金将自动存入“我的奖学金”中，使用有效期内用户可随时查看使用；礼品可自动存入“我的礼品”中，兑换有效期内用户可随时进行礼品兑换。`,
                couponModels: [],
                limited: 0,
                publishNum: undefined,
                scholarships: [],
                gifts: [],
                logoUrl: '',
                logoShow: 0
            }
            this.checkbox1 = false
            this.checkbox2 = false
            this.checkbox3 = false
            this.selectionCoupon = []
            this.selectionScholarships = []
            this.selectionGifts = []
            this.imageList = []
        },
        dateChange (val) {
            this.form.activityStartTime = this.form.status === 2 ? this.form.activityStartTime : val.start
            this.form.activityEndTime = val.end
            this.dateError = ''
        }
    },
    async beforeRouteLeave (to, from, next) {
        if (to.name !== 'NewcomersGiftList' && to.name !== 'NewcomersDetail' && to.name !== 'AddCategoryCoupon' && to.name !== 'AddReductionCoupon' && to.name !== 'OrgIndex') {
            await this.$confirm({
                title: '放弃编辑？',
                message: '是否要放弃当前新人有礼编辑，放弃后将不可恢复！'
            })
            if (to.name !== 'AddReductionCoupon' && to.name !== 'AddCategoryCoupon') {
                await this.clearData()
            }
            next()
        } else {
            if (to.name !== 'AddReductionCoupon' && to.name !== 'AddCategoryCoupon') {
                await this.clearData()
            }
            if (to.name === 'AddReductionCoupon' || to.name === 'AddCategoryCoupon') {
                // 多重模态框不隐藏，遮罩层会有问题，所以再去下个页面前先隐藏，回来之后在手动显示
                this.chooseCouponShow = false
            }
            next()
        }
    },
    beforeRouteEnter (to, from, next) {
        next(async vm => {
            if (from.name === 'AddReductionCoupon' || from.name === 'AddCategoryCoupon') {
                vm.chooseCouponShow = true
                await vm.$refs.chooseCoupon.getList()
            }
        })
    }
}
</script>
<style lang="scss" scoped>
  img {
    vertical-align: middle;
  }
  .f-w1 {
    width: 100%;
  }
  .red {
    color: #d0423c;
    margin-right: 4px;
  }
  .man-l20 {
    margin-left: 20px;
  }
  .man-t10 {
    margin-top: 10px;
  }
  .font-12c {
    font-size: 12px;
    color: #ccc;
  }
  .main-form {
    ::v-deep .el-form-item__label {
      padding-left: 30px !important;
    }
  }
  .alink {
    color: #598bf8;
    font-size: 12px;
    text-decoration-line: underline;
  }

  .add-content {
    position: relative;
    .content-title {
      margin-bottom: 24px;
      height: 60px;
      line-height: 60px;
      padding-left: 30px;
      font-size: 14px;
      font-weight: bold;
      background-color: #fbfbfb;
    }
    .btn-box {
      border-top: 1px solid #e7e7e7;
      padding: 24px;
    }
    .newcomer-example {
      position: absolute;
      top: 50px;
      right: 100px;
      .newcomer-example-title {
        padding-left: 80px;
        padding-top: 20px;
        color: #666;
        font-size: 16px;
        padding-bottom: 14px;
      }
      img {
        padding-left: 80px;
      }
    }
  }
  .tabel-box {
    margin-top: 12px;
    width: 700px;
    border: 1px solid #ebeef5;
    border-bottom: none;
    .batch-btn{
      float: right;
      margin-right: 10px;
    }
  }
  .previewBox {
    position: relative;min-height: 300px;padding: 0 10px 50px;background: #f1f5f6;
    .coupon-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 20px;
      > .wrap {
        position: relative;
        margin-top: 10px;
        padding: 8px;
        overflow: hidden;
        > .main {
          width: 100%;
          display: flex;
          box-sizing: border-box;
        }
      }
      .wrap-full {
        background: url('https://mallcdn.youpenglai.com/static/admall/2.0.0/2f6cee93-2da9-4c28-b2fa-ac1ec3655f6a.png');
        background-size: 100% 100%;
      }
      .wrap-category {
        background: url('https://mallcdn.youpenglai.com/static/admall/2.0.0/c9d3afd5-d209-40dd-b89d-1313846d561e.png');
        background-size: 100% 100%;
      }
    }
    .coupon-item-left {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 30px 0 14px 10px;
    }
    .left-top {
      display: flex;
      align-items: center;
    }
    .coupon-price {
      position: relative;
      margin-left: 25px;
      margin-right: 15px;
      font-size: 40px;
      color: #ed2e50;
      > span {
        font-size: 12px;
      }
    }
    .coupon-type {
      width: 20px;
      padding: 3px 2px;
      line-height: 13px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      background-color: #ec8378;
    }
    .coupon-desc {
      > div {
        &:nth-of-type(1) {
          color: #5a5a5a;
          font-size: 12px;
          font-weight: bold;
        }
        &:nth-of-type(2) {
          color: #5a5a5a;
          font-size: 12px;
        }
      }
    }
    .life-time {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #fff;
      .desc-time {
        color: #414141;
      }
      .desc-btn {
        background-color: #f9b20f;
        margin-right: 5px;
        color: #fff;
        font-size: 12px;
        padding: 0 4px;
        border-radius: 8px;
      }
    }
    .coupon-item-right {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 65px;
      padding-left: 10px;
      font-size: 20px;
      color: #fff;
      font-weight: bold;
    }
    .instruction {
      padding: 20px 24px;
      word-break: break-all;
      white-space: pre-line;
      font-size: 24px;
      color: #666;
    }
    .btn {
      position: absolute;bottom: 0;left: 0;width: 100%;height: 50px;line-height: 50px;font-size: 14px;color: #fff;text-align: center;background: #f2b036;
    }
  }
  .cliam-content{
    margin-left: 30px;
  }
  .label-tips{
    font-size: 10px;
    color: #999;
    line-height: 10px;
  }
  .form-item-setting{
    color: #333;
    font-size: 12px;
  }
  .form-item-tips{
    color: #999;
    font-size: 10px;
  }
  .date-tips{
    font-size: 10px;
    color: #FEB105
  }
</style>
