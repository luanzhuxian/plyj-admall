<template>
    <div class="add-marketing">
        <div class="marketing-content">
            <div class="content-detail">
                <el-form
                    ref="marketingForm"
                    :model="marketingForm"
                    :rules="rules"
                    label-width="140px"
                    label-position="left"
                >
                    <p class="detail-title">
                        众志成团 活动设置 <span class="sub-detail-title">无论几人 参团，活动截止均视为拼团成功，不退款</span>
                    </p>
                    <el-form-item
                        label="活动规则"
                        prop="activityBrief"
                    >
                        <el-input
                            v-model="marketingForm.activityBrief"
                            type="textarea"
                            maxlength="500"
                            placeholder="请输入活动备注"
                            resize="none"
                            :rows="5"
                            style="width: 420px;"
                            show-word-limit
                        />
                    </el-form-item>
                    <el-form-item
                        label="适用用户"
                        prop="type"
                    >
                        <div class="font-14">
                            所有注册用户
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="活动预热"
                        prop="countdown"
                    >
                        提前 <el-input-number :disabled="activityStatus === 1" :min="0" :max="999" size="mini" step-strictly v-model="marketingForm.countdown" /> 天显示
                        <span class="inp-tips"> （该时间内有活动预告，上架将确认仅显示该预告）</span>
                    </el-form-item>
                    <el-form-item
                        label="活动时间"
                        required
                    >
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.activityStartTime, marketingForm.activityEndTime]"
                                type="datetime"
                                @change="dateChange"
                                disable-before
                                clearable
                                :disabled-start-time="activityStatus === 1"
                            />
                            <el-tooltip class="item" effect="dark" content="开始时间不得小于当前时间，结束时间不得晚于商品下架时间" placement="bottom">
                                <pl-svg name="icon-jinggao" class="tips-icon" width="14" fill="#ec742e" />
                            </el-tooltip>
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="可拼团数"
                    >
                        <div class="font-14">
                            1团
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="活动商品"
                        prop="product"
                        required
                    >
                        <div class="together-product" v-if="marketingForm.product">
                            <div class="product">
                                <img :src="marketingForm.product.productMainImage">
                                <div class="title">
                                    {{ marketingForm.product.productName }}
                                </div>
                                <div class="remove" @click="removeProduct" v-if="type || activityStatus !== 1">
                                    移除
                                </div>
                            </div>
                            <div class="tips">
                                只能添加一个商品，仅支持该商品 下所有规格同时一个价位参与
                            </div>
                        </div>
                        <div v-else>
                            <el-button type="primary" plain style="width: 116px;" @click="openAddListDialog">
                                选择商品
                            </el-button> <span class="inp-tips">（拼团活动商品不与其余任何活动共享，不可使用优惠券）</span>
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="团购价位"
                        prop="price"
                    >
                        <el-input-number :disabled="activityStatus === 1" :max="99999999.99" :min="0" size="mini" v-model="marketingForm.price" /> 元 <span class="inp-tips">（金额不得高于原商品价位）</span>
                    </el-form-item>
                    <el-form-item
                        label="团购库存"
                        prop="stock"
                    >
                        <el-input-number :max="99999999" :min="1" size="mini" step-strictly v-model="marketingForm.stock" /> 件
                        <span class="inp-tips"> 活动库存设置不影响原商品库存，2个库存互相独立（例如即活动库存50，商品库存50，实际库存为100）</span>
                    </el-form-item>
                    <el-form-item
                        label="成团瓜分奖励"
                        prop="prizePool"
                    >
                        <div class="award">
                            红包奖池（线下领现金红包）
                        </div>
                        <el-input-number :max="99999999.99" :disabled="activityStatus === 1" :min="0" size="mini" v-model="marketingForm.prizePool" /> 元
                    </el-form-item>
                </el-form>
            </div>
            <div class="content-btn">
                <el-button
                    type="default"
                    @click="cancel"
                    style="width: 80px;"
                >
                    取消
                </el-button>
                <el-button
                    type="primary"
                    plain
                    @click="handlePreview('marketingForm')"
                    style="width: 80px;margin-left: 20px;"
                >
                    预览
                </el-button>
                <el-button
                    type="primary"
                    @click="submitForm('marketingForm')"
                    style="width: 80px;margin-left: 20px;"
                >
                    保存
                </el-button>
            </div>
        </div>
        <GoodsPreview
            :show.sync="showPreview"
            :data="singleGoods"
        />
        <ProductSelector
            activity-type="GROUPBUGACTIVITY"
            :visible.sync="addVisible"
            @confirm="selectGood"
        />
    </div>
</template>

<script>
import GoodsPreview from '../../../../../components/product-center/goods/Goods-Preview'
import ProductSelector from '../../../../../components/product-center/goods/Product-Radio.vue'
import { getSingleGoods } from '../../../../../apis/product-center/goods'
import { goPage } from '../../../../../assets/ts/utils'
import { createTogetherActivity, updateTogetherActivity, togetherActivityDetail } from '../../../../../apis/marketing-manage/together'
import moment from 'moment/moment'
const DEFAULT_TIME = ['2019-11-11 00:00:00', '2019-12-12 23:59:59']
let START_TIME = moment().format('YYYY-MM-DD HH:mm:ss')
let END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
const setDefaultTime = () => {
    // 默认开始时间，默认不得小于当天零点
    // 默认结束时间，默认不得小于当天23点
    START_TIME = moment().format('YYYY-MM-DD HH:mm:ss')
    END_TIME = `${ moment().format('YYYY-MM-DD') } 23:59:59`
    if (moment(DEFAULT_TIME[0]).valueOf() < moment(START_TIME).valueOf()) { // 众志成团时间向后延长
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
    name: 'AddTogether',
    components: {
        GoodsPreview,
        ProductSelector
    },
    data () {
        return {
            id: '',
            type: '',
            marketingForm: {
                activityBrief: '1.任何注册用户均可参团；\n2.填写购买下单基本信息，完成线上支付即参团成功；\n3.将活动分享给好友，邀请好友加团购，当达到成团人数后，即团购成功，一起瓜分线下奖池；\n4.若参与人数未达到成团人数，则不可瓜分线下奖池。',
                countdown: 3,
                activityStartTime: '',
                activityEndTime: '',
                price: 19.9,
                stock: 99,
                prizePool: 0,
                product: null
            },
            activityStatus: 0,
            singleGoods: null,
            showPreview: false,
            addVisible: false,
            selectedGoods: null,
            rules: {
                activityBrief: [
                    { required: true, message: '请添加活动细则', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请添加拼团商品价格', trigger: 'blur' }
                ],
                stock: [
                    { required: true, message: '请添加拼团商品库存', trigger: 'blur' }
                ],
                prizePool: [
                    // { required: true, message: '请输入奖池金额', trigger: 'blur' }
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
            this.getTogetherActivityDetail(this.id)
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
        if (to.name !== 'AddTogether' && to.name !== 'TogetherBuyList') {
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
    },
    methods: {
        beforeunload (e) {
            e.returnValue = '123'
        },
        cancel () {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            })
                .then(() => {
                    this.$router.back()
                })
        },
        async getTogetherActivityDetail (id) {
            const { data } = await togetherActivityDetail(id)
            this.marketingForm = {
                activityBrief: data.result.activityBrief,
                countdown: data.result.countdown,
                activityStartTime: data.result.activityStartTime,
                activityEndTime: data.result.activityEndTime,
                price: data.result.price,
                stock: data.result.stock,
                prizePool: data.result.prizePool,
                product: { productMainImage: data.result.productMainImage, productName: data.result.productName, id: data.result.productId }
            }
            this.activityStatus = this.type ? 0 : data.result.status
        },
        dateChange (val) {
            this.marketingForm.activityStartTime = this.activityStatus === 1 ? this.marketingForm.activityStartTime : val.start
            this.marketingForm.activityEndTime = val.end
        },
        openAddListDialog () {
            this.addVisible = true
        },
        removeProduct () {
            this.marketingForm.product = null
        },
        selectGood (pro) {
            this.marketingForm.product = pro
        },
        async handlePreview (formName) {
            if (!this.marketingForm.activityStartTime || !this.marketingForm.activityEndTime) {
                this.$error('请选择活动时间')
                return false
            }
            if (this.activityStatus !== 1 && moment(this.marketingForm.activityStartTime).valueOf() < moment().valueOf()) {
                this.$error('活动开始时间不能小于当前时间')
                return false
            }
            if (moment(this.marketingForm.activityEndTime).valueOf() < moment(this.marketingForm.activityStartTime).valueOf()) {
                this.$error('活动结束时间不能小于开始时间')
                return false
            }
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
            }
            try {
                await this.$refs[formName].validate()
                const { data: res } = await getSingleGoods(this.marketingForm.product.id)
                res.result = { ...res.result, activityProductModel: { ...this.marketingForm, status: this.activityStatus || 0 }, activeProduct: 2 }
                this.singleGoods = res.result
                this.showPreview = true
            } catch (e) {
                throw e
            }
        },
        async submitForm (formName) {
            if (!this.marketingForm.activityStartTime || !this.marketingForm.activityEndTime) {
                this.$error('请选择活动时间')
                return false
            }
            if (this.activityStatus !== 1 && moment(this.marketingForm.activityStartTime).valueOf() < moment().valueOf()) {
                this.$error('活动开始时间不能小于当前时间')
                return false
            }
            if (moment(this.marketingForm.activityEndTime).valueOf() < moment(this.marketingForm.activityStartTime).valueOf()) {
                this.$error('活动结束时间不能小于开始时间')
                return false
            }
            if (!this.marketingForm.product) {
                this.$error('请选择商品')
                return false
            }
            try {
                await this.$refs[formName].validate()
                const params = {
                    id: this.id ? (this.type ? '' : this.id) : '',
                    activityBrief: this.marketingForm.activityBrief,
                    countdown: this.marketingForm.countdown,
                    activityStartTime: this.marketingForm.activityStartTime,
                    activityEndTime: this.marketingForm.activityEndTime,
                    price: this.marketingForm.price,
                    stock: this.marketingForm.stock,
                    prizePool: this.marketingForm.prizePool || 0,
                    productId: this.marketingForm.product.id
                }
                // 判断商品是否参加了其他活动，否则跳转，是则提示
                let [gomMes, warnMessage] = [{}]
                if (this.id) {
                    if (this.type) {
                        gomMes = await createTogetherActivity(params)
                        warnMessage = '复制成功'
                    } else {
                        gomMes = await updateTogetherActivity(params)
                        warnMessage = '修改成功'
                    }
                    goPage(this, gomMes.data.result, warnMessage, 'TogetherBuyList')
                } else {
                    gomMes = await createTogetherActivity(params)
                    warnMessage = '创建成功'
                    goPage(this, gomMes.data.result, warnMessage, 'TogetherBuyList')
                }
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .add-marketing{
    .marketing-top {
      display: flex;
      align-items: center;
      height: 52px;
      padding-left: 24px;
      color: #2E2E2E;
      border-bottom: 1px solid #e7e7e7;
      background-color: #ffffff;
      ::v-deep .el-icon-back {
        margin-right: 32px;
        color: $--color-primary-blue;
        font-size: 24px;
        font-weight: bolder;
        cursor: pointer;
      }
      span{
        color: #333333;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .marketing-content{
      width: 1614px;
      margin: 20px auto 80px auto;
      background-color: #ffffff;
      box-shadow:0 3px 8px rgba(44,48,58,0.08);
      .content-detail{
        ::v-deep .el-form-item__content{
          margin-left: 180px !important;
        }
        ::v-deep .el-form-item{
          margin-bottom: 32px;
          .el-form-item__label {
            padding-left: 30px !important;
          }
        }
        .detail-title{
          display: flex;
          align-items: center;
          height: 60px;
          margin-bottom: 24px;
          padding-left: 30px;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
          background-color: #FBFBFB;
          .sub-detail-title{
            color: #999999;
            margin-left: 32px;
            font-weight: normal;
          }
        }
        .activity-rule{
          width: 405px;
          border: 1px solid #cccccc;
          font-size: 12px;
          line-height: 16px;
          overflow-y: auto;
          padding: 7px 8px 8px 11px;
          color: #666666;
        }
        .award{
          color: #333333;
          font-size: 12px;
        }
        .activity-date{
          display: flex;
          align-items: center;
          .tips-icon{
            margin: 0 15px;
          }
          .date-tips{
            color: #D0423C;
          }
        }
        .inp-tips{
          color: #999999;
          font-size: 14px;
        }
        ::v-deep .separator{
          margin: 0 6px;
          color: #A8A8A8;
          font-size: 12px;
        }
        .together-product{
          display: flex;
          align-items: flex-start;
          .product{
            border: 1px solid #CCCCCC;
            padding: 7px;
            display: flex;
            width: 420px;
            position: relative;
            img{
              width: 100px;
              height: 100px;
              margin-right: 10px;
            }
            .title{
              width: 260px;
              line-height: 1.6;
              word-break: break-all;
            }
            .remove{
              position: absolute;
              right: 7px;
              bottom: 0;
              color: $--color-primary-blue;
              font-size: 12px;
              cursor: pointer;
            }
          }
          .tips{
            color: #999999;
            width: 210px;
            line-height: 1.6;
            margin-left: 10px;
          }
        }
        .detail-table {
          display: flex;
          flex-direction: column;
          margin: 24px 0 0 24px;
          padding-bottom: 32px;
          .width-1{
            width: 122px;
          }
          .width-2{
            width: 196px;
          }
          .width-3{
            width: 88px;
          }
          .width-4{
            width: 114px;
          }
          .width-5{
            width: 130px;
          }
          .width-6{
            width: 500px;
          }
          .width-7{
            width: 60px;
          }
          .radius-top{
            border-radius: 10px 10px 0 0;
          }
          .radius-left{
            border-radius: 10px 0 0 0;
          }
          .radius-right{
            border-radius: 0 10px 0 0;
          }
          .border-left{
            border-left: 1px solid #E7E7E7;
          }
          .border-right{
            border-right: 1px solid #E7E7E7;
          }
          .border-bottom{
            border-bottom: 1px solid #E7E7E7;
          }
          .table-title{
            display: flex;
            align-items: center;
            .title-group{
              display: flex;
              align-items: center;
              margin-right: 10px;
              &:last-of-type{
                margin-right: 0;
              }
              .title-dark{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 60px;
                color: #000000;
                font-size: 14px;
                font-weight: bold;
                background-color: #F8F8F8;
              }
              .title-light{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 60px;
                color: #000000;
                font-size: 14px;
                font-weight: bold;
                border-top: 1px solid #E7E7E7;
                border-bottom: 1px solid #E7E7E7;
              }
            }
          }
          .table-item{
            display: flex;
            align-items: stretch;
            .item-img{
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 60px;
              margin-right: 10px;
              border-bottom: 1px solid #E7E7E7;
              border-left: 1px solid #E7E7E7;
              border-right: 1px solid #E7E7E7;
              img{
                width: 74px;
                height: 50px;
                object-fit: cover;
              }
            }
            .item-info{
              display: flex;
              align-items: stretch;
              justify-content: center;
              min-height: 60px;
              margin-right: 10px;
              border-bottom: 1px solid #E7E7E7;
              .item-item{
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid #E7E7E7;
                &:first-of-type{
                  border-left: 1px solid #E7E7E7;
                }
                & > span{
                  display: block;
                  width: 80%;
                  text-align: center;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
            .item-sku{
              display: flex;
              align-items: stretch;
              justify-content: center;
              min-height: 60px;
              .item-vertical{
                display: flex;
                flex-direction: column;
                border-right: 1px solid #E7E7E7;
                .item-item{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 60px;
                  border-bottom: 1px solid #E7E7E7;
                  & > span{
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
            .item-del{
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 60px;
              margin-left: 10px;
              border-left: 1px solid #E7E7E7;
              border-right: 1px solid #E7E7E7;
              i{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                min-height: 60px;
                border-bottom: 1px solid #E7E7E7;
                cursor: pointer;
              }
            }
          }
        }
      }
      .content-btn{
        box-sizing: border-box;
        margin-left: 24px;
        padding: 30px 0;
        border-top: 1px solid #E7E7E7;
      }
    }
  }
</style>
