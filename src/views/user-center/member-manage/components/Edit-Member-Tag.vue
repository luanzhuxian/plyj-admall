<template>
    <el-dialog
        class="edit-main"
        :title="title"
        :visible="show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px"
        @close="close"
    >
        <el-form
            label-width="80px"
            :model="form"
            :rules="rules"
            ref="form"
        >
            <el-form-item
                label="标签名称"
                prop="tagName"
            >
                <el-input
                    style="width: 280px;"
                    v-model.trim="form.tagName"
                    placeholder="请输入8个字以内的标签名称"
                    autofocus
                />
            </el-form-item>
            <el-form-item label-width="0">
                <div style="text-align: center;">
                    <el-button @click="close" round>
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="save"
                        round
                    >
                        保 存
                    </el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { copyFields, resetForm } from '../../../../assets/ts/utils'
import { updateTag } from '../../../../apis/member'
export default {
    name: 'EditMemberTag',
    data () {
        return {
            title: '新建标签',
            form: {
                tagName: ''
            },
            rules: {
                tagName: [
                    { required: true, message: '请输入标签名称', trigger: 'blur' },
                    { min: 2, max: 8, message: '请输入2到8个字', trigger: 'blur' }
                ]
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    watch: {
        data (val) {
            if (val && val.id) {
                copyFields(this.form, val)
                this.title = '编辑标签'
            } else {
                this.clearFrom()
                this.title = '新建标签'
            }
        },
        show (val) {
            if (!val) this.clearFrom()
        }
    },
    methods: {
        close () {
            this.clearFrom()
            this.$refs.form.clearValidate()
            this.$emit('close')
            this.$emit('update:show', false)
            this.$emit('update:data', null)
        },
        async save () {
            try {
                await this.$refs.form.validate()
                if (this.data && this.data.id) {
                    // 编辑
                    await updateTag({ id: this.data.id, sort: this.data.sort, tagName: this.form.tagName })
                    this.$success('编辑标签成功')
                } else {
                    // 添加
                    await updateTag({ tagName: this.form.tagName })
                    this.$success('新建标签成功')
                }
                this.$emit('editTag')
                this.close()
            } catch (e) {
                throw e
            }
        },
        clearFrom () {
            resetForm(this.form, {
                sort: 1,
                hidden: false
            })
        }
    }
}
</script>

<style scoped lang="scss">
</style>
