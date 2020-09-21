<template>
    <div class="add-product">
        <div class="add-content">
            <div class="content-title">
                基本信息
            </div>
            <el-form
                class="wrap"
                label-width="150px"
                label-position="left"
                ref="form"
                :model="form"
                :rules="rules"
            >
                <el-form-item label="活动时间" prop="activityStartTime">
                    <date-range
                        :disable-before="true"
                        style="display: inline-block;"
                        @change="receiveDateRangeChange"
                        :init="initDate"
                        :disabled-start-time="status === 1"
                    />
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="活动开始时间不得小于当前时间，结束时间不得小于开始时间"
                        placement="bottom"
                    >
                        <pl-svg name="icon-jinggao" width="18" fill="#999" class="ml-10" />
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="端午活动内容" prop="materialSchemeModels">
                    <div>
                        <span>已选择 {{ form.materialSchemeModels.length }} 个端午活动</span>
                        <el-checkbox
                            style="margin-left: 20px"
                            :indeterminate="materialSchemeModels.length < yearFlavorList.length"
                            v-model="checkAll"
                            @change="checkAllChange"
                            :disabled="status === 1"
                        >
                            全选
                        </el-checkbox>
                        <span class="purchase-sort-description">（请选择活动界面中需要展示签到的端午活动，建议可选择30个端午活动进行签到）</span>
                    </div>
                    <div class="checked-group">
                        <el-checkbox-group :disabled="status === 1" v-model="materialSchemeModels" @change="materialSchemeChange">
                            <el-checkbox
                                v-for="(item, i) of yearFlavorList"
                                :key="i"
                                :label="item.id"
                            >
                                {{ item.materialName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>

                <el-form-item label="适用用户">
                    <el-radio-group :disabled="status === 1" v-model="form.userScope" @change="form.userGroupTagModels = []">
                        <el-radio :label="0">
                            所有注册用户
                        </el-radio>
                        <el-radio :label="1">
                            helper可用
                        </el-radio>
                        <el-radio :label="2">
                            普通会员
                        </el-radio>
                        <el-radio :label="3">
                            部分用户可用<span class="purchase-sort-description"> （请先在会员中心-设置用户分组）</span>
                        </el-radio>
                    </el-radio-group>
                    <div v-if="form.userScope === 3" class="checked-group">
                        <el-checkbox-group :disabled="status === 1" v-model="form.userGroupTagModels">
                            <el-checkbox
                                v-for="(item, i) of userTagList"
                                :key="i"
                                :label="item.id"
                            >
                                {{ item.tagName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>

                <el-form-item label="抽奖条件">
                    集齐已勾选的全部端午活动，即可获得1次抽奖机会
                </el-form-item>

                <el-form-item label="抽奖时间">
                    用户签到参与全部的端午活动，即可进行粽粽大礼的抽奖
                </el-form-item>

                <el-form-item label="活动细则" prop="activityRule">
                    <div class="flex align-item-end">
                        <el-input
                            :disabled="!briefEdit"
                            type="textarea"
                            placeholder="请输入活动详情介绍，仅用于该活动限时（500字以内）"
                            v-model="form.activityRule"
                            maxlength="500"
                            style="width: 600px;"
                            :rows="11"
                            resize="none"
                            show-word-limit
                            :editable="false"
                        />
                        <pl-svg v-if="!briefEdit" class="brief-edit" width="24" name="icon-bianji1" fill="#4F63FF" @click="briefEdit = true" />
                    </div>
                </el-form-item>

                <el-form-item label="总中奖率" prop="winningProbability">
                    <el-input type="number" :disabled="status === 1" v-model.number="form.winningProbability" style="width: 60px;" /> %
                    <span class="purchase-sort-description">（总中奖率仅针对粽粽大礼抽奖概率的设置）</span>
                    <el-tooltip popper-class="winning-probabilit" placement="top" effect="light">
                        <ul class="win-rate" slot="content">
                            <li>总中奖率仅针对粽粽大礼的抽奖，不针对阶梯奖品。</li>
                            <li>设置可分为2种情况：</li>
                            <li>
                                情况1：如果粽粽大礼每个参与用户均可有机会获得奖品；
                                设置中奖率为100%，则每个抽奖用户，均有机会获得
                                粽粽大礼，抽奖的概率按照库存数量进行计算，库存量
                                越少抽中概率越低，库存越多抽中概率越高；
                            </li>
                            <li>情况2：只有部分参与用户可有机会获得奖品；</li>
                            <li>设置中奖概率在1%-99%之间:</li>
                            <li>
                                如，中奖率设置1%，则200个人抽奖，仅有2个用户可有机
                                会获得粽粽大礼；
                            </li>
                            <li>
                                如，中奖率设置为10%，则如果有200个人抽奖，有20个人
                                有机会抽中粽粽大礼；
                            </li>
                        </ul>
                        <u style="cursor:pointer;color:#4F63FF">示例</u>
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="粽粽大礼" prop="giftModels">
                    <el-table
                        class="table mb-20"
                        :data="form.giftModels"
                        style="width: 800px;"
                        v-if="form.giftModels.length"
                    >
                        <el-table-column label="礼品名称" prop="giftName" />
                        <el-table-column label="礼品库存">
                            <template #default="{ row }">
                                <!--
                  最小库存限制，
                  如果是编辑活动，且活动处于进行中，且是原来存在的礼品，最小库存可以为0
                 -->
                                <el-input-number
                                    v-model="row.allAwardLimit"
                                    :min="row.id && status === 1 ? (row.allAwardLimitCopy || 1) : 1"
                                    :step="1"
                                    :precision="0"
                                    @change="val => bigGiftCountChange(row, val, row.id && status === 1)"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="剩余库存" prop="allAwardLimit" width="100" />
                        <el-table-column label="兑换时间" width="170">
                            <template #default="{ row }">
                                <span v-text="row.useStartTime" />
                                <br>
                                <span v-text="row.useEndTime" />
                            </template>
                        </el-table-column>
                        <el-table-column class-name="edit-big-gifts" label="操作" width="250" align="right" header-align="right">
                            <template #default="scope">
                                <el-button v-if="status !== 1 || !scope.row.awardId" type="text" @click="editPresent(scope.row, scope.$index)">
                                    编辑
                                </el-button>
                                <el-button class="mr-10 ml-10" v-if="status !== 1 || !scope.row.awardId" type="text" @click="removePresent(scope.$index)">
                                    删除
                                </el-button>
                                <el-switch
                                    v-model="scope.row.isShow"
                                    active-color="#13ce66"
                                    :active-value="0"
                                    :inactive-value="1"
                                />
                                <span>神秘奖</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="设置为神秘奖，则在活动界面显示为“神秘大奖”图样，用户中奖后可展示实际奖品内容"
                                    placement="bottom"
                                >
                                    <pl-svg name="icon-jinggao" width="18" fill="#999" class="ml-10" style="vertical-align: middle;" />
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button
                        type="text"
                        :disabled="status === 1"
                        v-if="form.giftModels.length < 3"
                        @click="e => { editPresentData = null; showPresent = true; }"
                    >
                        添加礼品
                    </el-button>
                    <span class="purchase-sort-description ml-10">（仅可支持添加至多3个粽粽大礼）</span>
                </el-form-item>

                <el-form-item label="阶梯奖品" prop="awardModels">
                    <el-radio-group v-model="form.ladderAward" :disabled="status === 1" @change="awardChange">
                        <el-radio :label="0">
                            不设置奖品
                        </el-radio>
                        <el-radio :label="1">
                            设置奖品（阶梯奖品指用户只要满足条件，即可在活动进行中，获得奖学金、优惠券或小礼品）
                        </el-radio>
                    </el-radio-group>
                    <div v-if="form.ladderAward === 1" class="normal-font-12">
                        <div class="mt-10">
                            <transition-group v-if="form.awardModels.length" name="flip-list" tag="div">
                                <!-- 注意：下一级的最小购买量不可小于上一级的最小购买量 -->
                                <Ladder
                                    v-for="(item, i) of form.awardModels"
                                    :key="item.key"
                                    :model="item"
                                    :status="status"
                                    :min-ladder="form.awardModels[i - 1] ? form.awardModels[i - 1].ladderAwardLocation + 1 : i + 1"
                                    material-type="端午活动"
                                    @remove="form.awardModels.splice(i, 1)"
                                    @ladderAwardLocationChange="ladderAwardLocationChange"
                                />
                            </transition-group>
                            <el-button
                                v-if="status !== 1"
                                type="primary"
                                plain
                                @click="addLadderGiftItem"
                            >
                                添加阶梯奖励
                            </el-button>
                            <span class="purchase-sort-description">（至多可设置6个阶梯奖品）</span>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="品牌曝光" prop="logoModels">
                    <div class="mb-10">
                        <el-checkbox :true-label="1" :false-label="0" v-model="form.isShowLog">
                            展示品牌 logo
                        </el-checkbox>
                        <span class="purchase-sort-description">（勾选品牌 logo 将在海报中显示，不勾选则不显示）</span>
                    </div>
                    <template v-if="form.isShowLog">
                        <upload-image
                            need-edit
                            :width="300"
                            :height="300"
                            :size="2"
                            :count="1"
                            v-model="logImgUrl"
                            upload-text="上传logo图"
                        />
                        <span style="color:#999">只支持.jpg .png 格式，最多上传1张，大小为2M以内</span>
                    </template>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button size="mini" plain style="width: 90px;margin-left: 20px" @click="cancel">
                    取消
                </el-button>
                <!--<el-button size="mini" type="primary" plain @click="preview">
          预览
        </el-button>-->
                <el-button size="mini" type="primary" plain @click="save">
                    保存
                </el-button>
            </div>
            <div class="preview">
                <div class="newcomer-example-title">
                    活动预览
                </div>
                <img src="https://mallcdn.youpenglai.com/static/admall/2.9.0/longmen-sign-preview.jpg">
            </div>
        </div>
        <!--
      最小库存限制，
      如果是编辑活动，且活动处于进行中，且是原来存在的礼品，最小库存可以为0
     -->
        <EditPresent
            date-type="datetime"
            :show.sync="showPresent"
            @confirm="selectPresent"
            :init-date="[form.activityStartTime, form.activityEndTime]"
            :end-min-date="form.activityEndTime || initDate[0] || 0"
            :start-min-date="form.activityStartTime || initDate[1] || 0"
            :gift-detail.sync="editPresentData"
            :min-stock="editPresentData && editPresentData.id && status === 1 ? 0 : 1"
        />
    </div>
</template>
<script>
import { getUserTtagList } from '../../../../../apis/marketing-manage/coupon'
import { materialSchemeList, addSigninActivity, signinActivityDetail, editActivityInfoDataStart, editActivityInfoNotStart } from '../../../../../apis/marketing-manage/new-year/spring-ploughing'
import Ladder from '../components/Ladder.vue'
import EditPresent from '../../../../../components/common/Edit-Present.vue'
import UploadImage from '../../../../../components/common/file/Image-Manager'
import { checkNumber } from '../../../../../assets/ts/validate'
class LadderData {
    // 礼品名称
  giftName = ''
  // 礼品简介
  giftBrief = ''
  // 礼品图片
  giftImage = ''
  //  礼品库存
  stock = 1
  useStartTime = ''
  useEndTime = ''
  // 奖品类型 1 礼品 2 奖学金  3 全场满减券 4 品类券
  ladderAwardType = 1
  // 奖品位置（排序）
  ladderAwardLocation = 1
  // 是否隐藏 (暂无此字段)
  isShow = ''
  // 是否隐藏
  allAwardLimit = ''
  // 奖品派发量(剩余量，添加时等于库存)
  awardDraw = ''
  // 奖学金
  scholarshipPrice = ''
  // 奖学金有效时间
  scholarshipEffectiveTime = ''
  // 奖品Id（优惠券才有）
  awardId = ''
  // 奖品类型 1 阶梯奖 2 终极大奖
  awardType = 1
  // key, 排序动画有用
  key = Math.random()
}
export default {
    name: 'GeneralAdd',
    components: {
        Ladder,
        EditPresent,
        UploadImage
    },
    data () {
        const checkMaterial = (rule, value, callBack) => {
            if (value.length < 7) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        const checkGiftModels = (rule, value, callBack) => {
            if (!value.length) {
                callBack(new Error('请添加粽粽大礼'))
            } else {
                callBack()
            }
        }
        const checkAwardModels = (rule, value, callBack) => {
            if (this.form.ladderAward && !value.length) {
                callBack(new Error('请添加阶梯奖品'))
            } else {
                // 检查每个阶梯的礼品选择状态
                for (const [i, item] of value.entries()) {
                    if (!item.giftName) {
                        const type = item.ladderAwardType === 1 ? '礼品' : item.ladderAwardType === 2 ? '奖学金' : '优惠券'
                        callBack(new Error(`请选择阶梯${ i + 1 }${ type }`))
                        return
                    }
                }
            }
            callBack()
        }
        // 选择 logo
        const checkLogoModels = (rule, value, callBack) => {
            if (this.form.isShowLog && !this.logImgUrl.length) {
                callBack(new Error('请上传 logo'))
            } else {
                callBack()
            }
        }
        return {
            checkAll: true,
            // 是否可以编辑细则
            briefEdit: false,
            showScholarship: false,
            editPresentData: null,
            previewShow: false,
            showPresent: false,
            yearFlavorList: [],
            userTagList: [],
            editIndex: -1,
            initDate: ['', ''],
            form: {
                activityName: '粽粽有礼',
                activityType: 3,
                // 活动时间
                activityStartTime: '',
                activityEndTime: '',
                // 中奖率
                winningProbability: '',
                // 使用说明
                activityRule:
          `1.在活动有效期内，签到30个端午活动，即可有机会参与粽粽大礼的抽奖；
2.每人仅有1次抽取粽粽大礼的机会；
3.粽粽大礼：用户抽奖粽粽大奖的方式，采取的是随机抽奖的方式；
4.获得的粽粽大礼将自动存入“我的礼品”中，兑换有效期内用户可随时查看；
5.“我的礼品”中存放的粽粽大奖需在该礼品使用有效期内到店兑换；过期或已使用将不予兑换，请妥善保管；
6.阶梯奖励：用户参与活动过程中，签到指定数量的端午活动，还可额外获得优惠券、奖学金或小礼品；
7.优惠券获得后，会直接放入我的卡券中，用户在商城购买商品时，可根据优惠券使用范围，抵扣相应的金额；
8.优惠券和奖学金在有效期内未使用，将自动过期，过期后购买商品将不可进行抵扣。`,
                // 适用用户
                userScope: 0,
                // 部分用户标签
                userGroupTagModels: [],
                // 粽粽标签
                materialSchemeModels: [],
                // 粽粽大礼
                giftModels: [],
                // 是否设置阶梯奖
                ladderAward: 0,
                // 阶梯列表
                awardModels: [],
                // 展示 logo  0  不展示   1 展示
                isShowLog: 0
            },
            // logo 图片地址
            logImgUrl: [],
            // 粽粽id
            materialSchemeModels: [],
            // 活动状态 0  未开始  1 进行中   2  活动已结束
            status: 0,
            rules: {
                activityStartTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                materialSchemeModels: [
                    { validator: checkMaterial, message: '端午活动选择不能少于7个', trigger: 'blur' }
                ],
                activityRule: [
                    { required: true, message: '使用须知不能为空', trigger: 'blur' },
                    { max: 500, message: '使用须知不能超过500个字符', trigger: 'blur' }
                ],
                winningProbability: [
                    { required: true, message: '总中奖率不能为空', trigger: 'blur' },
                    { validator: checkNumber(100, 1, 0), trigger: 'blur' }
                ],
                giftModels: [
                    { validator: checkGiftModels, trigger: 'blur' }
                ],
                awardModels: [
                    { validator: checkAwardModels, trigger: 'blur' }
                ],
                logoModels: [
                    { validator: checkLogoModels, trigger: 'blur' }
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
    computed: {
    // 阶梯数量列表
        ladderAwardLocationList () {
            return this.form.awardModels.map(item => item.ladderAwardLocation).sort((a, b) => a - b)
        },
        isCopy () {
            return this.$route.query.isCopy
        }
    },
    async created () {
        try {
            await this.getTagListFun()
            await this.getDetail()
        } catch (e) {
            throw e
        }
    },
    methods: {
    // 阶梯礼品添加对象，最多6个
        addLadderGiftItem () {
            if (this.form.awardModels.length > 5) return this.$error('最多添加6个阶梯奖')
            const ladder = new LadderData()
            const currentMaxLadderAwardLocation = this.ladderAwardLocationList[this.ladderAwardLocationList.length - 1]
            ladder.ladderAwardLocation = currentMaxLadderAwardLocation ? currentMaxLadderAwardLocation + 1 : 1
            this.form.awardModels.push(ladder)
        },
        // 获取详情
        async getDetail () {
            try {
                if (this.id) {
                    const data = await signinActivityDetail(this.id)
                    // 将详情数据格式处理到与添加数据格式基本已知
                    let {
                        bigGifts,
                        materialSchemes,
                        smallGifts,
                        tagGroups,
                        entity
                    } = data.result
                    const {
                        ladderAward,
                        userScope,
                        winningProbability,
                        activityRule,
                        activityStartTime,
                        activityEndTime,
                        status,
                        // 展示 logo
                        isShowLog,
                        // logo 地址
                        logImgUrl
                    } = entity
                    smallGifts = (smallGifts || []).map(item => ({
                        key: Math.random(),
                        // 礼品名称
                        giftName: item.giftName,
                        // 礼品简介
                        giftBrief: item.giftBrief,
                        // 礼品图片
                        giftImage: item.giftImage,
                        // 礼品总库存
                        allAwardLimit: item.allAwardLimit || 0,
                        // 礼品总库存备份，解决编辑库存不可减少
                        allAwardLimitCopy: item.allAwardLimit || 0,
                        // 剩余库存
                        stock: (this.isCopy ? item.allAwardLimit : item.stock) || 0,
                        useStartTime: item.useStartTime,
                        useEndTime: item.useEndTime,
                        // ladder组件 el-Select GiftTypeMap值只有1，2，3 需将品类券3，4全部处理为3 否则会报错，另外增加couponType值，用来区别ladderAwardType的原始值

                        couponType: item.ladderAwardType === 3 ? 1 : item.ladderAwardType === 4 ? 2 : null,
                        // 奖品类型 1 礼品 2 奖学金  3 全场满减券 4 品类券
                        ladderAwardType: item.ladderAwardType === 4 ? 3 : item.ladderAwardType,
                        // 奖品位置（排序）
                        ladderAwardLocation: item.location,
                        // 是否隐藏
                        isShow: '',
                        // 奖品派发量(剩余量，添加时等于库存)  复制时应无领用量
                        awardDraw: this.isCopy ? null : item.awardDraw,
                        // 奖学金
                        scholarshipPrice: item.price,
                        // 奖学金有效时间
                        scholarshipEffectiveTime: item.scholarshipEffectiveTime,
                        // 奖品Id（优惠券才有）
                        awardId: item.awardId,
                        // 奖品类型 1 阶梯奖 2 终极大奖
                        awardType: item.awardType,
                        id: item.id,
                        giftId: item.giftId
                    }))
                    // 添加key，支持排序动画
                    const form = {
                        activityName: '粽粽有礼',
                        activityType: 3,
                        activityStartTime,
                        activityEndTime,
                        winningProbability,
                        activityRule,
                        userScope,
                        userGroupTagModels: tagGroups.map(item => item.groupTagId),
                        materialSchemeModels: materialSchemes.map(item => ({ materialId: item.materialId, materialOrder: item.materialOrder })),
                        // 粽粽大礼数据回填
                        giftModels: bigGifts.map(item => ({
                            giftName: item.giftName,
                            giftBrief: item.giftBrief,
                            giftImage: item.giftImage,
                            stock: item.stock,
                            useStartTime: item.useStartTime,
                            useEndTime: item.useEndTime,
                            awardType: 2,
                            awardId: item.awardId,
                            id: item.id,
                            giftId: item.giftId,
                            allAwardLimit: item.allAwardLimit || 0,
                            // 备份库存，解决编辑库存不可减少
                            allAwardLimitCopy: item.allAwardLimit || 0,
                            // 是否开启神秘大奖
                            isShow: item.isShow
                        })),
                        // 阶梯奖
                        awardModels: smallGifts,
                        ladderAward,
                        // 展示 logo
                        isShowLog,
                        // logo 地址
                        logImgUrl
                    }
                    this.logImgUrl = logImgUrl ? [logImgUrl] : []
                    this.materialSchemeModels = materialSchemes.map(item => item.materialId)
                    this.initDate = [activityStartTime, activityEndTime]
                    this.form = form
                    this.status = status
                    if (this.isCopy) this.status = 0
                }
            } catch (e) {
                throw e
            }
        },
        // 阶梯数量变化后进行排序
        ladderAwardLocationChange () {
            this.form.awardModels.sort((a, b) => a.ladderAwardLocation - b.ladderAwardLocation)
        },
        awardChange () {
            this.form.awardModels = []
            this.$refs.form.clearValidate('awardModels')
        },
        // 获取粽粽和用户分组
        async getTagListFun () {
            try {
                const res = await Promise.all([getUserTtagList(), materialSchemeList({ activityType: 3 })])
                this.userTagList = res[0].result
                this.yearFlavorList = res[1].result
                // 粽粽默认全选
                if (!this.id) {
                    this.form.materialSchemeModels = this.yearFlavorList.map((item, index) => ({ materialId: item.id, materialOrder: index }))
                    this.materialSchemeModels = this.yearFlavorList.map(({ id }) => id)
                }
            } catch (e) {
                throw e
            }
        },
        // 选择粽粽大礼
        selectPresent (data) {
            data = data.giftDetail
            data = {
                giftName: data.giftName,
                giftBrief: data.giftBrief,
                giftImage: data.giftImage,
                stock: data.stock,
                allAwardLimit: data.stock,
                useStartTime: data.useStartTime,
                useEndTime: data.useEndTime,
                awardType: 2,
                // 默认不开启大奖
                isShow: 1
            }
            if (this.editIndex !== -1) {
                this.form.giftModels.splice(this.editIndex, 1, data)
                this.editIndex = -1
            } else {
                this.form.giftModels.push(data)
            }
            this.editPresentData = null
        },
        // 编辑粽粽大礼
        editPresent (detail, index) {
            this.editPresentData = detail
            this.showPresent = true
            this.editIndex = index
        },
        // 删除一个粽粽大礼
        removePresent (index) {
            this.form.giftModels.splice(index, 1)
        },
        // 粽粽全选
        checkAllChange (val) {
            if (val) {
                this.form.materialSchemeModels = this.yearFlavorList.map(item => ({
                    materialId: item.id,
                    materialOrder: Number(item.id)
                }))
                this.materialSchemeModels = this.yearFlavorList.map(item => item.id)
            } else {
                this.form.materialSchemeModels = []
                this.materialSchemeModels = []
            }
        },
        // 粽粽改变后
        materialSchemeChange (val) {
            this.form.materialSchemeModels = val.map((item, index) => ({
                materialId: item,
                materialOrder: index
            }))
            this.getBrief()
        },
        // 修改奖品数量
        bigGiftCountChange (row, count, isEdit) {
            if (!isEdit) {
                row.stock = count
            }
        },
        receiveDateRangeChange ({ start, end }) {
            this.form.activityStartTime = start || ''
            this.form.activityEndTime = end || ''
        },
        getBrief () {
            if (this.briefEdit) return
            this.form.activityRule = `1.在活动有效期内，签到${ this.materialSchemeModels.length }个端午活动，即可有机会参与粽粽大礼的抽奖
2.每人仅有1次抽取粽粽大礼的机会；
3.粽粽大礼：用户抽奖粽粽大奖的方式，采取的是随机抽奖的方式；
4.获得的粽粽大礼将自动存入“我的礼品”中，兑换有效期内用户可随时查看；
5.“我的礼品”中存放的粽粽大奖需在该礼品使用有效期内到店兑换；过期或已使用将不予兑换，请妥善保管；
6.阶梯奖里：用户参与活动过程中，签到指定数量的端午活动，还可额外获得优惠券、奖学金或小礼品；
7.优惠券和奖学金获得后，会直接放入我的卡券中，用户在商城购买商品时，可抵扣相应的金额；
8.优惠券和奖学金在有效期内未使用，将自动过期，过期后购买商品将不可进行抵扣。`
        },
        checkData () {
            if (Math.max(...this.ladderAwardLocationList) >= this.form.materialSchemeModels.length) {
                this.$warning('最大阶梯不能大于等于端午活动数量')
                return false
            }
            if (Array.from(new Set(this.ladderAwardLocationList)).length !== this.ladderAwardLocationList.length) {
                this.$warning('阶梯累计年俗数量不能相同')
                return false
            }
            return true
        },
        cancel () {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            })
                .then(() => {
                    // this.clearData()
                    this.$router.back()
                })
        },
        async save () {
            try {
                await this.$refs.form.validate()
                if (!this.checkData()) return
                // 参数变化  深拷贝数据，防止提交失败，原始数据被修改
                const form = this.form
                form.logImgUrl = this.logImgUrl.join('')
                for (const item of form.awardModels) {
                    // 根据增加couponType值，用来还原ladderAwardType的原始值，并且删除couponType
                    if (item.couponType === 1) item.ladderAwardType = 3
                    if (item.couponType === 2) item.ladderAwardType = 4
                    delete item.couponType
                }
                // 添加或者复制
                if ((this.id && this.isCopy) || !this.id) {
                    await addSigninActivity(form)
                    this.$success('添加成功')
                } else {
                    // 编辑
                    form.id = this.id
                    if (this.status === 0) {
                        await editActivityInfoNotStart(form)
                    }
                    if (this.status === 1) {
                        await editActivityInfoDataStart(form)
                    }
                    this.$success('编辑成功')
                }
                await this.$router.push({ name: 'GeneralList' })
            } catch (e) {
                if (e) throw e
            }
        },
        async preview () {
            try {
                await this.$refs.form.validate()
                this.previewShow = true
            } catch (e) {
                if (e) throw e
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.win-rate {
    width: 300px;
    > li {
        margin-bottom: 15px;
    }
}

::v-deep .edit-big-gifts {
    > .cell {
        > button:nth-of-type(2) {
            margin: 0 10px !important;
        }
        > span {
            margin-left: 5px;
        }
    }
}
.add-product {
    min-width: 1600px;
    position: relative;
    background-color: #f5f6f7;
}
.checked-group {
    display: flex;
    width: max-content;
    padding: 10px;
    margin-top: 5px;
    background-color: #eee;
    box-shadow: 0 0 0 1px #ccc inset;
    > div {
        display: inline-grid;
        grid-template-columns: auto auto auto auto;
        flex-wrap: wrap;
        > label {
            display: inline-flex;
            align-items: center;
            height: 30px !important;
        }
    }
}

.purchase-sort-description {
    margin-left: 17px;
    font-size: 14px;
    color: #999;
    &.red {
        color: #d0423c;
    }
}
.add-content {
    margin-top: 20px;
    margin-left: 80px;
    margin-right: 26px;
    background-color: #fff;
    .content-title {
        display: flex;
        align-items: center;
        height: 60px;
        margin-top: 37px;
        padding-left: 30px;
        font-size: 14px;
        font-weight: bold;
        background-color: #fbfbfb;
    }
    .btn-box {
        border-top: 1px solid #e7e7e7;
        padding: 24px;
    }
}

.preview {
    position: absolute;
    top: 100px;
    right: 100px;
    .newcomer-example-title {
        color: #666;
        font-size: 16px;
        padding-bottom: 14px;
    }
    img {
        width: 360px;
    }
}
.table {
    margin-top: 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
}
.brief-edit {
    padding-left: 10px;
    cursor: pointer;
    display: inline-block;
}

</style>
