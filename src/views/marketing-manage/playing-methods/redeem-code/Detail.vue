<template>
    <div>
        <div class="redeem-code-top">
            <div class="redeem-code-top-left">
                <div class="redeem-code-top-title">
                    <img src="https://mallcdn.youpenglai.com/static/admall/2.10.0/redeem_code_icon.png">
                    兑换码 <span>- {{ activityDetail.name }}</span>
                </div>
            </div>
            <div class="redeem-code-top-right">
                <div class="activity-status">
                    <pl-svg name="icon-shijian" width="16" class="mr-10" />
                    <span v-if="activityDetail.status === 1">未开始</span>
                    <span v-if="activityDetail.status === 2">进行中</span>
                    <span v-if="activityDetail.status === 3">已停止</span>
                    <span v-if="activityDetail.status === 4">已结束</span>
                </div>
                <div class="activity-date">
                    <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />  活动时间：{{ activityDetail.startTime | dateFormat('YYYY.MM.DD') }} - {{ activityDetail.endTime | dateFormat('YYYY.MM.DD') }}
                </div>
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

        <router-view />
    </div>
</template>

<script>
import { getRedeemCodeById } from '../../../../apis/marketing-manage/redeem-code'
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
    async created () {
        try {
            const { result } = await getRedeemCodeById(this.id)
            this.activityDetail = result
        } catch (e) {
            throw e
        }
    }
}
</script>

<style lang="scss" scoped>
  .redeem-code-top{
    display: flex;
    height: 52px;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    .redeem-code-top-left{
      display: flex;
      align-items: center;
      .redeem-code-top-title{
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        img{
          margin-right: 10px;
        }
        span{
          color: #999999;
          margin-left: 10px;
        }
      }
      .add-btn{
        width: 106px;
        height: 35px;
        border-radius: 121px;
        margin-left: 32px;
      }
    }
    .redeem-code-top-right{
      display: flex;
      align-items: center;
      .activity-status{
        width: 104px;
        height: 31px;
        background: #EC742E;
        border-radius: 130px;
        color: #ffffff;
        text-align: center;
        line-height: 31px;
      }
      .activity-date{
        margin-left: 16px;
        height: 31px;
        border: 1px solid #cccccc;
        border-radius: 130px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #666666;
        padding: 0 10px;
        i{
          margin-right: 10px;
        }
      }
    }
  }
</style>
