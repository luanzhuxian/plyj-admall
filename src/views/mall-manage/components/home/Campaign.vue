<template>
    <div :class="$style.campaign" v-if="show">
        <div :class="$style.campaignTop">
            <div :class="$style.campaignTopSide" />
            <div :class="$style.campaignTopContent">
                <img src="https://mallcdn.youpenglai.com/static/beat-plague/19e269a6-61da-48ed-afbb-0ce198df7cfb.png" alt="">
            </div>
        </div>
        <ul :class="$style.campaignList">
            <li :class="$style.campaignListItem" v-if="isReportShow">
                <div :class="$style.counter">
                    {{ `疫情爆发的第${days}天` }}
                </div>
                <img src="https://mallcdn.youpenglai.com/static/beat-plague/report.png" alt="">
            </li>
            <li :class="$style.campaignListItem" v-if="isBookShow">
                <img src="https://mallcdn.youpenglai.com/static/beat-plague/join.png" alt="">
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const user = namespace('user')

@Component
export default class Campaign extends Vue {
    /* data */
    days = 0

    /* computed */
    @user.Getter isReportShow!: boolean
    @user.Getter isBookShow!: boolean
    get show () {
        return this.isReportShow || this.isBookShow
    }

    created () {
        const start = moment('2020-01-20 00:00', 'YYYY-MM-DD HH:mm').valueOf()
        const duration = Date.now() - Number(start)
        this.days = Math.ceil(moment.duration(duration).asDays())
    }
}
</script>

<style lang="scss" module>
.campaign {
    margin-top: 25px;
    &-top {
      &-side {
        border: 32px solid;
        border-bottom: 6px solid;
        border-top: none;
        border-color: transparent transparent #5DA5E3 transparent;
      }
      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        background: #3B7DB7;
        img {
            width: 230px;
        }
      }
    }
    &-list {
        padding: 12px 10px;
        background: #D1E5FE;
        &-item {
            position: relative;
            margin-bottom: 8px;
            width: 100%;
            height: 160px;
            border-radius: 10px;
            overflow: hidden;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    .counter {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 9px;
        height: 25px;
        background: #F76025;
        border-radius: 0px 10px 0px 10px;
        font-size: 15px;
        font-family: Hiragino Sans GB;
        line-height: 25px;
        color: #FFF;
    }
}
</style>
