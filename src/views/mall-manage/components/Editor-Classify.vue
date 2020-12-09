<template>
    <div class="editor-classify" :class="$style.editorClassify" v-if="show">
        <div :class="$style.editorClassifyHeader">
            分类导航
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorClassifyContent">
            <div :class="$style.editorClassifyFormItem">
                <label>
                    分类个数：
                </label>
                <el-radio v-model="data.number" :label="3" @change="onRadioChange">
                    3个
                </el-radio>
                <el-radio v-model="data.number" :label="4" @change="onRadioChange">
                    4个
                </el-radio>
            </div>
            <Draggable
                :class="$style.editorClassifyList"
                :list="data.values"
                tag="ul"
                animation="200"
                ghost-class="ghost"
                @start="dragging=true"
                @end="dragging=false"
            >
                <li :class="$style.editorClassifyListItem" v-for="(item, index) of data.values" :key="index">
                    <div :class="$style.imgWrapper">
                        <img v-if="item.image" :src="item.image">
                        <div v-else :class="$style.defaultImg">
                            <PlSvg name="icon-icon--shangchuan" width="18" fill="#999" />
                            <span>上传图片</span>
                        </div>
                        <div :class="$style.mask" @click="selectImage(index)">
                            更换图片
                        </div>
                    </div>
                    <div :class="$style.operation">
                        <div :class="$style.link">
                            <el-cascader
                                :ref="`cascader-${index}`"
                                v-model="item.selected"
                                :props="{ checkStrictly: true }"
                                :options="options.length ? options : defaultOptions"
                                clearable
                                @change="value => onCascaderChange(value, item)"
                            />
                        </div>
                    </div>
                    <div style="width: 28px;">
                        <i class="el-icon-delete-solid" @click.stop="remove(index)" />
                    </div>
                </li>
            </Draggable>
            <div :class="$style.suggestion" v-show="data.values.length">
                <p>分类图标可替换，建议图标大小：50x50</p>
            </div>
            <button
                v-show="data.values.length < max"
                :class="$style.editorClassifyBtn"
                type="button"
                @click.stop="add"
            >
                <i class="el-icon-plus" />
                <span>{{ `添加分类${data.values.length}/${max}` }}</span>
            </button>
        </div>
        <ImageManager
            ref="image-manager"
            :show-list="false"
            :show-selector="false"
            need-edit
            :width="50"
            :height="50"
            :size="0.5"
            :count="100"
            @change="uploadSuccess"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Draggable from '../../../components/common/draggable'
import ImageManager from '../../../components/common/file/Image-Manager.vue'
import { TemplateModule, TemplateModuleItem } from '../utils/types'

type ClassifyItem = {
    categoryName: string;
    id: string;
    childs?: ClassifyItem[];
}
type OptionsItem = {
    label: string;
    value: string;
    children?: OptionsItem[];
}

const goods = namespace('goods')

const getCascaderOptions = (list: ClassifyItem[]): OptionsItem[] => list.map(item => ({
    value: item.id,
    label: item.categoryName,
    ...(item.childs && item.childs.length ? { children: getCascaderOptions(item.childs) } : null)
}))

const findOption = ({ options, id }: {options: OptionsItem[]; id: string}): OptionsItem | undefined => {
    let result
    for (const option of options) {
        if (option.value === id) {
            return option
        }
        if (option.children && option.children.length) {
            result = findOption({ options: option.children, id })
            if (result) {
                return result
            }
        }
    }
    return result
}

// 默认的四个分类图标
const image1 = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_course.png'
const image2 = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_book.png'
const image3 = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_education.png'
const image4 = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_surrounding.png'

const defaultModel = {
    id: '',
    type: '',
    image: '',
    name: '',
    value: '',
    valueName: '',
    goodsInfo: ''
}
const defaultModel1 = {
    ...defaultModel,
    image: image1
}
const defaultModel2 = {
    ...defaultModel,
    image: image2
}
const defaultModel3 = {
    ...defaultModel,
    image: image3
}
const defaultModel4 = {
    ...defaultModel,
    image: image4
}

@Component({
    components: {
        Draggable,
        ImageManager
    }
})
export default class EditorClassify extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) data!: TemplateModule

    // 级联选择器的的 option，若没有传则用 defaultOptions
    @Prop({
        type: Array,
        default () {
            return []
        }
    }) options!: OptionsItem[]

    /* data */
    dragging = false
    currentImgIndex!: number
    defaultOptions: OptionsItem[] = []

    /* computed */
    @goods.Getter('categoryTree') categoryTree!: any

    get max () {
        return this.data.number
    }

    // get selectedList () {
    //     return this.data.values.map(item => item.value).filter(id => id)
    // }

    created () {
        if (this.categoryTree) {
            this.defaultOptions = getCascaderOptions(this.categoryTree)
        }
    }

    /* methods */

    // 将级联选择器已选择的项目禁选
    // setDisable () {
    //     console.log('selected', this.selectedList)
    //     for (const id of this.selectedList) {
    //         const option = findOption({
    //             options: this.defaultOptions,
    //             id
    //         })
    //         if (option) {
    //             option.disabled = true
    //         }
    //     }
    // }

    // 增加分类时找出没有使用的图像填充到队列中
    findDefaultModel () {
        const arr = [defaultModel1, defaultModel2, defaultModel3, defaultModel4]
        for (const model of arr) {
            if (!this.data.values.find(item => item.image === model.image)) {
                return model
            }
        }
        return defaultModel
    }

    onRadioChange (val: number) {
        if (val === 3) {
            this.data.values = this.data.values.slice(0, 3)
        }
    }

    onCascaderChange (selected: string[], item: TemplateModuleItem) {
        if (!selected.length) return false

        // @ts-ignore
        // const cascader = this.$refs[`cascader-${ index }`][0]
        // if (cascader) {
        //     const selectedOption = cascader.getCheckedNodes()
        // }

        const selectedOption = findOption({
            options: this.options.length ? this.options : this.defaultOptions,
            id: selected[selected.length - 1]
        })

        item.value = selected.join(',')
        item.name = selectedOption?.label || ''
    }

    selectImage (index: number) {
        this.currentImgIndex = index
        // @ts-ignore
        this.$refs['image-manager'].showSelectImageBox()
    }

    uploadSuccess (urls: string[]) {
        this.data.values[this.currentImgIndex].image = urls[0]
    }

    add () {
        if (this.data.values.length >= this.max) return
        this.data.values.push(this.findDefaultModel())
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
.editor-classify {
    .el-icon-close {
        font-size: 16px;
        cursor: pointer;
        &::before {
            color: #666;
        }
    }
    .el-icon-plus {
        margin-right: 6px;
        font-size: 16px;
        &::before {
            color: #666;
        }
    }
    .el-icon-delete-solid {
        font-size: 22px;
        cursor: pointer;
        &::before {
            color: #999;
        }
    }
    .el-cascader {
        width: 100%;
    }
}
</style>
<style module lang="scss">
.editor-classify {
    width: 330px;
    background: #fff;
    border: 1px solid rgba(231,231,231,1);
    box-shadow: 0 0 12px rgba(0,0,0,.1);
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
        color: #999;
        border-bottom: 1px solid #ccc;
    }
    &-content {
        padding: 20px 0;
        font-size: 14px;
        line-height: 24px;
        color: #999;
    }

    &-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        height: 86px;
        background-color: #f9f9f9;
        cursor: pointer;
        .img-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            width: 50px;
            height: 50px;
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
            background: rgba(0, 0, 0, .4);
            opacity: 1;
            color: #fff;
            font-size: 12px;
            line-height: 16px;
        }
        .operation {
            flex: 1;
            width: 0;
            padding: 0 7px 0 10px;
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
        color: #666;
        background: #f4f4f4;
        border: none;
        cursor: pointer;
    }
    .important {
        &::after {
            content: '*';
            color: #e83323;
        }
    }
}
.link {
    flex: 1;
}
.suggestion {
    margin-top: 30px;
    font-size: 12px;
    line-height: 16px;
    color: #999999;
    text-align: center;
}

</style>
