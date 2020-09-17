<template>
    <div class="gift">
        <el-table
            v-if="tableShow && giftData.length > 0"
            :data="giftData"
            stripe
            border
            style="width: 780px;margin-top:20px;"
        >
            <el-table-column
                label="礼品图片"
                width="100"
            >
                <template slot-scope="{ row }">
                    <img
                        width="60"
                        height="60"
                        style="object-fit: cover;"
                        :src="row.giftImage + '?x-oss-process=style/thum-middle'"
                        v-viewer
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="giftName"
                label="礼品名称"
                width="130"
            />
            <el-table-column
                prop="stock"
                :label="status === 2? '剩余礼品库存' : '礼品库存'"
                width="200"
            >
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.stock" :min="0" step-strictly label="礼品库存" /> &nbsp;份
                </template>
            </el-table-column>
            <el-table-column
                v-if="status === 2"
                prop="salesVolume"
                label="领用量"
                width="80"
            />
            <el-table-column
                prop="operation"
                label="操作"
                width="185"
            >
                <template slot-scope="scope">
                    <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">
                        编辑
                    </el-button>
                    <el-button v-if="remove" @click.native.prevent="deleteRow(scope.$index, giftData)" type="text" size="small">
                        移除
                    </el-button>
                    <el-button v-if="scope.row.status === 0" @click.native.prevent="scope.row.status = 1" type="text" size="small">
                        隐藏
                    </el-button>
                    <el-button v-if="scope.row.status === 1" @click.native.prevent="scope.row.status = 0" type="text" size="small">
                        显示
                    </el-button>
                    <div class="sort">
                        <pl-svg
                            :class="{'disabled': scope.$index === 0}"
                            @click="sort(scope.$index === 0, true, scope.$index)"
                            name="icon-shang"
                            fill="#606266" width="40" height="16"
                        />
                        <pl-svg
                            :class="{'disabled': scope.$index === giftData.length - 1}"
                            @click="sort(scope.$index === giftData.length - 1, false, scope.$index)"
                            name="icon-xia"
                            fill="#606266" width="40" height="16"
                        />
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
            >
                <template slot-scope="scope">
                    {{ scope.row.status === 0 ? '显示': '隐藏' }}
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增礼品弹框 -->
        <el-dialog :title="giftTitle" :visible.sync="dialogFormVisible" :before-close="handleClose" width="660px">
            <el-form :model="newGiftForm" ref="newGiftForm" :rules="newGiftRules">
                <el-form-item label="礼品名称" prop="giftName" :label-width="formLabelWidth">
                    <el-input v-model="newGiftForm.giftName" autocomplete="off" placeholder="请输入礼品名称（6-24字以内）" maxlength="24" show-word-limit style="width:300px;" />
                </el-form-item>
                <el-form-item label="礼品介绍" prop="giftBrief" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="newGiftForm.giftBrief" placeholder="请输入礼品介绍（100字以内）" :autosize="{ minRows: 3}" maxlength="100" show-word-limit style="width:420px" />
                </el-form-item>
                <el-form-item label="礼品图片" prop="giftImage" :label-width="formLabelWidth">
                    <UploadImage
                        ref="UploadImage"
                        v-model="newGiftForm.giftImage"
                        :width="750"
                        :height="750"
                        :box-width="100"
                        :box-height="100"
                        :size="2"
                        :count="1"
                        upload-text="上传图片"
                    />
                    （只支持png、jpg格式，最多上传1张，大小为2M以内）
                </el-form-item>
                <el-form-item label="礼品库存" prop="stock" :label-width="formLabelWidth">
                    <el-input-number v-model="newGiftForm.stock" :min="0" step-strictly label="礼品库存" /> 件
                </el-form-item>
                <el-form-item label="兑换时间" prop="useStartTime" :label-width="formLabelWidth" style="margin-bottom:0;">
                    <el-date-picker
                        v-model="giftDaterange"
                        @change="giftDaterangeChange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="startPickerOptions"
                        :default-time="['00:00:00', '23:59:59']"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :editable="false"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitNewGiftForm('newGiftForm')" style="margin-right:30px;">
                    保 存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import UploadImage from '../file/Image-Manager.vue'

export default {
    components: {
        UploadImage
    },
    data () {
        return {
            // 新增礼品
            dialogFormVisible: false,
            formLabelWidth: '120px',
            remove: true,
            newGiftForm: {
                // 礼品名称
                giftName: '',
                // 礼品介绍
                giftBrief: '',
                // 礼品图片
                giftImage: [],
                // 礼品库存
                stock: 1,
                // 礼品领用量
                salesVolume: '0',
                // 礼品兑换时间
                useEndTime: '',
                useStartTime: '',
                status: 0
            },
            newGiftRules: {
                giftName: [
                    { required: true, message: '请填写礼品名称', trigger: 'blur' }
                ],
                giftBrief: [
                    { required: true, message: '请填写礼品介绍', trigger: 'blur' }
                ],
                giftImage: [
                    { required: true, message: '请选择礼品图片', trigger: 'change' }
                ],
                stock: [
                    { required: true, message: '请选择礼品库存', trigger: 'blur' }
                ],
                useStartTime: [
                    { required: true, message: '请选择礼品兑换时间', trigger: 'blur' }
                ]
            },
            giftIndex: -1,
            giftTitle: '',
            giftDaterange: [],
            startPickerOptions: {
                disabledDate: time => time.getTime() < Date.now() - 8.64e7
            }
        }
    },
    props: {
        tableShow: {
            type: Boolean,
            default: true
        },
        status: {
            type: [Number, String],
            default: ''
        },
        giftData: {
            type: Array,
            default: () => []
        }
    },
    methods: {
    // 新增礼品
        newGift () {
            this.giftIndex = -1
            this.giftTitle = '新增礼品'
            this.dialogFormVisible = true
        },
        handleClose (done) {
            this.giftIndex = -1
            done()
        },
        submitNewGiftForm (formName) {
            /* eslint-disable vue/no-mutating-props */
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const giftForm = JSON.parse(JSON.stringify(this.newGiftForm))
                    giftForm.giftImage = giftForm.giftImage[0]
                    if (this.giftIndex >= 0) {
                        this.giftData.splice(this.giftIndex, 1, giftForm)
                    } else {
                        // 新增礼品删除id
                        delete giftForm.id
                        this.giftData.push(giftForm)
                    }
                    this.resetForm('newGiftForm')
                    this.giftForm = null
                    this.giftDaterange = ''
                    this.$emit('giftDataFun', this.giftData)
                    this.dialogFormVisible = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 重置表单
        resetForm (formName) {
            this.$refs[formName].resetFields()
        },
        // 编辑
        edit (row) {
            this.giftTitle = '编辑礼品'
            this.newGiftForm = JSON.parse(JSON.stringify(row))
            this.newGiftForm.giftImage = this.newGiftForm.giftImage.split('\\n')
            this.giftDaterange = [row.useStartTime, row.useEndTime]
            this.$emit('giftDataFun', this.giftData)
            this.dialogFormVisible = true
        },
        // 移除
        deleteRow (index, rows) {
            rows.splice(index, 1)
            this.$emit('giftDataFun', this.giftData)
        },
        sort (isDisabled, isUp, index) {
            if (isDisabled) return
            const currentPresent = this.giftData.splice(index, 1)[0]
            isUp ? this.giftData.splice(index - 1, 0, currentPresent)
                : this.giftData.splice(index + 1, 0, currentPresent)
            this.$emit('giftDataFun', this.giftData)
        },
        giftDaterangeChange () {
            if (!this.giftDaterange) {
                this.newGiftForm.useStartTime = ''
                this.newGiftForm.useEndTime = ''
            }
            if (this.giftDaterange && this.giftDaterange.length === 2) {
                this.newGiftForm.useStartTime = this.giftDaterange[0]
                this.newGiftForm.useEndTime = this.giftDaterange[1]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.el-table .el-button{
  min-width:auto;
  padding:0;
}
.el-table .cell img{
  vertical-align: middle;
  object-fit: cover;
}

.sort {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  text-align: center;

  i {
    flex: 1;
    width: 40px;
    height: 16px;
    border: 1px solid #dcdfe6;
    color: #606266;

    &:hover {
      color: #409eff;
    }
  }

  .disabled {
    border-color: #ebeef5 !important;
    color: #c0c4cc !important;
    cursor: not-allowed;
  }
}
</style>
