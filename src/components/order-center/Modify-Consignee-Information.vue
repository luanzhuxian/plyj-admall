<template>
    <div class="modify-consignee-cnformation">
        <el-dialog
            title="修改收货人信息"
            width="600px"
            :visible="show"
            @close="close"
        >
            <el-form label-position="left">
                <el-form-item
                    label="收货人地址:"
                    label-width="100px"
                >
                    <el-select
                        v-model="addressSelected"
                        @change="addressSelectedChange()"
                        style="width: 380px;"
                    >
                        <el-option
                            v-for="(item,index) of addressList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <template v-if="addressSelected === 'add'">
                    <el-form-item
                        label="新增姓名"
                        label-width="100px"
                    >
                        <el-input
                            style="width: 184px;"
                            placeholder="请输入收货人姓名"
                            v-model="addressNewTemp.name"
                        />
                    </el-form-item>
                    <el-form-item
                        label="新增电话"
                        label-width="100px"
                    >
                        <el-input
                            style="width: 184px;"
                            placeholder="请输入收货人电话"
                            v-model="addressNewTemp.mobile"
                        />
                    </el-form-item>
                    <el-form-item
                        label="新增地址"
                        label-width="100px"
                    >
                        <CityPicker
                            @selected="selectedCity"
                        />
                    </el-form-item>
                    <el-form-item
                        label="新增详细地址"
                        label-width="100px"
                    >
                        <el-input
                            style="width: 260px;"
                            placeholder="请输入收货人详细地址"
                            v-model="addressNewTemp.address"
                        />
                        <span
                            class="text-btn"
                            @click="saveAddressNew"
                        >保存</span>
                        <span
                            class="text-btn"
                            @click="initAddress()"
                        >取消</span>
                    </el-form-item>
                </template>
            </el-form>
            <div
                class="info-detail"
                v-if="addressSelected !== 'add'"
            >
                <p>
                    <span>姓名:</span>
                    <span v-text="addressDetail.name" />
                </p>
                <p>
                    <span>联系电话:</span>
                    <span v-text="addressDetail.mobile" />
                </p>
                <p>
                    <span>详细地址:</span>
                    <span v-text="addressDetail.address" />
                </p>
            </div>
            <div
                v-show="addressSelected !== 'add'"
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="close()">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    @click="saveAddressSelected"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getAddressList, addAddressList, modifyConsigneeInformation } from '../../apis/order'
import CityPicker from '../common/base/City-Picker.vue'
import { resetForm } from '../../assets/ts/utils'
import { isPhone } from '../../assets/ts/validate'
export default {
    name: 'ModifyConsigneeInformation',
    components: {
        CityPicker
    },
    data () {
        return {
            // 修改收货人地址信息
            consigneeVisible: false,
            // 服务器的原始数据备份，select选择项目以后，取展示信息时使用
            addressDataList: [],
            // 本地创造的数据，供select选择使用
            addressList: [],
            // select选择项目以后，展示的详情，数据来自addressDataList
            addressDetail: {
                name: '',
                mobile: '',
                address: ''
            },
            // 修改收货信息发送数据
            addressSelected: '',
            // 收件人地址临时保存对象，本地增加addressList用，同时会发送到后端保存
            addressNewTemp: {
                name: '',
                mobile: '',
                address: '',
                province: '',
                city: '',
                region: '',
                // 省市区拼接的汉字
                addressPrefix: ''
            }
        }
    },
    props: {
        show: Boolean,
        consigneeData: {
            type: Object,
            default () {
                return {}
            }
        },
        orderId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    },
    watch: {
        async show (val) {
            if (this.$refs.shipForm) {
                this.$refs.shipForm.clearValidate()
            }
            if (val) {
                try {
                    this.addressDetail = JSON.parse(JSON.stringify(this.consigneeData))
                    this.initAddress()
                    await this.getAddress()
                } catch (e) {
                    throw e
                }
            } else {
                resetForm(this.addressNewTemp)
                resetForm(this.addressDetail)
                this.addressDataList = []
                this.addressList = []
                this.addressSelected = ''
            }
        }
    },
    methods: {
        addressSelectedChange () {
            if (this.addressSelected !== 'add') {
                for (const item of this.addressDataList) {
                    if (`${ item.realName } ${ item.mobile } ${ item.addressPrefix }${ item.agencyAddress }` === this.addressSelected) {
                        this.addressDetail = {
                            name: item.realName,
                            mobile: item.mobile,
                            address: `${ item.addressPrefix }${ item.agencyAddress }`
                        }
                    }
                }
            }
        },
        initAddress () {
            this.addressSelected = `${ this.addressDetail.name } ${ this.addressDetail.mobile } ${ this.addressDetail.address }`
        },
        // 手机号验证
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
        selectedCity (val) {
            const province = val[0].code
            const city = val[1].code
            const region = val[2] ? val[2].code : ''
            const town = val[3] ? val[3].code : ''
            const addressPrefix = val[0].name +
        val[1].name +
        (val[2] ? val[2].name : '') +
        (val[3] ? val[3].name : '')

            this.addressNewTemp.province = province
            this.addressNewTemp.city = city
            this.addressNewTemp.region = region
            this.addressNewTemp.town = town
            this.addressNewTemp.addressPrefix = addressPrefix
        },
        // 获取收货人地址列表
        async getAddress () {
            if (this.userId) {
                const { result } = await getAddressList(this.userId)
                if (result && result.length) {
                    this.addressDataList = result
                    const array = []
                    for (const item of result) {
                        array.push({
                            label: `${ item.realName } ${ item.mobile } ${ item.addressPrefix }${ item.agencyAddress }`,
                            value: `${ item.realName } ${ item.mobile } ${ item.addressPrefix }${ item.agencyAddress }`
                        })
                    }
                    this.addressList = array
                }
                this.addressList.push({ label: '添加', value: 'add' })
                if (!this.addressSelected) {
                    this.addressSelected = this.addressList[0].value
                }
            }
        },
        // 将用户输入的收货人信息保存到本地列表，并发送给后端
        async saveAddressNew () {
            if (this.addressNewTemp.province && this.addressNewTemp.city && this.addressNewTemp.region && this.addressNewTemp.addressPrefix && this.addressNewTemp.address && this.addressNewTemp.name && this.addressNewTemp.mobile) {
                if (this.testMobile(this.addressNewTemp.mobile)) {
                    const { result } = await addAddressList({
                        userId: this.userId,
                        country: '',
                        province: this.addressNewTemp.province,
                        city: this.addressNewTemp.city,
                        region: this.addressNewTemp.region,
                        addressPrefix: this.addressNewTemp.addressPrefix,
                        agencyAddress: this.addressNewTemp.address,
                        mobile: this.addressNewTemp.mobile,
                        realName: this.addressNewTemp.name,
                        town: this.addressNewTemp.town,
                        defaultAddress: 'NO',
                        type: 2
                    })
                    await this.getAddress()
                    this.addressDetail = {
                        name: result.realName,
                        mobile: result.mobile,
                        address: `${ result.addressPrefix }${ result.agencyAddress }`,
                        addressSeq: result.sequenceNbr
                    }
                    this.addressSelected = `${ result.realName } ${ result.mobile } ${ result.addressPrefix }${ result.agencyAddress }`
                }
            } else {
                this.$error('请您填写正确的收货人地址信息')
            }
        },
        // 将用户选择的收货人信息进行提交
        async saveAddressSelected () {
            if (!this.addressSelected) {
                this.$error('请选择收货人地址')
                return false
            }
            if (this.addressSelected !== 'add') {
                await modifyConsigneeInformation({ ...this.addressDetail, orderId: this.orderId })
                await this.$success('修改收货人信息成功')
                this.$emit('update:show', false)
                this.$emit('success', true)
            } else {
                this.$error('请先保存您输入的收货人信息，再进行提交')
            }
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
  .modify-consignee-cnformation{
    .info-detail {
      width: 480px;
      padding: 12px;
      background-color: #fbfbfb;

      > p {
        margin-bottom: 20px;

        &:last-of-type {
          margin-bottom: 0;
        }

        > span:first-of-type {
          display: inline-flex;
          justify-content: flex-end;
          width: 60px;
          color: #666;
          font-size: 12px;
        }

        > span:last-of-type {
          margin-left: 30px;
        }
      }
    }

    .text-btn {
      color: #598bf8;
      font-size: 12px;
      margin-left: 20px;
      cursor: pointer;
    }

    .list-goods {
      display: flex;
      align-items: center;

      .goods-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        position: relative;

        i {
          color: #999;
          font-size: 18px;
          position: absolute;
          top: 4px;
          right: 4px;
          z-index: 99;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .active {
        border: 1px solid #f2b036;

        i {
          color: #f2b036;
        }
      }
    }
  }
</style>
