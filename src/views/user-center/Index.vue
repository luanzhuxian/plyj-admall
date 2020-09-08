<template>
    <div>
        <!-- 空的路由入口，仅作为导航 -->
        <router-view />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class UserManege extends Vue {

}
</script>

<style module lang="scss">

</style>
