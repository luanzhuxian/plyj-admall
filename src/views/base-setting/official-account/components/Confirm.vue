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
import { mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
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
        ...mapActions([MutationTypes.wechatPayStatus, MutationTypes.agencyUserInfo]),
        async submit () {
            try {
                const res = await submitWechatPay(this.detail)
                await this[MutationTypes.wechatPayStatus]()
                await this[MutationTypes.agencyUserInfo]()
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
