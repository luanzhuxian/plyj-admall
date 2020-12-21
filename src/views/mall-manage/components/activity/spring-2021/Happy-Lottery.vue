<template>
    <div :class="$style.happyLottery">
        <div :class="$style.bg">
            <div :class="$style.count" v-if="data.status === 2 && data.participantsNum > 10">
                {{ `${data.participantsNum}人参与` }}
            </div>
            <div :class="$style.countdownWrapper">
                <span :class="$style.text" v-if="data.status === 1">距离活动开始</span>
                <span :class="$style.text" v-else-if="data.status === 2">距离活动结束</span>
                <Countdown
                    v-if="~[1, 2].indexOf(data.status)"
                    :duration="getDuration(data)"
                    format="DD天HH小时mm分"
                    @finish="() => data.status++"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Countdown from '../../Countdown.vue'
import moment from 'moment'

@Component({
    components: {
        Countdown
    }
})
export default class HappyLottery extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: object

    /* methods */
    getDuration ({ status, startTime, endTime }: {
        status: number;
         startTime: string;
         endTime: string;
    }) {
        // 1 未开始 2 进行中 3 结束
        const now = Date.now().valueOf()
        if (status === 1) {
            return moment(startTime).valueOf() - now
        } else if (status === 2) {
            return moment(endTime).valueOf() - now
        }
        return 0
    }
}
</script>

<style lang="scss" module>
.bg {
    position: relative;
    margin: 0 auto;
    width: 340px;
    height: 88px;
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/lottery-banner.png) no-repeat center;
    background-size: 100%;
}
.count {
    position: absolute;
    top: 10px;
    right: 30px;
    font-size: 10px;
    color: #FDFCFC;
}
.countdown-wrapper {
    position: absolute;
    left: 96px;
    bottom: 10px;
    font-size: 8px;
    color: #FDFCFC;
    transform: scale(0.7);
}
.text {
    margin-right: 5px;
}
</style>
