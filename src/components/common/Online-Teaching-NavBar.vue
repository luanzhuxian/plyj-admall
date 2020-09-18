<template>
    <nav :class="$style.onlineTeaching">
        <div :class="$style.head">
            <img :class="$style.logo" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png" alt="">
            <div :class="$style.info">
                <div :class="$style.store">
                    <img :class="$style.headPhoto" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/yonghu.png" alt="">
                    <div>朋来雅集测试商城</div>
                </div>
                <div :class="$style.user">
                    <div>企业管理员：</div>
                    <el-tooltip effect="light" content="Ramon王琦" placement="top">
                        <div :class="$style.userName">Ramon王琦</div>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div :class="$style.menu">
            <div
                @click="target({ route: 'LineTeaching' })"
                :class="{
                    [$style.menuTitle]: true,
                    [$style.isActive]: activeRoute === 'LineTeaching'
                }"
            >云课堂</div>
            <div
                @click="target(item)"
                :class="{
                    [$style.menuItem]: true,
                    [$style.isActive]: activeRoute === item.route
                }"
                v-for="item in menuList"
                :key="item.route"
            >{{ item.name }}
            </div>
        </div>
    </nav>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

interface MenuItem {
    name: string;
    route: string;
}

@Component
export default class OnlineTeachingNavBar extends Vue {
    activeRoute = 'Live'
    menuList: MenuItem[] = [
        {
            name: '互动直播',
            route: 'Live'
        },
        {
            name: '知识课程管理',
            route: 'KnowledgeCourse'
        },
        {
            name: '系列课',
            route: 'SeriesOfCourses'
        },
        {
            name: '图文资料',
            route: 'BooksMaterials'
        },
        {
            name: '视频库',
            route: 'LibraryVideo'
        },
        {
            name: '资源库',
            route: 'LibraryRepository'
        }
    ]

    private target ({ route: name }: MenuItem) {
        this.activeRoute = name
        this.$router.push({ name })
    }
}
</script>

<style lang='scss' module>

.online-teaching {
    width: 140px;
    height: 100vh;
    background-color: #fff;
    > .head {
        box-sizing: border-box;
        padding: 20px;
        border-bottom: 1px solid #e7e7e7;
        text-align: center;
        > .logo {
            width: 100%;
            margin-bottom: 34px;
        }
        > .info {
            > .store {
                margin-bottom: 28px;
                font-size: 14px;
                font-weight: 600;
                > .head-photo {
                    width: 48px;
                    height: 48px;
                    margin-bottom: 10px;
                    border-radius: 50%;
                }
            }
            > .user {
                font-size: 12px;
                .user-name {
                    width: 100%;
                    margin-top: 5px;
                    font-size: 14px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    > .menu {
        box-sizing: border-box;
        font-size: 14px;
        > .menu-title {
            margin-top: 34px;
            padding: 6px 20px;
            cursor: pointer;
            &:hover {
                color: #4f63ff;
                background-color: #f5f6fa;
                &:before {
                    background-color: #4f63ff;
                }
            }
        }
        > .menu-item {
            padding: 10px 20px;
            cursor: pointer;
            &:before {
                display: inline-block;
                width: 4px;
                height: 4px;
                margin-right: 8px;
                border-radius: 50%;
                vertical-align: middle;
                background-color: #e7e7e7;
                content: '';
            }
            &:hover {
                color: #4f63ff;
                background-color: #f5f6fa;
                &:before {
                    background-color: #4f63ff;
                }
            }
        }
        > .is-active {
            color: #4f63ff;
            background-color: #f5f6fa;
            &:before {
                background-color: #4f63ff;
            }
        }
    }
}

</style>
