<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="公众号增粉"
    >
        <div class="setting">
            <div class="tips">
                【公众号增粉】可以在商城端显示您的公众号二维码，访问商城的用户可以长按识别二维码关注您的公众号，达到公众号粉丝引流的作用。
            </div>
            <div class="setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                1.点击【新建活动】，上传公众号二维码，选择要在商城展示的区域，设置好引导话术后保存，【开启】即可。<br>
                2.新建活动时，您可以预览活动在商城中的显示样子，以便您更好的设置引导话术。<br>
                3.如果您有多个公众号，可以新建多个活动，并在打算做引流前，开启相应的活动。此时，商城里面显示的就是您开启的这个活动的公众号二维码。
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button round type="primary" @click="close">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'NewcomersSetting',
    props: {
        show: Boolean
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog__header{
    border-bottom: 1px solid #E7E7E7;
  }
  .setting {
    height: 300px;
    overflow-y: auto;
    padding: 0 4px;
    font-size: 14px;
    .tips {
      font-weight: bold;
      margin-top: 30px;
      line-height: 28px;
    }
    .setting-title {
      display: flex;
      align-items: center;
      font-weight: bold;
      margin-top: 30px;
      margin-bottom: 10px;
      .line{
        width: 2px;
        height: 12px;
        background: #4F63FF;
        margin-right: 10px;
      }
    }
    .text {
      line-height: 28px;
      margin-left: 12px;
      .blue{
        color: #4F63FF;
      }
    }
  }
  .dialog-footer {
      text-align: center;
  }
</style>
