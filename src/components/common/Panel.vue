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

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import CellGroup from './cell/Cell-Group'
import Cell from './cell/Cell'

@Component({
    props: {
        customClass: String,
        // icon: String,
        title: String,
        value: String,
        border: Boolean,
        isLink: Boolean,
        linkTarget: String,
        to: Object
    },
    components: {
        CellGroup,
        Cell
    }
})
export default class Panel extends Vue {
    // methods
    onClick (event) {
        this.$emit('click', event)
        const { isLink, linkTarget, to } = this
        if (isLink && to && to.name) {
            if (linkTarget && event.target.className === linkTarget) {
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
