<template>
    <h1>
        HOME
        <div @click="$router.push({name:'Login'})">用户登录</div>
    </h1>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
export default class Home extends Vue {

}
</script>

<style module lang="scss">

</style>
