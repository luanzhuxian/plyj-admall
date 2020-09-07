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
        font-size: 80px;
    }
</style>
