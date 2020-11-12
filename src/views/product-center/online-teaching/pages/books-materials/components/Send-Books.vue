<template>
    <el-dialog
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="show"
        @close="close"
        title="选择用户"
        class="add-users-dialog"
        width="758px"
    >
        <div class="main">
            <div class="selected-users">
                <div class="title">
                    <el-form :rules="rules" :model="searchForm">
                        <el-form-item
                            prop="mobile"
                            :error="error"
                        >
                            <el-select
                                :loading="loading"
                                :value="searchForm.mobile"
                                :remote-method="searchMobile"
                                @change="selectChange"
                                @blur="selectBlur"
                                placeholder="请输入手机号添加学员"
                                autocomplete="off"
                                reserve-keyword
                                filterable
                                clearable
                                remote
                            >
                                <template v-for="(item, index) in mobileOptions">
                                    <el-option
                                        :disabled="!item.isSelected"
                                        :key="index"
                                        :label="item.mobile + '(' + (item.name || item.nickName) + ')'"
                                        :value="item.mobile"
                                    />
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="content" v-if="selectedUsers.length">
                    <div
                        class="item"
                        v-for="item of selectedUsers"
                        :key="item.userId"
                    >
                        <div :title="item.name || item.nickName">
                            {{ item.name || item.nickName }}
                        </div>
                        <pl-svg v-if="cannotDeleteUserIds.indexOf(item.userId) === -1" name="icon-close" width="14" @click="deleteUsers(item)" />
                    </div>
                </div>
                <div class="no-content" v-else>
                    暂无用户
                </div>
                <div class="bottom">
                    <el-button round @click="close">
                        取消
                    </el-button>
                    <el-button type="primary" round :disabled="!isUpdate" @click="confirm">
                        确认
                    </el-button>
                </div>
            </div>
            <div class="tag-group">
                <template v-if="tabGrade === 1">
                    <div class="title">
                        <pl-svg name="icon-users-2c1df" width="20" />
                        我的组群
                    </div>
                    <div class="content">
                        <template v-if="userGroup.length">
                            <div class="tag-item"
                                 v-for="item of userGroup"
                                 :key="item.id"
                                 @click="selectGroup(item)"
                            >
                                <b>{{ item.tagName.slice(0, 1) }}</b>
                                <span>{{ item.tagName }}</span>
                            </div>
                        </template>
                        <div class="no-content" v-else>
                            暂无用户分组
                        </div>
                    </div>
                </template>
                <template v-if="tabGrade === 2">
                    <div class="title">
                        <pl-svg name="icon-arrow-left" width="20" class="pointer" @click="back" />
                        {{ currentGroup.tagName }}
                    </div>
                    <div class="content">
                        <template v-if="currentTagUser.length">
                            <div class="user-item">
                                <span @click="selectAll = !selectAll">
                                    <i v-if="!selectAll" class="unselected" />
                                    <template v-if="selectAll">
                                        <pl-svg v-if="canSelectAll" name="icon-chenggong" width="20" fill="#598BF8" />
                                        <pl-svg v-else name="icon-chenggong" width="20" fill="#eee" class="disabled" />
                                    </template>
                                </span>
                                全选
                            </div>
                            <div class="user-item"
                                 v-for="item of currentTagUser"
                                 :key="item.userId"
                            >
                                <span @click="selectTagUser(item)">
                                    <i v-if="!item.checked" class="unselected" />
                                    <template v-if="item.checked">
                                        <pl-svg v-if="cannotDeleteUserIds.indexOf(item.userId) === -1" name="icon-chenggong" width="20" fill="#598BF8" />
                                        <pl-svg v-else name="icon-chenggong" width="20" fill="#eee" class="disabled" />
                                    </template>
                                </span>
                                {{ item.name || item.nickName }}
                            </div>
                        </template>
                        <div class="no-content" v-else>
                            该分组下暂无用户
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { testPhone } from '../../../../../../assets/ts/validate'
import { getTagList } from './../../../../../../apis/member'
import { getUserByPhone, getAllUserListByTagId } from './../../../../../../apis/product-center/online-teaching/live'
import { giveBooksMaterials, getGiveBooksMaterialsUser } from './../../../../../../apis/product-center/online-teaching/books-materials'
export default {
    name: 'SendBooks',
    components: {},
    props: {
        show: Boolean,
        booksId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            loading: false,
            searchForm: {
                mobile: ''
            },
            rules: {
                mobile: [
                    { validator: testPhone, message: '手机号不正确', trigger: 'blur' }
                ]
            },
            error: '',
            mobileOptions: [],
            selectedUsers: [],
            originalUsers: [],
            cannotDeleteUserIds: [], // 已经接受送课的用户禁止删除
            isUpdate: false,
            userGroup: [],
            tabGrade: 1, // 1-一级标签组 2-标签下的用户组
            currentGroup: {},
            currentTagUser: []
        }
    },
    watch: {
        show: {
            async handler (val) {
                if (val) {
                    try {
                        await this.getLiveSelectUsersInfo()
                        await this.getTagList()
                    } catch (e) {
                        throw e
                    }
                } else {
                    this.clearData()
                }
            }
        },
        selectedUsers () {
            this.isUpdate = this.justifyIsUpdate()
        }
    },
    computed: {
        selectAll: {
            get () {
                return this.currentTagUser.findIndex(item => !item.checked) === -1
            },
            set (val) {
                for (const item of this.currentTagUser) {
                    this.selectTagUser(item, val)
                    val ? this.handleSelect(item) : this.deleteUsers(item)
                }
            }
        },
        canSelectAll () { // 当前分组下的用户，有任何一个可以操作的用户，则全选按钮可操作
            return this.currentTagUser.some(item => this.cannotDeleteUserIds.indexOf(item.userId) === -1)
        }
    },
    methods: {
    // 获得用户分组标签和活动标签列表
        async getTagList () {
            try {
                const { result } = await getTagList()
                this.userGroup = result || []
            } catch (e) {
                throw e
            }
        },
        // 获得用户分组标签和活动标签列表
        async getLiveSelectUsersInfo () {
            try {
                const { result } = await getGiveBooksMaterialsUser(this.booksId)
                this.selectedUsers = result || []
                this.originalUsers = JSON.parse(JSON.stringify(this.selectedUsers))
                this.cannotDeleteUserIds = this.selectedUsers.filter(item => item.isWatch).map(item => item.userId)
            } catch (e) {
                throw e
            }
        },
        async searchMobile (query) {
            if (query !== '') {
                this.loading = true
                const params = {
                    current: 1,
                    size: 50,
                    mobile: query
                }
                try {
                    const { result } = await getUserByPhone(params)
                    this.loading = false
                    this.mobileOptions = result.records
                    this.hiddenSelectedUsers()
                    if (this.mobileOptions.length === 0) {
                        this.error = '该手机号不存在'
                    }
                } catch (e) {
                    this.loading = false
                    throw e
                }
            }
        },
        // 判断数据是否发生了变化
        justifyIsUpdate () {
            if (this.selectedUsers.length !== this.originalUsers.length) return true
            return this.selectedUsers.some(item => {
                const index = this.originalUsers.findIndex(iItem => item.userId === iItem.userId)
                if (index === -1) return true
                return false
            })
        },
        // 清空数据
        clearData () {
            this.loading = false
            this.isUpdate = false
            this.mobileOptions = []
            this.searchForm.mobile = ''
            this.error = ''
            this.tabGrade = 1
            this.userGroup = []
            this.currentGroup = {}
            this.currentTagUser = []
        },
        // 只显示未被选择的用户
        hiddenSelectedUsers () {
            this.mobileOptions = this.mobileOptions.map(item => {
                item.isSelected = this.selectedUsers.findIndex(iItem => item.userId === iItem.userId) === -1
                return item
            })
        },
        selectChange (val) {
            this.error = ''
            this.searchForm.mobile = val
            const selected = this.mobileOptions.find(item => item.mobile === val)
            if (selected) {
                this.handleSelect(selected)
            }
            this.selectTagUser(selected, true)
        },
        selectBlur (e) {
            this.error = ''
            const num = /\d+/.exec(e.target.value)
            if (num && !this.loading && this.searchForm.mobile) {
                this.searchForm.mobile = num[0]
                this.searchMobile(this.searchForm.mobile)
            }
        },
        // 直接选中用户
        handleSelect (selectItem) {
            if (!selectItem) return
            const isRepeat = this.selectedUsers.filter(item => item.userId === selectItem.userId).length
            if (!isRepeat) {
                this.selectedUsers.unshift({
                    userId: selectItem.userId,
                    mobile: selectItem.mobile,
                    name: selectItem.name,
                    nickName: selectItem.nickName
                })
                this.hiddenSelectedUsers()
            }
        },
        async selectGroup (item) {
            this.tabGrade = 2
            this.currentGroup = item
            try {
                const { result } = await getAllUserListByTagId(item.id)
                this.currentTagUser = result || []
                this.currentTagUser.map(item => {
                    item.checked = this.selectedUsers.findIndex(iItem => iItem.userId === item.userId) !== -1
                    return item
                })
            } catch (e) {
                throw e
            }
        },
        // 选择单个用户
        async selectTagUser (item, setVal) {
            if (!item) return
            const index = this.currentTagUser.findIndex(iItem => iItem.userId === item.userId)
            if (index === -1) return
            const currentUser = this.currentTagUser[index]
            const currentChecked = setVal !== undefined ? setVal : !currentUser.checked
            // 已经接受送课的学员不可取消选择
            if (!currentChecked && this.cannotDeleteUserIds.indexOf(item.userId) !== -1) return
            // 改变用户组选中状态
            currentUser.checked = currentChecked
            this.currentTagUser.splice(index, 1)
            this.currentTagUser.splice(index, 0, currentUser)
            currentUser.checked ? this.handleSelect(currentUser) : this.deleteUsers(item)
            this.selectChange('')
        },
        back () {
            this.tabGrade = 1
            this.currentGroup = {}
            this.currentTagUser = []
        },
        // 删除单个用户
        deleteUsers (item) {
            if (!item) return
            // 已经接受送课的学员不可删除
            if (this.cannotDeleteUserIds.indexOf(item.userId) !== -1) return
            const index = this.selectedUsers.findIndex(iItem => iItem.userId === item.userId)
            if (index === -1) return
            this.selectedUsers.splice(index, 1)
            this.selectTagUser(item, false)
            this.hiddenSelectedUsers()
        },
        async confirm () {
            try {
                const deleteIdList = this.originalUsers.filter(item => {
                    if (!(this.selectedUsers.some(iItem => iItem.userId === item.userId))) {
                        return item.userId
                    }
                    return false
                }).map(item => item.userId)
                const addUserInfoList = this.selectedUsers.filter(item => {
                    if (!(this.originalUsers.some(iItem => iItem.userId === item.userId))) {
                        return item
                    }
                    return false
                })
                await giveBooksMaterials(this.booksId, { addUserInfoList, deleteUserIdList: deleteIdList })
                this.$emit('confirm')
                this.close()
            } catch (e) {
                throw e
            }
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped lang="scss">
.main {
    display: flex;
    border-top: 1px solid #e7e7e7;
}
.selected-users {
    width: 420px;
    padding: 20px 0;
    border-right: 1px solid #e7e7e7;
    .title {
        width: 100%;
        height: 30px;
        padding-left: 10px;
        margin-bottom: 22px;
        font-size: 12px;
        line-height: 30px;
        ::v-deep .el-form {
            display: inline-block;
            .el-form-item--small.el-form-item {
                margin-bottom: 0!important;
            }
        }
    }
    .content {
        display: grid;
        width: 100%;
        height: 342px;
        margin-top: 12px;
        padding: 10px 10px 22px;
        overflow-y: auto;
        grid-template-columns: repeat(auto-fill, 80px);
        grid-template-rows: repeat(auto-fill, 30px);
        grid-gap: 10px;
        .item {
            position: relative;
            padding: 0 6px;
            border: 1px solid #ccc;
            cursor: pointer;
            > div {
                width: 100%;
                line-height: 30px;
                text-align: center;
                @include elps();
            }
            > svg {
                position: absolute;
                top: -7px;
                right: -7px;
            }
        }
    }
    .bottom {
        padding-top: 32px;
        > button:nth-child(2) {
            margin-left: 16px;
        }
    }
}
.tag-group {
    padding: 20px 24px;
    .title {
        margin-bottom: 8px;
        line-height: 20px;
        font-size: 16px;
        color: #222;
        > svg {
            margin-right: 10px;
            vertical-align: text-bottom;
        }
    }
    .content {
        width: 250px;
        height: 400px;
        overflow-y: auto;
        .tag-item {
            width: 100%;
            @include elps();
            line-height: 50px;
            font-size: 16px;
            cursor: pointer;
            &:hover {
                background-color: #f8f8f8;
            }
            b {
                display: inline-block;
                width: 30px;
                height: 30px;
                margin-right: 5px;
                border-radius: 50%;
                background-color: #598bf8;
                text-align: center;
                line-height: 30px;
                font-size: 20px;
                font-weight: 400;
                color: #fff;
            }
        }
        .user-item {
            width: 100%;
            padding: 10px 0;
            @include elps();
            span {
                i {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 1px solid #ccc;
                    border-radius: 50%;
                    vertical-align: text-bottom;
                }
                svg {
                    vertical-align: text-bottom;
                }
            }
        }
    }
}
.pointer {
    cursor: pointer;
}
.no-content {
    height: 342px;
    margin-top: 20px;
    text-align: center;
}
.disabled {
    cursor: not-allowed;
}

</style>
