<template>
    <div :class="{
        [$style.add]: true,
        [$style.readonly]: readonly
    }"
    >
        <div
            :class="{
                [$style.content]: true
            }"
        >
            <div :class="$style.top" v-if="!readonly">
                <span>春耘计划 活动设置</span>
            </div>
            <div :class="$style.form">
                <el-form
                    ref="addForm"
                    :model="form"
                    :rules="rules"
                    label-width="154px"
                    label-position="left"
                >
                    <el-form-item label="活动名称" prop="activityName">
                        <span v-if="readonly" v-text="form.activityName" :class="$style.readonlyValue" />
                        <el-input v-else style="width: 420px;" v-model.trim="form.activityName" placeholder="请输入内容" />
                    </el-form-item>

                    <el-form-item label="活动细则" prop="regulation">
                        <pre v-if="readonly" v-text="form.regulation" :class="$style.readonlyValue" />
                        <el-input
                            v-else
                            style="width: 420px;"
                            type="textarea"
                            :autosize="{ minRows: 2 }"
                            placeholder="请输入内容"
                            v-model="form.regulation"
                        />
                    </el-form-item>

                    <el-form-item label="活动时间">
                        <span :class="{ [$style.readonlyValue]: readonly }">开始时间为活动组合最早时间，结束时间为设置组合最晚结束时间</span>
                    </el-form-item>

                    <el-form-item label="活动标签" prop="dictDateValue">
                        <pre v-if="readonly" v-text="form.quarterVersion || '无'" :class="$style.readonlyValue" />
                        <el-select v-else clearable v-model="form.quarterVersion" placeholder="请选择活动标签">
                            <el-option
                                v-for="(item,index) in activityTags"
                                :key="index"
                                :label="item.dictDataValue"
                                :value="item.dictDataValue"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="活动预热" prop="preheatTime">
                        <span v-if="readonly" :class="$style.readonlyValue">
                            提前
                            <span v-text="form.preheatTime" />
                            天显示
                        </span>
                        <template v-else>
                            提前
                            <el-input-number v-model.number="form.preheatTime" :min="0" :precision="0" />
                            天显示
                        </template>
                    </el-form-item>

                    <el-form-item label="适用用户" prop="tagIds">
                        <span v-if="readonly" :class="$style.readonlyValue">
                            {{ ['全部用户', 'Helper可用', '普通会员', '部分用户组可用'][form.receiveLimit] }}
                        </span>
                        <template v-else>
                            <el-radio-group v-model="form.receiveLimit" @change="receiveLimitChange" :disabled="form.status === 1">
                                <el-radio :label="0">
                                    全部用户
                                </el-radio>
                                <el-radio :label="1">
                                    Helper可用
                                </el-radio>
                                <el-radio :label="2">
                                    普通会员
                                </el-radio>
                                <el-radio :label="3">
                                    部分用户组可用
                                </el-radio>
                            </el-radio-group>
                            <p :class="$style.userGroup" v-if="form.receiveLimit === 3">
                                <el-checkbox-group v-model="form.tagIds" :disabled="form.status === 1">
                                    <el-checkbox
                                        v-for="(item, i) of userGroup"
                                        :key="i"
                                        :label="item.id"
                                    >
                                        {{ item.tagName }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </p>
                        </template>
                    </el-form-item>

                    <el-form-item label="设置活动组合" prop="combinationDetailList">
                        <div class="mb-10">
                            <Combination
                                v-for="(item, i) of form.combinationDetailList"
                                :key="i"
                                :model="item"
                                :is-copy="isCopy"
                                :list="form.combinationDetailList"
                                :index="i"
                                @remove="removeDombination(i)"
                                ref="combinations"
                                :readonly="readonly"
                                :status="isCopy ? -1 : form.status"
                            />
                        </div>
                        <el-button
                            v-if="!readonly && form.combinationDetailList.length < 6"
                            type="primary"
                            plain
                            @click="addCombination"
                        >
                            添加组合
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <hr v-if="!readonly" class="hr mt-10">
            <div v-if="!readonly" class="wrap">
                <el-button @click="$router.push({ name: 'SpringPloughingList' })">
                    取消
                </el-button>
                <el-button type="primary" @click="confirm">
                    确定并上架
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Combination from './components/Combination.vue'
import { getDataDictionary as getActivityTagList } from '../../../../../apis/common'
import { getTagList } from '../../../../../apis/member'
import { resetForm } from '../../../../../assets/ts/utils'
import {
    addSpringPloughing,
    getSpringPloughingDetail,
    updateSpringPloughing
} from '../../../../../apis/marketing-manage/new-year/spring-ploughing'

class CombinationDetail {
    // 组合名字
  name = ''
  // 封面图
  imageUrl = ''
  // 开始时间，延后一个小时
  startTime = `${ moment().format('YYYY-MM-DD') } 00:00:00`
  // 结束时间
  endTime = `${ moment().format('YYYY-MM-DD') } 23:59:59`
  // 商品列表
  productModelList = []
  // 折扣
  discount = ''
  // 库存
  stock = 0
  // 附赠礼品：0 无礼品 1 有礼品
  haveGift = 0
  // 开启状态
  status = 1
  // 礼品列表
  giftModelList = []
}

// 活动细则预设值
const defaultRegulation = `1.选择参与的用户均可参与
2.选择组合商品，享受组合商品折扣价位，单独购买不享受优惠价位
3.该组合价位购买不与其他活动一同享受（秒杀，团购，预购等）
4.部分组合更有超值礼品等你来拿，先到先得`

export default {
    name: 'AddSpringPloughing',
    components: {
        Combination
    },
    data () {
        const checkTagIds = (rule, value, callBack) => {
            if (this.form.receiveLimit === 3 && !value.length) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        const checkCombination = (rule, value, callBack) => {
            if (!value.length) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        return {
            // 活动标签列表
            activityTags: [],
            userGroup: [],
            form: {
                // 活动名称
                activityName: '',
                // 活动细则
                regulation: defaultRegulation,
                // 活动预热
                preheatTime: 1,
                // 限制的角色 0:全部用户 1:会员 2:Helper 3:部分用户组
                receiveLimit: 0,
                // 用户组id
                tagIds: [],
                // 活动组合
                combinationDetailList: [],
                // 活动标签
                quarterVersion: '',
                // 0 未开始 1 进行中 2 已结束

                status: 0,
                // 新春春耘
                batchType: 2
            },
            rules: {
                activityName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                regulation: [
                    { required: true, message: '请输入活动细则', trigger: 'blur' }
                ],
                preheatTime: [
                    { required: true, message: '请输入预热时间', trigger: 'blur' }
                ],
                tagIds: [
                    { validator: checkTagIds, message: '请至少选择一个用户分组' }
                ],
                combinationDetailList: [
                    { validator: checkCombination, message: '请添加活动组合' }
                ]
            }
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        readonly: Boolean
    },
    computed: {
        isCopy () {
            return Boolean(this.$route.query.copy)
        }
    },
    async activated () {
        try {
            if (this.id) {
                await this.getDetail()
            } else {
                this.form.regulation = defaultRegulation
            }
            await this.getTagList()
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        this.userGroup = []
        this.form.status = 0
        resetForm(this.form, {
            preheatTime: 1,
            receiveLimit: 0,
            batchType: 2
        })
    },
    methods: {
        async getDetail () {
            try {
                const data = await getSpringPloughingDetail(this.id)
                const detail = data.result
                const {
                    activityName,
                    preheatTime,
                    receiveLimit,
                    regulation,
                    combinationDetailList,
                    tagIds,
                    status,
                    quarterVersion
                } = detail
                this.form.activityName = activityName || ''
                this.form.preheatTime = preheatTime || ''
                this.form.receiveLimit = receiveLimit
                this.form.regulation = regulation || ''
                this.form.combinationDetailList = combinationDetailList || []
                this.form.tagIds = tagIds || []
                this.form.quarterVersion = quarterVersion || ''
                this.form.status = this.isCopy ? -1 : status
            } catch (e) {
                throw e
            }
        },
        // 获得用户分组标签和活动标签列表
        async getTagList () {
            try {
                const [{ result: userTagData }, { result: activityTagData }] = await Promise.all([getTagList(), getActivityTagList('XCKXJ')])
                this.activityTags = activityTagData || []
                this.userGroup = userTagData || []
            } catch (e) {
                throw e
            }
        },
        // 适用用户发送改变
        receiveLimitChange (val) {
            if (val !== 3) {
                this.form.tagIds = []
            }
        },
        // 添加组合
        addCombination () {
            this.form.combinationDetailList.push(new CombinationDetail())
            this.$refs.addForm.clearValidate('combinationDetailList')
        },
        // 删除组合
        removeDombination (index) {
            this.form.combinationDetailList.splice(index, 1)
        },
        async confirm () {
            try {
                await this.$refs.addForm.validate()
                // 校验组合表单
                for (const item of this.$refs.combinations) {
                    if (!await item.validateForm()) {
                        return
                    }
                }
                for (const item of this.form.combinationDetailList) {
                    if (this.isCopy) {
                        item.status = 1
                    }
                    for (const pro of item.productModelList) {
                        pro.productImage = pro.image
                    }
                }
                if (this.id && !this.isCopy) {
                    await updateSpringPloughing(this.id, this.form)
                    this.$success('修改成功')
                } else {
                    await addSpringPloughing(this.form)
                    this.$success(this.isCopy ? '复制成功' : '添加成功')
                }
                await this.$router.push({ name: 'SpringPloughingList' })
                this.$destroy()
            } catch (e) {
                if (!e.message) return this.$error('信息填写有误，请检查')
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
.add {
    &.readonly {
        padding: 0;
    }
}
.content {
    background-color: #fff;
}
.top {
    padding: 0 30px;
    font-weight: bold;
    line-height: 60px;
    background-color: #fbfbfb;
}
.form {
    padding: 30px 24px;
}
.user-group {
    display: flex;
    width: max-content;
    padding: 10px;
    margin-top: 5px;
    background-color: #eee;
    box-shadow: 0 0 0 1px #ccc inset;
    > div {
        display: inline-grid;
        grid-template-columns: auto auto auto;
        flex-wrap: wrap;
        > label {
            display: inline-flex;
            align-items: center;
            height: 24px !important;
        }
    }
}
.readonly-value {
    font-size: 16px;
}

</style>
