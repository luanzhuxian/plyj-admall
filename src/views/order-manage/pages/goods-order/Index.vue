<template>
    <div class="goods-order">
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class GoodsList extends Vue {

}
</script>

<style module lang="scss">

</style>
