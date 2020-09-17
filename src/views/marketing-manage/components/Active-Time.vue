<template>
    <div :class="$style.activeTime">
        <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />
        {{ title }}：{{ time }}
    </div>
</template>

<script>
export default {
    name: 'ActiveTime',
    props: {
        time: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style module lang="scss">
  .activeTime {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 10px;
    border: 1px solid #ccc;
    color: #666;
    border-radius: 14px;
  }
</style>
