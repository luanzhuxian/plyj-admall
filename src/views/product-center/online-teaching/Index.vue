<template>
    <div>
        <keep-alive :exclude="exclude">
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class OnlineTeaching extends Vue {
    exclude = ['AddSeriesOfCourses']
}
</script>
