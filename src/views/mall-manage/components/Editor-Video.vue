<template>
    <div class="editor-module" :class="$style.editorModule" v-if="show">
        <div :class="$style.editorModuleHeader">
            {{ title }}
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorModuleContent">
            <div :class="$style.editorModuleFormItem">
                <label :class="$style.important">
                    模块标题
                </label>
                <el-input
                    v-model.trim="data.moduleName"
                    placeholder="请输入4字以内的标题"
                    maxlength="4"
                    :disabled="disabled"
                />
            </div>

            <div :class="$style.editorModuleFormItem">
                <label :class="$style.important">
                    展示样式
                </label>
                <el-radio v-model="data.styleType" :label="1" @change="onRadioChange">
                    默认显示
                </el-radio>
                <el-radio v-model="data.styleType" :label="2" @change="onRadioChange">
                    显示多个
                </el-radio>
            </div>

            <div :class="$style.editorModuleOperation" v-show="data.styleType === 2">
                <div :class="$style.editorModuleCategory" v-if="isLive">
                    <div :class="$style.left">
                        <div :class="$style.formItem">
                            <label>显示个数：</label>
                            <el-input-number
                                v-model.trim="data.number"
                                :min="1"
                                :max="max"
                                :precision="0"
                                @change="onInputChange"
                            />
                        </div>
                        <span :class="$style.suggestion">{{ `(最多可选择${max}个)` }}</span>
                    </div>
                </div>
                <div :class="$style.editorModuleProduct" v-if="isCourse || isImageText">
                    <Draggable
                        :list="data.values"
                        tag="ul"
                        animation="200"
                        ghost-class="ghost"
                        @start="dragging=true"
                        @end="dragging=false"
                    >
                        <li :class="$style.editorModuleProductItem" v-for="(item, i) of data.values" :key="i">
                            <div :class="$style.imgWrapper">
                                <img v-imgError :src="(isCourse ? item.goodsInfo.courseImg : item.goodsInfo.graphicMainImg) + '?x-oss-process=style/thum-small'">
                            </div>
                            <div :class="$style.info">
                                <span>{{ isCourse ? item.goodsInfo.courseName : item.goodsInfo.graphicName }}</span>
                            </div>
                            <div style="width: 28px;">
                                <i
                                    v-show="data.values.length > min"
                                    class="el-icon-delete-solid"
                                    @click.stop="remove(i)"
                                />
                            </div>
                        </li>
                    </Draggable>
                    <button
                        v-if="data.values.length < max"
                        type="button"
                        :class="$style.editorModuleBtn"
                        @click.stop="add('ModalProd')"
                    >
                        <i class="el-icon-plus" />
                        <span>{{ `添加${data.values.length}/${max}` }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable no-underscore-dangle */

import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModule, TemplateTypes, ModuleIds } from '../utils/types'
import Draggable from '../../../components/common/draggable'
import {
    updateModule,
    getLiveInfo,
    getCourseInfo,
    getImageTextList
} from '../../../apis/mall'
import { findBrothersComponents } from '../utils/helper'

const editorMap: DynamicObject = {
    20: {
        title: '互动直播（仅支持直播内容）',
        max: 12,
        min: 0
    },
    21: {
        title: '知识课程（仅支持知识课程）',
        max: 12,
        min: 0
    },
    22: {
        title: '系列课（仅支持系列课程）',
        max: 12,
        min: 0
    },
    23: {
        title: '图文资料',
        max: 12,
        min: 0
    }
}

@Component({
    components: { Draggable }
})
export default class EditorVideo extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    // 禁止编辑模块标题
    @Prop(Boolean) disabled!: boolean
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) data!: TemplateModule

    /* data */
    dragging = false
    editorMap = Object.freeze(editorMap)

    /* computed */
    get tmplType () {
        // @ts-ignore
        return this.$parent.tmplType
    }

    get moduleType () {
        return this.data.moduleType
    }

    get isLive () {
        return this.data.moduleType === ModuleIds.Live
    }

    get isCourse () {
        return ~[ModuleIds.OnlineCourse, ModuleIds.SeriesCourse].indexOf(this.data.moduleType)
    }

    get isImageText () {
        return this.data.moduleType === ModuleIds.ImageText
    }

    get title () {
        if (!this.moduleType) return 0
        return editorMap[this.moduleType].title
    }

    get max () {
        if (!this.moduleType) return 0
        return this.tmplType === TemplateTypes.TemplateDragonGate ? 6 : editorMap[this.moduleType].max
    }

    get min () {
        if (!this.moduleType) return 0
        return ~[TemplateTypes.TemplateD, TemplateTypes.TemplateDragonGate].indexOf(this.tmplType) ? 1 : editorMap[this.moduleType].min
    }

    /* methods */
    async getDefaultLiveInfo () {
        try {
            const { result } = await getLiveInfo()
            const { nowCount = 0, futrueCount = 0, pastCount = 0, liveModel = [] } = result
            this.data.defaultValues = liveModel.slice(0, 1)
            this.data.values = this.data.defaultValues ? this.data.defaultValues : []
            Object.assign(this.data, {
                otherValue: `${ nowCount },${ futrueCount },${ pastCount }`,
                nowCount,
                futrueCount,
                pastCount
            })
        } catch (error) {
            throw error
        }
    }

    async getDefaultCourseInfo () {
        try {
            const { moduleType } = this
            const courseType = moduleType === ModuleIds.OnlineCourse ? 1 : 2
            const { result } = await getCourseInfo({ courseType })
            this.data.defaultValues = result.records.length
                ? [{
                    goodsInfo: result.records[0],
                    id: '',
                    image: '',
                    name: '',
                    serverTime: '',
                    shoppingStatus: '',
                    shoppingTime: '',
                    type: '',
                    value: '',
                    valueName: ''
                }]
                : []
            this.data.values = this.data.defaultValues
            this.data.otherValue = result.total
        } catch (error) {
            throw error
        }
    }

    async getImageTextInfo () {
        try {
            const { result } = await getImageTextList()
            this.data.defaultValues = result.records.length
                ? [{
                    goodsInfo: result.records[0],
                    id: '',
                    image: '',
                    name: '',
                    serverTime: '',
                    shoppingStatus: '',
                    shoppingTime: '',
                    type: '',
                    value: '',
                    valueName: ''
                }]
                : []
            this.data.values = this.data.defaultValues
            this.data.otherValue = result.total
        } catch (error) {
            throw error
        }
    }

    async updateLiveModule (module = this.data) {
        try {
            const _module = JSON.parse(JSON.stringify(module))
            Reflect.deleteProperty(_module, 'values')
            Reflect.deleteProperty(_module, 'defaultValues')
            Reflect.deleteProperty(_module, 'backupValues')
            Reflect.deleteProperty(_module, 'nowCount')
            Reflect.deleteProperty(_module, 'futrueCount')
            Reflect.deleteProperty(_module, 'pastCount')

            const { result: { otherValue, values } } = await updateModule(_module)
            const [nowCount = 0, futrueCount = 0, pastCount = 0] = otherValue.split(',')
            this.data.backupValues = values
            this.data.values = this.data.backupValues ? this.data.backupValues : []
            Object.assign(module, {
                otherValue,
                nowCount,
                futrueCount,
                pastCount
            })
        } catch (error) {
            throw error
        }
    }

    async onRadioChange (val: number) {
        const { data, isLive, isCourse, isImageText } = this
        try {
            if (isLive) {
                if (val === 1) {
                    if (data.defaultValues && data.defaultValues.length) {
                        data.values = data.defaultValues
                    } else {
                        await this.getDefaultLiveInfo()
                    }
                }
                if (val === 2) {
                    if (data.backupValues && data.backupValues.length) {
                        data.values = data.backupValues
                    } else {
                        await this.updateLiveModule()
                    }
                }
            }
            if (isCourse) {
                if (val === 1) {
                    if (data.defaultValues && data.defaultValues.length) {
                        data.values = data.defaultValues
                    } else {
                        await this.getDefaultCourseInfo()
                    }
                }
                if (val === 2) {
                    data.values = data.backupValues ? data.backupValues : []
                }
            }
            if (isImageText) {
                if (val === 1) {
                    if (data.defaultValues && data.defaultValues.length) {
                        data.values = data.defaultValues
                    } else {
                        await this.getImageTextInfo()
                    }
                }
                if (val === 2) {
                    data.values = data.backupValues ? data.backupValues : []
                }
            }
        } catch (error) {
            throw error
        }
    }

    async onInputChange () {
        try {
            await this.updateLiveModule()
        } catch (error) {
            throw error
        }
    }

    add (modalName: string) {
        // moduleType: 模块的id
        const { moduleType } = this.data
        const [modal] = findBrothersComponents(this, modalName)
        if (modal) {
            // @ts-ignore
            modal.open({
                modalType: moduleType
            })
        }
    }

    async remove (index: number) {
        await this.$confirm({
            title: '确认删除？',
            message: '删除后不可恢复'
        })
        this.data.values.splice(index, 1)
        this.$forceUpdate()
    }

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-module {
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
    .el-radio__label {
        font-size: 12px;
        padding-left: 8px;
    }
    .el-input--small .el-input__inner {
        padding: 8px;
    }
}

</style>

<style module lang="scss">
.editor-module {
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
    &-form-item {
        margin-bottom: 16px;
        label {
            margin-right: 16px;
        }
    }
    &-operation {
        border-top: 1px solid #f4f4f4;
        padding-top: 10px;
    }

    &-product-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        background-color: #f4f4f4;
        cursor: pointer;
        height: 52px;
        .img-wrapper {
            width: 52px;
            height: 52px;
        }
        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            flex: 1;
            padding: 12px;
            font-size: 12px;
            line-height: 15px;
            color: #666;
            @include elps-wrap(2);
            span {
                display: inline-block;
                max-height: 30px;
                overflow: hidden;
                word-break: break-all;
            }
        }
    }
    &-category {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 5px 18px 12px;
        background-color: #f4f4f4;
        font-size: 12px;
        color: #666;
        .form-item {
            display: flex;
            align-items: center;
            &:nth-of-type(1) {
                margin-bottom: 12px;
                @include elps();
                span {
                    display: inline-block;
                    max-width: 180px;
                    color: #598bf8;
                    cursor: pointer;
                    @include elps();
                }
            }
        }
        .suggestion {
            color: #999;
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
