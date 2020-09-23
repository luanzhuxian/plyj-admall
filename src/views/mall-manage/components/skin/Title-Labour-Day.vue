<template>
    <div :class="$style.titleLabourDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleLabourDay extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-labour-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/labour-day/title.png') no-repeat center;
    background-size: auto 100%;
    ::before {
        position: absolute;
        top: 8px;
        left: -35px;
        content: '';
        width: 29px;
        height: 13.5px;
        background: url('https://mallcdn.youpenglai.com/static/admall/skin/labour-day/title-left.png') no-repeat center;
        background-size: 100%;
    }
    ::after {
        position: absolute;
        top: 8px;
        right: -35px;
        content: '';
        width: 29px;
        height: 13.5px;
        background: url('https://mallcdn.youpenglai.com/static/admall/skin/labour-day/title-right.png') no-repeat center;
        background-size: 100%;
    }
    .title {
        position: relative;
        max-width: 155px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #792a1d;
    }
}

</style>
