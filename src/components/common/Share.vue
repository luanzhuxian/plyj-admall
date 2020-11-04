<template>
    <el-dialog
        :visible="show"
        title="分享"
        width="720px"
        @close="close"
        @closed="closed"
    >
        <el-form label-width="auto" label-position="right">
            <el-form-item label="分享链接：">
                <el-input :value="localUrl" readonly class="input" style="width: 300px;" />
                <el-button type="primary" v-clipboard:copy="localUrl" v-clipboard:success="onCopy" v-clipboard:error="onError" style="width:140px;">
                    复制
                </el-button>
            </el-form-item>
            <el-form-item style="margin-top: 20px" :label="qrcodeImageName">
                <div class="qrcode-box">
                    <img :src="qrcode" alt="二维码">
                </div>
                用微信扫描二维码，可直接分享给好友<br>
                <a :href="qrcode" :download="`${qrcodeImageName}.png`" class="download">下载二维码</a>
            </el-form-item>
            <!-- 口令插槽 -->
            <slot name="liveWord" />
        </el-form>
    </el-dialog>
</template>

<script>
import { generateQrcode } from '../../assets/ts/utils'
import qs from 'qs'
export default {
    data () {
        return {
            qrcode: '',
            localUrl: ''
        }
    },
    watch: {
        show: {
            handler (val) {
                if (val) this.generateQrcode()
            },
            immediate: true
        }
    },
    props: {
        qrcodeText: {
            type: String,
            default: '',
            required: true
        },
        qrcodeImageName: {
            type: String,
            default: '活动二维码'
        },
        // 二维码中心的缩略图
        thumbnail: {
            type: String,
            default: ''
        },
        show: Boolean
    },
    methods: {
    // 生成二维码
        async generateQrcode () {
            const search = qs.parse(this.qrcodeText.split('?')[1])
            const url = this.qrcodeText.split('?')[0]
            search.t = Date.now()
            qs.stringify(search)
            this.localUrl = `${ url }?${ qs.stringify(search) }`
            this.qrcode = await generateQrcode({
                size: 400,
                text: this.localUrl,
                image: this.thumbnail,
                centerPadding: 4
            })
        },
        // 复制成功
        onCopy () {
            this.$success('复制成功')
        },
        // 复制失败
        onError () {
            this.$warning('复制失败')
        },
        close () {
            this.$emit('update:show', false)
            this.$emit('close')
        },
        closed () {
            this.qrcode = ''
        }
    }
}
</script>

<style scoped lang="scss">
.input {
    width: 300px;margin-right: 20px;
}
.qrcode-box {
  float: left;
  margin-right: 140px;
  width: 180px;
  height: 180px;
  padding: 10px;
  border: 1px dashed #888;
  img{
    width: 100%;
    box-sizing: border-box;
    object-fit: contain;
  }
}
.download {
    display: inline-block;
    width: 140px;
    height: 34px;
    line-height: 34px;
    background-color: #4F63FF;
    border: 1px solid #4F63FF;
    color: #fff;
    text-align: center;
}

</style>
