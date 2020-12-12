<template>
    <div :class="$style.titleWelcomeNew">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleWelcomeNew extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-welcome-new {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 47px;
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/welcome-new/title.png) no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        top: 2.5px;
        max-width: 100px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
    }
}

</style>
