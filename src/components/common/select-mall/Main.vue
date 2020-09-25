<template>
    <el-dialog
        title="切换店铺"
        :visible="show"
        width="732px"
        :show-close="showClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
    >
        <div :class="$style.selectMall">
            <template v-for="(mall, i) of mallList">
                <div
                    :key="i"
                    :class="$style.mallItem"
                    @click="select(mall)"
                    v-if="mall.mallId"
                >
                    <!-- 有商城 -->
                    <img
                        v-imgError="'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo-d.png'"
                        :class="$style.mallLogo"
                        :src="mall.mallLogoUrl"
                        alt="logo"
                    >
                    <div>
                        <div :class="$style.mallName" v-text="mall.mallName" class="fz-16 font-weight-bold" />
                        <div>
                            <span>我的账户：</span>
                            <span v-text="roleMap[mall.roleCode]" />
                        </div>
                    </div>
                </div>
            </template>

            <!-- 光有账号，没商城 -->
            <div v-if="enterpriseAdminId === 0" :class="$style.mallItem" @click="createMall">
                <i :class="$style.add" class="el-icon-plus" />
                <div>
                    <div class="fz-16 font-weight-bold">我要开店</div>
                    <div>快速创建自己的店铺</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
@Component
export default class SelectMall extends Vue {
    private show = false
    private showClose = true
    // 原始机构列表数据
    private agencyList: any[] = []
    // 处理后的已商城为维度的数据
    private mallList: any[] = []
    private roleMap: DynamicObject = {}

    @Watch('show')
    onShowChange (val: boolean) {
        if (val) {
            this.mallList = this.formatAgencyList()
        }
    }

    // computed
    // 找出企业管理员账号，如果有，且这个账号名下没有店铺，则可以创建店铺
    get enterpriseAdminId () {
        const ADMIN = this.agencyList.find(item => item.roleCode === 'ENTERPRISE_ADMIN')
        return ADMIN ? ADMIN.mallIds.length : -1
    }

    // 将解构数据列表重置为商城数据列表
    formatAgencyList () {
        const mallList = []
        for (const agency of this.agencyList) {
            const mall = {
                roleCode: agency.roleCode,
                agencyName: agency.enterpriseName,
                agencyCode: agency.enterpriseId,
                mallLogoUrl: '',
                mallId: '',
                mallName: ''
            }
            // 如果已经创建商城，处理商城数据
            if (agency.mallIds.length) {
                for (const mallInfo of agency.mallIds) {
                    Object.assign(mall, mallInfo)
                    mallList.push(mall)
                }
            } else {
                mallList.push(mall)
            }
        }
        return mallList
    }

    select (mall: DynamicObject) {
        this.$emit('confirm', mall)
        this.show = false
    }

    close () {
        this.$emit('close')
        this.show = false
    }

    // 创建店铺
    createMall () {
        this.$emit('confirm', {
            roleCode: 'ENTERPRISE_ADMIN',
            agencyCode: this.enterpriseAdminId,
            mallId: ''
        })
        this.show = false
    }
}
</script>

<style module lang="scss">
    .select-mall {
        display: grid;
        grid-template-columns: 287px 287px;
        grid-template-rows: 132px 132px;
        grid-gap: 30px;
        padding: 16px 36px;
    }
    .mall-item {
        position: relative;
        display: flex;
        align-items: center;
        width: 287px;
        height: 132px;
        padding: 0 36px;
        border: 1px solid $--border-color;
        box-sizing: border-box;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
        &:before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            height: 4px;
            width: 100%;
            background-color: #eee;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }
        &:hover:before {
            background-color: $--color-primary-blue;
        }
        > .add {
            width: 60px;
            margin-right: 10px;
            font-size: 30px;
            text-align: center;
            line-height: 60px;
            color: $--color-primary-blue;
            background-color: #F5F6FA;
            border-radius: 30px;
        }
    }
    .mall-logo {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        object-fit: cover;
        border-radius: 30px;
    }
    .mall-name {
        margin-bottom: 4px;
    }
</style>
