<template>
    <el-dialog
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="show"
        :title="createType ? `设置规格类型${createType}` : `新增规格类型`"
        width="500px"
        class="sku-dialog"
    >
        <el-form
            :inline="true"
            label-width="120px"
            v-model="skuTemp"
        >
            <el-form-item label="规格类型名称：">
                <el-input
                    placeholder="输入规格类型名称"
                    maxlength="10"
                    v-model="skuTemp.productAttributeName"
                />
            </el-form-item>
            <!-- 要产生占位效果，需要label的值为一个空格 -->
            <el-form-item :label="index === 0 ? '规格类型内容：' : ' '" v-for="(item,index) of skuTemp.productAttributeValues" :key="index">
                <el-input
                    placeholder="输入规格类型内容"
                    maxlength="10"
                    v-model="item.productAttributeValueName"
                />
                <i
                    class="el-icon-error"
                    @click="delSkuList(index)"
                    v-show="index !== 0"
                />
            </el-form-item>
            <el-form-item
                label=" "
                v-if="skuTemp.productAttributeValues.length < MAX_PRODUCT_ATTRIBUTE_VALUES"
            >
                <el-button
                    type="text"
                    @click="addSkuList"
                >
                    +添加
                </el-button>
                <span class="btn-tips">（至多可添加{{ MAX_PRODUCT_ATTRIBUTE_VALUES }}个规格类型内容）</span>
            </el-form-item>
            <div class="text-center">
                <el-button @click="cancelAddSkuList">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    @click="createSkuTable"
                >
                    保存
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { createSku } from '../../../apis/product-center/goods'

export default {
    name: 'AddSku',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        createType: {
            type: Number,
            default: 0
        },
        createData: {
            type: Array,
            default () {
                return []
            }
        },
        editData: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            // 最大"规格类型内容"数量, 需要调整规格的只需要修改此处即可
            MAX_PRODUCT_ATTRIBUTE_VALUES: 20,
            skuTemp: {
                productAttributeName: '',
                productAttributeValues: [{
                    productAttributeValueName: ''
                }]
            },
            attributeModels: []
        }
    },
    watch: {
        createType (val) {
            if (val) {
                if (this.createData.length) {
                    this.skuTemp = this.attributeModels[val - 1]
                }
            }
        },
        createData () {
            this.attributeModels = JSON.parse(JSON.stringify(this.createData))
        }
    },
    methods: {
        addSkuList () {
            if (this.skuTemp.productAttributeValues.length < this.MAX_PRODUCT_ATTRIBUTE_VALUES) {
                this.skuTemp.productAttributeValues.push({ productAttributeValueName: '' })
            } else {
                this.$warning(`最多只能添加${ this.MAX_PRODUCT_ATTRIBUTE_VALUES }个规格类型内容`)
            }
        },
        delSkuList (index) {
            this.skuTemp.productAttributeValues.splice(index, 1)
        },
        async createSkuTable () {
            // 表单验证
            if (!this.skuTemp.productAttributeName) {
                this.$error('请输入规格类型名称')
                return false
            }
            for (const item of this.skuTemp.productAttributeValues) {
                if (!item.productAttributeValueName) {
                    this.$error('请输入规格类型内容')
                    return false
                }
            }
            if (this.createType) {
                this.attributeModels[this.createType - 1] = this.skuTemp
            } else {
                if (this.attributeModels.length < 2) {
                    // 临时对象增加sort标识来区分规格1和规格2
                    if (this.attributeModels.length) {
                        this.skuTemp.sort = 2
                    } else {
                        this.skuTemp.sort = 1
                    }
                    this.attributeModels.push(this.skuTemp)
                }
            }
            try {
                // 清理由后端传递过来的sort字段，防止干扰后端的再次排序
                for (const items of this.attributeModels) {
                    for (const item of items.productAttributeValues) {
                        delete item.sort
                    }
                }
                const skuModels = JSON.parse(JSON.stringify(this.editData))
                for (const item of skuModels) {
                    item.status = Number(item.status)
                }
                const { data } = await createSku({
                    attributeModels: this.attributeModels,
                    productSkuModels: skuModels
                })
                this.$emit('createSku', data.result)
                this.clearTemp()
                this.$emit('update:show', false)
            } catch (e) {
                this.clearTemp()
                this.$emit('update:show', false)
            }
        },
        cancelAddSkuList () {
            this.clearTemp()
            this.$emit('update:show', false)
        },
        clearTemp (type = '') {
            if (type) {
                this.attributeModels = []
            }
            this.skuTemp = {
                productAttributeName: '',
                productAttributeValues: [{
                    productAttributeValueName: ''
                }]
            }
            this.$emit('update:createType', 0)
        }
    }
}
</script>

<style lang="scss" scoped>
  .sku-dialog {
    ::v-deep .el-dialog__close {
      display: none;
    }

    ::v-deep .el-form {
      .el-form-item {
        position: relative;

        &:first-of-type {
          margin-bottom: 33px;

          &::after {
            width: 368px;
            border-bottom: 1px solid #E7E7E7;
            position: relative;
            right: -108px;
            top: 16px;
          }
        }

        .el-form-item__label{
          padding-left: 0 !important;
        }

        .el-input__inner {
          width: 180px;
        }

        .el-icon-error {
          color: #333333;
          font-size: 15px;
          background-color: #FFFFFF;
          position: absolute;
          right: 4px;
          top: -6px;
        }

        .btn-tips {
          color: #999999;
          font-size: 12px;
        }
      }

      .text-center {
        margin-top: 14px;
        text-align: center;

        .el-button {
          width: 70px;
          height: 34px;
        }
      }
    }
  }
</style>
