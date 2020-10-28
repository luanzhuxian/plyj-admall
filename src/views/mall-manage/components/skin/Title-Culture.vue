<template>
    <div :class="$style.titleCulture">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleCulture extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-culture {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 55px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/culture/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        left: 5px;
        max-width: 100px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
    }
}

</style>
