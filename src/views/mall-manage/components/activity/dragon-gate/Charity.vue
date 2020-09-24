<template>
    <Panel :custom-class="$style.charityPanel" :title="panelTitle" button="更多公益活动">
        <div :class="$style.charity">
            <template v-if="!isStarted">
                <div :class="$style.charityCountdown">
                    距活动开始仅剩：
                    <Countdown :duration="duration" @finish="() => isStarted = true">
                        <template #default="{time}">
                            <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                            <span :class="$style.colon">天</span>
                            <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                            <span :class="$style.colon">:</span>
                            <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                            <span :class="$style.colon">:</span>
                            <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                        </template>
                    </Countdown>
                </div>
            </template>
            <template v-else>
                <p :class="$style.charityJoin">
                    已加入<b>{{ statistics.orderNo || 0 }}</b>人
                </p>
                <p :class="$style.charityText">
                    累计公益金
                </p>
                <div :class="$style.charityTotal">
                    <b v-for="(number, index) of integer" :key="'integer-' + index">{{ number }}</b>
                    <template v-if="Number(decimal)">
                        <i>.</i>
                        <b v-for="(number, index) of decimal" :key="'decimal-' + index">{{ number }}</b>
                    </template>
                </div>
            </template>
            <div :class="$style.charityProduct" v-for="(item, index) of productList" :key="index">
                <label>{{ item.productTypeDesc }}</label>
                <div :class="$style.imgWrapper">
                    <img :src="item.productImage + '?x-oss-process=style/thum-middle'">
                </div>
                <div :class="$style.info">
                    <h4>{{ item.productName }}</h4>
                    <p :class="$style.price">
                        <label>公益价</label>
                        <span>
                            {{ item.activityPrice }}元
                        </span>
                    </p>
                    <p :class="$style.rule">
                        {{ `购买将捐赠${item.donationAmount}元公益金` }}
                    </p>
                    <div :class="$style.button">
                        立即购买
                    </div>
                </div>
            </div>
        </div>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Panel from './Panel.vue'
import Countdown from '../../Countdown.vue'

type Activity = {
    productModels: [];
    courseModels: [];
    statisticsDetail: { donationAmount: number; orderNo: number };
    startTime: string;
    systemTime: string;
}

@Component({
    components: {
        Panel,
        Countdown
    }
})
export default class Charity extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: { values: Activity[] }

    /* data */
    panelTitle = {
        name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/ngyzxd.png',
        width: 184,
        height: 27
    }

    isStarted = false
    duration = 0

    /* computed */
    get productList () {
        const { data } = this
        if (!data.values.length) {
            return []
        }
        const { productModels = [], courseModels = [] } = data.values[0]
        return [...productModels, ...courseModels].slice(0, 1)
    }

    get statistics () {
        const { data } = this
        return data.values.length ? data.values[0].statisticsDetail : { donationAmount: 0, orderNo: 0 }
    }

    get integer () {
        const { donationAmount = 0 } = this.statistics
        return parseInt(String(donationAmount)).toString()
    }

    get decimal () {
        const { donationAmount = 0 } = this.statistics
        return donationAmount ? donationAmount.toString().split('.')[1] : '0'
    }

    created () {
        if (this.data.values.length) {
            const activity = this.data.values[0]
            const { startTime, systemTime } = activity
            const duration = new Date(systemTime).valueOf() - new Date(startTime).valueOf()
            this.isStarted = duration > 0
            this.duration = Math.abs(duration)
        }
    }
}
</script>

<style lang="scss" module>
.charity-panel {
    padding-top: 30px;
}
.charity {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    &-countdown {
        margin-top: 5px;
        font-size: 15px;
        color: #fff;
        .block {
            box-sizing: border-box;
            padding: 0 2.5px;
            height: 26px;
            line-height: 22px;
            text-align: center;
            color: #10fe72;
            border: 2px solid #10fe72;
            border-radius: 2px;
        }
        .colon {
            margin: 0 5px;
        }
    }
    &-text {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 800;
    }
    &-join {
        margin-bottom: 8px;
        font-size: 12px;
        > b {
            padding: 0 4px;
            font-size: 18px;
            color: #10fe72;
        }
    }
    &-total {
        margin-top: 5px;
        color: #10fe72;
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 800;
        > b {
            display: inline-block;
            margin: 0 2.5px;
            width: 26px;
            height: 31px;
            line-height: 29px;
            text-align: center;
            border: 2px solid #10fe72;
            border-radius: 2px;
        }
        > i {
            vertical-align: bottom;
        }
        &::after {
            content: '元';
            margin-left: 5px;
            font-size: 16px;
            color: #fff;
        }
    }
    &-product {
        position: relative;
        display: flex;
        margin-top: 28px;
        width: 100%;
        background-color: #fff;
        border: 2px solid #222;
        border-radius: 10px;
        overflow: hidden;
        > label {
            position: absolute;
            top: 0;
            left: 0;
            width: 55px;
            line-height: 18px;
            text-align: center;
            background-color: #75a4ff;
            border-radius: 0 0 10px 0;
            font-size: 12px;
            color: #fff;
        }
        .img-wrapper {
            width: 160px;
            height: 107px;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            width: 0;
            padding: 8px;
            font-size: 10px;
            color: #999;
            > h4 {
                margin-bottom: 2px;
                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 800;
                line-height: 20px;
                color: #222;
                @include elps();
            }
            .price {
                margin-bottom: 1px;
                font-size: 16px;
                line-height: 24px;
                color: #fe7700;
                @include elps();
                > label {
                    margin-right: 4px;
                    width: 34px;
                    height: 16px;
                    border: 1px solid #56d98d;
                    border-radius: 2px;
                    font-size: 10px;
                    line-height: 14px;
                    color: #56d98d;
                }
            }
            .rule {
                @include elps();
            }
            .button {
                margin-top: auto;
                margin-left: auto;
                width: 76px;
                line-height: 25px;
                text-align: center;
                background-color: #75a4ff;
                border-radius: 5px;
                font-size: 12px;
                color: #fff;
            }
        }
    }
}

</style>
