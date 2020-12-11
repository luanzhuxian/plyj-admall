<template>
    <div class="road-learning-list wrap">
        <template v-if="$route.name === 'RoadLearningList' || $route.name === 'RoadLearningSetting'">
            <ListHeader
                icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/见学之旅.png"
                title="见学之旅"
                description="签到赢大礼"
                start-time="2019.10.28"
                end-time="2020.01.31"
            />
            <el-button type="primary" round @click="$router.push({name: 'RoadLearningAdd'})">
                新建活动
                <i class="el-icon-plus el-icon--right" />
            </el-button>
            <el-button type="text" @click="showExplanation = true" v-show="$route.name !== 'RoadLearningDetail'">
                活动说明
            </el-button>
        </template>

        <router-view />
        <Setting :show.sync="showExplanation" />
    </div>
</template>

<script>
import ListHeader from '../../../../../components/marketing-manage/List-Header'
import Setting from './Road-Learning-Setting'
export default {
    name: 'RoadLearning',
    components: { Setting, ListHeader },
    data () {
        return {
            // 是否显示分享页面
            isShowShareDialog: false,
            // 是否有正在进行中或未开启的活动，false时不可分享，true可分享
            hasCanShareActivity: false,
            showExplanation: false
        }
    }
}
</script>

<style scoped lang='scss'>
.road-learning-list {
  .road-learning-list-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 52px;
    padding-left: 20px;
    // margin-bottom: 16px;

    .items {
      margin-right: 24px;
    }

    .date {
      width:320px;
      height:30px;
      padding-left: 10px;
      border:1px solid #ccc;
      border-radius:130px;
      line-height: 30px;
      &:before {
        padding-right: 10px;
      }
    }

    .description {
      color: #A8A8A8
    }
  }
}
</style>
