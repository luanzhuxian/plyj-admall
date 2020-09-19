<template>
    <div :class="$style.activity">
        <div :class="$style.activityWrapper">
            <div
                v-if="hasJxEvent"
                :class="{
                    [$style.activityItem]: true,
                    [$style.large]: hasJxEvent && !hasInvitingEvent
                }"
            >
                <div :class="$style.activityItemLeft">
                    <div :class="$style.main">
                        见学之旅
                    </div>
                    <div :class="$style.sub">
                        <span>
                            惊喜大奖等你来拿
                        </span>
                        <span :class="$style.label" v-if="hasJxEvent && !hasInvitingEvent">
                            点击进入
                            <i class="el-icon-arrow-right" />
                        </span>
                    </div>
                </div>
                <PlSvg v-if="hasJxEvent && hasInvitingEvent" name="icon-calendar" width="36" height="36" />
                <PlSvg v-if="hasJxEvent && !hasInvitingEvent" name="icon-calendar" width="55" height="55" />
            </div>
            <div
                v-if="hasInvitingEvent"
                :class="{
                    [$style.activityItem]: true,
                    [$style.large]: hasJxEvent && !hasInvitingEvent
                }"
            >
                <div :class="$style.activityItemLeft">
                    <div :class="$style.main">
                        赢取豪礼
                    </div>
                    <div :class="$style.sub">
                        <span>
                            多种优惠不打烊
                        </span>
                        <span :class="$style.label" v-if="!hasJxEvent && hasInvitingEvent">
                            点击进入
                            <i class="el-icon-arrow-right" />
                        </span>
                    </div>
                </div>
                <PlSvg v-if="hasJxEvent && hasInvitingEvent" name="icon-giftbox" width="36" height="36" />
                <PlSvg v-if="!hasJxEvent && hasInvitingEvent" name="icon-giftbox" width="55" height="55" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const user = namespace('user')

@Component
export default class Activity extends Vue {
    @user.Getter hasJxEvent!: boolean
    @user.Getter hasInvitingEvent!: boolean
}
</script>

<style lang="scss" module>
.activity {
  &-wrapper {
    display: flex;
    padding: 14px 0;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  &-item {
    flex: 1;
    width: 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    &:nth-of-type(1) {
      border-right: 1px solid #EEEEEE;
    }
    &.large {
      border: none !important;
      .activity-item-left {
        .main {
          font-size: 21px;
          line-height: 29px;
        }
        .sub {
          display: flex;
          align-items: center;
          font-size: 15px;
          line-height: 20px;
        }
        .label {
          display: inline-flex;
          align-content: center;
          margin-left: 9px;
          padding: 0 3px;
          height: 18px;
          line-height: 18px;
          background: #F2B036;
          text-align: center;
          font-size: 11px;
          color: #FFF;
          i {
            margin-left: 4px;
            line-height: 20px;
            color: #FFF;
          }
        }
      }
    }
    &-left {
      flex: 1;
      width: 0;
      .main {
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        color: #333333;
        margin-bottom: 2px;
      }
      .sub {
        font-size: 12px;
        line-height: 17px;
        color: #999999;
      }
    }
  }
}
</style>
