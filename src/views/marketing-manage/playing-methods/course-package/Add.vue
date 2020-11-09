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
                <span>活动设置</span>
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
                        <el-input v-else style="width: 420px;" maxlength="50" v-model.trim="form.activityName" placeholder="请输入内容" />
                    </el-form-item>

                    <el-form-item label="活动细则" prop="regulation">
                        <pre v-if="readonly" v-text="form.regulation" :class="$style.readonlyValue" />
                        <el-input
                            v-else
                            v-model="form.regulation"
                            type="textarea"
                            placeholder="请输入内容"
                            :autosize="{ minRows: 2 }"
                            style="width: 420px;"
                        />
                    </el-form-item>

                    <!-- <el-form-item label="活动时间">
            <span :class="{ [$style.readonlyValue]: readonly }">开始时间为活动组合最早时间，结束时间为设置组合最晚结束时间</span>
          </el-form-item> -->

                    <el-form-item label="活动预热" prop="preheatTime">
                        <span v-if="readonly" :class="$style.readonlyValue">
                            <template v-if="form.preheatTime">
                                提前{{ form.preheatTime }}天显示
                            </template>
                            <template v-else>
                                无预热
                            </template>
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
                            <el-radio-group v-model="form.receiveLimit" @change="receiveLimitChange" :disabled="activityStatus === 1">
                                <el-radio :label="0">
                                    全部用户
                                </el-radio>
                                <el-radio :label="1">
                                    Helper可用
                                </el-radio>
                                <el-radio :label="2">
                                    普通会员
                                </el-radio>
                                <el-radio class="mr-10" :label="3" :disabled="!userGroup.length">
                                    部分用户组可用
                                </el-radio>
                                <router-link
                                    v-if="!userGroup.length"
                                    tag="span"
                                    style="font-size: 14px; cursor: pointer;"
                                    class="gray-3"
                                    :to="{ name: 'MemberList' }"
                                >
                                    (请先在会员管理中设置用户分组)
                                </router-link>
                            </el-radio-group>
                            <p :class="$style.userGroup" v-if="form.receiveLimit === 3">
                                <el-checkbox-group v-model="form.tagIds" :disabled="activityStatus === 1">
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

                    <div class="mb-10">
                        <Combination
                            ref="combinations"
                            v-for="(item, i) of form.combinationDetailList"
                            :key="i"
                            :model="item"
                            :list="form.combinationDetailList"
                            :index="i"
                            :readonly="readonly"
                            :activity-status="activityStatus"
                            :status="isCopy ? -1 : activityStatus"
                        />
                    </div>
                </el-form>
            </div>
            <div v-if="!readonly" class="add-btn-wrap">
                <el-button round @click="$router.push({ name: 'CoursePackageList' })">
                    取消
                </el-button>
                <el-button type="primary" round :loading="loading" @click="confirm">
                    确定并上架
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Combination from './components/Combination.vue'
import { getTagList } from '../../../../apis/member'
import {
    addSpringPloughing,
    getSpringPloughingDetail,
    updateSpringPloughing
} from '../../../../apis/marketing-manage/new-year/spring-ploughing'

class CombinationDetail {
  name = '' // 组合名字
  imageUrl = '' // 封面图
  startTime = `${ moment().format('YYYY-MM-DD') } 00:00:00` // 开始时间，延后一个小时
  endTime = `${ moment().format('YYYY-MM-DD') } 23:59:59` // 结束时间
  productModelList = [] // 商品列表
  discount = '' // 折扣
  stock = 0 // 库存
  haveGift = 0 // 附赠礼品：0 无礼品 1 有礼品
  status = 1 // 开启状态
  giftModelList = [] // 礼品列表
}

// 活动细则预设值
const defaultRegulation = `1.选择参与的用户均可参与
2.选择组合商品，享受组合商品折扣价位，单独购买不享受优惠价位
3.该组合价位购买不与其他活动一同享受（秒杀，团购，预购等）
4.部分组合更有超值礼品等你来拿，先到先得`

export default {
    name: 'AddCoursePackage',
    components: {
        Combination
    },
    data () {
        const combinationDetailList = [new CombinationDetail()]
        const checkTagIds = (rule, value, callBack) => {
            if (this.form.receiveLimit === 3 && !value.length) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        return {
            loading: false,
            userGroup: [],
            activityStatus: -1, // 0：未开始 1：进行中 2：已结束
            form: {
                batchType: 1, // 组合课
                activityName: '', // 活动名称
                regulation: defaultRegulation, // 活动细则
                preheatTime: 1, // 活动预热
                receiveLimit: 0, // 限制的角色 0:全部用户 1:会员 2:Helper 3:部分用户组
                tagIds: [], // 用户组id
                combinationDetailList // 活动组合
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
                ]
            },
            status: 0
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
    async created () {
        try {
            if (this.id) {
                await this.getDetail()
            } else {
                this.form.regulation = defaultRegulation
            }
            await this.getTagList()
            for (const item of this.$refs.combinations) {
                item.init()
            }
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getDetail () {
            try {
                const { result } = await getSpringPloughingDetail(this.id)
                const detail = result
                const {
                    activityName,
                    preheatTime,
                    receiveLimit,
                    regulation,
                    combinationDetailList,
                    tagIds,
                    status
                } = detail
                this.form.activityName = activityName || ''
                this.form.preheatTime = preheatTime || ''
                this.form.receiveLimit = receiveLimit
                this.form.regulation = regulation || ''
                for (const item of combinationDetailList) {
                    // 记录老的结束时间和库存，提交时作比较
                    item.oldEndTime = item.endTime
                    item.oldStock = item.stock
                }
                this.form.combinationDetailList = combinationDetailList || []
                this.form.tagIds = tagIds || []
                this.activityStatus = this.isCopy ? -1 : status
                this.$emit('init', detail)
            } catch (e) {
                throw e
            }
        },
        // 获得用户分组标签列表
        async getTagList () {
            try {
                const { result } = await getTagList()
                this.userGroup = result
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
        async confirm () {
            if (this.activityStatus === 1) {
                // 活动进行中，要校验结束时间
                for (const item of this.form.combinationDetailList) {
                    if (moment(item.endTime).valueOf() < moment(item.oldEndTime).valueOf()) {
                        this.$error(`活动时间不可小于${ item.oldEndTime }`)
                        return
                    }
                    if (item.stock < item.oldStock) {
                        this.$error(`组合库存必须大于或等于${ item.oldStock }`)
                        return
                    }
                }
            }
            // for (const item of this.form.combinationDetailList) {
            //   delete item.oldStock
            //   delete item.oldEndTime
            // }
            try {
                this.loading = true
                await this.$refs.addForm.validate()
                // 校验组合表单
                for (const item of this.$refs.combinations) {
                    if (!await item.validateForm()) {
                        return
                    }
                }
                // 深拷贝数据，删除优惠券amount
                const form = JSON.parse(JSON.stringify(this.form))
                for (const items of form.combinationDetailList) {
                    items.productImage = items.image
                    delete items.oldStock
                    delete items.oldEndTime
                    delete items.image
                    //  取消勾选添加礼品，清空礼品列表
                    if (!items.haveGift) {
                        items.giftModelList = []
                    }
                    for (const item of items.giftModelList) {
                        if (item.giftType === 0) delete item.amount
                    }
                }
                // 如果是复制的活动，更新每个组合的状态为1
                if (this.isCopy) {
                    for (const items of form.combinationDetailList) {
                        items.status = 1
                    }
                }
                if (this.id && !this.isCopy) {
                    await updateSpringPloughing(this.id, form)
                    this.$success('修改成功')
                } else {
                    await addSpringPloughing(form)
                    this.$success(this.isCopy ? '复制成功' : '添加成功')
                }
                await this.$router.push({ name: 'CoursePackageList' })
                this.$destroy()
            } catch (e) {
                if (!e.message) return this.$error('信息填写有误，请检查')
                throw e
            } finally {
                this.loading = false
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.name === 'ReductionCouponList') {
            // 多重模态框不隐藏，遮罩层会有问题，所以再去下个页面前先隐藏，回来之后在手动显示
            this.$refs.combinations.showCouponBox = false
            sessionStorage.setItem('courseForm', JSON.stringify(this.form))
        }
        next()
    },
    beforeRouteEnter (to, from, next) {
        next(async vm => {
            if (from.name === 'ReductionCouponList') {
                vm.$refs.combinations.showCouponBox = true
                vm.form = JSON.parse(sessionStorage.getItem('courseForm'))
                vm.form.combinationDetailList.haveGift = vm.form.combinationDetailList.giftModelList && vm.form.combinationDetailList.giftModelList.length > 0
                sessionStorage.removeItem('courseForm')
            }
        })
    }
}
</script>

<style module lang="scss">
.add {
    &.readonly {
        padding: 0;
    }
    padding-bottom: 100px;
}
.content {
    background-color: #fff;
    padding: 0 30px;
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
