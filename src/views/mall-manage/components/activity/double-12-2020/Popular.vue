<template>
    <Panel
        custom-class="double-12-2020-popular-panel"
        :title="title"
        subtitle="双十二特色课程，推荐学子必学榜单"
        hide-button
    >
        <ul :class="$style.popularList" v-if="data.values.length">
            <ProductItemLarge
                v-if="isOdd"
                :class="[$style.popularListItem, $style.marginT0]"
                :data="first"
                :rank="1"
                price-label="双十二价"
            />
            <ProductItemSmall
                :class="[$style.popularListItem, (!isOdd && (i === 0 || i === 1)) ? $style.marginT0 : '']"
                v-for="(item, i) of (isOdd ? rest : data.values)"
                :key="i"
                :data="item"
                :rank="isOdd ? i + 2 : i + 1"
                price-label="双十二价"
            />
        </ul>
        <ul :class="$style.popularList" v-else>
            <ProductItemLarge
                :class="[$style.popularListItem, $style.marginT0]"
                :data="defaultDataLarge"
                :rank="1"
                price-label="双十二价"
            />
            <ProductItemSmall
                :class="$style.popularListItem"
                v-for="(item, i) of 2"
                :key="i"
                :data="defaultDataSmall"
                :rank="i + 2"
                price-label="双十二价"
            />
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import ProductItemLarge from './items/Product-Item-Large.vue'
import ProductItemSmall from './items/Product-Item-Small.vue'

const user = namespace('user')

@Component({
    components: {
        Panel,
        ProductItemLarge,
        ProductItemSmall
    }
})
export default class Popular extends Vue {
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
            productSkuModels: [{
                price: 2100
            }],
            labelModels: [{
                labelName: '学长课堂'
            }, {
                labelName: '英语课'
            }]
        }
    }

    defaultDataSmall = {
        goodsInfo: {
            productMainImage: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png',
            productName: '李老师初中地理七年级上',
            productSkuModels: [{
                price: 2100
            }],
            labelModels: [{
                labelName: '学长课堂'
            }, {
                labelName: '英语课'
            }]
        }
    }

    /* computed */
    @user.Getter mallUrl!: string
    get mallDomain () {
        const arr = this.mallUrl.split('/')
        return arr[arr.length - 1]
    }

    get title () {
        return this.mallDomain === 'pljs' ? '君学严选' : '学子推荐榜HOT'
    }

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
.double-12-2020-popular-panel {
    .double-12-panel-container {
        margin-top: 0;
        padding: 20px 22px;
    }
}
</style>

<style lang="scss" module>
.popular-list {
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
