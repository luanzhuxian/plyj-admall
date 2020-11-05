<template>
    <transition name="fade">
        <div class="activity-preview" v-if="isShowDialog">
            <div class="activity-content" title="滚动转轮，上下滚动">
                <div class="top" />
                <div class="content">
                    <div class="content-time" v-if="!endding">
                        <div v-if="willStart">
                            开始倒计时：
                        </div>
                        <div v-else>
                            结束倒计时：
                        </div>
                        <span>{{ distanceDateTime[0] }}</span>&nbsp;天&nbsp;
                        <span>{{ distanceDateTime[1] }}</span>
                        <div class="time-padding">
                            :
                        </div>
                        <span>{{ distanceDateTime[2] }}</span>
                        <div class="time-padding">
                            :
                        </div>
                        <span>{{ distanceDateTime[3] }}</span>
                    </div>
                    <div class="btn-box" v-if="!endding">
                        <div class="btn disabel" v-if="willStart">
                            活动未开始
                        </div>
                        <div class="btn check-in" v-else>
                            立即签到
                        </div>
                    </div>
                </div>
            </div>
            <div class="activity-content-mask">
                <pl-svg name="icon-shibai" fill="rgba(255, 255, 255, 0.8)" width="36" @click="close" />
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'ActivityPreview',
    data () {
        return {
            distanceDateTime: '',
            timer: '',
            willStart: false,
            endding: false,
            distanceTime: {}
        }
    },
    props: {
        isShowDialog: Boolean,
        activityStartTime: {
            type: String,
            default: ''
        },
        activityEndTime: {
            type: String,
            default: ''
        }
    },
    beforeDestroy () {
        clearInterval(this.timer)
    },
    methods: {
        close () {
            clearInterval(this.timer)
            this.$emit('update:isShowDialog', false)
        },
        getTimeStatus () {
            let distanceTime = 0
            const startTime = this.activityStartTime ? new Date(this.activityStartTime).getTime() : new Date().getTime()
            const endTime = this.activityEndTime ? new Date(this.activityEndTime).getTime() : new Date().getTime()
            const now = new Date().getTime()

            this.endding = false
            this.willStart = false

            // 未开始，显示开始倒计时
            if (now < startTime) {
                this.willStart = true
                distanceTime = startTime - now
            } else if (now > startTime) {
            // 已开始，显示结束倒计时
                this.willStart = false
                distanceTime = endTime - now
                if (now > endTime) {
                    // 已结束，不显示
                    this.endding = true
                    distanceTime = 0
                }
            }
            this.distanceTime.dd = parseInt(distanceTime / 1000 / 60 / 60 / 24)
            this.distanceTime.hh = parseInt(distanceTime / 1000 / 60 / 60 % 24)
            this.distanceTime.mm = parseInt(distanceTime / 1000 / 60 % 60)
            this.distanceTime.ss = parseInt(distanceTime / 1000 % 60)
            this.countdown(this.distanceTime)
        },
        countdown (datetime) {
            if ((datetime.dd + datetime.hh + datetime.mm + datetime.ss) < 0) {
                this.distanceDateTime = ['00', '00', '00', '00']
                return
            }
            this.timer = setInterval(() => {
                if (!datetime.dd && !datetime.hh && !datetime.mm && !datetime.ss) return clearInterval(this.timer)
                if (datetime.ss < 1) {
                    datetime.ss = 60
                    if (datetime.mm < 1) {
                        datetime.mm = 60
                        if (datetime.hh < 1) {
                            datetime.hh = 60
                            datetime.dd--
                        }
                        datetime.hh--
                    }
                    datetime.mm--
                }
                datetime.ss--
                const distanceDateTime = `${ datetime.dd < 10 ? `0${ datetime.dd }` : datetime.dd }-${ datetime.hh < 10 ? `0${ datetime.hh }` : datetime.hh }-${ datetime.mm < 10 ? `0${ datetime.mm }` : datetime.mm }-${ datetime.ss < 10 ? `0${ datetime.ss }` : datetime.ss }`
                this.distanceDateTime = distanceDateTime.split('-')
            }, 1000)
        }
    },
    watch: {
        isShowDialog (val) {
            if (val) this.getTimeStatus()
        }
    }
}
</script>
<style scoped lang="scss">
  $em: 330 / 750;
  .activity-preview {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, .5);
    z-index: 5;
  }

  .activity-content-mask {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 360px;
    height: 742px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/phone.png") no-repeat center center;
    background-size: 100%;
    z-index: 9;

    .icon-shibai {
      position: absolute;
      top: -50px;
      right: 0;
      cursor: pointer;
    }
  }

  .activity-content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 330px;
    height: 580px;
    transform: translate3d(-50%, -50%, 0);
    background-color: #eee;
    overflow: scroll;
    z-index: 10;

    &::-webkit-scrollbar {
      display: none;
    }

    .top {
      height: 40px * $em;
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/phone-top.png") no-repeat;
      background-size: 100%;
    }

    .content {
      height: 100%;
      background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/road-learning.jpg') no-repeat center;
      background-size: 100%;

      .content-time {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        line-height: 40px;
        color: #FFFFFF;
        padding-top: 342px;

        > span {
          display: inline-flex;
          padding: 0 3px;
          background: #FFFFFF;
          border-radius: 4px;
          line-height: 24px;
          color: #F84F4E;
          font-weight: bold;
        }

        .time-padding {
          padding: 0 5px;
        }
      }

      .btn-box {
        padding: 145px 32px 0;

        .btn {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px 0;
          border-radius: 10px;
          font-size: 18px;
        }

        .disabel {
          color: #EEEEEE;
          background: linear-gradient(180deg, rgba(204, 204, 204, 1) 0%, rgba(185, 185, 185, 1) 100%);
        }
        .check-in {
          color:rgba(255,255,255,1);
          background:linear-gradient(180deg,rgba(247,76,78,1) 0%,rgba(254,53,56,1) 100%);
        }
      }
    }
  }
</style>
