<template>
    <div class="wrap">
        <pl-tabs
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

    handleClick ({ name }: { name: string }) {
        this.$router.push({ name })
    }
}
</script>

<style module lang="scss">
</style>
