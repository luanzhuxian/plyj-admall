<template>
    <div class="container">
        <transition name="slide-fade">
            <div v-if="pointShow" @mouseenter="enter()" @mouseleave="leave()">
                <div class="point-box">
                    <div v-for="(item,index) in activities" :key="index" :class="{'point-active': item.id === hash}">
                        <div class="point-pointer" />
                        <div class="point-text">
                            <a ref="hash" :href="'#' + item.id">{{ item.content }}</a>
                        </div>
                    </div>
                </div>
                <div class="deposit-draft" @click="saveDraft" v-if="showDraft">
                    <pl-svg name="icon-caogaoxiang" width="16" class="mr-10" /><span>存入草稿箱</span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'Point',
    props: {
        activities: {
            type: Array,
            default () {
                return []
            }
        },
        showDraft: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            hash: '',
            hashDomList: {},
            pointShow: true,
            timer: {},
            canTime: true
        }
    },
    watch: {
        $route () {
            this.hash = ''
        },
        activities () {
            this.hashDomList = {}
            for (const item of this.activities) {
                const hashDom = document.getElementById(item.id)
                if (hashDom) {
                    this.hashDomList[item.id] = hashDom
                }
            }
            this.hash = location.hash.substring(1) || this.activities[0].id
            this.ids = Object.keys(this.hashDomList)
            this.scrollWrap = document.querySelector('#main')
            console.log(this.scrollWrap)
            setTimeout(() => {
                if (this.hash) {
                    const EL = this.hashDomList[this.hash]
                    if (EL) {
                        const top = EL.getBoundingClientRect().top
                        if (this.hash === 'basic') {
                            this.scrollWrap.scrollTo(0, 0)
                        } else {
                            this.scrollWrap.scrollTo(0, top)
                        }
                    }
                }
                this.addScroll()
            }, 200)
        }
    },
    mounted () {
        for (const item of this.activities) {
            const hashDom = document.getElementById(item.id)
            if (hashDom) {
                this.hashDomList[item.id] = hashDom
            }
        }
        this.hash = location.hash.substring(1) || this.activities[0].id
        this.ids = Object.keys(this.hashDomList)
        this.scrollWrap = document.querySelector('#main')
        setTimeout(() => {
            if (this.hash && this.hashDomList[this.hash]) {
                const top = this.hashDomList[this.hash].getBoundingClientRect().top
                this.scrollWrap.scrollTo(0, top)
            }
            this.addScroll()
        }, 500)
    },
    beforeDestroy () {
        this.removeScroll()
    },
    methods: {
        enter () {
            clearInterval(this.timer)
            this.pointShow = true
        },
        leave () {
            this.canTime = true
            this.timerFun()
        },
        timerFun () {
            this.pointShow = true
            if (this.canTime) {
                this.canTime = false
                this.timer = setTimeout(() => {
                    this.pointShow = false
                    this.canTime = true
                }, 2500)
            }
        },
        otherScroll () {
            for (const id of this.ids) {
                if (!this.hashDomList[id]) {
                    continue
                }
                const top = this.hashDomList[id].getBoundingClientRect().top
                if (top > 0 && top < 100) {
                    this.hash = id
                    history.replaceState(null, null, `#${ id }`)
                    break
                }
            }
            clearInterval(this.timer)
            this.pointShow = true
            this.canTime = true
            this.timerFun()
        },
        addScroll () {
            setTimeout(() => {
                window.addEventListener('scroll', this.otherScroll, {
                    capture: true,
                    passive: true
                })
            }, 500)
        },
        removeScroll () {
            removeEventListener('scroll', this.otherScroll, {
                capture: true,
                passive: true
            })
        },
        saveDraft () {
            this.$emit('saveDraft')
        }
    }
}
</script>

<style scoped lang="scss">
  .container{
    position: fixed;
    right: 30px;
    top: 10%;
    .point-box{
      padding: 20px 20px 20px 24px;
      background-color: #fff;
      box-shadow:0 3px 8px 0 rgba(44,48,58,0.08);
      >div{
        position: relative;
      }
      >div:last-child .point-text{
        padding-bottom: 0;
        border-left: none;
      }
      >.point-active{
        .point-pointer{
          background: #fff;
          width: 13px;
          height: 13px;
          border: 4px solid $--color-primary-blue;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: -6px;
        }
        .point-text{
          color: $--color-primary-blue;
        }
      }
      .point-text{
        border-left: 1px solid #ccc;
        font-size:14px;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:14px;
        padding: 0 20px 36px;
      }
      .point-pointer{
        background: #ccc;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        position: absolute;
        transition: width .2s linear, height .2s linear, left .2s linear;
        top: 0;
        left: -3px;
      }
    }
    .deposit-draft{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      width: 145px;
      height: 61px;
      background: #fff;
      box-shadow: 0px 3px 8px 0px rgba(44,48,58,0.08);
      cursor: pointer;
      >span{
        font-size: 14px;
        color: $--color-primary-blue;
      }
      >i{
        color: #229FFF;
        font-size: 16px;
        margin-right: 10px;
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100px);
    opacity: 0;
  }
</style>
