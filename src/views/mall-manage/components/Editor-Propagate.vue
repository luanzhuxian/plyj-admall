<template lang="html">
    <div class="editor-propagate" :class="$style.editorPropagate" v-if="show">
        <div :class="$style.editorPropagateHeader">
            品宣
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorPropagateContent">
            <template v-if="isImageManagerShow">
                <label :class="$style.important">
                    添加图片
                </label>
                <p>
                    建议尺寸750x400，大小小于3MB，最少添加一个。
                </p>
                <ul>
                    <li :class="$style.editorPropagateListItem" v-for="(item, i) of data.values" :key="i">
                        <div :class="$style.imgWrapper">
                            <img v-imgError v-if="data.otherValue" :src="data.otherValue">
                            <div v-else :class="$style.defaultImg">
                                <PlSvg name="icon-icon--shangchuan" width="18" fill="#999" />
                                <span>上传图片</span>
                            </div>
                            <div :class="$style.mask" @click="selectImage(i)">
                                更换图片
                            </div>
                        </div>
                    </li>
                </ul>
            </template>
            <div :class="$style.editorPropagateFormItem">
                <label :class="$style.important">
                    教育特色
                </label>
                <el-radio v-model="data.show" :label="0">
                    不显示
                </el-radio>
                <el-radio v-model="data.show" :label="1" :disabled="isRadioDisable">
                    显示
                </el-radio>
                <a :class="$style.editorPropagateLink" v-if="isRadioDisable" @click="onClick">编辑店铺详情></a>
            </div>
        </div>
        <ImageManager
            ref="image-manager"
            :show-list="false"
            :show-selector="false"
            need-edit
            :width="750"
            :height="400"
            :size="0.5"
            :count="100"
            @change="uploadSuccess"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModule } from '../utils/types'
import ImageManager from '../../../components/common/file/Image-Manager.vue'

@Component({
    components: { ImageManager }
})
export default class EditorPropagate extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    @Prop(Boolean) isImageManagerShow!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) data!: TemplateModule

    /* computed */
    get isRadioDisable () {
        return !this.data.values || !this.data.values.length || !this.data.values[0].mallBrandingRequestModels || this.data.values[0].mallBrandingRequestModels.length === 0
    }

    /* methods */
    selectImage () {
        // @ts-ignore
        this.$refs['image-manager'].showSelectImageBox()
    }

    uploadSuccess (urls: string[]) {
        this.data.otherValue = urls[0]
    }

    async onClick () {
        try {
            await this.$confirm({
                title: '您还没有编辑店铺详情',
                message: '为了更好的展示店铺信息，请保存当前内容后去编辑',
                confirmButtonText: '保存并去编辑'
            })
            // @ts-ignore
            await this.$parent.saveDraft()
            setTimeout(() => {
                this.$router.push('/setting/shop')
            }, 1000)
        } catch (error) {
            throw error
        }
    }

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-propagate {
    .el-icon-close {
        font-size: 16px;
        cursor: pointer;
        &::before {
            color: #666666;
        }
    }

    .el-radio__label {
        font-size: 12px;
        padding-left: 8px;
    }
}
</style>
<style module lang="scss">
.editor-propagate {
  width: 410px;
  background: #FFF;
  border: 1px solid rgba(231,231,231,1);
  box-shadow: 0px 0px 12px rgba(0,0,0,0.1);
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
  &-form-item {
    label {
      margin-right: 16px;
    }
  }
  &-link {
    color: #598BF8;
  }

  &-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #F9F9F9;
    cursor: pointer;
    .img-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 98px;
      height: 98px;
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
      height: 100%;
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
  }

  .important {
    &::after {
      content: '*';
      color: #E83323;
    }
  }
}
</style>
