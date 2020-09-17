<template>
    <div class="road-learning-list wrap">
        <top-back />
        <div class="road-learning-list-header bg-white">
            <img class="mr-10" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/gift@1x.png">
            <span class="mr-10 font-weight-bold">见学之旅</span>
            <span class="items description">- 签到赢大礼</span>
            <span class="items description el-icon-date date">使用有效期 2019.10.28-2020.01.31</span>
            <el-button type="primary" round @click="$router.push({name: 'RoadLearningAdd'})">
                新建活动
                <i class="el-icon-plus el-icon--right" />
            </el-button>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'RoadLearning'},
                {label:'活动设置',name:'RoadLearningSetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'RoadLearningList',
    data () {
        return {
            isShowShareDialog: false, // 是否显示分享页面
            hasCanShareActivity: false // 是否有正在进行中或未开启的活动，false时不可分享，true可分享
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
