<template lang="html">
    <div class="editor-sort" :class="$style.editorSort" v-if="show">
        <div :class="$style.editorSortHeader">
            排序展示
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorSortContent">
            <div :class="$style.editorSortFormItem">
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
            <div :class="$style.editorSortFormItem">
                <label :class="$style.important">
                    排序方式
                </label>
                <el-radio v-model="data.sortType" :label="1" @change="() => onChange()">
                    按照销量顺序
                </el-radio>
                <el-radio v-model="data.sortType" :label="2" @change="() => onChange()">
                    按照推荐顺序
                </el-radio>
            </div>
            <div :class="$style.editorSortFormItem">
                <label :class="$style.important" style="width: 86px;">
                    展示数量
                </label>
                <el-input-number
                    v-model.trim="data.number"
                    :min="1"
                    :max="30"
                    @change="() => onChange()"
                />
            </div>
            <div :class="$style.editorSortFormItem">
                <el-radio
                    v-model="data.remDuplicate"
                    :label="1"
                    @click.native.stop.prevent="onRadioChange"
                >
                    商品/课程去重（展示内容将去掉其余模块已添加商品/课程）
                </el-radio>
            </div>
            <!-- <div :class="$style.editorSortFormItem">
                <label :class="$style.important">
                展示类型
                </label>
                <el-radio v-model="data.goodsSource" :label="2" @change="onRadioChange">
                商品（实物、虚拟及代销商品）
                </el-radio>
                <el-radio v-model="data.goodsSource" :label="3" @change="onRadioChange">
                课程
                </el-radio>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable no-underscore-dangle */

import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModule, TemplateModuleItem } from '../utils/types'
import { updateModule } from '../../../apis/mall'

@Component
export default class EditorSort extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    @Prop(Boolean) disabled!: boolean
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) data!: TemplateModule

    /* methods */
    onRadioChange () {
        this.data.remDuplicate = Number(!this.data.remDuplicate)
        this.onChange()
    }

    // 查询精品推荐模块数据，用于去重
    // styleType: 1 瀑布流形式 2 精品推荐大图形式
    // onRadioChange (val) {
    //   this.data.styleType = val === 2 ? 1 : 2
    //   this.getData(this.data)
    // },
    async getData (module = this.data) {
        const _module = JSON.parse(JSON.stringify(module))
        Reflect.deleteProperty(_module, 'values')

        const { result } = await updateModule(_module)
        return result.values || []
    }

    // 去重
    rmDuplicate (list: TemplateModuleItem[]) {
        if (!list.length) return list
        // @ts-ignore
        const modules = this.$parent.moduleModels
        const names = ['Popular', 'Class', 'FengQiang']
        const arr = names
            .reduce((acc: TemplateModuleItem[], current) => {
                const prods = modules[current] && modules[current].values ? modules[current].values : []
                return acc.concat(prods)
            }, [])
            .filter(prod => !!prod.value)
            .map(prod => prod.value)
        return list.length ? list.filter(prod => !arr.includes(prod.value)) : []
    }

    validate (list: []) {
        if (!list.length) this.$warning('精品推荐模块，若选择“按推荐排序”，需先去“商品管理-推荐榜单”中添加商品')
        return list
    }

    async onChange () {
        // let values = await this.getData()
        // if (this.data.sortType === 2 && !values.length) {
        //   this.$warning('精品推荐模块，若选择“按推荐排序”，需先去“商品管理-推荐榜单”中添加商品')
        // }
        // if (this.data.remDuplicate && values.length) {
        //   values = this.rmDuplicate(values)
        // }
        // this.data.values = values
        // if (this.data.styleType === 1) { // 瀑布流
        //   this.data.left = values.length ? values.filter((item, i) => i % 2 === 0) : []
        //   this.data.right = values.length ? values.filter((item, i) => i % 2 === 1) : []
        // }
        const compose = (...fns: Function[]) => (args: any) => fns.reduceRight(async (promise, fn) => {
            const result = await fn(await promise)
            return result
        }, args)
        const task = [
            ...(this.data.remDuplicate ? [this.rmDuplicate] : []),
            ...(this.data.sortType === 2 ? [this.validate] : []),
            this.getData
        ]
        const taskRunner = compose(...task)
        this.data.values = await taskRunner(this.data)
    }

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-sort {
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
.editor-sort {
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
    margin-bottom: 16px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    label {
      margin-right: 16px;
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
