<template>
    <div :class="$style.schemeLabel">
        <div :class="$style.label" v-text="name" />
        <div :class="$style.content" v-text="content" />
    </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'

const Props = Vue.extend({
    props: {
        name: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        }
    }
})

@Component
export default class SchemeLabel extends Props {

}
</script>

<style module lang="scss">

.scheme-label {
    display: flex;
    align-items: flex-end;
    font-size: 12px;
    color: #999999;
    background-color: #fff;
    > .label {
        font-size: 16px;
        margin-right: 10px;
        font-weight: bold;
        color: #333333;
    }
}

</style>
