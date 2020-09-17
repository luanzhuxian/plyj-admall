<template>
    <div class="newcomers-gift-list wrap">
        <div v-if="activeTab === 'GeneralList' || activeTab === 'GeneralSetting'" class="newcomers-list-header bg-white">
            <img class="mr-10 activity-icon" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/longmen-sign.png">
            <span class="mr-10 font-weight-bold">端午佳话粽粽有礼</span>
            <span class="items description">- 签到参与端午活动，即可参与抽奖，有机会获得粽粽大礼</span>
            <span class="items description time"><pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" /> 使用有效期：{{ start | dateFormat('YYYY.MM.DD') }} - {{ '2020-08-31' | dateFormat('YYYY.MM.DD') }}</span>
            <el-button type="primary" round @click="add" icon="el-icon-plus">
                新建活动
            </el-button>
        </div>

        <pl-tabs
            v-if="activeTab === 'GeneralList' || activeTab === 'GeneralSetting'"
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'GeneralList'},
                {label:'活动设置',name:'GeneralSetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <router-view />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_MRKET_STATU_AUTH } from '../../../../../store/mutation-type'
export default {
    name: 'GeneralIndex',
    data () {
        return {
            showTop: false,
            activeTab: '',
            start: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters({
            mrketStatuAuth: 'account/mrketStatuAuth'
        })
    },
    watch: {
        $route (to) {
            this.activeTab = to.name
        }
    },
    async created () {
        this.activeTab = this.$route.name
        if (!this.mrketStatuAuth) await this[GET_MRKET_STATU_AUTH]()
        if (!this.mrketStatuAuth || !this.mrketStatuAuth.length) return
        const dumplingsInformation = this.mrketStatuAuth.find(({ programId }) => programId === '2')
        this.start = dumplingsInformation.createTime || ''
        this.end = dumplingsInformation.validity || ''
    },

    methods: {
        ...mapActions([GET_MRKET_STATU_AUTH]),
        add () {
            this.$router.push({ name: 'GeneralAdd' })
        }
    }
}
</script>

<style scoped lang="scss">
.newcomers-gift-list {
  .activity-icon{
    width: 23px;
  }
  .newcomers-list-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 52px;
    padding-left: 20px;
    // margin-bottom: 16px;

    .items {
      margin-right: 24px;
    }

    .description {
      color: #a8a8a8;
      font-size: 16px;
    }

    .time {
      border: 1px solid rgba(204,204,204,1);
      border-radius: 130px;
      padding: 2px 10px;
    }
  }
}

</style>
