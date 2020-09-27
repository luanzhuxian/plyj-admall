<template lang="html">
    <div class="editor-miaosha" :class="$style.editorMiaosha" v-if="show">
        <div :class="$style.editorMiaoshaHeader">
            秒杀
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorMiaoshaContent">
            <div :class="$style.editorMiaoshaFormItem" v-if="false">
                <label :class="$style.important">
                    模块标题
                </label>
                <el-input
                    v-model.trim="data.moduleName"
                    placeholder="请输入10字以内的标题"
                    maxlength="10"
                    :disabled="disabled"
                />
            </div>
            <div>添加秒杀场次</div>
            <div>最多添加3场，每场最多添加5个商品</div>
            <div :class="$style.editorMiaoshaList">
                <div :class="$style.editorMiaoshaListItem" v-for="(item, i) of data.values" :key="i">
                    <div :class="$style.title">
                        <span>
                            {{ `第${i === 0 ? '一' : i === 1 ? '二' : i === 2 ? '三' : ''}场（${item.goodsInfo.length}/5）` }}
                        </span>
                        <div style="width: 28px;">
                            <i class="el-icon-delete-solid" @click.stop="remove(i)" />
                        </div>
                    </div>
                    <el-date-picker
                        v-model="item.range"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :editable="false"
                        :picker-options="{
                            disabledDate: dateDisabled
                        }"
                        @change="(val) => {
                            onDatePickerChange(val, i)
                        }"
                        style="margin: 0 0 20px;"
                    />
                    <Draggable
                        :class="$style.prodList"
                        :list="item.goodsInfo"
                        tag="ul"
                        animation="200"
                        ghost-class="ghost"
                        @start="dragging=true"
                        :editable="false"
                        @end="dragging=false"
                    >
                        <li :class="$style.prodListItem" v-for="(prod, j) of item.goodsInfo" :key="j">
                            <div :class="$style.close" @click.stop="removeProd(item, j)">
                                <i class="el-icon-close" />
                            </div>
                            <div :class="$style.imgWrapper">
                                <img :src="prod.productMainImage + '?x-oss-process=style/thum-small'">
                            </div>
                        </li>
                        <button
                            :class="$style.prodListBtn"
                            v-if="item.range && item.range.length === 2 && item.goodsInfo.length < 5"
                            type="button"
                            @click.stop="addProd(i)"
                        >
                            <i class="el-icon-plus" />
                        </button>
                    </Draggable>
                </div>
            </div>
            <button
                v-if="data.values && data.values.length < 3"
                :class="$style.editorMiaoshaBtn"
                type="button"
                @click.stop="add"
            >
                <i class="el-icon-plus" />
                <span>{{ `添加${data.values.length}/3` }}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModule, TemplateModuleItem } from '../utils/types'
import moment from 'moment'
import Draggable from '../../../components/common/draggable'
import { findBrothersComponents, isPlainObject } from '../utils/helper'

@Component({
    components: { Draggable }
})
export default class EditorMiaosha extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    // 禁止编辑模块标题
    @Prop(Boolean) disabled!: boolean
    // 商品列表是否可以删光
    @Prop(Boolean) notDeleteAll!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) data!: TemplateModule

    /* props */
    dragging = false

    /* methods */
    dateDisabled (val: Date) {
        return val.getTime() < Date.now() - 8.64e7
    }

    add () {
        this.data.values.push({
            goodsInfo: [],
            id: '',
            type: '',
            image: '',
            name: '',
            value: '',
            valueName: '',
            range: []
        })
    }

    addProd (index: number) {
        const { moduleType, values } = this.data
        const item = values[index]

        if (item) {
            const startTime = (item.range && item.range.length && item.range[0])
                ? moment(item.range[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
            const endTime = (item.range && item.range.length && item.range[1])
                ? moment(item.range[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
            // this.$emit('open', { modalType: moduleType, index, range: [startTime, endTime] })
            const list = findBrothersComponents(this, 'ModalProd')
            if (list.length) {
                // @ts-ignore
                list[0].open({
                    modalType: moduleType,
                    range: [startTime, endTime],
                    index
                })
            }
        }
    }

    async remove (index: number) {
        await this.$confirm({
            title: '确认删除该场次？',
            message: '删除后不可恢复'
        })
        this.data.values.splice(index, 1)
        this.$forceUpdate()
    }

    removeProd (item: TemplateModuleItem, index: number) {
        if (isPlainObject<DynamicObject>(item.goodsInfo) && !(item.goodsInfo instanceof Array)) {
            item.goodsInfo.splice(index, 1)
            this.$forceUpdate()
        }
    }

    onDatePickerChange (val: string[], index: number) {
        if (!val) return

        const time = val[0]
        let pass = true
        if (index > 0) {
            for (let i = index - 1; i >= 0; i--) {
                const { range } = this.data.values[i]
                if (range && range[0] && time < range[0]) {
                    pass = false
                }
            }
            if (!pass) {
                this.$warning('场次的开始时间不能早于之前场次的开始时间')
                this.data.values[index].range = []
            }
        }
        if (index < this.data.values.length) {
            for (let i = index + 1; i < this.data.values.length; i++) {
                const { range } = this.data.values[i]
                if (range && range[0] && time > range[0]) {
                    pass = false
                }
            }
            if (!pass) {
                this.$warning('场次的开始时间不能晚于之后场次的开始时间')
                this.data.values[index].range = []
            }
        }
        this.data.values[index].goodsInfo = []
    }

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-miaosha {
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
.editor-miaosha {
  width: 455px;
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
    label {
      margin-right: 16px;
    }
  }

  &-list {
    &-item {
      border-top: 1px solid #F4F4F4;
      padding-top: 10px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
      }
      .prod-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        &-item {
          position: relative;
          margin-right: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          .close {
            position: absolute;
            top: -5px;
            right: -5px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 16px;
            height: 16px;
            background: #FFF;
            border: 1px solid #333;
            border-radius: 50%;
            overflow: hidden;
          }
          i {
            font-size: 3px;
            font-weight: bold;
          }
          .img-wrapper {
            width: 72px;
            height: 72px;
            object-fit: cover;
            border-radius: 5px;
            overflow: hidden;
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        &-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
          width: 72px;
          height: 72px;
          line-height: 72px;
          color: #666666;
          background: #F4F4F4;
          border: none;
          cursor: pointer;
          i {
            margin: 0;
          }
        }
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
