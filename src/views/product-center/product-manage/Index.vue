<template>
    <div class="product-manage">
        <keep-alive :exclude="['AddProduct']">
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ProductManage extends Vue {

}
</script>

<style module lang="scss">

</style>
