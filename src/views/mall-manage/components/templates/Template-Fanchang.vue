<template>
    <div class="template-activity template-fanchang" :class="[$style.templateActivity, $style.TemplateFanchang]">
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
            <div class="module-search" :class="$style.moduleSearch">
                <el-input prefix-icon="el-icon-search" placeholder="搜索商品" />
            </div>
            <div :class="$style.containerBackground" />
            <div :class="$style.containerContent">
                <div :class="$style.btnTop" />
                <!-- 直播-->
                <div :class="$style.moduleLive">
                    <Live :data="liveInfo" />
                </div>
                <!-- 买送 -->
                <div
                    ref="Maisong"
                    v-if="data && data.Maisong && (data.Maisong.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleMaisong]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Maisong'
                    }"
                    @click="onClick('Maisong')"
                >
                    <Maisong :data="Maisong" />
                </div>
                <!-- 秒杀 -->
                <div
                    ref="Miaosha"
                    v-if="data && data.Miaosha && (data.Miaosha.values.length || isClickable || isEmptyShow)"
                    :class="[$style.module, $style.moduleMiaosha]"
                >
                    <MiaoshaSmall :data="Miaosha" />
                </div>
                <!-- 百人拼团 -->
                <div
                    ref="Pintuan"
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
                    ref="Fengqiang"
                    v-if="data && data.Fengqiang && (data.Fengqiang.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleFengqiang]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Fengqiang'
                    }"
                    @click="onClick('Fengqiang')"
                >
                    <Fengqiang :data="Fengqiang" :tmpl-id="tmplId" />
                </div>
                <!-- 精品推荐-->
                <div
                    ref="Recommend"
                    v-if="data && data.Recommend && (data.Recommend.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleRecommend]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Recommend'
                    }"
                    @click="onClick('Recommend')"
                >
                    <div :class="$style.btnBottom" />
                    <Recommend :data="Recommend" />
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
import Live from '../activity/double-12/Live.vue'
import MiaoshaSmall from '../activity/double-12/Miaosha-Small.vue'
import Pintuan from '../activity/double-12/Pintuan.vue'
import Maisong from '../activity/double-12/Maisong.vue'
import Fengqiang from '../activity/double-12/Fengqiang.vue'
import Recommend from '../home/Recommend.vue'
import { TemplateFanChang } from '../../utils/types'

const mall = namespace('mall')

@Component({
    components: {
        Live,
        MiaoshaSmall,
        Pintuan,
        Maisong,
        Fengqiang,
        Recommend
    }
})
export default class TemplateFanchang extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateFanChang

    @Prop(Number) tmplId!: number
    @Prop({
        type: Boolean,
        default: true
    }) readonly isClickable!: boolean

    @Prop(Boolean) isEmptyShow!: boolean
    @Prop(Boolean) isPreview!: boolean
    @Prop(String) current!: string

    /* computed */
    @mall.Getter liveInfo!: { liveModel: { statue: number; hasNotice: boolean }[] }

    Miaosha () {
        return this.data.Miaosha || {}
    }

    Pintuan () {
        return this.data.Pintuan || {}
    }

    Maisong () {
        return this.data.Maisong || {}
    }

    Fengqiang () {
        return this.data.Fengqiang || {}
    }

    Recommend () {
        return this.data.Recommend || {}
    }

    /* methods */
    onClick (name: string) {
        if (!this.isClickable) return
        this.$emit('select', name)
    }
}
</script>

<style lang="scss">
.template-activity {
    .module-search {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        padding-top: 6px;
        width: 100%;
        height: 44px;
        .el-input {
            width: 350px;
            height: 30px;
            input {
                border: none;
                border-radius: 15px;
                background: #6a0000;
                opacity: .5;
                &::placeholder {
                    color: #fff;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                }
            }
            .el-input__icon {
                position: relative;
                left: 124px;
                height: 30px;
                font-size: 14px;
                font-weight: bolder;
                color: #fff;
                opacity: .5;
            }
        }
    }
}
.template-fanchang {
    .module-maisong {
        .background {
            background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-gift-2.jpg') no-repeat center top !important;
            background-size: 100% auto !important;
        }
    }
}
</style>
<style moodule lang="scss">
@import './double-12-common-style.scss';

</style>
