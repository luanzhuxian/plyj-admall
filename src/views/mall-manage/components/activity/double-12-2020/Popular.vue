<template>
    <panel custom-class="double-12-2020-popular-panel" :title="title" subtitle="双十二特色课程，推荐学子必学榜单" hide-button>
        <ul :class="$style.popularList" v-if="data.values.length">
            <li :class="[$style.popularListItem, $style.large]" v-if="isOdd">
                <div :class="$style.imgWrapper">
                    <img :src="first.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    <label :class="$style.label">
                        <span>NO.1</span>
                    </label>
                </div>
                <div :class="$style.info">
                    <div :class="$style.top">
                        <div :class="$style.infoPrice">
                            双十二价：<b>{{ first.goodsInfo.productSkuModels && first.goodsInfo.productSkuModels.length && getPrice(first.goodsInfo.productSkuModels)('price') }}</b>
                        </div>
                        <div :class="$style.infoTags">
                            <template v-for="(label, j) of first.goodsInfo.labelModels.slice(0, 2)">
                                <span v-if="label && !!label.labelName" :key="j">
                                    {{ label.labelName }}
                                </span>
                            </template>
                        </div>
                    </div>
                    <div :class="$style.infoName">
                        {{ first.goodsInfo.productName }}
                    </div>
                </div>
            </li>
            <template v-for="(item, i) of (isOdd ? rest : data.values)">
                <li
                    v-if="item.goodsInfo"
                    :class="{
                        [$style.popularListItem]: true,
                        [$style.small]: true,
                        [$style.marginT0]: !isOdd && (i === 0 || i === 1)
                    }"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <label :class="$style.label">
                            <span>{{ `NO.${isOdd ? i + 2 : i + 1}` }}</span>
                        </label>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.infoPrice">
                            双十二价<b>{{ item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('price') }}</b>
                        </div>
                        <div :class="$style.infoName">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.infoTags">
                            <template v-for="(label, j) of first.goodsInfo.labelModels.slice(0, 2)">
                                <span v-if="label && !!label.labelName" :key="j">
                                    {{ label.labelName }}
                                </span>
                            </template>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.popularList" v-else>
            <li :class="[$style.popularListItem, $style.large]">
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-blue.png" alt="">
                    <label :class="$style.label">
                        <span>NO.1</span>
                    </label>
                </div>
                <div :class="$style.info">
                    <div :class="$style.top">
                        <div :class="$style.infoPrice">
                            双十二价：<b>2100</b>
                        </div>
                        <div :class="$style.infoTags">
                            <span>学长课堂</span>
                            <span>英语课</span>
                        </div>
                    </div>
                    <div :class="$style.infoName">
                        李老师初中地理七年级上
                    </div>
                </div>
            </li>
            <li :class="[$style.popularListItem, $style.small]" v-for="(item, i) of 2" :key="i">
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png" alt="">
                    <label :class="$style.label">
                        <span>{{ `NO.${i + 2}` }}</span>
                    </label>
                </div>
                <div :class="$style.info">
                    <div :class="$style.infoPrice">
                        双十二价<b>2100</b>
                    </div>
                    <div :class="$style.infoName">
                        李老师初中地理七年级下
                    </div>
                    <div :class="$style.infoTags">
                        <span>学长课堂</span>
                        <span>英语课</span>
                    </div>
                </div>
            </li>
        </ul>
    </panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import { getPrice } from '../../../utils/helper'

const user = namespace('user')

@Component({
    components: {
        Panel
    }
})
export default class Popular extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* computed */
    @user.Getter mallUrl!: string
    get mallDomain () {
        const arr = this.mallUrl.split('/')
        return arr[arr.length - 1]
    }

    get title () {
        return this.mallDomain === 'pljs' ? '君学严选' : '学子推荐榜HOT'
    }

    get isOdd () {
        return !!(this.data.values.length % 2)
    }

    get first () {
        return this.data.values[0]
    }

    get rest () {
        return this.data.values.slice(1)
    }

    /* methods */
    getPrice = getPrice
}
</script>

<style lang="scss">
.double-12-2020-popular-panel {
    .double-12-panel-container {
        margin-top: 0;
        padding: 20px 22px;
    }
}
</style>
<style lang="scss" module>
.popular {
    &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            .label {
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 58px;
                height: 18px;
                background: linear-gradient(180deg, #D00D05 0%, #812225 100%);
                border-radius: 0px 8px 0px 8px;
                font-size: 12px;
                color: #FFFFFF;
                &::before {
                    content: '';
                    margin-right: 6px;
                    width: 11px;
                    height: 14px;
                    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/fire.png') no-repeat center;
                    background-size: 100%;
                }
            }
            &.large {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                padding: 5px;
                width: 100%;
                height: 290px;
                margin-top: 0;
                background: #ffffff;
                border-radius: 20px;
                .label {
                    width: 78px;
                    height: 25px;
                    font-size: 16px;
                    &::before {
                        width: 15px;
                        height: 18px;
                    }
                }
                .img-wrapper {
                    position: relative;
                    width: 100%;
                    height: 213px;
                    border-radius: 20px 20px 0 0;
                    overflow: hidden;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .info {
                    flex: 1;
                    padding: 6px 13px;
                    .top {
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        @include elps();
                    }
                    &-name {
                        margin-top: 4px;
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        color: #000;
                        @include elps();
                    }
                    &-price {
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        color: #D00C06;
                        @include elps();
                        > b {
                            font-size: 18px;
                            &::before {
                                content: '￥';
                                font-size: 12px;;
                            }
                        }
                    }
                    &-tags {
                        margin-left: 10px;
                        line-height: 21px;
                        @include elps();
                        > span {
                            text-align: center;
                            margin-left: 8px;
                            padding: 0 4px;
                            line-height: 18px;
                            border: 1px solid #D09648;
                            color: #A57613;
                            &:nth-of-type(1) {
                                margin-left: 0;
                            }
                        }
                    }
                }
            }
             &.small {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                width: 156px;
                height: 200px;
                margin-top: 20px;
                padding: 2px;
                background: #ffffff;
                border-radius: 10px;
                &.margin-t-0 {
                    margin-top: 0;
                }
                .img-wrapper {
                    position: relative;
                    box-sizing: border-box;
                    width: 100%;
                    height: 102px;
                    border-radius: 10px 10px 0 0;
                    overflow: hidden;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 8px 7px;
                    &-name {
                        font-weight: bold;
                        font-size: 13px;
                        color: #333;
                        @include elps();
                    }
                    &-price {
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        font-size: 12px;
                        color: #D00C06;
                        @include elps();
                        > b {
                            font-size: 18px;
                            &::before {
                                content: '￥';
                                font-size: 12px;;
                            }
                        }
                    }
                    &-tags {
                        margin-top: 8px;
                        line-height: 21px;
                        @include elps();
                        > span {
                            text-align: center;
                            margin-left: 8px;
                            padding: 0 4px;
                            line-height: 18px;
                            border: 1px solid #D09648;
                            color: #A57613;
                            font-size: 10px;
                            &:nth-of-type(1) {
                                margin-left: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>
