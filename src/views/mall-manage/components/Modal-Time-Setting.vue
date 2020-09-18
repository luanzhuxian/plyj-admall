<template>
    <el-dialog
        title="设置定时上架时间"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="isShow"
        @close="onClose"
    >
        <template>
            <span>请选择时间日期：</span>
            <el-date-picker
                v-model="time"
                type="datetime"
                placeholder="选择日期时间"
                :editable="false"
            />
            <span v-if="isAlertShow" style="color: red; margin-left: 15px;">
                请选择时间
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
            <template />
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class ModalTimeSetting extends Vue {
    /* props */
    @Prop(Boolean) readonly show!: boolean

    /* data */
    isShow = false
    isAlertShow = false
    time = ''
    resolve!: (value?: unknown) => void
    reject!: (value?: unknown) => void

    /* watch */
    @Watch('show')
    onChange (val: boolean) {
        this.isShow = val
        if (!val) {
            this.isAlertShow = false
            this.time = ''
        }
    }

    /* methods */
    onShow () {
        this.isShow = true
        return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }

    async onConfirm () {
        if (!this.time) {
            this.isAlertShow = true
            return
        }
        this.resolve && this.resolve(moment(this.time).format('YYYY-MM-DD HH:mm:ss'))
        this.clear()
        this.$emit('confirm', moment(this.time).format('YYYY-MM-DD HH:mm:ss'))
    }

    onClose () {
        this.resolve && this.resolve(false)
        this.clear()
        this.$emit('update:show', false)
        this.$emit('close')
    }

    clear () {
        this.isShow = false
        this.isAlertShow = false
        this.time = ''
    }
}
</script>

<style lang="scss">
</style>
