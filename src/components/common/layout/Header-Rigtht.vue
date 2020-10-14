<template>
    <div :class="$style.headerRight">
        <div :class="$style.right">
            <!-- 访问店铺 -->
            <div :class="$style.visitShop">
                <img @click="showMallUrl = true" width="15" class="pointer" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/shangchengguanli.png" alt="">
                <span @click="visitMall" class="pointer">访问店铺</span>
                <shop-modal :show-mall-url="showMallUrl" @close="closeShopModal" />
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
                <i v-if="messageCount" :class="$style.mark" />
            </router-link>

            <div :class="$style.user" @mouseenter="showPop = true" @mouseleave="showPop = false">
                <img
                    :class="$style.avatar"
                    src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/yonghu.png"
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
                            <div>登录账户</div>
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

    @userModule.Mutation(MutationTypes.logout) LOGOUT!: Function
    @userModule.Action(MutationTypes.getAgencyList) getAgencyList!: Function
    @userModule.Action('selectMall') selectMall!: Function
    @userModule.Getter('bindPhone') bindPhone!: string
    @userModule.Getter('auditStatus') auditStatus!: string
    @userModule.Getter('currentRoleCode') currentRoleCode!: string
    @userModule.Getter('agencyCode') agencyCode!: string
    @userModule.Getter('mallNumber') mallNumber!: number
    @Getter('roleMap') roleMap!: any

    @Watch('$route')
    async onRouteChange () {
        this.showPop = false
        this.showMallUrl = false
    }

    async mounted () {
        await this.getMessageCount()
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
        await this.getAgencyList(true)
        const { changed } = await this.selectMall()
        if (changed) {
            location.replace('/')
        }
    }

    closeShopModal () {
        this.showMallUrl = false
    }

    visitMall () {
        this.mallNumber ? this.showMallUrl = true : this.showCreateMall = true
    }

    async getMessageCount () {
        const { result } = await getNotificationSmallMark({
            toAgencyCode: this.agencyCode
        })
        this.messageCount = Number(result) || 0
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
            width: 20px;
            height: 20px;
            margin-right: 4px;
        }
        .mobile {
            font-size: 14px;
        }
        .pop {
            position: absolute;
            right: 0;
            top: 26px;
            width: 226px;
            background-color: #fff;
            z-index: 10;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.08);
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
        margin-right: 32px;
        > img {
            margin-right: 6px;
        }
    }
</style>
