<template>
    <div :class="$style.data">
        <div v-if="title" v-text="title" />
        <div :class="$style.dataList">
            <div
                :class="$style.item"
                v-for="(item, i) of dataList"
                :key="i"
            >
                <span v-text="item.title" />
                <el-tooltip
                    v-if="item.tooltip"
                    effect="dark"
                    :content="item.tooltip"
                    placement="top-start"
                >
                    <i class="el-icon-info" />
                </el-tooltip>
                <strong v-text="item.data" />
                <div v-if="item.tip" :class="$style.tip" v-html="item.tip" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
type dataList = {
    title: string;
    tooltip?: string;
    data: number;
    tip?: string;
}
@Component
export default class MemberDataBar extends Vue {
    @Prop({ type: String }) title!: string
    @Prop({ type: Array }) dataList!: dataList[]
}
</script>

<style module lang="scss">
    .data {
        width: max-content;
        font-size: 16px;
        margin-top: 8px;
        .data-list {
            display: grid;
            grid-template-columns: repeat(4, auto);
            grid-column-gap: 196px;
            margin: 16px 0 33px;
            padding-left: 80px;
            > .item {
                > strong {
                    display: block;
                    line-height: 60px;
                    font-size: 48px;
                }
                > .tip {
                    margin-top: 10px;
                    color: #999;
                }
            }
        }
    }
</style>
