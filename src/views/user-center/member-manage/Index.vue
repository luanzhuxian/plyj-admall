<template>
    <div class="member">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
                v-for="item in tabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            >
                {{ item.title }}
            </el-tab-pane>
        </el-tabs>
        <!-- 空的路由入口，仅作为导航 -->
        <router-view />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class MemberManage extends Vue {
    tabs= [
        {
            name: 'MemberManageList',
            title: '用户管理'
        },
        {
            name: 'VistorManageList',
            title: '游客管理'
        }
    ]

    activeName = this.tabs[0].name
    handleClick () {
        this.$router.push({ name: this.activeName })
    }
}
</script>

<style module lang="scss">
    .member {
        background-color: #fff;
    }
</style>
