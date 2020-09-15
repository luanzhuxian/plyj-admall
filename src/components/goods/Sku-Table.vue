<template>
    <div class="sku-table">
        <div class="table-main">
            <div class="main-items-img">
                <p class="items-title">
                    图片
                </p>
                <div
                    class="items-item"
                    v-for="(item,index) of createData[0].productAttributeValues"
                    :key="index"
                >
                    <UploadImage
                        :width="180"
                        :height="120"
                        :count="1"
                        :box-width="90"
                        :box-height="60"
                        :need-edit="true"
                        :delete-truth="false"
                        v-model="item.productAttributeImage"
                        ref="UploadImage"
                    />
                </div>
            </div>
            <div class="main-items-edit">
                <p class="items-title">
                    <span>{{ createData[0].productAttributeName }}</span>
                </p>
                <p class="items-btn">
                    <pl-svg name="icon-edit" width="30" @click="$emit('editSku', 1)" />
                    <pl-svg name="icon-del" width="30" @click="$emit('delSku', 1)" />
                </p>
                <div
                    class="items-item"
                    v-for="(item,index) of createData[0].productAttributeValues"
                    :key="index"
                >
                    <span>{{ item.productAttributeValueName }}</span>
                </div>
            </div>
            <div
                class="main-items-edit"
                v-if="createData[1]"
            >
                <p class="items-title">
                    <span>{{ createData[1].productAttributeName }}</span>
                </p>
                <p class="items-btn">
                    <pl-svg name="icon-edit" width="30" @click="$emit('editSku', 2)" />
                    <pl-svg name="icon-del" width="30" @click="$emit('delSku', 2)" />
                </p>
                <div
                    class="items-item-sub"
                    v-for="(item,index) of editData"
                    :key="index"
                >
                    <span>{{ item.skuCode2Name }}</span>
                </div>
            </div>
            <div class="main-items-input">
                <div class="input-items">
                    <div class="items-title">
                        <p>实际售价(元)*</p>
                        <el-tooltip placement="top" v-if="!mchId">
                            <div slot="content">
                                点我开通支付
                            </div>
                            <router-link v-if="regType === 2" tag="p" :to="{ name: 'WechatPay' }" class="fz-12" style="color: red; cursor: pointer;">
                                未开通支付，用户将无法支付
                            </router-link>
                            <router-link v-else tag="p" :to="{ name: 'WechatBind' }" class="fz-12" style="color: red; cursor: pointer;">
                                未开通支付，用户将无法支付
                            </router-link>
                        </el-tooltip>
                    </div>
                    <div
                        class="items-item"
                        v-for="(item,index) of editData"
                        :key="index"
                    >
                        <el-input
                            type="number"
                            v-model="item.price"
                            :disabled="!item.status"
                            @blur="item.price= testMoney(item.price, '实际售价')"
                        />
                    </div>
                </div>
                <div class="input-items">
                    <p class="items-title">
                        原价(元)
                    </p>
                    <div
                        class="items-item"
                        v-for="(item,index) of editData"
                        :key="index"
                    >
                        <el-input
                            type="number"
                            v-model="item.originalPrice"
                            :disabled="!item.status"
                            @blur="item.originalPrice = testMoney(item.originalPrice, '原价')"
                        />
                    </div>
                </div>
                <div class="input-items">
                    <p class="items-title">
                        {{ $route.name.includes('Courses') ? '名额*' : '库存(件)*' }}
                    </p>
                    <div
                        class="items-item"
                        v-for="(item,index) of editData"
                        :key="index"
                    >
                        <el-input
                            type="number"
                            v-model="item.stock"
                            :disabled="!item.status"
                            @blur="item.stock = testPositiveInteger(item.stock, $route.name.includes('Courses') ? '名额' : '库存')"
                        />
                    </div>
                </div>
                <div class="input-items">
                    <p class="items-title">
                        最小起订量(件)*
                    </p>
                    <div
                        class="items-item"
                        v-for="(item,index) of editData"
                        :key="index"
                    >
                        <el-input
                            type="number"
                            v-model="item.minBuyNum"
                            :disabled="!item.status"
                            @blur="item.minBuyNum = testPositiveInteger(item.minBuyNum, '最小起订量')"
                        />
                    </div>
                </div>
                <div class="input-items" v-if="productType=== 'PHYSICAL_GOODS'">
                    <p class="items-title">
                        重量(kg)
                    </p>
                    <div
                        class="items-item"
                        v-for="(item,index) of editData"
                        :key="index"
                    >
                        <el-input
                            type="number"
                            v-model="item.weight"
                            :disabled="!item.status"
                            @blur="item.weight = testPositiveInteger(item.weight, '重量')"
                        />
                    </div>
                </div>
                <div class="input-items" v-if="productType=== 'PHYSICAL_GOODS'">
                    <p class="items-title">
                        体积(m³)
                    </p>
                    <div
                        class="items-item"
                        v-for="(item,index) of editData"
                        :key="index"
                    >
                        <el-input
                            type="number"
                            v-model="item.volume"
                            :disabled="!item.status"
                            @blur="item.volume = testVolume(item.volume, '体积')"
                        />
                    </div>
                </div>
                <div class="input-items">
                    <p class="items-title" />
                    <div
                        class="items-item"
                        v-for="(item,index) of editData"
                        :key="index"
                    >
                        <el-switch
                            v-model.number="item.status"
                            active-color="#4F63FF"
                            inactive-color="#CCCCCC"
                            style="margin-right: 8px;"
                        />
                        <span v-if="item.status" style="color: #4F63FF;">显示</span>
                        <span v-else>关闭</span>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="table-quick-btn"
            :style="{ paddingLeft: `${createData.length === 2 ? '226px' : '109px'}` }"
        >
            <p class="quick-title">
                批量录入数据
            </p>
            <div class="quick-items">
                <div
                    class="items-item"
                    v-for="(value,key) of batchSet"
                    :key="key"
                >
                    <el-input
                        type="number"
                        v-model="batchSet[key]"
                        :placeholder="batchPlaceholder[key]"
                    />
                    <span
                        class="quick-btn"
                        v-if="batchSet[key]"
                        @click="batchSetData(key,value)"
                    >确定</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UploadImage from '../file/Image-Manager.vue'
import { isMoney, isPositiveInteger, isVolume } from '../../assets/ts/validate'
import { mapGetters } from 'vuex'
export default {
    name: 'SkuTable',
    components: {
        UploadImage
    },
    props: {
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
        },
        productType: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            data: [],
            batchSet: {
                price: '',
                originalPrice: '',
                stock: '',
                minBuyNum: '',
                weight: '',
                volume: ''
            },
            batchPlaceholder: {
                price: '实际销售价',
                originalPrice: '原价',
                stock: this.$route.name.includes('Courses') ? '名额' : '库存',
                minBuyNum: '最小起订量',
                weight: '重量',
                volume: '体积'
            }
        }
    },
    computed: {
        ...mapGetters({
            mchId: 'user/mchId',
            regType: 'user/regType'
        })
    },
    watch: {
        productType: {
            handler (val) {
                if (this.productType !== 'PHYSICAL_GOODS') {
                    delete this.batchSet.weight
                    delete this.batchSet.volume
                } else {
                    this.batchSet.weight = ''
                    this.batchSet.volume = ''
                }
            },
            immediate: true
        }
    },
    methods: {
        batchSetData (key, value) {
            switch (key) {
                case 'price': {
                    value = this.testMoney(value, '实际销售价')
                    break
                }
                case 'originalPrice': {
                    value = this.testMoney(value, '原价')
                    break
                }
                case 'stock': {
                    value = this.testPositiveInteger(value, this.$route.name.includes('Courses') ? '名额' : '库存')
                    break
                }
                case 'minBuyNum': {
                    value = this.testPositiveInteger(value, '最小起订量')
                    break
                }
                case 'weight': {
                    value = this.testPositiveInteger(value, '重量')
                    break
                }
                case 'volume': {
                    value = this.testVolume(value, '体积')
                    break
                }
            }
            for (const item of this.editData) {
                item[key] = value
            }
            this.batchSet[key] = ''
        },
        // 金额验证
        testMoney (money, text = '') {
            if (!money) {
                return ''
            }
            if (money > 99999999) {
                this.$warning(`${ text }最高不可超过99999999`)
                return ''
            }
            if (!isMoney(money)) {
                this.$error('请输入正确的金额')
                return ''
            }
            return Number(money)
        },
        // 数量验证
        testPositiveInteger (num, text = '') {
            if (!num) {
                return ''
            }
            if (num > 99999999) {
                this.$warning(`${ text }最高不可超过99999999`)
                return ''
            }
            if (!isPositiveInteger(num)) {
                this.$error('请输入正确的数字')
                return ''
            }
            return Number(num)
        },
        // 重量验证
        testVolume (volume, text = '') {
            if (!volume) {
                return ''
            }
            if (volume > 99999999) {
                this.$warning(`${ text }最高不可超过99999999`)
                return ''
            }
            if (!isVolume(volume)) {
                this.$error('请输入正确的体积')
                return ''
            }
            return Number(volume)
        }
    }
}
</script>

<style scoped lang="scss">
  .sku-table {
    margin-top: 24px;
    .table-main{
      display: flex;
      align-items: stretch;
      .main-items-img{
        display: inline-flex;
        flex-direction: column;
        .items-title{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 98px;
          height: 60px;
          color: #000;
          font-size: 16px;
          font-weight: bolder;
          background-color: #F8F8F8;
          border-radius:10px 10px 0 0;
        }
        .items-item{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 105px;
          min-height: 80px;
          border-left: 1px solid #E7E7E7;
          border-right: 1px solid #E7E7E7;
          border-bottom: 1px solid #E7E7E7;
          &:first-of-type{
            border-top: 1px solid #E7E7E7;
          }
          &:last-of-type{
            border-radius:0 0 10px 10px;
          }
        }
      }
      .main-items-edit{
        display: inline-flex;
        flex-direction: column;
        margin-left: 10px;
        box-shadow: 0 2px 6px 0 rgba(0,0,0,0.1);
        border-radius: 10px;
        position: relative;
        .items-title{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 108px;
          height: 60px;
          color: #000;
          font-size: 16px;
          font-weight: bolder;
          & > span{
            display: block;
            width: 90px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .items-btn{
          position: absolute;
          top: -16px;
          right: 0;
          > svg {
            margin-left: 8px;
            cursor: pointer;
          }
        }
        .items-item{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 108px;
          min-height: 70px;
          border-top: 1px solid #E7E7E7;
          & > span{
            display: block;
            width: 90px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .items-item-sub{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 108px;
          min-height: 70px;
          border-top: 1px solid #E7E7E7;
          & > span{
            display: block;
            width: 90px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .main-items-input{
        display: inline-flex;
        flex-direction: row;
        margin-left: 10px;
        border-radius: 10px;
        border-bottom: 1px solid #E7E7E7;
        .input-items{
          display: flex;
          flex-direction: column;
          width: 170px;
          &:first-of-type{
            .items-item{
              border-left: 1px solid #E7E7E7;
            }
          }
          &:last-of-type{
            width: 90px;
            .items-item{
              justify-content: flex-start;
              border-right: 1px solid #E7E7E7;
            }
          }
          .items-title{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 60px;
            padding: 5px 0;
            color: #000;
            font-size: 16px;
            font-weight: bolder;
            background-color: #F8F8F8;
            &:first-of-type{
              border-radius: 10px 0 0 0;
            }
            &:last-of-type{
              border-radius: 0 10px 0 0;
            }
            > p {
              line-height: 1.5;
            }
          }
          .items-item{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 70px;
            border-top: 1px solid #E7E7E7;
            &:last-of-type{
              border-radius: 0 0 10px 10px;
            }
            ::v-deep .el-input{
              width: 100px;
              height: 30px;
            }
            span{
              color: #CCCCCC;
              font-size: 12px;
            }
          }
        }
      }
    }
    .table-quick-btn{
      display: flex;
      align-items: center;
      margin-top: 16px;
      .quick-title{
        min-width: 106px;
        padding-left: 6px;
        padding-right: 4px;
        color: #666666;
        font-size: 16px;
      }
      .quick-items{
        display: flex;
        align-items: center;
        margin-left: 12px;
        .items-item{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 170px;
          position: relative;
          .el-input{
            width: 100px;
            height: 30px;
          }
          .quick-btn{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 18px;
            color: #FFFFFF;
            font-size: 8px;
            background-color: $--color-primary-blue;
            cursor: pointer;
            position: absolute;
            right: -2px;
          }
        }
      }
    }
  }
</style>
