<template>
    <header
        :style="{ '--height': height }"
        :class="$style.header2"
    >
        <div :class="$style.content">
            <div :class="$style.left" class="pointer" @click="goHome">
                <img :class="$style.logo" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png">
                <strong v-if="$route.matched.some(item => item.name === 'Login')" class="fz-16 gray-0">欢迎登录</strong>
            </div>
            <HeaderRight v-if="allLoaded" />
        </div>
    </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import HeaderRight from './Header-Rigtht.vue'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
@Component({
    components: {
        HeaderRight
    }
})
export default class Header2 extends Vue {
    @userModule.Getter('allLoaded') allLoaded!: boolean
    // 头部高度
    @Prop({ type: String, default: '80px' }) height!: string

    goHome () {
        if (this.allLoaded) {
            this.$router.push({ name: 'Home' })
        }
    }
}
</script>

<style module lang="scss">
    .header2 {
        background-color: #fff;
        .content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 900px;
            height: var(--height);
            margin: 0 auto;
        }
        .left {
            display: inline-flex;
            align-items: center;
            > .logo {
                height: 32px;
                margin-right: 50px;
            }
        }
    }
</style>
