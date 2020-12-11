<template>
    <li v-if="data.goodsInfo" :class="$style.productItemSmall">
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
            <label :class="$style.label">
                <span>{{ `NO.${rank}` }}</span>
            </label>
        </div>
        <div :class="$style.info">
            <div :class="$style.infoPrice">
                双十二价<b>{{ data.goodsInfo.productSkuModels && data.goodsInfo.productSkuModels.length && getPrice(data.goodsInfo.productSkuModels)('price') }}</b>
            </div>
            <div :class="$style.infoName">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.infoTags">
                <template v-for="(label, j) of data.goodsInfo.labelModels.slice(0, 2)">
                    <span v-if="label && !!label.labelName" :key="j">
                        {{ label.labelName }}
                    </span>
                </template>
            </div>
        </div>
    </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModuleItem } from '../../../../utils/types'
import { getPrice } from '../../../../utils/helper'

@Component
export default class ProductItemSmall extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateModuleItem

    @Prop(Number) readonly rank!: number

    /* methods */
    getPrice = getPrice
}
</script>

<style lang="scss" module>
.product-item-small {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 156px;
    height: 200px;
    padding: 2px;
    background: #ffffff;
    border-radius: 10px;
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
</style>
