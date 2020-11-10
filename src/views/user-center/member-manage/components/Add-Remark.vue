<template>
    <el-dialog
        class="select-video"
        :visible="show"
        width="640px"
        title="添加备注"
        @close="closeHandler"
        :close-on-click-modal="false"
        append-to-body
    >
        <el-form>
            <el-form-item label="备注：">
                <el-input
                    style="width: 504px;"
                    rows="15"
                    clearable
                    type="textarea"
                    placeholder="请输入备注"
                    v-model="content"
                    maxlength="500"
                    show-word-limit
                />
            </el-form-item>
        </el-form>
        <div class="mt-20" style="text-align: center;">
            <el-button type="primary" round @click="save">
                保 存
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { saveRemark } from '../../../../apis/member'
export default {
    name: 'WatchDetailList',
    props: {
        show: Boolean,
        userId: {
        // 当前用户id
            type: String,
            default: ''
        }
    },
    data () {
        return {
            content: ''
        }
    },
    methods: {
        closeHandler () {
            this.$emit('update:show', false)
        },
        async save () {
            try {
                if (!this.content.trim()) {
                    await this.$warning('请输入备注内容')
                    return
                }
                await saveRemark({
                    content: this.content,
                    mallUserId: this.userId
                })
                this.$emit('success')
                this.closeHandler()
                this.content = ''
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .tag {
        display: inline-block;
        min-width: 78px;
        margin: 0 4px 4px 0;
        padding: 0 4px;
        border: 1px solid #ec742e;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        text-align: center;
        color: #ec742e;
    }
</style>
