<template>
    <el-dialog :visible="show"
               width="1400px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
    >
        <div class="example">
            <div v-for="(item, k) in data" :key="k">
                <div class="img" :style="{background: 'url('+ item.url +')'}">
                    <img :src="qrCodeUrl" class="qr-code-url" v-if="k === 3">
                </div>
                <div class="text">
                    {{ item.text }}
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'Preview',
    props: {
        show: Boolean,
        qrCodeUrl: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            data: [{ url: 'https://mallcdn.youpenglai.com/static/admall/2.11.1/mp-preview-1.png', text: '商城首页' },
                { url: 'https://mallcdn.youpenglai.com/static/admall/2.11.1/mp-preview-2.png', text: '商品详情页底部' },
                { url: 'https://mallcdn.youpenglai.com/static/admall/2.11.1/mp-preview-3.png', text: '直播界面' },
                { url: 'https://mallcdn.youpenglai.com/static/admall/2.11.1/mp-preview-4.png', text: '关注公众号弹框' }]
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.example{
  display: flex;
  justify-content: space-between;
  padding: 40px;
  .img{
    width: 290px;
    height: 516px;
    background-size: 100% 100%;
    position: relative;
  }
  .qr-code-url{
    position: absolute;
    top: 247px;
    left: 101px;
    width: 90px;
    height: 90px;
  }
  .text{
    margin-top: 20px;
    color: #333;
    text-align: center;
    font-weight: bold;
  }
}
</style>
