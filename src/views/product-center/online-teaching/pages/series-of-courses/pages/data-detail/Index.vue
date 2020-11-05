<template>
    <div class="wrap">
        <PlTabs
            :value="$route.name"
            :tabs="[
                { label: '课程数据', name: 'CoursesSeriesOfCoursesData' },
                { label: '用户数据', name: 'UsersSeriesOfCoursesData' },
            ]"
            @tabClick="data => $router.push({ name: data.name })"
        />
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class DataDetail extends Vue {

}
</script>

<style module lang="scss">

</style>
