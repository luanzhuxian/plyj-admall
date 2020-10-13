<template>
    <div class="editor-module" :class="$style.editorModule" v-if="show">
        <div :class="$style.editorModuleHeader">
            {{ title }}
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorModuleContent">
            <div :class="$style.editorModuleFormItem" v-if="!hideInput">
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

            <div :class="$style.editorModuleFormItem" v-if="!hideRadio">
                <label :class="$style.important">
                    <!-- {{ isClass ? '课程来源' : '商品来源' }} -->
                    商品来源
                </label>
                <el-radio v-if="isClass" v-model="data.goodsSource" :label="3" @change="onRadioChange">
                    商品
                </el-radio>
                <el-radio v-else v-model="data.goodsSource" :label="2" @change="onRadioChange">
                    商品
                </el-radio>
                <el-radio v-model="data.goodsSource" :label="1" @change="onRadioChange">
                    <!-- {{ isClass ? '分类' : '商品分类' }} -->
                    分类
                </el-radio>
            </div>
            <div v-else>
                {{ subTitle }}
            </div>

            <div :class="$style.editorModuleOperation">
                <div :class="$style.editorModuleProduct" v-if="data.goodsSource === 2 || data.goodsSource === 3">
                    <Draggable
                        :list="data.values"
                        tag="ul"
                        animation="200"
                        ghost-class="ghost"
                        @start="dragging=true"
                        @end="dragging=false"
                    >
                        <li :class="$style.editorModuleProductItem" v-for="(item, i) of data.values" :key="i">
                            <template v-if="moduleType && moduleType === 16">
                                <div :class="$style.imgWrapper">
                                    <img
                                        v-imgError
                                        v-if="item.combinationDetailList && item.combinationDetailList.length"
                                        :src="item.combinationDetailList[0].imageUrl + '?x-oss-process=style/thum-small'"
                                    >
                                    <img src="" v-else>
                                </div>
                                <div :class="$style.info">
                                    <span>{{ item.activityName }}</span>
                                </div>
                            </template>
                            <template v-else>
                                <div :class="$style.imgWrapper">
                                    <img v-imgError :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-small'">
                                </div>
                                <div :class="$style.info">
                                    <span>{{ item.goodsInfo.productName }}</span>
                                </div>
                            </template>
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
                        :class="$style.editorModuleBtn"
                        type="button"
                        @click.stop="add('ModalProd')"
                    >
                        <i class="el-icon-plus" />
                        <span>{{ `添加${data.values.length}/${max}` }}</span>
                    </button>
                </div>
                <div :class="$style.editorModuleCategory" v-else>
                    <div :class="$style.left">
                        <div :class="$style.formItem">
                            <label>商品分组：</label>
                            <span @click="add('ModalProdCategory')">
                                {{ data.otherValue ? `商品分类 - ${data.otherValue}>` : '从商品分组中选择>' }}
                            </span>
                        </div>
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
                        <span :class="$style.sug">{{ `(商品最多可选择${max}个)` }}</span>
                    </div>
                    <i class="el-icon-delete-solid" @click.stop="remove" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable no-underscore-dangle */

import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import Draggable from '../../../components/common/draggable'
import { updateModule } from '../../../apis/mall'
import { findBrothersComponents } from '../utils/helper'
import { TemplateModule } from '../utils/types'
import { TemplateTypes, ModuleIds } from '../utils/map'

const editorMap: DynamicObject = {
    2: {
        title: '商品（仅支持实物、虚拟及代销商品）',
        subTitle: '',
        max: 9,
        min: 1
    },
    3: {
        title: '商品',
        subTitle: '',
        max: 12,
        min: 1
    },
    // '3': {
    //   title: '疯抢',
    //   max: 12
    // },
    8: {
        title: '团购',
        subTitle: '添加商品',
        max: 6,
        min: 0
    },
    11: {
        title: '预购',
        subTitle: '添加商品',
        max: 6,
        min: 0
    },
    10: {
        title: '秒杀',
        subTitle: '添加商品',
        max: 6,
        min: 0
    },
    16: {
        title: '组合课',
        subTitle: '添加活动',
        max: 8,
        min: 0
    },
    18: {
        title: '全民来分销',
        subTitle: '添加商品',
        max: 6,
        min: 0
    }
}

@Component({
    components: { Draggable }
})
export default class EditorModule extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    // 禁止编辑模块标题
    @Prop(Boolean) disabled!: boolean
    // 隐藏编辑名字的输入框
    @Prop(Boolean) hideInput!: boolean
    // 隐藏单选
    @Prop(Boolean) hideRadio!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
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

    get isClass () {
        return this.moduleType === ModuleIds.Class
    }

    get title () {
        if (!this.moduleType) return 0
        return editorMap[this.moduleType].title
    }

    get subTitle () {
        if (!this.moduleType) return ''
        return editorMap[this.moduleType].subTitle
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
    add (modalName: string) {
        // moduleType: 模块的id
        const { moduleType, goodsSource, otherInfo } = this.data
        const list = findBrothersComponents(this, modalName)
        if (list.length) {
            // @ts-ignore
            list[0].open({
                modalType: this.hideRadio ? moduleType : goodsSource,
                radio: otherInfo,
                ...(moduleType === ModuleIds.Miaosha ? { range: [] } : null)
            })
        }
    }

    async remove (index: number) {
        // 1 分类 2、3商品
        if (this.data.goodsSource === 1) {
            this.data.otherValue = ''
            this.data.otherInfo = ''
            this.data.number = 1
            this.getProductsByCategory(this.data)
        } else {
            await this.$confirm({
                title: '确认删除？',
                message: '删除后不可恢复'
            })
            this.data.values.splice(index, 1)
            this.$forceUpdate()
        }
    }

    onRadioChange (val: number) {
        if (val === 1 && this.data.categoryValues) {
            this.data.values = this.data.categoryValues
        }
        if (val === 2 && this.data.productValues) {
            this.data.values = this.data.productValues
        }
    }

    onInputChange () {
        // 没有选择分类则不查询商品
        if (!this.data.otherInfo) return
        this.getProductsByCategory(this.data)
    }

    async getProductsByCategory (module = this.data) {
        const _module = JSON.parse(JSON.stringify(module))
        Reflect.deleteProperty(_module, 'values')
        Reflect.deleteProperty(_module, 'productValues')
        Reflect.deleteProperty(_module, 'categoryValues')

        const { result: { values } } = await updateModule(_module)
        this.data.categoryValues = values.length ? values : []
        this.data.values = this.data.categoryValues ? this.data.categoryValues : []
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
        .sug {
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
