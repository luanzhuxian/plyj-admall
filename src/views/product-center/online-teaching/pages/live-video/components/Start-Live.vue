<template>
    <el-dialog
        :visible="show"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="578px"
    >
        <div slot="title">
            <pl-svg style="vertical-align: -8px;" class="mr-10" name="icon-jinggao" width="32" fill="#fd5a63" />
            <span class="fz-18 font-weight-bold">您创建的是{{ isLive?'实时':'录播' }}直播</span>
        </div>
        <div style="padding-left: 74px; line-height: 20px;">
            <div class="mb-20 gray-2">
                <p class="font-weight-bold" v-if="isLive">
                    请用房间号：{{ roomId }}和密码：{{ roomPassword }}登录直播工具进行直播；
                    <br>
                    请确认您是否已下载直播工具
                </p>
                <p class="font-weight-bold" v-else>
                    直播时间开始后，将自动播放您上传录播视频；
                    <br>
                    您可登录直播工具，实时查看评论，并进行在线互动。
                    <br>
                    请确认您是否已下载直播工具
                </p>
            </div>
            <div class="mb-20 gray-2">
                <p class="font-weight-bold">
                    1.已下载
                </p>
                <p class="fz-12">
                    您已下载直播pc端或手机端app的直播工具
                </p>
                <p class="fz-12">
                    您可直接使用房间号和密码登录，开始进行直播内容的准备，上传直播课件等；
                </p>
            </div>
            <div class="mb-20 gray-2">
                <p class="font-weight-bold">
                    2.未下载
                </p>
                <p class="fz-12">
                    您还未下载直播pc端或手机端app的直播工具
                </p>
                <p class="fz-12">
                    请先下载直播工具后，开始进行直播；
                </p>
            </div>
            <div :class="$style.download">
                <div :class="$style.qrcode">
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.1.0/QR-code.png" alt="">
                    <span>安卓扫码下载</span>
                </div>
                <div :class="$style.apps">
                    <a href="https://mallcdn.youpenglai.com/static/download/PengLai-Live-Setup.exe" download="PengLai-Live-Setup.exe">
                        <pl-svg name="icon-pc" width="18" fill="#999" />
                        <span>PC版</span>
                    </a>
                    <a href="https://mallcdn.youpenglai.com/static/download/%E6%9C%8B%E6%9D%A5%E9%9B%85%E9%9B%86%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.apk">
                        <pl-svg name="icon-Android" width="18" fill="#999" />
                        <span>安卓版</span>
                    </a>
                    <el-tooltip class="item" effect="dark" content="敬请期待" placement="bottom-end">
                        <a>
                            <pl-svg name="icon-Apple" width="18" fill="#999" />
                            <span>苹果版</span>
                        </a>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <p style="text-align: center;margin-top: 54px;">
            <el-button type="primary" size="middle" @click="close" round>
                我知道了
            </el-button>
        </p>
    </el-dialog>
</template>

<script>
import { getRoomInfoById } from './../../../../../../apis/product-center/online-teaching/live'
export default {
    name: 'StartLive',
    components: {
    },
    props: {
        show: Boolean,
        liveId: {
            type: String,
            default: ''
        },
        roomId: {
            type: [String, Number],
            default: ''
        },
        isLive: {// 直播-true, 录播-false
            type: Boolean,
            default: false
        }
    },
    watch: {
        show: {
            async handler (val) {
                if (val) {
                    await this.getLiveRoomInfo()
                }
            },
            immediate: true
        }
    },
    data () {
        return {
            roomPassword: ''
        }
    },
    methods: {
        async getLiveRoomInfo () {
            try {
                const { result } = await getRoomInfoById(this.roomId)
                this.roomPassword = result.password
            } catch (e) {
                throw e
            }
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module lang="scss">
.download {
    position: relative;
    display: flex;
    margin-top: 30px;
    &:after {
        position: absolute;
        left: -6px;
        top: -6px;
        content: '';
        width: 20px;
        height: 20px;
        border-top: 1px solid #598bf8;
        border-left: 1px solid #598bf8;
    }
    &:before {
        position: absolute;
        left: -6px;
        bottom: -6px;
        content: '';
        width: 20px;
        height: 20px;
        border-bottom: 1px solid #598bf8;
        border-left: 1px solid #598bf8;
    }
    .qrcode {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px;
        background-color: #ececec;
        &:after {
            position: absolute;
            right: -6px;
            top: -6px;
            content: '';
            width: 20px;
            height: 20px;
            border-top: 1px solid #598bf8;
            border-right: 1px solid #598bf8;
        }
        &:before {
            position: absolute;
            right: -6px;
            bottom: -6px;
            content: '';
            width: 20px;
            height: 20px;
            border-bottom: 1px solid #598bf8;
            border-right: 1px solid #598bf8;
        }
        > img {
            width: 156px;
            height: 156px;
            padding: 10px;
            background-color: #fffeff;
            box-sizing: border-box;
            border: 1px dashed #888;
        }
        > span {
            position: absolute;
            bottom: -24px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #999;
        }
    }
    .apps {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 32px;
        > a {
            width: 144px;
            margin-bottom: 16px;
            border: 1px solid #999;
            line-height: 34px;
            text-align: center;
            font-size: 16px;
            color: #999;
            border-radius: 18px;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
            &:nth-of-type(3) {
                color: #ccc;
                background-color: #eee;
                cursor: not-allowed;
            }
            > svg {
                margin-right: 6px;
                vertical-align: -4px;
            }
        }
    }
}

</style>
