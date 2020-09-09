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
    // props
    @Prop(String) private customClass!: string
    // @Prop(String) private icon!: string
    @Prop(String) private title!: string
    @Prop(String) private value!: string
    @Prop(Boolean) private border!: boolean
    @Prop(Boolean) private isLink!: boolean
    @Prop(String) private linkTarget!: string
    @Prop() private to!: Location

    // methods
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
