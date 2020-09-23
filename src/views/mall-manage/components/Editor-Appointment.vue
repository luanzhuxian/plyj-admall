<template lang="html">
    <div class="editor-appointment" :class="$style.editorAppointment" v-if="show">
        <div :class="$style.editorAppointmentHeader">
            在线预约
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorAppointmentContent">
            <ul :class="$style.editorAppointmentList">
                <li :class="$style.editorAppointmentListItem" v-for="(item, index) of data.values" :key="index">
                    <label>{{ map[index] }}</label>
                    <el-input
                        v-model.trim="item.value"
                        placeholder="请输入12字以内的条件"
                        maxlength="12"
                    />
                </li>
            </ul>
            <button
                v-if="data.values && data.values.length < max"
                :class="$style.editorAppointmentBtn"
                type="button"
                @click.stop="add"
            >
                <i class="el-icon-plus" />
                <span>{{ `添加${data.values.length}/${max}` }}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModule } from '../utils/types'

@Component
export default class EditorAppointment extends Vue {
    /* props */
    @Prop(Boolean) show!: boolean
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) data!: TemplateModule

    /* data */
    max = 4
    map = Object.freeze({
        0: '条件一：',
        1: '条件二：',
        2: '条件三：',
        3: '条件四：'
    })

    /* methods */
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

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-appointment {
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
    .el-input--small .el-input__inner {
        padding: 8px;
    }
    .el-input.is-disabled .el-input__inner {
        border: none;
        background-color: #FFF;
    }
}
</style>
<style module lang="scss">
.editor-appointment {
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

    &-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        label {
        margin-right: 16px;
        width: 70px;
        font-size: 14px;
        line-height: 24px;
        color: #999999;
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
}
</style>
