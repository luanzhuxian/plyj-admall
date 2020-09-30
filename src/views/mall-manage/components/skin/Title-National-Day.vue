<template>
    <div :class="$style.titleNationalDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleNationalDay extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-national-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/national-day/title.png') no-repeat center;
    background-size: 100%;
    .title {
        position: relative;
        top: -5px;
        max-width: 200px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #BA0909;
    }
}

</style>
