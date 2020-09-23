<template>
    <div class="wrap">
        <pl-tabs
            v-show="showTabRouteName.includes($route.name)"
            :value="$route.name"
            :tabs="tabs"
            @tabClick="handleClick"
        />
        <router-view />
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class MemberManage extends Vue {
    tabs= [
        {
            name: 'MemberManageList',
            label: '用户管理'
        },
        {
            name: 'VistorManageList',
            label: '游客管理'
        }
    ]

    showTabRouteName = ['MemberManageList', 'VistorManageList']

    handleClick ({ name }: { name: string }) {
        this.$router.push({ name })
    }
}
</script>

<style module lang="scss">
</style>
