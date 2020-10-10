<template>
    <div class="addressManager">
        <search-box>
            <el-form-item>
                <el-radio-group v-model="addressType" @change="init">
                    <el-radio-button label="DeliveryAddress" border>发货地址</el-radio-button>
                    <el-radio-button label="ShippingAddress" border>退货地址</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    round
                    @click="showAddAddress = true"
                >
                    创建地址
                </el-button>
            </el-form-item>
        </search-box>

        <el-table :data="addressList">
            <el-table-column
                label="序号"
                type="index"
                width="150"
                align="left"
                header-align="left"
            />
            <el-table-column
                label="姓名"
                prop="realName"
                width="150"
            />
            <el-table-column
                label="联系电话"
                prop="mobile"
                width="200px"
            />
            <el-table-column
                label="地址"
                width="500"
            >
                <template slot-scope="scope">
                    <span v-text="scope.row.addressPrefix + scope.row.agencyAddress" />
                </template>
            </el-table-column>
            <el-table-column
                label="创建人"
                prop="resUserName"
                width="150"
            />
            <el-table-column
                label="创建时间"
                prop="recDate"
                width="200"
            />
            <el-table-column
                label="地址类型"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div v-if="row.type === '1'" class="address">
                        发货地址 <span v-if="row.defaultAddress === 'YES'">默认</span>
                    </div>
                    <div v-if="row.type === '3'" class="address">
                        退货地址 <span v-if="row.defaultAddress === 'YES'">默认</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                @click="edit(row)"
                            >
                                编辑
                            </a>
                            <a
                                @click="remove(row.sequenceNbr, row.type)"
                            >
                                删除
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <NewAddress :show.sync="showAddAddress" :address-type="addressType" :data="form" :sequence-nbr="sequenceNbr" @refreshList="init" @clearData="clearData()" />
    </div>
</template>

<script lang="ts">
import {
    deleteAddress
} from '../../../../apis/address'
import NewAddress from '../../../../components/base-setting/logistics-manage/New-address.vue'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MutationTypes } from '@/store/mutation-type'
const goodModule = namespace('goods')

@Component({
    components: {
        NewAddress
    }
})
export default class AddressManager extends Vue {
    form = {}
    sequenceNbr = ''
    addressType = 'DeliveryAddress'
    addressList: any[] = []
    showAddAddress = false
    @goodModule.Getter('receiveAddressList') receiveAddressList!: any[]
    @goodModule.Getter('returnAddressList') returnAddressList!: any[]
    @goodModule.Action(MutationTypes.getReceiveAddress) getReceiveAddress!: Function
    @goodModule.Action(MutationTypes.getReturnAddress) getReturnAddress!: Function

    @Watch('$route')
    onRouteChange () {
        this.init()
    }

    async created () {
        await this.init()
    }

    get dialogTitle () {
        return this.sequenceNbr ? '修改地址' : '添加地址'
    }

    async init () {
        if (this.addressType === 'DeliveryAddress') {
            await this.getReceiveAddress()
            this.addressList = this.receiveAddressList
        }
        if (this.addressType === 'ShippingAddress') {
            await this.getReturnAddress()
            this.addressList = this.returnAddressList
        }
    }

    edit (row: any) {
        this.sequenceNbr = row.sequenceNbr
        this.showAddAddress = true
        this.form = row
    }

    async remove (sequenceNbr: string, type: string) {
        try {
            await this.$confirm('确定删除该地址吗？')
            await deleteAddress({ sequenceNbr, type })
            await this.init()
        } catch (e) {
            throw e
        }
    }

    clearData () {
        this.form = {}
        this.sequenceNbr = ''
    }
}
</script>

<style scoped lang="scss">
  .addressManager {
    min-height: calc(100vh - 110px);
    padding-bottom: 10px;
    background-color: #ffffff;
  }
  .address{
    display: flex;
    align-items: center;
    >span{
      margin-left: 10px;
      height: 18px;
      border: 1px solid #EC742E;
      color: #EC742E;
      line-height: 16px;
      padding: 0 3px;
    }
  }
</style>
