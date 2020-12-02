<template>
    <Panel title="福利秒杀" subtitle="新春福利来袭，特色课程限时秒杀">
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
                v-for="(item, i) of 2"
                :key="i"
                :data="defaultData"
                is-default
            />
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import MiaoshaItem from '../double-12-2020/components//MiaoshaItem.vue'

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
                number: 10,
                activityStock: 5,
                status: 1
            },
            productSkuModels: [{
                originalPrice: 150
            }]
        }
    }
}
</script>

<style lang="scss" module>
.miaosha-list-item {
    margin-top: 20px;
    &:nth-of-type(1) {
        margin-top: 0;
    }
}

</style>
