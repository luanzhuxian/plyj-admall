<template>
    <div class="account-container wrap">
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
