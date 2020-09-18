<template>
    <div
        :class="$style.onlinePack"
        @click="target"
    >
        <div :class="$style.content">
            <img :class="$style.img" :src="imgSrc">
            <div :class="$style.detail">
                <div :class="$style.title">
                    <span :class="$style.name" v-text="name" />
                    <img :src="item" :class="$style.tag" v-for="item in tags" :key="item">
                </div>
                <div :class="$style.desc" v-text="desc" />
            </div>
        </div>
        <div :class="$style.tip">
            <slot />
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class OnlinePack extends Vue {
    @Prop({
        type: String,
        default: ''
    }) readonly name: string | undefined

    @Prop({
        type: String,
        default: ''
    }) readonly imgSrc: string | undefined

    @Prop({
        type: String,
        default: ''
    }) readonly desc: string | undefined

    @Prop({
        type: Array,
        default: () => []
    }) readonly tags: string[] | undefined

    private target () {
        return 123
    }
}

</script>

<style lang='scss' module>
.online-pack {
    position: relative;
    display: inline-block;
    border: 1px solid #f7f7f7;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #fff;
    transition: .5s;
    &:hover {
        cursor: pointer;
        transform: translate3d(0, -6px, 0);
        box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .1);
    }
    > .content {
        display: flex;
        box-sizing: border-box;
        height: 88px;
        padding: 20px;
        > .img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
        }
        > .detail {
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            margin-left: 10px;
            > .title {
                display: flex;
                align-items: flex-start;
                width: 100%;
                > .name {
                    margin-bottom: 4px;
                    font-size: 14px;
                    color: #333;
                }
                > .tag {
                    width: 20px;
                    height: 20px;
                }
            }
            > .desc {
                font-size: 12px;
                color: #999;
            }
        }
    }
    > .tip {
        position: relative;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px 20px;
        font-size: 10px;
        color: #6e7b8e;
        background-color: #f5f6fa;
        &:before {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            height: 1px;
            width: 100%;
            background-color: #e7e7e7;
        }
    }
}

</style>
