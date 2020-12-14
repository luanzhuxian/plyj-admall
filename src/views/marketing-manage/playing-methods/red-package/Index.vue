<template>
    <div>
        <router-view v-if="!loading" :info="info" />
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
    @account.Getter marketStatusAuth!: any[]
    @account.Action(MutationTypes.getMarketStatusAuth) getMarketStatusAuth!: Function

    loading = false
    programId = '9'
    info = {}

    async created () {
        try {
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this.getMarketStatusAuth()
            const info: any = this.marketStatusAuth.find(({ programId }) => programId === '9')
            this.info = info
            if (!info || moment(info.validity).valueOf() < Date.now()) {
                await this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '9' } })
            }
            this.loading = true
        } catch (e) {
            throw e
        }
    }
}
</script>

<style lang="scss">
</style>
