<template>
    <div class="activity">
        <div
            class="item large"
            :style="{
                background,
                boxShadow
            }"
        >
            <div class="info">
                <div class="sub">
                    翻开记忆的味道
                </div>
                <PlSvg name="icon-nianwei" width="132" height="27" />
                <div class="btn">
                    立即参加
                </div>
            </div>
            <div class="img-wrapper">
                <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/61795ee4-ca67-49c5-b5c2-d3f8769e98dc.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Activity',
    props: {
        background: {
            type: String,
            default: '#FFF'
        },
        boxShadow: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
  .activity {
    display: flex;
    justify-content: space-between;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .item {
    box-sizing: border-box;
    border-radius: 10px;
    &.large {
      &.item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 35px 20px 22px;
        width: 100%;
        height: 134px;
      }
      .img-wrapper {
        width: 88px;
        height: 88px;
        overflow: hidden;
      }
      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .sub {
        margin-bottom: 4px;
        font-size: 12px;
        font-family: PingFang SC;
        color: #B48A64;
      }
      .btn {
        position: relative;
        margin-top: 14px;
        width: 116px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: linear-gradient(180deg, #FB873A 0%, #F64C1B 100%);
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        color: #FFFFFF;
        &:after {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          content: '';
          width: 0;
          height: 0;
          border-width: 5px;
          border-color: transparent transparent transparent #FFFFFF;
          border-style: solid;
          border-radius: 2px;
        }
      }
    }
  }
</style>
