<template>
    <div :class="[$style.templateActivity, $style.templateBaofa]">
        <img
            src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/bars.png"
            style="width: 100%; height: 20px;"
        >
        <img
            src="https://mallcdn.youpenglai.com/static/admall/mall-management/a47ad2c0-5839-4d45-bab6-3ee455e0945c.png"
            style="width: 100%; height: 38px;"
        >
        <div :class="$style.container">
            <!-- 搜索栏-->
            <div :class="$style.moduleSearch">
                <el-input prefix-icon="el-icon-search" placeholder="搜索商品" />
            </div>
            <div :class="$style.containerBackground" />
            <div :class="$style.containerContent">
                <div :class="$style.btnTop" />
                <!-- 领券 -->
                <div
                    id="Coupon"
                    v-if="data && data.Coupon && (data.Coupon.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleCoupon]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Coupon'
                    }"
                    @click="onClick('Coupon')"
                >
                    <Coupon :data="Coupon" />
                </div>
                <!-- 直播-->
                <div :class="$style.moduleLive">
                    <Live :data="liveInfo" />
                </div>
                <!-- 买送 -->
                <div
                    id="Maisong"
                    v-if="data && data.Maisong && (data.Maisong.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleMaisong]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Maisong'
                    }"
                    @click="onClick('Maisong')"
                >
                    <Maisong :data="Maisong" :tmpl-type="tmplType" />
                </div>
                <!-- 秒杀 -->
                <div
                    id="Miaosha"
                    v-if="data && data.Miaosha && (data.Miaosha.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleMiaosha]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Miaosha'
                    }"
                    @click="onClick('Miaosha')"
                >
                    <Miaosha :data="Miaosha" :current-module="current" />
                </div>
                <!-- 活动 -->
                <!-- <div class="module-activity" v-if="hasJxEvent || hasInvitingEvent">
                    <div v-if="hasJxEvent && hasInvitingEvent" class="small road" />
                    <div v-if="hasJxEvent && hasInvitingEvent" class="small invitation" />
                    <div v-if="hasJxEvent && !hasInvitingEvent" class="large road" />
                    <div v-if="!hasJxEvent && hasInvitingEvent" class="large invitation" />
                </div> -->
                <!-- 百人拼团 -->
                <div
                    id="Pintuan"
                    v-if="data && data.Pintuan && (data.Pintuan.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.modulePintuan]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Pintuan'
                    }"
                    @click="onClick('Pintuan')"
                >
                    <Pintuan :data="Pintuan" />
                </div>
                <!-- 疯抢 -->
                <div
                    id="Fengqiang"
                    v-if="data && data.Fengqiang && (data.Fengqiang.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleFengqiang]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Fengqiang'
                    }"
                    @click="onClick('Fengqiang')"
                >
                    <Fengqiang :data="Fengqiang" :tmpl-type="tmplType" />
                </div>
            </div>
        </div>
        <img
            src="https://mallcdn.youpenglai.com/static/admall/mall-management/tabbar-d12.png"
            style="width: 100%;"
        >
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Live from '../../activity/double-12-2019/Live.vue'
import Miaosha from '../../activity/double-12-2019/Miaosha.vue'
import Pintuan from '../../activity/double-12-2019/Pintuan.vue'
import Maisong from '../../activity/double-12-2019/Maisong.vue'
import Coupon from '../../activity/double-12-2019/Coupon.vue'
import Fengqiang from '../../activity/double-12-2019/Fengqiang.vue'
import { TemplateBaoFa } from '../../../utils/types'

const mall = namespace('mall')

@Component({
    components: {
        Live,
        Miaosha,
        Pintuan,
        Maisong,
        Coupon,
        Fengqiang
    }
})
export default class TemplateBaofa extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateBaoFa

    @Prop(Number) tmplType!: number
    @Prop({
        type: Boolean,
        default: true
    }) readonly isClickable!: boolean

    @Prop(Boolean) isEmptyShow!: boolean
    @Prop(Boolean) isPreview!: boolean
    @Prop(String) current!: string

    /* computed */
    @mall.Getter liveInfo!: { liveModel: { statue: number; hasNotice: boolean }[] }

    get Miaosha () {
        return this.data.Miaosha || { values: [] }
    }

    get Pintuan () {
        return this.data.Pintuan || { values: [] }
    }

    get Maisong () {
        return this.data.Maisong || { values: [] }
    }

    get Coupon () {
        return this.data.Coupon || { values: [] }
    }

    get Fengqiang () {
        return this.data.Fengqiang || { values: [] }
    }

    /* methods */
    onClick (name: string) {
        if (!this.isClickable) return
        this.$emit('select', name)
    }
}
</script>

<style module lang="scss">
@import './double-12-common-style.scss';

</style>
