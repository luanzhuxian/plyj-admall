<template>
    <div class="red-package">
        <div class="tips">
            <pl-svg name="yaji-tips" width="20" />
            <div>
                <p>温馨提示</p>
                <p>
                    福利红包仅仅支持线上购买“课程、商品”时使用，满足使用条件将自动抵扣相应的支付金额，暂不支持直播类产品的使用。
                </p>
            </div>
        </div>
        <div class="preview-swiper">
            <div class="title">福利红包示例</div>
            <swiper class="swiper" :options="previewSwiperOption">
                <swiperSlide
                    v-for="(item, index) of perviewImg"
                    :key="index"
                >
                    <div class="img-box">
                        <img :src="item">
                    </div>
                </swiperSlide>
            </swiper>
            <div class="swiper-pagination" />
        </div>
        <div class="add-content">
            <div class="wrap">
                <!--            <div class="tips">-->
                <!--                <pl-svg class="pointer" name="icon-shanchu1" width="16" fill="#fff" />-->
                <!--            </div>-->
                <div class="content-title" id="basic" ref="basic">
                    基本信息
                </div>
                <el-form
                    label-width="170px"
                    :model="form"
                    :rules="rules"
                    ref="ruleForm"
                    label-position="right"
                    class="main-form"
                    auto-scroll-to-error
                >
                    <el-form-item label="福利红包名称：" prop="name">
                        <el-input style="width: 320px" v-model="form.name" @change="getBrief" maxlength="12" show-word-limit placeholder="请输入福利红包名称" />
                    </el-form-item>
                    <el-form-item label="福利红包面额：" prop="redPacketCouponDTO.amount">
                        <el-input style="width: 160px" @change="getBrief" type="number" v-model="form.redPacketCouponDTO.amount" :disabled="disabled" maxlength="50" placeholder="请输入福利红包金额" /> 元 <span class="label-warning">开始后不可修改</span>
                        <p class="description">
                            福利红包面额，是活动期间通过免费领取或者付费领取后，可获得的实际福利红包,在购买指定范围内的产品时，可抵扣相应金额使用。
                        </p>
                    </el-form-item>
                    <el-form-item label="发放量：" prop="issueVolume">
                        <el-input-number v-model="form.issueVolume" :min="1" :max="99999" label="描述文字" />
                        <p class="description">
                            发放量指，可发放的福利红包数量，福利红包被领取后发放量将随之减少；当发放量为0，即福利红包全部被领取，活动将自动结束。
                        </p>
                    </el-form-item>
                    <div class="content-title">
                        领取条件
                    </div>
                    <el-form-item label="领用时间：" prop="redPacketCouponDTO.receiveStartTime">
                        <date-range
                            size="small"
                            disable-before
                            :clearable="true"
                            range-separator="至"
                            ref="payDate"
                            :init="initReceiveTime"
                            @change="receiveTimeChange"
                            :disabled-start-time="disabled"
                        />
                        <p class="description">
                            在活动领用时间内可领用福利红包，领用时间结束后不可继续领用福利红包
                        </p>
                    </el-form-item>
                    <el-form-item label="适用用户：" prop="redPacketCouponDTO.receiveLimit">
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
                        <UserGroup
                            v-show="form.redPacketCouponDTO.receiveLimit === 3"
                            v-model="form.redPacketCouponDTO.tagIds"
                            @init="userGroupInit"
                        />
                    </el-form-item>
                    <el-form-item label="领用方式：" prop="redPacketCouponDTO.price">
                        <el-radio-group @change="distributionMethodChange" :disabled="disabled" v-model="form.redPacketCouponDTO.distributionMethod">
                            <el-radio :label="0">
                                免费
                            </el-radio>
                            <el-radio :label="2">
                                付费
                            </el-radio>
                        </el-radio-group>
                        <div style="margin-left: 115px" v-if="form.redPacketCouponDTO.distributionMethod">
                            支付 <el-input style="width: 100px" type="number" v-model="form.redPacketCouponDTO.price" maxlength="50" placeholder="请输入金额" /> 元，可购买福利红包
                        </div>
                    </el-form-item>

                    <el-form-item label="领用次数限制：" prop="redPacketCouponDTO.quantityLimit">
                        <el-checkbox
                            v-model="form.redPacketCouponDTO.activityLimit"
                            :true-label="1"
                            :false-label="0"
                        >
                            每个用户可领用
                        </el-checkbox>
                        <el-input-number :disabled="!form.redPacketCouponDTO.activityLimit" style="margin-left: 10px" :min="1" :max="100" v-model="form.redPacketCouponDTO.quantityLimit" label="描述文字" />
                        <p class="description">
                            未勾选，则不限制用户领用次数 <br>
                            勾选，则领用次数至少可领用一次，至多可领用100次</p>
                    </el-form-item>

                    <div class="content-title">
                        使用条件
                    </div>
                    <el-form-item label="使用时间：" prop="redPacketCouponDTO.useStartTime">
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
                            领取到的福利活动可在活动使用时间内使用，过期后福利红包自动失效
                        </p>
                    </el-form-item>

                    <el-form-item label="适用产品：" prop="redPacketCouponDTO.couponGoodsSkus">
                        <el-button type="primary" plain @click="showProductBox = true">
                            选择商品/课程
                        </el-button>
                        <span class="description" style="margin-left: 20px;color: #F79F1A">
                            任何产品或产品规格变动，均会影响已添加的产品或产品规格失效，请谨慎操作。
                        </span>
                        <p class="description">
                            线上商城购买相应范围内的单个产品或者多个产品时，只要购买产品的总额满足抵扣条件，即可使用福利红包进行抵扣相应金额。
                        </p>

                        <!-- 商品列表 -->
                        <el-table
                            ref="prodTable"
                            class="product-table"
                            :class="{'all-show': !allShow}"
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
                                width="210"
                            />
                            <el-table-column
                                prop="productType"
                                label="产品类型"
                                width="100"
                            >
                                <template #default="{row}">
                                    {{ productTypeMap[row.productType] }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="productType"
                                label="状态"
                                width="80"
                            >
                                <template #default="{row}">
                                    {{ productStatusMap[row.productStatus] }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="规格"
                                width="150"
                            >
                                <template slot-scope="{ row }">
                                    <div>{{ row.skuCode1Name + (row.skuCode2Name ? `/${row.skuCode2Name}` : '') }}</div>
                                    <div v-if="row.oldSku" class="sku-warning">该规格已失效</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="price"
                                label="价格（元）"
                                width="90"
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

                        <div v-if="productModelList&& productModelList.length>5"
                             class="product-btn">
                            <el-button @click="allShow = !allShow" type="text" v-if="allShow">全部收起 <pl-svg name="icon-shang" fill="#4F63FF" /></el-button>
                            <el-button @click="allShow = !allShow" type="text" v-else>全部展开 <pl-svg name="icon-xia" fill="#4F63FF" /></el-button>
                        </div>
                    </el-form-item>

                    <el-form-item label="抵扣规则：" prop="redPacketCouponDTO.useLimitAmount">
                        购买金额满 <el-input :disabled="disabled" style="width: 160px" type="number" @change="getBrief" v-model="form.redPacketCouponDTO.useLimitAmount" placeholder="请输入金额" /> 元 <span class="label-warning">开始后不可修改</span>
                    </el-form-item>

                    <el-form-item label="使用限制：" prop="redPacketCouponDTO.useStackable">
                        <el-radio-group :disabled="disabled" @change="getBrief" v-model="form.redPacketCouponDTO.useStackable">
                            <el-radio :label="1">
                                支持叠加使用
                            </el-radio>
                            <el-radio :label="0">
                                不支持叠加使用
                            </el-radio>
                        </el-radio-group>
                        <span class="label-warning">开始后不可修改</span>
                        <div class="stackable" v-if="form.redPacketCouponDTO.useStackable">
                            <el-checkbox :disabled="disabled" @change="getBrief" :true-label="1" :false-label="0" v-model="form.redPacketCouponDTO.useWithCoupon">满减券/品类券</el-checkbox>
                            <el-checkbox :disabled="disabled" @change="getBrief" :true-label="1" :false-label="0" v-model="form.redPacketCouponDTO.scholarship">奖学金</el-checkbox>
                            <p class="description">
                                购买产品时，使用该福利红包抵扣金额，可同时与满减券/品类券、奖学金叠加抵扣使用； <br>
                                秒杀、团购、预购等活动均不支持使用福利红包进行抵扣减免；
                            </p>
                        </div>
                    </el-form-item>

                    <el-form-item label="使用须知：" prop="redPacketCouponDTO.brief">
                        <el-input
                            :disabled="!Boolean(briefEdit)"
                            type="textarea"
                            placeholder="请输入使用须知的内容"
                            v-model="form.redPacketCouponDTO.brief"
                            maxlength="200"
                            style="width: 500px;"
                            :rows="8"
                            resize="none"
                            show-word-limit
                            :editable="false"
                        />
                        <pl-svg v-if="!briefEdit" class="brief-edit" width="24" fill="#4F63FF" name="icon-bianji1" @click="briefEdit = true" />
                        <div>
                            <span class="description">支持自定义使用须知内容，请查看展示</span>
                            <el-button
                                type="text"
                                @click="showDescriptionDialog = true"
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
                            （隐藏后，在商城活动界面内不显示，但可通过链接的方式访问）
                        </span>
                    </el-form-item>

                    <el-form-item label="展示牌曝光：" prop="logoShow">
                        <el-checkbox
                            v-model="form.logoShow"
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
                        <p v-if="form.logoShow" class="description">只支持.jpg .png 格式，最多上传1张，大小为2M以内</p>
                    </el-form-item>

                    <el-form-item label="背景：" prop="bgUrlsIndex">
                        <div class="swiper-box">
                            <swiper class="swiper" :options="swiperOption">
                                <swiperSlide
                                    v-for="(item, index) of redPackageBg"
                                    :key="index"
                                >
                                    <div class="slide-title">默认背景</div>
                                    <div class="img-box">
                                        <el-checkbox
                                            v-model="item.check"
                                            @change="checkBg(item)"
                                        >
                                            <img :src="item.imgSrc" style="width: 120px;height: 160px;">
                                        </el-checkbox>
                                    </div>
                                    <el-button size="large" type="text" @click="preview(index)">预览</el-button>
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
            </div>
            <div class="add-btn-wrap">
                <el-button plain round @click="$router.replace({name:'RedPackage'})">
                    取消
                </el-button>
                <el-button type="primary" round :loading="loading" @click="save">
                    保存
                </el-button>
            </div>
        </div>
        <productSkuSelector
            :visible.sync="showProductBox"
            @confirm="selectProductSku"
            :max-select="50"
            :default-selected="productModelList"
        />
        <Preview :show.sync="previewShow" :top="false">
            <img style="width: 100%" :src="perviewImg[perviewIndex]" alt="">
        </Preview>

        <el-dialog
            title="查看示例"
            :visible.sync="showDescriptionDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="770px"
        >
            <div class="description-dialog">
                <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/福利红包示例预览.jpg" alt="">
                <el-button
                    type="primary"
                    @click="showDescriptionDialog = false"
                >
                    我知道了
                </el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import UploadImage from '../../../../components/common/file/Image-Manager.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { State } from 'vuex-class'
import productSkuSelector from '../../../../components/product-center/goods/Product-Sku-Selector.vue'
import { checkNumber } from '@/assets/ts/validate'
import { addRedPackage, getRedPackageDetail, editRedPackage, getRedPackageclaimVolume } from '../../../../apis/marketing-manage/red-package'
import UserGroup from '../../../../components/common/User-Group.vue'
import Preview from '../../../../components/common/Preview.vue'
type ProdItem = {
    productId: string;
    productType: string;
    productStatus: string;
    skuId: string;
    productName: string;
    skuCode1Name: string;
    skuCode2Name: string;
    skuCode1: string;
    skuCode2: string;
    originPrice: number;
    price: number;
}
type checkList = { id: string; sort: string; name: string }
Component.registerHooks([
    'beforeRouteLeave'
])
// import moment from 'moment/moment'
@Component({
    components: {
        UploadImage,
        swiper,
        swiperSlide,
        productSkuSelector,
        UserGroup,
        Preview
    }
})
export default class AddRedPackage extends Vue {
    @Prop(String) id: string | undefined;
    @State('productTypeMap') productTypeMap!: DynamicObject
    @State('productStatusMap') productStatusMap!: DynamicObject
    @State('redPackageBg') redPackageBg!: DynamicObject[]
    showDescriptionDialog=false
    previewShow=false
    perviewIndex=0
    perviewImg=[
        'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包预览1.png',
        'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包预览2.png',
        'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包预览3.png',
        'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包预览4.png'
    ]

    allShow = false
    loading= false
    disabled = false
    briefEdit= false
    logoUrl: string[]= []
    showProductBox= false
    claimVolume = 0
    productModelList: ProdItem[] = []
    previewSwiperOption= {
        pagination: {
            el: '.swiper-pagination'
            // clickable: true
        },
        slidesPerView: 1
    }

    swiperOption= {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        slidesPerView: 4
    }

    checkListArray: checkList[]= []
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
        logoShow: false,
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
            distributionMethod: 2,
            price: '',
            // 领取次数限制
            activityLimit: 0,
            quantityLimit: '',
            // 使用时间
            useStartTime: '',
            useEndTime: '',
            // 适用商品
            couponGoodsSkus: [],
            // 抵扣规则满金额
            useLimitAmount: '',
            // 使用限制
            useStackable: 0,
            useWithCoupon: 0,
            scholarship: 0,
            // 使用须知
            brief: ''
        }
    }

    async created () {
        try {
            if (this.id) {
                this.briefEdit = true
                const { result } = await getRedPackageDetail(this.id)
                const { activityStatus, name, issueVolume, bgUrlsIndex, showStatus, logoShow, logoUrl, redPacketCouponVO } = result
                const { amount, receiveEndTime, receiveStartTime, receiveLimit, tagIds, distributionMethod, price, activityLimit, quantityLimit, useStartTime, useEndTime, useLimitAmount, useWithCoupon, scholarship, brief, applicableGoodsVOS } = redPacketCouponVO
                if (activityStatus !== 0) this.disabled = true
                let useStackable = 1
                if (!useWithCoupon && !scholarship) useStackable = 0
                this.initReceiveTime = [receiveStartTime, receiveEndTime]
                this.initUseTime = [useStartTime, useEndTime]
                this.form = {
                    name,
                    issueVolume,
                    bgUrlsIndex,
                    showStatus: !showStatus,
                    logoShow,
                    logoUrl,
                    redPacketCouponDTO: {
                        amount,
                        receiveEndTime,
                        receiveStartTime,
                        receiveLimit,
                        tagIds,
                        distributionMethod,
                        price: price / 100,
                        activityLimit,
                        quantityLimit,
                        useStartTime,
                        useEndTime,
                        couponGoodsSkus: [],
                        useLimitAmount,
                        useStackable,
                        useWithCoupon: Number(useWithCoupon),
                        scholarship: Number(scholarship),
                        brief
                    }
                }
                this.productModelList = applicableGoodsVOS
                this.selectProductSku(applicableGoodsVOS)
                if (logoShow && logoUrl) this.logoUrl[0] = logoUrl
                // 因修改规格暂不校验已领取量和发放量
                // await this.getRedPackageclaimVolume()

                if (this.$route.name === 'CopyRedPackage') {
                    this.disabled = false
                    this.initReceiveTime = ['', '']
                    this.initUseTime = ['', '']
                    this.form.redPacketCouponDTO.receiveStartTime = ''
                    this.form.redPacketCouponDTO.receiveEndTime = ''
                    this.form.redPacketCouponDTO.useStartTime = ''
                    this.form.redPacketCouponDTO.useEndTime = ''
                }
            } else {
                this.getBrief()
            }
            for (const item of this.redPackageBg) {
                item.check = false
                if (this.form.bgUrlsIndex === item.id) item.check = true
            }
        } catch (e) {
            throw e
        }
    }

    rulesIssueVolume (rule: number, value: any, callback: Function) {
        if (this.claimVolume && (value < this.claimVolume)) {
            callback(new Error('发放量不能小于已领用量'))
            return
        }
        callback()
    }

    rulesReceiveLimit (rule: number, value: any, callback: Function) {
        if (value === 3 && !this.form.redPacketCouponDTO.tagIds.length) {
            callback(new Error('请选择部分用户分组'))
            return
        }
        callback()
    }

    rulesPrice (rule: number, value: any, callback: Function) {
        if (this.form.redPacketCouponDTO.distributionMethod === 2 && !value) {
            callback(new Error('请输入支付金额'))
            return
        }
        if (this.form.redPacketCouponDTO.distributionMethod) {
            if (Number.isNaN(Number(value))) {
                callback(new Error('必须是数字'))
                return
            }
            if (Number(value) > 99999.99) {
                callback(new Error(`最大值为${ 99999.99 }`))
                return
            }
            if (Number(value) < 0.01) {
                callback(new Error(`最小值为${ 0.01 }`))
                return
            }
            const dec = String(value).split('.')[1] || ''
            if (dec && dec.length > 2) {
                callback(new Error('只允许保留2位小数'))
                return
            }
        }
        callback()
    }

    rulesUseStackable (rule: number, value: any, callback: Function) {
        if (value === 1 && !this.form.redPacketCouponDTO.useWithCoupon && !this.form.redPacketCouponDTO.scholarship) {
            callback(new Error('请选择使用限制类型'))
            return
        }
        callback()
    }

    rulesLogoShow (rule: number, value: any, callback: Function) {
        if (value && !this.form.logoUrl) {
            callback(new Error('请上传品牌logo图片'))
            return
        }
        callback()
    }

    rulesGoodsId (rule: number, value: any, callback: Function) {
        if (!value || !value.length) {
            callback(new Error('至少需选择1个适用产品'))
            return
        }
        if (value && value.length > 50) {
            callback(new Error('最多选择50个商品或课程'))
            return
        }
        callback()
    }

    rules= {
        name: [
            { required: true, message: '福利红包名称不能为空', trigger: 'blur' },
            { max: 12, message: '福利红包名称不能超过12个字符', trigger: 'blur' }
        ],
        'redPacketCouponDTO.amount': [
            { required: true, message: '福利红包面额不能为空', trigger: 'blur' },
            { validator: checkNumber(99999.99, 0.01, 2), trigger: 'blur' }
        ],
        issueVolume: [
            { required: true, message: '发放量不能为空', trigger: 'blur' },
            { validator: checkNumber(99999, 1, 0), trigger: 'blur' }
            // { validator: this.rulesIssueVolume, trigger: 'blur' }
            // 因修改规格暂不校验已领取量和发放量
        ],
        'redPacketCouponDTO.receiveStartTime': [
            { required: true, message: '领用时间不能为空', trigger: 'blur' }
        ],
        'redPacketCouponDTO.receiveLimit': [
            { required: true, trigger: 'blur' },
            { validator: this.rulesReceiveLimit, trigger: 'blur' }
        ],
        'redPacketCouponDTO.quantityLimit': [
            { validator: checkNumber(100, 1, 0), trigger: 'blur' }
        ],
        'redPacketCouponDTO.price': [
            { validator: this.rulesPrice, trigger: 'blur' }
        ],
        'redPacketCouponDTO.useStartTime': [
            { required: true, message: '使用时间不能为空', trigger: 'blur' }
        ],
        'redPacketCouponDTO.couponGoodsSkus': [
            { required: true, message: '请选择适用产品', trigger: 'blur' },
            { validator: this.rulesGoodsId, trigger: 'blur' }
        ],
        'redPacketCouponDTO.useLimitAmount': [
            { required: true, message: '抵扣规则不能为空', trigger: 'blur' },
            { validator: checkNumber(99999.99, 0.01, 2), trigger: 'blur' }
        ],
        'redPacketCouponDTO.useStackable': [
            { required: true, message: '请选择抵扣规则', trigger: 'blur' },
            { validator: this.rulesUseStackable, trigger: 'blur' }
        ],
        'redPacketCouponDTO.brief': [
            { required: true, message: '使用须知不能为空', trigger: 'blur' },
            { max: 200, message: '使用须知不能超过200个字符', trigger: 'blur' }
        ],
        logoShow: [
            { validator: this.rulesLogoShow, trigger: 'blur' }
        ],
        bgUrlsIndex: [
            { required: true, message: '背景图不能为空', trigger: 'blur' }
        ]
    }

    preview (index: number) {
        this.previewShow = true
        this.perviewIndex = index
    }

    getBrief () {
        if (this.briefEdit) return
        let stackable = ''
        if (!this.form.redPacketCouponDTO.useStackable) {
            stackable = '不可与其他福利红包、满减券/品类券、奖学金同时使用'
        } else {
            stackable = `不可与其他福利红包叠加使用，但支持与其他${ this.form.redPacketCouponDTO.useWithCoupon ? '满减券/品类券' : '' }${ this.form.redPacketCouponDTO.useWithCoupon && this.form.redPacketCouponDTO.scholarship ? '、' : '' }${ this.form.redPacketCouponDTO.scholarship ? '奖学金' : '' }同时使用`
        }
        this.form.redPacketCouponDTO.brief = `${ this.form.name }` + '\n' +
            '1.优惠内容：部分商品可使用，满' + `${ this.form.redPacketCouponDTO.useLimitAmount ? this.form.redPacketCouponDTO.useLimitAmount : '*' }` + '元立减' + `${ this.form.redPacketCouponDTO.amount ? this.form.redPacketCouponDTO.amount : '*' }` + '元\n' +
            '2.使用时间：' + `${ this.form.redPacketCouponDTO.useStartTime ? this.form.redPacketCouponDTO.useStartTime.split(' ')[0] : '' }` + '~' + `${ this.form.redPacketCouponDTO.useEndTime ? this.form.redPacketCouponDTO.useEndTime.split(' ')[0] : '' }` + '\n' +
            '3.使用限制：' + `${ stackable }` + '\n' +
            '4.其他限制：仅支持线上购买商品使用，' + '\n' +
            '购买商品使用福利红包抵扣相应金额后，商品退款成功后，福利红包不支持退回'
    }

    checkBg (val: any) {
        if (val.check) {
            for (const item of this.redPackageBg) {
                val.id !== item.id ? item.check = false : this.form.bgUrlsIndex = item.id
            }
        } else {
            const data = this.redPackageBg.find(item => item.check === true)
            if (!data) this.form.bgUrlsIndex = ''
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
            if (!data.redPacketCouponDTO.activityLimit) data.redPacketCouponDTO.quantityLimit = ''
            if (!data.redPacketCouponDTO.receiveLimit) data.redPacketCouponDTO.tagIds = []
            data.showStatus = !data.showStatus
            this.id && this.$route.name === 'EditRedPackage' ? await editRedPackage(this.id, data) : await addRedPackage(data)
            this.$router.replace({ name: 'RedPackage' })
        } catch (e) {
            throw e
        }
    }

    distributionMethodChange (val: number) {
        if (val === 0) this.form.redPacketCouponDTO.price = ''
    }

    async getRedPackageclaimVolume () {
        try {
            if (this.$route.name !== 'EditRedPackage') return
            const claimVolume = await getRedPackageclaimVolume(this.id as string)
            this.claimVolume = claimVolume.result
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
        this.getBrief()
    }

    logoUrlChange (val: any) {
        val.length ? this.form.logoUrl = val[0] : this.form.logoUrl = ''
    }

    userGroupInit (val: any[]) {
        this.checkListArray = val
    }

    selectProductSku (val: ProdItem[]) {
        this.productModelList = val
        if (!val || !val.length) return
        this.form.redPacketCouponDTO.couponGoodsSkus = []
        for (const item of this.productModelList) {
            this.form.redPacketCouponDTO.couponGoodsSkus.push({
                productId: item.productId,
                skuCode: item.skuCode1,
                subSkuCode: item.skuCode2
            })
        }
    }

    async removePro (item: ProdItem) {
        try {
            await this.$confirm('您确定移除吗？')
            const index = this.productModelList.findIndex((prod: ProdItem) => (prod.skuCode1 + prod.skuCode2 === item.skuCode1 + item.skuCode2))
            if (index > -1) this.productModelList.splice(index, 1)
            this.selectProductSku(this.productModelList)
        } catch (error) {
            throw error
        }
    }

    async beforeRouteLeave (to: { name: string }, from: any, next: () => void) {
        if (to.name !== 'RedPackage' && to.name !== 'OrgIndex' && to.name !== 'RedPackageList' && to.name !== 'RedPackageActivityList') {
            await this.$confirm({
                title: '放弃编辑？',
                message: '是否要放弃当福利红包活动编辑，放弃后将不可恢复！'
            })
        }
        next()
    }
}
</script>
<style lang="scss" scoped>
    .red-package{
        background-color: #ffffff;
        border: 1px solid #e7e7e7;
        .tips{
            display: flex;
            padding: 16px;
            margin: 40px 40px 0 40px;
            background-color: #FFFAF3;
            border: 1px solid #F79F1A;
            border-radius: 10px;
            >div{
                padding-left: 9px;
                p:first-child{
                    font-size: 14px;
                    font-weight: 400;
                }
                p:last-child{
                    font-size: 12px;
                    font-weight: 400;
                    color: #999999;
                    >span{
                        color: #F79F1A;
                    }
                }
            }
        }
        .add-content{
            display: inline-flex;
            padding-bottom: 100px;
            .product-table {
                margin-top: 20px;
                margin-bottom: 10px;
                border: 1px solid #ebeef5;
                border-bottom: none;
            }
            .all-show{
                max-height: 700px;
            }
            .product-btn{
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 3px 0;
                background: #F5F6FA;
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
        .label-warning{
            margin-left: 20px;
            font-size: 12px;
            color: #D0423C;
        }
        .sku-warning{
            font-size: 12px;
            color: #D0423C;
        }
        .description{
            margin-top: 15px;
            font-weight: 400;
            font-size: 12px;
            color: #999;
            line-height: 16px;
        }
        .preview-swiper{
            display: inline-flex;
            flex-wrap: wrap;
            width: 298px;
            height: 600px;
            padding-left: 36px;
            position: relative;
            .title{
                display: block;
                font-size: 12px;
                color: #999;
                padding-bottom: 16px;
                padding-top: 36px;
            }
            .swiper{
                height: 514px;
                img{
                    width: 100%;
                }
            }
            .swiper-pagination{
                position: absolute;
                bottom: -20px;
                left: 110px;
                ::v-deep >span{
                    border-color: #4F63FF !important;
                }
                ::v-deep .swiper-pagination-bullet{
                    width: 20px;
                    height: 4px;
                    margin: 0 2px;
                    background: #ccc;
                    border-radius: 2px;
                    opacity: 1;
                }
                ::v-deep .swiper-pagination-bullet-active{
                    background-color: #4F63FF;
                }
            }
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
                        >label{
                            ::v-deep .el-checkbox__input{
                                position: absolute;
                                top: 2px;
                                right: 2px;
                            }
                        }
                    }
                }
            }
            .swiper-button-prev, .swiper-button-next{
                width: 29px;
                height: 15px;
                z-index: 5;
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

        .description-dialog{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
</style>
