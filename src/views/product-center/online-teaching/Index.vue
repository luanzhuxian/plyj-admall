<template>
    <div>
        <keep-alive :exclude="exclude">
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class OnlineTeaching extends Vue {
    exclude = ['AddSeriesOfCourses']

    @Watch('$route', { immediate: true })
    c (to: any) {
        console.log(to)
    }
}
</script>
