<template>
    <div>
        <components :is="currentSkinTitle" :data="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { skinTitleMap } from '../../utils/map'
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
import TitleCulture from './Title-Culture.vue'
import TitleSports from './Title-Sports.vue'
import TitleArts from './Title-Arts.vue'
import TitleDouble12 from './Title-Double-12.vue'
import TitleParty from './Title-Party.vue'
import TitleGoodCourse from './Title-Good-Course.vue'
import TitleWelcomeNew from './Title-Welcome-New.vue'
import TitleXmas2020 from './Title-Xmas-2020.vue'

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
        TitleNationalDay,
        TitleCulture,
        TitleSports,
        TitleArts,
        TitleDouble12,
        TitleParty,
        TitleGoodCourse,
        TitleWelcomeNew,
        TitleXmas2020
    }
})
export default class SkinTitle extends Vue {
    @Prop(String) data!: string
    @Prop([Number, String]) skinId!: number | string

    get currentSkinTitle () {
        return skinTitleMap.get(this.skinId)
    }
}
</script>
