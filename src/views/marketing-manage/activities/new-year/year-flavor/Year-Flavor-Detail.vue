<template>
    <div class="newcomers-gift-list">
        <div class="newcomers-list-header">
            <img class="mr-10" src="https://mallcdn.youpenglai.com/static/admall/2.0.0/74b79faf-04ae-4507-ae69-85aa63391d4b.png">
            <span class="mr-10 font-weight-bold">我心中的年味</span>
            <span class="items description">- 获得我的年味，即可参与抽奖，有机会获得年味大礼</span>
            <span class="items description time"><pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" /> 使用有效期 2019.12.26-2020.04.30</span>
        </div>

        <pl-tabs
            v-if="activeTab === 'ViewYearFlavorInfo' || activeTab === 'ViewYearFlavorData' || activeTab === 'ViewYearFlavorGiftData'"
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'ViewYearFlavorInfo'},
                {label:'活动数据',name:'ViewYearFlavorData'},
                {label:'礼品发放数据',name:'ViewYearFlavorGiftData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <router-view />
    </div>
</template>

<script>
export default {
    name: 'YearFlavorDetail',
    data () {
        return {
            showTop: false,
            activeTab: ''
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
    }
}
</script>

<style scoped lang="scss">
  .newcomers-gift-list {
    .newcomers-list-header {
        display: flex;
        align-items: center;
        padding: 20px;
        background: #F5F6FA;
        border-radius: 10px;
        margin-bottom: 20px;

      .items {
        margin-right: 24px;
      }

      .description {
        color: #A8A8A8;
        font-size: 16px;
      }

      .time{
          margin-left: 100px;
          font-size:12px;
          color: #999;
      }
    }
  }
</style>
