<template>
    <el-dialog
        class="select-video"
        :visible="show"
        width="65%"
        title="选择所属账号"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <div class="current-account-info" v-if="currentUserInfo.mallUserId || currentUserInfo.id">
            <p>
                <b>Helper用户</b>
                <span>{{ currentUserInfo.userName || currentUserInfo.name }}({{ currentUserInfo.mobile }})</span>
            </p>
            <p>
                <b>当前所属账号</b>
                <span>{{ currentUserInfo.ownedUser? currentUserInfo.ownedUser : '--' }}</span>
                <span v-if="currentUserInfo.ownedMobile"> ({{ currentUserInfo.ownedMobile }})</span>
            </p>
        </div>
        <el-form :inline="true">
            <el-form-item>
                <el-input
                    clearable
                    @change="getList"
                    v-model="filterForm.keyword"
                    placeholder="请输入真实姓名/手机号"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    @click="getList"
                    type="primary"
                >
                    查询
                </el-button>
            </el-form-item>
        </el-form>

        <el-table :data="table">
            <el-table-column
                prop="name"
                label="真实姓名"
            />
            <el-table-column
                prop="mobile"
                label="手机号（账户）"
            />
            <el-table-column
                prop="roleName"
                label="角色"
            />
            <el-table-column
                prop="helperNumber"
                label="管理Helper数量"
            />
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button
                        v-if="row.baseUserId === currentUserInfo.mallUserId"
                        disabled="disabled"
                        type="text"
                    >
                        已选择
                    </el-button>
                    <el-button
                        v-else
                        type="text"
                        @click="changeHelperAccount(row)"
                    >
                        选择
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import { changeHelpersAccount } from '../../../../apis/member'
import { getOwnedAccountList } from '../../../../apis/account'
export default {
    name: 'ChangeOwnerDialog',
    components: {
    },
    props: {
        show: Boolean,
        currentUserId: {
            type: String,
            default: ''
        },
        currentUserInfo: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            filterForm: {
                mallUserId: '',
                current: 1,
                size: 10
            },
            table: []
        }
    },
    watch: {
        async show (val) {
            if (val) {
                await this.getList()
            }
        }
    },
    methods: {
        // 备注
        async getList () {
            try {
                const { result } = await getOwnedAccountList(this.filterForm)
                this.table = result.records
            } catch (e) {
                throw e
            }
        },
        restForm () {
            this.filterForm = {
                mallUserId: '',
                current: 1,
                size: 10
            }
        },
        async changeHelperAccount (data) {
            try {
                await changeHelpersAccount({
                    ownerUserId: data.baseUserId,
                    userId: this.currentUserId
                })
                this.$success('变更成功！')
                this.$emit('success')
                this.restForm()
                this.getList()
            } catch (e) {
                throw e
            }
        },
        closeHandler () {
            this.$emit('update:show', false)
            this.$emit('close')
        }
    }
}
</script>

<style scoped lang="scss">
    .current-account-info {
        display: grid;
        margin-top: 14px;
        margin-bottom: 30px;
        padding: 26px 29px;
        border-radius: 20px;
        grid-template-columns: repeat(2, 48%);
        grid-row-gap: 24px;
        background-color: #F5F6FA;
        font-size: 16px;
        > p > b {
            margin-right: 10px;
        }
    }
</style>
