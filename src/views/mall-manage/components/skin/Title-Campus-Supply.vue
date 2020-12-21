<template>
    <div :class="$style.titleCampusSupply" class="title-campus-supply">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleCampusSupply extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-campus-supply {
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
.title-campus-supply-1 {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/campus-supply/title-1.jpg) no-repeat center;
    background-size: 375px 62px;
    > div {
        top: 2px;
    }
}
.title-campus-supply-2 {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/campus-supply/title-2.jpg) no-repeat center;
    background-size: 375px 62px;
    > div {
        top: 2px;
    }
}
.title-campus-supply-3 {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/campus-supply/title-3.jpg) no-repeat center;
    background-size: 375px 62px;
    > div {
        top: 2px;
    }
}
</style>
