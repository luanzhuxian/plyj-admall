<template>
    <div class="newcomers-gift-list wrap">
        <ListHeader
            v-if="activeTab === 'YearFlavorList' || activeTab === 'YearFlavorSetting'"
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/年味.png"
            title="我心中的年味"
            description="获得我的年味，即可参与抽奖，有机会获得年味大礼"
            start-time="2019.12.26"
            end-time="2020.04.30"
        />
        <el-button type="primary" round @click="add" icon="el-icon-plus" v-show="$route.name === 'YearFlavorList'">
            新建活动
        </el-button>
        <el-button type="text" @click="showExplanation = true" v-show="$route.name === 'YearFlavorList'">
            活动说明
        </el-button>
        <!-- <pl-tabs
            v-if="activeTab === 'YearFlavorList' || activeTab === 'YearFlavorSetting'"
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'YearFlavorList'},
                {label:'活动设置',name:'YearFlavorSetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        /> -->

        <router-view />
        <Setting :show.sync="showExplanation" />
    </div>
</template>

<script>
import ListHeader from '../../../../../components/marketing-manage/List-Header'
import Setting from './Year-Flavor-Setting'
export default {
    name: 'FlavorIndex',
    components: { ListHeader, Setting },
    data () {
        return {
            showExplanation: false
        }
    },
    watch: {
        $route (to) {
            this.activeTab = to.name
        }
    },

    created () {
        this.activeTab = this.$route.name
    },

    methods: {
        add () {
            this.$router.push({ name: 'AddYearFlavor' })
        }
    }
}
</script>

<style scoped lang="scss">
  .newcomers-gift-list {
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
        color: #A8A8A8;
        font-size: 16px;
      }

      .time{
        border:1px solid rgba(204,204,204,1);
        border-radius:130px;
        padding: 2px 10px;
      }
    }
  }
</style>
