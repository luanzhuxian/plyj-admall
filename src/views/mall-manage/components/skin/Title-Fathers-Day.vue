<template>
    <div :class="$style.titleFathersDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleFathersDay extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-fathers-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/title.png') no-repeat center;
    background-size: 288px 35px;
    .title {
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
