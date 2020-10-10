<template>
    <div :class="$style.coursePackage" class="wrap">
        <div
            :class="$style.statusBar"
            v-show="$route.name !== 'AddCoursePackage' && $route.name !== 'EditCoursePackage'"
        >
            <img class="mr-10" :class="$style.activityIcon" src="https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/course-package.png">
            <!-- <pl-svg name="icon-chunyun" width="24" height="24" /> -->
            <span :class="$style.titleAndDesc">
                <i :class="$style.title">组合聚惠学</i>
                <i :class="$style.desc"> - {{ activityName }}</i>
            </span>
            <div :class="$style.status" v-if="activityStatus !== -1" class="mr-20">
                <pl-svg name="icon-shijian" width="16" class="mr-10" />
                <span v-if="activityStatus === 1">进行中...</span>
                <span v-else-if="activityStatus === 0">未开始</span>
                <span v-else-if="activityStatus === 2">已结束</span>
            </div>
            <div :class="$style.date">
                <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />
                <span>使用有效期：{{ start | dateFormat('YYYY.MM.DD') }} - {{ end | dateFormat('YYYY.MM.DD') }}</span>
            </div>
            <el-button
                v-show="$route.name !== 'CoursePackageDetailInfo' && $route.name !== 'CoursePackageDetailData'"
                type="primary"
                round
                @click="$router.push({ name: 'AddCoursePackage' })"
            >
                新建活动 <i class="el-icon-plus" />
            </el-button>
            <el-button class="underline" type="text" @click="explainFlag = true">
                活动说明
            </el-button>
        </div>
        <keep-alive :exclude="exclude">
            <router-view />
        </keep-alive>

        <!--活动说明弹窗-->
        <el-dialog
            :visible.sync="explainFlag"
            width="50%"
            class="explain"
        >
            <div class="title" slot="title">
                <pl-svg name="icon-jinggao" class="tips-icon" width="32" fill="#ec742e" style="margin-right: 10px;" />
                <span>活动说明</span>
            </div>
            <div class="explain-content" slot="">
                <ul>
                    <li>活动说明：</li>
                    <li>1. 设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖</li>
                    <li>2. 活动期间商品不退款，不支持线上发票</li>
                    <li>3. 仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠</li>
                    <li>4. 结束以时间和数量购买完截止结束</li>
                </ul>
                <ul>
                    <li>活动设置：</li>
                    <li>第一步    打开“营销中心”，找到“组合聚惠学”活动</li>
                    <li>第二步    点开“创建活动”，开始创建活动</li>
                    <li>1.活动细则，该活动细则在活动期间将在用户端显示</li>
                    <li>2.选择适合用户，可以选择Helper用户，全部用户，选择某些分组可见；</li>
                    <li>3.选择活动商品，默认所有商品规格均参加；设置活动下每个商品的可购买数量，该数量组合下单不可修改；组合折扣将以折扣形式减免支付</li>
                    <li>4.设置活动下的组合库存，该库存售罄活动完成；</li>
                    <li>5.活动可添加买后获得礼品的奖励，只要买了该组合商品加送礼品，设置的奖品各一份</li>
                    <li>6.选择活动时间，指在该时间段内，该商品在该页面组合购买以折扣价存在</li>
                    <li>7.活动预热，设置该时间后，将在活动开始前显示该活动预告</li>
                </ul>
            </div>
            <div class="footer">
                <el-button type="primary" @click="explainFlag = false">
                    我知道了
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'CoursePackage',
    data () {
        return {
            exclude: ['AddCoursePackage'],
            explainFlag: false,
            start: '',
            end: ''
        }
    },
    computed: {
        activityName () {
            return this.$route.query.activityName || '组合购买打包商品享优惠'
        },
        activityStatus () {
            return 'activityStatus' in this.$route.query ? Number(this.$route.query.activityStatus) : -1
        },
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async activated () {
        if (!this.marketStatusAuth) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const compoundInformation = this.marketStatusAuth.find(({ programId }) => programId === '1')
        this.start = compoundInformation.createTime || ''
        this.end = compoundInformation.validity || ''
    },
    methods: {
        ...mapActions([MutationTypes.getMarketStatusAuth])
    }
}
</script>
<style module lang="scss">
.course-package {
  min-width: 900px;
  .activity-icon{
    width: 23px;
  }
}
.status-bar {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 24px;
  background-color: #fff;
    > .title-and-desc {
      margin-left: 11px;
      margin-right: 42px;
      font-size: 16px;
      > .title {
        font-weight: bold;
      }
      > .desc {
        color: #999;
      }
    }
    > .date {
        display: inline-flex;
        align-items: center;
        height: 30px;
        margin-right: 24px;
        font-size: 16px;
        padding: 0 10px;
        border: 1px solid #ccc;
        border-radius: 15px;
        > span {
          margin-left: 8px;
          color: #666;
        }
    }
}
.status {
  padding: 0 10px;
  font-size: 16px;
  line-height: 30px;
  color: #fff;
  background-color: #ec742e;
  border-radius: 15px;
}

</style>
<style lang="scss" scoped>
.explain {
    .title {
        display: flex;
        align-items: center;
        > span {
            color: #333;
            font-size: 18px;
            font-weight: bold;
        }
        > i {
            font-size: 32px;
            color: #ec742e;
            margin-right: 10px;
        }
    }
    .footer {
        text-align: center;
    }
    ::v-deep .el-dialog__body {
        padding: 0 65px 32px 65px;
        > .explain-content {
            > div {
                color: #ec742e;
                margin-bottom: 20px;
            }
            > ul {
                > li {
                    margin-bottom: 20px;
                }
                > li:nth-of-type(1) {
                    font-size: 16px;
                    font-weight: 800;
                }
            }
        }
    }
}

</style>
