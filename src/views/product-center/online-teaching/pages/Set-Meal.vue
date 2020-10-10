<template>
    <div class="live-index wrap">
        <Panel title="视频直播" width="95%" top="20">
            <div class="main">
                <el-form label-width="152px" label-position="left">
                    <el-form-item label="说明：">
                        <p class="tips">
                            直播功能需提前购买套餐开通房间，开通房间后才可进行直播，目前支持购买多种直播套餐；
                        </p>
                        <p class="tips">
                            购买套餐可获得直播观看时长，并可获得活动赠送的相应直播观看时长和录播所需的点播流量；
                        </p>
                        <p class="tips red">
                            直播观看时长：
                        </p>
                        <p class="tips">
                            机构购买的是用户观看时长，当前直播时间内所有用户观看时间的合计即为观看时长，比如说机构直播时间100分钟，有20名用户观看即观看时长为100*20=2000分钟；<span class="red">购买直播观看时长套餐可赠送相应的点播流量；</span>
                        </p>
                        <p class="tips red">
                            点播流量：
                        </p>
                        <p class="tips">
                            是用户在商城通过线上课程观看视频或通过直播功能观看录播视频时，所需要消耗的流量，赠送的点播流量可进行叠加使用；
                        </p>
                        <p class="tips red">
                            视频库存储空间：
                        </p>
                        <p class="tips">
                            是视频库中可上传视频文件大小的累加，<span class="red">首次开通房间，可免费获赠20G的视频库存储空间；</span>且存储空间不足时，可购买存储空间加油包，扩大视频库的存储空间；
                        </p>
                        <Bought class="mt-30" />
                    </el-form-item>

                    <el-form-item label="计算购买套餐：">
                        <el-input v-model.number="sessionCount" placeholder="预计直播几场" style="width: 150px;" />
                        ×
                        <el-input v-model.number="personCount" placeholder="预计在线观看人数" style="width: 150px;" />
                        ×
                        <el-input v-model.number="duration" placeholder="预计直播时长" style="width: 150px;" />
                        ×50%=
                        <el-input readonly :value="expectedTime" placeholder="预计观看总时长(分钟)" style="width: 150px;" />
                    </el-form-item>

                    <el-form-item label="直播套餐">
                        <div
                            class="set-meal-box"
                            v-for="(item1, i) of setMealData"
                            :key="i"
                        >
                            <div class="set-meal-row">
                                <div
                                    class="img hover-up"
                                    v-for="(item2, j) of item1"
                                    :key="j"
                                    :class="{ active: recommended === `${i}-${j}` }"
                                    @click="buy(item2)"
                                >
                                    <img v-imgError :src="item2.img" alt="">
                                    <div class="selected">
                                        <pl-svg name="icon-duihao" fill="#fff" width="20" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="fz-12 gray-3" style="line-height: 24px; width: 886px; margin-top: 50px;">
                            <p style="line-height: 20px;">
                                注意：
                            </p>
                            <p style="line-height: 20px;">
                                1.为了更好的直播体验，直播前请先下载直播控件
                                <a href="https://mallcdn.youpenglai.com/static/download/PengLai-Live-Setup.exe" download="PengLai-Live-Setup.exe" class="download">下载控件</a>
                                ，下载后根据购买获得的账号密码登录（仅有一个账号密码请注意保密，切勿丢失，否则造成的损失机构自行承担）
                            </p>
                            <p style="line-height: 20px;">
                                2.开始直播前可在首页模板和会场模板里设置直播预告和直播提醒，提前告知用户直播进入直播间
                            </p>
                            <p style="line-height: 20px;">
                                3.可以开启多次直播，剩余套餐观看分钟数用完为止，支持续费，购买后不退不换。
                            </p>
                            <p style="line-height: 20px;">
                                4.为了保证更好的直播体验请自行把握直播时间，若超出套餐观看分钟数，该功能将禁止使用，续费后可正常使用且扣除超出时间，超出未续费时雅集平台有权追究法律责任。
                            </p>
                            <p style="line-height: 20px;">
                                5.最终解释权归雅集平台所有。
                            </p>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </Panel>
    </div>
</template>

<script>
import {
    getSetMeal,
    getRoomStatus
} from './../../../../apis/product-center/online-teaching/live'
import Panel from '../../../../components/common/Panel.vue'
import Bought from './../compoonents/Bought.vue'

export default {
    name: 'LiveVideoList',
    components: {
        Panel,
        Bought
    },
    data () {
        return {
            recommended: -1,
            showActivate: false,
            showProtocol: false,
            setMealData: [],
            checked: 0, // 选中的套餐
            personCount: '', // 人数
            duration: '', // 时长
            sessionCount: '', // 场数
            enable: 0 // 是否创建过房间 1 已开通 2 冻结 3 未创建 4 开通中
        }
    },
    params: {
    // 是否续费
        isRenew: {
            type: Number,
            default: 0
        }
    },
    computed: {
        isWindows () {
            return /windows|win32/i.test(navigator.userAgent)
        },
        isMac  () {
            return /macintosh|mac os x/i.test(navigator.userAgent)
        },
        // 预计时长
        expectedTime () {
            const { personCount, duration, sessionCount } = this
            return personCount * duration * sessionCount * 5 / 10 || ''
        }
    },
    watch: {
        expectedTime (val) {
            for (const [index, list] of this.setMealData.entries()) {
                const durations = list.map(item => item.duration)
                // 找出一个套餐离当前计算之最近，且大于当前值
                // 方法：用每一个时间减去当前计算所得值，得到一个数组，找出数组中最小且大于0的值的下标，即是推荐的套餐
                // 如果没有大于0的值，则推荐最后一个套餐
                // 由于套餐为4个一行，所以要找到一个套餐，必须是2个坐标
                const difference = durations.map(item => item - val)
                const activeIndex = difference.findIndex(item => item > 0)
                if (activeIndex === -1) {
                    this.recommended = `${ index }-${ list.length - 1 }`
                } else {
                    this.recommended = `${ index }-${ activeIndex }`
                }
            }
        }
    },
    async activated () {
    // getChanneStatistics({
    //   startDate: '',
    //   endDate: ''
    // })
    // getRoomInfo()
    // getMinute()
        try {
            const { result } = await getRoomStatus()
            this.enable = result.enable
        } catch (e) {
            throw e
        }
        this.getSetMeal()
    },
    methods: {
        async getSetMeal () {
            try {
                this.setMealData = []
                let { result } = await getSetMeal()
                for (const item of result) {
                    item.duration = item.rechargeMinute + item.giveMinute
                }
                // 筛选出适合直播的套餐
                result = result.filter(item => item.duration)
                for (const item of result) {
                    item.originalPrice /= 100
                    item.presentPrice /= 100
                }
                while (result.length) {
                    this.setMealData.push(result.splice(0, 2))
                }
            } catch (e) {
                throw e
            }
        },
        async buy (item) {
            sessionStorage.setItem('SetMealModel', JSON.stringify(item))
            this.$router.push({ name: 'PayAndOrder', params: { type: '1', isRenew: '0', backRouteName: this.$route.params.backRouteName } })
        }
    }
}
</script>

<style scoped lang="scss">
  .main {
    padding: 32px 24px;
  }
  .set-meal-box {
    position: relative;
    margin-bottom: 20px;
    box-sizing: border-box;
    transition: box-shadow .2s linear;
  }
  .set-meal-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 40px;
    background-color: transparent;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    > .img {
      position: relative;
      height: 181px;
      margin-right: 16px;
      font-size: 0;
      border-radius: 10px;
      overflow: hidden;
      > img {
        width: 554px;
        height: 181px;
      }
      .selected {
        position: absolute;
        right: 0;
        top: 0;
        display: none;
        align-items: center;
        border-top: 22px #598BF8;
        border-right: 22px #598BF8;
        border-bottom: 22px transparent;
        border-left: 22px transparent;
        border-style: solid;
        transform: scaleX(1.8);
        > svg {
          position: absolute;
          top: -19px;
          left: -6px;
          transform: scaleX(0.4);
        }
      }
      &.active {
        background-color: #598BF8;
        > img {
          filter: opacity(.95);
        }
        .selected {
          display: inline-flex;
        }
        &:after {
          position: absolute;
          content: '';
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border: 3px solid #598BF8;
          background-color: rgba(0, 0, 0, 0);
          border-radius: 10px;
        }
      }
    }
  }

  /* 目前用户电脑分辨率存在1366，所以在临界点1620尺寸下，换行显示套餐 */
  @media screen and (max-width: 1620px) {
    .set-meal-box {
      margin-bottom: 0;
    }
    .set-meal-row {
      display: block;
      > .img {
        display: inline-block;
      }
    }
  }

  .download {
    display: inline-block;
    width: 97px;
    text-align: center;
    color: #333;
    line-height: 30px;
    border: 1px solid #ccc;
    background-color: #eee;
  }

  .tips {
    line-height: 24px;
    &.red {
      color: #D0423C;
    }
  }
</style>
