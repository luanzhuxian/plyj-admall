<template>
    <div class="wrap">
        <router-view />
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../../store/mutation-type'
export default {
    name: 'SecondBuy',
    data () {
        return {
            programId: '3'
            // 3代表秒杀
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async activated () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
            return
        }
        // 团购信息
        const information = this.marketStatusAuth.find(({ programId }) => programId === this.programId)
        const status = !!(information && moment(information.validity).valueOf() > moment().valueOf())
        // 判断当前活动是否购买
        if (!status) this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    }
}
</script>
