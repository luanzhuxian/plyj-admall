<template>
    <div class="custom-table" v-if="options.length">
        <el-table
            ref="table"
            :data="data"
            :row-key="getRowKeys"
            @selection-change="onCheckboxChange"
            style="width: 100%; min-height: 336px;"
        >
            <el-table-column
                v-if="isCheckbox"
                type="selection"
                width="55"
                align="right"
                :reserve-selection="true"
                :selectable="isCheckboxSelectable"
            />
            <el-table-column
                v-if="isRadio"
                width="50"
                align="center"
            >
                <template slot-scope="{ row }">
                    <el-radio
                        v-model="radioValue"
                        :label="row.id"
                        :disabled="isRadioDisable(row)"
                        @change.native="onRadioChange(row)"
                    />
                </template>
            </el-table-column>
            <template v-for="(item, index) in options">
                <slot :content="item">
                    <el-table-column
                        :key="item.id || index"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                    >
                        <template slot-scope="{ row }">
                            <div v-html="item.render(row)" v-if="item.render" />
                            <template v-else>
                                {{ row[item.prop] }}
                            </template>
                        </template>
                    </el-table-column>
                </slot>
            </template>
        </el-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CustomTable extends Vue {
    /* props */
    @Prop({
        type: Array,
        default: () => []
    }) readonly data!: { id: string }[]

    @Prop({
        type: Array,
        default: () => []
    }) readonly options!: []

    @Prop(String) readonly selectionType!: string
    @Prop(String) readonly defaultRadio!: string
    @Prop({
        type: Array,
        default: () => []
    }) readonly defaultCheckbox!: []

    @Prop({
        type: Array,
        default: () => []
    }) readonly selectedList!: { id: string }[]

    @Prop({
        type: Function,
        default: () => false
    }) readonly isRadioDisable!: (row?: object) => boolean

    @Prop({
        type: Function,
        default: () => true
    }) readonly isCheckboxSelectable!: (row?: object) => boolean

    /* data */
    radioValue = this.defaultRadio

    /* computed */
    get isRadio () {
        return this.selectionType === 'radio'
    }

    get isCheckbox () {
        return this.selectionType === 'checkbox'
    }

    // watch: {
    //   defaultRadio (val) {
    //     this.radioValue = val
    //   }
    // }

    /* methods */
    getRowKeys (row: { id: string }) {
        return row.id
    }

    // 设置 radio 默认选中
    setDefaultRadio () {
        this.radioValue = this.defaultRadio
    }

    // 设置 checkbox 默认选中
    async setDefaultCheckbox (list = this.data, defaultKeys = { id: '' }) {
        if (!list.length) return false

        await this.$nextTick()
        const table: any = this.$refs.table
        if (this.defaultCheckbox.length) {
            for (const item of list) {
                const key = defaultKeys.id ? defaultKeys.id : 'id'
                // 是否应该被选中
                const willSelected = this.defaultCheckbox.some(row => row[key] === item.id)
                // 是否已被选中
                const hasSelected = this.selectedList.some(row => row.id === item.id)
                if (willSelected && !hasSelected) {
                    table.toggleRowSelection(item, true)
                }
            }
        }
    }

    setDefaultSelection (list: { id: string }[], defaultKeys = { id: '' }) {
        // if (this.isRadio) {
        //   this.setDefaultRadio()
        // }
        if (this.isCheckbox) {
            this.setDefaultCheckbox(list, defaultKeys)
        }
    }

    // 单选
    onRadioChange (item: object) {
        this.$emit('update-radio', [item])
    }

    // 多选
    onCheckboxChange (value: object[]) {
        this.$emit('update-checkbox', JSON.parse(JSON.stringify(value)))
    }

    clear () {
        // @ts-ignore
        this.$refs.table.clearSelection()
    }
}
</script>

<style lang="scss">
.custom-table {
    .el-table .cell {
        line-height: 1;
    }
    .el-table tr {
        height: 72px;
    }
    .el-table thead > tr {
        height: 48px;
    }
    .el-radio__label {
        display: none;
    }
}

</style>
