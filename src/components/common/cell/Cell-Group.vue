<template>
    <div :class="[customClass, border ? 'border' : '']">
        <div class="pl-cell-group__title" v-if="showTitle">
            <slot name="title">
                {{ title }}
            </slot>
        </div>
        <div class="pl-cell-group">
            <slot />
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    props: {
        customClass: String,
        title: String,
        border: Boolean
    }
})
export default class CellGroup extends Vue {
    // computed
    get showTitle () {
        return this.title || this.$slots.title
    }
}
</script>

<style lang="scss">
    .pl-cell-group {
        background-color: #fff;
    }
</style>
