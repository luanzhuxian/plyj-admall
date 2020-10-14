<template>
    <div :class="$style.liveRoom">
        <div :class="$style.label">
            <div>{{ data.roomName }}</div>
            <div :class="$style.status" :style="{ '--color': data.isLive ? '#F79F1A' : '#2DCA72' }">
                {{ data.isLive ? '已预约' : '空闲中' }}
            </div>
        </div>
        <div :class="$style.liveInfo">
            <div :class="$style.roomNum">
                <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/小摄像头.png" alt="">
                <span>房间号 {{ data.roomId }}</span>
            </div>
            <div :class="$style.password">
                <span>密码</span>
                <span style="margin: 0 10px;">{{ showPassword ? data.roomPasswd : '******' }}</span>
                <pl-svg style="cursor: pointer;" v-show="!showPassword" name="icon-eye-open" width="14" @click.stop="showPassword = true" />
                <pl-svg style="cursor: pointer;" v-show="showPassword" name="icon-eye-close" width="14" @click.stop="showPassword = false" />
            </div>
        </div>
        <div :class="$style.address">
            <div>推流地址 rtmp://...</div>
            <div :class="$style.copy" @click="copyUrl">复制</div>
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

import { getRoomInfoById } from './../../../../../../apis/product-center/online-teaching/live'

@Component
export default class LiveRoom extends Vue {
    @Prop({
        type: Object,
        default: () => ({ roomId: '' })
    }) data!: object

    showPassword = false

    private async copyUrl () {
        try {
            const { roomId }: any = this.data
            const { result: { url } } = await getRoomInfoById(roomId)
            await navigator.clipboard.writeText(url)
            this.$success('复制成功')
        } catch (e) {
            this.$warning('复制失败')
            throw e
        }
    }
}
</script>

<style lang='scss' module>

.live-room {
    width: 360px;
    padding: 20px;
    border: 1px solid #E7E7E7;
    border-radius: 10px;
    background: #FFFFFF;
    > .label {
        display: flex;
        justify-content: space-between;
        > .status {
            color: var(--color);
            &:before {
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-right: 4px;
                border-radius: 50%;
                background-color: var(--color);
                content: "";
            }
        }
    }
    > .live-info {
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 10px;
        border: 1px dashed #E7E7E7;
        border-radius: 4px;
        > .room-num {
            display: flex;
            align-items: center;
        }
        > .password {
            margin-left: 20px;
        }
    }
    > .address {
        display: flex;
        justify-content: space-between;
        color: #6E7B8E;
        > .copy {
            color: #4F63FF;
            cursor: pointer;
        }
    }
}

</style>
