<template>
    <el-dialog
        class="edit-subset"
        :title="title"
        :visible="show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="700px"
        @close="close"
    >
        <el-form
            label-width="130px"
            :model="form"
            :rules="rules"
            ref="form"
        >
            <el-form-item
                label="上级分类"
                prop="parentCode"
            >
                <el-select
                    v-if="goodType === 0"
                    v-model.trim="form.parentCode"
                    placeholder="请选择上级分类"
                    :disabled="!data"
                    style="width: 250px;"
                >
                    <el-option
                        v-for="item of categoryTree"
                        :key="item.id"
                        :value="item.id"
                        :label="item.categoryName"
                        :disabled="!!item.childs && item.childs.length >= 6 || item.categoryName === '默认分类'"
                    >
                        <span style="float: left">{{ item.categoryName }}</span>
                        <span style="float: right; color: #a60b00; font-size: 13px">{{ !!item.childs && item.childs.length >= 6 ? '子分类数量已达到6个' : '' }}</span>
                    </el-option>
                </el-select>
                <span v-else-if="goodType === 1">知识课程</span>
                <span v-else-if="goodType === 2">系列课</span>
                <span v-else-if="goodType === 3">图文资料</span>
            </el-form-item>

            <el-form-item
                label="子分类名称"
                prop="categoryName"
            >
                <el-input
                    v-model.trim="form.categoryName"
                    placeholder="请输入6个汉字以内的分类名称"
                    style="width: 250px;"
                />
            </el-form-item>

            <el-form-item
                label="是否启用"
            >
                <el-switch
                    v-model="form.hidden"
                    active-text="显示"
                    :active-value="false"
                    :inactive-value="true"
                />
            </el-form-item>

            <el-form-item
                label="分类图标"
                prop="categoryPic"
            >
                <ImageManager
                    v-model="imgList"
                    :box-width="76"
                    :box-height="76"
                    :count="1"
                    need-edit
                    :width="76 * 2"
                    :height="76 * 2"
                    @change="imgSelected"
                />
                <div class="recommend-info">
                    <p>推荐图片尺寸为152*152像素，</p>
                    <p>仅支持jpeg，png，bmp 3种格式，大小不超过2.0MB</p>
                    <strong>推荐图标</strong>
                    <div class="recommend-imgs">
                        <img
                            class="recommend-img"
                            v-for="(image, i) of recommendList"
                            :key="i"
                            @click="selectDefaultImage(image)"
                            :src="image"
                        >
                    </div>
                </div>
            </el-form-item>
            <el-form-item label-width="0">
                <div style="text-align: center;">
                    <el-button @click="close" round>
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        round
                        @click="save"
                    >
                        保 存
                    </el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {
    updateCategory,
    addSubCategory,
    addCourseCategory,
    editCourseCategory
} from '../../../apis/product-center/category'
import { mapGetters } from 'vuex'
import { copyFields } from '../../../assets/ts/utils'
import { testCategory } from '../../../assets/ts/validate'
import ImageManager from '../../common/file/Image-Manager.vue'
import { MutationTypes } from '@/store/mutation-type'
// img/dJYBK2q9Q-BwZwChow-L2-1561685633037.jpeg
// img/JvgDShG6L-ftPtkve0-24SAFp3W-SR-1561685709971.jpeg
// http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/kegRQCKaj-ziNGAdBi-EPr-1561688756756.jpeg
export default {
    name: 'EditSubset',
    components: {
        ImageManager
    },
    data () {
        const checkName = (rule, value, callback) => {
            if (value === '默认分类') {
                callback(new Error(rule.message))
            } else {
                callback()
            }
        }
        return {
            form: {
                parentCode: '',
                categoryName: '',
                hidden: false,
                categoryPic: ''
            },
            mainCategory: [],
            imgList: [],
            recommendList: [
                'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/category/art-class.png',
                'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/category/commodity.png',
                'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/category/course.png',
                'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/category/cultural-course.png',
                'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/category/other.png',
                'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/category/yaji.png'
            ],
            rules: {
                parentCode: [{ required: true, message: '请选择上级分类', trigger: 'change' }],
                categoryName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { validator: testCategory(12), message: '建议中文、英文、数字且汉字长度不超过6，英文/数字长度不超过12', trigger: 'blur' },
                    { validator: checkName, message: '分类名称不能为“默认分类”', trigger: 'blur' }
                ],
                categoryPic: [
                    { required: true, message: '请上传图标', trigger: 'blur' }
                ]
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        parent: {
            type: Object,
            default () {
                return null
            }
        }
    },
    computed: {
        ...mapGetters({
            mallNumber: 'user/mallNumber',
            categoryTree: 'goods/categoryTree'
        }),
        title () {
            return this.data ? (this.data.id ? '编辑子分类' : '添加子分类') : '添加子分类'
        },
        // 0 商品 1 知识课程 2 系列课
        goodType () {
            return (this.data && Number(this.data.type)) || (this.parent && Number(this.parent.type)) || 0
        }
    },
    watch: {
        data (val) {
            if (val) {
                copyFields(this.form, val)
                this.imgList = val.categoryPic ? [val.categoryPic] : []
            } else {
                this.form = {
                    parentCode: '',
                    categoryName: '',
                    hidden: false,
                    categoryPic: ''
                }
            }
        },
        show (val) {
            if (val) {
                this.form.parentCode = (this.parent && this.parent.id) || ''
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
            }
        }
    },
    mounted () {
        this.form.parentCode = this.parentCode || ''
    },
    methods: {
        close () {
            this.form = {
                parentCode: '',
                categoryName: '',
                hidden: false,
                categoryPic: ''
            }
            this.$emit('close')
            this.$emit('update:show', false)
            this.$emit('update:data', null)
            this.$emit('update:parent', null)
        },
        async save () {
            let result
            try {
                await this.$refs.form.validate()
                if (this.data && this.data.id) {
                    // 编辑
                    if (this.goodType) {
                        // 编辑线上课子分类
                        delete this.form.mallId
                        delete this.form.sort
                        this.form.id = this.data.id;
                        ({ result } = await editCourseCategory(this.form))
                    } else {
                        // 编辑商品子分类
                        delete this.form.id
                        this.form.mallId = this.mallNumber
                        this.form.sort = 1;
                        ({ result } = await updateCategory(this.data.id, this.form))
                    }
                    this.$success('分类修改成功')
                } else {
                    if (this.goodType) {
                        // 添加线上课子分类
                        delete this.form.mallId
                        delete this.form.sort;
                        ({ result } = await addCourseCategory(this.form))
                    } else {
                        // 添加商品子分类
                        this.form.mallId = this.mallNumber
                        this.form.sort = 1;
                        ({ result } = await addSubCategory(this.form))
                    }
                    this.$success('分类添加成功')
                }
                this.close()
                // 刷新分类列表
                await this.$store.dispatch(`goods/${ MutationTypes.getClassifyTree }`, this.goodType ? 2 : 1)
                this.$emit('success', result)
            } catch (e) {
                throw e
            }
        },
        imgSelected (res) {
            this.form.categoryPic = res[0] || ''
        },
        selectDefaultImage (image) {
            this.form.categoryPic = image
            this.imgList = [image]
        }
    }
}
</script>

<style scoped lang="scss">
  .recommend-info {
    margin-top: 20px;
    margin-bottom: 20px;
    > p {
      line-height: 20px;
      font-size: 12px;
      color: #999;
    }
  }
  .recommend-imgs {
    display: flex;
    margin-top: 10px;
    .recommend-img {
      display: inline-block;
      margin-right: 10px;
      width: 70px;
      height: 70px;
      object-fit: contain;
    }
  }
</style>
