<template>
    <!-- 仅作为龙门节的路由入口文件，方便在路口处添加拦截 -->
    <router-view />
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'LongmenFestival',
    data () {
        return {
            programId: ''
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async activated () {
        const routeName = this.$route
        if (routeName.path.indexOf('marketing-manage/course-package') !== -1) {
            this.programId = '1'
        } else if (routeName.path.indexOf('longmen-festival/sign-In') !== -1) {
            this.programId = '2'
        } else if (routeName.path.indexOf('classmate-reunion/second-buy') !== -1) {
            this.programId = '3'
        } else if (routeName.path.indexOf('new-year/together-buy') !== -1) {
            this.programId = '4'
        } else if (routeName.path.indexOf('new-year/booking-buy') !== -1) {
            this.programId = '5'
        } else if (routeName.path.indexOf('longmen-festival/public-benefit') !== -1) {
            this.programId = '6'
        } else if (routeName.path.indexOf('longmen-festival/lottery') !== -1) {
            this.programId = '7'
        }
        if (!this.marketStatusAuth) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
            return
        }

        // 组合聚惠学信息
        const compoundInformation = this.marketStatusAuth.find(({ programId }) => programId === '1')
        const compoundStatus = !!(compoundInformation && moment(compoundInformation.validity).valueOf() > moment().valueOf())
        // 粽粽有礼信息
        const dumplingsInformation = this.marketStatusAuth.find(({ programId }) => programId === '2')
        const dumplingsStatus = !!(dumplingsInformation && moment(dumplingsInformation.validity).valueOf() > moment().valueOf())
        // 公益活动
        const benefitInformation = this.marketStatusAuth.find(({ programId }) => programId === '6')
        const benefitStatus = !!(benefitInformation && moment(benefitInformation.validity).valueOf() > moment().valueOf())
        // 龙门抽奖
        const LongmenLotteryInformation = this.marketStatusAuth.find(({ programId }) => programId === '7')
        const LongmenLotteryStatus = !!(LongmenLotteryInformation && moment(LongmenLotteryInformation.validity).valueOf() > moment().valueOf())

        // 判断当前活动是否购买
        const status = !!(this.programId === '1' && !compoundStatus) || (this.programId === '2' && !dumplingsStatus) || (this.programId === '6' && !benefitStatus) || (this.programId === '7' && !LongmenLotteryStatus)
        if (status) this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
    },
    methods: {
        ...mapActions([MutationTypes.getMarketStatusAuth])
    }
}
</script>
