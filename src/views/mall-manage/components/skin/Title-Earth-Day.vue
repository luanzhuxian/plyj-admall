<template>
    <div :class="$style.titleEarthDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleEarthDay extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-earth-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/earth-day/title.png') no-repeat center bottom;
    background-size: 300px auto;
    .title {
        position: relative;
        top: 9px;
        max-width: 155px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
