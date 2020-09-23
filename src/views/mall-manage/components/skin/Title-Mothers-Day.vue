<template>
    <div :class="$style.titleMothersDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleMothersDay extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-mothers-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 67px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/title.png') no-repeat center bottom;
    background-size: 300px auto;
    .title {
        position: relative;
        top: 6px;
        max-width: 155px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
