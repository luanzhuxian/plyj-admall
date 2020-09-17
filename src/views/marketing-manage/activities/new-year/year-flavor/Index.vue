<template>
    <div class="newcomers-gift-list wrap">
        <top-back />
        <div v-if="activeTab === 'YearFlavorList' || activeTab === 'YearFlavorSetting'" class="newcomers-list-header bg-white">
            <img class="mr-10" src="https://mallcdn.youpenglai.com/static/admall/2.0.0/74b79faf-04ae-4507-ae69-85aa63391d4b.png">
            <span class="mr-10 font-weight-bold">我心中的年味</span>
            <span class="items description">- 获得我的年味，即可参与抽奖，有机会获得年味大礼</span>
            <span class="items description time"><pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" /> 使用有效期 2019.12.26-2020.04.30</span>
            <el-button type="primary" round @click="add" icon="el-icon-plus">
                新建活动
            </el-button>
        </div>

        <pl-tabs
            v-if="activeTab === 'YearFlavorList' || activeTab === 'YearFlavorSetting'"
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'YearFlavorList'},
                {label:'活动设置',name:'YearFlavorSetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <keep-alive :exclude="exclude">
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'FlavorIndex',
    data () {
        return {
            exclude: ['AddYearFlavor']
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
