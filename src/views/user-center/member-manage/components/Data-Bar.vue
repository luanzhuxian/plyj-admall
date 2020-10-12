<template>
    <div :class="$style.data">
        <div v-text="title" />
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
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class MemberDataBar extends Vue {
    @Prop({ type: String }) title!: string
    @Prop({ type: Array }) dataList!: any[]
}
</script>

<style module lang="scss">
    .data {
        width: max-content;
        font-size: 16px;
        margin-top: 8px;
        .data-list {
            display: grid;
            grid-template-columns: repeat(3, auto);
            grid-column-gap: 196px;
            margin: 11px 0 33px;
            padding-left: 80px;
            > .item {
                > strong {
                    display: block;
                    line-height: 60px;
                    font-size: 48px;
                }
            }
        }
    }
</style>
