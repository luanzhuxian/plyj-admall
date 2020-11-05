<template>
    <div :class="$style.productCenter">
        <router-view />
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class ProductCenter extends Vue {

}
</script>

<style lang="scss" module>
.product-center {
    height: 100%;
}
</style>
