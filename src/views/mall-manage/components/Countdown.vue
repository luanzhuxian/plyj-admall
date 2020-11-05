<template>
    <div class="countdown-wrapper">
        <slot :time="parsedTime">
            {{ formattedTime }}
        </slot>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

type ParsedTime = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const parseTime: (time: number) => ParsedTime = (time: number) => {
    const days = Math.floor(time / DAY)
    const hours = Math.floor((time % DAY) / HOUR)
    const minutes = Math.floor((time % HOUR) / MINUTE)
    const seconds = Math.floor((time % MINUTE) / SECOND)

    return {
        days,
        hours,
        minutes,
        seconds
    }
}

const parseFormat = (format: string, parsedTime: ParsedTime) => {
    const { days } = parsedTime
    let { hours, minutes, seconds } = parsedTime

    if (~format.indexOf('DD')) {
        format = format.replace('DD', String(days).padStart(2, '0'))
    } else {
        hours += days * 24
    }

    if (~format.indexOf('HH')) {
        format = format.replace('HH', String(hours).padStart(2, '0'))
    } else {
        minutes += hours * 60
    }

    if (~format.indexOf('mm')) {
        format = format.replace('mm', String(minutes).padStart(2, '0'))
    } else {
        seconds += minutes * 60
    }

    if (~format.indexOf('ss')) {
        format = format.replace('ss', String(seconds).padStart(2, '0'))
    }

    return format
}

class Raf {
    root!: Window
    prev!: number
    setHandler!: Function
    clearHandler!: Function
    constructor (root = window) {
        this.root = root
        this.prev = Date.now()
        this.setHandler = this.fallback.bind(this)
        this.clearHandler = root.clearTimeout
        // Object.assign(this, {
        //     root,
        //     prev: Date.now(),
        //     // setHandler: root.requestAnimationFrame || this.fallback,
        //     // clearHandler: root.cancelAnimationFrame || root.clearTimeout
        //     setHandler: this.fallback.bind(this),
        //     clearHandler: root.clearTimeout
        // })
    }

    fallback (callback: Function) {
        const curr = Date.now()
        const ms = Math.max(0, 1000 - (curr - this.prev))
        const id = setTimeout(callback, ms)
        this.prev = curr + ms
        return id
    }

    set (fn: Function) {
        return this.setHandler.call(this.root, fn)
    }

    clear (id: number) {
        this.clearHandler.call(this.root, id)
    }
}

@Component
export default class Countdown extends Vue {
    /* props */

    // 倒计时时长
    @Prop({
        type: [Number, String],
        default: 0
    }) readonly duration!: number | string

    @Prop({
        type: String,
        default: 'HH:mm:ss'
    }) readonly format!: string

    @Prop({
        type: Boolean,
        default: true
    }) readonly autoStart!: boolean

    /* data */
    endTime = 0
    remain = 0
    raf!: Raf
    rafId!: number
    isCounting = false
    isKeepAlivePaused = false

    /* computed */
    get parsedTime () {
        return parseTime(this.remain)
    }

    get formattedTime () {
        return parseFormat(this.format, this.parsedTime)
    }

    @Watch('duration', { immediate: true, deep: true })
    onChange (newVal: number) {
        this.reset(newVal)
    }

    created () {
        if (this.isKeepAlivePaused) {
            this.isCounting = true
            this.isKeepAlivePaused = false
            this.tick()
        }
    }

    beforeDestroy () {
        if (this.isCounting) {
            this.pause()
            this.isKeepAlivePaused = true
        }
    }

    // beforeDestroy () {
    //     this.pause()
    // }

    /* methods */

    getRemain () {
        return Math.max(this.endTime - Date.now(), 0)
    }

    updateRemain (remain: number) {
        this.remain = remain
        this.$emit('change', this.parsedTime)
    }

    tick () {
        this.rafId = this.raf.set(() => {
            if (!this.isCounting) {
                return
            }

            const remain = this.getRemain()
            this.updateRemain(remain)

            if (this.remain > 0) {
                this.tick()
            } else {
                this.pause()
                this.$emit('finish')
            }
        })
    }

    start () {
        if (this.isCounting) {
            return
        }

        this.isCounting = true
        this.endTime = Date.now() + this.remain
        this.tick()
    }

    pause () {
        this.isCounting = false
        if (this.raf) {
            this.raf.clear(this.rafId)
        }
    }

    reset (duration: number) {
        if (!duration) {
            return false
        }
        if (!this.raf) {
            this.raf = new Raf()
        }
        this.pause()
        this.remain = +this.duration

        if (this.autoStart) {
            this.start()
        }
    }
}
</script>

<style lang="scss">
.countdown-wrapper {
    display: inline-flex;
    align-items: center;
}

</style>
