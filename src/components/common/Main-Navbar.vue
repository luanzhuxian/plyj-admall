<template>
    <nav :class="$style.mainNavbar">
        <img
            :class="$style.logo"
            :src="logo"
            alt="logo"
        >
        <div :class="$style.menuWrap">
            <el-menu
                text-color="#b3b9bf"
                active-text-color="#fff"
                background-color="#001629"
                unique-opened
                router
            >
                <el-menu-item index="/">
                    <h2 :class="$style.title">
                        <pl-svg
                            name="icon-shouye-5b56a"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>首页</span>
                    </h2>
                </el-menu-item>

                <el-submenu index="2">
                    <h2 :class="$style.title" slot="title">
                        <pl-svg
                            name="icon-kecheng-e9b91"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>产品中心</span>
                    </h2>
                    <!--<el-menu-item index="/admall/goods-manage/my-courses/all-courses">面授课程</el-menu-item>-->
                    <!-- <el-menu-item index="/admall/line-teaching/live">直播课</el-menu-item> -->
                    <el-menu-item index="/admall/line-teaching/function-pack">云课堂</el-menu-item>
                    <!--<el-menu-item index="/admall/goods-manage/my-goods">教育周边</el-menu-item>-->
                    <el-menu-item index="/product-center/goods-manage">我的商品</el-menu-item>
                    <el-menu-item index="/product-center/courses-manage">我的课程</el-menu-item>
                    <el-menu-item index="/product-center/category-manage">分类管理</el-menu-item>
                    <el-menu-item index="/product-center/comment">评价管理</el-menu-item>
                    <!-- <el-menu-item index="/product-center/material-manage">素材中心</el-menu-item> -->
                </el-submenu>

                <el-submenu index="3">
                    <h2 :class="$style.title" slot="title">
                        <pl-svg
                            name="icon-vip-b06e1"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>用户中心</span>
                    </h2>
                    <el-menu-item index="/user-center/member-manage">用户管理</el-menu-item>
                    <el-menu-item index="/user-center/helper-manage">helper管理</el-menu-item>
                </el-submenu>

                <el-menu-item index="/marketing-manage">
                    <h2 :class="$style.title">
                        <pl-svg
                            name="icon-yxzx-44de2"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>营销中心</span>
                    </h2>
                </el-menu-item>

                <el-submenu index="5">
                    <h2 :class="$style.title" slot="title">
                        <pl-svg
                            name="icon-dingdan-b0bdb"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>订单中心</span>
                    </h2>
                    <!--<el-menu-item index="5-1">面授课程订单</el-menu-item>-->
                    <el-menu-item index="/orders-manage/order-list">商品订单</el-menu-item>
                    <el-menu-item index="/orders-manage/courses-list">课程订单</el-menu-item>
                    <el-menu-item index="/orders-manage/online-school-order">网校订单</el-menu-item>
                    <!--<el-menu-item index="5-3">教育周边订单</el-menu-item>-->
                    <el-menu-item index="/orders-manage/backorder">售后单</el-menu-item>
                    <el-menu-item index="/orders-manage/invoice">发票管理</el-menu-item>
                </el-submenu>

                <el-submenu index="6">
                    <h2 :class="$style.title" slot="title">
                        <pl-svg
                            name="icon-dianpu-a4653"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>店铺管理</span>
                    </h2>
                    <el-menu-item index="/mall-manage">我的店铺</el-menu-item>
                    <el-menu-item index="6-2">模板中心</el-menu-item>
                    <el-menu-item index="6-3">品宣主页</el-menu-item>
                    <el-menu-item index="6-4">草稿箱</el-menu-item>
                </el-submenu>

                <el-submenu index="7">
                    <h2 :class="$style.title" slot="title">
                        <pl-svg
                            name="icon-shezhi-28924"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>基础设置</span>
                    </h2>
                    <el-menu-item index="/base-setting/account-manage/list">账号管理</el-menu-item>
                    <el-menu-item index="/base-setting/shop-info/set">店铺信息</el-menu-item>
                    <el-menu-item index="/base-setting/wechat/bind">公众号服务</el-menu-item>
                    <el-menu-item index="/base-setting/logistics/postage">物流设置</el-menu-item>
                    <el-menu-item index="/base-setting/subscription-service">我订购的服务</el-menu-item>
                </el-submenu>
                <!--<el-menu-item index="8">
                    <h2 :class="$style.title">
                        <pl-svg
                            name="icon-shouye-5b56a"
                            width="15"
                            height="15"
                            :class="$style.icon"
                        />
                        <span>我订购的服务</span>
                    </h2>
                </el-menu-item>-->
            </el-menu>
        </div>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
@Component
export default class MainNavbar extends Vue {
    @userModule.Getter logo!: string
}
</script>

<style module lang="scss">
.main-navbar {
    width: 140px;
    height: 100vh;
    color: #fff;
    font-size: 20px;
    background-color: #001629;
    overflow: auto;
    > .logo {
        display: block;
        width: auto;
        height: 40px;
        max-width: 100px;
        object-fit: cover;
        margin: 10px auto 30px;
    }
    > .menu-wrap {
        height: calc(100vh - 80px);
        overflow: auto;
    }
    .icon {
        vertical-align: -3px;
        margin-right: 8px;
    }
    .title {
        font-size: 14px;
        font-weight: normal;
    }
}

</style>
<style scoped lang="scss">
::v-deep {
    .el-menu {
        border: none;
        padding-left: 17px;
        .el-menu {
            padding-left: 22px;
        }
    }
    .el-menu-item,
    .el-submenu__title {
        line-height: 20px !important;
        height: 20px !important;
        padding: 0 0 0 0 !important;
        margin-bottom: 20px;
        min-width: auto !important;
    }
    .is-opened {
        .el-submenu__icon-arrow {
            transform: translateY(3px) scale(.8) rotateZ(180deg) !important;
        }
    }
    .el-submenu__icon-arrow {
        color: #fff;
        font-size: 12px;
        right: 10px;
        transform: translateY(3px) scale(.8);
    }
}

</style>
