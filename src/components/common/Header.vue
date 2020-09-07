<template>
    <header :class="$style.header">
        头部
    </header>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Header extends Vue {

}
</script>

<style module lang="scss">
    .header {
        height: 60px;
        font-size: 30px;
        background-color: #fff;
        box-shadow: 0 1px 0 #E7E7E7;
    }
</style>
