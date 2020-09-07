<template>
    <div :class="$style.schemePack">
        <div :class="$style.content">
            <img :class="$style.img" :src="imgSrc">
            <div :class="$style.detail">
                <div :class="$style.title">
                    <span :class="$style.name" v-text="name" />
                    <span :class="$style.tab">新</span>
                </div>
                <div :class="$style.desc" v-text="desc" />
            </div>
        </div>
        <div :class="$style.tip">
            <div>有效期：{{ expired }}</div>
            <div>当前活动：{{ count }}个</div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

const Props = Vue.extend({
    props: {
        name: {
            type: String,
            default: ''
        },
        imgSrc: {
            type: String,
            default: ''
        },
        desc: {
            type: String,
            default: ''
        },
        expired: {
            type: String,
            default: ''
        },
        count: {
            type: [String, Number],
            default: 0
        }
    }
})

@Component
export default class SchemePack extends Props {

}
</script>

<style module lang="scss">

.scheme-pack {
    display: inline-block;
    border-radius: 10px;
    background-color: #F5F6FA;
    transition: 0.5s;
    &:hover {
        cursor: pointer;
        transform: translate3d(0, -6px, 0);
        box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    }
    > .content {
        display: flex;
        box-sizing: border-box;
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
                width: 100%;
                > .name {
                    margin-bottom: 4px;
                    vertical-align: bottom;
                    font-size: 14px;
                    color: #333333;
                }
                > .tab {
                    display: inline-block;
                    line-height: 14px;
                    padding: 3px;
                    box-sizing: border-box;
                    margin-left: 6px;
                    border: 1px solid #F79F1A;
                    border-radius: 2px;
                    font-size: 8px;
                    color: #F79F1A;
                }
            }
            > .desc {
                font-size: 12px;
                color: #999999;
            }
        }
    }
    > .tip {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        border-top: 1px solid #E7E7E7;
        padding: 10px 20px;
        font-size: 10px;
        color: #6E7B8E;
    }
}

</style>
