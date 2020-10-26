<template>
    <div class="editor-adv" :class="$style.editorAdv" v-if="show">
        <div :class="$style.editorAdvHeader">
            活动模块
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorAdvContent">
            <label :class="$style.important" v-if="isImgShow">
                添加图片
            </label>
            <p v-if="isImgShow">
                建议尺寸750x200，大小小于3MB，最少添加一个。
            </p>
            <Draggable
                :class="$style.editorAdvList"
                :list="data.values"
                tag="ul"
                animation="200"
                ghost-class="ghost"
                @start="dragging=true"
                @end="dragging=false"
            >
                <li :class="$style.editorAdvListItem" v-for="(item, i) of data.values" :key="i">
                    <div :class="$style.imgWrapper" v-if="isImgShow">
                        <img v-if="item.image" :src="item.image">
                        <div v-else :class="$style.defaultImg">
                            <PlSvg name="icon-icon--shangchuan" width="18" fill="#999" />
                            <span>上传图片</span>
                        </div>
                        <div :class="$style.mask" @click="selectImage(i)">
                            更换图片
                        </div>
                    </div>
                    <div :class="$style.operation">
                        <div :class="$style.link">
                            <template v-if="!isSelectShow">
                                <el-input v-model.trim="item.valueName" placeholder="选择跳转路径" disabled />
                                <div :class="$style.iconWrapper" @click="openModal">
                                    <i class="el-icon-arrow-right" />
                                </div>
                                <!-- <el-dropdown
                                    v-else
                                    trigger="click"
                                    @command="onDropdownSelect($event, index, item)"
                                >
                                    <span class="el-dropdown-link">
                                    <i class="el-icon-arrow-down el-icon--right" />
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-for="(option, j) of options"
                                        :key="j"
                                        :command="option.value"
                                    >
                                        {{ option.label }}
                                    </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown> -->
                            </template>
                            <template v-else>
                                <el-select
                                    :class="$style.select"
                                    v-model="item.value"
                                    placeholder="请选择"
                                    clearable
                                    :popper-append-to-body="false"
                                    @visible-change="(value) => !value && onSelectChange(i)"
                                >
                                    <el-option
                                        v-for="(option, j) in (options.length ? options : defaultOptions)"
                                        :key="j"
                                        :label="option.label"
                                        :value="option.value"
                                        :disabled="option.disabled"
                                    />
                                </el-select>
                            </template>
                        </div>
                    </div>
                    <div style="width: 28px;">
                        <i class="el-icon-delete-solid" @click.stop="remove(i)" />
                    </div>
                </li>
            </Draggable>
            <button
                v-if="data.values.length < max"
                :class="$style.editorAdvBtn"
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
            :width="750"
            :height="200"
            :size="0.5"
            :count="100"
            @change="uploadSuccess"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import Draggable from '../../../components/common/draggable'
import ImageManager from '../../../components/common/file/Image-Manager.vue'
import { findBrothersComponents } from '../utils/helper'
import { TemplateModule } from '../utils/types'
import { ModuleIds, ModalType } from '../utils/map'

@Component({
    components: {
        Draggable,
        ImageManager
    }
})
export default class EditorAdv extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) data!: TemplateModule

    @Prop({
        type: Array,
        default () {
            return []
        }
    }) options!: TemplateModule

    /* data */
    dragging = false
    currentImgIndex!: number
    defaultOptions = Object.freeze([{
        value: 'cloud',
        label: '云课堂',
        disabled: false
    }, {
        value: 'newyear',
        label: '我心中的年味',
        disabled: false
    }, {
        value: 'distribution',
        label: '全民来分销',
        disabled: false
    }, {
        value: 'dragon-gate-charity',
        label: '公益行动',
        disabled: false
    }, {
        value: 'dragon-gate-sign',
        label: '粽粽有礼',
        disabled: false
    }, {
        value: 'dragon-gate-play',
        label: '龙门抽大奖',
        disabled: false
    }])

    /* computed */
    get isImgShow () {
        return this.data.moduleType !== ModuleIds.Activity
    }

    get isSelectShow () {
        return this.data.moduleType === ModuleIds.Activity
    }

    get max () {
        return this.data.moduleType === ModuleIds.Activity ? 6 : 1
    }

    /* watch */
    @Watch('data', { immediate: true, deep: true })
    onChange (val: TemplateModule) {
        if (!val || !val.values) return

        const list = val.values.filter(item => item.value).map(item => item.value)
        for (const option of this.defaultOptions) {
            option.disabled = list.includes(option.value)
        }
    }

    /* methods */
    onSelectChange (index: number) {
        console.log(`select ${ index }`)
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

    openModal () {
        const list = findBrothersComponents(this, 'ModalProdCategory')
        if (list.length) {
            // @ts-ignore
            list[0].open({
                modalType: ModalType.ProductAndCategoryModal,
                index: 0,
                radio: this.data.values.length ? this.data.values[0].value : ''
            })
        }
    }

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-adv {
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
    .el-input--small .el-input__inner {
        padding: 8px;
    }
    .el-input.is-disabled .el-input__inner {
        border: none;
        background-color: #fff;
    }
    .el-select .el-input__inner {
        border: none !important;
    }
    .el-dropdown {
        color: #666;
        padding-right: 6px;
        cursor: pointer;
        border-left: 1px solid #dedede;
    }
    .el-select-dropdown {
        height: 290px !important;
    }
}
</style>
<style module lang="scss">
.editor-adv {
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
        .operation {
            flex: 1;
            width: 0;
            padding: 0 7px 0 10px;
        }
        .link {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            border: 1px solid #e4e7ed;
        }
        .icon-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 25px;
            color: #666;
            cursor: pointer;
            border-left: 1px solid #dedede;
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

.select {
    width: 100%;
}

</style>
