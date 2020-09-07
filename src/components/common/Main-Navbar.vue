<template>
    <div :class="$style.mainNavbar">
        主菜单
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
export default class MainNavbar extends Vue {
}
</script>

<style module lang="scss">
    .main-navbar {
        font-size: 80px;
    }
</style>
