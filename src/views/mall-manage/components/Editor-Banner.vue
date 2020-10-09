<template>
    <div class="editor-banner" :class="$style.editorBanner" v-if="show">
        <div :class="$style.editorBannerHeader">
            Banner
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorBannerContent">
            <label :class="$style.important">
                添加图片
            </label>
            <p>
                {{ `建议尺寸${width}x${height}，大小小于3MB，最少添加一个，鼠标拖拽调整广告顺序。` }}
            </p>
            <Draggable
                :class="$style.editorBannerList"
                :list="data.values"
                tag="ul"
                animation="200"
                ghost-class="ghost"
                @start="dragging=true"
                @end="dragging=false"
            >
                <li :class="$style.editorBannerListItem" v-for="(item, index) of data.values" :key="index">
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
                    <div :class="$style.operate">
                        <el-input
                            v-model.trim="item.name"
                            placeholder="图片标题"
                            maxlength="10"
                            style="margin-bottom: 6px;"
                        />
                        <div :class="$style.link">
                            <el-input
                                v-model.trim="item.valueName"
                                placeholder="选择跳转路径"
                                disabled
                            />
                            <el-cascader
                                :ref="`cascader-${index}`"
                                v-model="cascaderValue"
                                :options="options"
                                :props="{ expandTrigger: 'hover' }"
                                @change="value => onCascaderChange(value, item, index)"
                            />
                        </div>
                    </div>
                    <div style="width: 28px;">
                        <i v-if="data.values.length > 1" class="el-icon-delete-solid" @click.stop="remove(index)" />
                    </div>
                </li>
            </Draggable>
            <button
                v-if="data.values && data.values.length < max"
                :class="$style.editorBannerBtn"
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
import { TemplateModule, TemplateModuleItem, ModalType } from '../utils/types'
import Draggable from '../../../components/common/draggable'
import ImageManager from '../../../components/common/file/Image-Manager.vue'
import { findBrothersComponents } from '../utils/helper'

@Component({
    components: {
        Draggable,
        ImageManager
    }
})
export default class EditorBanner extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) data!: TemplateModule

    @Prop({
        type: Number,
        default: 750
    }) width!: number

    @Prop({
        type: Number,
        default: 500
    }) height!: number

    @Prop({
        type: Number,
        default: 10
    }) max!: number

    /* data */
    dragging = false
    currentImgIndex!: number
    cascaderValue = []
    options = Object.freeze([{
        value: 1,
        label: '商品及分类'
    }, {
        value: 3,
        label: '知识商品'
    }, {
        value: 4,
        label: '营销活动',
        children: [{
            value: 41,
            label: '全民来分销'
        }, {
            value: 42,
            label: '众志成团'
        }, {
            value: 43,
            label: '预购享翻倍'
        }, {
            value: 44,
            label: '限时秒杀'
        }, {
            value: 45,
            label: '组合聚惠学'
        // }, {
        //     value: 46,
        //     label: '防疫情报站'
        // }, {
        //     value: 47,
        //     label: '疫情签到'
        }, {
            value: 48,
            label: '公益棕行动'
        }, {
            value: 49,
            label: '端午佳话粽粽有礼'
        }, {
            value: 410,
            label: '龙门抽大奖'
        }]
    }, {
        value: 5,
        label: '互动直播'
    }, {
        value: 6,
        label: '店铺主页'
    }])

    add () {
        if (this.data.values.length >= this.max) return
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

    /* methods */
    selectImage (index: number) {
        this.currentImgIndex = index
        // @ts-ignore
        this.$refs['image-manager'].showSelectImageBox()
    }

    uploadSuccess (urls: string[]) {
        this.data.values[this.currentImgIndex].image = urls[0]
    }

    onCascaderChange ([val, subVal]: number[], item: TemplateModuleItem, index: number) {
        const { options } = this
        if (!val) return false

        if (val === 1) {
            this.openModal({
                modalType: ModalType.ProductAndCategoryModal, // 商品/分类列表弹窗
                radio: item.value,
                index
            })
        } else if (val === 3) {
            this.openModal({
                modalType: ModalType.CourseModal, // 知识课程列表弹窗
                radio: item.value,
                index
            })
        } else if (val === 4) {
            const option = options.find(option => option.value === val)
            const children = option && option.children ? option.children : []
            const child = children.find(option => option.value === subVal)
            item.type = child && child.value ? child.value : ''
            item.valueName = child && child.label ? child.label : ''
            item.value = ''
        } else {
            const child = options.find(option => option.value === val)
            item.type = child && child.value ? child.value : ''
            item.valueName = child && child.label ? child.label : ''
            item.value = ''
        }

        // 清空选中记录
        this.cascaderValue = []
    }

    openModal (params: { modalType: number; radio: string; index: number }) {
        const list = findBrothersComponents(this, 'ModalProdCategory')
        if (list.length) {
            // @ts-ignore
            list[0].open(params)
        }
    }

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-banner {
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
        margin-right: 6px;
        font-size: 22px;
        cursor: pointer;
        &::before {
            color: #999;
        }
    }
    .el-input--small .el-input__inner {
        padding: 8px;
    }
    .el-input.is-disabled .el-input__inner {
        border: none;
        background-color: #fff;
    }
    .el-cascader {
        width: 45px;
        border-left: 1px solid #dedede;
        > .el-input {
            > input {
                opacity: 0 !important;
            }
        }
    }
    .el-popper.el-cascader__dropdown {
        .el-cascader-menu__wrap {
            height: auto !important;
        }
    }
}
</style>
<style module lang="scss">
.editor-banner {
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
        background-color: #f9f9f9;
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
            height: 43px;
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
        .operate {
            display: block;
            flex: 1;
            padding: 0 7px 0 10px;
        }
        .link {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            border: 1px solid #e4e7ed;
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

</style>
