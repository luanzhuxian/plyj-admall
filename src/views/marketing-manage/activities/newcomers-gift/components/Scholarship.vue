<template>
    <div :class="$style.scholarship">
        <div :class="$style.price" class="rmb">
            ￥<i v-text="price" />
        </div>
        <p>全场商品通用</p>
        <p>领取后{{ days }}天内可用</p>
    </div>
</template>

<script>
export default {
    name: 'Scholarship',
    props: {
        price: {
            type: Number,
            default: 0
        },
        days: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style module lang="scss">
  /* 尺寸比例转换 */
  $em: 330 / 750;
    .scholarship {
        display: inline-block;
        width: 222px*$em;
        height: 245px*$em;
        margin-right: 20px*$em;
        text-align: center;
        background: url("https://mallcdn.youpenglai.com/static/admall/2.11.0/red-envelope2.png") no-repeat center center;
        background-size: 100% 100%;
        > .price {
            margin-top: 38px*$em;
            font-size: 36px*$em;
            font-weight: bold;
            color: #FF4622;
            &:before {
                font-size: 30px*$em;
                font-weight: normal;
            }
        }
        > p {
            font-size: 12px;
            color: #fff;
            @include elps-wrap(1);
            transform: scale(.8);
            &:nth-of-type(1) {
                margin-top: 46px*$em;
            }
            &:nth-of-type(2) {
                margin-top: 6px*$em;
            }
        }
    }
</style>
