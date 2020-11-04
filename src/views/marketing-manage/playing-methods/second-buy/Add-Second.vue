<template>
    <div class="add-marketing">
        <div class="marketing-content">
            <div class="content-detail">
                <el-form
                    ref="marketingForm"
                    :model="marketingForm"
                    :rules="rules"
                    label-width="120px"
                    label-position="left"
                >
                    <p class="detail-title">
                        秒杀活动设置
                        <span class="sub-detail-title">参与秒杀活动的商品，均不支持线上退款</span>
                    </p>
                    <el-form-item label="秒杀商品" prop="product" required>
                        <div v-if="marketingForm.product">
                            <el-button
                                type="primary"
                                plain
                                style="width: 116px;"
                                @click="openAddListDialog"
                                :disabled="activityStatus === 1"
                            >
                                更改商品
                            </el-button>
                            <span class="inp-tips">（仅可选择一件商品，进行秒杀商品的设置）</span>
                        </div>
                        <div v-else>
                            <el-button type="primary" plain style="width: 116px;" @click="openAddListDialog">
                                选择商品
                            </el-button>
                            <span class="inp-tips">（秒杀活动商品不与其余任何活动共享，不可使用优惠券）</span>
                        </div>
                        <div class="together-product" v-if="marketingForm.product">
                            <div class="product">
                                <img v-imgError :src="marketingForm.product.productMainImage">
                                <div class="title">
                                    {{ marketingForm.product.productName }}
                                </div>
                                <div class="remove" @click="removeProduct" v-if="type || activityStatus !== 1">
                                    移除
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="秒杀价格" prop="price" v-if="marketingForm.product">
                        <el-input
                            v-range="{min:0.01,fixed:2}"
                            :maxlength="8"
                            placeholder="请输入秒杀金额"
                            style="width: 200px;"
                            v-model="marketingForm.price"
                            :disabled="activityStatus === 1"
                        />元
                        <span class="inp-tips">金额不得高于原商品价位</span>
                    </el-form-item>
                    <el-form-item label="秒杀库存" prop="number" v-if="marketingForm.product">
                        <el-input-number :max="99999999" :min="1" size="mini" step-strictly v-model="marketingForm.number" /> 单
                        <!-- <span class="inp-tips">库存数量不得高于商品总库存</span> -->
                        <span class="inp-tips"> 活动库存设置不影响原商品库存，2个库存互相独立（例如即活动库存50，商品库存50，实际库存为100）</span>
                    </el-form-item>
                    <el-form-item label="适用用户" prop="type">
                        <div class="font-14">
                            所有注册用户
                        </div>
                    </el-form-item>
                    <el-form-item :error="dateError" label="活动时间" required>
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.activityStartTime, marketingForm.activityEndTime]"
                                type="datetime"
                                @change="dateChange"
                                disable-before
                                clearable
                                :disabled-start-time="activityStatus === 1"
                            />
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="开始时间不得小于当前时间，结束时间不得晚于商品下架时间"
                                placement="bottom"
                            >
                                <pl-svg width="16" name="icon-jinggao" class="tips-icon" fill="#333" />
                            </el-tooltip>
                        </div>
                    </el-form-item>
                    <el-form-item label="秒杀标签" prop="activityTag">
                        <el-input
                            placeholder="限时秒杀"
                            style="width: 200px;"
                            v-model="marketingForm.activityTag"
                            minlength="2"
                            maxlength="6"
                        />
                        <span class="inp-tips">秒杀标签将在商品详情中展示，字数在2-6个字</span>
                    </el-form-item>
                    <el-form-item label="限购" prop="activityLimitNumber">
                        <el-checkbox :disabled="activityStatus === 1" v-model="marketingForm.activityLimit" class="mr-10" />限制每人的购买数量
                        <span class="inp-tips">（设置限购后，每个账号仅可秒杀该商品的限购次数）</span>
                        <div v-if="marketingForm.activityLimit" style="margin-top: 15px">
                            每个账号可购买的数量为
                            <el-input-number
                                :disabled="activityStatus === 1"
                                :min="1"
                                :max="9999"
                                size="mini"
                                step-strictly
                                v-model="marketingForm.activityLimitNumber"
                            />个
                        </div>
                    </el-form-item>
                    <el-form-item label="活动预热" prop="countdown">
                        提前
                        <el-input-number
                            :disabled="activityStatus === 1"
                            :min="0"
                            :max="999"
                            size="mini"
                            step-strictly
                            v-model="marketingForm.countdown"
                        />天显示
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="add-btn-wrap">
            <el-button type="default" round @click="cancel">
                取消
            </el-button>
            <el-button
                type="primary"
                round
                plain
                @click="handlePreview('marketingForm')"
            >
                预览
            </el-button>
            <el-button
                type="primary"
                round
                @click="submitForm('marketingForm')"
            >
                保存
            </el-button>
        </div>
        <GoodsPreview :show.sync="showPreview" :data="singleGoods" />
        <ProductRadio activity-type="SECKILLACTIVITY" :visible.sync="addVisible" @confirm="confirmGoods" />
    </div>
</template>

<script>
import GoodsPreview from '../../../../components/product-center/goods/Goods-Preview'
import ProductRadio from '../../../../components/product-center/goods/Product-Radio.vue'
import { getSingleGoods } from '../../../../apis/product-center/goods'
import {
    createSecondActivity,
    updateSecondActivity,
    secondActivityDetail
} from '../../../../apis/marketing-manage/second'
import { goPage } from '../../../../assets/ts/utils'
import moment from 'moment/moment'
const DEFAULT_TIME = ['2019-12-12 00:00:00', '2019-12-12 23:59:59']
let START_TIME = `${ moment().format('YYYY-MM-DD') } 00:00:00`
let END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
const setDefaultTime = () => {
    // 默认开始时间，默认不得小于当天零点
    // 默认结束时间，默认不得小于当天23点
    START_TIME = `${ moment().format('YYYY-MM-DD') } 00:00:00`
    END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
    if (moment(DEFAULT_TIME[0]).valueOf() < moment(START_TIME).valueOf()) {
    // 秒杀活动时间为完整的一天
        DEFAULT_TIME[0] = START_TIME
    }
    if (moment(DEFAULT_TIME[1]).valueOf() < moment(END_TIME).valueOf()) {
        DEFAULT_TIME[1] = END_TIME
    }
}
setDefaultTime()
export default {
    name: 'AddSecond',
    components: {
        GoodsPreview,
        ProductRadio
    },
    data () {
        const checkPrice = (rule, value, callBack) => {
            if (!/^([0-9]+[\d]*(.[0-9]{1,2})?)$/.test(Number(value))) {
                callBack(new Error('保留小数点后两位'))
            } else if (Number(value) < 0.01) {
                callBack(new Error('秒杀价格最低为0.01'))
            }
            callBack()
        }
        return {
            id: '',
            type: '',
            marketingForm: {
                countdown: 3,
                activityStartTime: '',
                activityEndTime: '',
                price: '',
                number: 1,
                activityTag: '限时秒杀',
                product: null,
                activityLimit: true,
                activityLimitNumber: 1
            },
            activityStatus: 0,
            showPreview: false,
            singleGoods: null,
            numberCheck: false,
            addVisible: false,
            dateError: '',
            rules: {
                price: [
                    { required: true, message: '请添加秒杀商品价格', trigger: 'blur' },
                    { validator: checkPrice, trigger: 'blur' }
                ],
                number: [
                    { required: true, message: '请添加秒杀商品库存', trigger: 'blur' }
                ],
                activityTag: [
                    { required: true, message: '请输入秒杀标签', trigger: 'blur' },
                    { min: 2, max: 6, message: '请输入2到6个字', trigger: 'blur' }
                ],
                countdown: [
                    { required: true, message: '请设置预热时间', trigger: 'blur' }
                ],
                activityStartTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                activityEndTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        // 如果不是新建活动，则请求列表进行展示
        if (this.$route.params.id) {
            this.id = this.$route.params.id
            this.type = this.$route.params.type
            this.getSecondActivityDetail(this.id)
        }
        setDefaultTime()
    },
    mounted () {
        window.addEventListener('beforeunload', this.beforeunload)
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.beforeunload)
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'AddSecond' && to.name !== 'SecondBuyList') {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                next()
            })
        } else {
            next()
        }
    },
    methods: {
        beforeunload (e) {
            e.returnValue = '123'
        },
        cancel () {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                this.$router.back()
            })
        },
        async getSecondActivityDetail (id) {
            const data = await secondActivityDetail(id)
            this.marketingForm = {
                countdown: data.result.countdown,
                activityStartTime: data.result.activityStartTime,
                activityEndTime: data.result.activityEndTime,
                price: data.result.price,
                activityLimit: data.result.activityLimit === 1,
                activityLimitNumber: data.result.activityLimitNumber,
                activityTag: data.result.activityTag,
                number: data.result.number,
                product: {
                    productMainImage: data.result.productMainImage,
                    productName: data.result.productName,
                    id: data.result.productId
                }
            }
            this.activityStatus = this.type ? 0 : data.result.status
        },
        dateChange (val) {
            this.marketingForm.activityStartTime = this.activityStatus === 1
                ? this.marketingForm.activityStartTime
                : val.start
            this.marketingForm.activityEndTime = val.end
            this.dateError = ''
        },
        openAddListDialog () {
            this.addVisible = true
        },
        async handlePreview (formName) {
            if (
                !this.marketingForm.activityStartTime ||
        !this.marketingForm.activityEndTime
            ) {
                this.dateError = '请选择活动时间'
                return false
            }
            if (
                this.activityStatus !== 1 &&
        moment(this.marketingForm.activityStartTime).valueOf() <
          moment().valueOf()
            ) {
                this.$error('活动开始时间不能小于当前时间')
                return false
            }
            if (
                moment(this.marketingForm.activityEndTime).valueOf() <
        moment(this.marketingForm.activityStartTime).valueOf()
            ) {
                this.$error('活动结束时间不能小于开始时间')
                return false
            }
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
            }
            try {
                await this.$refs[formName].validate()
                const res = await getSingleGoods(this.marketingForm.product.id)
                res.result = {
                    ...res.result,
                    activityProductModel: {
                        ...this.marketingForm,
                        status: this.activityStatus || 0
                    },
                    activeProduct: 3
                }
                this.singleGoods = res.result
                this.showPreview = true
            } catch (e) {
                throw e
            }
        },
        async confirmGoods (pro) {
            this.marketingForm.product = pro
        },
        removeProduct () {
            this.marketingForm.product = null
        },
        async submitForm (formName) {
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
            }
            if (
                !this.marketingForm.activityStartTime ||
        !this.marketingForm.activityEndTime
            ) {
                this.dateError = '请选择活动时间'
                return false
            }
            if (
                this.activityStatus !== 1 &&
        moment(this.marketingForm.activityStartTime).valueOf() <
          moment().valueOf()
            ) {
                this.$error('活动开始时间不能小于当前时间')
                return false
            }
            if (
                moment(this.marketingForm.activityEndTime).valueOf() <
        moment(this.marketingForm.activityStartTime).valueOf()
            ) {
                this.$error('活动结束时间不能小于开始时间')
                return false
            }
            try {
                await this.$refs[formName].validate()
                const params = {
                    id: this.id ? (this.type ? '' : this.id) : '',
                    countdown: this.marketingForm.countdown,
                    activityStartTime: this.marketingForm.activityStartTime,
                    activityEndTime: this.marketingForm.activityEndTime,
                    price: this.marketingForm.price,
                    activityLimit: this.marketingForm.activityLimit ? 1 : 0,
                    activityLimitNumber: this.marketingForm.activityLimitNumber,
                    activityTag: this.marketingForm.activityTag,
                    number: this.marketingForm.number,
                    productId: this.marketingForm.product.id
                }
                // 判断商品是否参加了其他活动，否则跳转，是则提示
                let [gomMes, warnMessage] = [{}]
                if (this.id) {
                    if (this.type) {
                        gomMes = await createSecondActivity(params)
                        warnMessage = '复制成功'
                    } else {
                        gomMes = await updateSecondActivity(params)
                        warnMessage = '修改成功'
                    }
                    goPage(this, gomMes.result, warnMessage, 'SecondBuyList')
                } else {
                    gomMes = await createSecondActivity(params)
                    warnMessage = '创建成功'
                    goPage(this, gomMes.result, warnMessage, 'SecondBuyList')
                }
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
.add-marketing {
    padding-bottom: 100px;
  .marketing-top {
    display: flex;
    align-items: center;
    height: 52px;
    padding-left: 24px;
    color: #2e2e2e;
    border-bottom: 1px solid #e7e7e7;
    background-color: #ffffff;
    ::v-deep .el-icon-back {
      margin-right: 32px;
      color: #598bf8;
      font-size: 24px;
      font-weight: bolder;
      cursor: pointer;
    }
    span {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .marketing-content {
      background: #fff;
    .content-detail {
        padding-bottom: 20px;
      ::v-deep .el-form-item__content {
        margin-left: 180px !important;
      }
      ::v-deep .el-form-item {
        margin-bottom: 32px;
        .el-form-item__label {
          padding-left: 30px !important;
        }
      }
      .detail-title {
        display: flex;
        align-items: center;
        height: 60px;
        margin-bottom: 24px;
        padding-left: 30px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        background-color: #fbfbfb;
        .sub-detail-title {
          color: #999999;
          margin-left: 32px;
          font-weight: normal;
        }
      }
      .activity-rule {
        width: 405px;
        border: 1px solid #cccccc;
        font-size: 12px;
        line-height: 16px;
        overflow-y: auto;
        padding: 7px 8px 8px 11px;
        color: #666666;
      }
      .award {
        color: #333333;
        font-size: 12px;
      }
      .activity-date {
        display: flex;
        align-items: center;
        .tips-icon {
          margin: 0 15px;
        }
        .date-tips {
          color: #d0423c;
        }
      }
      .inp-tips {
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
      }
      ::v-deep .separator {
        margin: 0 6px;
        color: #a8a8a8;
        font-size: 12px;
      }
      .together-product {
        display: flex;
        align-items: flex-start;
        margin-top: 14px;
        .product {
          border: 1px solid #cccccc;
          padding: 7px;
          display: flex;
          width: 420px;
          position: relative;
          img {
            width: 100px;
            height: 100px;
            margin-right: 10px;
          }
          .title {
            width: 260px;
            line-height: 1.6;
            word-break: break-all;
          }
          .remove {
            position: absolute;
            right: 7px;
            bottom: 0;
            color: #598bf8;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
      .detail-table {
        display: flex;
        flex-direction: column;
        margin: 24px 0 0 24px;
        padding-bottom: 32px;
        .width-1 {
          width: 122px;
        }
        .width-2 {
          width: 196px;
        }
        .width-3 {
          width: 88px;
        }
        .width-4 {
          width: 114px;
        }
        .width-5 {
          width: 130px;
        }
        .width-6 {
          width: 500px;
        }
        .width-7 {
          width: 60px;
        }
        .radius-top {
          border-radius: 10px 10px 0 0;
        }
        .radius-left {
          border-radius: 10px 0 0 0;
        }
        .radius-right {
          border-radius: 0 10px 0 0;
        }
        .border-left {
          border-left: 1px solid #e7e7e7;
        }
        .border-right {
          border-right: 1px solid #e7e7e7;
        }
        .border-bottom {
          border-bottom: 1px solid #e7e7e7;
        }
        .table-title {
          display: flex;
          align-items: center;
          .title-group {
            display: flex;
            align-items: center;
            margin-right: 10px;
            &:last-of-type {
              margin-right: 0;
            }
            .title-dark {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 60px;
              color: #000000;
              font-size: 14px;
              font-weight: bold;
              background-color: #f8f8f8;
            }
            .title-light {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 60px;
              color: #000000;
              font-size: 14px;
              font-weight: bold;
              border-top: 1px solid #e7e7e7;
              border-bottom: 1px solid #e7e7e7;
            }
          }
        }
        .table-item {
          display: flex;
          align-items: stretch;
          .item-img {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60px;
            margin-right: 10px;
            border-bottom: 1px solid #e7e7e7;
            border-left: 1px solid #e7e7e7;
            border-right: 1px solid #e7e7e7;
            img {
              width: 74px;
              height: 50px;
              object-fit: cover;
            }
          }
          .item-info {
            display: flex;
            align-items: stretch;
            justify-content: center;
            min-height: 60px;
            margin-right: 10px;
            border-bottom: 1px solid #e7e7e7;
            .item-item {
              display: flex;
              align-items: center;
              justify-content: center;
              border-right: 1px solid #e7e7e7;
              &:first-of-type {
                border-left: 1px solid #e7e7e7;
              }
              & > span {
                display: block;
                width: 80%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .item-sku {
            display: flex;
            align-items: stretch;
            justify-content: center;
            min-height: 60px;
            .item-vertical {
              display: flex;
              flex-direction: column;
              border-right: 1px solid #e7e7e7;
              .item-item {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 60px;
                border-bottom: 1px solid #e7e7e7;
                & > span {
                  display: block;
                  width: 80%;
                  text-align: center;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
          .item-del {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60px;
            margin-left: 10px;
            border-left: 1px solid #e7e7e7;
            border-right: 1px solid #e7e7e7;
            i {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              min-height: 60px;
              border-bottom: 1px solid #e7e7e7;
              cursor: pointer;
            }
          }
        }
      }
    }
    .content-btn {
      box-sizing: border-box;
      margin-left: 24px;
      padding: 30px 0;
      border-top: 1px solid #e7e7e7;
    }
  }
}
</style>
