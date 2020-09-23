<template>
    <Panel :custom-class="$style.activityPanel" :title="panelTitle" hide-button>
        <ul :class="$style.activityList">
            <li v-if="isSignShow">
                <div :class="$style.imgWrapper">
                    <img :class="$style.first" :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/activity-present.png' + '?x-oss-process=style/thum-middle'">
                </div>
                <p>粽粽有礼 端午安康</p>
                <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/jinru-yellow.png" width="58" height="39" />
            </li>
            <li v-if="isPlayShow">
                <div :class="$style.imgWrapper">
                    <img :class="$style.second" :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/activity-play.png' + '?x-oss-process=style/thum-middle'">
                </div>
                <p>龙门抽大奖 有粽你就来</p>
                <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/jinru-yellow.png" width="58" height="39" />
            </li>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Panel from './Panel.vue'

@Component({
    components: { Panel }
})
export default class Activity extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: { values: { haveSigninActivity: boolean; haveLuckDrawActivity: boolean }[] }

    /* data */
    panelTitle = {
        name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/rmhd.png',
        width: 163,
        height: 27
    }

    /* computed */
    get isSignShow () {
        if (!this.data.values.length) {
            return false
        }
        return this.data.values[0].haveSigninActivity
    }

    get isPlayShow () {
        if (!this.data.values.length) {
            return false
        }
        return this.data.values[0].haveLuckDrawActivity
    }
}
</script>

<style lang="scss" module>
.activity-panel {
    padding: 14px 16px 8px;
    background-color: #01237a;
}
.activity-list {
    > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px dashed rgba(64, 118, 204, .5);
        &:nth-last-of-type(1) {
            border: none;
        }
        .img-wrapper {
            display: flex;
            justify-content: center;
            width: 76px;
        }
        img {
            display: block;
            width: auto;
            height: 68px;
        }
        > p {
            flex: 1;
            width: 0;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #fff;
            text-align: center;
        }
    }
}

</style>
