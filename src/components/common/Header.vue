<template>
    <header :class="$style.header">
        <div :class="$style.left">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div :class="$style.right">
            <div :class="$style.notice">
                <pl-svg
                    :class="$style.icon"
                    name="icon-tongzhi-bfcfa"
                    width="15"
                    height="18"
                />
                <span>通知中心</span>
                <i :class="$style.mark" />
            </div>
            <div :class="$style.user">
                <img
                    :class="$style.avatar"
                    src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/yonghu.png"
                    alt="avatar"
                >
                <span :class="$style.mobile">133****3333</span>
                <span class="el-icon-arrow-right fz-12" />
            </div>
        </div>
    </header>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Header extends Vue {

}
</script>

<style module lang="scss">
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 0 24px;
        background-color: #fff;
        box-shadow: 0 1px 0 #E7E7E7;
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
        .user {
            display: inline-flex;
            align-items: center;
            margin-left: 20px;
            padding-left: 20px;
            border-left: 1px solid $--color-gray-5;
        }
        .avatar {
            width: 20px;
            height: 20px;
            margin-right: 4px;
        }
        .mobile {
            font-size: 14px;
        }
    }
</style>
