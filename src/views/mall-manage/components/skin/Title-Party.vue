<template>
    <div :class="$style.titleParty">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleParty extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-party {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/party/title.png) no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        top: 4px;
        max-width: 100px;
        text-align: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        color: #FB712B;
    }
}

</style>
