<template>
    <div :class="$style.templateSpring">
        <img
            src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/bars.png"
            style="width: 100%; height: 20px;"
        >
        <img
            src="https://mallcdn.youpenglai.com/static/admall/mall-management/a47ad2c0-5839-4d45-bab6-3ee455e0945c.png"
            style="width: 100%; height: 38px;"
        >
        <div :class="$style.background">
            <div :class="$style.container">
                <div :class="$style.btnTop">
                    <PlSvg name="icon-jinru-c1d1c" width="60" />
                    <div :class="$style.btnTopBg">
                        您有优惠券可使用！
                    </div>
                </div>
                <!-- 直播 -->
                <div :class="$style.moduleLive">
                    <Live :data="liveInfo" />
                </div>
                <!-- 活动-->
                <!-- <activity
                    v-if="hasNwEvent"
                    class="module module-activity"
                    background="#FFFAE6"
                    box-shadow="0px 8px 12px rgba(121, 30, 5, 0.2)"
                /> -->
                <!-- 品牌宣传 -->
                <ModuleWrapper
                    id="Propagate"
                    :class="{
                        [$style.module]: true,
                        [$style.modulePropagate]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Propagate'
                    }"
                    :data="Propagate"
                    size="small"
                    @on-click="onClick('Propagate')"
                >
                    <Propagate :data="Propagate" />
                </ModuleWrapper>
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
                <!-- 春耘 -->
                <div
                    id="Chunyun"
                    v-if="data && data.Chunyun && (data.Chunyun.values.length || isClickable || isEmptyShow)"
                    :class="[$style.module, $style.moduleChunyun]"
                >
                    <Chunyun :data="Chunyun" />
                </div>
                <!-- 拼团 -->
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
                <!-- 预购 -->
                <div
                    id="Yugou"
                    v-if="data && data.Yugou && (data.Yugou.values.length || isClickable || isEmptyShow)"
                    :class="{
                        [$style.module]: true,
                        [$style.moduleYugou]: true,
                        [$style.pointer]: isClickable === true,
                        [$style.active]: current === 'Yugou'
                    }"
                    @click="onClick('Yugou')"
                >
                    <Yugou :data="Yugou" />
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
                    <div :class="$style.title">
                        — 新春优惠感恩大回馈 —
                    </div>
                    <Recommend :data="Fengqiang">
                        <template #price="{ price }">
                            <div :class="$style.priceWrapper">
                                <img src="https://mallcdn.youpenglai.com/static/mall/icons/olds/fengqiangjia.png">
                                <span :class="$style.price" v-text="price" />
                            </div>
                        </template>
                    </Recommend>
                </div>
                <!-- 版权信息 -->
                <div :class="$style.moduleCopyright">
                    — 技术支持 朋来科技 —
                </div>
            </div>
        </div>
        <img
            src="https://mallcdn.youpenglai.com/static/admall/mall-management/tabbar-xinchun.png"
            style="width: 100%;"
        >
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Live from '../activity/spring-2020/Live.vue'
// import Activity from '../activity/spring-2020/Activity.vue'
import Propagate from '../activity/spring-2020/Propagate.vue'
import Coupon from '../activity/spring-2020/Coupon.vue'
import Chunyun from '../activity/spring-2020/Chunyun.vue'
import Pintuan from '../activity/spring-2020/Pintuan.vue'
import Yugou from '../activity/spring-2020/Yugou.vue'
import Recommend from '../home/Recommend.vue'
import ModuleWrapper from '../Module-Wrapper.vue'
import { TemplateSpring2020 as TemplateSpring } from '../../utils/types'

const mall = namespace('mall')

@Component({
    components: {
        Live,
        // Activity,
        Propagate,
        Coupon,
        Chunyun,
        Pintuan,
        Yugou,
        Recommend,
        ModuleWrapper
    }
})
export default class TemplateSpring2020 extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateSpring

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

    get Propagate () {
        return this.data.Propagate || { values: [] }
    }

    get Coupon () {
        return this.data.Coupon || { values: [] }
    }

    get Chunyun () {
        return this.data.Chunyun || { values: [] }
    }

    get Pintuan () {
        return this.data.Pintuan || { values: [] }
    }

    get Yugou () {
        return this.data.Yugou || { values: [] }
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
.template-spring {
    display: flex;
    flex-direction: column;
    width: 375px;
    min-height: 667px;
    background-color: #f2d04a;
    box-shadow: 0 0 6px #d4d4d4;
}
.background {
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/df2dd58e-5cad-42af-9965-19cffcadf064.png') no-repeat center top;
    background-size: 100% auto;
    flex: 1;
}
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 350px 0 0;
}

.module {
    position: relative;
    border: 2px solid transparent;
    &.active {
        border: 2px solid #fff;
    }
    &:nth-of-type(1) {
        padding-top: 0 !important;
    }
}

.btn-top {
    position: relative;
    box-sizing: border-box;
    margin: 0 auto 8px;
    padding: 6px;
    width: 329px;
    height: 50px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 8px 12px rgba(121, 30, 5, .2);
    &-bg {
        background: linear-gradient(180deg, rgba(255, 193, 74, 1) 0%, rgba(255, 113, 56, 1) 100%);
        border-radius: 5px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 38px;
        color: #fff;
        letter-spacing: 2px;
        text-align: center;
    }
    > svg {
        position: absolute;
        top: 28px;
        right: -25px;
        transform: translateY(-50%);
    }
}

.module-live {
    padding: 20px 12px 8px;
}
.module-propagate,
.module-coupon {
    padding: 8px 12px;
}
.module-chunyun,
.module-pintuan,
.module-yugou {
    padding: 16px 0 0;
}

.module-fengqiang {
    padding: 8px 12px;
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/9f67ef6c-6a54-4e6b-ac11-090b8853a1ba.png') no-repeat right top;
    background-size: 100px auto;
    .title {
        padding: 4px 0 16px;
        text-align: center;
        color: #9d8218;
        font-size: 20px;
        font-weight: bolder;
        letter-spacing: 2px;
    }
    .price-wrapper {
        flex: 1;
        width: 0;
        @include elps();
        > img {
            width: 40px;
            height: 13.5px;
        }
    }
    .price {
        margin-left: 5px;
        font-size: 22px;
        font-family: Helvetica;
        font-weight: bold;
        color: #fe3c5e;
        &:before {
            content: '¥';
            font-size: 11px;
        }
    }
}

.module-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
}

.pointer {
    cursor: pointer;
}

</style>
