<template>
    <nav :class="$style.mainNavbar">
        <img
            :class="$style.logo"
            v-imgError="'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo-white.png'"
            :src="logo || 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo-white.png'"
            alt="logo"
        >
        <div :class="$style.menuWrap">
            <el-menu
                ref="menu"
                text-color="#b3b9bf"
                active-text-color="#fff"
                background-color="#001629"
                unique-opened
                router
                :default-active="defaultActive"
                :default-openeds="defaultOpeneds"
            >
                <el-menu-item index="1" :route="{ name: 'Home' }">
                    <h2 :class="$style.title">
                        <i class="yaji-icon icon-shouye" :class="$style.icon" />
                        <span>首页</span>
                    </h2>
                </el-menu-item>

                <el-submenu index="2" :disabled="!appId">
                    <h2 :class="$style.title" slot="title">
                        <i class="yaji-icon icon-kecheng" :class="$style.icon" />
                        <span>产品中心</span>
                    </h2>
                    <el-menu-item index="2-1" :route="{ name: 'LineTeaching' }">云课堂</el-menu-item>
                    <el-menu-item index="2-2" :route="{ name: 'GoodsManage' }">我的商品</el-menu-item>
                    <el-menu-item index="2-3" :route="{ name: 'CoursesManage' }">我的课程</el-menu-item>
                    <el-menu-item index="2-4" :route="{ name: 'CategoryManage' }">分类管理</el-menu-item>
                    <el-menu-item index="2-5" :route="{ name: 'CommentManage' }">评价管理</el-menu-item>
                    <el-menu-item index="2-6" :route="{ name: 'Recommend' }">推荐榜单</el-menu-item>
                </el-submenu>

                <el-submenu index="3" :disabled="!appId">
                    <h2 :class="$style.title" slot="title">
                        <i class="yaji-icon icon-vip" style="font-size: 14px;" :class="$style.icon" />
                        <span>用户中心</span>
                    </h2>
                    <el-menu-item index="3-1" :route="{ name: 'MemberManage' }">用户管理</el-menu-item>
                    <el-menu-item index="3-2" :route="{ name: 'HelperManage' }">Helper管理</el-menu-item>
                </el-submenu>

                <el-submenu index="4" :disabled="!appId">
                    <h2 :class="$style.title" slot="title">
                        <i class="yaji-icon icon-dingdan" :class="$style.icon" />
                        <span>订单中心</span>
                    </h2>
                    <el-menu-item index="4-1" :route="{ name: 'GoodsOrder' }">商品订单</el-menu-item>
                    <el-menu-item index="4-2" :route="{ name: 'CourseOrder' }">课程订单</el-menu-item>
                    <el-menu-item index="4-3" :route="{ name: 'OnlineSchoolOrder' }">网校订单</el-menu-item>
                    <el-menu-item index="4-6" :route="{ name: 'RightGoodsOrder' }">权益商品订单</el-menu-item>
                    <el-menu-item index="4-4" :route="{ name: 'Backorder' }">售后单</el-menu-item>
                    <el-menu-item index="4-5" :route="{ name: 'Invoice' }">发票管理</el-menu-item>
                </el-submenu>

                <el-submenu index="5" :disabled="!appId">
                    <h2 :class="$style.title" slot="title">
                        <i class="yaji-icon icon-zijin" :class="$style.icon" />
                        <span>财务中心</span>
                    </h2>
                    <el-menu-item index="5-1" :route="{ name: 'RunbiManage' }">润笔管理</el-menu-item>
                    <el-menu-item index="5-2" :route="{ name: 'WithdrawDepositManage' }">提现管理</el-menu-item>
                </el-submenu>

                <el-submenu index="6" :disabled="!appId">
                    <h2 :class="$style.title" slot="title">
                        <i class="yaji-icon icon-dianpu" :class="$style.icon" />
                        <span>店铺管理</span>
                    </h2>
                    <el-menu-item index="6-1" :route="{ name: 'MallMain' }">我的店铺</el-menu-item>
                    <el-menu-item index="6-2" :route="{ name: 'MallThemes' }">模板中心</el-menu-item>
                    <el-menu-item index="6-3" :route="{ name: 'OrgIndex' }">品宣主页</el-menu-item>
                    <!--<el-menu-item index="5-4" route="6-4">草稿箱</el-menu-item>-->
                </el-submenu>

                <el-menu-item index="9" :disabled="!appId" :route="{ name: 'ReservationManage' }">
                    <h2 :class="$style.title">
                        <i class="yaji-icon icon-time" :class="$style.icon" />
                        <span>预约管理</span>
                    </h2>
                </el-menu-item>

                <el-submenu index="7" :disabled="!mallNumber">
                    <h2 :class="$style.title" slot="title">
                        <i class="yaji-icon icon-shezhi" :class="$style.icon" />
                        <span>基础设置</span>
                    </h2>
                    <el-menu-item :disabled="!appId" index="7-1" :route="{ name: 'AccountManage' }">账号管理</el-menu-item>
                    <el-menu-item :disabled="!appId" index="7-2" :route="{ name: 'ShopInfo' }">店铺信息</el-menu-item>
                    <el-menu-item index="7-3" :route="{ name: 'Wechat' }">公众号服务</el-menu-item>
                    <el-menu-item :disabled="!appId" index="7-4" :route="{ name: 'Logistics' }">物流设置</el-menu-item>
                    <el-menu-item :disabled="!appId" index="7-5" :route="{ name: 'SubscriptionService' }">我订购的服务</el-menu-item>
                </el-submenu>

                <!--<el-menu-item index="9" :disabled="!appId" :route="{ name: 'ReservationManage' }" style="padding-left: 0;">
                    <h2 :class="$style.title" slot="title">
                        <pl-svg
                            name="icon-time-8a40e"
                            width="15"
                            height="15"
                            fill="#fff"
                            :class="$style.icon"
                        />
                        <span>预约管理</span>
                    </h2>
                </el-menu-item>-->

                <el-menu-item index="8" :route="{ name: 'MarketingManage' }" :class="$style.marketing" :disabled="!appId">
                    <h2 :class="$style.title">
                        <pl-svg
                            name="icon-yxzx"
                            width="16"
                            height="16"
                            :class="$style.icon"
                        />
                        <span>营销中心</span>
                    </h2>
                </el-menu-item>

                <div :class="$style.showGuid" @click="showGuid = true">
                    <h2 :class="$style.title" slot="title">
                        <i class="yaji-icon icon-tishi" :class="$style.icon" />
                        <span class="el-menu-item__title">操作引导</span>
                    </h2>
                </div>
            </el-menu>
        </div>

        <OperationGuide :show.sync="showGuid" />
    </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import OperationGuide from './Operation-Guide.vue'
const userModule = namespace('user')

@Component({
    components: {
        OperationGuide
    }
})
export default class MainNavbar extends Vue {
    showGuid = false
    defaultActive = ''
    defaultOpeneds: string[] = []
    @userModule.Getter logo!: string
    @userModule.Getter mchId!: string
    @userModule.Getter appId!: string
    @userModule.Getter mallNumber!: string
    @userModule.Getter routeNames!: Map<string, string>

    @Watch('$route', { immediate: true })
    onRouteChange (route: Route) {
        const indexs = route.matched.map(item => item.meta?.index || '')
        const opened = indexs[0] || ''
        const activited = indexs[1] || ''
        if (opened) {
            this.defaultOpeneds = [opened]
            this.defaultActive = opened === '8' ? '8' : (activited || opened)
        }
        this.showGuid = false
    }

    mounted () {
        if (this.mallNumber && !this.mchId && this.$route.name === 'Home') {
            // 未开通支付，一直弹操作引导
            this.showGuid = true
        }

        // 隐藏没有权限的菜单
        this.$nextTick(() => {
            const keys = [...this.routeNames.values()]
            const { submenus, items: menuItems } = this.$refs.menu as any
            for (const k of Object.keys(submenus)) {
                const submenu = submenus[k]
                if (!keys.includes(`2-${ submenu.index }`)) {
                    submenu.$el.style.display = 'none'
                }
            }
            for (const k of Object.keys(menuItems)) {
                const menuItem = menuItems[k]
                if (!keys.includes(`2-${ menuItem.index }`)) {
                    menuItem.$el.style.display = 'none'
                }
            }
        })
    }
}
</script>

<style module lang="scss">
.main-navbar {
    width: 140px;
    height: 100vh;
    color: #fff;
    font-size: 20px;
    background-color: #001629;

    > .logo {
        display: block;
        width: 100%;
        height: 100%;
        max-height: 40px;
        max-width: 100px;
        object-fit: contain;
        margin: 10px auto 30px;
    }
    > .menu-wrap {
        position: relative;
        height: calc(100vh - 80px);
        overflow-y: auto;
        overflow-x: hidden;
    }
    .marketing {
        position: absolute;
        left: 0;
        top: 530px;
        width: 140px;
    }
    .icon {
        vertical-align: -3px;
        margin-right: 8px;
        &:before {
            font-size: 15px;
            color: #b2b9be;
        }
    }
    .title {
        font-size: 14px;
        font-weight: normal;
    }
    .show-guid {
        position: absolute;
        left: 0;
        top: 570px;
        width: 140px;
        padding-left: 17px;
        line-height: 42px;
        color: rgb(179, 185, 191);
        cursor: pointer;
    }
}

</style>
<style scoped lang="scss">
::v-deep {
    .el-menu {
        border: none;
        .el-menu-item,
        .el-submenu__title {
            line-height: 40px !important;
            height: 40px !important;
            min-width: auto !important;
            padding-left: 17px !important;
            svg {
                opacity: 0.7;
            }
            &.is-active {
                background-color: $--color-primary-blue !important;
                svg {
                    opacity: 1;
                }
            }
        }
    }
    .el-submenu {
        .el-menu-item {
            padding-left: 40px !important;
        }
    }
    .el-submenu__title {
        padding-left: 17px !important;
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
