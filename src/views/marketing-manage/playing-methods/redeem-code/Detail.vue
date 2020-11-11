<template>
    <div class="wrap">
        <div class="list-header">
            <div class="header">
                <img width="48" class="mr-10" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/兑换码.png">
                <div>
                    <div class="font-weight-bold">兑换码</div>
                    <div class="description">{{ activityDetail.name }}</div>
                </div>
            </div>
            <div class="active-time">
                <div class="activity-status">
                    <pl-svg name="icon-shijian" width="16" class="mr-10" />
                    <span v-if="activityDetail.status === 1">未开始</span>
                    <span v-if="activityDetail.status === 2">进行中</span>
                    <span v-if="activityDetail.status === 3">已停止</span>
                    <span v-if="activityDetail.status === 4">已结束</span>
                </div>`
                <!-- <pl-svg width="16" name="icon-riqi" fill="#999" class="mr-10" /> -->
                活动时间：{{ activityDetail.startTime | dateFormat('YYYY.MM.DD') }} - {{ activityDetail.endTime | dateFormat('YYYY.MM.DD') }}
            </div>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'RedeemCodeActivityDetail'},
                {label:'数据详情',name:'RedeemCodeDataDetail'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <router-view @setDetail="getDetail" />
    </div>
</template>

<script>
export default {
    name: 'RedeemCodeDetail',
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            activityDetail: {
                name: '',
                status: 0,
                startTime: '',
                endTime: ''
            }
        }
    },
    methods: {
        getDetail (detail) {
            this.activityDetail = detail
        }
    }
}
</script>

<style lang="scss" scoped>
  .list-header {
      background: #F5F6FA;
      display: flex;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      .header{
          display: flex;
          align-items: center;
      }
      .description {
          font-size: 12px;
          color: #A8A8A8;
          margin-top: 4px;
      }
  }
  .activity-status{
      width: 104px;
      height: 31px;
      background: #EC742E;
      border-radius: 130px;
      color: #ffffff;
      text-align: center;
      line-height: 31px;
      margin-right: 20px;
  }
  .active-time{
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #999;
      margin-left: 100px;
      margin-top: 10px;
  }
</style>
