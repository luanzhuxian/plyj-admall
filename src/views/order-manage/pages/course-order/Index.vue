<template>
    <div class="course-order">
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class CourseOrder extends Vue {

}
</script>

<style module lang="scss">

</style>
