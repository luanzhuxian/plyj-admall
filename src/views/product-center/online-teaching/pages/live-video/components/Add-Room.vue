<template>
    <el-dialog
        :title="roomName ? '编辑房间' : '添加房间'"
        width="500px"
        :visible="show"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        @close="close"
    >
        <el-form
            :model="form"
            :rules="rules"
            ref="form"
        >
            <el-form-item label="房间名称" label-width="80px" prop="name">
                <el-input v-model="form.name" type="text" placeholder="请输入房间名称" />
            </el-form-item>
            <el-form-item style="text-align: center; margin-bottom: 0;">
                <el-button @click="cancel" round>
                    取消
                </el-button>
                <el-button type="primary" @click="confirm" round>
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { checkLength } from './../../../../../../assets/ts/validate'
import { createRoom, updateRoom } from './../../../../../../apis/product-center/online-teaching/live'
export default {
    name: 'AddRoom',
    props: {
        show: Boolean,
        roomCount: {
            type: Number,
            default: 1
        },
        roomId: {
            type: [Number, String],
            default: 0
        },
        roomName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            form: {
                name: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入房间名称', trigger: 'blur' },
                    { validator: checkLength(12), message: '房间名称最多12个字符', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        show (val) {
            if (val && !this.roomId) this.form.name = `房间${ this.roomCount + 1 }`
        },
        roomName (val) {
            if (val) {
                this.form.name = val
            }
        }
    },
    methods: {
        close () {
            this.reset()
            this.$emit('update:show', false)
        },
        reset () {
            this.form = {
                name: ''
            }
            this.$refs.form.clearValidate()
        },
        async confirm () {
            try {
                await this.$refs.form.validate()
                if (this.roomId) {
                    await updateRoom(this.roomId, this.form.name)
                    this.$success('修改成功')
                } else {
                    await createRoom(this.form.name)
                    this.$success('创建成功')
                }
                this.close()
                this.$emit('success')
            } catch (e) {
                if (e) {
                    this.$emit('failed')
                    throw e
                }
            }
        },
        cancel () {
            this.$emit('cancel')
            this.close()
        }
    }
}
</script>
