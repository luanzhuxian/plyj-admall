<template>
    <div class="invite-newcomers-gift-list wrap">
        <top-back />
        <div v-if="showTop" class="invite-newcomers-list-header bg-white">
            <img class="mr-10" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/gift@1x.png">
            <span class="mr-10 font-weight-bold">赢取豪礼</span>
            <span class="items description">- 邀请新用户助力，获得小礼品</span>
            <span class="items description">使用有效期 2019.10.28-2020.01.31</span>
            <el-button type="primary" round @click="add">
                新建活动
                <i class="el-icon-plus el-icon--right" />
            </el-button>
        </div>

        <pl-tabs
            v-if="showTop"
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'InviteNewcomersList'},
                {label:'活动设置',name:'InviteNewcomersSetting'},
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
    name: 'InviteNewcomersGiftList',
    data () {
        return {
            showTop: false
        }
    },
    methods: {
        add () {
            this.$router.push({ name: 'InviteNewcomersAdd' })
        }
    }
}
</script>

<style scoped lang="scss">
.invite-newcomers-gift-list {
  .invite-newcomers-list-header {
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
      color: #A8A8A8
    }
  }
}
</style>
