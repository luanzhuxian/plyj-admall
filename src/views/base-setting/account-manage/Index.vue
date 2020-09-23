<template>
    <div :class="$style.accountContainer">
        <keep-alive v-if="$route.name !== 'AccountDetail'">
            <router-view />
        </keep-alive>
        <router-view v-else />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class AccountManager extends Vue {

}
</script>

<style lang="scss" module>

.account-container {
    height: 100%;
}

</style>
