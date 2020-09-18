<template>
    <div :class="$style.productCenter">
        <router-view />
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ProductCenter extends Vue {

}
</script>

<style module lang="scss">
    .productCenter {
        height: 100%;
    }
</style>
