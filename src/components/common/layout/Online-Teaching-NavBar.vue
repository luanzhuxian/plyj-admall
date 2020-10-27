<template>
    <nav :class="$style.onlineTeaching">
        <div :class="$style.head">
            <router-link :to="{ name: 'Home' }">
                <img :class="$style.logo" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png" alt="">
            </router-link>
            <div :class="$style.info">
                <div :class="$style.store">
                    <img :class="$style.headPhoto" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/yonghu.png" alt="">
                    <div>{{ mallName }}</div>
                </div>
                <div :class="$style.user">
                    <div>企业管理员：</div>
                    <el-tooltip effect="light" :content="idName" placement="top">
                        <div :class="$style.userName">{{ idName }}</div>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div :class="$style.menu">
            <div
                @click="target(item)"
                :class="{
                    [$style.menuItem]: true,
                    [$style.isActive]: isActive(item.route)($route.matched),
                    [$style.disabled]: !hasLiveModule
                }"
                v-for="item in menuList"
                :key="item.route"
            >{{ item.name }}</div>
        </div>
    </nav>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { getRoomStatus } from './../../../apis/product-center/online-teaching/live'
const userModule = namespace('user')

interface MenuItem {
    name: string;
    route: string;
}

@Component
export default class OnlineTeachingNavBar extends Vue {
    @userModule.Getter('idName') idName!: string
    @userModule.Getter('mallName') mallName!: string

    hasLiveModule = false
    menuList: MenuItem[] = [
        {
            name: '云课堂',
            route: 'FunctionPack'
        },
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

    async created () {
        const { result: { enable } }: any = await getRoomStatus()
        // 未开通直播, 先购买房间 3 未开通
        this.hasLiveModule = enable !== 3
    }

    private isActive = (routeName: string) => (matched: any[]) => matched.some((item: any) => item.name === routeName)

    private target ({ route: name }: MenuItem) {
        if (!this.hasLiveModule) return
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
        .logo {
            width: 100px;
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
        > .menu-item {
            padding: 10px 20px;
            cursor: pointer;
            &:nth-of-type(1) {
                margin-top: 34px;
                padding: 6px 20px;
                cursor: pointer;
            }
            &:nth-of-type(n + 2) {
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
                background-color: #4f63ff !important;
            }
        }
        > .disabled {
            cursor: no-drop;
        }
    }
}

</style>
