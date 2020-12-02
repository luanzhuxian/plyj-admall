<template>
    <div>
        <router-view v-if="loading" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MutationTypes } from '@/store/mutation-type'
import moment from 'moment'

const account = namespace('account')

@Component
export default class RedPackageList extends Vue {
    @account.Getter marketStatusAuth!: []
    @account.Action(MutationTypes.getMarketStatusAuth) getMarketStatusAuth!: Function

    loading = false
    programId = '9'

    async created () {
        try {
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this.getMarketStatusAuth()
            this.loading = true
            const info: any = this.marketStatusAuth.find(({ programId }) => programId === '9')
            if (!info || moment(info.validity).valueOf() < Date.now()) {
                this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '9' } })
            }
        } catch (e) {
            throw e
        }
    }
}
</script>

<style lang="scss">
</style>
