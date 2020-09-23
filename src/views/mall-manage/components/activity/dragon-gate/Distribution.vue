<template>
    <Panel :custom-class="$style.distributionPanel" :title="panelTitle">
        <ul :class="$style.distributionList" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <li
                    v-if="item.goodsInfo"
                    :class="$style.distributionListItem"
                    :key="index"
                >
                    <div :class="$style.imgWrapper">
                        <label>{{ item.definiteType }}</label>
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.sub">
                            {{ `分享购买成功后获得润笔 ¥${item.goodsInfo.rebate}` }}
                        </div>
                        <div :class="$style.bottom">
                            <b :class="$style.price">{{ item.goodsInfo.price }}</b>
                            <del :class="$style.original">{{ item.goodsInfo.originPrice }}</del>
                            <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/fenxiang-yellow.png" width="60" height="29" />
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.distributionList" v-else>
            <li :class="$style.distributionListItem" v-for="(item, i) of 3" :key="i">
                <div :class="$style.imgWrapper">
                    <label>知识课程</label>
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/default.png" alt="">
                </div>
                <div :class="$style.info">
                    <div :class="$style.main">
                        神奇的逻辑思维游戏畅销书
                    </div>
                    <div :class="$style.sub">
                        分享购买成功后获得润笔 ¥500
                    </div>
                    <div :class="$style.bottom">
                        <b :class="$style.price">10000</b>
                        <del :class="$style.original">19999</del>
                        <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/fenxiang-yellow.png" width="60" height="29" />
                    </div>
                </div>
            </li>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'

@Component({
    components: { Panel }
})
export default class Distribution extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    panelTitle = {
        name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/qmlfx.png',
        width: 184,
        height: 27
    }
}
</script>

<style module lang="scss">
.distribution-panel {
    padding-top: 30px;
    background: #01237a;
    > button {
        margin-top: 14px;
    }
}
.distribution {
    &-list-item {
        display: flex;
        padding: 10px 0;
        width: 100%;
        border-top: 1px dashed rgba(64, 118, 204, .5);
        &:nth-of-type(1) {
            border: none;
        }
        .img-wrapper {
            position: relative;
            margin-right: 10px;
            width: 120px;
            height: 80px;
            border-radius: 6px;
            overflow: hidden;
            label {
                position: absolute;
                top: 6px;
                left: 6px;
                width: 56px;
                line-height: 17px;
                text-align: center;
                background: #ffe100;
                border: 1px solid #222;
                border-radius: 3px;
                font-size: 12px;
                font-family: PingFang SC;
                font-weight: 800;
                color: #00237a;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .info {
            display: flex;
            justify-content: center;
            flex-direction: column;
            flex: 1;
            width: 0;
            padding: 4px 0;
        }
        .main {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            @include elps();
        }
        .sub {
            font-size: 12px;
            color: #8bb8fb;
            @include elps();
        }
        .bottom {
            display: flex;
            align-items: center;
            margin-top: auto;
            .price {
                font-size: 20px;
                color: #ffe701;
                @include elps();
                &:before {
                    content: '￥';
                    font-size: 12px;
                }
            }
            .original {
                margin-left: 6px;
                font-size: 12px;
                color: #ff955c;
                @include elps();
                &:before {
                    content: '￥';
                }
            }
            > img {
                flex-shrink: 0;
                margin-left: auto;
            }
        }
    }
}

</style>
