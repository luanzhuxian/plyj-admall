<template>
    <div :class="$style.titleDouble12">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleDouble12 extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-double-12 {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/double-12/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        max-width: 100px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        color: #D12C19;
    }
}

</style>
