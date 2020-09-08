<template>
    <svg
        v-if="type === 'svg' && update"
        :class="$style.plSvg"
        aria-hidden="true"
        @click="clickHandler"
        :style="{
            width: truthWidth,
            height: truthHeight
        }"
        @hover="hoverHandler"
    >
        <use :xlink:href="'#' + (tempName || name)" />
    </svg>
    <img
        v-else
        :src="name"
        :style="{ width: width ? width + 'px' : height ? 'auto' : 'none', height: height ? height + 'px' : width ? 'auto' : 'none' }"
        alt=""
        @hover="hoverHandler"
        @click="clickHandler"
    >
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
let svgParent: HTMLElement | null = null
@Component
export default class PlSvg extends Vue {
    // svg id的副本
    tempName = ''
    computedWidth = null
    computedHeight = null
    update = true
    clonedSvg: { [key: string]: Node } = {}
    // 如果图标加载错误，将尝试3次
    count = 0

    @Prop(String) readonly fill?: string
    @Prop(String) readonly name!: string
    @Prop([Number, String]) readonly width?: string
    @Prop([Number, String]) readonly height?: string
    @Prop({ default: 'svg' }) readonly type?: string

    @Watch('fill')
    fillChanged (val: string) {
        if (val) this.change(val)
    }

    @Watch('name')
    async nameChanged (val: string) {
        if (this.fill && val) {
            this.change(this.fill)
        } else {
            this.tempName = val
        }
    }

    get truthWidth (): string | null {
        if (this.width) {
            return `${ this.width }px`
        }
        // 如果没设置宽，默认宽等于高
        if (this.height) {
            return `${ this.height }px`
        }
        return null
    }

    get truthHeight (): string | null {
        if (this.height) {
            return `${ this.height }px`
        }
        // 如果没设置高，默认高等于宽
        if (this.width) {
            return `${ this.width }px`
        }
        return null
    }

    mounted () {
        this.change(this.fill)
    }

    clickHandler (e: Event) {
        this.$emit('click', e)
    }

    hoverHandler (e: Event) {
        this.$emit('hover', e)
    }

    change (fill: string | undefined) {
        if (!this.name || !fill || this.type !== 'svg') return

        /**
         * 由于使用的是svg精灵，所以
         * 要使得fill属性生效，必须保证不存在行内fill属性 或者 修改行内fill属性
         * 如果直接修改行内属性，会改变全局所有的svg颜色
         * 所以，先复制一份svg，然后修改这个副本的颜色，使用完之后，再删除这个副本，避免副本越来越多
         */
        const svg = document.getElementById(this.name)
        if (!svg) {
            // 如果图标加载失败，再尝试3次
            if (this.count >= 3) {
                console.error(`svg ${ this.name } 不存在`)
                return
            }
            setTimeout(() => {
                this.change(fill)
                this.count++
            }, 1000)
            return
        }
        // 补全颜色值,用颜色作为新生成的图标id，这样，就可以保证相同颜色的图标可以复用
        let fillStr = String(fill).replace(/#/g, '')
        fillStr = fillStr.padEnd(6, fillStr)
        this.tempName = `${ this.name }-${ fillStr }`
        // 如果图标已经缓存，则不再生成新的图标
        if (window[this.tempName]) return
        // 标记已经生成的图标
        window[this.tempName] = true
        const clonedSvg: HTMLElement = svg.cloneNode(true) as HTMLElement
        clonedSvg.setAttribute('id', this.tempName)
        svgParent = svg.parentNode as HTMLElement
        this.clonedSvg[this.tempName] = clonedSvg
        // 给克隆后的图标填充颜色
        try {
            const fills = clonedSvg.querySelectorAll('[fill]')
            const colors = clonedSvg.querySelectorAll('[color]')
            clonedSvg.setAttribute('fill', fill)
            for (const fillEle of fills) {
                if (fillEle.getAttribute('fill') !== 'none') {
                    fillEle.setAttribute('fill', fill)
                }
            }
            for (const color of colors) {
                color.setAttribute('color', fill)
            }
        } catch (e) {
            console.error(`svg ${ this.name } 不存在`)
        }
        if (svg.parentNode) {
            svg.parentNode.appendChild(clonedSvg)
        }
    }

    clean () {
        if (this.type !== 'svg') return
        if (svgParent) {
            for (const k of Object.keys(this.clonedSvg)) {
                try {
                    svgParent.removeChild(this.clonedSvg[k])
                } catch (e) {
                }
            }
        }
        this.clonedSvg = {}
    }
}

</script>

<style module lang="scss">
  .pl-svg {
    vertical-align: -2px;
  }
</style>
