<template>
    <transition name="fade">
        <div
            :class="$style.mask"
            @click.self="clickModel"
            v-if="show"
            :title="closeOnPressEscape ? '按ESC关闭' : ''"
        >
            <slot />
            <pl-svg :class="$style.close" name="icon-shibai" width="28" @click="close" />
        </div>
    </transition>
</template>

<script>
export default {
    name: 'PlMask',
    props: {
        show: Boolean,
        closeOnClickModal: {
            type: Boolean,
            default: true
        },
        closeOnPressEscape: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        show (val) {
            if (val) {
                document.addEventListener('keyup', this.esc)
            } else {
                document.removeEventListener('keyup', this.esc)
            }
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$emit('close')
        },
        clickModel () {
            if (this.closeOnClickModal) {
                this.close()
            }
        },
        esc (event) {
            if (event.code === 'Escape' && this.closeOnPressEscape) {
                this.close()
            }
        }
    }
}
</script>

<style module lang="scss">
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, .5);
    z-index: 8000;
  }
  .close {
    position: absolute;
    right: 50px;
    top: 30px;
    cursor: pointer;
  }
</style>
