<template>
    <div class="wrap">
        <router-view />
    </div>
</template>

<script>

import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { GET_MRKET_STATU_AUTH } from '../../../../../store/mutation-type'
export default {
    name: 'NewYearBookingBuy',
    data () {
        return {
            programId: '5'
            // 5代表预购
        }
    },
    computed: {
        ...mapGetters({
            mrketStatuAuth: 'account/mrketStatuAuth'
        })
    },
    async created () {
        if (!this.mrketStatuAuth) await this[GET_MRKET_STATU_AUTH]()
        if (!this.mrketStatuAuth || !this.mrketStatuAuth.length) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
            return
        }
        // 团购信息
        const information = this.mrketStatuAuth.find(({ programId }) => programId === this.programId)
        const status = !!(information && moment(information.validity).valueOf() > moment().valueOf())
        // 判断当前活动是否购买
        if (!status) this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
    },
    methods: {
        ...mapActions([GET_MRKET_STATU_AUTH])
    }
}
</script>
