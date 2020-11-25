<template>
    <div class="add-content">
        <div class="wrap">
            <!--            <div class="tips">-->
            <!--                <pl-svg class="pointer" name="icon-shanchu1" width="16" fill="#fff" />-->
            <!--            </div>-->
            <div class="content-title" id="basic" ref="basic">
                基本信息
            </div>
            <el-form label-width="170px" :model="form" :rules="rules" ref="ruleForm" label-position="right" class="main-form">
                <el-form-item label="福利红包名称：" prop="name" required>
                    <el-input style="width: 320px" v-model="form.name" maxlength="50" placeholder="新春开学季福利红包活动" />
                </el-form-item>
                <el-form-item label="福利红包面额：" prop="redPacketCouponDTO.amount" required>
                    <el-input style="width: 160px" type="number" v-model="form.redPacketCouponDTO.amount" :disabled="status" maxlength="50" placeholder="500" /> 元
                    <p class="description">
                        福利红包面额，是活动期间通过免费领取或者付费领取后，可获得的实际福利红包,在购买指定范围内的产品时，可抵扣相应金额使用。
                    </p>
                </el-form-item>
                <el-form-item label="发放量：" prop="issueVolume" required>
                    <el-input-number v-model="form.issueVolume" :min="1" label="描述文字" />
                    <p class="description">
                        发放的福利红包，超过发放量后将自动结束活动
                    </p>
                </el-form-item>
                <div class="content-title">
                    领取条件
                </div>
                <!--                redPacketCouponDTO.receiveEndTime-->
                <el-form-item label="领用时间：" required prop="redPacketCouponDTO.receiveStartTime">
                    <date-range
                        size="small"
                        disable-before
                        :clearable="true"
                        range-separator="至"
                        ref="payDate"
                        :init="initReceiveTime"
                        @change="receiveTimeChange"
                    />
                    <p class="description">
                        在活动领用时间内可领用福利红包，领用时间结束后不可继续领用福利红包
                    </p>
                </el-form-item>
                <el-form-item label="适用用户：" required prop="redPacketCouponDTO.receiveLimit">
                    <el-radio-group v-model="form.redPacketCouponDTO.receiveLimit">
                        <el-radio :label="0">
                            全部用户
                        </el-radio>
                        <el-radio :label="1">
                            helper
                        </el-radio>
                        <el-radio :label="2">
                            普通会员
                        </el-radio>
                        <el-radio :label="3" :disabled="!checkListArray || !checkListArray.length">
                            部分用户可用<span v-if="!(checkListArray && checkListArray.length)" class="description"> （请先在会员中心-设置用户分组）</span>
                        </el-radio>
                    </el-radio-group>
                    <div v-if="form.redPacketCouponDTO.receiveLimit === 3" class="user-category">
                        <div class="category-head">
                            请选择用户标签：
                        </div>
                        <div class="category-content">
                            <el-checkbox-group v-model="form.redPacketCouponDTO.tagIds">
                                <el-checkbox style="width: 120px;" v-for="(item,index) in checkListArray" :label="item.id" :key="index">
                                    {{ item.tagName }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div>
                            <el-checkbox
                                :indeterminate="Boolean(form.redPacketCouponDTO.tagIds.length && (form.redPacketCouponDTO.tagIds.length < checkListArray.length))"
                                v-model="checkAll"
                                @change="checkAllChange"
                            >
                                全选
                            </el-checkbox>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="领取方式：" required prop="redPacketCouponDTO.distributionMethod">
                    <el-radio-group v-model="form.redPacketCouponDTO.distributionMethod">
                        <el-radio :disabled="status" :label="0">
                            免费
                        </el-radio>
                        <el-radio :disabled="status" :label="2">
                            付费
                        </el-radio>
                    </el-radio-group>
                    <div style="margin-left: 115px" v-if="form.redPacketCouponDTO.distributionMethod">
                        支付 <el-input style="width: 100px" type="number" v-model="form.redPacketCouponDTO.price" maxlength="50" placeholder="10" /> 元，可购买福利红包
                    </div>
                </el-form-item>

                <el-form-item label="领用次数限制：" prop="redPacketCouponDTO.activityLimit" required>
                    <el-checkbox
                        v-model="form.redPacketCouponDTO.activityLimit"
                        :true-label="1"
                        :false-label="0"
                    >
                        每个用户可领用
                    </el-checkbox>
                    <el-input-number style="margin-left: 10px" v-model="form.redPacketCouponDTO.quantityLimit" :min="1" label="描述文字" />
                    <p class="description">
                        未勾选，则不限制用户领用次数 <br>
                        勾选，则领用次数至少可领用一次，至多可领用100次</p>
                </el-form-item>

                <div class="content-title">
                    使用条件
                </div>
                <el-form-item label="使用时间：" required prop="redPacketCouponDTO.useStartTime">
                    <date-range
                        size="small"
                        disable-before
                        :clearable="true"
                        range-separator="至"
                        @change="useTimeChange"
                        :init="initUseTime"
                        ref="payDate"
                    />
                    <p class="description">
                        在活动领用时间内可领用福利红包，领用时间结束后不可继续领用福利红包
                    </p>
                </el-form-item>

                <el-form-item label="适用产品：" required prop="redPacketCouponDTO.applicableGoodsId">
                    <el-button type="primary" plain @click="showProductBox = true">
                        选择商品/课程
                    </el-button>
                    <p class="description">
                        线上商城购买相应范围内的单个产品或者多个产品时，只要购买产品的总额满足抵扣条件，即可使用储备金进行抵扣相应金额。
                    </p>

                    <!-- 商品列表 -->
                    <el-table
                        ref="prodTable"
                        class="product-table"
                        v-if="productModelList&& productModelList.length"
                        :data="productModelList"
                    >
                        <el-table-column
                            width="100"
                            fixed
                        >
                            <template slot-scope="{ row }">
                                <img v-img-error width="71" height="48" :src="(row.image || row.productImage) + '?x-oss-process=style/thum-small'">
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="productName"
                            label="商品名称"
                            width="150"
                        />
                        <el-table-column
                            prop="productType"
                            label="产品类型"
                            width="150"
                        >
                            <template #default="{row}">
                                {{ productTypeMap[row.productType] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="productType"
                            label="状态"
                            width="150"
                        >
                            <template #default="{row}">
                                {{ productStatusMap[row.productStatus] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="规格"
                            width="80"
                        >
                            <template slot-scope="{ row }">
                                {{ row.skuCode1Name + (row.skuCode2Name ? `/${row.skuCode2Name}` : '') }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="价格（元）"
                            width="100"
                        />
                        <el-table-column
                            label="操作"
                            align="right"
                            header-align="right"
                            fixed="right"
                        >
                            <template slot-scope="{ row }">
                                <el-button
                                    type="text"
                                    size="mini"

                                    :disabled="status === 1"
                                    @click="removePro(row)"
                                >
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item label="抵扣规则：" prop="redPacketCouponDTO.useLimitAmount" required>
                    购买金额满 <el-input style="width: 160px" type="number" v-model="form.redPacketCouponDTO.useLimitAmount" :disabled="status" maxlength="50" placeholder="500" /> 元
                </el-form-item>

                <el-form-item label="使用限制：" required prop="redPacketCouponDTO.useStackable">
                    <el-radio-group v-model="form.redPacketCouponDTO.useStackable">
                        <el-radio :label="1">
                            支持叠加使用
                        </el-radio>
                        <el-radio :label="0">
                            不支持叠加使用
                        </el-radio>
                    </el-radio-group>
                    <div class="stackable" v-if="form.redPacketCouponDTO.useStackable">
                        <el-checkbox :label-true="1" :label-false="0" v-model="form.redPacketCouponDTO.useWithCoupon">满减券/品类全</el-checkbox>
                        <el-checkbox :label-true="1" :label-false="0" v-model="form.redPacketCouponDTO.scholarship">奖学金</el-checkbox>
                        <p class="description">
                            购买产品时，使用该福利红包抵扣金额，可同时与满减券/品类券、奖学金叠加抵扣使用； <br>
                            秒杀、团购、预购等活动均不支持使用福利红包进行抵扣减免；
                        </p>
                    </div>
                </el-form-item>

                <el-form-item label="使用须知" prop="redPacketCouponDTO.brief" required>
                    <el-input
                        :disabled="!Boolean(form.briefEdit)"
                        type="textarea"
                        placeholder="请输入使用须知的内容"
                        v-model="form.redPacketCouponDTO.brief"
                        maxlength="200"
                        style="width: 420px;"
                        :rows="6"
                        resize="none"
                        show-word-limit
                        :editable="false"
                    />
                    <pl-svg v-if="!form.briefEdit" class="brief-edit" width="24" fill="#4F63FF" name="icon-bianji1" @click="form.briefEdit = 1" />
                    <div>
                        <span class="description">支持自定义使用须知内容，请查看展示</span>
                        <el-button
                            type="text"
                        >
                            查看示例
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item label="展示隐藏：" prop="showStatus">
                    <el-checkbox
                        v-model="form.showStatus"
                    >
                        福利红包设置隐藏
                    </el-checkbox>
                    <span class="description">
                        （隐藏后，在商城活动界面内显示，但可通过链接的方式访问）
                    </span>
                </el-form-item>

                <el-form-item label="展示牌曝光：" prop="logoShow">
                    <el-checkbox
                        v-model="form.logoShow"
                        :true-label="1"
                        :false-label="0"
                    >
                        展示品牌logo
                    </el-checkbox>
                    <span class="description" style="margin-left: 20px">勾选品牌logo将在福利红包详情中显示，不勾选则不显示</span>
                    <UploadImage
                        v-if="form.logoShow"
                        style="margin-top: 10px"
                        need-edit
                        v-model="logoUrl"
                        @change="logoUrlChange"
                        :width="300"
                        :height="300"
                        :count="1"
                    />
                    <p v-if="form.logoShow" class="description">只支持.jpg .png 格式，最多上传1张，尺寸为500*500，大小为2M以内</p>
                </el-form-item>

                <el-form-item label="背景：" required>
                    <div class="swiper-box">
                        <swiper class="swiper" :options="swiperOption">
                            <swiperSlide
                                v-for="(item, index) of codeImg"
                                :key="index"
                            >
                                <div class="slide-title">默认背景</div>
                                <div class="img-box">
                                    <img :src="item" style="width: 120px;height: 160px;">
                                    <el-checkbox
                                        v-model="form.redPacketCouponDTO.activityLimit"
                                        :true-label="1"
                                        :false-label="0"
                                    />
                                </div>
                                <el-button size="large" type="text">预览</el-button>
                            </swiperSlide>
                        </swiper>
                        <div class="swiper-button-prev" />
                        <div class="swiper-button-next" />
                    </div>
                    <p class="description">
                        可选择更换福利红包详情页的背景，提供不同福利红包
                    </p>
                </el-form-item>
            </el-form>
            <!--            <div class="newcomer-example">-->
            <!--                <div class="newcomer-example-title">-->
            <!--                    品类券示例-->
            <!--                </div>-->
            <!--                <img src="https://mallcdn.youpenglai.com/static/admall/2.0.0/ba5e52bc-8df0-4390-813f-a01dc5efd781.jpeg">-->
            <!--            </div>-->
        </div>
        <div class="add-btn-wrap">
            <el-button plain round>
                取消
            </el-button>
            <el-button type="primary" round :loading="loading" @click="save">
                保存
            </el-button>
        </div>
        <productSkuSelector
            :visible.sync="showProductBox"
            @confirm="selectProductSku"
            :max-select="50"
            :default-selected="productModelList"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getUserTtagList } from '../../../../apis/marketing-manage/coupon'
import UploadImage from '../../../../components/common/file/Image-Manager.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { namespace, State } from 'vuex-class'
import productSkuSelector from '../../../../components/product-center/goods/Product-Sku-Selector.vue'
import { checkNumber } from '@/assets/ts/validate'
import { addRedPackage, getRedPackageDetail } from '../../../../apis/marketing-manage/red-package'

type ProdItem = { productId: string; productType: string; skuCode1: string; skuCode2: string; skuId: string }

const userModule = namespace('user')
// import moment from 'moment/moment'
@Component({
    components: {
        UploadImage,
        swiper,
        swiperSlide,
        productSkuSelector
    }
})
export default class AddRedPackage extends Vue {
    @Prop(String) id: string | undefined;
    @userModule.Getter('codeImg') codeImg!: any
    @State('productTypeMap') productTypeMap!: DynamicObject
    @State('productStatusMap') productStatusMap!: DynamicObject
    loading= false
    checkAll= false
    logoUrl= []
    showProductBox= false
    productModelList: ProdItem[] = []
    swiperOption= {
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        slidesPerView: 4
    }

    checkListArray= []
    status= false
    initReceiveTime: string[]= []
    initUseTime: string[]= []
    form: DynamicObject= {
        // 活动名称
        name: '',
        // 发放量
        issueVolume: '',
        bgUrlsIndex: 0,
        showStatus: false,
        logoUrl: '',
        redPacketCouponDTO: {
            // 红包面额
            amount: '',
            // 领用时间
            receiveEndTime: '',
            receiveStartTime: '',
            // 适用用户
            receiveLimit: 0,
            tagIds: [],
            // 领取方式
            distributionMethod: 0,
            price: '',
            // 领取次数限制
            activityLimit: 0,
            quantityLimit: '',
            // 使用时间
            useStartTime: '',
            useEndTime: '',
            // 适用商品
            applicableGoodsId: [],
            applicableGoodsSkuId: [],
            // 抵扣规则满金额
            useLimitAmount: '',
            // 使用限制
            useStackable: 1,
            useWithCoupon: 0,
            scholarship: 0,
            // 使用须知
            brief: 'string'
        }
    }

    async created () {
        try {
            await this.getUserTtagListFun()
            if (this.id) {
                const { result } = await getRedPackageDetail(this.id)
                const { name, issueVolume, bgUrlsIndex, showStatus, logoUrl, redPacketCouponVO } = result
                const { amount, receiveEndTime, receiveStartTime, receiveLimit, tagIds, distributionMethod, price, activityLimit, quantityLimit, useStartTime, useEndTime, useLimitAmount, useWithCoupon, scholarship, brief } = redPacketCouponVO
                let useStackable = 1
                if (!useWithCoupon && !scholarship) useStackable = 0
                this.initReceiveTime = [receiveStartTime, receiveEndTime]
                this.initUseTime = [useStartTime, useEndTime]
                this.form = {
                    name,
                    issueVolume,
                    bgUrlsIndex,
                    showStatus,
                    logoUrl,
                    redPacketCouponDTO: {
                        amount,
                        receiveEndTime,
                        receiveStartTime,
                        receiveLimit,
                        tagIds,
                        distributionMethod,
                        price,
                        activityLimit,
                        quantityLimit,
                        useStartTime,
                        useEndTime,
                        useLimitAmount,
                        useStackable,
                        useWithCoupon: Boolean(useWithCoupon),
                        scholarship: Boolean(scholarship),
                        brief
                    }
                }
            }
        } catch (e) {
            throw e
        }
    }

    rulesReceiveLimit = (rule: number, value: any, callback: Function) => {
        if (value === 3 && !this.form.redPacketCouponDTO.tagIds.length) {
            callback(new Error('请选择部分用户分组'))
            return
        }
        callback()
    }

    rulesDistributionMethod = (rule: number, value: any, callback: Function) => {
        console.log(value)
        if (value === 2 && !this.form.redPacketCouponDTO.price) {
            callback(new Error('请输入支付金额'))
            return
        }
        callback()
    }

    rulesUseStackable = (rule: number, value: any, callback: Function) => {
        if (value === 1 && !this.form.redPacketCouponDTO.useWithCoupon && !this.form.redPacketCouponDTO.scholarship) {
            callback(new Error('请选择使用限制类型'))
            return
        }
        callback()
    }

    rulesLogoShow = (rule: number, value: any, callback: Function) => {
        if (value === 1 && !this.form.logoUrl) {
            callback(new Error('请上传品牌logo图片'))
            return
        }
        callback()
    }

    rulesGoodsId = (rule: number, value: any, callback: Function) => {
        if (!value.length) {
            callback(new Error('请选择适用产品'))
            return
        }
        callback()
    }

    rules= {
        name: [
            { required: true, message: '福利红包名称不能为空', trigger: 'blur' },
            { max: 12, message: '福利红包名称不能超过12个字符', trigger: 'blur' },
            { min: 4, message: '福利红包名称不能少于4个字符', trigger: 'blur' }
        ],
        'redPacketCouponDTO.amount': [
            { required: true, message: '福利红包面额不能为空', trigger: 'blur' },
            { validator: checkNumber(99999, 1, 0), trigger: 'blur' }
        ],
        issueVolume: [
            { required: true, message: '发放量不能为空', trigger: 'blur' }
        ],
        'redPacketCouponDTO.receiveStartTime': [
            { required: true, message: '领用时间不能为空', trigger: 'blur' }
        ],
        'redPacketCouponDTO.receiveLimit': [
            { required: true, trigger: 'blur' },
            { validator: this.rulesReceiveLimit, trigger: 'blur' }
        ],
        'redPacketCouponDTO.distributionMethod': [
            { validator: this.rulesDistributionMethod, trigger: 'blur' }
        ],
        'redPacketCouponDTO.useStartTime': [
            { required: true, message: '使用时间不能为空', trigger: 'blur' }
        ],
        'redPacketCouponDTO.applicableGoodsId': [
            { validator: this.rulesGoodsId, trigger: 'blur' }
        ],
        'redPacketCouponDTO.useLimitAmount': [
            { required: true, message: '抵扣规则不能为空', trigger: 'blur' }
        ],
        'redPacketCouponDTO.useStackable': [
            { validator: this.rulesUseStackable, trigger: 'blur' }
        ],
        brief: [
            { required: true, message: '使用须知不能为空', trigger: 'blur' },
            { max: 200, message: '使用须知不能超过200个字符', trigger: 'blur' }
        ],
        logoShow: [
            { validator: this.rulesLogoShow, trigger: 'blur' }
        ]
    }

    checkAllChange (val: any) {
        if (val) {
            this.form.redPacketCouponDTO.tagIds = this.checkListArray.map(item => item.id)
        } else {
            this.form.redPacketCouponDTO.tagIds = []
        }
    }

    async save () {
        try {
            await (this.$refs.ruleForm as HTMLFormElement).validate()
            const data = JSON.parse(JSON.stringify(this.form))
            data.redPacketCouponDTO.price = data.redPacketCouponDTO.price * 100
            if (!data.logoShow) data.logoUrl = ''
            if (!data.redPacketCouponDTO.useStackable) {
                data.redPacketCouponDTO.useWithCoupon = 0
                data.redPacketCouponDTO.scholarship = 0
            }
            await addRedPackage(data)
        } catch (e) {
            throw e
        }
    }

    receiveTimeChange ({ start, end }: any) {
        this.form.redPacketCouponDTO.receiveStartTime = start
        this.form.redPacketCouponDTO.receiveEndTime = end
    }

    useTimeChange ({ start, end }: any) {
        this.form.redPacketCouponDTO.useStartTime = start
        this.form.redPacketCouponDTO.useEndTime = end
    }

    logoUrlChange (val: any) {
        console.log(12345)
        console.log(val)
        val.length ? this.form.logoUrl = val[0] : this.form.logoUrl = ''
    }

    async getUserTtagListFun () {
        try {
            const { result } = await getUserTtagList()
            this.checkListArray = result
        } catch (e) {
            throw e
        }
    }

    selectProductSku (val: ProdItem[]) {
        console.log(val)
        console.log(val)
        console.log(val)
        this.productModelList = val
        if (!val || !val.length) return
        for (const item of this.productModelList) {
            this.form.redPacketCouponDTO.applicableGoodsId.push(item.productId)
            this.form.redPacketCouponDTO.applicableGoodsSkuId.push(item.skuId)
        }
    }

    async removePro (item: ProdItem) {
        try {
            await this.$confirm('您确定移除吗？')
            const index = this.productModelList.findIndex((prod: ProdItem) => (prod.productId === item.productId))
            if (index > -1) this.productModelList.splice(index, 1)
        } catch (error) {
            throw error
        }
    }
}

//     async beforeRouteLeave (to, from, next) {
//         if (to.name !== 'CategoryCouponList' && to.name !== 'OrgIndex' && to.name !== 'AddLongmenLottery' && to.name !== 'EditLongmenLottery' && to.name !== 'NewcomersAdd' && to.name !== 'NewcomersEdit' && to.name !== 'NewcomersCopy') {
//             await this.$confirm({
//                 title: '放弃编辑？',
//                 message: '是否要放弃当前品类券编辑，放弃后将不可恢复！'
//             })
//         }
//         if (to.name === 'NewcomersAdd' || to.name === 'NewcomersEdit' || to.name === 'NewcomersCopy') {
//             sessionStorage.setItem(SessionEnum.couponResultData, JSON.stringify(this.resultData))
//         }
//         if (to.name !== 'NewcomersAdd' && to.name !== 'NewcomersEdit' && to.name !== 'NewcomersCopy') {
//             sessionStorage.removeItem(SessionEnum.selectedCouponList)
//         }
//         await this.clearData()
//         next()
//     },
//     beforeRouteEnter (to, from, next) {
//         next(vm => {
//             if (from.name === 'NewcomersEdit' || from.name === 'NewcomersAdd' || from.name === 'NewcomersCopy') {
//                 vm.form.distributionMethod = 1
//             }
//         })
//     }
// }
</script>
<style lang="scss" scoped>
    .add-content{
        padding-bottom: 100px;
        .product-table {
            margin-top: 20px;
            margin-bottom: 10px;
            border: 1px solid #ebeef5;
            border-bottom: none;
        }
    }
    .stackable{
        width: 582px;
        background: #F4F5F8;
        border-radius: 10px;
        padding: 20px;
    }
    .flex-align {
        display: flex;
        align-items: center;
    }
    .flex-justify {
        display: flex;
        justify-content: center;
    }
    .red{
        color: #D0423C;
    }
    .description{
        margin-top: 15px;
        font-weight: 400;
        font-size: 12px;
        color: #999;
        line-height: 16px;
    }
    .swiper-box{
        width: 700px;
        position: relative;
        padding: 20px 50px;
        border: 1px solid #E7E7E7;
        .swiper {
            height: 235px;
            width: 600px;
            overflow: hidden;
            margin: 0;
            .swiper-slide{
                display: flex;
                flex-direction: column;
                align-items: center;
                .slide-title{
                    width: 100%;
                    padding-left: 15px;
                    font-size: 12px;
                    color: #666;
                }
                .img-box{
                    position: relative;
                    label{
                        position: absolute;
                        top: -6px;
                        right: 2px;
                    }
                }
            }
        }
        .swiper-button-prev, .swiper-button-next{
            width: 29px;
            height: 15px;
        }
    }
    .purchase-sort-description {
        font-weight: 400;
        font-size: 14px;
        color: #999;
    }
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
    .user-category{
        display: flex;
        width: 715px;
        padding: 24px 26px;
        margin-top: 10px;
        background: #F4F5F8;
        border: 1px solid #ccc;
        padding-left: 10px;
        >div{
            display: inline-block;
        }
        .category-head{
            padding-left: 10px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
        }
        .category-content{
            width: 500px;
        }
    }

    .brief-edit{
        margin-top: 110px;
        display: inline-block;
        padding-left: 10px;
        cursor: pointer;
        vertical-align: bottom
    }
</style>
