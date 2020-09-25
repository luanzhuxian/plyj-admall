<template>
    <div class="pl-image-upload">
        <Draggable
            v-if="showList"
            class="image-list"
            :list="list"
            tag="ul"
            animation="200"
            ghost-class="ghost"
            :disabled="disabledDraggable"
            @start="dragStart"
            @end="dragEnd"
            :style="{
                '--width': boxWidth + 'px',
                '--height': boxHeight + 'px',
                '--grid-count': list.length,
                '--border-radius': borderRadius + 'px'
            }"
        >
            <template v-for="(video, i) of list">
                <li
                    class="image-item"
                    :class="{ 'the-last-one': list.length === count && !count }"
                    :key="i"
                    v-if="video"
                >
                    <div class="image-item-content">
                        <img
                            v-img-error
                            :src="video + '?x-oss-process=video/snapshot,t_5000,m_fast'"
                        >
                        <div class="edit-box" v-if="showDelete">
                            <pl-svg class="pointer" name="icon-shanchu1" @click.stop="removeLocal(video)" width="16" fill="#fff" />
                        </div>
                        <pl-svg class="icon-bofang" name="icon-bofang" @click="playVideo(video)" width="26" fill="#fff" />
                    </div>
                    <div class="image-item-bottom">
                        <slot name="image-item-bottom" :$index="i" :$video="video" />
                    </div>
                </li>
            </template>

            <ImageSelector
                v-if="list.length < count && showSelector"
                :box-height="boxHeight"
                :box-width="boxWidth"
                :border-radius="borderRadius"
                :list-length="list.length"
                :margin-left="list.length ? 20 : 0"
                :upload-text="uploadText"
                @change="fileChange"
                :multiple="multiple"
                :accept="videoAccept"
                ref="selectBox"
            />
        </Draggable>
        <!--<ManageBox
      v-show="needEdit"
      :show.sync="showManageBox"
      :max-count="count - list.length"
      :width="needEdit ? width : null"
      :height="needEdit ? height : null"
      :size="size"
      @confirm="manageBoxConfirm"
    />-->
        <el-dialog
            title="上传结果"
            :visible.sync="showUploadBox"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
            :show-close="false"
            center
        >
            <div
                slot="title"
            >
                <i style="font-weight: bold; font-size: 18px;">
                    上传结果
                </i>
                <el-button
                    type="primary"
                    plain
                    style="margin-left: 52px;"
                    @click="showSelectBox"
                    v-if="count > 1 || multiple"
                >
                    上传视频
                </el-button>
            </div>
            <div
                class="table"
                :class="{ hasCustomProps: customProps.length }"
                :style="{ '--count': customProps.length }"
            >
                <div class="head">
                    <div
                        class="cell"
                        style="justify-self: center"
                    >
                        文件
                    </div>
                    <div class="cell">
                        名称
                    </div>
                    <div class="cell">
                        大小
                    </div>
                    <div class="cell">
                        状态
                    </div>
                    <template v-for="(item, i) of customProps">
                        <div
                            :key="i"
                            class="cell"
                            v-text="item.fieldName"
                        />
                    </template>
                </div>

                <div
                    v-for="(item, i) of fileList"
                    class="row"
                    :key="i"
                    :style="{ '--progress': (item.progress * 100 || 0) + '%' }"
                >
                    <div
                        class="cell"
                        style="justify-self: center"
                    >
                        <pl-svg
                            v-if="item.type.indexOf('video/') > -1"
                            name="icon-video"
                            width="26"
                            height="30"
                        />
                    </div>
                    <div class="cell" v-text="item.name" />
                    <div class="cell">
                        <i v-text="item.current || 0" />
                        /<i
                            v-if="item.type.indexOf('video/') > -1"
                            v-text="(item.size / 1024 / 1024).toFixed(2) + 'MB'"
                        />
                    </div>
                    <div class="cell">
                        <span v-if="item.progress < 1 && !item.error" class="loading">上传中...</span>
                        <span v-if="item.progress === 1 && !item.error">
                            <pl-svg style="vertical-align: -3px;" v-if="item.progress === 1 && !item.error" name="icon-success" width="14" />
                            上传成功
                        </span>
                        <div v-if="item.error">
                            <pl-svg style="vertical-align: -3px;" v-if="item.progress === 1 && !item.error" name="icon-shibai" fill="red" width="14" />
                            <div>
                                上传失败
                            </div>
                            <div class="retry">
                                正在重试...
                            </div>
                            <!--<el-button v-if="row.checkPoint" type="text" @click="goOn(row)">继续上传</el-button>-->
                        </div>
                    </div>
                    <template v-for="(prop, j) of fields[i]">
                        <el-input
                            :key="i + '-' + j"
                            v-if="prop.type === 'text'"
                            :value="prop.value"
                            @input="e => textValueChange(prop, e)"
                            :placeholder="`请输入${prop.fieldName}`"
                        />
                        <el-select
                            :key="i + '-' + j"
                            v-else-if="prop.type === 'selector'"
                            v-model="prop.value"
                            :placeholder="`请选择${prop.fieldName}`"
                            style="width: 129px;"
                        >
                            <el-option
                                v-for="(opt, index) of prop.options"
                                :key="index"
                                :label="opt[prop.labelProps]"
                                :value="opt[prop.valueProps]"
                            />
                        </el-select>
                    </template>
                </div>
            </div>
            <div style="margin-top: 32px; text-align: center;">
                <el-button @click="cancel">
                    取 消
                </el-button>
                <el-button type="primary" @click="confirm" :disabled="!success">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <PreviewVideo :show.sync="showVideo" :src="playedVideo" />

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
            :multiple="multiple"
            :accept="videoAccept"
            ref="selectBox2"
        />
    </div>
</template>

<script>
import { deleteImage, breakpointUpload, resumeBreakpointUpload, createObjectUrl, revokeObjectURL } from '../../assets/ts/upload'
import ImageSelector from './File-Selector.vue'
import Draggable from '../../components/draggable'
import PreviewVideo from '../common/Preview-Video.vue'
export default {
    name: 'VideoManager',
    components: {
        ImageSelector,
        Draggable,
        PreviewVideo
    },
    data () {
        return {
            Input: null,
            showUploadBox: false,
            // 标记全部成功
            success: false,
            // 标记手动结束后
            canceled: false,
            showVideo: false,
            // 开始重试
            retry: false,
            playedVideo: '',
            fileList: [],
            newList: [],
            fields: [],
            oldList: [], // 最初的列表
            videoAccept: 'video/mp4, video/webm, video/ogg'
        }
    },
    model: {
        prop: 'list',
        event: 'change'
    },
    props: {
    // 默认要显示的视频， [src1, src2, ...]
        list: {
            type: Array,
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
        // 单个视频大小 单位 M
        size: {
            type: Number,
            default: 200
        },
        // 允许上传的视频总大小
        totalSize: {
            type: Number,
            default: Infinity
        },
        // 视频数量
        count: {
            type: Number,
            default: 0
        },
        // 是否支持多传
        multiple: Boolean,
        // 真删或者假删
        deleteTruth: Boolean,
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
        // 选择框的文本
        uploadText: {
            type: String,
            default: '上传视频'
        },
        // 自定义文件格式验证 params: (reg,message)
        customFileType: {
            type: Object,
            default: null
        },
        showDelete: {
            type: Boolean,
            default: true
        },

        /**
       * 自定义属性
       * 形如：
       * [
       *    {
       *        field: 'field1', // 字段
       *        fieldName: '视频名称', // 字段名称
       *        type: 'text' // 字段类型，支持text, selector
       *        value: '', // 字段值
   *            validate: 'Function' 校验函数，返回一个字符串，作为错误提示语，不反回则表示校验通过
       *        required: true // 是否必填
       *    },
       *    {
       *        field: 'field2', // 字段
       *        fieldName: '来源', // 字段名称
       *        type: 'selector' // 字段类型，支持text, selector
       *        options: [], // selector 必须传递候选项列表
       *        labelProps: '', // label对应的字段名称
       *        valueProps: '', // 绑定值对象的字段名称
       *        value: '', // 字段值
       *        required: true // 是否必填
       *    }
       * ]
       */
        customProps: {
            type: Array,
            default () {
                return []
            }
        }
    },
    watch: {
        showUploadBox (val) {
            if (!val) {
                this.fileList = []
                this.fields = []
                this.newList = []
            }
        }
    },
    methods: {
    // 显示选择窗口
        showSelectBox () {
            this.$refs.selectBox2.$el.click()
        },
        async fileChange (e) {
            const files = Array.from(e.target.files)
            const reg = new RegExp('mp4|ogg|webm', 'i')
            const totalSize = [...this.fileList, ...files].map(file => file.size).reduce((a, b) => a + b)
            if (totalSize > this.totalSize * 1024 * 1024) {
                this.$alert({
                    title: '视频库容量不足',
                    message: `选择的视频总大小为：${ Number((totalSize / 1024 / 1024).toFixed(2)) }M, 视频库剩余容量：${ this.totalSize }M`
                })
                return
            }
            this.success = false
            this.canceled = false
            if (this.count && this.list.length + files.length > this.count) {
                this.$warning(`只允许上传${ this.count }个视频`)
                return
            }
            for (const file of files) {
                const res = reg.test(file.type)
                const size = file.size
                if (size > this.size * 1024 * 1024) {
                    this.$confirm({
                        title: '上传失败',
                        message: `请选择大小为 ${ this.size }M 以内的文件`
                    })
                    return
                }
                if (!res) {
                    this.$confirm({
                        title: '上传失败',
                        message: '文件格式错误，仅支持mp4、ogg、webm格式的视频'
                    })
                    return
                }
                // 配置自定义字段
                const fieldModels = []
                for (const prop of this.customProps) {
                    fieldModels.push({
                        field: prop.field,
                        value: '',
                        required: prop.required,
                        fieldName: prop.fieldName,
                        validate: prop.validate,
                        type: prop.type,
                        labelProps: prop.labelProps || '',
                        valueProps: prop.valueProps || '',
                        options: prop.options || []
                    })
                }
                if (fieldModels.length) {
                    this.fields.push(fieldModels)
                }
            }
            this.fileList = [...this.fileList, ...files]
            this.showUploadBox = true
            this.up(files)
        },

        /**
       * 上传
       * @params files {Array} 文件列表
       * @params errorFile {Blob} 失败的文件
       */
        async up (files, errorFile) {
            for (const [i, blob] of files.entries()) {
                if (errorFile && blob !== errorFile) continue
                try {
                    const duration = await this.getDuration(blob)
                    const urls = await this.upHandler(blob)
                    for (const video of urls) {
                        this.newList.push({
                            url: video.split('?')[0],
                            size: blob.size,
                            fileName: blob.name,
                            type: blob.type,
                            duration
                        })
                    }
                } catch (e) {
                    if (!this.canceled) {
                        blob.error = true
                        this.retry = true
                        this.success = false
                        setTimeout(() => {
                            this.goOn(blob)
                            this.retry = false
                        }, 3000)
                    }
                } finally {
                    if (this.showUploadBox) {
                        this.$set(this.fileList, i, blob)
                    }
                }
            }
            this.success = true
        },
        upHandler (blob) {
            const error = blob.error
            blob.error = false
            const i = this.fileList.indexOf(blob)
            if (error) {
                return resumeBreakpointUpload(blob.key, blob, blob.checkPoint, (progress, checkPoint, key, client) => {
                    blob.progress = progress
                    blob.checkPoint = checkPoint
                    blob.key = key
                    this.client = client
                    this.$set(this.fileList, i, blob)
                })
            }
            return breakpointUpload(blob, (progress, checkPoint, key, client) => {
                if (this.showUploadBox) {
                    blob.current = `${ (progress * blob.size / 1024 / 1024).toFixed(2) }MB`
                    blob.progress = progress
                    blob.checkPoint = checkPoint
                    blob.key = key
                    this.client = client
                    this.$set(this.fileList, i, blob)
                }
            })
        },
        // 继续上传
        async goOn (blob) {
            try {
                await this.up(this.fileList, blob)
            } catch (e) {
                throw e
            }
        },
        // 获取视频时长
        getDuration (file) {
            return new Promise(resolve => {
                const url = createObjectUrl(file)
                let videoElement = document.createElement('video')
                videoElement.src = url
                videoElement.addEventListener('loadedmetadata', () => {
                    const duration = videoElement.duration
                    resolve(duration)
                    videoElement = null
                    revokeObjectURL(url)
                })
            })
        },
        // 上传多张图片时，只出发一次change事件
        async confirm () {
            // 校验自定义字段
            if (this.fields.length) {
                for (const props of this.fields) {
                    for (const prop of props) {
                        if (!prop.value && prop.required) {
                            return this.$warning(`请输入${ prop.fieldName }`)
                        }
                        if (typeof prop.validate === 'function') {
                            const msg = prop.validate(prop.value)
                            if (msg) {
                                this.$error(msg)
                                return
                            }
                        }
                    }
                }
            }
            // 返回所有视频的url数组，当前上传的视频信息，当前自定义字段
            this.$emit('change', [...this.list, ...this.newList.map(item => item.url)], this.newList, this.fields)
            this.showUploadBox = false
        },
        // 点击取消按钮时，删除已上传的文件
        async cancel () {
            try {
                await this.$confirm('取消后将无法恢复上传，是否确认？')
                this.showUploadBox = false
                this.canceled = true
                if (this.client) {
                    this.client.cancel()
                }
                const urls = [...this.list]
                for (const video of this.newList) {
                    urls.push(video.url)
                }
                this.$emit('cancel')
                await deleteImage(urls, 'video')
            } catch (e) {}
        },
        // 删除视频，这里并不是真的删除，只是从本地列表中删除，如果想彻底删除服务器中的图片，需要监听remove事件
        async removeLocal (url) {
            const index = this.list.indexOf(url)
            const removeUrl = this.list.splice(index, 1)[0]
            this.newList.splice(index, 1)
            this.$emit('remove', removeUrl, index)
            this.$emit('change', this.list, this.newList)

            if (this.deleteTruth) {
                await deleteImage([url], 'video')
            }
        },
        dragEnd () {
            this.$emit('change', this.list)
        },
        dragStart () {
            this.$emit('drag-start', this.list)
        },
        playVideo (src) {
            this.showVideo = true
            this.playedVideo = src
        },
        textValueChange (field, val) {
            field.value = val
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
        width: 100%;
        > .image-item {
            position: relative;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            margin-right: 20px;
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
                cursor: pointer;
                background-color: rgba(0,0,0,.6) ;
            }
        }
    }
}
.table {
    width: 966px;
    &.hasCustomProps {
        > .row,
        .head {
            grid-template-columns: 40px 1fr 150px 110px repeat(var(--count), 180px);
        }
    }
    > .row,
    .head {
        display: grid;
        grid-template-columns: 40px 1fr 170px 110px;
        grid-column-gap: 12px;
        align-items: center;
        padding: 0 20px;
    }
    > .row {
        grid-template-rows: 72px;
        border-top: 1px solid #e7e7e7;
        transition: background-size .1s linear;
        background: linear-gradient(90deg, rgba(77, 173, 225, .2), rgba(77, 173, 225, .2)) no-repeat left center;
        background-size: var(--progress);
        &:nth-of-type(2n-1) {
            background: linear-gradient(90deg, rgba(77, 173, 225, .1), rgba(77, 173, 225, .1)) no-repeat left center;
            background-size: var(--progress);
        }
    }
    > .head {
        font-weight: bold;
        grid-template-rows: 48px;
    }
    .cell {
        font-size: 12px;
    }
}
.retry {
    animation: flickering 1s ease-in-out infinite;
}
@keyframes flickering {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.iconbofang {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #fff;
    font-size: 28px;
    cursor: pointer;
    transform: translate(-50%, -50%);
}
::v-deep {
    .el-dialog {
        width: max-content !important;
    }
    .el-dialog__header {
        display: flex;
        justify-content: flex-start;
    }
    .el-dialog__body {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}

</style>
