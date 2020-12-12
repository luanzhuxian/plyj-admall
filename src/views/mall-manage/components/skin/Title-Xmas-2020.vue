<template>
    <div :class="$style.titleXmas2020" class="title-xmas-2020">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleXmas2020 extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-xmas-2020 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 62px;
    .title {
        position: relative;
        max-width: 100px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        color: #fff;
    }
}
</style>

<style lang="scss">
.title-xmas-2020-man {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/xmas-2020/title-man.png) no-repeat center;
    background-size: 375px 62px;
    > div {
        top: 2px;
    }
}
.title-xmas-2020-deer {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/xmas-2020/title-deer.png) no-repeat center;
    background-size: 375px 62px;
    > div {
        top: 6px;
    }
}
.title-xmas-2020-penguin {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/xmas-2020/title-penguin.png) no-repeat center;
    background-size: 375px 62px;
    > div {
        top: 4px;
    }
}
</style>
