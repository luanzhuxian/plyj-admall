<template>
    <header :class="$style.header">
        <div :class="$style.left">
            <el-breadcrumb v-if="$route.matched.length" separator-class="el-icon-arrow-right">
                <template
                    v-for="(route, i) of $route.matched"
                >
                    <el-breadcrumb-item
                        :key="i"
                        v-if="route.meta && route.meta.title"
                        :to="{ path: route.path }"
                    >
                        {{ route.meta.title }}
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
            <el-breadcrumb v-else-if="childRoute" separator-class="el-icon-arrow-right">
                <template v-for="(route, i) of childRoute.matched">
                    <el-breadcrumb-item
                        :key="i"
                        v-if="route.meta && route.meta.title"
                        :to="{ path: `/admall/${ route.path }` }"
                    >
                        {{ route.meta.title }}
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>
        <div :class="$style.right">
            <!-- 访问店铺 -->
            <div :class="$style.visitShop">
                <img @click="showMallUrl = true" width="15" class="pointer" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/shangchengguanli.png" alt="">
                <span @click="showMallUrl = true" class="pointer">访问店铺</span>

                <transition name="fade">
                    <div v-show="showMallUrl" :class="$style.visitShopBox">
                        <i class="el-icon-close" @click="showMallUrl = false" />
                        <div :class="$style.title">访问店铺</div>
                        <div :class="$style.content">
                            <div style="text-align: center">H5店铺</div>
                            <div :class="$style.shopUrl">
                                <div :class="$style.input" v-text="mallUrl" />
                                <button v-clipboard:copy="mallUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button>
                            </div>
                            <img :src="mallQrcode" alt="">
                            <div style="text-align: center">手机扫描可直接查看店铺</div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- 通知中心按钮 -->
            <router-link
                tag="div"
                :class="$style.notice"
                class="pointer"
                to="/notification"
            >
                <pl-svg
                    :class="$style.icon"
                    name="icon-tongzhi-bfcfa"
                    width="15"
                    height="18"
                />
                <span>通知中心</span>
                <i :class="$style.mark" />
            </router-link>

            <el-dropdown
                trigger="hover"
                @command="command"
            >
                <div :class="$style.userInfo">
                    <img
                        :class="$style.avatar"
                        src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/yonghu.png"
                        alt="avatar"
                    >
                    <div class="user-info-right">
                        <div>
                            <span v-if="mallName">{{ mallName }}</span>
                            <span class="phone">
                                {{ bindPhone | formatAccount }}
                            </span>
                            <span class="el-icon-arrow-right fz-12" />
                        </div>
                        <div>
                            <span
                                :class="$style.auth"
                                v-if="auditStatus"
                            >
                                {{ auditStatus | agencyStatus }}
                            </span>
                            <span class="level">企业等级：1</span>
                        </div>
                    </div>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="modify">
                        修改密码
                    </el-dropdown-item>
                    <el-dropdown-item command="logout">
                        退出登录
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace, Getter } from 'vuex-class'
import { generateQrcode } from '../../../assets/ts/utils'
const userModule = namespace('user')

@Component
export default class Header extends Vue {
    mallQrcode = ''
    showMallUrl = false
    // computed
    @userModule.Getter('mallName') mallName!: string
    @userModule.Getter('bindPhone') bindPhone!: string
    @userModule.Getter('auditStatus') auditStatus!: string
    @userModule.Getter('mallUrl') mallUrl!: string
    @Getter('childRoute') childRoute!: any

    @userModule.Mutation('LOGOUT') LOGOUT!: Function

    async command (command: string) {
        if (command === 'logout') {
            await this.LOGOUT()
            this.$router.push({ name: 'PhoneLogin' })
        }
        if (command === 'modify') return this.$router.push({ name: 'ModifyPassword' })
    }

    // watch
    @Watch('mallUrl', { immediate: true })
    async onMallUrlChange (val: string) {
        if (val) {
            this.mallQrcode = await generateQrcode({
                text: val
            })
        }
    }

    // methods
    // 复制成功
    onCopy () {
        this.$success('复制成功')
    }

    // 复制失败
    onError () {
        this.$warning('复制失败')
    }
}
</script>

<style module lang="scss">
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 0 24px;
        border-left: 1px solid #E7E7E7;
        background-color: #fff;
    }
    .right {
        display: inline-flex;
        align-items: center;
        .notice {
            position: relative;
            display: inline-flex;
            align-items: center;
            > .icon {
                margin-right: 7px;
            }
            > .mark {
                position: absolute;
                top: -2px;
                right: -3px;
                width: 4px;
                height: 4px;
                background-color: $--color-red-1;
                border-radius: 2px;
            }
        }
        .user-info {
            display: flex;
            align-items: center;
            height: 50px;
            padding: 0 20px;
            .avatar {
                width: 20px;
                height: 20px;
                margin-right: 4px;
            }
            .auth {
                display: inline-block;
                height: 16px;
                margin-right: 12px;
                padding: 0 7px;
                font-size: 12px;
                text-align: center;
                line-height: 16px;
                color: #fff;
                background-color: #4F63FF;
            }
        }
    }
    .visit-shop {
        position: relative;
        display: inline-flex;
        align-items: center;
        margin-right: 32px;
        > img {
            margin-right: 6px;
        }
    }
    .visit-shop-box {
        position: absolute;
        top: 40px;
        right: 0;
        width: 376px;
        height: 436px;
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
                margin: 27px auto 13px;
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
