<template>
    <div class="wrap">
        <router-view />
    </div>
</template>

<script>

import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'BookingBuy',
    data () {
        return {
            programId: '5'
            // 5代表预购
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async created () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const info = this.marketStatusAuth.find(({ programId }) => programId === '5')
        if (!info || moment(info.validity).valueOf() < Date.now()) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '5' } })
        }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    }
}
</script>
