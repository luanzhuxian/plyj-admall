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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CellGroup extends Vue {
    /* props */
    @Prop(String) readonly customClass!: string
    @Prop(String) readonly title!: string
    @Prop(Boolean) readonly border!: boolean

    /* computed */
    get showTitle (): boolean {
        return !!this.title || !!this.$slots.title
    }
}
</script>

<style lang="scss">
    .pl-cell-group {
        background-color: #fff;
    }
</style>
