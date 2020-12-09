<template>
    <Panel custom-class="double-12-2020-yugou-panel" title="定金翻翻翻" subtitle="双十二特惠大礼来袭，定金翻倍享不停">
        <ul :class="$style.yugouList" v-if="data.values.length">
            <YugouItemLarge
                v-if="isOdd"
                :class="[$style.yugouListItem, $style.marginT0]"
                :data="first"
            />
            <YugouItemSmall
                :class="[$style.yugouListItem, (!isOdd && (i === 0 || i === 1)) ? $style.marginT0 : '']"
                v-for="(item, i) of (isOdd ? rest : data.values)"
                :key="i"
                :data="item"
            />
        </ul>
        <ul :class="$style.yugouList" v-else>
            <YugouItemLarge :class="[$style.yugouListItem, $style.marginT0]" :data="defaultDataLarge">
                <template slot="countdown">
                    2天23:59:59
                </template>
            </YugouItemLarge>
            <YugouItemSmall
                :class="$style.yugouListItem"
                v-for="(item, i) of 2"
                :key="i"
                :data="defaultDataSmall"
            >
                <template slot="countdown">
                    2天23:59:59
                </template>
            </YugouItemSmall>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import YugouItemLarge from './components/Yugou-Item-Large.vue'
import YugouItemSmall from './components/Yugou-Item-Small.vue'

@Component({
    components: {
        Panel,
        YugouItemLarge,
        YugouItemSmall
    }
})
export default class Yugou extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    defaultDataLarge = {
        goodsInfo: {
            productMainImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-blue.png',
            productName: '李老师初中地理七年级下',
            pageviews: 99,
            activityInfo: {
                multiple: 1,
                multipleNumber: 2,
                price: 100,
                activityPrice: 1000,
                number: 99,
                status: 1
            },
            productSkuModels: [{
                price: 3000
            }]
        }
    }

    defaultDataSmall = {
        goodsInfo: {
            productMainImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png',
            productName: '李老师初中地理七年级上',
            pageviews: 99,
            activityInfo: {
                multiple: 1,
                multipleNumber: 2,
                price: 100,
                activityPrice: 1000,
                number: 99,
                status: 1
            },
            productSkuModels: [{
                price: 3000
            }]
        }
    }

    /* computed */
    get isOdd () {
        return !!(this.data.values.length % 2)
    }

    get first () {
        return this.data.values[0]
    }

    get rest () {
        return this.data.values.slice(1)
    }
}
</script>

<style lang="scss">
.double-12-2020-yugou-panel {
    .double-12-panel-container {
        background-color: #F16F00;
        padding: 20px 22px;
    }
}
</style>

<style lang="scss" module>
.yugou-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
        margin-top: 20px;
        &.margin-t-0 {
            margin-top: 0;
        }
    }
}
</style>
