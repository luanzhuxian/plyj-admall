<template>
    <Panel custom-class="spring-2021-yugou-panel">
        <template slot="title">
            <div class="spring-2021-yugou-panel-title">
                <b>新春开学季 早定更优惠</b>
            </div>
        </template>
        <template slot="default">
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
        </template>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import YugouItemLarge from '../double-12-2020/items/Yugou-Item-Large.vue'
import YugouItemSmall from '../double-12-2020/items/Yugou-Item-Small.vue'

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

    defaultDataSmall = {
        goodsInfo: {
            productMainImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png',
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
.spring-2021-yugou-panel {
    padding-top: 20px;
    background: #FFC70C;
    border-radius: 20px;
    &-title {
        position: relative;
        text-align: center;
        font-size: 20px;
        line-height: 27px;
        color: #D00C03;
        &::before {
            position: absolute;
            top: -6px;
            left: 28px;
            content: '';
            width: 44.5px;
            height: 30px;
            background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/book.png) no-repeat center;
            background-size: 100%;
        }
        &::after {
            position: absolute;
            top: -6px;
            right: 28px;
            content: '';
            width: 44.5px;
            height: 30px;
            background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/book.png) no-repeat center;
            background-size: 100%;
        }
    }
    .spring-2021-panel-container {
        padding: 12px 22px 20px;
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
