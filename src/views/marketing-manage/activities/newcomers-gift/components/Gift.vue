<template>
    <div :class="{ [$style.gift]: true, [$style.one]: count === 1 }">
        <img :src="image" alt="">
        <div>
            <div :class="$style.name" class="fz-12" v-text="name" />
            <div :class="$style.time" class="fz-12 gray-3">
                {{ start | dateFormat('YYYY.M.D') }}-{{ end | dateFormat('YYYY.M.D') }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gift',
    props: {
        image: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        start: {
            type: String,
            default: ''
        },
        end: {
            type: String,
            default: ''
        },
        // 礼品数量
        count: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style module lang="scss">
  /* 尺寸比例转换 */
  $em: 330 / 750;
    .gift {
        display: inline-block;
        width: 300px*$em;
        height: 404px*$em;
        margin-right: 16px*$em;
        font-size: 0;
        border-radius: 20px*$em 20px*$em 0 0;
        overflow: hidden;
        background-color: #FFEAE1;
        > img {
            display: block;
            width: 292px*$em;
            height: 292px*$em;
        }
        > div {
            padding: 8px 4px;
            > .name {
                margin-bottom: 18px*$em;
                @include elps-wrap(1);
            }
          > div:nth-of-type(2) {
            transform-origin: 0 -10px;
            transform: scale(.7);
          }
        }
        &.one {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 180px*$em;
            width: 614px*$em;
            margin-right: 0;
            box-sizing: border-box;
            border-radius: 20px*$em;
            > img {
                width: 180px*$em;
                height: 180px*$em;
            }
            > div {
                padding: 28px*$em 32px*$em;
                > .name {
                    margin-bottom: 20px*$em;
                    font-weight: bold;
                    font-size: 5px;
                    @include elps-wrap(1);
                }
            }
        }
    }
</style>
