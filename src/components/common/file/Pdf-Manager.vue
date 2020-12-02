<template>
    <div :class="$style.pdfManager">
        <label :for="id">
            <span :class="$style.selectBtn">
                <span v-show="loading" class="el-icon-loading" />
                上传图文资料
            </span>
        </label>
        <Draggable
            v-if="fileList.length"
            :class="$style.fileList"
            :list="fileList"
            tag="ul"
            animation="200"
            ghost-class="ghost"
            @end="dragEnd"
        >
            <li
                v-for="(item, i) of fileList"
                :key="i"
                :class="$style.item"
            >
                <div>
                    <pl-svg
                        name="icon-pdf-8edfa"
                        width="16"
                    />
                    <i
                        :class="$style.name"
                        v-text="item.name"
                    />
                </div>
                <pl-svg
                    :class="$style.success"
                    name="icon-success"
                    width="14"
                    fill="#67c23a"
                />
                <pl-svg
                    :class="$style.remove"
                    name="icon-guanbi"
                    width="14"
                    fill="#ccc"
                    @click="remove(item.url)"
                />
            </li>
        </Draggable>
        <input
            :id="id"
            :type="type"
            :multiple="multiple"
            ref="input"
            style="display: none"
            @change="fileChange"
        >
    </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import { uploadPdf } from '../../../assets/ts/upload'
import Draggable from '../draggable'
export default {
    name: 'PDFManager',
    components: {
        Draggable
    },
    model: {
        event: 'change',
        prop: 'fileList'
    },
    data () {
        return {
            type: 'file',
            loading: false
        }
    },
    computed: {
        id () {
            return `pdf_${ this._uid }`
        }
    },
    props: {
        multiple: {
            type: Boolean,
            default: true
        },

        /**
    * 已上传文件列表
    * [{ name: '文件名', url: '文件url'  }]
    */
        fileList: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    methods: {
        async fileChange (e) {
            const files = Array.from(e.target.files)
            const RES = []
            this.loading = true
            try {
                for (const pdf of files) {
                    if (!/.+\/pdf$/.test(pdf.type)) {
                        this.$warning('请选择正确的PDF文件')
                        continue
                    }
                    if (pdf.size / 1024 / 1024 > 10) {
                        this.$warning(`${ pdf.name }大小超过10MB，请重新上传`)
                        continue
                    }
                    const res = await this.up(pdf)
                    RES.push(res)
                }
                this.$emit('change', [...this.fileList, ...RES])
                this.type = 'text'
                await this.$nextTick()
                this.type = 'file'
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },
        async up (file) {
            try {
                const { url } = await uploadPdf(file)
                return {
                    name: file.name,
                    url
                }
            } catch (e) {
                throw e
            }
        },
        dragEnd () {
            // 重新排序，把视频放在前面
            this.$emit('change', this.fileList)
        },
        // 删除文件
        remove (url) {
            const index = this.fileList.findIndex(item => item.url === url)
            if (index > -1) {
                this.fileList.splice(index, 1)
            }
        }
    }
}
</script>

<style module lang="scss">
.pdfManager {
  background-color: #fff;
  .select-btn {
    padding: 6px 20px;
    color: $--color-primary-blue;
    border: 1px solid $--color-primary-blue;
    background-color: #fff;
    cursor: pointer;
  }
  .file-list {
    margin-top: 12px;
    width: max-content;
    > .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #606266;
      padding: 0 5px;
      font-size: 12px;
      line-height: 25px;
      border-radius: 4px;
      cursor: pointer;
      > .remove {
        display: none;
      }
      &:hover {
        background-color: #e7e7e7;
        color: $--color-primary-blue;
        > .remove {
          display: inline-block;
        }
        > .success {
          display: none;
        }
      }
      > svg {
        vertical-align: -2px;
      }
    }
    .name {
      display: inline-block;
      margin-left: 10px;
      margin-right: 20px;
    }
  }
}

</style>
