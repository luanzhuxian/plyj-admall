<template>
    <transition name="fade">
        <div v-show="showMallUrl" :class="$style.visitShopBox">
            <i class="el-icon-close" @click="$emit('close')" />
            <div :class="$style.title">访问店铺</div>
            <div :class="$style.content">
                <div style="text-align: center">H5店铺</div>
                <div :class="$style.shopUrl">
                    <div :class="$style.input" v-text="mallUrl" />
                    <button @click.stop.prevent="" v-clipboard:copy="mallUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button>
                </div>
                <img :src="mallQrcode" alt="">
                <div style="text-align: center; margin-bottom: 40px;">
                    <p>
                        <el-button type="text" @click="downloadQrcode">下载二维码</el-button>
                    </p>
                    <p>微信扫描可直接查看店铺</p>
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { generateQrcode } from '@/assets/ts/utils'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
@Component
export default class ShopModal extends Vue {
    private mallQrcode = ''
    @Prop({ type: Boolean }) showMallUrl!: boolean;

    @userModule.Getter('mallUrl') mallUrl!: string
    // watch
    @Watch('mallUrl', { immediate: true })
    async onMallUrlChange (val: string) {
        if (val) {
            this.mallQrcode = await generateQrcode({
                text: `${ val }?=${ Date.now() }`
            })
        }
    }

    // methods
    onCopy () {
        this.$success('复制成功')
    }

    // 复制失败
    onError () {
        this.$warning('复制失败')
    }

    downloadQrcode () {
        if (this.mallQrcode) {
            const a = document.createElement('a')
            a.href = this.mallQrcode
            a.download = '店铺二维码.png'
            a.click()
        }
    }
}
</script>

<style module lang="scss">
    .visit-shop-box {
        position: absolute;
        top: 40px;
        right: 0;
        width: 376px;
        background-color: #fff;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);
        border-radius: 2px;
        z-index: 10;
        > i {
            top: 25px;
            right: 25px;
            font-size: 16px;
            cursor: pointer;
            position: absolute;
        }
        .title {
            line-height: 65px;
            padding: 0 36px;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid $--border-color;
        }
        .content {
            padding-top: 40px;
            > img {
                display: block;
                width: 160px;
                margin: 27px auto 10px;
                padding: 10px;
                border: 1px dashed $--border-color;
            }
        }
        .shop-url {
            display: flex;
            align-items: center;
            width: 280px;
            margin: 20px auto 0;
            text-align: center;
            > .input {
                flex: 1;
                padding: 0 10px;
                line-height: 30px;
                color: #D4D4D4;
                border: 1px solid $--border-color;
                background-color: #F5F5F5;
                @include elps-wrap(1);
            }
            > button {
                width: 50px;
                line-height: 32px;
                color: #fff;
                border: none;
                background-color: $--color-primary-blue;
            }
        }
    }
</style>
