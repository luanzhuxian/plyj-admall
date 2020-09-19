<template>
    <div class="propagate">
        <div class="label">
            <span>了解我们</span>
        </div>
        <div class="info">
            <div class="name" v-text="data.values[0].mallName" />
            <p
                class="intro"
                v-if="data.values[0].mallDesc"
                v-text="data.values[0].mallDesc"
            />
        </div>
        <div class="img-wrapper">
            <img
                v-if="data.values[0].mallLogo"
                :src="data.values[0].mallLogo + '?x-oss-process=style/thum-small'"
            >
        </div>
    </div>
</template>

<script>
export default {
    name: 'Propagate',
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.propagate {
  box-sizing: border-box;
  position: relative;
  display: flex;
  padding: 16px 12px;
  height: 155px;
  background: #FFFAE6;
  box-shadow: 0px 8px 12px rgba(121, 30, 5, 0.2);
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .label {
    position: absolute;
    top: 12px;
    left: 0;
    width: 76px;
    height: 25px;
    background: #FF903F;
    border-radius: 0px 50px 50px 0px;
    font-size: 12px;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    &:after {
      margin-left: 3px;
      content: '';
      width: 0;
      height: 0;
      border-width: 4px;
      border-color: transparent transparent transparent #FFFFFF;
      border-style: solid;
      border-radius: 2px;
    }
  }
  .info {
    flex: 1;
    width: 0;
    padding-top: 33px;
  }
  .name {
    font-size: 16px;
    font-weight: bold;
    line-height: 17px;
    color: #000000;
    @include elps();
  }
  .intro {
    margin-top: 6px;
    font-size: 12px;
    line-height: 17px;
    color: #666666;
    @include elps-wrap(3);
  }
  .img-wrapper {
    position: relative;
    margin-left: 14px;
    width: 110px;
    height: 110px;
    &:before {
      position: absolute;
      top: 2px;
      bottom: -2px;
      left: 0;
      transform: translateX(-100%) skewY(-45deg);
      content: '';
      width: 4px;
      background: #F6511E;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
    &:after {
      position: absolute;
      right: 2px;
      left: -2px;
      bottom: 0;
      transform: translateY(100%) skewX(-45deg);
      content: '';
      height: 4px;
      background: #FA7D34;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
}
</style>
