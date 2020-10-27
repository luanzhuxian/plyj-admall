<template>
    <div class="wrap">
        <router-view />
    </div>
</template>

<script>
import { MutationTypes } from '../../../../../store/mutation-type'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'LongmenLottery',
    async created () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const info = this.marketStatusAuth.find(({ programId }) => programId === '7')
        if (!info || moment(info.validity).valueOf() < Date.now()) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '7' } })
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    }
}
</script>
