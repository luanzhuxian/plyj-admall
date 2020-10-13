<template lang="html">
    <div class="editor-form" :class="$style.editorForm" v-if="show">
        <div :class="$style.editorFormHeader">
            {{ options.title }}
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorFormContent">
            <div :class="$style.editorFormItem" v-if="options.moduleName.show">
                <label :class="{ [$style.important]: options.moduleName.required }">
                    {{ options.moduleName.label }}
                </label>
                <el-input
                    v-model.trim="data[options.moduleName.prop]"
                    :placeholder="options.moduleName.placeholder"
                    :maxlength="options.moduleName.maxlength"
                    :disabled="options.moduleName.disabled"
                />
            </div>
            <div :class="$style.editorFormItem" v-if="options.otherValue.show">
                <label :class="$style.important">
                    {{ options.otherValue.label }}
                </label>
                <el-input
                    v-model.trim="data[options.otherValue.prop]"
                    :placeholder="options.otherValue.placeholder"
                    :maxlength="options.otherValue.maxlength"
                    :disabled="options.otherValue.disabled"
                />
            </div>
            <label :class="{ [$style.important]: options.image.required }">
                添加图片
            </label>
            <p v-if="options.suggestion.show">
                {{ `建议尺寸${width}x${height}，最多添加${max}个，${min ? `最少添加${min}个，` : ''}鼠标拖拽可调整顺序。` }}
            </p>
            <Draggable
                :class="$style.editorFormList"
                :list="data.values"
                tag="ul"
                animation="200"
                ghost-class="ghost"
                @start="dragging=true"
                @end="dragging=false"
            >
                <li :class="$style.editorFormListItem" v-for="(item, index) of data.values" :key="index">
                    <div :class="$style.imgWrapper" v-if="options.image.show">
                        <img v-if="item.image" :src="item.image">
                        <div v-else :class="$style.defaultImg">
                            <PlSvg name="icon-icon--shangchuan" width="18" fill="#999" />
                            <span>上传图片</span>
                        </div>
                        <div :class="$style.mask" @click="selectImage(index)">
                            更换图片
                        </div>
                    </div>
                    <ul :class="$style.operate">
                        <template v-for="(prop, j) of propsList">
                            <li :class="$style.formItem" v-if="options[prop].show" :key="j">
                                <label :class="{ [$style.important]: options[prop].required }" v-if="options[prop].label">
                                    {{ options[prop].label }}
                                </label>
                                <el-input
                                    v-model.trim="item[options[prop].prop]"
                                    :type="options[prop].tag"
                                    :placeholder="options[prop].placeholder"
                                    :maxlength="options[prop].maxlength"
                                    :disabled="options[prop].disabled"
                                />
                            </li>
                        </template>
                    </ul>
                    <div v-if="data.values.length > options.min" style="width: 28px;">
                        <i class="el-icon-delete-solid" @click.stop="remove(index)" />
                    </div>
                </li>
            </Draggable>
            <button
                :class="$style.editorFormBtn"
                v-if="data.values && data.values.length < max"
                type="button"
                @click.stop="add"
            >
                <i class="el-icon-plus" />
                <span>{{ `添加${data.values.length}/${max}` }}</span>
            </button>
        </div>
        <ImageManager
            ref="image-manager"
            :show-list="false"
            :show-selector="false"
            need-edit
            :width="width"
            :height="height"
            :size="0.5"
            :count="100"
            @change="uploadSuccess"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModule } from '../utils/types'
import Draggable from '../../../components/common/draggable'
import ImageManager from '../../../components/common/file/Image-Manager.vue'

@Component({
    components: {
        Draggable,
        ImageManager
    }
})
export default class EditorForm extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) data!: TemplateModule

    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) options!: DynamicObject

    /* data */
    dragging = false
    currentImgIndex!: number
    keys = ['name', 'value', 'valueName']

    /* computed */
    get propsList () {
        return Object.keys(this.options).filter(key => this.keys.includes(key) && this.options[key].show)
    }

    get width () {
        return this.options.image.width
    }

    get height () {
        return this.options.image.height
    }

    get max () {
        return this.options.max
    }

    get min () {
        return this.options.min
    }

    /* methods */
    selectImage (index: number) {
        this.currentImgIndex = index
        // @ts-ignore
        this.$refs['image-manager'].showSelectImageBox()
    }

    uploadSuccess (urls: string[]) {
        this.data.values[this.currentImgIndex].image = urls[0]
    }

    add () {
        if (this.data.values.length >= this.max) return false
        this.data.values.push({
            id: '',
            type: '',
            image: '',
            name: '',
            value: '',
            valueName: '',
            goodsInfo: ''
        })
    }

    async remove (index: number) {
        try {
            await this.$confirm({
                title: '确认删除？',
                message: '删除后不可恢复'
            })
            this.data.values.splice(index, 1)
        } catch (e) {
            throw e
        }
    }

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-form {
    .operate {
        .el-input,
        .el-textarea {
            flex: 1;
            width: 0;
        }
    }
    .el-icon-close {
        font-size: 16px;
        cursor: pointer;
        &::before {
        color: #666666;
        }
    }
    .el-icon-plus {
        margin-right: 6px;
        font-size: 16px;
        &::before {
        color: #666666;
        }
    }
    .el-icon-delete-solid {
        margin-right: 6px;
        font-size: 22px;
        cursor: pointer;
        &::before {
        color: #999999;
        }
    }
    .el-input--small .el-input__inner {
        padding: 8px;
    }
    .el-input.is-disabled .el-input__inner {
        border: none;
        background-color: #FFF;
    }
    .el-dropdown {
        color: #666666;
        padding-right: 6px;
        cursor: pointer;
        border-left: 1px solid #DEDEDE;
    }
}
</style>
<style module lang="scss">
.editor-form {
  min-width: 330px;
  background: #FFF;
  border: 1px solid rgba(231,231,231,1);
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
  padding: 0 18px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    line-height: 56px;
    font-size: 14px;
    font-family: Helvetica;
    font-weight: bold;
    color: #999999;
    border-bottom: 1px solid #CCC;
  }
  &-content {
    padding: 20px 0;
    font-size: 14px;
    line-height: 24px;
    color: #999999;
  }
  &-item {
    margin-bottom: 5px;
  }
  &-list {
    max-height: 578px;
    overflow-y: scroll;
  }
  &-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    background-color: #F9F9F9;
    cursor: pointer;
    .img-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 98px;
      height: 86px;
      cursor: pointer;
      &:hover {
        .mask {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    img {
      display: block;
      width: 100%;
      height: 64px;
      object-fit: cover;
    }
    .default-img {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      line-height: 22px;
      color: #999;
      background-color: #f8f8f8;
      border: 1px solid #ccc;
      cursor: pointer;
    }
    .mask {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      opacity: 1;
      color: #FFF;
      font-size: 12px;
      line-height: 16px;
    }
    .operate {
      display: block;
      flex: 1;
      padding: 5px 7px 5px 10px;
      > li {
        display: flex;
        margin-top: 5px;
        :nth-of-type(1) {
          margin-top: 0;
        }
      }
      label {
        min-width: 86px;
        text-align: right;
        margin-right: 5px;
      }
    }
  }
  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: 100%;
    height: 52px;
    line-height: 52px;
    color: #666666;
    background: #F4F4F4;
    border: none;
    cursor: pointer;
  }
  .important {
    &::after {
      content: '*';
      color: #E83323;
    }
  }
}
</style>
