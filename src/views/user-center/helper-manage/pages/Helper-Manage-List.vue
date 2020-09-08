<template>
    <div>helper管理列表 {{ name }}</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class HelperManageList extends Vue {
    name = '123'
}
</script>

<style module lang="scss">

</style>
