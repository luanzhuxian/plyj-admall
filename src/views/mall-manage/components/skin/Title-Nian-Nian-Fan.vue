<template>
    <div :class="$style.titleNianNianFan">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleNianNianFan extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-nian-nian-fan {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/title.png') no-repeat center bottom;
    background-size: 297px auto;
    .title {
        position: relative;
        top: 2px;
        max-width: 155px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
