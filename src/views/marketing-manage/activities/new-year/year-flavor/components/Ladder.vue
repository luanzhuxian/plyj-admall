<template>
    <div class="year-flavor-ladder">
        <span>累计获得 </span>
        <el-input-number
            :disabled="status === 1"
            :key="_uid"
            v-model="model.ladderAwardLocation"
            @change="ladderAwardLocationChange"
            :min="minLadder || 1"
            :max="19"
            :step="1"
            :precision="0"
        />
        <span> 个年味，可获得奖品 </span>
        <el-select
            :disabled="status === 1"
            style="width:100px"
            v-model="model.ladderAwardType"
            placeholder="请选择"
            @change="removeLadderGift"
        >
            <el-option
                v-for="(item, i) in GiftTypeMap"
                :key="i"
                :label="item.label"
                :value="item.type"
            />
        </el-select>
        <el-button
            v-if="!model.giftName"
            style="width: 100px"
            size="mini"
            type="primary"
            class="ml-20"
            @click="addLadderGift(model.ladderAwardType)"
        >
            新增{{ GiftTypeMap[model.ladderAwardType - 1].label }}
        </el-button>
        <el-button
            :disabled="status === 1"
            style="width: 100px"
            size="mini"
            type="danger"
            class="ml-20"
            @click="remove"
        >
            移除
        </el-button>
        <el-table
            v-if="model.giftName"
            :data="[model]"
            border
            style="width: 850px; margin-top:20px;"
        >
            <el-table-column
                prop="giftName"
                label="礼品名称"
            />
            <el-table-column
                v-if="model.ladderAwardType === 2"
                prop="scholarshipPrice"
                label="金额（元）"
            />
            <el-table-column
                prop="stock"
                label="库存数量"
                width="200"
            >
                <template>
                    <!--
            最小库存限制，
            如果是编辑活动，且活动处于进行中，且是原来存在的礼品，最小库存可以为0
           -->
                    <el-input-number
                        v-model="model.allAwardLimit"
                        :min="model.id && status === 1 ? (model.allAwardLimitCopy || 1) : 1"
                        step-strictly
                        label="礼品库存"
                        :step="1"
                        :precision="0"
                        @change="giftCountChange"
                    /> 份
                </template>
            </el-table-column>

            <el-table-column
                v-if="model.ladderAwardType === 2"
                label="奖池总额（元）"
                width="100"
            >
                <template #default="{ row }">
                    {{ row.scholarshipPrice * 1000 * row.stock / 1000 }}
                </template>
            </el-table-column>

            <el-table-column
                v-if="model.ladderAwardType === 1 || model.ladderAwardType === 3"
                label="剩余库存"
                width="100"
                prop="stock"
            />

            <el-table-column
                v-if="status === 1"
                prop="awardDraw"
                label="已领取数量"
                width="100"
            />

            <el-table-column
                label="兑换时间"
                width="100"
            >
                <template>
                    <span v-if="model.ladderAwardType === 2">
                        奖学金领取当日起，{{ model.scholarshipEffectiveTime }}日内使用，过期自动作废
                    </span>
                    <span v-else>
                        {{ model.useStartTime | dateFormat('YYYY.MM.DD') }} - {{ model.useEndTime | dateFormat('YYYY.MM.DD') }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                align="right"
                header-align="right"
            >
                <template>
                    <el-button v-if="model.ladderAwardType !== 3 && (status !== 1 || !model.id)" @click="editLadderGif" type="text">
                        编辑
                    </el-button>
                    <el-button v-if="status !== 1 || !model.id" @click="removeLadderGift(null)" type="text">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <RadioSelectCoupon
            :show.sync="showSelectCoupon"
            @confirm="SelectedCoupon"
            :coupon-status="4"
            package-type="2019_02"
            coupon-type="1,2"
        />
        <!--
      最小库存限制，
      如果是编辑活动，且活动处于进行中，且是原来存在的礼品，最小库存可以为0
     -->
        <EditPresent
            date-type="datetime"
            :show.sync="showPresent"
            @confirm="selectPresent"
            :gift-detail.sync="giftDetail"
            :min-stock="giftDetail && giftDetail.id && status === 1 ? 0 : 1"
        />
        <Scholarship
            :show.sync="showScholarship"
            @confirm="selectScholarship"
            :scholarship-data="scholarshipData"
        />
    </div>
</template>

<script>
/* eslint-disable */
import RadioSelectCoupon from '../../../../components/Radio-Select-Coupon.vue'
import EditPresent from '../../../../../../components/marketing-manage/Edit-Present.vue'
import { resetForm } from '../../../../../../assets/ts/utils'
import Scholarship from '../../../../../../components/marketing-manage/Scholarship.vue'
export default {
  name: 'Ladder',
  components: {
    EditPresent,
    RadioSelectCoupon,
    Scholarship
  },
  data () {
    return {
      showSelectCoupon: false,
      showPresent: false,
      showScholarship: false,
      giftDetail: null,
      scholarshipData: null,
      GiftTypeMap: [
        {
          label: '礼品',
          type: 1
        },
        {
          label: '奖学金',
          type: 2
        },
        {
          label: '优惠券',
          type: 3
        }
      ]
    }
  },
  props: {
    model: {
      type: Object,
      default () {
        return {}
      }
    },
    status: {
      type: Number,
      default: 0
    },
    minLadder: {
      type: Number,
      default: 0
    }
  },
  // watch: {
  //   'model.stock' (val) {
  //     if (this.model.ladderAwardType === 2) {
  //       this.model.awardDraw = val * this.model.scholarshipPrice
  //       return
  //     }
  //     this.model.awardDraw = val
  //   }
  // },
  methods: {
    remove (e) {
      this.$emit('remove', e)
    },
    ladderAwardLocationChange (val) {
      this.$emit('ladderAwardLocationChange', val)
    },
    // 选择优惠券
    SelectedCoupon (data) {
      const {
        couponName,
        brief,
        id,
        useStartTime,
        useEndTime,
        stock = 1
      } = data
      const model = this.model
      model.giftName = couponName
      model.giftBrief = brief
      model.stock = stock
      model.awardDraw = stock
      model.allAwardLimit = stock
      model.useStartTime = useStartTime
      model.useEndTime = useEndTime
      model.awardId = id
    },
    // 选择礼品
    selectPresent (data) {
      data = data.giftDetail
      const {
        giftName,
        giftBrief,
        giftImage,
        stock,
        useStartTime,
        useEndTime
      } = data
      const model = this.model
      model.giftName = giftName
      model.giftBrief = giftBrief
      model.giftImage = giftImage
      model.stock = stock
      model.allAwardLimit = stock
      model.useStartTime = useStartTime
      model.useEndTime = useEndTime
    },
    // 选择奖学金
    selectScholarship (data) {
      const {
        stock,
        scholarshipPrice,
        scholarshipEffectiveTime
      } = data
      const model = this.model
      model.giftName = '压岁钱'
      model.scholarshipPrice = scholarshipPrice
      model.stock = stock
      model.allAwardLimit = stock
      model.scholarshipEffectiveTime = scholarshipEffectiveTime
      // model.awardDraw = stock * scholarshipPrice
    },
    // 添加优惠券，礼品，奖学金
    addLadderGift (type) {
      // 选择礼品
      if (type === 1) {
        this.showPresent = true
        return
      }
      if (type === 2) {
        this.showScholarship = true
        return
      }
      // 选择优惠券
      if (type === 3) {
        this.showSelectCoupon = true
      }
    },
    // 编辑礼品
    editLadderGif () {
      // 编辑礼品
      if (this.model.ladderAwardType === 1) {
        this.showPresent = true
        this.giftDetail = this.model
        return
      }
      // 编辑奖学金
      if (this.model.ladderAwardType === 2) {
        this.showScholarship = true
        this.scholarshipData = this.model
      }
    },
    // 删除阶梯礼品, 切换奖品类型时会传入新的ladderAwardType
    removeLadderGift (ladderAwardType) {
      resetForm(this.model, {
        stock: 1,
        ladderAwardLocation: this.model.ladderAwardType,
        key: this.model.key,
        awardType: 1,
        ladderAwardType: ladderAwardType || this.model.ladderAwardType
      })
    },
    // 库存修改后，同步更改剩余库存
    giftCountChange (val) {
      if (!this.model.id || this.status !== 1) {
        this.model.stock = val
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .year-flavor-ladder {
    margin-bottom: 20px;
  }
</style>
