<template>
    <div :class="$style.titleMidAutumnFestival">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleAutumnFestival extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-mid-autumn-festival {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 57px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        top: 5px;
        left: 15px;
        max-width: 100px;
        text-align: center;
        font-size: 18px;
        font-family: Microsoft YaHei;
        color:#D96B20;
    }
}

</style>
