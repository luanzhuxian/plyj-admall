<template>
    <!-- 此组件仅仅提供左右布局， 布局内部详细样式需要自己去写，右侧提供上下布局，或者不使用上下布局 -->
    <div class="card">
        <div class="left">
            <slot name="left" />
        </div>
        <div class="right">
            <slot name="right" />
            <div class="right-top">
                <slot name="right-top" />
            </div>
            <div class="right-bottom">
                <slot name="right-bottom" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card'
}
</script>

<style scoped lang="scss">
  /*@import "../../styles/config";*/
  .card {
    display: flex;
  }
  .right {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 16px;
    padding: 5px 0;
  }
  .right-top {
    display: inline-flex;
    align-items: center;
  }
  .right-bottom {
    font-size: 12px;
  }
</style>
