<template>
    <div>
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible="show"
            title="预览模板"
            @close="close"
        >
            <el-form
                label-width="100px"
                label-position="left"
                style="margin-top: 20px;padding: 0 20px;"
            >
                <el-form-item label="模板名称：">
                    <el-input
                        v-model="templateDetail.templateName"
                        :disabled="true"
                        style="width: 300px;"
                    />
                </el-form-item>
                <el-form-item label="快递公司：">
                    <el-input
                        type="textarea"
                        :rows="2"
                        resize="none"
                        v-model="templateDetail.deliveryCompanyName"
                        :disabled="true"
                        style="width: 300px;"
                    />
                </el-form-item>
                <el-form-item label="运费配置：">
                    <el-radio-group v-model="templateDetail.isPostage" :disabled="true">
                        <el-radio label="N">
                            自定义运费
                        </el-radio>
                        <el-radio label="Y">
                            卖家承担运费
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="templateDetail.isPostage === 'N'">
                    <el-form-item label="默认运费：">
                        <el-form-item label="计价方式：">
                            <el-radio-group
                                v-model="templateDetail.priceMethod"
                                :disabled="true"
                            >
                                <el-radio label="BYWEIGHT">
                                    按重量
                                </el-radio>
                                <el-radio label="BYNUMBER">
                                    按件数
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            :label="
                                templateDetail.priceMethod === 'BYWEIGHT'
                                    ? '默认首重：'
                                    : '默认首件：'
                            "
                        >
                            <el-input
                                v-model="templateDetail.firstUnit"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span
                                v-text="templateDetail.priceMethod === 'BYWEIGHT' ? 'kg' : '件'"
                                style="margin: 0 12px;"
                            />
                            <el-input
                                v-model="templateDetail.firstPrice"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span style="margin-left: 12px;">元</span>
                        </el-form-item>
                        <el-form-item
                            :label="
                                templateDetail.priceMethod === 'BYWEIGHT'
                                    ? '默认续重：'
                                    : '默认续件：'
                            "
                            style="margin-bottom: 0;"
                        >
                            <el-input
                                v-model="templateDetail.secondUnit"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span
                                v-text="templateDetail.priceMethod === 'BYWEIGHT' ? 'kg' : '件'"
                                style="margin: 0 12px;"
                            />
                            <el-input
                                v-model="templateDetail.secondPrice"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span style="margin-left: 12px;">元</span>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="包邮配置：">
                        <el-form-item label="包邮方式">
                            <el-radio-group
                                v-model="templateDetail.postageCondition"
                                :disabled="true"
                            >
                                <el-radio label="CONDITIONBYAREA">
                                    按区域
                                </el-radio>
                                <el-radio label="CONDITIONBYNO">
                                    按件数
                                </el-radio>
                                <el-radio label="CONDITIONBYNULL">
                                    不设置
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            label="包邮区域："
                            v-if="templateDetail.postageCondition === 'CONDITIONBYAREA'"
                        >
                            <el-input
                                type="textarea"
                                :rows="4"
                                resize="none"
                                v-model="templateDetail.specificAreaName"
                                :disabled="true"
                                style="width: 300px;"
                            />
                        </el-form-item>
                        <el-form-item
                            label="包邮件数："
                            v-if="templateDetail.postageCondition === 'CONDITIONBYNO'"
                        >
                            满
                            <el-input
                                v-model="templateDetail.postageNo"
                                :disabled="true"
                                style="width: 60px;margin: 0 12px;"
                            />
                            件包邮
                        </el-form-item>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="close">
                        确定
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ShippingTemplate',
    props: {
        show: Boolean,
        templateDetail: {
            type: Object,
            default () {
                return Object
            }
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped>

</style>
