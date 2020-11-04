<template>
    <div
        class="double-12-panel"
        :class="[customClass]"
        :style="{
            '--title-bg-color': titleBgColor
        }"
    >
        <slot name="title">
            <div class="double-12-panel-title">
                <span v-text="title" />
            </div>
        </slot>

        <template v-if="subtitle || $slots.subtitle || $scopedSlots.subtitle">
            <slot name="subtitle">
                <div class="double-12-panel-subtitle">
                    <span v-text="subtitle" />
                </div>
            </slot>
        </template>

        <div class="double-12-panel-container">
            <slot />

            <template v-if="!hideButton">
                <slot name="button">
                    <button class="double-12-panel-button" v-text="button" @click="handleClick" />
                </slot>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class Double12Panel extends Vue {
    /* props */
    @Prop(String) readonly customClass!: string
    @Prop(String) readonly title!: string
    @Prop(String) readonly subtitle!: string
    @Prop(String) readonly titleBgColor!: string
    @Prop(Boolean) readonly hideButton!: boolean
    @Prop({
        type: String,
        default: '点击查看更多'
    }) readonly button!: string

    /* methods */
    @Emit('click')
    handleClick (data: any) {
        return data
    }
}
</script>

<style lang="scss">
.double-12-panel {
    position: relative;
    &-title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin: 0 auto;
        padding-bottom: 2px;
        width: 259px;
        height: 41px;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/title-orange.png') no-repeat center;
        background-size: 100%;
        border-radius: 10px 10px 0px 0px;
        > span {
            font-size: 18px;
            font-family: Microsoft YaHei;
            line-height: 24px;
            color: #FEECC7;
        }
    }
    &-subtitle {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 27px;
        background: linear-gradient(180deg, #C34400 0%, #DB451B 100%);
        border-radius: 20px 20px 0px 0px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        line-height: 19px;
        color: #FEECC7;
    }
    &-container {
        margin-top: 10px;
        padding: 20px 10px;
        border-radius: 20px;
    }
    &-button {
        display: block;
        margin: 20px auto 0;
        width: 124px;
        height: 26px;
        border: 1px solid #FEECC7;
        border-radius: 13px;
        text-align: center;
        font-size: 14px;
        font-family: Microsoft YaHei;
        line-height: 24px;
        background-color: transparent;
        color: #FEECC7;
    }
}

</style>
