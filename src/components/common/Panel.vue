<template>
    <CellGroup :custom-class="`pl-panel ${customClass}`" :border="border">
        <slot name="header">
            <Cell
                custom-class="pl-panel__header"
                :title="title"
                :value="value"
                :is-link="isLink"
                @click="onClick"
            />
        </slot>
        <div class="pl-panel__content">
            <slot />
        </div>
        <slot name="footer" class="pl-panel__footer" />
    </CellGroup>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import CellGroup from './cell/Cell-Group.vue'
import Cell from './cell/Cell.vue'
import { Location } from 'vue-router'

@Component({
    components: {
        CellGroup,
        Cell
    }
})
export default class Panel extends Vue {
    /* props */
    @Prop(String) readonly customClass!: string
    // @Prop(String) readonly icon!: string
    @Prop(String) readonly title!: string
    @Prop(String) readonly value!: string
    @Prop(Boolean) readonly border!: boolean
    @Prop(Boolean) readonly isLink!: boolean
    @Prop(String) readonly linkTarget!: string
    @Prop() readonly to!: Location

    /* methods */
    @Emit('click')
    onClick (event: Event) {
        const { isLink, linkTarget, to } = this
        const target = event.target as HTMLElement

        if (isLink && to && to.name) {
            if (linkTarget && target.className === linkTarget) {
                this.$router.push(to)
            }
            if (!linkTarget) {
                this.$router.push(to)
            }
        }
    }
}
</script>

<style lang="scss">
    .pl-panel {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        background-color: #fff;
        &__content {
            flex: 1;
        }
    }
</style>
