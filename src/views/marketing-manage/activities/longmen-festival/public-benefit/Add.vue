<template>
    <div class="add-benefit">
        <div class="add-content">
            <div class="content-title" id="basic" ref="basic">
                活动设置
            </div>
            <el-form :disabled="readOnly" label-width="150px" label-position="left" ref="form" :model="form" :rules="rules">
                <el-form-item label="活动名称" prop="activityName">
                    <el-input style="width: 320px" placeholder="请输入活动名称" maxlength="20" v-model="form.activityName" />
                    <span class="remark">（至多可输入20个字）</span>
                </el-form-item>
                <el-form-item label="活动细则" prop="activityDesc">
                    <el-input
                        v-model="form.activityDesc"
                        type="textarea"
                        maxlength="500"
                        show-word-limit
                        placeholder="请输入活动细则"
                        resize="none"
                        :rows="5"
                        style="width: 420px;"
                    />
                </el-form-item>
                <el-form-item label="适用用户" prop="tagIds">
                    <template>
                        <el-radio-group v-model="form.userScope" :disabled="!beforeActiviting">
                            <el-radio :label="0">
                                全部用户
                            </el-radio>
                            <el-radio :label="1">
                                Helper可用
                            </el-radio>
                            <el-radio :label="2">
                                普通会员
                            </el-radio>
                            <!--没有设置用户标签的时候，此选项不可选择-->
                            <el-radio :label="3" :disabled="!userGroup.length">
                                部分用户组可用
                            </el-radio>
                            <span class="remark">（请先在会员中心-设置用户分组）</span>
                        </el-radio-group>
                        <p class="user-group" v-if="form.userScope === 3">
                            <el-checkbox-group v-model="form.tagIds">
                                <el-checkbox v-for="(item, i) of userGroup" :key="i" :label="item.id">
                                    {{ item.tagName }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </p>
                    </template>
                </el-form-item>
                <el-form-item label="活动时间" prop="startTime">
                    <div class="activity-date">
                        <date-range
                            :init="dateTime"
                            type="datetime"
                            @change="dateChange"
                            disable-before
                            :disabled-start-time="!beforeActiviting"
                            clearable
                        />
                    </div>
                </el-form-item>
                <el-form-item label="公益商品" prop="productModels">
                    <el-button :disabled="publicGoodsNum >= maxPublicGoodsNum" @click="showSelectProduct = true">
                        添加商品/课程
                    </el-button>
                    <el-button :disabled="publicGoodsNum >= maxPublicGoodsNum" @click="showSelectKnowledge = true">
                        添加知识商品
                    </el-button>
                    <span class="ml-10">{{ publicGoodsNum }}/{{ maxPublicGoodsNum }}</span>
                    <span class="remark">（最多添加{{ maxPublicGoodsNum }}个商品或知识课程，参与公益金捐赠活动）</span>
                    <!-- 商品 -->
                    <div v-if="form.productModels && form.productModels.length" class="pruduct-container">
                        <ul class="header">
                            <li>商品ID</li>
                            <li>商品名称</li>
                            <li>类型</li>
                            <li>状态</li>
                            <li>商品规格</li>
                            <li>原价（元）</li>
                            <li>售价（元）</li>
                            <li>活动价（元）</li>
                            <li>库存</li>
                            <li>捐赠金额</li>
                            <li>操作</li>
                        </ul>
                        <el-form key="form-goods" :disabled="readOnly" class="content">
                            <li class="row" v-for="(item,index) in form.productModels" :key="index">
                                <el-form-item>{{ item.id }}</el-form-item>
                                <el-form-item>{{ item.productName }}</el-form-item>
                                <el-form-item>{{ goodsTypes[item.productType] }}</el-form-item>
                                <el-form-item>
                                    <span v-if="item.productStatus === 2">上架</span>
                                    <span v-else-if="item.productStatus === 1">下架</span>
                                    <span v-else>删除</span>
                                </el-form-item>
                                <div class="specs" :style="{ '--rows': item.skuEntityList.length }">
                                    <template v-for="(ite,idx) in item.skuEntityList">
                                        <el-form-item :key="ite.productId + idx + '-sku'">
                                            {{ ite.skuCode1Name + ite.skuCode2Name }}
                                        </el-form-item>
                                        <el-form-item :key="ite.productId + idx + '-prices'">
                                            {{ ite.originPrice }}
                                        </el-form-item>
                                        <el-form-item :key="ite.productId + idx + '-price'">
                                            {{ ite.price === 0 ? '免费' : ite.price }}
                                        </el-form-item>
                                        <el-form-item :key="ite.productId + idx + '-activityPrice'">
                                            <el-input-number v-model="ite.activityPrice" :min="ite.price === 0 ? 0 : 0.01" :max="ite.price" />
                                        </el-form-item>
                                        <el-form-item prop="" :key="ite.productId + idx + '-activityStock'">
                                            <el-input-number v-model="ite.activityStock" :min="beforeActiviting ? 1 : ite.activityStockCopy" />
                                        </el-form-item>
                                        <el-form-item prop="" :key="ite.productId + idx + '-donationAmount'">
                                            <span style="font-size: 12px">每次购买均可捐赠公益金</span>
                                            <el-input-number v-model="ite.donationAmount" :min="0.01" />
                                        </el-form-item>
                                    </template>
                                </div>
                                <el-form-item>
                                    <el-button type="text" @click="form.productModels.splice(index,1)">
                                        移除
                                    </el-button>
                                </el-form-item>
                            </li>
                        </el-form>
                    </div>
                    <!-- 知识课程 -->
                    <div v-if="form.courseModels && form.courseModels.length" class="pruduct-container">
                        <ul class="header knowledge">
                            <li>商品ID</li>
                            <li>商品名称</li>
                            <li>类型</li>
                            <li>状态</li>
                            <li>原价（元）</li>
                            <li>价格（元）</li>
                            <li>活动价（元）</li>
                            <li>捐赠金额</li>
                            <li>操作</li>
                        </ul>
                        <el-form key="form-knowledge" :disabled="readOnly" class="content">
                            <li class="row knowledge" v-for="(item,index) in form.courseModels" :key="index">
                                <el-form-item>{{ item.id }}</el-form-item>
                                <el-form-item>{{ item.courseName }}</el-form-item>
                                <el-form-item> {{ item.courseType === 1 ? '单课程' : '系列课' }}</el-form-item>
                                <el-form-item>
                                    <span v-if="item.status === 1">上架</span>
                                    <span v-else-if="item.status === 2">下架</span>
                                    <span v-else>删除</span>
                                </el-form-item>
                                <el-form-item>
                                    {{ item.originPrice || item.originalPrice }}
                                </el-form-item>
                                <el-form-item>
                                    {{ item.price === 0 ? '免费' : item.price }}
                                </el-form-item>
                                <el-form-item>
                                    <el-input-number :min="item.price === 0 ? 0 : 0.01" :max="item.price" v-model="item.activityPrice" />
                                </el-form-item>
                                <el-form-item>
                                    <el-input-number :min="0.01" v-model="item.donationAmount" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="text" @click="form.courseModels.splice(index,1)">
                                        移除
                                    </el-button>
                                </el-form-item>
                            </li>
                        </el-form>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="初始公益金额" prop="initAmount">
          <el-input-number
            style="width: 160px"
            :min="(!beforeActiviting && form.initAmountCopy) || 0"
            v-model.number="form.initAmount"
          />
          元
        </el-form-item> -->
                <el-form-item label="捐赠冲顶金额" prop="topAmount">
                    <el-input-number
                        style="width: 160px"
                        :min="(!beforeActiviting && form.topAmountCopy) || 0.01"
                        v-model.number="form.topAmount"
                    />
                    元
                    <span class="remark">（捐赠冲顶金额即为目标捐赠金额）</span>
                </el-form-item>
                <el-form-item label="品牌曝光" prop="logoShow">
                    <el-checkbox v-model="form.logoShow">
                        展示品牌 logo
                    </el-checkbox>
                    <span class="remark">（勾选品牌 logo 将在海报中显示，不勾选则不显示）</span>
                    <div v-if="form.logoShow">
                        <UploadImage
                            need-edit
                            :width="300"
                            :height="300"
                            :size="2"
                            :count="1"
                            v-model="logoUrl"
                            upload-text="上传logo图"
                        />
                        <span style="color:#999">只支持.jpg .png 格式，最多上传1张，大小为2M以内</span>
                    </div>
                </el-form-item>
            </el-form>
            <div v-if="!readOnly" class="btn-box">
                <el-button size="mini" plain style="width: 90px" @click="cancle">
                    取消
                </el-button>
                <el-button size="mini" type="primary" plain @click="save(2)">
                    保存
                </el-button>
                <el-button size="mini" plain style="width: 90px; margin-left: 20px" @click="showPreview = true">
                    预览
                </el-button>
            </div>
        </div>

        <!-- 预览组件 -->
        <Preview :show.sync="showPreview">
            <img style="width: 100%" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/公益助力预览.png" alt="">
        </Preview>

        <!-- 选择商品 -->
        <ProductCheckbox
            :visible.sync="showSelectProduct"
            :max-select-num="maxPublicGoodsNum - form.courseModels.length"
            :default-list="form.productModels"
            @confirm="selectProducts"
        />
        <!-- 选择知识课程 -->
        <KnowledgeProduct
            :visible.sync="showSelectKnowledge"
            :max-select-num="maxPublicGoodsNum - form.productModels.length"
            :default-list="form.courseModels"
            @confirm="selectKnowledge"
        />
    </div>
</template>
<script>
import Preview from '../../../../../components/common/Preview'
import ProductCheckbox from '../components/Product-Checkbox'
import KnowledgeProduct from '../components/Knowledge-Product'
import UploadImage from '../../../../../components/common/file/Image-Manager'
import { getTagList } from '../../../../../apis/member'
import { addPublicBenefit, updatePublicBenefit, getPublicBenefitDetail } from '../../../../../apis/marketing-manage/lonmen-festival/public-benefit'
import moment from 'moment'

export default {
    name: 'AddLongmenPublicBenefit',
    components: {
        Preview,
        ProductCheckbox,
        KnowledgeProduct,
        UploadImage
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        copy: {
            type: String,
            default: ''
        },
        readOnly: Boolean
    },
    data () {
        // 选择用户分组
        const checkTagIds = (rule, value, callBack) => {
            if (this.form.userScope === 3 && !value.length) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        // 选择活动时间
        const checkActivityTime = (rule, value, callBack) => {
            if (!this.form.startTime || !this.form.endTime) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        // 公益商品
        const checkPublicGoods = (rule, value, callBack) => {
            if ((this.form.productModels.length + this.form.courseModels.length) === 0) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        const checkLogoShow = (rule, value, callBack) => {
            if (value && !this.logoUrl.length) {
                callBack(new Error(rule.message))
            } else {
                callBack()
            }
        }
        return {
            showSelectProduct: false,
            showSelectKnowledge: false,
            // 是否显示预览
            showPreview: false,
            // 公益商品最大数量
            maxPublicGoodsNum: 30,
            goodsTypes: {
                PHYSICAL_GOODS: '实体商品',
                VIRTUAL_GOODS: '虚拟商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课'
            },
            userGroup: [],
            logoUrl: [],
            form: {
                // 1未开始，2进行中，3已过期，4已结束
                definiteStatus: 1,
                activityName: '',
                activityDesc:
`1.任何注册用户均可参与公益行动的活动；
2.填写购买下单基本信息，完成线上支付即可参与公益活动，捐献相应的公益金额；
3.每个用户可购买任一参与公益活动的商品，用户捐献的公益金额将累加，每个账号不限制参与公益活动的次数；
4.可将公益行动的活动分享给好友，邀请好友一起参与公益活动，贡献自己的一份力量；
5.本次活动所获得的所有公益金，将由机构在活动结束后，统一进行公益捐赠。`,
                userScope: 0,
                tagIds: [],
                startTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(Date.now() + (1000 * 60 * 60 * 24)).format('YYYY-MM-DD HH:mm:ss'),
                productModels: [],
                courseModels: [],
                initAmount: 0,
                topAmount: 0.01,
                logoShow: false,
                logoUrl: ''
            },
            rules: {
                activityName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                activityDesc: [
                    { required: true, message: '活动细则不能为空', trigger: 'blur' }
                ],
                tagIds: [
                    { validator: checkTagIds, message: '请至少选择一个用户分组' }
                ],
                startTime: [
                    { required: true, message: '请选择活动时间', trigger: 'blur' },
                    { validator: checkActivityTime, message: '请选择活动时间', trigger: 'blur' }
                ],
                productModels: [
                    { validator: checkPublicGoods, message: '请至少选择一个公益商品' }
                ],
                logoShow: [
                    { validator: checkLogoShow, message: '请选择 logo' }
                ]
            }
        }
    },
    async created () {
        try {
            await this.getTagList()
            if (this.id) {
                await this.getDetail()
            }
        } catch (e) { throw e }
    },
    methods: {
    // 获得用户分组标签和活动标签列表
        async getTagList () {
            try {
                const { result } = await getTagList()
                this.userGroup = result || []
            } catch (e) { throw e }
        },
        formatGetProductModels (productModels) {
            const obj = {}
            for (const item of productModels) {
                obj[item.productId] = ''
            }
            return Object.keys(obj).map(key => {
                let skuEntityList = productModels.filter(({ productId }) => productId === key)
                skuEntityList = skuEntityList.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    productType: item.productType,
                    productStatus: item.productStatus,
                    skuCode1: item.sku1,
                    skuCode2: item.sku2,
                    skuCode1Name: item.sku1Name,
                    skuCode2Name: item.sku2Name,
                    originPrice: item.originPrice,
                    price: item.price,
                    activityPrice: item.activityPrice,
                    activityStock: item.activityStock,
                    activityStockCopy: item.activityStock,
                    donationAmount: item.donationAmount
                }))
                return {
                    id: skuEntityList[0].productId,
                    productName: skuEntityList[0].productName,
                    productType: skuEntityList[0].productType,
                    productStatus: skuEntityList[0].productStatus,
                    skuEntityList
                }
            })
        },
        async getDetail () {
            try {
                const { result } = await getPublicBenefitDetail(this.id)
                if (this.copy) result.definiteStatus = 1
                this.logoUrl = result.logoUrl ? [result.logoUrl] : []
                result.initAmountCopy = result.initAmount
                result.topAmountCopy = result.topAmount
                result.productModels = this.formatGetProductModels(result.productModels)
                result.courseModels = result.courseModels.map(item => ({ ...item, id: item.productId, status: Number(item.courseStatus) }))
                this.form = result
            } catch (e) { throw e }
        },
        dateChange ({ start, end }) {
            this.form.startTime = start || ''
            this.form.endTime = end || ''
        },
        selectProducts (list) {
            for (const item of list) {
                if (item.skuEntityList && item.skuEntityList.length) {
                    const parent = this.form.productModels.find(({ id }) => id === item.id)
                    for (const it of item.skuEntityList) {
                        const child = parent && parent.skuEntityList.find(({ skuCode1, skuCode2 }) => (skuCode1 === it.skuCode1 && skuCode2 === it.skuCode2))
                        if (child) {
                            it.activityPrice = child.activityPrice
                            it.donationAmount = child.donationAmount
                            it.activityStock = child.activityStock
                            it.activityStockCopy = child.activityStockCopy || 1
                        } else {
                            it.activityPrice = it.price
                            it.donationAmount = 0.01
                            it.activityStock = 1
                        }
                    }
                }
            }
            this.form.productModels = list
        },
        selectKnowledge (list) {
            for (const item of list) {
                const it = this.form.courseModels.find(({ id }) => id === item.id)
                if (it) {
                    item.activityPrice = it.activityPrice
                    item.donationAmount = it.donationAmount
                    item.price = it.price
                    item.status = Number(it.status)
                } else {
                    item.activityPrice = item.sellingPrice
                    item.donationAmount = 0.01
                    item.price = item.sellingPrice
                    item.status = Number(item.status)
                }
            }
            this.form.courseModels = list
        },
        formatProductModels () {
            return this.form.productModels.map(item => item.skuEntityList.map(it => ({
                productId: it.productId,
                sku1: it.skuCode1,
                sku2: it.skuCode2,
                activityPrice: it.activityPrice,
                activityStock: it.activityStock,
                donationAmount: it.donationAmount
            }))).reduce((pre, current) => pre.concat(current), [])
        },
        formatCourseModels () {
            return this.form.courseModels.map(item => ({
                productId: item.id,
                activityPrice: item.activityPrice,
                donationAmount: item.donationAmount
            }))
        },
        async save () {
            try {
                await this.$refs.form.validate()
                const form = this.form
                if (form.userScope !== 3) {
                    form.tagIds = []
                }
                const data = {
                    activityName: form.activityName,
                    activityDesc: form.activityDesc,
                    userScope: form.userScope,
                    tagIds: form.tagIds,
                    startTime: form.startTime,
                    endTime: form.endTime,
                    initAmount: form.initAmount,
                    topAmount: form.topAmount,
                    logoShow: form.logoShow,
                    logoUrl: form.logoShow ? this.logoUrl[0] : '',
                    productModels: this.formatProductModels(),
                    courseModels: this.formatCourseModels()
                }
                if (!this.id || this.copy) {
                    await addPublicBenefit(data)
                    this.$success('新增成功')
                } else {
                    await updatePublicBenefit({ activityId: this.id, data })
                    this.$success('修改成功')
                }
                this.$router.push({ name: 'LongmenPublicBenefitList' })
            } catch (e) { throw e }
        },
        cancle () {
            this.$router.push({ name: 'LongmenPublicBenefitList' })
        }
    },
    computed: {
        dateTime () {
            return [this.form.startTime, this.form.endTime]
        },
        beforeActiviting () {
            // 1未开始，2进行中，3已过期，4已结束
            return this.form.definiteStatus === 1
        },
        publicGoodsNum () {
            return (this.form.productModels.length + this.form.courseModels.length) || 0
        }
    },
    beforeRouteLeave (to, from, next) {
        this.isShowEditor = false
        if (to.name !== 'LongmenPublicBenefitList') {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                next()
            })
        } else {
            next()
        }
    }
}
</script>

<style lang="scss" scoped>

.add-content {
    background-color: #fff;
    > .content-title {
        padding-bottom: 24px;
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }
    .remark {
        color: #999;
        font-size: 14px;
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
    .pruduct-container {
        display: inline-block;
        max-width: 100%;
        overflow-x: auto;
        margin-top: 20px;
        border: 1px solid #ebeef5;
        > .header {
            display: grid;
            grid-template-columns: repeat(4, 100px) repeat(6, 150px) 100px;
            background-color: #f7f8fc;
            text-align: center;
            > li {
                display: inline-grid;
                border-top: 1px solid #ebeef5;
                border-right: 1px solid #ebeef5;
            }
        }
        > .content {
            text-align: center;
            > .row {
                display: grid;
                grid-template-columns: repeat(4, 100px) 900px 100px;
                border-top: 1px solid #ebeef5;
                .el-form-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    box-sizing: border-box;
                    border-right: 1px solid #ebeef5;
                    border-bottom: 1px solid #ebeef5;
                    margin-bottom: 0;
                }
                &:hover {
                    background-color: #eef7ff;
                }
                > .specs {
                    display: grid;
                    grid-template-rows: repeat(var(--rows), auto);
                    grid-template-columns: repeat(6, 150px);
                }
            }
        }
        .knowledge {
            grid-template-columns: 250px 250px repeat(3, 100px) repeat(4, 150px) !important;
        }
    }
    > .btn-box {
        margin-top: 40px;
    }
}

</style>
