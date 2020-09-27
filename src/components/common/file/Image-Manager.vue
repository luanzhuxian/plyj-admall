<template>
    <div class="pl-image-upload">
        <Draggable
            v-if="showList"
            class="image-list"
            :list="list"
            tag="ul"
            animation="200"
            ghost-class="ghost"
            :disabled="disabledDraggable || list.length === 1"
            @start="dragStart"
            @end="dragEnd"
            :style="{
                '--width': boxWidth + 'px',
                '--height': boxHeight + 'px',
                '--grid-count': list.length,
                '--border-radius': borderRadius + 'px'
            }"
        >
            <template v-for="(img, i) of list || []">
                <li
                    class="image-item"
                    :key="i"
                    v-if="img"
                >
                    <div class="image-item-content">
                        <img
                            v-viewer
                            v-img-error
                            :src="img"
                        >
                        <div class="edit-box" v-if="showControl">
                            <i class="el-icon-delete fz-16 pointer" style="color: #fff;" @click.stop="removeLocal(img)" />
                            <i v-if="!hideEditBtn" class="el-icon-edit fz-16 pointer" style="color: #fff;" @click.stop="edit(i)" />
                        </div>
                    </div>
                    <div class="image-item-bottom">
                        <slot name="image-item-bottom" :$index="i" :$img="img" />
                    </div>
                </li>
            </template>

            <ImageSelector
                v-if="list.length < count && showSelector || !count"
                :box-height="boxHeight"
                :box-width="boxWidth"
                :border-radius="borderRadius"
                :list-length="list.length"
                :margin-left="list.length ? 20 : 0"
                :upload-text="uploadText"
                @change="fileChange"
                :accept="imageAccept"
                :multiple="multiple"
                ref="imageSelector"
            />
        </Draggable>
        <EditImage
            :show.sync="showEdit"
            :url.sync="editImgUrl"
            :width="width"
            :height="height"
            :forced.sync="forcedEdit"
            @success="cutSuccess"
            :upload-text="uploadText"
        />

        <el-dialog
            title="上传结果"
            :visible.sync="showUploadBox"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="764px"
            :show-close="false"
            center
        >
            <el-table :data="fileList">
                <el-table-column label="文件" width="60">
                    <template #default="{row}">
                        <pl-svg
                            v-if="row.type.indexOf('image/') > -1"
                            name="icon-image"
                            width="26"
                            height="30"
                        />
                        <pl-svg
                            v-if="row.type.indexOf('video/') > -1"
                            name="icon-video"
                            width="26"
                            height="30"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" />
                <el-table-column label="大小" width="200">
                    <template #default="{row}">
                        <span>
                            <i v-text="row.current || 0" />
                            /
                            <i v-if="row.type.indexOf('image/') > -1" v-text="(row.size / 1024).toFixed(2) + 'KB'" />
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="120">
                    <template #default="{row}">
                        <span v-if="row.progress < 1 && !row.error" class="loading">上传中...</span>
                        <span v-if="row.progress === 1 && !row.error">
                            <pl-svg style="vertical-align: -3px;" v-if="row.progress === 1 && !row.error" name="icon-success" width="14" />
                            上传成功
                        </span>
                        <span v-if="row.error">
                            <pl-svg style="vertical-align: -3px;" v-if="row.progress === 1 && !row.error" name="icon-shibai" fill="red" width="14" />
                            上传失败
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 32px; text-align: center;">
                <el-button @click="cancel" :disabled="uploading">
                    取 消
                </el-button>
                <el-button type="primary" @click="confirm" :disabled="uploading">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 用于手动上传 -->
        <ImageSelector
            v-show="false"
            :box-height="boxHeight"
            :box-width="boxWidth"
            :border-radius="borderRadius"
            :list-length="list.length"
            :margin-left="0"
            :upload-text="uploadText"
            @change="fileChange"
            :accept="imageAccept"
            :multiple="multiple"
            ref="imageSelector2"
        />
    </div>
</template>

<script>
import { compress, upload, deleteImage, createObjectUrl } from '../../../assets/ts/upload'
import ImageSelector from './File-Selector.vue'
import EditImage from './Edit-Image.vue'
import Draggable from '../draggable'
export default {
    name: 'PlUploadImage',
    components: {
        ImageSelector,
        EditImage,
        Draggable
    },
    data () {
        return {
            Input: null,
            show: false,
            showUploadBox: false,
            showManageBox: false,
            showEdit: false,
            forcedEdit: false,
            uploading: false,
            playedVideo: '',
            localList: [],
            fileList: [],
            editImgUrl: '',
            imageAccept: 'image/jpg, image/jpeg, image/png, image/bmp'
        }
    },
    model: {
        prop: 'list',
        event: 'change'
    },
    props: {

        /*
         * 用来显示已上传的图片，如果你需要此组件内置的图片列表，那么你必须传入此参数
         * 格式：['src1', 'src2']
         * */
        list: {
            type: [String, Array],
            default () {
                return []
            }
        },
        // 是否禁用拖拽
        disabledDraggable: Boolean,

        /*
      * 有时候，你可能并不需要组件内置的图片显示列表，你可能在外部自己维护了一个图片显示的列表
      * 这个时候你需要设置 showList 为 false, 内置的列表将不会显示, 但是，必须调用showSelectBox方法来手动打开图片选择窗口
      * 此时依然支持 needCrop 属性
      * */
        showList: {
            type: Boolean,
            default: true
        },
        // 是否显示选择框
        showSelector: {
            type: Boolean,
            default: true
        },
        // 图片大小 单位 M，这个一般在不需要截图的时候才会使用到
        size: {
            type: Number,
            default: 4
        },
        // 图片数量,0 表示不限制数量
        count: {
            type: Number,
            default: 0
        },
        // 是否需要编辑图片，选中图片后，直接弹出编辑选框，不支持多图
        needEdit: Boolean,
        // 是否支持多传
        multiple: Boolean,
        // 真删或者假删
        deleteTruth: Boolean,
        // 裁剪的宽度
        width: {
            type: Number,
            default: 0
        },
        // 裁剪的高度
        height: {
            type: Number,
            default: 0
        },
        // 选择框的宽
        boxWidth: {
            type: Number,
            default: 72
        },
        // 选择框的高
        boxHeight: {
            type: Number,
            default: 72
        },
        borderRadius: {
            type: Number,
            default: 0
        },
        // 是否隐藏编辑图片按钮
        hideEditBtn: Boolean,
        // 选择框的文本
        uploadText: {
            type: String,
            default: '上传图片'
        },
        // 自定义文件格式验证 params: (reg,message)
        customFileType: {
            type: Object,
            default: null
        },
        // 是否显示编辑或删除栏
        showControl: {
            type: Boolean,
            default: true
        }
    },
    computed: {
    // 总共可上传的数量
        total () {
            return this.totalCount || this.imageCount + this.videoCount
        }
    },
    methods: {
    // 手动显示图片选择窗口
        showSelectImageBox () {
            this.$refs.imageSelector2.$el.click()
        },
        async fileChange (e) {
            console.log(e)
            const files = Array.from(e.target.files)
            const reg = new RegExp('jpg|png|jpeg|bmp', 'i')
            // 可上传的图片总数
            const imageTotalCount = this.count
            // 当前选中的图片数量
            const currentImageCount = files.length
            // 已上传的图片数量
            const uploadedImageCount = this.list.length
            if (imageTotalCount && (currentImageCount + uploadedImageCount > imageTotalCount)) {
                this.$warning(`只允许上传${ imageTotalCount }张图片`)
                return
            }
            for (const file of files) {
                const res = reg.test(file.type)
                if (!res) {
                    this.$confirm({
                        title: '上传失败',
                        message: '图片格式不对，仅支持jpg、png、jpeg、bmp格式'
                    })
                    return
                }
            }
            if (this.needEdit && !this.multiple) {
                this.editImgUrl = createObjectUrl(files[0])
                this.showEdit = true
                return
            }
            this.fileList = files
            // 超过一张图片时，显示上传列表
            if (files.length > 1) {
                this.showUploadBox = true
            }
            this.up(files)
        },

        /**
       * 上传
       * @params files {Array} 文件列表
       * @params oldUrl {Number} 要替换的文件
       */
        async up (files, oldUrl) {
            const list = []
            const blobList = []
            this.uploading = true
            for (let [i, blob] of files.entries()) {
                try {
                    // 如果图片体积太大，就压缩一下
                    if (blob.size > this.size * 1024 * 1024) {
                        blob = await compress(blob)
                    }
                    // TODO: 老的注册流程取消后删除此事件，不要再用了，用change事件中的blobList代替
                    this.$emit('imageChange', blob)
                    const { url } = await upload(blob)
                    this.$set(this.fileList, i, blob)
                    blob.progress = 1
                    blob.current = `${ (blob.size / 1024).toFixed(2) }KB`
                    list.push(url)
                } catch (e) {
                    blob.error = true
                    this.$set(this.fileList, i, blob)
                    this.$error(e.message)
                    continue
                }
                blobList.push(blob)
            }
            this.blobList = blobList
            this.newList = list
            if (oldUrl) {
                this.localList = [...this.list]
                // 编辑完图片，替换到原来的位置
                const index1 = this.localList.indexOf(oldUrl)
                this.localList.splice(index1, 1, list[0])
            } else {
                this.localList = [...this.list, ...list]
            }
            // 如果只有一个文件，且不是视频。直接触发change事件
            if (list.length === 1) {
                this.$emit('change', this.localList)
                this.$emit('fileChange', blobList)
            }
            this.uploading = false
        },
        // 上传停止后，继续上传
        // resumeBreakpointUpload () {
        //
        // },
        // 上传多张图片时，只出发一次change事件
        async confirm () {
            this.$emit('fileChange', this.blobList)
            await this.$nextTick()
            this.$emit('change', this.localList)
            this.showUploadBox = false
        },
        // 点击取消按钮时，删除已上传的文件
        cancel () {
            this.showUploadBox = false
            deleteImage(this.newList, 'img')
            this.$emit('cancel')
        },

        /* manageBoxConfirm (uploadList) {
        for (let url of uploadList) {
          this.list.push(url)
        }
        this.$emit('change', this.list)
      }, */
        // 删除图片，这里并不是真的删除，只是从本地列表中删除，如果想彻底删除服务器中的图片，需要监听remove事件
        async removeLocal (url) {
            const index = this.list.indexOf(url)
            const removeUrl = this.list.splice(index, 1)[0]
            this.$emit('remove', removeUrl, index)
            this.$emit('change', this.list)

            if (this.deleteTruth) {
                await deleteImage([url], 'img')
            }
        },
        // 截图成功
        cutSuccess (blob, oldUrl) {
            if (oldUrl) {
                this.up([blob], oldUrl)
            } else {
                this.up([blob])
            }
        },
        edit (index) {
            this.showEdit = true
            this.forcedEdit = true
            this.editImgUrl = this.list[index]
        },
        dragEnd () {
            // 重新排序，把视频放在前面
            const images = this.list.filter(item => item.indexOf('img/') > -1)
            this.$emit('drag-end', [...images])
            this.$emit('change', [...images])
        },
        dragStart () {
            this.$emit('drag-start', this.list)
        }
    }
}
</script>

<style scoped lang="scss">
  .error-message {
    position: absolute;
    left: 0;
    bottom: 0;
    color: red;
    line-height: 30px;
  }
  .success {
    position: absolute;
    left: 0;
    bottom: 0;
    color: greenyellow;
    line-height: 30px;
  }
  .pl-image-upload {
    position: relative;
    display: flex;
    .image-list {
      display: inline-flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      > .image-item {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 20px;
        overflow: hidden;
        font-size: 0 !important;
        &:nth-last-of-type(1) {
          margin-right: 0 !important;
          margin-bottom: 0 !important;
        }
        > .image-item-content {
          position: relative;
          width: var(--width);
          height: var(--height);
          overflow: hidden;
          border-radius: var(--border-radius);
          > img {
            width: var(--width);
            height: var(--height);
            object-fit: cover;
          }
          > .icon-bofang {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
          }
          &:hover {
            .edit-box {
              display: inline-flex;
            }
          }
        }
        > .image-item-bottom {
          width: 100%;
          height: max-content;
        }
        .edit-box {
          position: absolute;
          bottom: 0;
          left: 0;
          display: none;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 26px;
          padding: 10px 0;
          color: #fff;
          background-color: rgba(0,0,0,0.6) ;
          &:after {
            position: absolute;
            left: 50%;
            content: '';
            width: 1px;
            height: 11px;
            background-color: #eee;
          }
        }
      }
    }
    .pl-image-loading {
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, .5);
      border-radius: 4px;
      > .el-icon-loading{
        font-size: 30px;
        color: #fff;
      }
    }
  }
  ::v-deep .el-dialog__header {
    display: flex;
    justify-content: flex-start;
  }
</style>
