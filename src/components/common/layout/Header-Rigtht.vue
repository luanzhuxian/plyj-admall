<template>
    <div :class="$style.headerRight">
        <!-- 访问店铺 -->
        <div :class="$style.visitShop">
            <img @click="showMallUrl = true" width="15" class="pointer" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/shangchengguanli.png" alt="">
            <span
                :class="$style.visitMall"
                @clise="visitMall"
                class="pointer"
            >
                访问店铺
            </span>
            <shop-modal v-if="this.mallNumber" :show-mall-url="showMallUrl" />
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
                name="icon-tongzhi"
                width="15"
                height="18"
            />
            <span>通知中心</span>
            <i v-if="messageCount" :class="$style.mark" />
        </router-link>

        <div :class="$style.user" @mouseenter="showPop = true" @mouseleave="showPop = false">
            <img
                :class="$style.avatar"
                :src="headImgUrl || 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/yonghu.png'"
                alt="avatar"
            >
            <span :class="$style.mobile">{{ bindPhone | formatAccount }}</span>
            <span class="el-icon-arrow-right fz-12" />

            <transition name="fade">
                <div v-show="showPop" :class="$style.pop">
                    <div :class="$style.popItem" class="pointer" @click="selectMallBtn">
                        切换店铺
                    </div>
                    <div :class="$style.popItem" class="pointer" @click="setAccount">
                        <div>查看账户</div>
                        <div>
                            <div>{{ roleMap[currentRoleCode] }}</div>
                            <div>{{ bindPhone | formatAccount }}</div>
                        </div>
                    </div>
                    <div :class="$style.popItem" class="pointer" @click="logout">
                        退出登录
                    </div>
                    <!--<div :class="$style.popItem" class="pointer" @click="modify">
                            修改密码
                        </div>-->
                </div>
            </transition>
        </div>
        <CreateMall :created-mall-show.sync="showCreateMall" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CreateMall from '../select-mall/Create-Mall.vue'
import { Getter, namespace } from 'vuex-class'
import { Watch } from 'vue-property-decorator'
import ShopModal from '@/components/common/layout/Shop-Modal.vue'
import { MutationTypes } from '@/store/mutation-type'
import { getNotificationSmallMark } from '../../../apis/base/message'
import Cookie from '../../../assets/ts/storage-cookie'
const userModule = namespace('user')
@Component({
    components: {
        ShopModal,
        CreateMall
    }
})
export default class HeaderRigtht extends Vue {
    private showCreateMall = false
    private mallQrcode = ''
    private showMallUrl = false
    private showPop = false
    private messageCount = 0
    private loaded = false

    @userModule.Mutation(MutationTypes.logout) LOGOUT!: Function
    @userModule.Action(MutationTypes.getAgencyList) getAgencyList!: Function
    @userModule.Action('selectMall') selectMall!: Function
    @userModule.Getter('bindPhone') bindPhone!: string
    @userModule.Getter('auditStatus') auditStatus!: string
    @userModule.Getter('currentRoleCode') currentRoleCode!: string
    @userModule.Getter('agencyCode') agencyCode!: string
    @userModule.Getter('mallNumber') mallNumber!: number
    @userModule.Getter('headImgUrl') headImgUrl!: string

    @Getter('roleMap') roleMap!: any

    @Watch('$route', { immediate: true })
    async onRouteChange (to: Route) {
        this.showPop = false
        this.showMallUrl = false
        this.showCreateMall = Boolean(to.query.showCreateMall)
    }

    async mounted () {
        await this.getMessageCount()
        await this.$nextTick()
        this.showCreateMall = !this.mallNumber
    }

    // 退出登录
    async logout () {
        await this.$confirm('您确定退出登录吗？')
        await this.LOGOUT()
        await this.$router.push({ name: 'PhoneLogin' })
    }

    // 修改密码
    modify () {
        this.$router.push({ name: 'ModifyPassword' })
    }

    // 修改账户
    setAccount () {
        this.$router.push({ name: 'AccountSet' })
    }

    async selectMallBtn () {
        const list = await this.getAgencyList(true)
        if (list.length === 1 && list.some((item: any) => item.roleCode === 'ENTERPRISE_ADMIN')) {
            this.$warning('暂无可切换店铺')
            return
        }
        const data = await this.selectMall()
        // 商城已切换
        if (data.changed) {
            location.replace('/')
            return
        }
        // 商城未切换，但是检测到未创建商城，直接弹出创建弹框
        if (!data.mallId) {
            this.showCreateMall = true
        }
    }

    visitMall () {
        if (!this.mallNumber) this.showCreateMall = true
    }

    async getMessageCount () {
        if (!Cookie.get('NOTICE_MARK_TIME')) {
            Cookie.set('NOTICE_MARK_TIME', 1, {
                expires: Date.now() + 2000
            })
            const { result } = await getNotificationSmallMark({
                toAgencyCode: this.agencyCode
            })
            this.messageCount = Number(result) || 0
        }
    }
}
</script>

<style module lang="scss">
    .header-right {
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
            &:hover {
                color: $--color-primary-blue;
            }
        }
        .user {
            position: relative;
            display: inline-flex;
            align-items: center;
            margin-left: 20px;
            padding-left: 20px;
            border-left: 1px solid $--color-gray-5;
        }
        .avatar {
            width: 30px;
            height: 30px;
            margin-right: 4px;
            border-radius: 15px;
            object-fit: cover;
        }
        .mobile {
            font-size: 14px;
        }
        .pop {
            position: absolute;
            right: 0;
            top: 40px;
            width: 226px;
            background-color: #fff;
            z-index: 10;
            box-shadow: 0 3px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #eee;
        }
        .pop-item {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            &:hover {
                background-color: $--color-primary-blue;
                color: #fff;
            }
            > div {
                margin-right: 34px;
                display: inline-flex;
                flex-direction: column;
                &:nth-last-of-type(1) {
                    margin-right: 0;
                }
            }
        }
    }
    .visit-shop {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: 376px;
        height: 60px;
        justify-content: flex-end;
        margin-right: 32px;
        > img {
            margin-right: 6px;
        }
        &:hover {
            .visit-mall {
                color: $--color-primary-blue;
            }
            > div {
                display: block;
                opacity: 1;
                transform: translateY(60px);
            }
        }
    }
</style>
