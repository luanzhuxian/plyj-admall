<template>
    <div>
        <router-view v-if="loading" :info="info" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MutationTypes } from '@/store/mutation-type'
import moment from 'moment'

const account = namespace('account')

@Component
export default class HappyLotteryIndex extends Vue {
        @account.Getter marketStatusAuth!: any[]
        @account.Action(MutationTypes.getMarketStatusAuth) getMarketStatusAuth!: Function

        loading = false
        programId = '10'
        info = {
            validity: '2021-03-31 23:59:59',
            createTime: '2020-12-21 00:00:00',
            programId: '10',
            programName: '福利红包'
        }

        async created () {
            try {
                if (Object.keys(this.info)) {
                    this.loading = true
                    return
                }
                if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this.getMarketStatusAuth()
                this.loading = true
                const info: any = this.marketStatusAuth.find(({ programId }) => programId === this.programId)
                this.info = info
                if (!info || moment(info.validity).valueOf() < Date.now()) {
                    this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
                }
            } catch (e) {
                throw e
            }
        }
}
</script>

<style lang="scss">
</style>
