<template>
    <div class="dragon-panel" :class="[customClass]">
        <slot name="title">
            <div class="dragon-panel-title">
                <PlSvg
                    type="img"
                    :name="title.name"
                    :width="title.width"
                    :height="title.height"
                    v-if="isSvg"
                />
                <title v-text="title" v-else />
            </div>
        </slot>

        <slot />

        <template v-if="!hideButton">
            <slot name="button">
                <button class="dragon-panel-button" v-text="button" />
            </slot>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Panel',
    props: {
        customClass: {
            type: String,
            default: ''
        },
        title: {
            type: [Object, String],
            default: ''
        },
        button: {
            type: String,
            default: '查看更多'
        },
        hideButton: Boolean
    },
    data () {
        return {}
    },
    computed: {
        isSvg () {
            const { title } = this
            return typeof title === 'object'
        }
    },
    methods: {
        handleClick () {
            this.$emit('click')
        }
    }

}
</script>

<style lang="scss">
.dragon-panel {
    position: relative;
    padding: 40px 8px 25px;
    background: #0058ef;
    border: 2px solid #222;
    border-radius: 8px;
    &-title {
        position: absolute;
        top: -14px;
        left: 0;
        right: 0;
        text-align: center;
    }
    > button {
        display: block;
        margin: 25px auto 0;
        width: 95px;
        height: 30px;
        line-height: 26px;
        text-align: center;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/panel-btn.png') no-repeat center;
        background-size: 100%;
        border: 2px solid #222;
        border-radius: 25px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000;
    }
}

</style>
