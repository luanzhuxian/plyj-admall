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
    @Prop() private customClass!: string
    // @Prop() private icon!: string
    @Prop() private title!: string
    @Prop() private value!: string
    @Prop() private border!: boolean
    @Prop() private isLink!: boolean
    @Prop() private linkTarget!: string
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
