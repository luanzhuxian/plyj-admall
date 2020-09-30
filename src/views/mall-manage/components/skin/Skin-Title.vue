<template>
    <div :class="$style.skinTitle">
        <TitleXmas v-if="skinId === 1" :data="data" />
        <TitleYuanDan v-if="skinId === 2" :data="data" />
        <TitleNewYear v-if="skinId === 3" :data="data" />
        <TitleXiaoNian v-if="skinId === 4" :data="data" />
        <TitleYuanXiao v-if="skinId === 5" :data="data" />
        <TitleWomenDay v-if="skinId === 6" :data="data" />
        <TitleNianNianFan v-if="skinId === 7" :data="data" />
        <TitleEarthDay v-if="skinId === 8" :data="data" />
        <TitleLabourDay v-if="skinId === 9" :data="data" />
        <TitleMothersDay v-if="skinId === 10" :data="data" />
        <TitleChildrenDay v-if="skinId === 11" :data="data" />
        <TitleFathersDay v-if="skinId === 12" :data="data" />
        <TitleDragonBoat v-if="skinId === 13" :data="data" />
        <TitleMidAutumnFestival v-if="skinId === 14" :data="data" />
        <TitleNationalDay v-if="skinId === 15" :data="data" />
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
import TitleMidAutumnFestival from './Title-Mid-Autumn-Festival.vue'
import TitleNationalDay from './Title-National-Day.vue'

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
        TitleMidAutumnFestival,
        TitleNationalDay
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
