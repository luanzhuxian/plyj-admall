<template>
    <div :class="$style.titleGoodCourse">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleGoodCourse extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-good-course {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 47px;
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/good-course/title.png) no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        max-width: 100px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        color: #F33C45;
    }
}

</style>
