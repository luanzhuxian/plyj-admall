<template>
    <Panel custom-class="double-12-2020-pintuan-panel" title="众志成团" subtitle="邀请好友一起瓜分奖励">
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <PintuanItem
                :class="$style.pintuanListItem"
                v-for="(item, i) of data.values"
                :key="i"
                :data="item"
            />
        </ul>
        <ul :class="$style.pintuanList" v-else>
            <PintuanItem
                :class="$style.pintuanListItem"
                v-for="(item, i) of 3"
                :key="i"
                :data="defaultData"
            >
                <template slot="countdown">
                    距结束：2天23:59:59
                </template>
            </PintuanItem>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import PintuanItem from './items//Pintuan-Item.vue'

@Component({
    components: {
        Panel,
        PintuanItem
    }
})
export default class Pintuan extends Vue {
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
            pageviews: 99,
            activityInfo: {
                activityPrice: 99.9,
                number: 99,
                prizePool: 1000,
                status: 1
            }
        }
    }
}
</script>

<style lang="scss">
.double-12-2020-pintuan-panel {
    .double-12-panel-container {
        margin-top: 0;
    }
}
</style>

<style lang="scss" module>
.pintuan-list-item {
    margin-top: 20px;
    &:nth-of-type(1) {
        margin: 0;
    }
}
</style>
