<template>
    <keep-alive :exclude="['AddKnowledgeCourse']">
        <router-view />
    </keep-alive>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class KnowledgeCourse extends Vue {
}
</script>
