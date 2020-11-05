<template>
    <div class="apply-invoice">
        <div class="apply-top">
            <i
                class="el-icon-back"
                @click="$router.back()"
            />
            <span>申请发票</span>
        </div>
        <div
            class="apply-list"
            v-for="(item,index) of invoiceOrderList"
            :key="index"
        >
            <div class="list-item">
                <div
                    v-if="!isEditInvoice"
                    class="item-delete"
                    @click="removeOrder(index)"
                >
                    <i class="el-icon-delete" />
                    删除订单
                </div>
                <h3>相关订单<span v-show="invoiceOrderList.length > 1">{{ index + 1 }}</span></h3>
                <p>订单编号：<span v-text="item.orderId" /></p>
                <p>收货姓名：<span v-text="item.userName || item.consigneeName" /></p>
                <p>收货电话：<span v-text="item.mobile || item.consigneeMobile" /></p>
                <h3
                    style="margin-top: 32px;"
                >
                    开票商品
                </h3>
                <div
                    class="list-goods"
                >
                    <div
                        class="goods-item"
                    >
                        <img
                            v-viewer
                            :src="item.goodsImages || item.img"
                        >
                    </div>
                    <!--          <div-->
                    <!--            class="goods-item"-->
                    <!--            :class="{'active':value.isSelected}"-->
                    <!--            v-for="(value,key) in item.orderDetailModels"-->
                    <!--            :key="key"-->
                    <!--          >-->
                    <!--            <i-->
                    <!--              class="el-icon-success"-->
                    <!--              @click="value.isSelected = !value.isSelected"-->
                    <!--            />-->
                    <!--            <img-->
                    <!--              v-viewer-->
                    <!--              :src="value.productImg"-->
                    <!--            >-->
                    <!--          </div>-->
                </div>
            </div>
        </div>
        <div
            v-if="!isEditInvoice"
            class="apply-btn"
            @click="addOrder"
        >
            <i
                class="el-icon-circle-plus-outline"
                style="margin-right: 4px;margin-top: 3px;"
            />
            添加订单
        </div>
        <div class="apply-info">
            <el-form
                v-model="invoiceForm"
                label-position="left"
                :disabled="!invoiceOrderList.length"
            >
                <el-form-item
                    label="发票类型"
                    label-width="150px"
                >
                    <el-select
                        @change="invoiceTypeChage()"
                        v-model="invoiceForm.invoiceType"
                        style="width: 184px;"
                    >
                        <el-option
                            v-for="(item,index) of invoiceTypeList"
                            :key="index"
                            :label="item.dictDataValue"
                            :value="item.dictDataKey"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="发票信息"
                    label-width="150px"
                    v-if="invoiceForm.invoiceType === '0'"
                >
                    <p
                        class="user-info"
                        v-if="!isEdit"
                    >
                        <span>{{ invoiceForm.invoiceTitle }}&nbsp;&nbsp;&nbsp;{{ invoiceForm.companyPhone }}</span>
                        <span
                            class="text-btn"
                            @click="isEdit = true"
                        >编辑信息</span>
                    </p>
                    <el-input
                        style="width: 184px;"
                        placeholder="请输入开票人姓名"
                        v-model="invoicePersonalNewTemp.name"
                        v-else
                    />
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="invoiceForm.invoiceType === '0' && isEdit"
                >
                    <el-input
                        style="width: 184px;"
                        placeholder="请输入开票人电话"
                        v-model="invoicePersonalNewTemp.mobile"
                        @blur="testMobile(invoicePersonalNewTemp.mobile)"
                    />
                    <span
                        class="text-btn"
                        @click="savePersonalNew"
                    >保存</span>
                    <span
                        class="text-btn"
                        @click="isEdit = false"
                    >取消</span>
                </el-form-item>
                <el-form-item
                    label="发票信息"
                    label-width="150px"
                    v-if="invoiceForm.invoiceType === '1'"
                >
                    <el-select
                        v-model="invoiceCompanySelected"
                        style="width: 184px;"
                    >
                        <el-option
                            v-for="(item,index) of invoiceCompanyList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="invoiceForm.invoiceType === '1' && invoiceCompanySelected === 'add'"
                >
                    <el-input
                        style="width: 184px;"
                        placeholder="请输入公司名称"
                        v-model="invoiceCompanyNewTemp.name"
                        v-if="invoiceCompanySelected === 'add'"
                    />
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="invoiceForm.invoiceType === '1' && invoiceCompanySelected === 'add'"
                >
                    <el-input
                        style="width: 184px;"
                        placeholder="请输入纳税人识别号"
                        v-model="invoiceCompanyNewTemp.number"
                        @blur="testCode(invoiceCompanyNewTemp.number)"
                    />
                    <span
                        class="text-btn"
                        @click="saveCompanyNewList"
                    >保存</span>
                    <span
                        class="text-btn"
                        @click="invoiceCompanySelected = ''"
                    >取消</span>
                </el-form-item>
                <el-form-item
                    label="收票地址"
                    label-width="150px"
                >
                    <el-select
                        v-model="invoiceAddressSelected"
                        @change="invoiceAddressChange()"
                        style="width: 380px;"
                    >
                        <el-option
                            v-for="(item,index) of invoiceAddressList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="invoiceAddressSelected === 'add'"
                >
                    <el-input
                        style="width: 184px;"
                        placeholder="请输入收票人姓名"
                        v-model="invoiceAddressNewTemp.name"
                        v-if="invoiceAddressSelected === 'add'"
                    />
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="invoiceAddressSelected === 'add'"
                >
                    <el-input
                        style="width: 184px;"
                        placeholder="请输入收票人电话"
                        v-model="invoiceAddressNewTemp.mobile"
                        @blur="testMobile(invoiceAddressNewTemp.mobile)"
                        v-if="invoiceAddressSelected === 'add'"
                    />
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="invoiceAddressSelected === 'add'"
                >
                    <el-select v-model="invoiceAddressNewTemp.province">
                        <el-option
                            v-for="(item,index) of commonAddressList.province"
                            :key="index"
                            :label="item.locationName"
                            :value="item.locationCode"
                        />
                    </el-select>
                    <el-select
                        v-model="invoiceAddressNewTemp.city"
                        style="margin-left: 10px;"
                    >
                        <el-option
                            v-for="(item,index) of commonAddressList.city"
                            :key="index"
                            :label="item.locationName"
                            :value="item.locationCode"
                        />
                    </el-select>
                    <el-select
                        v-model="invoiceAddressNewTemp.region"
                        style="margin-left: 10px;"
                    >
                        <el-option
                            v-for="(item,index) of commonAddressList.region"
                            :key="index"
                            :label="item.locationName"
                            :value="item.locationCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="invoiceAddressSelected === 'add'"
                >
                    <el-input
                        style="width: 260px;"
                        placeholder="请输入收票人详细地址"
                        v-model="invoiceAddressNewTemp.address"
                        v-if="invoiceAddressSelected === 'add'"
                    />
                    <span
                        class="text-btn"
                        @click="saveAddressNewList"
                    >保存</span>
                    <span
                        class="text-btn"
                        @click="invoiceAddressSelected = ''"
                    >取消</span>
                </el-form-item>
                <el-form-item
                    label="操作备注"
                    label-width="150px"
                >
                    <el-select
                        v-model="operationMemo"
                        style="width: 184px;"
                        @change="operationMemoChange()"
                    >
                        <el-option
                            v-for="(item,index) of invoiceMemoList"
                            :key="index"
                            :label="item.dictDataValue"
                            :value="item.dictDataValue"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="150px"
                    v-if="operationMemo === '其他'"
                >
                    <el-input
                        type="textarea"
                        style="width: 430px;height: 100px;"
                        maxlength="100"
                        resize="none"
                        show-word-limit
                        placeholder="请输入原因（100字以内）"
                        v-model="invoiceForm.description"
                    />
                </el-form-item>
            </el-form>
            <div class="list-btn">
                <el-button
                    plain
                    style="width: 80px;"
                    @click="$router.back()"
                >
                    取消
                </el-button>
                <el-button
                    type="primary"
                    style="width: 80px;margin-left: 20px;"
                    :disabled="!invoiceOrderList.length"
                    @click="checkForm"
                >
                    立即申请
                </el-button>
            </div>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogVisible"
            width="900px"
            title="添加订单"
        >
            <el-form>
                <el-form-item>
                    <el-input
                        placeholder="搜索订单编号/下单人电话"
                        style="width: 180px;"
                        v-model="orderForm.keywords"
                    />
                    <el-button
                        type="primary"
                        style="width: 98px;margin-left: 10px;"
                        @click="searchOrder"
                    >
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                ref="singleTable"
                :data="searchOrderTable"
                highlight-current-row
                @current-change="selectOrder"
                empty-text="没有查到该订单信息，请确认后重新查询！"
            >
                <el-table-column
                    property="orderId"
                    label="订单编号"
                    width="200"
                />
                <el-table-column
                    property="goodsName"
                    label="商品名称"
                />
                <el-table-column
                    property="createUser"
                    label="下单人姓名"
                />
                <el-table-column
                    property="createUserMobile"
                    label="下单人电话"
                />
                <el-table-column
                    property="userName"
                    label="收货人姓名"
                />
                <el-table-column
                    property="mobile"
                    label="收货人电话"
                />
            </el-table>
            <pagination
                @change="getOrderList"
                @sizeChange="sizeChange"
                v-model="orderForm.current"
                :total="searchTotal"
                style="margin-bottom: 70px;"
            />
            <div style="margin-top: 40px;text-align: center;">
                <el-button
                    style="width: 70px;"
                    @click="dialogVisible = false"
                >
                    取消
                </el-button>
                <el-button
                    type="primary"
                    style="width: 70px;"
                    @click="sureOrder()"
                >
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { isCreditNumber, isPhone } from '../../../../assets/ts/validate'
import { getDataDictionary } from '../../../../apis/common'
import { getEinList, addEinList, getAddressList, addAddressList, getLocation, selectOrderForInvoice, selectDetailInvoice, applyInvoice, editInvoice, getInvoiceDetail } from '../../../../apis/order'

export default {
    name: 'ApplyInvoice',
    data () {
        return {
            isEditInvoice: false,
            // 发票类型数据字典
            invoiceTypeList: [
                { dictDataValue: '个人发票', dictDataKey: '0' },
                { dictDataValue: '企业增值税普票', dictDataKey: '1' }],
            // 发票操作备注类型数据字典
            invoiceMemoList: [],
            // 搜索订单相关
            orderForm: {
                userId: '',
                current: 1,
                size: 10,
                keywords: ''
            },
            // 分页组件总数
            searchTotal: 0,
            // 订单表格展示
            searchOrderTable: [],
            // 订单表格选择ID
            rowId: '',
            // 订单选择的用户ID，临时存储，防止影响搜索结果
            userIdTemp: '',
            // 订单选择的用户ID
            userId: '',
            // 发票订单列表展示
            orderId: '',
            // 当前选择订单ID
            invoiceOrderList: [],
            // 个人发票姓名电话临时保存对象，修改本地submitForm用，不会发送到后端保存
            invoicePersonalNewTemp: {
                name: '',
                mobile: ''
            },
            // 公司发票名称税号列表，select显示用
            invoiceCompanyList: [],
            // 公司发票名称税号选择字段，判断状态与搜索数据用
            invoiceCompanySelected: '',
            // 公司发票名称税号临时保存对象，本地增加invoiceCompanyList用，同时会发送到后端保存
            invoiceCompanyNewTemp: {
                name: '',
                number: ''
            },
            // 收票人地址数组
            invoiceAddressList: [],
            // 收票人地址临时保存字段，判断状态与搜索数据用
            invoiceAddressSelected: '',
            // 收票人地址临时保存对象，本地增加invoiceAddressList用，同时会发送到后端保存
            invoiceAddressNewTemp: {
                name: '',
                mobile: '',
                address: '',
                province: '',
                city: '',
                region: '',
                // 省市区拼接的汉字
                addressPrefix: ''
            },
            // 通用地址信息对象
            commonAddressList: {
                province: [],
                city: [],
                region: []
            },
            // 发送的数据
            invoiceForm: {
                invoiceType: '',
                invoiceTitle: '',
                recvName: '',
                recvMobile: '',
                recvAddr: '',
                companyPhone: '',
                description: '',
                taxpayerNumber: '',
                mailingMethod: 1
            },
            dialogVisible: false,
            // 个人发票进入编辑状态
            isEdit: false,
            // 操作备注
            operationMemo: ''
        }
    },
    async created () {
        if (this.$route.name === 'EditInvoice') {
            this.isEditInvoice = true
        }
        try {
            this.getInvoiceObject()
            await this.getCompanyMessage()
            await this.checkCreateInfo()
        } catch (e) {
            throw e
        }
    },
    watch: {
        invoiceCompanySelected (val) {
            if (val !== 'add') {
                for (const item of this.invoiceCompanyList) {
                    if (item.value === val) {
                        this.invoiceForm.invoiceTitle = item.name
                        this.invoiceForm.taxpayerNumber = item.value
                    }
                }
            }
        },

        async 'invoiceAddressNewTemp.province' (val) {
            // 省市区数据中的省份变动时，发送请求获取数据
            this.invoiceAddressNewTemp.city = ''
            this.invoiceAddressNewTemp.region = ''
            if (val) {
                const { result } = await getLocation(val)
                this.commonAddressList.city = result
            }
        },
        async 'invoiceAddressNewTemp.city' (val) {
            // 省市区数据中的市变动时，发送请求获取数据
            this.invoiceAddressNewTemp.region = ''
            if (val) {
                const { result } = await getLocation(val)
                this.commonAddressList.region = result
            }
        },
        async 'invoiceAddressNewTemp.region' () {
            // 省市区数据中的地区变动时，进行汉字的拼接操作
            this.invoiceAddressNewTemp.addressPrefix = ''
            for (const item of this.commonAddressList.province) {
                if (item.locationCode === this.invoiceAddressNewTemp.province) {
                    this.invoiceAddressNewTemp.addressPrefix += item.locationName
                }
            }
            for (const item of this.commonAddressList.city) {
                if (item.locationCode === this.invoiceAddressNewTemp.city) {
                    this.invoiceAddressNewTemp.addressPrefix += item.locationName
                }
            }
            for (const item of this.commonAddressList.region) {
                if (item.locationCode === this.invoiceAddressNewTemp.region) {
                    this.invoiceAddressNewTemp.addressPrefix += item.locationName
                }
            }
        }
    },
    methods: {
        operationMemoChange () {
            if (this.operationMemo === '其他') {
                this.invoiceForm.description = ''
            } else {
                this.invoiceForm.description = this.operationMemo
            }
        },
        async invoiceAddressChange () {
            this.invoiceForm.mailingMethod = 0
            if (this.invoiceAddressSelected === 'add') {
                // 通过select选择地址时，如果是添加地址，则获取省市区数据
                this.invoiceForm.recvName = ''
                this.invoiceForm.recvMobile = ''
                this.invoiceForm.recvAddr = ''
                const { result } = await getLocation('0')
                this.commonAddressList.province = result
            } else if (!this.invoiceAddressSelected) {
                this.invoiceForm.mailingMethod = 1
                this.invoiceForm.recvName = ''
                this.invoiceForm.recvMobile = ''
                this.invoiceForm.recvAddr = ''
            } else {
                if (isPhone(this.invoiceAddressSelected.split(' ')[1])) {
                    this.invoiceForm.recvName = this.invoiceAddressSelected.split(' ')[0]
                    this.invoiceForm.recvMobile = this.invoiceAddressSelected.split(' ')[1]
                    this.invoiceForm.recvAddr = this.invoiceAddressSelected.split(' ')[2]
                } else {
                    this.invoiceForm.recvName = ''
                    this.invoiceForm.recvMobile = ''
                    this.invoiceForm.recvAddr = ''
                }
            }
        },
        async invoiceTypeChage () {
            if (this.invoiceForm.invoiceType === '0') {
                // 发票类型为个人
                this.invoiceForm.taxpayerNumber = ''
                this.invoiceForm.invoiceTitle = this.invoicePersonalNewTemp.name || this.invoiceAddressNewTemp.name || this.invoiceOrderList[0].userName
                this.invoiceForm.companyPhone = this.invoicePersonalNewTemp.mobile || this.invoiceAddressNewTemp.mobile || this.invoiceOrderList[0].mobile
            } else {
                // 发票类型为公司invoiceCompanySelected
                this.invoiceForm.companyPhone = ''
                this.invoiceForm.invoiceTitle = ''
                const invoiceTitle = this.invoiceCompanyList.find(item => this.invoiceCompanySelected === item.value)
                if (invoiceTitle && Object.keys(invoiceTitle)) {
                    this.invoiceForm.invoiceTitle = invoiceTitle.name
                } else {
                    this.invoiceForm.invoiceTitle = ''
                }
                this.invoiceForm.taxpayerNumber = this.invoiceCompanySelected || ''
            }
        },
        async getCompanyMessage () {
            this.invoiceCompanyList = [{ label: '添加', value: 'add' }]
            const { result } = await getEinList(this.userId)
            if (result && result.length) {
                for (const item of result) {
                    this.invoiceCompanyList.unshift({
                        label: `${ item.entName } ${ item.tin }`,
                        value: item.tin,
                        name: item.entName
                    })
                }
            }
        },
        // 检查创建发票数据
        async checkCreateInfo () {
            if (this.$route.query && this.$route.query.id && this.$route.query.userId) {
                this.userId = this.$route.query.userId
                this.id = this.$route.query.id
                try {
                    await this.getAddress(this.userId)
                    if (this.isEditInvoice) {
                        await this.getInvoiceDetail()
                    } else {
                        await this.getOrderDetail(this.id)
                    }
                } catch (e) {
                    throw e
                }
            }
        },
        // 获取发票详情
        async getInvoiceDetail () {
            try {
                const { result } = await getInvoiceDetail(this.id)
                this.invoiceOrderList = result.orderInfos
                const { invoiceType, invoiceTitle, recvName, recvMobile, recvAddr, mobile, description, taxpayerNumber, mailingMethod } = result
                if (String(invoiceType) === '0') {
                    this.invoiceAddressNewTemp.name = invoiceTitle
                    this.invoiceAddressNewTemp.mobile = mobile
                }
                if (String(invoiceType) === '1') {
                    this.invoiceCompanyList.unshift({
                        label: `${ invoiceTitle } ${ taxpayerNumber }`,
                        name: invoiceTitle,
                        value: taxpayerNumber
                    })
                }
                this.invoiceCompanySelected = taxpayerNumber
                if (mailingMethod === '0') this.invoiceAddressSelected = `${ recvName } ${ recvMobile } ${ recvAddr }`

                if (this.invoiceMemoList.find(item => item.dictDataValue === description)) {
                    this.operationMemo = description
                } else {
                    this.operationMemo = '其他'
                }
                this.invoiceForm = {
                    invoiceType: String(invoiceType),
                    invoiceTitle,
                    recvName,
                    recvMobile,
                    recvAddr,
                    companyPhone: mobile,
                    description,
                    taxpayerNumber,
                    mailingMethod
                }
            } catch (e) {
                throw e
            }
        },
        // 发票数据字典
        async getInvoiceObject () {
            // const { data } = await getDataDictionary('invoiceType')
            // this.invoiceTypeList = data.result
            try {
                const { result } = await getDataDictionary('RECEIPTREMARKS')
                this.invoiceMemoList = result
            } catch (e) {
                throw e
            }
        },
        // 进入添加订单
        async addOrder () {
            try {
                this.dialogVisible = true
                await this.searchOrder()
            } catch (e) {
                throw e
            }
        },
        async getOrderList () {
            try {
                if (this.userId) this.orderForm.userId = this.userId
                const { result } = await selectOrderForInvoice(this.orderForm)
                this.searchOrderTable = result.records || []
                this.searchTotal = result.total || 0
            } catch (e) {
                throw e
            }
        },
        async searchOrder () {
            this.orderForm.current = 1
            try {
                await this.getOrderList()
            } catch (e) {
                throw e
            }
        },
        // 分页设置页码并查询
        async sizeChange (val) {
            this.orderForm.size = val
            try {
                await this.getOrderList()
            } catch (e) {
                throw e
            }
        },
        // 选择订单，设置userId方便后续添加时进行限定过滤
        async selectOrder (row) {
            if (row && row.orderId) {
                this.rowId = row.orderId
                this.userIdTemp = row.userId
                this.orderId = row.orderId
            }
        },
        async sureOrder () {
            try {
                if (this.rowId) {
                    if (this.invoiceOrderList && this.invoiceOrderList.find(({ orderId }) => orderId === this.orderId)) return this.$error('不能重复选择开票订单')
                    this.userId = this.userIdTemp
                    await this.getOrderDetail(this.rowId)
                    await this.getAddress(this.userId)
                    this.dialogVisible = false
                } else {
                    this.$error('请选择一条订单记录')
                }
            } catch (e) {
                throw e
            }
        },
        removeOrder (index) {
            this.invoiceOrderList.splice(index, 1)
            // 如果订单数量被删除为0了，清理历史数据
            if (this.invoiceOrderList.length === 0) {
                this.userId = ''
                this.rowId = ''
                this.orderForm.userId = ''
            }
        },
        // 获取订单的详细信息，自动生成的个人发票信息基于这个接口返回的数据
        async getOrderDetail (id) {
            try {
                const { result } = await selectDetailInvoice({ orderId: id })
                this.invoiceOrderList.push(result)
            } catch (e) {
                throw e
            }
        },
        async getAddress (userId) {
            if (userId) {
                const { result } = await getAddressList(userId)
                const array = []
                array.push({ label: '门店自提', value: '' })
                for (const item of result) {
                    array.push({ label: `${ item.realName } ${ item.mobile } ${ item.addressPrefix }${ item.agencyAddress }`, value: `${ item.realName } ${ item.mobile } ${ item.addressPrefix }${ item.agencyAddress }` })
                }
                this.invoiceAddressList = array
                this.invoiceAddressList.push({ label: '添加', value: 'add' })
            }
        },
        // 本地保存用户修改的个人发票信息
        savePersonalNew () {
            if (this.invoicePersonalNewTemp.name && this.invoicePersonalNewTemp.mobile) {
                if (this.testMobile(this.invoicePersonalNewTemp.mobile)) {
                    this.invoiceForm.invoiceTitle = this.invoicePersonalNewTemp.name
                    this.invoiceForm.companyPhone = this.invoicePersonalNewTemp.mobile
                    this.isEdit = false
                }
            } else {
                this.$error('请输入正确的开票人姓名与电话')
            }
        },
        // 将用户手动添加的企业发票信息保存到本地列表，并发送给后端
        async saveCompanyNewList () {
            if (this.invoiceCompanyNewTemp.name && this.invoiceCompanyNewTemp.number) {
                if (this.testCode(this.invoiceCompanyNewTemp.number)) {
                    try {
                        await addEinList({ userId: this.userId, entName: this.invoiceCompanyNewTemp.name, tin: this.invoiceCompanyNewTemp.number })
                    } catch (e) {
                        this.$error('保存企业发票信息到服务器失败，但您仍可以使用该信息进行本次发票申请')
                    }
                    this.invoiceCompanyList.unshift({
                        label: `${ this.invoiceCompanyNewTemp.name } ${ this.invoiceCompanyNewTemp.number }`,
                        value: this.invoiceCompanyNewTemp.number,
                        name: this.invoiceCompanyNewTemp.name
                    })
                    this.invoiceCompanySelected = this.invoiceCompanyNewTemp.number
                }
            } else {
                this.$error('请您填写正确的企业发票信息')
            }
        },
        // 将用户输入的收票人信息保存到本地列表，并发送给后端
        async saveAddressNewList () {
            try {
                if (this.invoiceAddressNewTemp.province && this.invoiceAddressNewTemp.city && this.invoiceAddressNewTemp.region && this.invoiceAddressNewTemp.addressPrefix && this.invoiceAddressNewTemp.address && this.invoiceAddressNewTemp.mobile && this.invoiceAddressNewTemp.name) {
                    const { result } = await addAddressList({
                        userId: this.userId,
                        country: '',
                        province: this.invoiceAddressNewTemp.province,
                        city: this.invoiceAddressNewTemp.city,
                        region: this.invoiceAddressNewTemp.region,
                        addressPrefix: this.invoiceAddressNewTemp.addressPrefix,
                        agencyAddress: this.invoiceAddressNewTemp.address,
                        mobile: this.invoiceAddressNewTemp.mobile,
                        realName: this.invoiceAddressNewTemp.name,
                        town: '',
                        defaultAddress: 'NO',
                        type: 2
                    })
                    this.invoiceAddressList.unshift({
                        label: `${ result.realName } ${ result.mobile } ${ result.addressPrefix }${ result.agencyAddress }`,
                        value: result.sequenceNbr,
                        name: result.realName,
                        mobile: result.mobile,
                        address: `${ result.addressPrefix }${ result.agencyAddress }`
                    })
                    this.invoiceAddressSelected = result.sequenceNbr
                } else {
                    this.$error('请您填写正确的收票人地址信息')
                }
            } catch (e) {
                throw e
            }
        },
        // 表单验证，因为使用了非常多的临时信息变量，所以不适用于element ui自带的验证功能
        testCode (code) {
            if (!code) {
                return false
            }
            if (!isCreditNumber(code)) {
                this.$error('请输入正确的纳税人识别号')
                return false
            }
            return true
        },
        testMobile (mobile) {
            if (!mobile) {
                return false
            }
            if (!isPhone(mobile)) {
                this.$error('请输入正确的手机号')
                return false
            }
            return true
        },
        async checkForm () {
            try {
                if (this.isEdit) return this.$error('请先保存或者取消编辑信息')
                if (this.invoiceForm.invoiceType) {
                    if (this.invoiceForm.mailingMethod === 1) {
                        this.invoiceForm.recvName = ''
                        this.invoiceForm.recvMobile = ''
                        this.invoiceForm.recvAddr = ''
                    }
                    if (this.invoiceForm.mailingMethod === 0 && (!this.invoiceForm.recvName || !this.invoiceForm.recvMobile || !this.invoiceForm.recvAddr)) return this.$error('收票地址信息不完整')
                    if (this.invoiceForm.invoiceType === '0') {
                        if (this.invoiceForm.invoiceTitle && this.invoiceForm.companyPhone && this.invoiceForm.description) {
                            await this.applyInvoice()
                        } else {
                            this.$error('您填写的信息不完整，请重新填写！')
                        }
                    } else if (this.invoiceForm.invoiceType === '1') {
                        if (this.invoiceForm.invoiceTitle && this.invoiceForm.taxpayerNumber && this.invoiceForm.description) {
                            await this.applyInvoice()
                        } else {
                            this.$error('您填写的信息不完整，请重新填写！')
                        }
                    } else {
                        this.$error('您的发票类型不正确，请刷新页面后重新申请')
                    }
                } else {
                    this.$error('请选择发票类型！')
                }
            } catch (e) {
                throw e
            }
        },
        // 发起请求，数据是否为空的验证在checkForm里面
        async applyInvoice () {
            try {
                this.invoiceForm.orderIds = []
                for (const item of this.invoiceOrderList) {
                    this.invoiceForm.orderIds.push(item.orderId)
                }
                const form = JSON.parse(JSON.stringify(this.invoiceForm))
                form.invoiceType = Number(this.invoiceForm.invoiceType)
                if (this.isEditInvoice) {
                    form.id = this.id
                    await editInvoice(form)
                    await this.$success('编辑成功！')
                } else {
                    await applyInvoice(form)
                    await this.$success('申请成功！')
                }
                await this.$router.back()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .apply-invoice {
    display: flex;
    flex-direction: column;
    align-items: center;
    .apply-top {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 100%;
      height: 52px;
      margin-bottom: 28px;
      padding: 0 24px;
      border-bottom: 1px solid #E7E7E7;
      background-color: #ffffff;

      ::v-deep .el-icon-back {
        color: #598BF8;
        font-size: 24px;
        font-weight: bolder;
        cursor: pointer;
      }

      span {
        margin-left: 30px;
        color: #333333;
        font-size: 16px;
        font-weight: bolder;
      }
    }
    .apply-list{
      .list-item{
        width: 1367px;
        padding: 24px;
        border-bottom: 1px solid #E7E7E7;
        color: #333333;
        font-size: 18px;
        background-color: #ffffff;
        position: relative;
        .item-delete{
          color: #598BF8;
          font-size: 14px;
          position: absolute;
          top: 27px;
          right: 64px;
          cursor: pointer;
        }
        h3{
          margin-bottom: 24px;
        }
        p{
          margin-bottom: 16px;
        }
        .list-goods{
          display: flex;
          align-items: center;
          .goods-item{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            margin-right: 10px;
            border: 1px solid #cccccc;
            border-radius: 5px;
            position: relative;
            i{
              color: #999999;
              font-size: 18px;
              position: absolute;
              top: 4px;
              right: 4px;
              z-index: 99;
            }
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .active{
            border: 1px solid #F2B036;
            i{
              color: #F2B036;
            }
          }
        }
      }
    }
    .apply-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1367px;
      height: 60px;
      color: #598BF8;
      font-size: 24px;
      background-color: #ffffff;
      cursor: pointer;
    }
    .apply-info {
      display: flex;
      flex-direction: column;
      width: 1367px;
      margin-top: 24px;
      padding: 24px 0 32px 24px;
      color: #333333;
      font-size: 14px;
      background-color: #ffffff;
      ::v-deep .el-textarea>textarea{
        height: 100%;
        resize: none;
      }
      .list-btn{
        padding-top: 16px;
        border-top: 1px solid #E7E7E7;
      }
      .text-btn{
        color: #598BF8;
        font-size: 12px;
        margin-left: 20px;
        cursor: pointer;
      }
    }
    ::v-deep .el-dialog{
      .el-dialog__header{
        padding: 29px 32px 16px;
        .el-dialog__title{
          font-size: 16px;
          font-weight: bolder;
        }
        .el-dialog__headerbtn > i{
          color: #333333;
          font-size: 26px;
        }
      }
      .el-dialog__body{
        padding: 0 32px 32px !important;
      }
    }
    ::v-deep .el-table {
      /*解决表格选择最后一项时，自定义的底部边框被遮挡的问题*/
      &::before{
        content: unset !important;
      }
      th > .cell{
        color: #333333;
        font-size: 12px;
        font-weight: bolder;
      }
      .el-table__row{
        height: 56px;
      }
      .current-row{
        > td{
          &:first-of-type{
            border-left: 1px solid #EC742E;
          }
          &:last-of-type{
            border-right: 1px solid #EC742E;
          }
          box-sizing: border-box;
          border-top: 1px solid #EC742E;
          border-bottom: 1px solid #EC742E;
        }
      }
    }
    ::v-deep .el-pagination{
      margin-top: 12px;
      .el-pager {
        .active,li:hover{
          color: #EC742E;
        }
      }
    }
  }
</style>
