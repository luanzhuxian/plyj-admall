<template>
    <div class="mall-main">
        <section :class="$style.template">
            <div :class="$style.templateItem">
                <img :class="$style.templateIcon" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/home-blue.png" alt="店铺首页">
                <div :class="$style.templateInfo">
                    <div :class="$style.templateInfoTop">
                        <b :class="$style.templateName">教育机构风格</b>
                        <span :class="[$style.templateLabel, $style.blue]">店铺首页</span>
                    </div>
                    <div :class="$style.templateDate">
                        创建时间 2019.5.21 19:00:23
                    </div>
                </div>
                <div :class="$style.templateButtons">
                    <el-button type="text">
                        编辑
                    </el-button>
                    <el-button type="text">
                        换肤
                    </el-button>
                </div>
            </div>
            <div :class="$style.templateItem">
                <img :class="$style.templateIcon" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/main-red.png" alt="主会场">
                <div :class="$style.templateInfo">
                    <div :class="$style.templateInfoTop">
                        <b :class="$style.templateName">新春主会场</b>
                        <span :class="[$style.templateLabel, $style.red]">主会场</span>
                    </div>
                    <div :class="$style.templateDate">
                        创建时间 2019.5.21 19:00:23
                    </div>
                </div>
                <div :class="$style.templateButtons">
                    <el-button type="text">
                        编辑
                    </el-button>
                    <el-button type="text">
                        下架
                    </el-button>
                </div>

            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class MallMain extends Vue {

}
</script>

<style module lang="scss">
.template {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 80px;
    grid-gap: 20px;
    padding: 15px 6px 0;
    &-item {
        display: flex;
        box-sizing: border-box;
        padding: 12px 16px;
        background: #F5F6FA;
        border-radius: 10px;
    }
    &-icon {
        width: 55px;
        height: 55px;
        object-fit: cover;
    }
    &-info {
        margin-left: 10px;
        flex: 1;
        font-size: 12px;
        font-family: Microsoft YaHei UI;
        line-height: 16px;
        &-top {
            display: flex;
            align-items: center;
        }
    }
    &-name {
        font-size: 16px;
        line-height: 22px;
        color: #333333;
        letter-spacing: 1px;
        @include elps-wrap(1);
    }
    &-label {
        margin-left: 10px;
        width: 58px;
        height: 22px;
        line-height: 20px;
        text-align: center;
        border-radius: 2px;
        &.blue {
            border: 1px solid #4F63FF;
            color: #4F63FF;
        }
        &.red {
            border: 1px solid #FA6E68;
            color: #FA6E68;
        }
    }
    &-date {
        margin-top: 5px;
        @include elps-wrap(1);
    }
    &-buttons {
        align-self: flex-end;
        padding: 0 14px 8px;
        > button {
            padding: 0;
            min-width: auto;
        }
    }
}

</style>
