<template lang="html">
    <div class="editor-coupon" :class="$style.editorCoupon" v-if="show">
        <div :class="$style.editorCouponHeader">
            {{ name }}
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorCouponContent">
            <div>{{ `添加${name}` }}</div>
            <div :class="$style.editorCouponOperation">
                <div :class="$style.editorCouponProduct">
                    <Draggable
                        :list="data.values"
                        tag="ul"
                        animation="200"
                        ghost-class="ghost"
                        @start="dragging=true"
                        @end="dragging=false"
                    >
                        <li :class="$style.editorCouponProductItem" v-for="(item, i) of data.values" :key="i">
                            <div :class="$style.info">
                                <div>{{ item.goodsInfo.couponName || item.goodsInfo.name }}</div>
                                <div>{{ `${item.goodsInfo.useStartTime && item.goodsInfo.useStartTime.split(' ')[0]} - ${item.goodsInfo.useEndTime && item.goodsInfo.useEndTime.split(' ')[0]}` }}</div>
                            </div>
                            <div style="width: 28px;">
                                <i class="el-icon-delete-solid" @click.stop="remove(i)" />
                            </div>
                        </li>
                    </Draggable>
                    <button
                        v-if="data.values.length < max"
                        :class="$style.editorCouponBtn"
                        type="button"
                        @click.stop="add"
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
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModule } from '../utils/types'
import { ModuleTypes } from '../utils/map'
import Draggable from '../../../components/common/draggable'
import { findBrothersComponents } from '../utils/helper'

@Component({
    components: { Draggable }
})
export default class EditorCoupon extends Vue {
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
        default: 3
    }) max!: number

    /* data */
    dragging = false
    inputCount = 1

    /* computed */
    get moduleType () {
        return this.data.moduleType
    }

    get name () {
        return this.moduleType === ModuleTypes.RedPackage ? '福利红包' : '优惠券'
    }

    /* methods */
    add () {
        const { moduleType, otherInfo } = this.data
        const [modal]: Vue[] = findBrothersComponents(this, 'ModalProd')
        if (modal) {
            // @ts-ignore
            modal.open({
                modalType: moduleType,
                radio: otherInfo
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
.editor-coupon {
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
.editor-coupon {
  width: 330px;
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
  &-operation {
    border-top: 1px solid #F4F4F4;
    padding-top: 10px;
  }

  &-product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    background-color: #F4F4F4;
    cursor: pointer;
    height: 52px;
    .info {
      flex: 1;
      padding: 12px;
      font-size: 12px;
      line-height: 15px;
      color: #666666;
      @include elps-wrap(2);
      span {
        display: inline-block;
        max-height: 30px;
        overflow: hidden;
        word-break: break-all;
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
