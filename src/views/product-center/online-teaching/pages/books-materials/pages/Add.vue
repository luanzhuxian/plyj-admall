<template>
    <div class="add-Books-Materials">
        <div class="add-content">
            <div class="content-title">
                基本信息
            </div>
            <el-form
                label-width="170px"
                ref="form"
                :model="form"
                :rules="rules"
                label-position="left"
                class="main-form"
            >
                <el-form-item
                    label="图文名称"
                    prop="graphicName"
                >
                    <el-input
                        style="width: 320px"
                        v-model="form.graphicName"
                        maxlength="20"
                        placeholder="请输入图文名称"
                    />
                    <span class="description">
                        (至多可输入20字的名称)
                    </span>
                </el-form-item>
                <el-form-item
                    label="封面图"
                    prop="graphicImgs"
                >
                    <UploadImage
                        ref="UploadImage"
                        v-model="form.graphicImgs"
                        :width="750"
                        :height="500"
                        :box-width="100"
                        :box-height="67"
                        :size="2"
                        :count="10"
                        upload-text="上传图片"
                        need-edit
                        multiple
                    />
                    <p style="font-size: 12px; color: #999;line-height: 24px">
                        （支持png、jpeg、jpg格式的图片，建议尺寸为750*500，图片最大不能超过2M）
                    </p>
                    <MainImageTheme
                        v-if="form.graphicImgs.length"
                        @confirm="themeConfirmHandler"
                        @cancel="themeConfirmHandler"
                        :product-image="form.graphicImgs"
                        :default-theme="form.themeModel"
                        :product-main-image="form.graphicMainImg"
                        ref="MainImageTheme"
                    />
                </el-form-item>
                <el-form-item
                    prop="targetGroups"
                    label="观看对象"
                >
                    <el-radio-group
                        v-model="form.targetGroups"
                    >
                        <el-radio
                            :label="0"
                        >
                            全部用户
                        </el-radio>
                        <el-radio
                            :label="1"
                        >
                            Helper可用
                        </el-radio>
                        <el-radio
                            :label="2"
                        >
                            普通会员
                        </el-radio>
                        <el-radio
                            :label="3"
                        >
                            部分用户组可用
                        </el-radio>
                    </el-radio-group>
                    <UserGroup
                        v-show="form.targetGroups === 3"
                        v-model="form.tagIds"
                        @init="userGroupInit"
                    />
                </el-form-item>
                <el-form-item
                    label="上传资料"
                    prop="graphicPdfs"
                >
                    <div class="flex">
                        <pdf-manager v-model="form.graphicPdfs" />
                        <span class="description">
                            （每个图文资料可最多上传20个pdf文件，单个文件大小限制10MB以内）
                        </span>
                    </div>
                </el-form-item>
                <el-form-item
                    label="图文简介"
                    prop="graphicBrief"
                >
                    <el-input
                        type="textarea"
                        placeholder="请填写图文简介"
                        v-model="form.graphicBrief"
                        maxlength="50"
                        style="width: 420px;"
                        :rows="5"
                        resize="none"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item
                    label="作者"
                    prop="author"
                >
                    <el-input
                        style="width: 200px"
                        v-model="form.author"
                        maxlength="20"
                        placeholder="请输入作者姓名"
                    />
                </el-form-item>
                <el-form-item
                    label="图文价格"
                >
                    <div>
                        <el-radio-group
                            :disabled="Boolean(id)"
                            v-model="form.priceType"
                        >
                            <el-radio
                                :label="1"
                            >
                                付费
                            </el-radio>
                            <el-radio
                                :label="0"
                            >
                                免费
                            </el-radio>
                        </el-radio-group>
                        <div
                            v-if="form.priceType === 1"
                            class="flex mar-t20"
                        >
                            <el-form-item prop="sellingPrice">
                                <div class="class-price-label">
                                    图文售价
                                    <span class="red">
                                        *
                                    </span>
                                </div>
                                <el-input
                                    style="width: 160px"
                                    type="number"
                                    @change="checkSellingPrice()"
                                    v-model="form.sellingPrice"
                                    placeholder="请输入图文售价"
                                />
                            </el-form-item>
                        </div>
                        <div :class="{'mar-t20': form.priceType === 0}">
                            <el-form-item>
                                <div class="class-price-label">
                                    图文原价
                                </div>
                                <el-input
                                    style="width: 160px"
                                    type="number"
                                    @change="checkOriginalPrice()"
                                    v-model="form.originalPrice"
                                    placeholder="请输入图文原价"
                                />
                                <span class="description">
                                    （不填写则不显示图文原价信息）
                                </span>
                            </el-form-item>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="定时开售" prop="isOpenSale">
                    <div>
                        <el-checkbox v-model="form.isOpenSale" :true-label="1" :false-label="0">
                            设置定时售卖时间
                        </el-checkbox>
                    </div>
                    <div class="mar-t20" v-if="form.isOpenSale">
                        <el-date-picker
                            v-model="form.regularSaleTime"
                            :picker-options="startPickerOptions"
                            type="datetime"
                            placeholder="定时售卖时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                            :editable="false"
                        />
                    </div>
                </el-form-item>

                <el-form-item label="隐藏商品" prop="isShow">
                    <el-checkbox v-model="form.isShow" :true-label="0" :false-label="1">
                        上架的商品设置隐藏后，在店铺不显示，但可以通过链接的方式访问
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="分类" prop="category1">
                    <SelectCategory v-model="category" show-add :category-type="3" @change="categoryChange" />
                </el-form-item>
                <el-form-item
                    label="图文详情介绍"
                    prop="details"
                >
                    <PlEditor v-model="form.details" />
                </el-form-item>
                <el-form-item
                    label="订购须知"
                    prop="payNotice"
                >
                    <el-input
                        type="textarea"
                        placeholder="请填写资料简介"
                        v-model="form.payNotice"
                        maxlength="300"
                        style="width: 800px;"
                        :rows="8"
                        resize="none"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item
                    label="订购量是否显示"
                    prop="showSales"
                >
                    <el-radio-group v-model="form.showSales">
                        <div class="use-limit">
                            <el-radio :label="1">
                                显示<span class="purchase-sort-description"> （显示则在C端详情页显示订购量）</span>
                            </el-radio>
                            <el-radio :label="0">
                                隐藏<span class="purchase-sort-description"> （隐藏则C端详情页中不显示订购量）</span>
                            </el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button
                    @click="$router.back()"
                    style="width: 90px"
                    plain
                    round
                >
                    取消
                </el-button>
                <el-button
                    @click="save(2)"
                    type="primary"
                    style="width: 90px"
                    plain
                    round
                >
                    保存
                </el-button>
                <el-button
                    @click="save(1)"
                    type="primary"
                    plain
                    round
                >
                    保存并上架
                </el-button>
                <el-button
                    @click="preview()"
                    style="width: 90px"
                    plain
                    round
                >
                    预览
                </el-button>
            </div>
        </div>
        <BooksMaterialsPreview :show.sync="showPreview" :data="form" />
    </div>
</template>
<script>

import UploadImage from './../../../../../../components/common/file/Image-Manager.vue'
import PdfManager from './../../../../../../components/common/file/Pdf-Manager.vue'
import PlEditor from './../../../../../../components/common/Pl-Editor.vue'
import SelectCategory from './../../../../../../components/product-center/category-manage/Select-Category.vue'
import UserGroup from './../../../../../../components/common/User-Group.vue'
import MainImageTheme from '../../../../../../components/product-center/goods/Main-Image-Theme.vue'
import BooksMaterialsPreview from './../components/Books-Materials-Preview'
import { isMoney } from '../../../../../../assets/ts/validate'
import { addBooksMaterials, getBooksDetail, modifyBooksMaterials } from './../../../../../../apis/product-center/online-teaching/books-materials'
import moment from 'moment'
export default {
    name: 'BooksMaterialsAdd',
    components: {
        UploadImage,
        PlEditor,
        SelectCategory,
        PdfManager,
        UserGroup,
        MainImageTheme,
        BooksMaterialsPreview
    },
    data () {
        const validateTargetGroups = (rule, value, callback) => {
            if (value === 3 && !this.form.tagIds.length) return callback(new Error('请选择部分用户分组'))
            callback()
        }
        const validategraphicImgs = (rule, value, callback) => {
            if (!value.length) return callback(new Error('请选择封面图'))
            if (value.length > 10) return callback(new Error('封面图最多10个'))
            callback()
        }
        const validateGraphicPdfs = (rule, value, callback) => {
            if (!value.length) return callback(new Error('请选择资源'))
            if (value.length > 20) return callback(new Error('图文资料最多20个'))
            callback()
        }
        const sellingPrice = (rule, value, callback) => {
            if (this.form.priceType) {
                if (!value) return callback(new Error('售价不能为空或者不是金额格式数字'))
                if (value < 0 || value === '0' || value === 0) return callback(new Error('售价必须大于0'))
                if (!isMoney(value)) return callback(new Error('请输入包含小数点后两位的金额格式'))
                // if (!this.form.originalPrice) return callback(new Error('原价不能为空或者不是金额格式数字'))
                if (this.form.originalPrice < 0 || this.form.originalPrice === 0 || this.form.originalPrice === '0') return callback(new Error('原价必须大于0'))
                if (this.form.originalPrice && !isMoney(this.form.originalPrice)) return callback(new Error('请输入包含小数点后两位的金额格式'))
                if (Number(value) > 100000) return callback(new Error('售价超出最大限额99999.99'))
                if (Number(this.form.originalPrice) > 100000) return callback(new Error('原价超出最大限额99999.99'))
                if (this.form.originalPrice && Number(this.form.originalPrice) < value) return callback(new Error('原价不能小于售价'))
                callback()
            } else {
                if (this.form.originalPrice === '') {
                    return callback()
                }
                if (this.form.originalPrice < 0 || this.form.originalPrice === 0 || this.form.originalPrice === '0') return callback(new Error('原价必须大于0'))
                if (Number(this.form.originalPrice) > 100000) return callback(new Error('原价超出最大限额99999.99'))
                callback()
            }
        }
        const validateIsOpenSale = (rule, value, callback) => {
            if (value && !this.form.regularSaleTime) return callback(new Error('请选择定时售卖时间'))
            if (value && this.form.regularSaleTime && moment().valueOf() > moment(this.form.regularSaleTime).valueOf()) {
                return callback(new Error('定时售卖时间必须大于当前时间'))
            }
            callback()
        }
        return {
            startPickerOptions: {
                disabledDate: time => time.getTime() < Date.now() - 8.64e7
            },
            showPreview: false,
            briefEdit: 0,
            category: [],
            form: {
                status: '',
                graphicName: '',
                graphicImgs: [],
                themeModel: null,
                graphicMainImg: '',
                graphicPdfs: [],
                graphicBrief: '',
                // 观看对象
                targetGroups: 0,
                tagIds: [],
                author: '',
                // 价格
                priceType: 1,
                sellingPrice: '',
                originalPrice: '',
                // 定时开售
                isOpenSale: '',
                // C端显示隐藏
                isShow: 1,
                regularSaleTime: '',
                category1: '',
                category2: '',
                payNotice:
          '1、订购图文资料，并支付成功时，您可以随时阅读学习； \n' +
          '2、如果您在阅读学习时候，出现无法显示内容等问题，请及时联系机构客服人员； \n' +
          '3、图文资料的内容的最终解释权归机构所有。',
                details: '',
                showSales: 1
            },
            // 用户分组
            userTagList: [],
            // pdf列表
            fileList: [],
            // 选择图片
            courseImgArray: [],
            // 选择资源
            showSelectResource: false,
            rules: {
                graphicName: [
                    { required: true, message: '图文名称不能为空', trigger: 'blur' },
                    { max: 20, message: '图文名称不能超过20个字符', trigger: 'blur' }
                ],
                graphicImgs: [
                    { required: true, validator: validategraphicImgs, trigger: 'blur' }
                ],
                targetGroups: [
                    { trigger: 'blur', validator: validateTargetGroups }
                ],
                graphicPdfs: [
                    { required: true, trigger: 'blur', validator: validateGraphicPdfs }
                ],
                graphicBrief: [
                    { required: true, message: '图文简介不能为空', trigger: 'blur' },
                    { max: 50, message: '图文简介不能超过50个字符', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '作者姓名不能为空', trigger: 'blur' },
                    { max: 20, message: '作者姓名不能超过50个字符', trigger: 'blur' }
                ],
                sellingPrice: [
                    { required: true, validator: sellingPrice, trigger: 'blur' }
                ],
                isOpenSale: [
                    { trigger: 'blur', validator: validateIsOpenSale }
                ],
                category1: [
                    { required: true, message: '分类不能为空', trigger: 'blur' }
                ],
                payNotice: [
                    { required: true, message: '订购须知不能为空', trigger: 'blur' },
                    { max: 300, message: '订购须知不能超过300个字符', trigger: 'blur' }
                ],
                showSales: [
                    { required: true, trigger: 'blur' }
                ],
                details: [
                    { required: true, trigger: 'blur', message: '图文详情不能为空' }
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
    async created () {
        try {
            if (this.id) await this.init()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async init () {
            const { result } = await getBooksDetail(this.id)
            const {
                status,
                graphicName,
                graphicImgs,
                themeModel,
                graphicMainImg,
                graphicPdfs,
                graphicBrief,
                // 观看对象
                targetGroups,
                tagIds,
                author,
                priceType,
                sellingPrice,
                originalPrice,
                // 定时开售
                isOpenSale,
                regularSaleTime,
                isShow,
                category1,
                category2,
                payNotice,
                details,
                showSales
            } = result
            this.category = [category1, category2]
            const form = {
                status,
                graphicName,
                graphicImgs: graphicImgs || [],
                themeModel: themeModel || null,
                graphicMainImg,
                graphicPdfs: graphicPdfs || [],
                graphicBrief,
                targetGroups,
                tagIds,
                author,
                priceType,
                sellingPrice,
                originalPrice,
                isOpenSale,
                regularSaleTime,
                isShow,
                category1,
                category2,
                payNotice,
                details,
                showSales
            }
            this.form = JSON.parse(JSON.stringify(form))
        },
        cancel () {
            this.$router.back()
        },
        async save (type) {
            try {
                await this.$refs.form.validate()
                this.form.graphicMainImg = await this.generateImage()
                this.form.status = type
                if (this.id) {
                    this.form.id = this.id
                    await modifyBooksMaterials(this.form)
                } else {
                    await addBooksMaterials(this.form)
                }
                await this.$success('操作成功')
                this.$router.back()
            } catch (e) {
                throw e
            }
        },
        async preview () {
            await this.$refs.form.validate()
            this.form.graphicMainImg = await this.generateImage()
            this.showPreview = true
        },
        // 生成主题图
        generateImage () {
            // 没有图片
            if (!this.form.graphicImgs.length) {
                this.$warning('请至少上传一张封面图')
                throw new Error('请至少上传一张封面图')
            }
            return this.$refs.MainImageTheme.generateImage()
        },
        // 修改主图主题
        themeConfirmHandler (data) {
            this.form.themeModel = data
        },

        /**
     * 初始化用户标签
     * @param userGroup {Array}
     */
        userGroupInit (userGroup) {
            this.userGroup = userGroup
        },
        categoryChange (val) {
            this.form.category1 = val[0] || ''
            this.form.category2 = val[1] || ''
        },
        checkOriginalPrice () {
            if (this.form.originalPrice && this.form.originalPrice.indexOf('.') > 0 && this.form.originalPrice.split('.')[1].length > 2) {
                this.form.originalPrice = Number(this.form.originalPrice).toFixed(2)
            }
        },
        checkSellingPrice () {
            if (this.form.sellingPrice && this.form.sellingPrice.indexOf('.') > 0 && this.form.sellingPrice.split('.')[1].length > 2) {
                this.form.sellingPrice = Number(this.form.sellingPrice).toFixed(2)
            }
        },
        clearData () { // 清除当前数据，还原到页面的初始数据
            this.$refs.form.clearValidate()
            this.form.sellingPrice = ''
            this.form.originalPrice = ''
            this.form.validity = ''
        }
    }
    // beforeRouteLeave (to, from, next) {
    //   if (to.name !== 'ClassResourceList' && to.name !== 'NewClassResource' && to.name !== 'OrgIndex') {
    //     this.$confirm({
    //       title: '确定离开该页面吗？',
    //       message: '请确定您所作的修改已经保存！'
    //     })
    //       .then(() => {
    //         this.clearData()
    //         next()
    //       })
    //   } else {
    //     next()
    //   }
    // }
}
</script>
<style lang="scss" scoped>
.add-Books-Materials {
    background-color: #f5f6f7;
    min-width: 700px;
    .description {
        margin-left: 20px;
        color: #999;
        font-size: 14px;
    }
    .font-12c {
        font-size: 12px;
        color: #ccc;
    }
    .red {
        color: #f56c6c;
    }

    .mar-t20 {
        margin-top: 20px;
    }

    .alink {
        color: #598bf8;
        font-size: 12px;
        text-decoration-line: underline;
    }
    .add-content {
        margin-top: 20px;
        margin-left: 80px;
        margin-right: 26px;
        background-color: #fff;
        .content-title {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            height: 60px;
            margin-top: 37px;
            padding-left: 30px;
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #e7e7e7;
            background-color: #fbfbfb;
        }
        .class-price-label {
            display: inline-flex;
            width: 80px;
            color: #666;
            font-size: 12px;
        }
        .use-limit {
            display: flex;
            justify-content: space-around;
            .purchase-sort-description {
                font-weight: 400;
                font-size: 14px;
                color: #999;
            }
        }
        .btn-box {
            margin-top: 50px;
            padding: 24px;
            padding-bottom: 80px;
            border-top: 1px solid #e7e7e7;
            .btn-description {
                padding-top: 24px;
                padding-bottom: 67px;

                > div {
                    padding-bottom: 10px;
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }
    .main-form {
        ::v-deep .el-form-item__label {
            padding-left: 30px !important;
        }
    }
}

</style>
