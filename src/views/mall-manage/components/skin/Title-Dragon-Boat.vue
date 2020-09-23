<template>
    <div :class="$style.titleDragonBoat">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleDragonBoat extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-dragon-boat {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 55px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/title.png') no-repeat center;
    background-size: auto 55px;
    .title {
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
