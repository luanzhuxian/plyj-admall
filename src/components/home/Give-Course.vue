<template>
    <el-dialog
        :visible="show"
        :title="title"
        width="580px"
        :modal-append-to-body="false"
        :close-on-press-escape="false"
        @close="close"
    >
        <ul :class="$style.relateCourse">
            <li v-for="(item, index) in list" :key="index">
                <div :class="$style.course">
                    <div :class="$style.courseImg">
                        <span :class="$style.tag">
                            {{ item.courseType === 1 ? '单课程' : '系列课' }}
                        </span>
                        <img :src="item.courseImg || 'https://mallcdn.youpenglai.com/static/plmall/videoDefaul.jpg'">
                    </div>
                    <div>
                        <div :class="$style.name">
                            {{ item.courseName }}
                        </div>
                        <div :class="$style.type">
                            <template v-if="item.expirationDate">
                                请于 {{ item.expirationDate }} 前授权使用
                            </template>
                            <template v-else>
                                授权后 {{ item.expirationDay }} 天内可使用
                            </template>
                        </div>
                        <div :class="$style.price">
                            免费
                        </div>
                    </div>
                </div>
                <el-button @click="target(item)" :class="$style.btn" type="primary">
                    立即授权
                </el-button>
            </li>
        </ul>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { getRoomStatus } from '../../apis/product-center/online-teaching/live'
@Component
export default class GiveCourse extends Vue {
    @Prop({ type: Array, default: [] }) list!: DynamicObject[]
    @Prop({ type: Boolean }) show!: boolean

    get title () {
        return `您有 ${ this.list.length } 个赠送资源课程待授权，立即免费授权！`
    }

    // methods
    close () {
        this.$emit('update:show', false)
    }

    async noPromission () {
        try {
            const { result } = await getRoomStatus()
            // 为 3 未开通直播, 先购买房间
            return result.enable === 3
        } catch (e) { throw e }
    }

    async target (item: DynamicObject) {
        this.close()
        try {
            const noPromission = await this.noPromission()
            if (noPromission) {
                return this.$router.push({ name: 'LineTeaching' })
            }
            this.$router.push({
                name: 'VideoRepositoryBuyNow',
                params: {
                    id: item.courseId
                },
                query: {
                    isFirstBuy: '1',
                    giveRecordId: item.id
                }
            })
        } catch (e) { throw e }
    }
}
</script>

<style module lang="scss">
    .relateCourse {
        box-sizing: border-box;
        max-height: 320px;
        padding: 16px;
        overflow-y: auto;
        background-color: #f8f8f8;
        > li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #ddd;
            > .course {
                display: flex;
                > .courseImg {
                    position: relative;
                    margin-right: 12px;
                    > img {
                        width: 90px;
                        height: 60px;
                    }
                    > .tag {
                        position: absolute;
                        left: 0;
                        top: 0;
                        padding: 0 4px;
                        color: red;
                        background-color: rgb(239, 224, 195);
                    }
                }
                > div {
                    display: flex;
                    flex-wrap: wrap;
                    align-content: space-between;
                    height: 60px;
                    font-size: 12px;
                    > div {
                        width: 100%;
                        line-height: 16px;
                    }
                    > .name {
                        font-size: 14px;
                        color: #333;
                    }
                    > .type {
                        color: #999;
                    }
                    > .price {
                        color: #ec742e;
                    }
                }
            }
            > .btn {
                height: 34px;
            }
        }
        > li:nth-last-of-type(1) {
            margin-bottom: 0;
            padding-bottom: 0;
            border: 0;
        }
    }
    .footer {
        padding-top: 42px;
        text-align: center;
    }
</style>
