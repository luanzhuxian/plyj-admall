<template>
    <div
        class="spring-2021-panel"
        :class="[customClass]"
    >
        <slot name="title">
            <div class="spring-2021-panel-title">
                <b v-text="title" />
            </div>
        </slot>

        <template v-if="subtitle || $slots.subtitle || $scopedSlots.subtitle">
            <slot name="subtitle">
                <div class="spring-2021-panel-subtitle">
                    <span v-text="subtitle" />
                </div>
            </slot>
        </template>

        <div class="spring-2021-panel-container">
            <slot />

            <template v-if="!hideButton">
                <slot name="button">
                    <button class="spring-2021-panel-button" v-text="button" @click="handleClick" />
                </slot>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class Spring2021Panel extends Vue {
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
.spring-2021-panel {
    position: relative;
    &-title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 74px;
        background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/title-common.png) no-repeat center;
        background-size: 100%;
        > b {
            font-size: 18px;
            font-family: Microsoft YaHei;
            line-height: 24px;
            color: #D00C03;
        }
    }
    &-subtitle {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        font-size: 14px;
        font-family: Microsoft YaHei;
        line-height: 19px;
        color: #FEECC7;
    }
    &-container {
        padding: 20px 12px;
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
