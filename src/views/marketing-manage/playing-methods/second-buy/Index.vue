<template>
    <div>
        <router-view v-if="loaded" />
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'SecondBuy',
    data () {
        return {
            loaded: false
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
            this.loaded = true
            const info = this.marketStatusAuth.find(({ programId }) => programId === '3')
            if (!info || moment(info.validity).valueOf() < Date.now()) {
                this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '3' } })
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
