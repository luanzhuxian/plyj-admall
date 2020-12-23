<template>
    <div class="editor-activity" :class="$style.editorActivity" v-if="show">
        <div :class="$style.editorActivityHeader">
            活动模块
            <i class="el-icon-close" @click="close" />
        </div>
        <div :class="$style.editorActivityContent">
            <Draggable
                :class="$style.editorActivityList"
                :list="data.values"
                tag="ul"
                animation="200"
                ghost-class="ghost"
                @start="dragging=true"
                @end="dragging=false"
            >
                <li :class="$style.editorActivityListItem" v-for="(item, i) of data.values" :key="i">
                    <div :class="$style.operation">
                        <div :class="$style.link">
                            <template>
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
                :class="$style.editorActivityBtn"
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
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import Draggable from '../../../components/common/draggable'
import { TemplateModule } from '../utils/types'

@Component({
    components: {
        Draggable
    }
})
export default class EditorActivity extends Vue {
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
    defaultOptions = Object.freeze([{
        value: 'cloud',
        label: '云课堂',
        disabled: false
    }, {
        value: 'happy-lottery',
        label: '抽奖乐翻天',
        disabled: false
    }, {
        value: 'newyear-sign',
        label: '打卡聪明年',
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
    get max () {
        return 6
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

    @Emit()
    close () {
        return true
    }
}
</script>

<style lang="scss">
.editor-activity {
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
    // .el-select-dropdown {
    //     height: 290px !important;
    // }
}
</style>
<style module lang="scss">
.editor-activity {
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
