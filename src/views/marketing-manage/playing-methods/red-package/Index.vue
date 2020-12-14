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

    loading = true
    programId = '9'
    info = {}

    async created () {
        try {
            this.loading = true
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this.getMarketStatusAuth()
            const info: any = this.marketStatusAuth.find(({ programId }) => programId === this.programId)
            this.info = info
            if (!info || moment(info.validity).valueOf() < Date.now()) {
                this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
            }
        } catch (e) {
            throw e
        } finally {
            this.loading = false
        }
    }
}
</script>

<style lang="scss">
</style>
