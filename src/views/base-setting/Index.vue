<template>
    <div :class="$style.baseSetting">
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class BaseSetting extends Vue {

}
</script>

<style module lang="scss">

.base-setting {
    height: 100%;
}

</style>
