<template>
    <div class="together">
        <div class="list-header">
            <div class="header">
                <img width="48" class="mr-10" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/秒杀.png">
                <div>
                    <div class="font-weight-bold">秒杀</div>
                    <div class="description">{{ activityDetail.name }}</div>
                </div>
            </div>
            <div class="active-time">
                <div class="activity-status">
                    <pl-svg width="16" name="icon-shijian1" fill="#fff" class="mr-10" />
                    <span v-if="activityDetail.status === 0">未开始</span>
                    <span v-else-if="activityDetail.status === 1">进行中</span>
                    <span v-else-if="activityDetail.status === 2">已结束</span>
                </div>
                <!-- <pl-svg width="16" name="icon-riqi" fill="#999" class="mr-10" /> -->
                活动时间：{{ activityDetail.activityStartTime | dateFormat('YYYY.MM.DD') }} - {{ activityDetail.activityEndTime | dateFormat('YYYY.MM.DD') }}
            </div>
        </div>
        <pl-tabs
            value="SecondBuyDetail"
            :tabs="[
                {label:'活动详情',name:'SecondBuyDetail'},
                {label:'活动数据',name:'SecondBuyData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div class="detail">
            <el-button
                type="primary"
                plain
                size="mini"
                @click="$router.push({name:'AddSecond', params:{id: activityDetail.id}})"
                v-if="activityDetail.status === 0 || activityDetail.status === 1"
            >
                编辑
            </el-button>
            <ul class="detail-wrap">
                <li>
                    <label>秒杀商品：</label>
                    <div class="product">
                        <img v-imgError :src="activityDetail.productMainImage">
                        <div class="title">
                            {{ activityDetail.productName }}
                        </div>
                    </div>
                </li>
                <li>
                    <label>秒杀价格：</label>
                    <div class="value">
                        {{ activityDetail.price }}元
                    </div>
                </li>
                <li>
                    <label>秒杀库存：</label>
                    <div class="value">
                        {{ activityDetail.number }}件
                    </div>
                </li>
                <li>
                    <label>适用用户：</label>
                    <div class="value">
                        所有注册用户
                    </div>
                </li>
                <li>
                    <label>活动时间：</label>
                    <div class="value">
                        {{ activityDetail.activityStartTime }} - {{ activityDetail.activityEndTime }}
                    </div>
                </li>
                <li>
                    <label>秒杀标签：</label>
                    <div class="value">
                        {{ activityDetail.activityTag }}
                    </div>
                </li>
                <li v-if="activityDetail.activityLimit">
                    <label>限购：</label>
                    <div class="value">
                        {{ activityDetail.activityLimitNumber }} 件
                    </div>
                </li>
                <li>
                    <label>活动预热：</label>
                    <div class="value">
                        提前 {{ activityDetail.countdown || 0 }} 天预热
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { secondActivityDetail } from '../../../../apis/marketing-manage/second'
export default {
    data () {
        return {
            activityDetail: {}
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    created () {
        this.getSecondActivityDetail(this.id)
    },
    methods: {
        async getSecondActivityDetail (id) {
            const { result } = await secondActivityDetail(id)
            this.activityDetail = result
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "second";
  .detail{
    margin: 32px 0 0 32px;
    .detail-wrap{
      margin-top: 32px;
      font-size: 18px;
      li{
        display: flex;
        margin-top: 20px;
        label{
          color: #666666;
          margin-right: 10px;
        }
        .value{
          font-weight: bold;
          color: #333333;
          width: 720px;
        }
        .product{
          border: 1px solid #CCCCCC;
          padding: 7px;
          display: flex;
          width: 420px;
          position: relative;
          img{
            width: 100px;
            height: 100px;
            margin-right: 10px;
          }
          .title{
            width: 290px;
            line-height: 1.6;
            word-break: break-all;
            color: #666666;
          }
        }
      }
    }
  }
</style>
