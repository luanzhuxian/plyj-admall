<template>
    <div>
        <div class="base-info">
            <div class="base-info-title">基础信息</div>
            <el-form
                ref="form"
                :inline="true"
                label-width="100px"
                label-position="left"
                class="base-info-form"
            >
                <el-form-item
                    label="店铺名称"
                    style="width:30%"
                >
                    <span
                        class="text"
                        v-text="mallSaveModel.mallName"
                        v-if="!addMallName && mallSaveModel.mallName"
                    />
                    <el-input
                        clearable
                        v-show="addMallName"
                        v-model.trim="form.mallName"
                        style="width: 200px"
                    />
                    <el-button
                        type="text"
                        v-if="!form.mallName && !mallSaveModel.mallName"
                        @click="addMallName = true"
                    >
                        添加
                    </el-button>
                    <el-button
                        type="text"
                        v-if="form.mallName"
                        @click="save('mallName', 'addMallName')"
                    >
                        保存
                    </el-button>
                    <el-button
                        type="text"
                        v-if="addMallName"
                        @click="() => { addMallName = false; form.mallName = ''; }"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="text"
                        v-if="mallSaveModel.mallName && !addMallName"
                        @click="edit('mallName', addMallName = true)"
                    >
                        修改
                    </el-button>
                </el-form-item>
                <el-form-item label="企业管理员" style="width:30%">{{ entPersonSaveModel.name + ' - ' + entPersonSaveModel.mobile }}</el-form-item>
            </el-form>
        </div>
        <div class="base-info">
            <div class="base-info-title">企业信息</div>
            <el-form
                ref="form"
                :inline="true"
                class="base-info-form"
            >
                <el-form-item label="企业名称：" style="width: 30%">
                    {{ enterpriseSaveModel.entName }}
                </el-form-item>
                <el-form-item label="微信支付商户号：" style="width:30%">
                    {{ mallSaveModel.mchId }}
                </el-form-item>
                <br>
                <!-- <el-form-item label="手机号：" style="width:30%">
                    18966790240
                </el-form-item>
                <el-form-item label="证件类型：" style="width:30%">
                    {{ entPersonSaveModel.idCardType === '1' ? '身份证' : '' }}
                </el-form-item> -->
                <el-form-item label="企业法人姓名：" style="width:30%">
                    {{ entPersonSaveModel.idName }}
                </el-form-item>
                <el-form-item label="微信支付管理员：" style="width:30%">
                    {{ entWxPayInfoVO.contact }}
                </el-form-item>
                <br>
                <el-form-item label="微信支付预留手机号：" style="width:30%">
                    {{ entWxPayInfoVO.contactPhone }}
                </el-form-item>
            </el-form>
        </div>
        <div class="base-info">
            <div class="base-info-title">店铺介绍</div>
            <el-form
                ref="form"
                label-width="100px"
                label-position="left"
                class="base-info-form"
            >
                <el-form-item
                    label="店铺地区"
                >
                    <CityPicker
                        :default-value="defaultCity"
                        @selected="citySelected"
                        style="width: 400px"
                    />
                </el-form-item>
                <el-form-item
                    label="详细地址"
                >
                    <span
                        class="text"
                        v-text="mallSaveModel.address"
                        v-if="!addAddress && mallSaveModel.address"
                    />
                    <el-input
                        clearable
                        v-if="addAddress"
                        v-model.trim="form.address"
                        style="width: 200px"
                    />
                    <el-button
                        type="text"
                        v-if="!form.address && !mallSaveModel.address && !addAddress"
                        @click="addAddress = true"
                    >
                        添加
                    </el-button>
                    <el-button
                        type="text"
                        v-if="form.address"
                        @click="save('address', 'addAddress')"
                    >
                        保存
                    </el-button>
                    <el-button
                        type="text"
                        v-if="addAddress"
                        @click="() => { addAddress = false; form.address = ''; }"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="text"
                        v-if="mallSaveModel.address && !addAddress"
                        @click="edit('address', addAddress = true)"
                    >
                        修改
                    </el-button>
                </el-form-item>
                <el-form-item
                    label="客服电话"
                >
                    <div
                        v-for="(item, i) of form.servicePhoneModels"
                        :key="i"
                    >
                        <span
                            class="text"
                            style="width: 60px;"
                            v-if="!addContactWay[i]"
                        >
                            {{ item.contactWayType === 'MOBILE' ? '手机' : item.contactWayType === 'LANDLINE' ? '座机' : '' }}
                        </span>
                        <el-select
                            v-if="addContactWay[i]"
                            v-model="item.contactWayType"
                            placeholder="请选择电话类型"
                            style="width: 140px;margin-right: 10px"
                        >
                            <el-option
                                label="手机"
                                value="MOBILE"
                            />
                            <el-option
                                label="座机"
                                value="LANDLINE"
                            />
                        </el-select>
                        <span
                            class="text"
                            style="width: 100px;"
                            v-if="!addContactWay[i]"
                        >
                            {{ item.contactUserName }}
                        </span>
                        <el-input
                            v-if="addContactWay[i]"
                            style="width: 200px; margin: 0 30px 10px 0;"
                            placeholder="请输入分校名称（最多12个字）"
                            onblur="value=value.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g,'')"
                            maxlength="12"
                            v-model.trim="item.contactUserName"
                        />
                        <span
                            class="text"
                            style="width: 100px;"
                            v-if="!addContactWay[i]"
                        >
                            {{ item.contactWay }}
                        </span>
                        <el-input
                            v-else
                            style="width: 140px; margin: 0 30px 10px 0;"
                            placeholder="请输入手机或座机"
                            type="tel"
                            v-model.trim="item.contactWay"
                        />
                        <el-button
                            type="text"
                            v-if="addContactWay[i]"
                            @click="setContact(item, i)"
                        >
                            保存
                        </el-button>
                        <el-button
                            type="text"
                            v-if="addContactWay[i]"
                            @click="cancelContact(i)"
                        >
                            取消
                        </el-button>
                        <el-button
                            type="text"
                            v-if="mallSaveModel.contactWay && !addContactWay[i]"
                            @click="edit('servicePhoneModels', i)"
                        >
                            修改
                        </el-button>
                        <el-radio v-if="!addContactWay[i]" style="margin-left: 24px;" v-model="defaultContact" :label="i" @change="setDefaultContact(item, i)">
                            默认
                        </el-radio>
                        <el-button v-if="form.servicePhoneModels.length > 1 && !item.isDefault && !addContactWay.some(item => item)" type="text" style="color: #D2524C" @click="removeContact(i)">
                            删除
                        </el-button>
                    </div>
                    <div v-if="form.servicePhoneModels.length < 3 && !addContactWay.some(item => item)">
                        <el-button type="text" @click="addMoreContactWay">
                            添加电话
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item
                    label="店铺LOGO"
                >
                    <UploadImage
                        v-model="logoList"
                        :need-edit="true"
                        :width="300"
                        :height="300"
                        @remove="removeLogo"
                        :count="1"
                    />
                    <div style="color: #999; font-size: 12px">（店铺logo建议上传尺寸为300*300的图片，图片大小不超过2M ）</div>
                </el-form-item>
                <el-form-item
                    label="店铺描述"
                >
                    <span
                        class="text"
                        v-html="lineBreak(mallSaveModel.mallDesc)"
                        v-if="!addMallDesc && mallSaveModel.mallDesc"
                    />
                    <el-input
                        type="textarea"
                        resize="none"
                        :rows="10"
                        v-if="addMallDesc"
                        v-model.trim="form.mallDesc"
                        style="width: 200px"
                    />
                    <el-button
                        type="text"
                        v-if="!form.mallDesc && !mallSaveModel.mallDesc && !addMallDesc"
                        @click="addMallDesc = true"
                    >
                        添加
                    </el-button>
                    <el-button
                        type="text"
                        v-if="form.mallDesc"
                        @click="save('mallDesc', 'addMallDesc')"
                    >
                        保存
                    </el-button>
                    <el-button
                        type="text"
                        v-if="addMallDesc"
                        @click="() => { addMallDesc = false; form.mallDesc = ''; }"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="text"
                        v-if="mallSaveModel.mallDesc && !addMallDesc"
                        @click="edit('mallDesc', addMallDesc = true)"
                    >
                        修改
                    </el-button>
                    <div style="color: #999; font-size: 12px">（分享店铺链接给好友，将以店铺介绍作为宣传语 ）</div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { setWechat } from '../../../apis/setting'
import CityPicker from '../../../components/common/base/City-Picker.vue'
import UploadImage from '../../../components/common/file/Image-Manager.vue'
import { isPhone, isTelNumber } from '../../../assets/ts/validate'
import { mapGetters, mapActions } from 'vuex'
import { getDataDictionary } from '../../../apis/common'
import { MutationTypes } from '../../../store/mutation-type'

export default {
    name: 'ShopBaseInfo',
    components: {
        CityPicker,
        UploadImage
    },
    data: () => ({
        form: {
            mallName: '',
            province: '',
            city: '',
            region: '',
            town: '',
            address: '',
            mallDesc: '',
            mallUrl: '',
            logoUrl: '',
            servicePhoneModels: [],
            addressPrefix: ''
        },
        defaultContact: 0,
        addMallName: false,
        addAddress: false,

        /**
             * 修改哪条联系方式，就push哪条数据的下标
             * 判断下标是否存在，就可以知道是否在修改状态
             */
        addContactWay: [],
        addMallDesc: false,
        addMallUrl: false,
        addLogoUrl: false,
        logoList: [],
        willRemoveImage: [],

        /*
                    * 正在编辑的联系方式的下标,有则响应下标的值为true，例如：
                    * [true, false, true] 就代表第一条和第三条正在编辑
                    * currentEditContact 与之类似，只不过相应下标存储的是当前编辑的数据备份
                    * */
        contactWayType: [],
        // 正在编辑的联系方式数据备份
        currentEditContact: [],
        rules: {
            mallName: { validator: new RegExp('^.{1,15}$'), message: '店铺名称长度不能超过15个字符' },
            mallDesc: { validator: new RegExp('^(.|\\s){1,200}$'), message: '店铺介绍长度不能超过200个字符' },
            address: { validator: new RegExp('^.{1,50}$'), message: '地址长度不能超过50个字符' }
        },
        showShopCode: false
    }),
    watch: {
        logoList (val) {
            if (val[0] !== this.mallSaveModel.logoUrl && val[0]) {
                this.form.logoUrl = val[0]
                this.save('logoUrl', 'addLogoUrl')
            }
        },
        'form.servicePhoneModels': {
            handler (val) {
                this.form.servicePhoneModels = val || []
                this.defaultContact = val && val.findIndex(item => item.isDefault === 1)
            },
            immediate: true
        }
    },
    created () {
        try {
            this.getType()
        } catch (e) {
            throw e
        }
    },
    mounted () {
        if (this.mallSaveModel.logoUrl) {
            this.logoList.push(this.mallSaveModel.logoUrl)
        }
        this.form.servicePhoneModels = JSON.parse(JSON.stringify(this.mallSaveModel.servicePhoneModels || []))
    },
    computed: {
        ...mapGetters({
            mallSaveModel: 'user/mallSaveModel',
            enterpriseSaveModel: 'user/enterpriseSaveModel',
            entPersonSaveModel: 'user/entPersonSaveModel',
            entWxPayInfoVO: 'user/entWxPayInfoVO',
            defaultLogo: 'defaultLogo'
        }),
        defaultCity () {
            if (this.mallSaveModel.town) return [this.mallSaveModel.province, this.mallSaveModel.city, this.mallSaveModel.region, this.mallSaveModel.town]
            return [this.mallSaveModel.province, this.mallSaveModel.city, this.mallSaveModel.region]
        }
    },
    methods: {
        ...mapActions({
            agencyUserInfo: `user/${ MutationTypes.agencyUserInfo }`
        }),
        async copy () {
            try {
                await this.$copyText(this.url)
                this.$success(`店铺网址 ${ this.url } 已复制到剪贴板！`)
            } catch (e) {
                this.$error(`店铺网址 ${ this.url } 复制失败！请手动复制`)
            }
        },
        edit (field, contactWayIndex) {
            if (field === 'servicePhoneModels') {
                // 修改联系方式
                this.$set(this.addContactWay, contactWayIndex, true)
                this.$set(this.currentEditContact, contactWayIndex, JSON.parse(JSON.stringify(this.form.servicePhoneModels[contactWayIndex])))
            } else {
                this.form[field] = this.mallSaveModel[field]
            }
        },

        /**
             * 保存
             * @param field 要保持的字段
             * @param type 字段显示状态对应的字段
             * @param contactIndex 保存联系方式的时候存在，标记联系方式的下标
             * @returns {Promise<void>}
             */
        async save (field, type) {
            if (this.rules[field] && !this.rules[field].validator.test(this.form[field])) {
                return this.$error(this.rules[field].message)
            }
            try {
                await setWechat(this.form)
                await this.agencyUserInfo()
                this[type] = false
                this.form[field] = ''
                this.$success('保存成功！')
            } catch (e) {
                throw e
            }
        },
        async removeContact (contactIndex) {
            let old
            try {
                await this.$confirm('确定删除吗？')
                old = this.form.servicePhoneModels.splice(contactIndex, 1)
                await setWechat(this.form)
                await this.agencyUserInfo()
                this.$success('已删除！')
            } catch (e) {
                if (e !== 'cancel') {
                    this.$error('删除失败！')
                    this.$set(this.form.servicePhoneModels, contactIndex, old)
                }
                throw e
            }
        },
        async citySelected (data) {
            const form = this.form
            form.province = data[0].code
            form.city = data[1].code
            form.region = data[2] ? data[2].code : ''
            form.town = data[3] ? data[3].code : ''
            form.addressPrefix = `${ data[0] ? data[0].name : '' }${ data[1] ? data[1].name : '' }${ data[2] ? data[2].name : '' }${ data[3] ? data[3].name : '' }`
            try {
                await setWechat(form)
                await this.agencyUserInfo()
                form.province = ''
                form.city = ''
                form.region = ''
                form.town = ''
                this.$success('保存成功！')
            } catch (e) {
                throw e
            }
        },
        async removeLogo () {
            // 先保存起来，不删
            // let key = url.substring(url.indexOf('img/'))
            // await deleteImage([key])
            this.save('logoUrl', 'addLogoUrl')
            this.logoList.splice(0, 1)
        },
        // 获取数组字典-证件期限
        async getType () {
            try {
                const res = await getDataDictionary('contactType')
                if (res.result.length) {
                    for (const item of res.result) {
                        this.contactWayType.push(item)
                    }
                }
            } catch (e) {
                throw e
            }
        },
        // 取消修改联系方式
        cancelContact (i) {
            this.addContactWay.splice(i, 1, false)
            // 修改前的联系方式，用来撤回修改
            const old = this.currentEditContact.splice(i, 1, null)[0]
            // 获取原来的联系方式
            if (old && old.contactWay) {
                this.$set(this.form.servicePhoneModels, i, old)
            } else {
                this.form.servicePhoneModels.splice(i, 1)
            }
        },
        // 添加更多联系方式
        addMoreContactWay () {
            console.log(this.form.servicePhoneModels)
            this.form.servicePhoneModels.push({
                contactUserName: '',
                contactWay: '',
                contactWayType: '',
                isDefault: 0
            })
            this.$set(this.addContactWay, this.form.servicePhoneModels.length - 1, true)
            this.$set(this.currentEditContact, this.form.servicePhoneModels.length - 1, {
                contactUserName: '',
                contactWay: '',
                contactWayType: '',
                isDefault: 0
            })
        },
        setDefaultContact (item, i) {
            for (const contact of this.form.servicePhoneModels) {
                contact.isDefault = 0
            }
            item.isDefault = 1
            this.setContact(item, i)
        },
        async setContact (item, index) {
            if (!item.contactWayType) {
                this.$warning('电话类型不能为空')
                return
            }
            if (!item.contactWay) {
                this.$warning('电话不能为空')
                return
            }
            if (!isPhone(item.contactWay) && !isTelNumber(item.contactWay)) {
                this.$warning('请输入正确的电话格式')
                return
            }
            try {
                if (item.id) {
                    // 修改
                    await setWechat(item)
                } else {
                    // 添加
                    const servicePhoneModels = JSON.parse(JSON.stringify(this.mallSaveModel.servicePhoneModels))
                    this.form.servicePhoneModels = [...servicePhoneModels, item]
                    await setWechat(this.form)
                    // 因为每添加一次客服，id就会变，所以得刷新
                    await this.agencyUserInfo()
                    this.form.servicePhoneModels = this.mallSaveModel.servicePhoneModels
                }
                this.currentEditContact.splice(index, 1, null)
                this.addContactWay.splice(index, 1, false)
            } catch (e) {
                throw e
            }
        },
        // 换行
        lineBreak (value) {
            return value.replace(/\n/g, '<br>')
        }
    },
    beforeRouteLeave (to, from, next) {
        next()
        this.agencyUserInfo()
    }
}

</script>

<style lang="scss" scoped>
    .base-info {
        background: #fff;
        margin-bottom: 10px;
        padding: 40px 40px 20px;
        .base-info-title{
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .base-info-form{
            padding-left: 80px;
        }
        .el-button--text {
            color: $--color-primary-blue;
            text-decoration: underline;
        }
        .el-input, .el-textarea {
            margin-right: 10px;
        }
        .text {
            font-size: 14px;
            font-weight: bold;
            margin-right: 10px;
        }
    }
    .code-box{
        margin: 20px auto 0;
        padding: 5px;
        width: 196px;
        height: 196px;
        border: 1px dashed #333;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .down-code{
        padding-top: 20px;
        text-align: center;
        font-size: 14px;
        color: $--color-primary-blue;
    }
</style>
