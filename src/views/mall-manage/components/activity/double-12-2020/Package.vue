<template>
    <Panel custom-class="double-12-2020-package-panel" :title="title" subtitle="双十二组合产品特惠，折扣不停歇">
        <ul :class="$style.packageList" v-if="data.values.length">
            <PackageItem
                :class="$style.packageListItem"
                v-for="(item, i) of data.values"
                :key="i"
                :data="item"
            />
        </ul>
        <ul :class="$style.packageList" v-else>
            <PackageItem :class="$style.packageListItem" :data="defaultData">
                <template slot="countdown">
                    <i :class="$style.block">02</i>
                    <span :class="[$style.colon, $style.day]">天</span>
                    <i :class="$style.block">23</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">59</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">59</i>
                </template>
            </PackageItem>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Panel from './Panel.vue'
import PackageItem from './items/Package-Item.vue'
import { TemplateModule } from '../../../utils/types'

const user = namespace('user')

@Component({
    components: {
        Panel,
        PackageItem
    }
})
export default class Package extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    defaultData = {
        activityName: '李老师初中地理七年级上',
        combinationDetailList: [{
            status: 1,
            imageUrl: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-blue.png',
            discountTotalPrice: 2100,
            totalPrice: 3000,
            salesVolume: 99,
            stock: 99,
            productModelList: [{
                productType: 'SERIES_OF_COURSE',
                productImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png',
                productName: '李老师初中地理七年级下',
                price: 2100,
                originPrice: 3000,
                count: 1
            }, {
                productType: 'SERIES_OF_COURSE',
                productImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png',
                productName: '李老师初中地理七年级下',
                price: 2100,
                originPrice: 3000,
                count: 1
            }, {
                productType: 'SERIES_OF_COURSE',
                productImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png',
                productName: '李老师初中地理七年级下',
                price: 2100,
                originPrice: 3000,
                count: 1
            }]
        }]
    }

    /* computed */
    @user.Getter mallUrl!: string
    get mallDomain () {
        const arr = this.mallUrl.split('/')
        return arr[arr.length - 1]
    }

    get title () {
        return this.mallDomain === 'pljs' ? '组合聚惠购' : '组合聚惠学'
    }
}
</script>

<style lang="scss">
.double-12-2020-package-panel {
    .double-12-panel-container {
        margin-top: 0;
        padding: 20px 22px;
    }
}
</style>

<style lang="scss" module>
.package-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
        margin-top: 20px;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        .colon {
            display: inline-block;
            padding: 0 4px;
        }
        .block {
            display: inline-block;
            box-sizing: border-box;
            padding: 0 2px;
            width: 24px;
            line-height: 23px;
            background: #FFFFFF;
            font-size: 14px;
            color: #333333;
            text-align: center;
        }
        .day {
            margin-right: 10px;
        }
    }
}
</style>
