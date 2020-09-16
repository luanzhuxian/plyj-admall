<template>
    <div class="confirm">
        <Detail :detail="detail" :show="true" />
    </div>
</template>

<script>
import {
    submitWechatPay
} from '../../../../apis/base/register'
import Detail from './Detail.vue'
import { WECHAT_PAY_STATUS, AGENCY_USER_INFO } from '../../../../store/mutation-type'
import { mapActions } from 'vuex'
export default {
    name: 'Confirm',
    components: {
        Detail
    },
    data () {
        return {
        }
    },
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    methods: {
        ...mapActions([WECHAT_PAY_STATUS, AGENCY_USER_INFO]),
        async submit () {
            try {
                const res = await submitWechatPay(this.detail)
                await this[WECHAT_PAY_STATUS]()
                await this[AGENCY_USER_INFO]()
                return res
            } catch (e) {
                if (e) throw e
                return false
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
