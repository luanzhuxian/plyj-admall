<template>
    <div>
        <router-view v-if="loading" />
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
            loading: false,
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
        try {
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
            this.loading = true
            const info = this.marketStatusAuth.find(({ programId }) => programId === '5')
            if (!info || moment(info.validity).valueOf() < Date.now()) {
                this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '5' } })
            }
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    }
}
</script>
