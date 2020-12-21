<template>
    <div :class="$style.newyearSign">
        <div :class="$style.bg">
            <div :class="$style.countdownWrapper">
                <span :class="$style.text" v-if="data.status === 0">距离活动开始</span>
                <span :class="$style.text" v-else-if="data.status === 1">距离活动结束</span>
                <Countdown
                    v-if="~[0, 1].indexOf(data.status)"
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
export default class NewyearSign extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: object

    /* methods */
    getDuration ({ status, activityStartTime, activityEndTime }: {
        status: number;
         activityStartTime: string;
         activityEndTime: string;
    }) {
        // 0 未开始 1 进行中 2 结束
        const now = Date.now().valueOf()
        if (status === 0) {
            return moment(activityStartTime).valueOf() - now
        } else if (status === 1) {
            return moment(activityEndTime).valueOf() - now
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
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/newyear-sign-banner.png) no-repeat center;
    background-size: 100%;
}
.countdown-wrapper {
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%) scale(0.7);
    font-size: 8px;
    color: #FDFCFC;
}
.text {
    margin-right: 5px;
}
</style>
