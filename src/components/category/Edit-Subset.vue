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
                <div class="img" v-if="form.categoryPic">
                    <img
                        v-viewer
                        :src="form.categoryPic"
                        alt=""
                    >
                    <div class="edit-box">
                        <pl-svg title="删除" width="16" name="icon-shanchu1" @click="removeImage" fill="#FFF" />
                    </div>
                </div>
                <ImageSelector :margin-left="0" v-else @change="imgSelected" />
                <div class="recommend-info">
                    <p>推荐图片尺寸为76*76像素，</p>
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
                    <el-button @click="close">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="save"
                    >
                        保 存
                    </el-button>
                </div>
            </el-form-item>
        </el-form>

        <EditImage
            v-if="show"
            :show.sync="showEditImage"
            :width="76"
            :height="76"
            :url="img"
            @success="successCut"
        />
    </el-dialog>
</template>

<script>
import {
// addSupCategory,
    updateCategory,
    addSubCategory,
    addCourseCategory,
    editCourseCategory
// addSubCategory,
// deleteCategory,
// setCategoryBatch,
// sortCategory
} from '../../apis/product-center/category'
import { mapGetters } from 'vuex'
import { copyFields } from '../../assets/ts/utils'
import { testCategory } from '../../assets/ts/validate'
import ImageSelector from '../file/File-Selector.vue'
import EditImage from '../file/Edit-Image.vue'
import {
    createObjectUrl,
    upload,
    deleteImage
} from '../../assets/ts/upload'
// img/dJYBK2q9Q-BwZwChow-L2-1561685633037.jpeg
// img/JvgDShG6L-ftPtkve0-24SAFp3W-SR-1561685709971.jpeg
// http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/kegRQCKaj-ziNGAdBi-EPr-1561688756756.jpeg
export default {
    name: 'EditSubset',
    components: {
        ImageSelector,
        EditImage
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
            showEditImage: false,
            imgKey: '', // 删除图片时使用
            type: 'file',
            form: {
                parentCode: '',
                categoryName: '',
                hidden: false,
                categoryPic: ''
            },
            img: '',
            mainCategory: [],
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
            },
            // 如果是在编辑分类，不要立即删除图片，防止出现错误
            // 当点击删除图片时，先保存起来，确定修改的时候，再正式删除
            willDelete: []
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
        ...mapGetters(['mallNumber']),
        ...mapGetters('goods', ['categoryTree']),
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
                this.imgKey = val.categoryPic || ''
            }
        },
        show (val) {
            if (!val) {
                this.imgKey = ''
                this.img = ''
                this.willDelete = []
            } else {
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
                        ({ data: { result } } = await editCourseCategory(this.form))
                    } else {
                        // 编辑商品子分类
                        delete this.form.id
                        this.form.mallId = this.mallNumber
                        this.form.sort = 1;
                        ({ data: { result } } = await updateCategory(this.data.id, this.form))
                    }
                    // 删除被替换的图片
                    if (this.willDelete.length > 0) deleteImage(this.willDelete, 'img')
                    this.$success('分类修改成功')
                } else {
                    if (this.goodType) {
                        // 添加线上课子分类
                        delete this.form.mallId
                        delete this.form.sort;
                        ({ data: { result } } = await addCourseCategory(this.form))
                    } else {
                        // 添加商品子分类
                        this.form.mallId = this.mallNumber
                        this.form.sort = 1;
                        ({ data: { result } } = await addSubCategory(this.form))
                    }
                    this.$success('分类添加成功')
                }
                this.close()
                // 刷新分类列表
                await this.$store.dispatch('GET_CLASSIFY_TREE', this.goodType ? 2 : 1)
                this.$emit('success', result)
            } catch (e) {
                throw e
            }
        },
        imgSelected (e) {
            const file = e.target.files[0]
            try {
                console.log('image type is: ', /jpg|png|jpeg|bmp/i.exec(file.type)[0])
            } catch (e) {
                this.$error('不允许的图片格式')
                throw new Error('不允许的图片格式')
            }
            this.img = createObjectUrl(file)
            this.showEditImage = true
            this.type = 'text'
            this.$nextTick(() => {
                this.type = 'file'
            })
        },
        selectDefaultImage (image) {
            if (this.form.categoryPic) {
                this.$warning('请先删除当前图标')
                return
            }
            this.form.categoryPic = image
        },
        async successCut (blob) {
            try {
                const res = await upload(blob)
                this.form.categoryPic = res.url
                this.imgKey = res.url
            } catch (e) {
                throw e
            }
        },
        async removeImage () {
            // 判断一下，别把默认图片删了！
            if (this.imgKey && this.form.categoryPic.indexOf(this.imgKey) > -1) {
                if (!this.data || !this.data.id) {
                    // 不是在编辑。真删
                    await deleteImage([this.imgKey], 'img')
                    this.img = ''
                    this.imgKey = ''
                } else {
                    // 是编辑，暂时存起来，保存的时候再删
                    this.willDelete.push(this.imgKey)
                }
            }
            this.form.categoryPic = ''
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
.img {
    display: flex;
    position: relative;
    margin-right: 18px;
    margin-bottom: 18px;
    width: max-content;
    min-width: 72px;
    height: max-content;
    overflow: hidden;
    border: 1px solid #e3e3e3;
    > img {
        width: 72px;
        height: 72px;
        object-fit: cover;
    }
    &:hover {
        .edit-box {
            transform: translateY(0);
        }
    }
}
.edit-box {
    position: absolute;
    bottom: 0;
    left: 0;
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 26px;
    transform: translateY(100%);
    transition: transform .2s linear;
    color: #fff;
    background-color: rgba(0,0,0,.7);
    &:after {
        position: absolute;
        left: 50%;
        content: '';
        width: 1px;
        height: 11px;
        background-color: #666;
    }
    > svg {
        flex: 1;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
    }
}

</style>
