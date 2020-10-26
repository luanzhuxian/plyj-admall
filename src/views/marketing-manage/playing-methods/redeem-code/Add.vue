<template>
    <div class="add-marketing">
        <div class="marketing-content">
            <div class="content-detail">
                <el-form
                    ref="marketingForm"
                    :model="marketingForm"
                    :rules="rules"
                    label-width="180px"
                    label-position="left"
                >
                    <p class="detail-title">
                        基本信息
                        <span class="sub-detail-title">（仅支持线上兑换指定范围内的商品）</span>
                    </p>
                    <el-form-item label="兑换码名称" prop="name">
                        <el-input
                            placeholder="如：龙门节兑换码名称"
                            style="width: 200px;"
                            v-model="marketingForm.name"
                            maxlength="12"
                            :disabled="!type && activityStatus === 2"
                        />
                    </el-form-item>
                    <el-form-item label="兑换码数量" prop="addExchangeCodeNumber">
                        <el-input-number :max="1000" :min="id ? marketingForm.exchangeCodeNumber : 1" size="mini" controls-position="right" step-strictly v-model="marketingForm.addExchangeCodeNumber" /> 个兑换码
                        <span class="inp-tips">（该活动生成不同的随机兑换码）</span>
                    </el-form-item>
                    <el-form-item prop="exchangeTotal">
                        <div slot="label">
                            兑换码使用条件<span class="red mr-10">*</span><el-tooltip
                                class="item"
                                effect="dark"
                                placement="bottom"
                            >
                                <div slot="content" style="display:flex; line-height: 1.8">
                                    <div>
                                        如：
                                    </div>
                                    <div>
                                        <p>设置1个兑换码可以兑换1个商品，</p>
                                        <p>即代表用户可以凭借该兑换码兑换</p>
                                        <p>商城内可兑换商品中任意1个商品</p>
                                    </div>
                                </div>
                                <pl-svg width="16" name="icon-jinggao" class="tips-icon" fill="#333" />
                            </el-tooltip>
                        </div>
                        每个兑换码可兑换 <el-input-number :disabled="!type && activityStatus === 2" :max="1000" :min="1" size="mini" controls-position="right" step-strictly v-model="marketingForm.exchangeTotal" /> 个商品
                    </el-form-item>
                    <el-form-item label="使用时间" :error="dateError">
                        <div class="activity-date">
                            <date-range
                                :init="[marketingForm.startTime, marketingForm.endTime]"
                                @change="dateChange"
                                disable-before
                                clearable
                                :disabled-start-time="!type && (activityStatus === 2 || disabledStartTime)"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="使用说明"
                        prop="activityRule"
                        id="activityRule"
                        required
                    >
                        <el-input
                            v-model="marketingForm.activityRule"
                            type="textarea"
                            maxlength="500"
                            show-word-limit
                            resize="none"
                            :rows="5"
                            style="width: 420px;"
                        />
                    </el-form-item>
                    <el-form-item
                        label="适用商品"
                        required
                    >
                        <div>
                            <el-button type="primary" plain style="width: 150px;" @click="openAddCourseListDialog">
                                添加知识课程
                            </el-button>
                            <span style="color: #666; font-size: 12px">（最多可添加50个课程）</span><el-tooltip
                                class="item"
                                effect="dark"
                                content="目前仅支持知识课程和系列课程，目前支持添加最多50个；免费付费均可以支持"
                                placement="bottom"
                            >
                                <pl-svg width="16" name="icon-jinggao" class="tips-icon" fill="#333" />
                            </el-tooltip>
                        </div>
                    </el-form-item>
                    <!--知识课程列表-->
                    <div class="detail-table" v-if="marketingForm.productList.length">
                        <el-table :data="marketingForm.productList" border>
                            <el-table-column label="课程图片">
                                <template #default="{row}">
                                    <img :src="row.productMainImg" width="60" height="60">
                                </template>
                            </el-table-column>
                            <el-table-column prop="productName" label="课程名称" />
                            <el-table-column label="类型">
                                <template #default="scope">
                                    {{ scope.row.productType === 2 ? '单课' : '系列课' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="状态">
                                <template #default="scope">
                                    {{ STATUS_TEXT[scope.row.status] }}
                                </template>
                            </el-table-column>
                            <el-table-column label="价格(元)">
                                <template #default="{row}">
                                    {{ row.price }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="right" header-align="right">
                                <template #default="scope">
                                    <pl-svg name="icon-shanchu1" width="16" @click="removeCourseItem(scope.$index)" />
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form>
            </div>
            <div class="content-btn">
                <div class="tips">
                    （所有营销活动均不支持使用兑换码兑换）
                </div>
                <div class="btns">
                    <el-button type="default" @click="cancel" style="width: 80px;">
                        取消
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
        </div>
        <!-- 选择知识课程 -->
        <KnowledgeProduct
            :visible.sync="showCourseBox"
            :max-select-num="maxProduct"
            :default-list="marketingForm.productList"
            @confirm="selectCourse"
        />
    </div>
</template>

<script>
import KnowledgeProduct from '../../activities/longmen-festival/components/Knowledge-Product.vue'
import { goPage } from '../../../../assets/ts/utils'
import { createRedeemCodeActivity, updateRedeemCodeActivity, getRedeemCodeById } from '../../../../apis/marketing-manage/redeem-code'
import moment from 'moment/moment'
export default {
    name: 'AddRedeemCode',
    components: {
        KnowledgeProduct
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            type: '',
            marketingForm: {
                startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment().add(1, 'year')
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss'),
                addExchangeCodeNumber: 50,
                exchangeCodeNumber: 0,
                name: '',
                activityRule: `1.每个兑换码需提前在商城，个人中心，我的兑换码中激活；
2.激活后的兑换码在使用有效期内可以随时兑换权益内商品；
3.兑换后的商品的使用截止时间以商品时间为准。`,
                exchangeTotal: 1,
                productList: []
            },
            activityStatus: 0,
            disabledStartTime: false,
            showCourseBox: false,
            dateError: '',
            rules: {
                addExchangeCodeNumber: [
                    { required: true, message: '请添加兑换码数量', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入兑换码名称', trigger: 'blur' },
                    { min: 4, max: 12, message: '请输入4到12个字', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                endTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' }
                ],
                activityRule: [
                    { required: true, message: '请填写使用说明', trigger: 'blur' }
                ]
            },
            STATUS_TEXT: {
                1: '出售中',
                2: '已下架'
            },
            maxProduct: 50
        }
    },
    async created () {
        if (this.id) {
            this.type = this.$route.params.type
            try {
                const { result } = await getRedeemCodeById(this.id)
                for (const item of result.productList) {
                    item.id = item.productId
                    item.price = item.price / 100
                }
                this.marketingForm = {
                    ...result,
                    addExchangeCodeNumber: result.exchangeCodeNumber,
                    exchangeCodeNumber: this.type ? 0 : result.exchangeCodeNumber
                }
                this.disabledStartTime = moment(result.startTime).valueOf() < moment().valueOf()
                this.activityStatus = result.status
            } catch (e) {
                throw e
            }
        } else {
            this.marketingForm = {
                startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment().add(1, 'year')
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss'),
                addExchangeCodeNumber: 50,
                exchangeCodeNumber: 0,
                name: '',
                activityRule: `1.每个兑换码需提前在商城，个人中心，我的兑换码中激活；
2.激活后的兑换码在使用有效期内可以随时兑换权益内商品；
3.兑换后的商品的使用截止时间以商品时间为准。`,
                exchangeTotal: 1,
                productList: []
            }
        }
    },
    mounted () {
        window.addEventListener('beforeunload', this.beforeunload)
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.beforeunload)
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'AddRedeemCode' && to.name !== 'EditRedeemCode' && to.name !== 'RedeemCodeList' && to.name !== 'RedeemCodeListData') {
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
            e.returnValue = ''
        },
        cancel () {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                this.$router.back()
            })
        },
        dateChange (val) {
            this.marketingForm.startTime = (!this.type && this.activityStatus === 2) ? this.marketingForm.startTime : val.start
            this.marketingForm.endTime = val.end
            this.dateError = ''
        },
        openAddCourseListDialog () {
            if (this.marketingForm.productList.length < 50) {
                this.showCourseBox = true
            } else {
                this.$error('最多添加50个课程')
            }
        },
        switchRebate (item) {
            item.rebate = ''
            item.rebateType === 'FIXED' ? item.percentRebate = '' : item.fixedRebate = ''
        },
        testRebate (item) {
            if (item.rebateType === 'FIXED') {
                // 固定返利需要是正整数，可以为0
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.fixedRebate)) {
                    return item.fixedRebate
                }
                return ''
            }
            // 百分比返利需要大于0%，小于等于100%
            if (/^100$|^(\d|[1-9]\d)$/.test(item.percentRebate)) {
                return item.percentRebate
            }
            return ''
        },
        async removeCourseItem (index) {
            await this.$confirm({
                title: '确认要移除该商品码？',
                message: '移除不影响已兑换的用户'
            })
            this.marketingForm.productList.splice(index, 1)
        },
        selectCourse (data) {
            const list = []
            for (const item of data) {
                list.push({
                    id: item.id,
                    productId: item.id,
                    productName: item.courseName,
                    productMainImg: item.courseImg,
                    productType: item.courseType + 1,
                    status: item.status,
                    price: item.sellingPrice
                })
            }
            this.marketingForm.productList = list
        },
        selectedCourseIdList () {
            const list = JSON.parse(JSON.stringify(this.marketingForm.productList))
            return list
        },
        async submitForm (formName) {
            try {
                await this.$refs[formName].validate()
                const {
                    startTime,
                    endTime,
                    name,
                    addExchangeCodeNumber,
                    exchangeCodeNumber,
                    activityRule,
                    exchangeTotal,
                    productList
                } = this.marketingForm
                if (!startTime || !endTime) {
                    this.dateError = '请选择活动时间'
                    return false
                }
                if (moment(endTime).valueOf() < moment(startTime).valueOf()) {
                    this.$error('活动结束时间不能小于开始时间')
                    return false
                }
                if (productList.length === 0) {
                    this.$error('请选择课程')
                    return false
                }
                const params = {
                    id: this.id ? (this.type ? '' : this.id) : '',
                    startTime,
                    endTime,
                    name,
                    addExchangeCodeNumber: addExchangeCodeNumber - exchangeCodeNumber,
                    exchangeCodeNumber,
                    activityRule,
                    exchangeTotal,
                    productList: productList.map(item => ({
                        productId: item.productId,
                        productName: item.productName,
                        productMainImg: item.productMainImg,
                        productType: item.productType,
                        status: item.status,
                        price: item.price
                    }))
                }
                // 判断商品是否参加了其他活动，否则跳转，是则提示
                let [gomMes, warnMessage] = [{}]
                if (this.id) {
                    if (this.type) {
                        gomMes = await createRedeemCodeActivity(params)
                        warnMessage = '复制成功'
                    } else {
                        gomMes = await updateRedeemCodeActivity(params)
                        warnMessage = '修改成功'
                    }
                    goPage(this, { flag: gomMes.data, list: '' }, warnMessage, 'RedeemCodeList')
                } else {
                    gomMes = await createRedeemCodeActivity(params)
                    warnMessage = '创建成功'
                    goPage(this, { flag: gomMes.data, list: '' }, warnMessage, 'RedeemCodeList')
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
    .marketing-content {
      .content-detail {
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
          margin: 24px 24px 32px 24px;
          img{
            display: block;
          }
        }
      }
      .content-btn {
        box-sizing: border-box;
        margin-left: 24px;
        border-top: 1px solid #e7e7e7;
        .tips{
          color: #999;
          font-size: 12px;
          margin-top: 16px;
        }
        .btns{
          padding: 30px 0;
        }
      }
    }
  }
</style>
