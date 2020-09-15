<template>
    <div :class="$style.accountContainer">
        <keep-alive>
            <router-view />
        </keep-alive>
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
