<template>
    <div :class="$style.livePack">
        <div :class="$style.head">
            <div :class="$style.roomNum">房间号 {{ data.roomId }}</div>
            <div :class="$style.roomPassword">
                <span>密码 *****</span>
                <el-popover
                    placement="left"
                    trigger="click"
                    :popper-class="$style.liveInfo"
                    @show="getRoomInfo"
                >
                    <ul :class="$style.roomInfo">
                        <li :class="$style.infoItem">
                            <label>房间名称</label>
                            <span>{{ row.roomName }}</span>
                        </li>
                        <li :class="$style.infoItem">
                            <label>房间号</label>
                            <span>{{ row.roomId }}</span>
                        </li>
                        <li :class="$style.infoItem">
                            <label>密码</label>
                            <span>{{ row.password }}</span>
                        </li>
                        <li :class="$style.infoItem">
                            <label>推流地址</label>
                            <span>{{ row.url }}</span>
                            <el-button v-clipboard:copy="row.url" v-clipboard:success="copyUrl" type="text" size="mini">
                                复制地址
                            </el-button>
                        </li>
                    </ul>
                    <pl-svg style="cursor: pointer; margin-left: 18px; vertical-align: revert" slot="reference" name="icon-eye-open" width="14" />
                </el-popover>
            </div>
            <div :class="$style.streamAddress">推流地址 rtmp://...</div>
            <div :class="$style.liveStatus" :style="{ '--color': data.liveStatus === 'LIVING' ? '#4F63FF' : '#F79F1A' }">直播中</div>
        </div>
        <div :class="$style.content">
            <img :class="$style.img" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/营销中心-banner.png" alt="">
            <div :class="$style.detail">
                <div :class="$style.specific">
                    <div :class="$style.title">{{ data.name }}</div>
                    <div :class="$style.roomInfo">
                        <div :class="$style.roomName">直播房间：{{ data.roomName }}</div>
                        <div :class="$style.teacher" v-if="data.lecturerName">主讲人：{{ data.lecturerName }}</div>
                    </div>
                    <div :class="$style.liveTime">时间：{{ data.liveStartTime }}</div>
                </div>
                <div :class="$style.control">
                    <div :class="$style.btn" @click="$router.push({ name: 'LiveDetail', params: { id: data.id } })">直播详情</div>
                    <div :class="$style.btn" @click="$router.push({ name: 'WatchDetail', params: { id: data.id, liveMode: data.liveMode === 'public' ? '1' : '2' } })">数据查看</div>
                    <!--只有私享课可以添加学员-->
                    <div :class="$style.btn" @click="$emit('add-student', data)" v-if="data.liveMode === 'private'">添加学员</div>
                    <!--收费的直播才可送课-->
                    <div :class="$style.btn" @click="$emit('give-class', data)" v-if="data.paidAmount">送课</div>
                    <div :class="$style.btn" @click="$emit('close-live', data)" v-if="data.status === 'LIVING'">关闭直播</div>
                    <div :class="$style.btn" @click="$emit('remove-live', data)" v-if="data.status === 'READY_START'">删除直播</div>
                    <div :class="$style.btn" @click="$emit('share', data)">分享</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

import { getRoomInfoById } from './../../../../../../apis/product-center/online-teaching/live'

export interface LiveData {
    id: string;
    roomId: number | string;
    name: string;
    roomName: string;
    roomToken: number;
    liveStatus: ('LIVING' | 'READY_START');
}

@Component
export default class LivePack extends Vue {
    @Prop(Object) readonly data!: LiveData

    row = {
        roomName: this.data.roomName,
        roomId: this.data.roomId,
        password: '',
        url: ''
    }

    private async getRoomInfo () {
        const { result }: any = await getRoomInfoById(this.data.roomId)
        this.row.password = result.password
        this.row.url = result.url
    }

    private copyUrl () {
        this.$success('复制成功')
    }
}
</script>

<style lang='scss' module>

.live-pack {
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #e7e7e7;
    border-radius: 10px;
    background-color: #fff;
    > .head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        > .room-num,
        .room-password {
            font-size: 16px;
            font-weight: 600;
        }
        > .room-password {
            //
        }
        > .stream-address {
            font-size: 14px;
            color: #6e7b8e;
            cursor: pointer;
        }
        > .live-status {
            color: var(--color);
            &:before {
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-right: 4px;
                border-radius: 50%;
                background-color: var(--color);
                content: '';
            }
        }
    }
    > .content {
        display: flex;
        justify-content: space-between;
        > .img {
            width: 140px;
            height: 106px;
            border-radius: 10px;
        }
        > .detail {
            display: flex;
            align-content: space-between;
            flex-wrap: wrap;
            width: calc(100% - 156px);
            > .specific {
                width: 100%;
                color: #999;
                > .title {
                    font-weight: 600;
                    color: #333;
                }
                > .room-info {
                    display: flex;
                    margin: 4px 0;
                    > .room-name {
                        margin-right: 36px;
                    }
                }
            }
            > .control {
                display: flex;
                width: 100%;
                color: #6e7b8e;
                > .btn {
                    &:hover {
                        color: #4f63ff;
                        cursor: pointer;
                    }
                    &:nth-of-type(n + 2):before {
                        display: inline-block;
                        margin: 0 10px;
                        content: '|';
                        cursor: auto;
                    }
                }
            }
        }
    }
}
.live-info {
    .room-info {
        > .info-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 12px;
            > label {
                display: inline-block;
                width: 68px;
            }
            &:nth-last-of-type(1) {
                margin: -7px 0 0 0;
                > span {
                    display: inline-block;
                    width: 120px;
                    margin-right: 35px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}

</style>
