<template>
    <div :class="$style.progressBox">
        <div :class="$style.progress" :style="{ 'background-color': color }">
            <div :class="$style.bar" :style="{ width: `${percentage}%`, 'background-color': percentageColor }" />
        </div>
        <div v-if="showText">
            {{ text || `${percentage}%` }}
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Progress extends Vue {
    @Prop([Number, String]) readonly percentage!: number | string
    @Prop(Boolean) readonly showText!: boolean
    @Prop(String) readonly text: string | undefined

    @Prop({
        type: String,
        default: '#f5f6fa'
    }) readonly color: string | undefined

    @Prop({
        type: String,
        default: '#4f63ff'
    }) readonly percentageColor: string | undefined
}
</script>

<style lang='scss' module>

.progress-box {
    display: flex;
    align-items: center;
    font-size: 12px;
    > .progress {
        width: 200px;
        height: 4px;
        margin-right: 10px;
        border-radius: 20px;
        > .bar {
            height: 100%;
            border-radius: 20px;
        }
    }
}

</style>
