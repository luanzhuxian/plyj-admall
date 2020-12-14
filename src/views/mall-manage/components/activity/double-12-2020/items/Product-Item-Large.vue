<template>
    <li v-if="data.goodsInfo" :class="$style.productItemLarge">
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
            <label :class="$style.label">
                <span>{{ `NO.${rank}` }}</span>
            </label>
        </div>
        <div :class="$style.info">
            <div :class="$style.top">
                <div :class="$style.infoPrice">
                    {{ `${priceLabel}：` }}<b>{{ data.goodsInfo.productSkuModels && data.goodsInfo.productSkuModels.length && getPrice(data.goodsInfo.productSkuModels)('price') }}</b>
                </div>
                <div :class="$style.infoTags">
                    <template v-for="(label, j) of data.goodsInfo.labelModels.slice(0, 2)">
                        <span v-if="label && !!label.labelName" :key="j">
                            {{ label.labelName }}
                        </span>
                    </template>
                </div>
            </div>
            <div :class="$style.infoName">
                {{ data.goodsInfo.productName }}
            </div>
        </div>
    </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModuleItem } from '../../../../utils/types'
import { getPrice } from '../../../../utils/helper'

@Component
export default class ProductItemLarge extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateModuleItem

    @Prop(Number) readonly rank!: number
    @Prop(String) readonly priceLabel!: string

    /* methods */
    getPrice = getPrice
}
</script>

<style lang="scss" module>
.product-item-large {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 5px;
    width: 100%;
    height: 290px;
    background: #ffffff;
    border-radius: 20px;
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

.label {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 78px;
    height: 25px;
    background: linear-gradient(180deg, #D00D05 0%, #812225 100%);
    border-radius: 0px 8px 0px 8px;
    font-size: 16px;
    color: #FFFFFF;
    &::before {
        content: '';
        margin-right: 6px;
        width: 15px;
        height: 18px;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/fire.png') no-repeat center;
        background-size: 100%;
    }
}
</style>
