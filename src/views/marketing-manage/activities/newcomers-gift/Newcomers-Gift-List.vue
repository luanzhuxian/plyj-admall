<template>
    <div class="newcomers-gift-list wrap">
        <div v-if="showTop" class="newcomers-detail-header">
            <div class="flex align-item-center">
                <img class="mr-10" src="https://mallcdn.youpenglai.com/static/admall/2.0.0/c24c82f1-6e4e-43f2-b164-ca8ec65f2ebb.png">
                <span class="mr-30 font-weight-bold fz-16">{{ newcomersInfo.activityName }}</span>
                <span class="status mr-30">
                    <img style="vertical-align: middle;" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/clock-white@1x.png">&nbsp;
                    <span v-if="newcomersInfo.status === 0">已结束</span>
                    <span v-if="newcomersInfo.status === 1">未开始</span>
                    <span v-if="newcomersInfo.status === 2">进行中</span>...
                </span>
                <span class="valid-date mr-30">
                    活动时间：{{ newcomersInfo.activityStartTime | dateFormat('YYYY-MM-DD') }} - {{ newcomersInfo.activityEndTime | dateFormat('YYYY-MM-DD') }}&nbsp;
                </span>
                <el-button type="primary" @click="share" plain v-if="newcomersInfo.status === 1 || newcomersInfo.status === 2">
                    分享活动
                </el-button>
            </div>
        </div>

        <pl-tabs
            v-if="showTop"
            :value="$route.name"
            :tabs="[
                {label:'活动详情', name:'NewcomersDetail'},
                {label:'活动数据', name:'NewcomersData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
import Share from '../../../../components/common/Share.vue'
export default {
    name: 'NewcomersGiftList',
    components: {
        Share
    },
    data () {
        return {
            showTop: false,
            activeTab: '',
            newcomersInfo: {},
            // 分享链接
            qrcodeText: '',
            // 分享开关
            qrcodeShow: false
        }
    },
    watch: {
        $route (to) {
            this.activeTab = to.name
        }
    },
    async created () {
        this.activeTab = this.$route.name
    },
    methods: {
        share () {
            this.qrcodeText = `${ this.$store.getters['user/mallUrl'] }/newcomers/${ this.$route.params.id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        }
    }
}
</script>

<style scoped lang="scss">
.newcomers-gift-list {
  .newcomers-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
      padding: 20px;
      border-radius: 10px;
      background: #F5F6FA;
      margin-bottom: 20px;
    .mr-30 {
      margin-right: 30px;
    }

    .status {
      display: inline-block;
      width: 104px;
      height: 30px;
      line-height: 28px;
      border-radius: 15px;
      font-size: 16px;
      color: white;
      background-color: #ec742e;
      text-align: center;
    }

    .valid-date {
        margin-left: 100px;
        font-size:12px;
        color: #999;
    }
  }
}
</style>
