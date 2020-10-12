<template>
    <div class="postage">
        <el-button
            type="primary"
            @click="addTemplate"
            round
            style="margin: 10px 0 20px"
        >
            添加模板+
        </el-button>
        <search-box @submit.native.prevent>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filter.keyword"
                    placeholder="请输入模板名称"
                    clearable
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="getTemplateList"
                    round
                >
                    查询
                </el-button>
                <el-button
                    type="text"
                    @click="resetFilter"
                    round
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>

        <el-table :data="postageData.records">
            <el-table-column
                prop="templateName"
                label="模板名称"
                width="200"
                header-align="left"
                align="left"
            />
            <el-table-column
                prop="deliveryCompanyName"
                label="快递公司"
            />
            <el-table-column
                prop="isPostage"
                label="运费配置"
                class-name="nowrap"
                width="150"
            />
            <el-table-column
                prop="priceMethod"
                label="计价方式"
                width="150"
            />
            <el-table-column
                prop="operatorTime"
                label="创建时间"
                width="200"
            />
            <el-table-column
                label="操作"
                header-align="right"
                align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                @click="detailShow(row.id)"
                            >
                                详情
                            </a>
                            <a
                                @click="detailEdit(row.id)"
                            >
                                修改
                            </a>
                            <a
                                @click="templateDelete(row.id)"
                            >
                                删除
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="postageData.total"
            v-model="filter.current"
            @change="getTemplateList"
        />

        <!-- 新建与修改-->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogVisible"
            :title="dialogType === '1' ? '新建模板' : dialogType === '2' ? '修改模板' : '查看模板'"
        >
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="100px"
                label-position="left"
                style="margin-top: 20px;padding: 0 20px;"
            >
                <el-form-item
                    label="模板名称："
                    prop="templateName"
                >
                    <el-input
                        v-model="form.templateName"
                        style="width: 300px;"
                    />
                </el-form-item>
                <el-form-item
                    label="快递公司："
                    prop="deliveryCompany"
                >
                    <el-select
                        v-model="form.deliveryCompany"
                        placeholder="请选择快递公司，支持输入搜索"
                        :filterable="true"
                        multiple
                        @change="setExpress"
                        style="width: 300px;"
                    >
                        <el-option
                            v-for="(item,index) of companySource"
                            :key="index"
                            :label="item.dictDataValue"
                            :value="item.dictDataKey"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="运费配置："
                    :required="true"
                >
                    <el-radio-group
                        v-model="form.isPostage"
                        @change="$refs.form.clearValidate()"
                    >
                        <el-radio label="N">
                            自定义运费
                        </el-radio>
                        <el-radio label="Y">
                            卖家承担运费
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.isPostage === 'N'">
                    <el-form-item
                        label="默认运费："
                        :required="true"
                    >
                        <el-form-item
                            label="计价方式："
                            :required="true"
                        >
                            <el-radio-group v-model="form.priceMethod">
                                <el-radio label="BYWEIGHT">
                                    按重量
                                </el-radio>
                                <el-radio label="BYNUMBER">
                                    按件数
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div>
                            <el-form-item
                                :label="form.priceMethod === 'BYWEIGHT' ? '默认首重：' : '默认首件：'"
                                prop="firstUnit"
                                style="display: inline-block;"
                            >
                                <el-input
                                    type="number"
                                    v-model="form.firstUnit"
                                    style="width: 60px;"
                                />
                                <span
                                    v-text="form.priceMethod === 'BYWEIGHT' ? 'kg' : '件'"
                                    style="margin: 0 12px;"
                                />
                            </el-form-item>
                            <el-form-item
                                prop="firstPrice"
                                label-width="0"
                                style="display: inline-block;"
                            >
                                <el-input
                                    type="number"
                                    v-model="form.firstPrice"
                                    style="width: 60px;"
                                />
                                <span style="margin-left: 12px;">元</span>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item
                                :label="form.priceMethod === 'BYWEIGHT' ? '默认续重：' : '默认续件：'"
                                prop="secondUnit"
                                style="display: inline-block;margin-bottom: 0;"
                            >
                                <el-input
                                    type="number"
                                    v-model="form.secondUnit"
                                    style="width: 60px;"
                                />
                                <span
                                    v-text="form.priceMethod === 'BYWEIGHT' ? 'kg' : '件'"
                                    style="margin: 0 12px;"
                                />
                            </el-form-item>
                            <el-form-item
                                prop="secondPrice"
                                label-width="0"
                                style="display: inline-block;margin-bottom: 0;"
                            >
                                <el-input
                                    type="number"
                                    v-model="form.secondPrice"
                                    style="width: 60px;"
                                />
                                <span style="margin-left: 12px;">元</span>
                            </el-form-item>
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="包邮配置"
                        :required="true"
                    >
                        <el-form-item
                            label="包邮方式："
                            :required="true"
                        >
                            <el-radio-group
                                v-model="form.postageCondition"
                                @change="$refs.form.clearValidate()"
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
                            prop="specificAreaCode"
                            v-if="form.postageCondition === 'CONDITIONBYAREA'"
                        >
                            <el-transfer
                                :titles="['待选择', '已选择']"
                                :data="areaSource"
                                v-model="form.specificAreaCode"
                                @change="setArea"
                            />
                        </el-form-item>
                        <el-form-item
                            label="包邮件数："
                            prop="postageNo"
                            v-if="form.postageCondition === 'CONDITIONBYNO'"
                        >
                            满
                            <el-input
                                type="number"
                                v-model="form.postageNo"
                                style="width: 60px;margin: 0 12px;"
                            />
                            件包邮
                        </el-form-item>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="submitData"
                    >
                        确定
                    </el-button>
                    <el-button @click="dialogVisible = false">
                        取消
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--查看，因为展示内容的类型不同，需要单独写对话框-->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogVisibleDetail"
            title="查看模板"
        >
            <el-form
                label-width="100px"
                label-position="left"
                style="margin-top: 20px;padding: 0 20px;"
            >
                <el-form-item label="模板名称：">
                    <el-input
                        v-model="detailData.templateName"
                        :disabled="true"
                        style="width: 300px;"
                    />
                </el-form-item>
                <el-form-item label="快递公司：">
                    <el-input
                        type="textarea"
                        :rows="2"
                        resize="none"
                        v-model="detailData.deliveryCompanyName"
                        :disabled="true"
                        style="width: 300px;"
                    />
                </el-form-item>
                <el-form-item label="运费配置：">
                    <el-radio-group
                        v-model="detailData.isPostage"
                        :disabled="true"
                    >
                        <el-radio label="N">
                            自定义运费
                        </el-radio>
                        <el-radio label="Y">
                            卖家承担运费
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="detailData.isPostage === 'N'">
                    <el-form-item label="默认运费：">
                        <el-form-item label="计价方式：">
                            <el-radio-group
                                v-model="detailData.priceMethod"
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
                        <el-form-item :label="detailData.priceMethod === 'BYWEIGHT' ? '默认首重：' : '默认首件：'">
                            <el-input
                                v-model="detailData.firstUnit"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span
                                v-text="detailData.priceMethod === 'BYWEIGHT' ? 'kg' : '件'"
                                style="margin: 0 12px;"
                            />
                            <el-input
                                v-model="detailData.firstPrice"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span style="margin-left: 12px;">元</span>
                        </el-form-item>
                        <el-form-item
                            :label="detailData.priceMethod === 'BYWEIGHT' ? '默认续重：' : '默认续件：'"
                            style="margin-bottom: 0;"
                        >
                            <el-input
                                v-model="detailData.secondUnit"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span
                                v-text="detailData.priceMethod === 'BYWEIGHT' ? 'kg' : '件'"
                                style="margin: 0 12px;"
                            />
                            <el-input
                                v-model="detailData.secondPrice"
                                :disabled="true"
                                style="width: 60px;"
                            />
                            <span style="margin-left: 12px;">元</span>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="包邮配置：">
                        <el-form-item label="包邮方式">
                            <el-radio-group
                                v-model="detailData.postageCondition"
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
                            v-if="detailData.postageCondition === 'CONDITIONBYAREA'"
                        >
                            <el-input
                                type="textarea"
                                :rows="4"
                                resize="none"
                                v-model="detailData.specificAreaName"
                                :disabled="true"
                                style="width: 300px;"
                            />
                        </el-form-item>
                        <el-form-item
                            label="包邮件数："
                            v-if="detailData.postageCondition === 'CONDITIONBYNO'"
                        >
                            满
                            <el-input
                                v-model="detailData.postageNo"
                                :disabled="true"
                                style="width: 60px;margin: 0 12px;"
                            />
                            件包邮
                        </el-form-item>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="dialogVisibleDetail = false"
                    >
                        确定
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { getDataDictionary } from '../../../../apis/common'
import { getTemplate, getTemplateDetail, getCity, addTemplate, editTemplate, deleteTemplate } from '../../../../apis/product-center/goods'
import { testMoney, testWeight, testPositiveInteger } from '../../../../assets/ts/validate'

export default {
    name: 'Postage',
    data () {
        return {
            filter: {
                keyword: '',
                current: 1,
                size: 10
            },
            form: {
                // 模板名称
                templateName: '',
                // 快递公司
                deliveryCompany: [],
                // 快递公司名称
                deliveryCompanyName: [],
                // 运费配置
                isPostage: 'Y',
                // 计价方式
                priceMethod: 'BYWEIGHT',
                // 首重/件数量
                firstUnit: '',
                // 首重/件费用
                firstPrice: '',
                // 续重/件数量
                secondUnit: '',
                // 续重/件费用
                secondPrice: '',
                // 包邮方式
                postageCondition: 'CONDITIONBYNULL',
                // 包邮区域码
                specificAreaCode: [],
                // 包邮区域名称
                specificAreaName: [],
                // 包邮件数
                postageNo: ''
            },
            rules: {
                templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
                deliveryCompany: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
                firstUnit: [{ required: true, message: '请输入数量', trigger: 'blur' }, { validator: testWeight, message: '数量不正确', trigger: 'blur' }],
                firstPrice: [{ required: true, message: '请输入价格', trigger: 'blur' }, { validator: testMoney, message: '价格不正确', trigger: 'blur' }],
                secondUnit: [{ required: true, message: '请输入数量', trigger: 'blur' }, { validator: testWeight, message: '数量不正确', trigger: 'blur' }],
                secondPrice: [{ required: true, message: '请输入价格', trigger: 'blur' }, { validator: testMoney, message: '价格不正确', trigger: 'blur' }],
                specificAreaCode: [{ required: true, message: '请选择包邮区域', trigger: 'blur' }],
                postageNo: [{ required: true, message: '请输入包邮件数', trigger: 'blur' }, { validator: testPositiveInteger, message: '件数不正确', trigger: 'blur' }]
            },
            dialogVisible: false,
            dialogVisibleDetail: false,
            // 弹出框类型，1-新建，2-编辑
            dialogType: '1',
            companySource: [],
            areaSource: [],
            postageData: [],
            detailData: {}
        }
    },
    created () {
        this.getTemplateList()
        this.getExpressList()
        this.getCityList()
    },
    methods: {
        resetFilter () {
            this.filter = {
                keyword: '',
                current: 1,
                size: 10
            }
            this.getTemplateList()
        },
        async getTemplateList () {
            const res = await getTemplate({
                keyword: this.filter.keyword,
                current: this.filter.current,
                size: this.filter.size
            })
            this.postageData = res.result || []
        },
        async getExpressList () {
            const { result: res } = await getDataDictionary('KYYQJKDGS')
            const { result } = await getDataDictionary('BKYYQJKDGS')
            this.companySource = [...res, ...result]
        },
        async getCityList () {
            const res = await getCity()
            if (res.result && res.result.length) {
                for (const item of res.result) {
                    this.areaSource.push({
                        key: item.locationCode,
                        label: item.locationName
                    })
                }
            }
        },
        addTemplate () {
            this.dialogType = '1'
            this.dialogVisible = true
            this.clearData()
            if (this.$refs.form) {
                this.$refs.form.clearValidate()
            }
        },
        setExpress (array) {
            const names = []
            for (const item of array) {
                for (const value of this.companySource) {
                    if (item === value.dictDataKey) {
                        names.push(value.dictDataValue)
                    }
                }
            }
            this.form.deliveryCompanyName = names
        },
        setArea (array) {
            const names = []
            for (const item of array) {
                for (const value of this.areaSource) {
                    if (item === value.key) {
                        names.push(value.label)
                    }
                }
            }
            this.form.specificAreaName = names
        },
        clearData () {
            this.form = {
                templateName: '',
                deliveryCompany: [],
                deliveryCompanyName: [],
                isPostage: 'Y',
                priceMethod: 'BYWEIGHT',
                firstUnit: '',
                firstPrice: '',
                secondUnit: '',
                secondPrice: '',
                postageCondition: 'CONDITIONBYNULL',
                specificAreaCode: [],
                specificAreaName: [],
                postageNo: ''
            }
        },
        async submitData () {
            this.$refs.form.validate(async msg => {
                if (msg) {
                    const obj = {
                        templateName: this.form.templateName,
                        deliveryCompany: this.form.deliveryCompany.toString(),
                        deliveryCompanyName: this.form.deliveryCompanyName.toString(),
                        isPostage: this.form.isPostage,
                        priceMethod: this.form.isPostage === 'N' ? this.form.priceMethod : '',
                        firstUnit: this.form.isPostage === 'N' ? this.form.firstUnit : '',
                        firstPrice: this.form.isPostage === 'N' ? this.form.firstPrice : '',
                        secondUnit: this.form.isPostage === 'N' ? this.form.secondUnit : '',
                        secondPrice: this.form.isPostage === 'N' ? this.form.secondPrice : '',
                        postageCondition: this.form.isPostage === 'N' ? this.form.postageCondition : '',
                        specificAreaCode: this.form.isPostage === 'N' ? this.form.postageCondition === 'CONDITIONBYAREA' ? this.form.specificAreaCode.toString() : '' : '',
                        specificAreaName: this.form.isPostage === 'N' ? this.form.postageCondition === 'CONDITIONBYAREA' ? this.form.specificAreaName.toString() : '' : '',
                        postageNo: this.form.isPostage === 'N' ? this.form.postageCondition === 'CONDITIONBYNO' ? this.form.postageNo : '' : ''
                    }
                    if (this.dialogType === '1') {
                        const { status } = await addTemplate(obj)
                        if (status === 200) {
                            this.clearData()
                            this.getTemplateList()
                            this.dialogVisible = false
                        }
                    } else {
                        obj.id = this.form.id
                        obj.status = this.form.status
                        const { code } = await editTemplate(obj)
                        if (code === 2000) {
                            this.clearData()
                            this.getTemplateList()
                            this.dialogVisible = false
                        }
                    }
                }
            })
        },
        async getTemplateDetail (id) {
            const { result } = await getTemplateDetail(id)
            if (result && Object.keys(result).length) {
                return result
            }
        },
        async detailShow (id) {
            this.detailData = await this.getTemplateDetail(id)
            this.dialogType = '3'
            this.dialogVisibleDetail = true
            if (this.$refs.form) {
                this.$refs.form.clearValidate()
            }
        },
        async detailEdit (id) {
            const result = await this.getTemplateDetail(id)
            result.deliveryCompany = result.deliveryCompany.split(',')
            result.priceMethod = result.priceMethod ? result.priceMethod : 'BYWEIGHT'
            result.postageCondition = result.postageCondition ? result.postageCondition : 'CONDITIONBYAREA'
            result.specificAreaCode = result.specificAreaCode ? result.specificAreaCode.split(',') : []
            this.form = result
            this.dialogType = '2'
            this.dialogVisible = true
            if (this.$refs.form) {
                this.$refs.form.clearValidate()
            }
        },
        async templateDelete (id) {
            await this.$confirm('您确定删除此条模板吗？')
            await deleteTemplate(id)
            await this.getTemplateList()
            this.$success('删除成功！')
        }
    }
}
</script>

<style lang="scss" scoped>
  .postage{
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    background-color: #ffffff;
  }
</style>
