<template>
    <div class="wechat-pay-step1">
        <p class="tip mb-10">
            请填写上架的营业执照/等级证书、经营者/法人的证件信息
        </p>
        <BusinessLicense ref="businessLicense" :detail="detail" />
        <hr class="hr" style="margin-top: 40px; margin-bottom: 40px; transform: scaleX(1.1)">
        <LegalPerson ref="legalPerson" :detail="detail" />
    </div>
</template>

<script>
import BusinessLicense from './Business-License.vue'
import LegalPerson from './Legal-Person.vue'
import {
    wechatPayStep1
} from '../../../../apis/base/register'
export default {
    name: 'WechatPayStep1',
    components: {
        BusinessLicense,
        LegalPerson
    },
    props: {
        detail: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        async submit () {
            try {
                const businessLicenseData = await this.$refs.businessLicense.submit()
                if (!businessLicenseData) return
                const legalPersonData = await this.$refs.legalPerson.submit()
                if (!legalPersonData) return
                const { result } = await wechatPayStep1({ ...businessLicenseData, ...legalPersonData })
                return result
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
</style>
