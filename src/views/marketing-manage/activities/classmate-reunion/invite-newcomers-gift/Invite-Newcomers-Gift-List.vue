<template>
    <div class="invite-newcomers-gift-list wrap">
        <ListHeader
            v-if="showTop"
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            title="赢取豪礼"
            description="邀请新用户助力，获得小礼品"
            start-time="2019.10.28"
            end-time="2020.01.31"
        />
        <el-button type="primary" round @click="add">
            新建活动
            <i class="el-icon-plus el-icon--right" />
        </el-button>
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
import ListHeader from '../../../components/List-Header'
export default {
    name: 'InviteNewcomersGiftList',
    components: { ListHeader },
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
