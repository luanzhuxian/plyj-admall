<template>
    <div>
        <router-view />
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'SecondBuy',
    data () {
        return {}
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async activated () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        const info = this.marketStatusAuth.find(({ programId }) => programId === '3')
        if (!info || moment(info.validity).valueOf() < Date.now()) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '3' } })
        }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    }
}
</script>
