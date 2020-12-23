<template>
    <div class="city-picker-wexin">
        <el-select
            class="mr-10"
            v-model="province"
            @change="val => { positionChange(val, 'provinceList') }"
            placeholder="省"
            :disabled="disabled"
        >
            <el-option
                v-for="(item, i) of provinceList"
                :key="i"
                :label="item.locationName"
                :value="item.locationCode"
            />
        </el-select>
        <el-select
            class="mr-10"
            v-model="city"
            placeholder="市"
            @change="val => { positionChange(val, 'cityList') }"
            :disabled="disabled"
        >
            <el-option
                v-for="(item, i) of cityList"
                :key="i"
                :label="item.locationName"
                :value="item.locationCode"
            />
        </el-select>
        <el-select
            v-if="regionList.length"
            class="mr-10"
            v-model="region"
            placeholder="县/区"
            @change="val => { positionChange(val, 'regionList') }"
            :disabled="disabled"
        >
            <el-option
                v-for="(item, i) of regionList"
                :key="i"
                :label="item.locationName"
                :value="item.locationCode"
            />
        </el-select>
    </div>
</template>

<script>
import {
    getProvincesBankList
} from '../../../../apis/base/register'
export default {
    name: 'CityPickerWexin',
    data () {
        return {
            province: '',
            city: '',
            region: '',
            provinceList: [],
            cityList: [],
            regionList: []
        }
    },
    model: {
        event: 'change',
        prop: 'value'
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        default: {
            type: Array,
            default () {
                return []
            }
        }
    },
    watch: {
        default: {
            async handler (val) {
                val = val || ''
                const { result: province } = await getProvincesBankList()
                this.provinceList = province
                this.province = val[0] || ''
                if (val[1]) {
                    const { result: city } = await getProvincesBankList(val[0])
                    this.cityList = city
                    this.city = val[1]
                }
                if (val[2]) {
                    const { result: region } = await getProvincesBankList(val[1])
                    this.regionList = region
                    this.region = val[2]
                }
            },
            immediate: true
        }
    },
    methods: {
        async positionChange (val, listType) {
            try {
                const data = await getProvincesBankList(val)
                if (listType === 'provinceList') {
                    this.cityList = data.result
                    this.regionList = []
                    this.city = ''
                    this.region = ''
                    return
                }
                if (listType === 'cityList') {
                    this.regionList = data.result
                    this.region = ''
                    if (this.regionList.length === 0) {
                        this.$emit('change', this.city)
                    }
                    return
                }
                if (listType === 'regionList') {
                    this.$emit('change', this.region)
                }
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .city-picker-wexin {
    display: inline-block;
    ::v-deep {
      .el-input {
        width: 100%;
      }
    }
  }
</style>
