<template>
    <nav :class="$style.mainNavbar">
        <img
            :class="$style.logo"
            src="https://mallcdn.youpenglai.com/static/admall/category/yaji.png"
            alt="logo"
        >
        <div :class="$style.menuWrap">
            <el-menu
                text-color="#b3b9bf"
                active-text-color="#fff"
                background-color="#001629"
                unique-opened
            >
                <el-menu-item index="1">
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
                    <el-menu-item index="2-1">面授课程</el-menu-item>
                    <el-menu-item index="2-2">直播课</el-menu-item>
                    <el-menu-item index="2-3">云课堂</el-menu-item>
                    <el-menu-item index="2-4">教育周边</el-menu-item>
                    <el-menu-item index="2-5">分类管理</el-menu-item>
                    <el-menu-item index="2-6">素材中心</el-menu-item>
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
                    <el-menu-item index="3-1">会员管理</el-menu-item>
                    <el-menu-item index="3-2">helper管理</el-menu-item>
                </el-submenu>

                <el-menu-item index="1">
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
                    <el-menu-item index="5-1">面授课程订单</el-menu-item>
                    <el-menu-item index="5-2">云课堂订单</el-menu-item>
                    <el-menu-item index="5-3">教育周边订单</el-menu-item>
                    <el-menu-item index="5-4">分销订单</el-menu-item>
                    <el-menu-item index="5-5">售后单</el-menu-item>
                    <el-menu-item index="5-6">发票申请</el-menu-item>
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
                    <el-menu-item index="6-1">我的店铺</el-menu-item>
                    <el-menu-item index="6-2">模板中心</el-menu-item>
                    <el-menu-item index="6-3">我的模板箱</el-menu-item>
                    <el-menu-item index="6-4">品宣主页</el-menu-item>
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
                    <el-menu-item index="7-1">账号管理</el-menu-item>
                    <el-menu-item index="7-2">店铺信息</el-menu-item>
                    <el-menu-item index="7-3">公众号服务</el-menu-item>
                    <el-menu-item index="7-4">物流设置</el-menu-item>
                    <el-menu-item index="7-5">我订购的服务</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
    </nav>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
export default class MainNavbar extends Vue {
}
</script>

<style module lang="scss">
    .main-navbar {
        width: 120px;
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
                padding-left: 10px;
            }
        }
        .el-menu-item, .el-submenu__title {
            line-height: 20px !important;
            height: 20px !important;
            padding: 0 0 0 0 !important;
            margin-bottom: 20px;
            min-width: auto !important;
        }
        .el-submenu__icon-arrow {
            color: #fff;
            font-size: 12px;
            right: 10px;
            vertical-align: -2px;
        }
    }
</style>
