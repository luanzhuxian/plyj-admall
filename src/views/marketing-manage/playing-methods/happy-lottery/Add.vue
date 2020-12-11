<template>
    <div>
        <Panel :title="id ? '编辑抽奖' : '添加抽奖'" width="90%" :top="20">
            <el-form
                class="wrap"
                label-width="150px"
                label-position="left"
                :model="form"
                :rules="rules"
                ref="form"
                auto-scroll-to-error
            >
                <h3 class="mb-10">
                    基本信息
                </h3>
                <el-form-item label="活动名称" prop="name">
                    <el-input
                        style="width: 200px;"
                        v-model="form.name"
                        :disabled="status === 2"
                        placeholder="请输入活动名称"
                    />
                    <span class="tip">（活动名称即为分享活动时的活动标题内容）</span>
                </el-form-item>
                <el-form-item label="活动时间" prop="startTime">
                    <date-range
                        :init="defaultDate"
                        type="datetime"
                        @change="dateChange"
                        :disabled-start-time="status === 2"
                        disable-before
                        clearable
                    />
                </el-form-item>

                <el-form-item label="适用用户" prop="userGroups">
                    <el-radio-group v-model="form.userRange" :disabled="status === 2">
                        <el-radio :label="0">
                            所有用户
                        </el-radio>
                        <el-radio :label="1">
                            helper可用
                        </el-radio>
                        <el-radio :label="2">
                            普通会员
                        </el-radio>
                        <el-radio :label="3" :disabled="!userGroup.length">
                            部分用户组可用
                        </el-radio>
                    </el-radio-group>
                    <UserGroup
                        v-show="form.userRange === 3"
                        @init="userGroupInit"
                        @change="userGroupChange"
                        v-model="selectedUserGroups"
                        :disabled="status === 2"
                    />
                </el-form-item>

                <el-form-item label="活动细则" prop="activityRule">
                    <el-input
                        style="width: 400px;"
                        type="textarea"
                        :maxlength="200"
                        show-word-limit
                        :rows="8"
                        v-model="form.activityRule"
                    />
                </el-form-item>

                <h3 class="mb-10">
                    抽奖设置
                </h3>
                <el-form-item label="奖品设置" prop="gifts">
                    <div :class="$style.awards">
                        <div
                            :class="$style.awardItem"
                            v-for="(item, i) of awards"
                            :key="i"
                        >
                            <el-dialog :visible="currentEditGift === i" @close="currentEditGift = -1" width="680px">
                                <div slot="title" style="color: #333; font-size: 18px; text-align: center; font-weight: bold;">
                                    选择奖品类型
                                </div>
                                <div :class="$style.selectAwardType">
                                    <div @click.prevent="addPresent(item, i)">
                                        <div :class="$style.typeName">
                                            <p>新增礼品</p>
                                            <i>New gift</i>
                                        </div>
                                        <button>
                                            选我
                                        </button>
                                    </div>
                                    <div @click.prevent="addCoupon(item, i)">
                                        <div :class="$style.typeName">
                                            <p>新增优惠券</p>
                                            <i>New coupon</i>
                                        </div>
                                        <button>
                                            选我
                                        </button>
                                    </div>
                                    <div @click.prevent="addScholarship(item, i)">
                                        <div :class="$style.typeName">
                                            <p>新增奖学金</p>
                                            <i>New scholarship</i>
                                        </div>
                                        <button>
                                            选我
                                        </button>
                                    </div>
                                </div>
                            </el-dialog>
                            <!--<div :class="$style.top">
                <el-button size="mini" type="primary" plain @click="addCoupon(item, i)">
                  选择优惠券
                </el-button>
                <el-button size="mini" type="primary" plain @click="addPresent(item, i)">
                  选择礼品
                </el-button>
                <el-button size="mini" type="primary" plain @click="addScholarship(item, i)">
                  选择奖学金
                </el-button>
                <el-button v-if="!item || !item.id" type="danger" plain @click="removeAward(item)">
                  删除
                </el-button>
              </div>-->
                            <el-table
                                :header-cell-class-name="$style.tableHeader"
                                :data="item ? [item] : []"
                                style="width: 100%"
                            >
                                <div slot="empty" class="color-blue">
                                    <el-button @click="removeAward(item)">
                                        移除
                                    </el-button>
                                    <el-button round type="primary" icon="el-icon-circle-plus-outline" @click="selectAward(item, i)">
                                        添加奖品
                                    </el-button>
                                </div>
                                <el-table-column :label="i < 3 ? `${ SectionToChinese(i + 1) }等奖名称` : '好礼'" prop="awardName" width="170">
                                    <template #default="{ row }">
                                        <el-input style="width: 150px;" v-model="row.awardName" />
                                    </template>
                                </el-table-column>

                                <el-table-column label="封面图" width="100" v-if="item && item.awardType === 1">
                                    <template #default="{ row }">
                                        <ImageManager
                                            v-model="row.giftImage"
                                            :count="1"
                                            need-edit
                                            :box-width="70"
                                            :box-height="70"
                                            :width="300"
                                            :height="300"
                                            :delete-truth="!id"
                                            :show-control="!id"
                                        />
                                    </template>
                                </el-table-column>
                                <el-table-column label="发放量" prop="stock" v-if="!item || !item.id" width="150">
                                    <template #default="{ row }">
                                        <el-input-number :controls="false" v-model="row.stock" :max="99999" :min="1" :precision="0" />
                                    </template>
                                </el-table-column>

                                <!-- 编辑 -->
                                <template v-if="item && item.id">
                                    <el-table-column label="当前库存" prop="stock" width="100" />
                                    <el-table-column label="调整库存" prop="stock" width="150">
                                        <template #default="{ row }">
                                            <el-input-number size="mini" v-model="row.adjustment" :max="99999" :min="row.stock ? -row.stock + 1 : 0" :precision="0" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="调整后库存" prop="stock" width="100">
                                        <template #default="{ row }">
                                            <span v-text="row.stock + row.adjustment" />
                                        </template>
                                    </el-table-column>
                                </template>

                                <el-table-column label="兑换时间" min-width="420">
                                    <template #default="{ row }">
                                        <p v-if="item.awardType === 2">
                                            领取当日起
                                            <el-input-number size="mini" v-model="row.scholarshipEffectiveTime" :max="99999" :min="1" :precision="0" />
                                            天以内
                                        </p>
                                        <p v-else-if="item.awardType === 1">
                                            <date-range
                                                :init="[row.giftUseStartTime, row.giftUseEndTime]"
                                                type="datetime"
                                                :disabled-start-time="status === 2 && Boolean(row.id)"
                                                disable-before
                                                @change="date => validateDateChange(date, item)"
                                            />
                                        </p>
                                        <p v-else>
                                            {{ row.giftUseStartTime | dateFormat('YYYY.MM.DD') }}~{{ row.giftUseEndTime | dateFormat('YYYY.MM.DD') }}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="中奖概率" width="200">
                                    <template #default="{ row }">
                                        <el-input-number
                                            :controls="false"
                                            v-model="row.winningProbability"
                                            :max="100"
                                            :min="0.01"
                                            :precision="2"
                                            :step="0.01"
                                        /> %
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="right" header-align="right" v-if="!item || !item.id">
                                    <template>
                                        <el-button type="text" @click="removeAward(item)">
                                            移除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div>
                        <strong>总中奖概率：</strong>
                        <i>{{ Number(totalProbability) }}%</i>
                        <strong class="ml-10">不中奖概率：</strong>
                        <i>{{ Number((100 - totalProbability).toFixed(2)) }}%</i>
                    </div>
                    <div>
                        <el-button round plain type="primary" @click="addAward" :disabled="awards.length === 7">
                            新增奖项
                        </el-button>
                        <span class="fz-12 gray-3">（至多设置7个奖品，最少添加3个奖品，1个奖项是谢谢参与）</span>
                    </div>
                </el-form-item>
                <el-form-item label="设置抽奖条件">
                    <div>
                        <el-button round plain type="primary" @click="addCondition" :disabled="form.terms.length >= 6">
                            添加条件
                        </el-button>
                        <span class="tip">（最多可添加6个）</span>
                    </div>
                    <div
                        :class="$style.condition"
                        v-for="(item, i) of form.terms"
                        :key="i"
                    >
                        <span>用户 </span>
                        <el-select v-model="item.luckDrawType" @change="val => { termsChange(val, item) }">
                            <el-option
                                v-for="con of map"
                                :key="con.value"
                                :label="con.label"
                                :value="con.value"
                                :disabled="form.terms.some(m => m.luckDrawType === con.value) && con.value !== 3"
                            />
                        </el-select>
                        <template v-if="item.luckDrawType === 3">
                            <el-input-number :key="Math.random()" controls-position="right" class="ml-10" :min="0.01" :max="99999" v-model="item.money" />
                            <span> 元，</span>
                        </template>
                        <span> 即可获得 </span>
                        <el-input-number :key="Math.random()" controls-position="right" :min="1" :max="99999" v-model="item.availableLuckDrawNumber" />
                        <span> 次抽奖机会</span>
                        <el-button v-if="form.terms.length > 1" type="text" class="ml-16" @click="form.terms.splice(i, 1)">
                            移除
                        </el-button>
                    </div>
                </el-form-item>

                <h3 class="mb-10">
                    高级设置
                </h3>
                <el-form-item label="品牌曝光" prop="logImageUrl">
                    <el-checkbox v-model="form.isShowLog" @change="showLogoChange" :disabled="status === 2">
                        展示品牌logo
                    </el-checkbox>
                    <span class="fz-12 gray-3">（勾选后，品牌logo将在海报中显示，不勾选则不显示）</span>
                    <ImageManager
                        class="mt-10"
                        v-if="form.isShowLog"
                        v-model="logImageUrl"
                        :count="1"
                        need-edit
                        :box-width="70"
                        :box-height="70"
                        upload-text="上传Logo"
                        :width="300"
                        :height="300"
                        :show-control="status !== 2"
                    />
                </el-form-item>
            </el-form>
            <hr class="hr">
            <div class="wrap">
                <el-button round @click="$router.push({ name: 'HappyLotteryList' })">
                    取消
                </el-button>
                <el-button round type="primary" :loading="loading" @click="save">
                    保存
                </el-button>
            </div>
        </Panel>
        <ScholarshipBox
            :show.sync="showScholarship"
            @confirm="confirmScholarship"
        />
        <EditPresent
            :init-date="[form.startTime, form.endTime]"
            :show.sync="showPresent"
            @confirm="confirmPresent"
            :start-min-date="form.startTime"
            :end-min-date="form.endTime"
            date-type="datetime"
        />
        <RadioSelectCoupon
            :show.sync="showCoupon"
            @confirm="confirmCoupon"
            coupon-type="1,2"
            :coupon-status="4"
        />
    </div>
</template>

<script>
import Panel from '../../../../components/common/Panel.vue'
import UserGroup from '../../../../components/common/User-Group.vue'
import EditPresent from '../../../../components/marketing-manage/Edit-Present.vue'
import ScholarshipBox from '../../../../components/marketing-manage/Scholarship.vue'
import ImageManager from '../../../../components/common/file/Image-Manager.vue'
import RadioSelectCoupon from '../../components/Radio-Select-Coupon.vue'
import { SectionToChinese } from '../../../../assets/ts/utils'
import {
    addLottery,
    getLotteryDetail,
    editLottery,
    getLotteryDetailStock
} from '../../../../apis/marketing-manage/lonmen-festival/lottery'
import moment from 'moment'
// 奖品类
class Award {
  id = ''
  // 奖品名称
  awardName = ''
  // 发放数量
  stock = 1
  // 概率
  winningProbability = 0
  // 1 礼品 2 奖学金 3 全场满减券 4 品类券
  awardType = 0
  constructor ({ id = '', awardName = '', stock = 1, winningProbability = 0.01, awardType, adjustment = 0 }) {
      this.id = id
      this.awardName = awardName
      this.stock = stock
      this.winningProbability = winningProbability
      this.awardType = awardType
      this.adjustment = adjustment
  }
}
class Coupon extends Award {
    // 兑换开始时间
  giftUseStartTime = ''
  // 兑换结束时间
  giftUseEndTime = ''
  // 优惠券价格
  favorablePrice = ''
  // 优惠券id
  awardId = ''
  constructor (args) {
      super(args)
      this.favorablePrice = args.favorablePrice
      this.satisfyPrice = args.satisfyPrice
      this.giftUseStartTime = args.giftUseStartTime
      this.giftUseEndTime = args.giftUseEndTime
      this.giftBrief = args.giftBrief
      this.awardId = args.awardId
  }
}
class Present extends Award {
    // 兑换开始时间
  giftUseStartTime = ''
  // 兑换结束时间
  giftUseEndTime = ''
  // 礼品简介
  giftBrief = ''
  // 封面
  giftImage = []
  constructor (args) {
      super(args)
      this.giftImage = args.giftImage ? [args.giftImage] : []
      this.giftUseStartTime = args.giftUseStartTime
      this.giftUseEndTime = args.giftUseEndTime
      this.giftBrief = args.giftBrief
  }
}
class Scholarship extends Award {
    // 奖学金金额
  scholarshipPrice = 0
  // 奖学金有效期
  scholarshipEffectiveTime = 0
  constructor (args) {
      super(args)
      this.scholarshipPrice = args.scholarshipPrice
      this.scholarshipEffectiveTime = args.scholarshipEffectiveTime
  }
}
const ACTIVE_RULES = `1.在活动有效期内，用户满足抽奖条件，即可获得抽奖机会，消耗抽奖机会即有机会抽中礼品；
2.奖品：用户可随机获得不同额度优惠券，奖学金以及礼品；
3.用户领取成功后，优惠券将自动存入“我的卡包”中，奖学金将自动存入“我的奖学金”中，礼品将自动存入“我的礼品中”，使用有效期内用户可随时查看使用。`
export default {
    name: 'AddHappyLottery',
    components: {
        Panel,
        UserGroup,
        EditPresent,
        ScholarshipBox,
        ImageManager,
        RadioSelectCoupon
    },
    data () {
        const checkGroup = (rule, value, callback) => {
            if (this.form.userRange === 3 && !this.form.userGroups.length) {
                callback(new Error('请选择用户分组'))
            } else {
                callback()
            }
        }
        const checkGifts = (rule, value, callback) => {
            if (this.awards.length < 3) {
                callback(new Error('请至少设置三个奖品'))
            } else {
                callback()
            }
        }
        const checkDate = (rule, value, callback) => {
            // 非进行中的活动校验开始时间

            if (moment(this.form.startTime).valueOf() < Date.now() && this.status !== 2) {
                callback(new Error('活动开始时间不能小于当前时间'))
            } else {
                callback()
            }
        }
        this.checkGroup = checkGroup
        this.checkGifts = checkGifts
        return {
            loading: false,
            // 显示礼品弹框
            showPresent: false,
            // 显示奖学金弹框
            showScholarship: false,
            // 优惠券弹框
            showCoupon: false,
            userGroup: [],
            // 已选的用户分组id
            selectedUserGroups: [],
            // 默认日期
            defaultDate: [],
            awards: [null, null, null],
            // 正在编辑的礼品
            currentEditGift: -1,
            logImageUrl: [],
            status: -1,
            form: {
                name: '',
                startTime: '',
                endTime: '',
                gifts: [],
                isShowLog: false,
                logImageUrl: '',
                userRange: 0,
                userGroups: [],
                terms: [{
                    availableLuckDrawNumber: 1,
                    luckDrawType: 1
                }],
                activityRule: ACTIVE_RULES
            },
            map: [
                {
                    label: '首次注册',
                    value: 1
                },
                {
                    label: '每天进入商城',
                    value: 2
                },
                {
                    label: '单笔订单实际支付满',
                    value: 3
                }
            ],
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { max: 10, message: '活动名称不可超过10个字符', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择活动时间', trigger: 'none' },
                    { validator: checkDate, trigger: 'none' }
                ],
                userGroups: [
                    { validator: checkGroup, trigger: 'none' }
                ],
                gifts: [
                    { validator: checkGifts, trigger: 'none' }
                ],
                activityRule: [
                    { required: true, message: '请输入活动细则', trigger: 'none' }
                ],
                logImageUrl: [
                    { required: false, message: '请上传封面', trigger: 'none' }
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
    watch: {
        logImageUrl (val) {
            this.form.logImageUrl = val[0] || ''
        },
        totalProbability (val) {
            val = Number(val)
            if (val > 100) {
                // 按概率从大到小排序
                const tempAwards = [...this.awards].sort((a, b) => {
                    if (a && b) {
                        return b.winningProbability - a.winningProbability
                    }
                    return 1
                })
                // 概率大于100的情况下，从最大的概率上减
                const differ = val - 100
                for (const award of tempAwards) {
                    if (award && differ > 0) {
                        // 按照每个奖品的概率占总概率的比例，减去相应的超额部分
                        const proportion = award.winningProbability / val
                        let sub = Number(differ * proportion.toFixed(2))
                        sub = sub < 0.01 ? 0.01 : sub
                        if (award.winningProbability > sub) {
                            award.winningProbability -= sub
                        }
                    }
                }
            }
        }
    },
    computed: {
    // 总概率
        totalProbability () {
            return this.awards.length ? this.awards.map(item => item ? item.winningProbability : 0).reduce((t, a) => t + a)
                .toFixed(2) : 0
        }
    },
    async created () {
        try {
            await this.getDetail()
        } catch (e) {
            throw e
        }
    },
    methods: {
        SectionToChinese,
        async getDetail () {
            if (!this.id) {
                return
            }
            try {
                const awards = []
                const {
                    result: {
                        name,
                        startTime,
                        endTime,
                        id,
                        userRange,
                        activityRule,
                        isShowLog,
                        logImageUrl,
                        terms,
                        userGroups,
                        gifts,
                        status
                    }
                } = await getLotteryDetail(this.id)
                // 回显金额单位为分  需除100
                for (const item of terms) {
                    if (item.luckDrawType === 3) item.money /= 100
                }
                await getLotteryDetailStock(this.id)
                this.selectedUserGroups = userGroups.map(item => item.groupId)
                this.defaultDate = [startTime, endTime]
                this.status = status

                // 如果是复制
                if (this.$route.query.copy) {
                    this.status = -1
                    for (const G of gifts) {
                        delete G.id
                    }
                    this.$router.replace({ name: 'AddHappyLottery' })
                }

                // gifts.sort((a, b) => a.winningProbability - b.winningProbability)
                for (const gift of gifts) {
                    gift.awardType = Number(gift.awardType)
                    // 用来调整库存
                    gift.adjustment = 0
                    // 1 礼品 2 奖学金 3 全场满减券 4 品类券
                    if (gift.awardType === 3 || gift.awardType === 4) {
                        awards.push(new Coupon(gift))
                    } else if (gift.awardType === 2) {
                        awards.push(new Scholarship(gift))
                    } else {
                        awards.push(new Present(gift))
                    }
                }
                this.awards = awards
                this.logImageUrl = logImageUrl ? [logImageUrl] : []
                this.form = {
                    name,
                    startTime,
                    endTime,
                    id,
                    userRange,
                    activityRule,
                    isShowLog,
                    logImageUrl,
                    terms,
                    userGroups,
                    gifts
                }
            } catch (e) {
                throw e
            }
        },
        // 修改活动时间
        dateChange ({ start, end }) {
            this.form.startTime = start || ''
            this.form.endTime = end || ''
            for (const award of this.awards) {
                if (start && end && award) {
                    if (moment(award.giftUseStartTime).valueOf() < moment(start).valueOf()) {
                        award.giftUseStartTime = start
                    }
                    if (moment(award.giftUseEndTime).valueOf() < moment(end).valueOf()) {
                        award.giftUseEndTime = end
                    }
                }
            }
        },
        // 修改兑换时间
        validateDateChange ({ start, end }, award) {
            if (start && end && award && this.form.startTime && this.form.endTime) {
                if (moment(start).valueOf() < moment(this.form.startTime).valueOf()) {
                    award.giftUseStartTime = this.form.startTime
                } else {
                    award.giftUseStartTime = start
                }
                if (moment(end).valueOf() < moment(this.form.endTime).valueOf()) {
                    award.giftUseEndTime = this.form.endTime
                } else {
                    award.giftUseEndTime = end
                }
            }
        },
        userGroupInit (list) {
            this.userGroup = list
        },
        userGroupChange (tagIds) {
            this.form.userGroups = tagIds.map(groupId => ({ groupId }))
        },
        // 添加礼品按钮
        addAward () {
            this.awards.push(null)
            this.$refs.form.clearValidate('gifts')
        },
        // 选择礼品
        selectAward (item, index) {
            this.currentEditGift = index
        },
        // 添加礼品
        addPresent () {
            this.showPresent = true
        },
        // 确认添加礼品
        confirmPresent ({ giftDetail: data }) {
            this.awards.splice(this.currentEditGift, 1, new Present({
                giftImage: data.giftImage,
                awardName: data.giftName,
                awardType: 1,
                stock: data.stock,
                giftBrief: data.giftBrief,
                giftUseStartTime: data.useStartTime,
                giftUseEndTime: data.useEndTime
            }))
            this.currentEditGift = -1
        },
        // 添加奖学金
        addScholarship () {
            this.showScholarship = true
            // this.currentEditGift = index
        },
        // 确认添加奖学金
        confirmScholarship (data) {
            this.awards.splice(this.currentEditGift, 1, new Scholarship({
                scholarshipPrice: data.scholarshipPrice,
                scholarshipEffectiveTime: data.scholarshipEffectiveTime,
                awardType: 2,
                awardName: '奖学金',
                stock: data.stock
            }))
            this.currentEditGift = -1
        },
        // 选中优惠券
        addCoupon () {
            this.showCoupon = true
            // this.currentEditGift = index
        },
        // 确认优惠券
        confirmCoupon (data) {
            this.awards.splice(this.currentEditGift, 1, new Coupon({
                awardType: data.couponType === 1 ? 3 : 4,
                awardName: data.couponName,
                giftUseStartTime: data.useStartTime,
                giftUseEndTime: data.useEndTime,
                favorablePrice: data.amount,
                awardId: data.id,
                giftBrief: data.brief,
                satisfyPrice: data.useLimitAmount
            }))
            this.currentEditGift = -1
        },
        // 删除奖品
        removeAward (row) {
            this.$confirm('确定删除该礼品吗？')
                .then(() => {
                    this.awards.splice(this.awards.indexOf(row), 1)
                })
        },
        // 是否先手logo
        showLogoChange (val) {
            this.rules.logImageUrl = [{ required: val, message: '请上传封面', trigger: 'none' }]
        },
        // 保存
        async save () {
            try {
                this.loading = true
                await this.$refs.form.validate()
                if (this.checkAwards()) {
                    // 深拷贝数据 防止数据修改提交失败
                    const form = JSON.parse(JSON.stringify(this.form))
                    form.gifts = this.awards.map(item => {
                        const ITEM = JSON.parse(JSON.stringify(item))
                        ITEM.giftImage = item.giftImage ? item.giftImage[0] : ''
                        if (item.id) {
                            ITEM.stock = ITEM.adjustment
                        }
                        delete ITEM.adjustment
                        return ITEM
                    })
                    form.logImageUrl = form.isShowLog ? form.logImageUrl : ''
                    // 提交金额单位为分  需乘100
                    for (const item of form.terms) {
                        if (item.luckDrawType === 3) item.money = item.money * 100
                    }
                    let data
                    if (this.id) {
                        data = await editLottery(form)
                    } else {
                        data = await addLottery(form)
                    }
                    const { awardStocks, errorCode, errorMsg } = data.result
                    if (errorCode) {
                        if (errorCode === 1) {
                            // 重新显示线上的库存
                            for (const localAward of this.awards) {
                                const onlineAward = awardStocks.find(item => item.id === localAward.id)
                                localAward.stock = onlineAward.stock
                                localAward.adjustment = 0
                            }
                            this.$alert({
                                title: '库存调整失败，请重新调整',
                                message: `${ errorMsg }`
                            })
                                .then(() => {
                                    const el = document.getElementById('gifts')
                                    el.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center',
                                        inline: 'nearest'
                                    })
                                })
                        } else {
                            this.$error(errorMsg)
                        }
                        return
                    }
                    this.$success('保存成功')
                    this.$router.push({ name: 'HappyLotteryList' })
                }
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },
        // 校验奖品设置
        checkAwards () {
            for (const item of this.awards) {
                if (!item || !item.awardName) {
                    this.$error('请输入奖项名称')
                    return false
                }
                if (item.awardName.length > 12) {
                    this.$error('名称必须在4~12个字符之间')
                    return false
                }
                // 添加的时候才校验库存
                if (!item.stock && !this.id) {
                    this.$error('发放量必须大于0')
                    return false
                }
                if (!item.winningProbability) {
                    this.$error('中奖概率必须大于0')
                    return false
                }
                if (item.awardType === 1 && !item.giftImage.length) {
                    this.$error('请上传奖品封面图')
                    return false
                }
            }
            return true
        },
        // 添加抽奖条件
        addCondition () {
            for (const item of this.map) {
                // 如果条件已经使用过一次，那么就不能再用了，除了单笔金额满减的条件可以多次添加
                if (!this.form.terms.some(m => m.luckDrawType === item.value) || item.value === 3) {
                    const con = item.value === 3 ? {
                        availableLuckDrawNumber: 1,
                        luckDrawType: item.value,
                        money: 0
                    } : {
                        availableLuckDrawNumber: 1,
                        luckDrawType: item.value
                    }
                    this.form.terms.push(con)
                    break
                }
            }
        },
        termsChange (val, item) {
            item.availableLuckDrawNumber = 1
            if (val === 3) {
                this.$set(item, 'money', 0)
            } else {
                delete item.money
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        next()
        this.currentEditGift = -1
    }
}
</script>

<style module lang="scss">
  .awards {
    color: #fff;
  }
  .awardItem {
    margin-bottom: 24px;
    color: #fff;
    > .top {
      margin-bottom: 10px;
    }
  }
  .tableHeader {
    background-color: #efefef !important;
  }
  .condition {
    margin-top: 10px;
  }
  .selectAwardType {
    display: grid;
    grid-template-columns: repeat(3, 184px);
    grid-column-gap: 16px;
    justify-content: center;
    padding: 48px 0;
    text-align: center;
    .typeName {
      font-size: 24px;
      > i {
        font-size: 14px;
      }
    }
    > div {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 225px;
      padding: 32px;
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
      &:nth-of-type(1) {
        background-image: linear-gradient(180deg, rgba(237,156,65,1) 0%, rgba(255,194,91,1) 100%);
      }
      &:nth-of-type(2) {
        background-image: linear-gradient(180deg, rgba(246,187,57,1) 0%, rgba(255,220,70,1) 100%);
      }
      &:nth-of-type(3) {
        background-image: linear-gradient(180deg, rgba(255,117,159,1) 0%, rgba(255,131,168,1) 100%);
      }
      > button {
        padding: 0 24px;
        border: 1px solid #fff;
        line-height: 30px;
        color: #fff;
        background: none;
        border-radius: 16px;
      }
    }
  }
</style>
