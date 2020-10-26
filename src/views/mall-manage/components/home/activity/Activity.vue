<template>
    <div :class="$style.activity">
        <ul :class="$style.activityList" v-if="show">
            <template v-for="(item, i) of list">
                <li
                    v-if="!!map[item.value]"
                    :class="{
                        [$style.activityListItem]: true,
                        [$style.large]: i === 0 && list.length % 2 === 1,
                        [$style.marginT0]: (i === 0) || (i === 1 && !isOdd)
                    }"
                    :key="i"
                >
                    <div :class="$style.activityListItemLeft">
                        <div :class="$style.activityListItemLeftMain">
                            {{ map[item.value].main }}
                        </div>
                        <div :class="$style.activityListItemLeftSub">
                            {{ map[item.value].sub }}
                        </div>
                    </div>
                    <div :class="$style.activityListItemRight">
                        <PlSvg type="img" :name="map[item.value].icon" :width="map[item.value].width" />
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.activityList" v-else>
            <li
                :class="{
                    [$style.activityListItem]: true,
                    [$style.marginT0]: i === 0 || i === 1
                }"
                v-for="(item, i) of defaultData"
                :key="i"
            >
                <div :class="$style.activityListItemLeft">
                    <div :class="$style.activityListItemLeftMain">
                        {{ map[item.value].main }}
                    </div>
                    <div :class="$style.activityListItemLeftSub">
                        {{ map[item.value].sub }}
                    </div>
                </div>
                <div :class="$style.activityListItemRight">
                    <PlSvg type="img" :name="map[item.value].icon" :width="map[item.value].width" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'

const map = {
    cloud: {
        main: '云课堂',
        sub: '停课不停学',
        icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/cloud-play.png',
        width: '35'
    },
    newyear: {
        main: '我心中的年味',
        sub: '翻开记忆中的味道',
        icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/pocket.png',
        width: '35'
    },
    distribution: {
        main: '全民来分销',
        sub: 'Helper福利享不停',
        icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/cup.png',
        width: '32'
    },
    'dragon-gate-charity': {
        main: '公益行动',
        sub: '学子携手共献爱心',
        icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/charity.png',
        width: '32'
    },
    'dragon-gate-sign': {
        main: '粽粽有礼',
        sub: '粽行四海端午安康',
        icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/check.png',
        width: '32'
    },
    'dragon-gate-play': {
        main: '龙门抽大奖',
        sub: '抽奖嗨翻天',
        icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/present.png',
        width: '32'
    }
}

const defaultData = [{
    value: 'cloud'
}, {
    value: 'newyear'
}, {
    value: 'dragon-gate-charity'
}, {
    value: 'dragon-gate-play'
}]

@Component
export default class Activity extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    map = Object.freeze(map)
    defaultData = Object.freeze(defaultData)

    /* computed */
    get isOdd () {
        return !!(this.list.length % 2)
    }

    get list () {
        return this.data.values.filter(item => Reflect.has(this.map, item.value))
    }

    get show () {
        return this.list.length
    }
}
</script>

<style lang="scss" module>
.activity-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &-item {
        box-sizing: border-box;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
        padding: 14px;
        width: 171px;
        height: 68px;
        background: #fff;
        box-shadow: 0 3px 10px rgba(0, 0, 0, .05);
        border-radius: 10px;
        &-left {
            &-main {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: bold;
                line-height: 22px;
                color: #333;
            }
            &-sub {
                margin-top: 2px;
                font-size: 12px;
                font-family: PingFang SC;
                line-height: 22px;
                color: #999;
            }
        }
        &.large {
            width: 100%;
            height: 52px;
            padding: 6px 14px;
            .activity-list-item-left {
                display: flex;
                &-sub {
                    margin-left: 16px;
                    margin-top: 0;
                }
            }
        }
        &.margin-t-0 {
            margin-top: 0;
        }
    }
}

</style>
