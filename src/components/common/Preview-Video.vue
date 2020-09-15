<template>
    <transition name="fade">
        <div v-if="show" class="video-box">
            <div class="icon-guanbi" @click="close">
                <strong>ESC</strong>
                <pl-svg name="icon-guanbi" width="20" fill="#ddd" />
            </div>
            <video controlsList="nodownload" ref="video" autoplay :src="src" controls />
        </div>
    </transition>
</template>

<script>
export default {
    name: 'PreviewVideo',
    props: {
        show: Boolean,
        src: {
            type: String,
            default: ''
        }
    },
    watch: {
        show (val) {
            if (val) {
                document.addEventListener('keyup', this.escHandler)
            } else {
                document.removeEventListener('keyup', this.escHandler)
            }
        }
    },
    methods: {
        close () {
            this.$refs.video.pause()
            this.$emit('update:show', false)
        },
        escHandler (e) {
            if (e.code === 'Escape') {
                this.close()
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .video-box {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 999;

    > .icon-guanbi {
      position: fixed;
      top: 70px;
      right: 120px;
      cursor: pointer;
      > strong {
        margin-right: 10px;
        font-size: 20px;
        color: #fff;
      }
      > svg {
        /*border-radius: 20px;*/
      }
    }

    video {
      height: 80vh;
    }
  }
</style>
