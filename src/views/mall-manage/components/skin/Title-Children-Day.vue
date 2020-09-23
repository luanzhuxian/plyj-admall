<template>
    <div :class="$style.titleChildrenDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleChildrenDay extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-children-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 65px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/children-day/title.png') no-repeat center bottom;
    background-size: 200px auto;
    .title {
        position: relative;
        top: 3px;
        max-width: 155px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #4ccacf;
    }
}

</style>
