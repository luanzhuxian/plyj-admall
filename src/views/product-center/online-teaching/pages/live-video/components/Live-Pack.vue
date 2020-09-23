<template>
    <div :class="$style.livePack">
        <div :class="$style.head">
            <div :class="$style.roomNum">房间号 898999</div>
            <div :class="$style.roomPassword">
                <span>密码 *****</span>
                <span>眼睛 </span>
            </div>
            <div :class="$style.streamAddress">推流地址 http://4544544654</div>
            <div :class="$style.liveStatus" :style="{ '--color': 'pink' }">直播中</div>
        </div>
        <div :class="$style.content">
            <img :class="$style.img" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/营销中心-banner.png" alt="">
            <div :class="$style.detail">
                <div :class="$style.specific">
                    <div :class="$style.title">开学啦！孩子们</div>
                    <div :class="$style.roomInfo">
                        <div :class="$style.roomName">直播房间：宋老师专用房间..</div>
                        <div :class="$style.teacher">主讲人：周杰伦</div>
                    </div>
                    <div :class="$style.liveTime">时间：2020.09.03 12:30:23</div>
                </div>
                <div :class="$style.control">
                    <div :class="$style.btn">直播详情</div>
                    <div :class="$style.btn">数据查看</div>
                    <div :class="$style.btn">送课</div>
                    <div :class="$style.btn">关闭直播</div>
                    <div :class="$style.btn">分享</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class LivePack extends Vue {

}
</script>

<style lang='scss' module>

.live-pack {
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #e7e7e7;
    border-radius: 10px;
    background-color: #fff;
    cursor: pointer;
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
                    cursor: pointer;
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

</style>
