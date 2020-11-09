<template>
    <div class="pl-quill-editor" ref="editor">
        <div id="pl-quill-toolbar" class="pl-quill-toolbar" ref="toolbar">
            <!-- Inline -->
            <button class="toolbar-btn ql-bold" title="粗体">
                <pl-svg name="icon-bold-2a59b" width="16" />
            </button>
            <!-- italic -->
            <button class="toolbar-btn ql-italic" title="斜体">
                <pl-svg name="icon-italic-0a12d" width="16" />
            </button>
            <!-- under-line -->
            <button class="toolbar-btn ql-underline" title="下划线">
                <pl-svg name="icon-underline-dc374" width="16" />
            </button>
            <!-- delete -->
            <button class="toolbar-btn ql-strike" title="删除线">
                <pl-svg name="icon-delete-d428a" width="16" />
            </button>
            <!-- H1 -->
            <button class="toolbar-btn ql-header" value="h1" title="标题1">
                <pl-svg name="icon-h1-3f84b" width="16" />
            </button>
            <!-- H2 -->
            <button class="toolbar-btn ql-header" value="h2" title="标题2">
                <pl-svg name="icon-h2-b30da" width="18" />
            </button>
            <!-- color -->
            <button class="toolbar-btn ql-color" title="颜色">
                <el-tooltip class="item" effect="dark" content="字体颜色" placement="top-start">
                    <el-color-picker v-model="color" @change="colorChange" />
                </el-tooltip>
            </button>
            <!-- bgc -->
            <label class="toolbar-btn" title="底色">
                <el-tooltip class="item" effect="dark" content="背景颜色" placement="top-start">
                    <el-color-picker v-model="bgc" @change="bgcChange" />
                </el-tooltip>
            </label>
            <!-- link -->
            <!--<label class="toolbar-btn" @click="linkHandler" title="超链接">
        <pl-svg name="icon-icon-test14" width="16" />
      </label>-->
            <!-- size -->
            <label class="toolbar-btn">
                <el-dropdown @command="handleSize" trigger="click" style="width: 80px;">
                    <span class="el-dropdown-link">
                        {{ fontSize }} <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="small" label="">小</el-dropdown-item>
                        <el-dropdown-item command="normal" label="">正常</el-dropdown-item>
                        <el-dropdown-item command="large" label="">大</el-dropdown-item>
                        <el-dropdown-item command="huge" label="">巨大</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </label>
            <!-- 右缩进 -->
            <label class="toolbar-btn" @click="retract(1)" title="右缩进">
                <pl-svg name="icon-right-bb568" width="16" />
            </label>
            <!-- 左缩进 -->
            <label class="toolbar-btn" @click="retract(-1)" title="左缩进">
                <pl-svg name="icon-left-173fa" width="16" />
            </label>
            <!-- ul -->
            <button class="toolbar-btn ql-list" value="bullet" title="无序列表">
                <pl-svg name="icon-ul-b518c" width="16" />
            </button>
            <!-- ol -->
            <button class="toolbar-btn ql-list" value="ordered" title="有序列表">
                <pl-svg name="icon-ol-b66f8" width="16" />
            </button>
            <!-- align -->
            <label class="toolbar-btn">
                <el-dropdown @command="handleAlign" trigger="click">
                    <span>
                        <pl-svg
                            :key="1"
                            :name="alignValue === 'center' ? 'icon-center-ba45c' : alignValue === 'right' ? 'icon-to-right-581f7' : 'icon-to-left-85746'"
                            fill="#333"
                            class="dropdown"
                            width="16"
                        />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="" title="左对齐">
                            <pl-svg fill="#333" width="16" :key="4" class="el-dropdown-link" name="icon-to-left-85746" />
                        </el-dropdown-item>
                        <el-dropdown-item command="right" title="右对齐">
                            <pl-svg fill="#333" width="16" :key="5" class="el-dropdown-link" name="icon-to-right-581f7" />
                        </el-dropdown-item>
                        <el-dropdown-item command="center" title="居中">
                            <pl-svg fill="#333" width="16" :key="6" class="el-dropdown-link" name="icon-center-ba45c" />
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </label>
            <!-- image -->
            <button class="toolbar-btn ql-image" title="选择图片">
                <pl-svg name="icon-pic-c2a1c" width="18" />
            </button>
            <button class="toolbar-btn ql-video" title="选择视频" v-if="showVideo">
                <pl-svg name="icon-video-3e68f" width="18" />
            </button>
        </div>
        <div ref="container" id="pl-quill-editor" />
    </div>
</template>

<script>
import Quill from 'quill'
import imageUp from '../../assets/js/quill-module/quill-image-up'
import { VideoUp, VideoBlot } from '../../assets/js/quill-module/quill-video-up'
import { throttle } from '../../assets/ts/utils'
import { base64ToBlob, upload } from '../../assets/ts/upload'
VideoBlot.blotName = 'simpleVideo'
VideoBlot.tagName = 'video'
Quill.register('modules/imageUp', imageUp)
Quill.register('modules/videoUp', VideoUp)
Quill.register(VideoBlot)
const reg = /<p>&nbsp;<\/p>|<p><br><\/p>$/
export default {
    name: 'PlEditor',
    data () {
        return {
            header: '标题大小',
            fontSize: '字体大小',
            alignValue: '',
            color: '#333',
            bgc: '#333',
            sizeMap: {
                small: '小',
                normal: '正常',
                large: '大',
                huge: '巨大'
            },
            type: 'file',
            localValue: '',
            retractValue: 0,
            // 选中的下标
            selectIndex: 0,
            // 选中的长度
            selectLength: 0,
            // 选中文本的格式对象
            selectFormat: null
        }
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        showVideo: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        container () {
            return this.$refs.container
        }
    },
    watch: {
        value (val) {
            this.convertBase64()
            if (this.quill) {
                if (val && val !== this.localValue) {
                    if (!val || !val.trim) {
                        this.quill.pasteHTML('<p>&nbsp;</p>')
                    } else {
                        this.quill.pasteHTML(val)
                    }
                    this.localValue = val
                } else if (!val) {
                    this.quill.pasteHTML('<p>&nbsp;</p>')
                }
            }
        }
    },
    mounted () {
        this.mainContainer = document.getElementById('main')
        this.init()
        this.toolbar.classList.remove('toolbarFloat')
    },
    beforeDestroy () {
        this.mainContainer.removeEventListener('scroll', this.watchScroll, {
            capture: true,
            passive: true
        })
    },
    methods: {
        init () {
            this.quill = new Quill('#pl-quill-editor', {
                them: 'snow',
                modules: {
                    toolbar: {
                        container: '#pl-quill-toolbar'
                    },
                    imageUp: {
                        size: 1,
                        response: url => url
                    },
                    videoUp: {
                        response: url => url
                    }
                }
            })
            this.quill.on('editor-change', this.onEditorChange)
            this.editor = this.quill.editor
            this.editorDom = document.querySelector('#pl-quill-editor .ql-editor')
            this.toolbar = this.$refs.toolbar
            this.mainContainer.addEventListener('scroll', this.watchScroll, {
                capture: true,
                passive: true
            })
            if (this.value) {
                this.quill.pasteHTML(this.value)
            }
        },
        handleSize (val) {
            this.quill.format('size', val)
            this.fontSize = this.sizeMap[val]
        },
        retract (val) {
            this.retractValue += val
            if (this.retractValue === -1) {
                this.retractValue = 0
                return
            }
            if (this.retractValue === 9) {
                this.retractValue = 8
                return
            }
            this.quill.format('indent', this.retractValue)
        },
        handleAlign (val) {
            this.alignValue = val
            this.quill.format('align', val)
        },
        bgcChange (c) {
            this.quill.format('background', c)
        },
        colorChange (c) {
            this.quill.format('color', c)
        },
        async linkHandler () {
            const range = this.quill.getSelection(true)
            const { index, length } = range
            this.$prompt('请输入链接地址')
                .then(({ value }) => {
                    if (value && value.trim()) {
                        if (length > 0) {
                            // 用户手动选择了文本
                            this.quill.format('link', value.trim())
                        } else {
                            this.quill.insertText(index, value.trim(), 'api')
                            this.quill.setSelection(index, value.trim().length)
                            this.quill.format('link', value.trim())
                        }
                    } else {
                        this.quill.removeFormat(this.selectIndex, this.selectLength, 'link')
                    }
                })
        },
        onEditorChange (eventName, ...args) {
            if (eventName === 'text-change') {
                clearTimeout(this.throttle)
                this.throttle = setTimeout(() => {
                    this.localValue = this.quill.root.innerHTML.replace(reg, '')
                    this.$emit('input', this.localValue)
                }, 200)
            }
            if (eventName === 'selection-change') {
                this.selectIndex = args[0] ? args[0].index : 0
                this.selectLength = args[0] ? args[0].length : 0
                this.selectFormat = this.quill.getFormat(this.selectIndex, this.selectLength)
            }
        },
        watchScroll () {
            const top = this.editorDom.getBoundingClientRect().top
            if (top - 120 <= 0) {
                this.toolbar.classList.add('toolbarFloat')
            }
            if (top - 120 > 0) {
                this.toolbar.classList.remove('toolbarFloat')
            }
        },

        /**
     * 如果用户从其他地方复制过来的图片是base64，就将base64转为blob,并上传至oss
     */
        convertBase64: throttle(async function () {
            const imgs = this.container.querySelectorAll('img')
            for (const img of imgs) {
                if (img.src.indexOf('base64') > -1) {
                    const imgBlob = base64ToBlob(img.src)
                    upload(imgBlob)
                        .then(res => {
                            img.src = res.url
                        })
                }
            }
        }, 1000)
    }
}
</script>
<style scoped lang="scss">
  #pl-quill-editor {
    width: max-content;
    height: 800px;
    border: 1px solid #e7e7e7;
    ::v-deep img {
      width: 100% !important;
    }
    ::v-deep .ql-editor {
      width: 800px;
      min-height: 500px;
    }
    ::v-deep a {
      color: #007bff;
    }
  }
  ::v-deep .el-dropdown {
    height: 16px;
    line-height: 16px;
  }
  .pl-quill-toolbar {
    position: relative;
    display: flex;
    align-items: center;
    height: 60px;
    width: 800px;
    border: 1px solid #e7e7e7;
    border-bottom: none;
    box-sizing: content-box;
    background-color: #efefef;
    transition: transform .3s linear;
    &.toolbarFloat {
      z-index: 1;
      position: fixed;
      top: 60px;
      border-bottom: 1px solid #e7e7e7;
    }
  }
  .toolbar-btn {
    display: inline-flex;
    align-items: center;
    margin-left: 20px;
    cursor: pointer;
    border: none;
    background: none;
    > input {
      display: none !important;
      &:checked+span {
        font-weight: bolder;
        color: #ec742e;
      }
    }
  }
  /*::v-deep .el-color-picker {
    line-height: 33px;
    .el-color-picker__trigger {
      padding: 0 !important;
      border: none;
      width: 22px;
      .el-color-picker__color {
        display: none;
      }
    }
    &.bgc {
      &:before {
        color: var(--bgc);
      }
    }
    &.color {
      &:before {
        color: var(--color);
      }
    }
    &:before {
      position: absolute;
      left: 50%;
      font-size: 18px;
      transform: translateX(-50%);
    }
  }*/
</style>
