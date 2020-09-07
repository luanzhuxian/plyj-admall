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
        width: 120px;
        height: 100vh;
        color: #fff;
        font-size: 20px;
        background-color: #001629;
    }
</style>
