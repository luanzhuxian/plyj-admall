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
            <router-link
                tag="div"
                :class="$style.notice"
                class="pointer"
                to="/admall/notification"
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
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
// import actions from '../../micro/shared/actions'

@Component
export default class Header extends Vue {
    // computed
    @userModule.Getter('mallName') mallName!: string
    @userModule.Getter('bindPhone') bindPhone!: string
    @userModule.Getter('auditStatus') auditStatus!: string

    @userModule.Mutation('LOGOUT') LOGOUT!: Function

    async command (command: string) {
        if (command === 'logout') {
            await this.LOGOUT()
            this.$router.push({ name: 'PhoneLogin' })
        }
        if (command === 'modify') return this.$router.push({ name: 'ModifyPassword' })
    }

    // mounted () {
    //     actions.onGlobalStateChange(state => {
    //         console.log(state)
    //     })
    // }
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
</style>
