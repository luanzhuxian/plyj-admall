<template>
    <Panel custom-class="double-12-2020-miaosha-panel" title="福利秒杀" subtitle="双十二福利来袭，限时秒杀">
        <ul :class="$style.miaoshaList" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <MiaoshaItem
                    :class="$style.miaoshaListItem"
                    :key="index"
                    :data="item"
                />
            </template>
        </ul>
        <ul :class="$style.miaoshaList" v-else>
            <MiaoshaItem
                :class="$style.miaoshaListItem"
                v-for="(item, i) of 3"
                :key="i"
                :data="defaultData"
            >
                <template slot="countdown">
                    <i :class="$style.block">02</i>
                    <span :class="$style.colon">天</span>
                    <i :class="$style.block">23</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">59</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">59</i>
                </template>
            </MiaoshaItem>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import MiaoshaItem from './components/MiaoshaItem.vue'

@Component({
    components: {
        Panel,
        MiaoshaItem
    }
})
export default class Miaosha extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    defaultData = {
        goodsInfo: {
            productMainImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png',
            productName: '高中数学 选修4-4',
            activityInfo: {
                activityPrice: 99.9,
                activityStock: 5,
                number: 10,
                status: 1
            },
            productSkuModels: [{
                originalPrice: 150
            }]
        }
    }
}
</script>

<style lang="scss">
.double-12-2020-miaosha-panel {
    .double-12-panel-container {
        background-color: #D00C03;
    }
}
</style>

<style lang="scss" module>
.miaosha-list-item {
    margin-top: 20px;
    &:nth-of-type(1) {
        margin-top: 0;
    }
    .colon {
        display: inline-block;
        padding: 0 4px;
        transform: scale(0.8);
    }
    .block {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 2px;
        width: 24px;
        line-height: 23px;
        background: #FFFFFF;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 600;
        color: #333333;
        text-align: center;
    }
}
</style>
