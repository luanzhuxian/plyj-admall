<template>
    <el-dialog
        class="edit-main"
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
                label="主分类名称"
                prop="categoryName"
            >
                <el-input
                    style="width: 250px;"
                    v-model.trim="form.categoryName"
                    :disabled="Boolean(goodType)"
                    placeholder="请输入6个汉字以内的分类名称"
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
                label="分类banner"
                prop="categoryPic"
            >
                <div class="img" v-if="form.bannerPic">
                    <img
                        v-viewer
                        :src="form.bannerPic"
                        alt=""
                    >
                    <div class="edit-box">
                        <pl-svg width="16" name="icon-shanchu1" @click="removeImage" fill="#FFF" />
                    </div>
                </div>
                <ImageSelector :box-width="275" :box-height="90" :margin-left="0" v-else @change="imgSelected" />
                <div class="recommend-info">
                    <p>推荐图片尺寸为275*90像素，</p>
                    <p>仅支持jpeg，png，bmp 3种格式，大小不超过5.0MB</p>
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
            :width="275"
            :height="90"
            :url="img"
            @success="successCut"
        />
    </el-dialog>
</template>

<script>
import {
    updateCategory,
    addMainCategory,
    editCourseCategory,
    getCategoryList
} from '../../../apis/product-center/category'
import { testCategory } from '../../../assets/ts/validate'
import EditImage from '../../common/file/Edit-Image.vue'
import { mapGetters, mapActions } from 'vuex'
import { copyFields } from '../../../assets/ts/utils'
import ImageSelector from '../../common/file/File-Selector.vue'
import {
    createObjectUrl,
    upload,
    deleteImage
} from '../../../assets/ts/upload'
import { MutationTypes } from '@/store/mutation-type'
export default {
    name: 'EditMain',
    components: {
        EditImage,
        ImageSelector
    },
    data () {
        const checkName = (rule, value, callback) => {
            if (this.goodType) {
                callback()
                return
            }
            if (value === '默认分类') {
                callback(new Error('分类名称不能为“默认分类”'))
                return
            }
            if (value === '知识课程') {
                callback(new Error('分类名称不能为“知识课程”'))
                return
            }
            if (value === '系列课') {
                callback(new Error('分类名称不能为“系列课”'))
                return
            }
            if (value === '图文资料') {
                callback(new Error('分类名称不能为“图文资料”'))
                return
            }
            callback()
        }
        return {
            form: {
                categoryName: '',
                mallId: '',
                sort: 1,
                hidden: false,
                bannerPic: ''
            },
            showEditImage: false,
            img: '',
            type: 'file',
            // 用与删除图片
            imgKey: '',
            mainCategory: [],
            rules: {
                categoryName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { validator: testCategory(12), message: '建议输入中文、英文、数字且汉字长度不超过6，英文/数字长度不超过12', trigger: 'blur' },
                    { validator: checkName, trigger: 'blur' }
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
                return null
            }
        }
    },
    computed: {
        ...mapGetters({
            mallNumber: 'user/mallNumber'
        }),
        title () {
            return this.data ? (this.data.id ? '编辑主分类' : '添加主分类') : '添加主分类'
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
                this.imgKey = val.bannerPic || ''
            }
        }
    },
    created () {
        this.getMainCategory()
    },
    mounted () {
        copyFields(this.form, this.data)
    },
    methods: {
        ...mapActions({
            getClassifyTree: `goods/${ MutationTypes.getClassifyTree }`
        }),
        close () {
            this.form = {
                categoryName: '',
                mallId: '',
                sort: 1,
                hidden: false,
                bannerPic: ''
            }
            this.imgKey = ''
            this.img = ''
            this.willDelete = []
            this.$refs.form.clearValidate()
            this.$emit('close')
            this.$emit('update:show', false)
            this.$emit('update:data', null)
        },
        async getMainCategory () {
            try {
                const data = await getCategoryList(this.mallNumber, 0)
                this.mainCategory = data.result
            } catch (e) {
                throw e
            }
        },
        async save () {
            this.form.mallId = this.mallNumber
            try {
                await this.$refs.form.validate()
                let result
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
                    // 删除被替换的图片
                    if (this.willDelete.length > 0) deleteImage(this.willDelete, 'img')
                    this.$success('分类修改成功')
                } else {
                    // 添加
                    ({ result } = await addMainCategory(this.form))
                    this.$success('分类添加成功')
                }
                this.close()
                await this.getClassifyTree(this.goodType ? 2 : 1)
                this.$emit('success', result)
            } catch (e) {
                throw e
            }
        },
        imgSelected (e) {
            const file = e.target.files[0]
            try {
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
        async successCut (blob) {
            try {
                const res = await upload(blob)
                this.form.bannerPic = res.url
                this.imgKey = res.url
            } catch (e) {
                throw e
            }
        },
        async removeImage () {
            this.form.bannerPic = ''
            if (!this.data || !this.data.id) {
                // 不是编辑。真删
                await deleteImage([this.imgKey], 'img')
                this.img = ''
                this.imgKey = ''
            } else {
                // 是编辑，暂时存起来，保存的时候再删
                this.willDelete.push(this.imgKey)
            }
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
      margin-left: 10px;
      width: 60px;
      height: 60px;
      object-fit: cover;
    }
  }
  .img {
    position: relative;
    display: flex;
    margin-bottom: 18px;
    width: max-content;
    height: max-content !important;
    overflow: hidden;
    > img {
      width: 275px;
      height: 90px;
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
    background-color: rgba(0,0,0,0.7);
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
  .add-image {
    display: block;
    width: 130px;
    height: 130px;
    border: 1px solid #e7e7e7;
    cursor: pointer;
  }
</style>
