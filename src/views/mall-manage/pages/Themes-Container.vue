<template>
    <div class="mall-themes-container">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class MallThemesContainer extends Vue {

}
</script>
