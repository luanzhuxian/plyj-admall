<template>
    <ExportDialog v-bind="$attrs" @open="open" @confirm="confirm" @close="close">
        <el-form ref="exportForm" :model="exportData" label-width="100px" label-position="left">
            <el-form-item label="搜索内容" prop="searchContent">
                <el-input
                    v-model.trim="exportData.searchContent"
                    placeholder="请输入搜索内容"
                    style="width: 369px;"
                    clearable
                />
            </el-form-item>
            <el-form-item
                label="状态"
            >
                <el-select
                    v-model="exportData.orderStatus"
                    placeholder="请选择"
                >
                    <el-option
                        label="全部订单"
                        value=""
                    />
                    <el-option
                        label="待发货"
                        value="WAIT_SHIP"
                    />
                    <el-option
                        label="待收货"
                        value="WAIT_RECEIVE"
                    />
                    <el-option
                        label="待付款"
                        value="WAIT_PAY"
                    />
                    <el-option
                        label="订单完成"
                        value="FINISHED"
                    />
                    <el-option
                        label="订单关闭"
                        value="CLOSED"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="核销人"
            >
                <el-select
                    v-model="exportData.operatorUserName"
                    placeholder="请选择"
                    clearable
                >
                    <el-option
                        v-for="(item, k) in operatorUser"
                        :key="k"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </ExportDialog>
</template>

<script>
import ExportDialog from '../../../../../components/common/Export-Dialog.vue'

export default {
    name: 'Export',
    inheritAttrs: false,
    components: {
        ExportDialog
    },
    props: {
        searchData: {
            type: Object,
            default () {
                return {}
            }
        },
        operatorUser: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            exportData: {
                searchContent: '',
                orderStatus: '',
                operatorUserName: ''
            }
        }
    },
    methods: {
        open () {
            const obj = {}
            const keys = Object.keys(this.exportData)
            for (const key of keys) {
                obj[key] = this.searchData[key]
            }

            // 暂时兼容数据
            obj.searchContent = this.searchData.keywords

            this.exportData = obj
        },
        confirm () {
            this.$emit('confirm', this.exportData)
            this.close()
        },
        close () {
            this.exportData = {
                searchContent: '',
                orderStatus: '',
                operatorUserName: ''
            }
            this.$emit('update:show', false)
        }
    }
}
</script>

<style>

</style>
