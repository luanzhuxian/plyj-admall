<template>
    <el-dialog
        title="请您创建一家店铺"
        :visible="createdMallShow"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="540px"
        @close="close"
    >
        <el-form ref="mallInfoForm" :model="mallInfoForm" :rules="mallInfoFormRules" style="padding: 0 54px;" label-width="95px" label-position="left">
            <el-form-item label="店铺名称：" prop="mallName">
                <el-input v-model="mallInfoForm.mallName" placeholder="请输入15字以内的中英文字符" />
            </el-form-item>
            <el-form-item label="联系方式：" prop="contactWay">
                <el-input placeholder="请输入内容" v-model="contactWay.contactWay" @change="contactWayChange">
                    <el-select v-model="contactWay.contactWayType" slot="prepend" placeholder="请选择" :class="$style.contactWay" @change="contactWayTypeChange">
                        <el-option label="座机" value="LANDLINE" />
                        <el-option label="手机" value="MOBILE" />
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="详细地址：">
                <CityPicker @selected="citySelected" />
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="mallInfoForm.address" placeholder="请输入详细地址" />
            </el-form-item>
            <el-form-item label="服务顾问：">
                <el-select
                    v-model="mallInfoForm.consultantUserId"
                    :disabled="!mallInfoForm.province" :placeholder="!mallInfoForm.province ? '请先选择地址' : '请选择服务顾问'"
                    style="width: 100%;"
                >
                    <el-option
                        v-for="(item, i) of consultantList"
                        :key="i"
                        :value="item.userId"
                        :label="item.name + ' ' + item.engName"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="主营类目：">
                <el-checkbox-group v-model="mallInfoForm.mallCategoryIds" :class="$style.mallCategory">
                    <el-checkbox
                        v-for="item of mainCategories"
                        :key="item.code"
                        :label="item.code"
                    >
                        {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label-width="65px">
                <el-button round size="medium" type="primary" style="width: 272px;" @click="saveMallInfo">完成</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import {
    getMainCategories,
    getConsultantList,
    mallInfoData,
    contactWayType
} from '../../../apis/home'
import { isLandlinePhone, isPhone, testName } from '../../../assets/ts/validate'
import CityPicker from '../City-Picker.vue'
import { namespace } from 'vuex-class'
const testServicePhoneModels = (contactWayType: string): Function => function (rule: any, value: any, callback: Function) {
    if (contactWayType === 'MOBILE') {
        if (!isPhone(value)) {
            callback(new Error('请输入正确的手机号'))
            return
        }
        callback()
        return
    }
    if (contactWayType === 'LANDLINE') {
        if (!isLandlinePhone(value)) {
            callback(new Error('请输入正确的座机号'))
            return
        }
        callback()
    }
}
const user = namespace('user')

@Component({
    components: {
        CityPicker
    }
})
export default class CreateMall extends Vue {
    // 主营类目
    private mainCategories = []
    // 顾问
    private consultantList = []
    // 联系方式
    private contactWay: contactWayType = {
        contactWay: '',
        contactWayType: 'MOBILE'
    }

    // 商城信息
    private mallInfoForm: mallInfoData = {
        mallName: '',
        province: '',
        city: '',
        region: '',
        town: '',
        address: '',
        provinceCode: '',
        cityCode: '',
        regionCode: '',
        townCode: '',
        consultantUserId: '',
        mallCategoryIds: [],
        servicePhoneModels: [],
        contactWay: ''
    }

    private mallInfoFormRules = {
        mallName: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' },
            { validator: testName(15), message: '请输入15字以内的中英文字符', trigger: 'blur' }
        ],
        contactWay: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { validator: testServicePhoneModels('MOBILE'), trigger: 'blur' }
        ]
    }

    @Prop({ type: Boolean, default: false }) createdMallShow!: boolean

    @Watch('createdMallShow')
    async onChange (val: boolean) {
        if (val) {
            await this.getMainCategories()
        }
    }

    @user.Getter currentStep!: number
    @user.Action('createMall') createMall!: Function

    close () {
        this.$emit('update:createdMallShow', false)
        this.$emit('close', false)
    }

    // 获取主营类目
    async getMainCategories () {
        const { result } = await getMainCategories()
        this.mainCategories = result || []
    }

    // 获取顾问
    async getConsultantList (province: string) {
        try {
            const { result } = await getConsultantList(province)
            this.consultantList = result
        } catch (e) {
            throw e
        }
    }

    // 选择地区
    async citySelected (data: any) {
        const province = data[0]
        const city = data[1]
        const counties = data[2]
        const town = data[3]
        this.mallInfoForm.province = province.name
        this.mallInfoForm.provinceCode = province.code
        this.mallInfoForm.city = city.name
        this.mallInfoForm.cityCode = city.code
        if (counties) {
            this.mallInfoForm.region = counties.name
            this.mallInfoForm.regionCode = counties.code
        }
        if (town) {
            this.mallInfoForm.town = town.name
            this.mallInfoForm.townCode = town.code
        }
        await this.getConsultantList(province.code)
    }

    async saveMallInfo () {
        await (this.$refs.mallInfoForm as HTMLFormElement).validate()
        this.mallInfoForm.servicePhoneModels = [
            {
                contactWayType: this.contactWay.contactWayType,
                contactWay: this.contactWay.contactWay
            }
        ]
        delete this.mallInfoForm.contactWay
        await this.createMall(this.mallInfoForm)
        this.close()
        let countdown = 3
        let success = this.$success(`保存成功！${ countdown }秒后刷新`)
        setInterval(() => {
            countdown--
            if (countdown <= 0) {
                location.reload()
                return
            }
            success.close()
            success = this.$success(`保存成功！${ countdown }秒后刷新`)
        }, 1000)
    }

    // 输入联系方式
    contactWayChange (val: string) {
        this.mallInfoForm.contactWay = val
    }

    // 切换联系方式
    contactWayTypeChange (val: string) {
        this.mallInfoFormRules.contactWay.splice(1, 1, {
            validator: testServicePhoneModels(val),
            trigger: 'blur'
        })
    }
}
</script>

<style module lang="scss">
    .contactWay {
        width: 80px;
    }
    .mallCategory {
        display: grid;
        grid-template-columns: repeat(3, 33%);
        grid-column-gap: 10px;
    }
</style>
