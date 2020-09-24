<template>
    <div :class="$style.skinTitle">
        <title-xmas v-if="skinId === 1" :data="data" />
        <title-yuan-dan v-if="skinId === 2" :data="data" />
        <title-new-year v-if="skinId === 3" :data="data" />
        <title-xiao-nian v-if="skinId === 4" :data="data" />
        <title-yuan-xiao v-if="skinId === 5" :data="data" />
        <title-women-day v-if="skinId === 6" :data="data" />
        <title-nian-nian-fan v-if="skinId === 7" :data="data" />
        <title-earth-day v-if="skinId === 8" :data="data" />
        <title-labour-day v-if="skinId === 9" :data="data" />
        <title-mothers-day v-if="skinId === 10" :data="data" />
        <title-children-day v-if="skinId === 11" :data="data" />
        <title-fathers-day v-if="skinId === 12" :data="data" />
        <title-dragon-boat v-if="skinId === 13" :data="data" />
        <title-campaign v-if="skinId === 99" :data="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import TitleXmas from './Title-Xmas.vue'
import TitleYuanDan from './Title-Yuan-Dan.vue'
import TitleNewYear from './Title-New-Year.vue'
import TitleXiaoNian from './Title-Xiao-Nian.vue'
import TitleYuanXiao from './Title-Yuan-Xiao.vue'
import TitleWomenDay from './Title-Women-Day.vue'
import TitleNianNianFan from './Title-Nian-Nian-Fan.vue'
import TitleEarthDay from './Title-Earth-Day.vue'
import TitleLabourDay from './Title-Labour-Day.vue'
import TitleMothersDay from './Title-Mothers-Day.vue'
import TitleChildrenDay from './Title-Children-Day.vue'
import TitleFathersDay from './Title-Fathers-Day.vue'
import TitleDragonBoat from './Title-Dragon-Boat.vue'
import TitleCampaign from './Title-Campaign.vue'

@Component({
    components: {
        TitleXmas,
        TitleYuanDan,
        TitleNewYear,
        TitleXiaoNian,
        TitleYuanXiao,
        TitleWomenDay,
        TitleNianNianFan,
        TitleEarthDay,
        TitleLabourDay,
        TitleMothersDay,
        TitleChildrenDay,
        TitleFathersDay,
        TitleDragonBoat,
        TitleCampaign
    }
})
export default class SkinTitle extends Vue {
    @Prop(String) data!: string
    @Prop([Number, String]) skinId!: number | string
}
</script>

<style lang="scss" module>
.skin-title {}
</style>
