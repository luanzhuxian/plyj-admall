<template>
    <div class="account-new">
        <div class="mt-20 content">
            <el-card class="box-card">
                <div
                    slot="header"
                    class="clearfix font-weight-bold"
                >
                    <span class="float-left">请完善账号的相关信息</span>
                </div>
                <div>
                    <el-form
                        class="demo-ruleForm"
                        ref="ruleForm"
                        :model="ruleForm"
                        :rules="rules"
                        label-width="120px"
                        label-position="left"
                    >
                        <el-form-item label="账号角色">
                            <el-radio-group
                                v-model="ruleForm.accountRole"
                                @change="handleRadioChange"
                            >
                                <el-radio
                                    label="ADMIN"
                                    :disabled="currentRoleCode!=='ENTERPRISE_ADMIN' || query.selfEdit"
                                >
                                    高级管理员
                                </el-radio>
                                <el-radio label="EMPLOYEE" :disabled="query.selfEdit">
                                    子账号
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            :error="error"
                            v-if="!query.selfEdit && query.canEdit"
                        >
                            <span slot="label" class="red">
                                状态
                            </span>
                            <el-switch
                                v-model="ruleForm.lockStatus"
                                active-color="#4F63FF"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span v-if="ruleForm.lockStatus" style="color: #4F63FF">
                                &nbsp;启用
                            </span>
                            <span v-else style="color: #ccc">
                                &nbsp;关闭
                            </span>
                        </el-form-item>
                        <el-form-item
                            prop="mobile"
                            :error="error"
                        >
                            <span slot="label" class="red">
                                联系方式
                            </span>
                            <el-select
                                :value="ruleForm.mobile"
                                :disabled="query.selfEdit || query.canEdit"
                                filterable
                                clearable
                                remote
                                reserve-keyword
                                placeholder="请输入手机号"
                                :remote-method="searchMobile"
                                :loading="loading"
                                autocomplete="off"
                                @change="selectChange"
                                @blur="selectBlur"
                                @clear="clearMobile"
                            >
                                <el-option
                                    v-for="item in mobileOptions"
                                    :key="item.mobile"
                                    :label="item.mobile + '(' + converRoleCode[item.roleCode] + ')'"
                                    :value="item.mobile"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="realName">
                            <div
                                slot="label"
                                class="pl-0_5 fline red"
                            >
                                真实姓名
                            </div>
                            <el-input
                                class="w180"
                                v-model="ruleForm.realName"
                                :disabled="realNameDisabled"
                                :placeholder="namePlacehoder"
                            />
                        </el-form-item>
                        <el-form-item prop="nickName">
                            <div
                                slot="label"
                                class="pl-0_5"
                            >
                                昵称
                            </div>
                            <el-input
                                class="w180"
                                v-model="ruleForm.nickName"
                                placeholder="请输入昵称"
                            />
                        </el-form-item>
                        <el-form-item prop="position">
                            <div
                                slot="label"
                                class="pl-0_5"
                            >
                                职位
                            </div>
                            <el-input
                                class="w180"
                                autocomplete="off"
                                v-model="ruleForm.position"
                                placeholder="请输入所属职位"
                            />
                        </el-form-item>
                        <el-form-item v-if="!(ruleForm.accountRole === 'ADMIN')">
                            <div
                                slot="label"
                                class="pl-0_5"
                                style="font-weight: bold;color: #333333"
                            >
                                权限配置*
                            </div>
                            <div class="edit-label">
                                <!--                <el-button type="text" @click="editPermission" v-if="query.selfEdit || query.roleCode === 'ADMIN'">-->
                                <!--                  查看-->
                                <!--                </el-button>-->
                                <el-button type="text" @click="editPermission">
                                    编辑
                                </el-button>
                            </div>
                            <!--              <div class="fl">-->
                            <!--                <div class="permission-label-box">-->
                            <!--                  <div class="label">-->
                            <!--                    商品管理-->
                            <!--                  </div>-->
                            <!--                </div>-->
                            <!--                <div class="edit-label">-->
                            <!--                  <el-button type="text" @click="editPermission">-->
                            <!--                    编辑-->
                            <!--                  </el-button>-->
                            <!--                </div>-->
                            <!--              </div>-->
                        </el-form-item>
                    </el-form>
                    <div class="border-top pb-1" />
                    <hr class="hr mb-20">
                    <div>
                        <el-button
                            class="px-1_5"
                            @click="cancel"
                        >
                            取消
                        </el-button>
                        <el-button
                            class="px-1_5"
                            @click="submit"
                        >
                            保 存
                        </el-button>
                    </div>
                </div>
            </el-card>
        </div>

        <role-tree
            :visible.sync="visible"
            :tree-list="menuTree"
            :show-checkbox="!query.selfEdit"
            @changeTree="changeTree"
        />
    </div>
</template>

<script lang="ts">
import RoleTree from '../components/Role-Tree.vue'
import { searchMobile, addAccount, getSingleAccount, editAccount, getEmployeeDefault } from '../../../../apis/account'
import { testPhone } from '../../../../assets/ts/validate'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
@Component({
    components: {
        RoleTree
    }
})
export default class AddAccount extends Vue {
    realNameDisabled = true
    namePlacehoder = '请先选择联系方式'
    loading = false
    error = ''
    ruleForm: { [k: string]: any } = {
        accountRole: '',
        lockStatus: 1,
        mobile: '',
        nickName: '',
        realName: '',
        position: ''
    }

    menuTree = []
    menuCode = ''
    mobileOptions: any[] = []
    rules = {
        realName: [
            { required: false, message: '请输入真实姓名', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        mobile: [
            { required: true, message: '请填写手机号', trigger: 'blur' },
            { validator: testPhone, message: '手机号不正确', trigger: 'blur' }
        ],
        nickName: [
            { required: false, message: '请输入昵称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
    }

    converRoleCode = {
        ADMIN: '高级管理员',
        EMPLOYEE: '子账号',
        HELPER: 'Helper',
        MEMBERSHIP: '普通会员',
        ENTERPRISE_ADMIN: '企业管理管理员',
        VISITOR: '游客'
    }

    visible = false
    roleCode = ''
    value = 1
    query: { [key: string]: any } = {}
    detailForm = {
        roleCode: '',
        userId: ''
    }

    defaultSelected: any[] = []

    @userModule.Getter('currentRoleCode') currentRoleCode!: string

    @Watch('ruleForm.accountRole')
    accountRoleHandler (val: string) {
        this.rules.realName[0].required = val === 'EMPLOYEE'
    }

    created () {
        this.ruleForm.accountRole = this.$route.params.mode
        this.query = this.$route.query
        if (this.query.selfEdit === 'false') {
            this.query.selfEdit = false
        }
        if (this.query.selfEdit === 'true') {
            this.query.selfEdit = true
        }
        if (this.query.canEdit === 'true') {
            this.query.canEdit = true
        }
        if (this.query.canEdit === 'false') {
            this.query.canEdit = false
        }
        this.detailForm.userId = this.query.userId
        this.detailForm.roleCode = this.query.roleCode
        if (this.query.userId) {
            this.getData()
        } else {
            this.getEmployeeDefaultFun()
        }
    }

    changeTree ($event: any) {
        this.menuTree = $event.menuTree
        this.menuCode = $event.menuCode
        this.submit()
    }

    async getData () {
        const { result } = await getSingleAccount(this.detailForm)
        this.ruleForm.accountRole = result.roleCode
        this.ruleForm.userId = result.userId
        this.ruleForm.lockStatus = result.lockStatus
        this.ruleForm.mobile = result.mobile
        this.realNameDisabled = false
        this.ruleForm.realName = result.realName
        this.ruleForm.nickName = result.nickName
        this.ruleForm.position = result.position
        const item = result.menuTree[0].children[0]
        this.disableItem(item)
        this.menuTree = result.menuTree
    }

    disableItem (item: any) {
        item.disabled = true
        if (item.children && item.children.length > 0) {
            for (const c of item.children) {
                this.disableItem(c)
            }
        }
    }

    async submit () {
        if (this.query.canEdit || this.query.selfEdit) {
            delete this.ruleForm.mobile
            if (this.query.canEdit && this.ruleForm.accountRole === 'EMPLOYEE') {
                this.ruleForm.menuCode = []
                this.ruleForm.menuCode = this.menuCode
                if (!this.menuCode) {
                    this.searchKeyOfSelected(this.menuTree)
                    this.ruleForm.menuCode = this.defaultSelected
                }
            }
            if (this.query.canEdit && this.ruleForm.accountRole === 'ADMIN') {
                this.ruleForm.menuCode = []
            }
            try {
                const res = await editAccount(this.ruleForm)
                if (!res.result) {
                    this.$alert({
                        title: '名额已满',
                        message: `当前${ this.ruleForm.accountRole === 'ADMIN' ? '高级管理员' : '子账号' }名额已满，如若设置请先禁用其他管理员。`
                    })
                    return
                }
                this.$success('编辑成功')
                this.$router.replace({
                    name: 'AccountDetail',
                    query: { mobile: this.query.mobile, userId: this.query.userId, roleCode: this.ruleForm.accountRole, selfEdit: this.query.selfEdit, canEdit: this.query.canEdit }
                })
            } catch (e) {
                throw e
            }
        } else {
            if (this.mobileOptions.length === 0) {
                this.error = '该手机号不存在'
                return
            }
            (this.$refs.ruleForm as any).validate(async (valid: boolean) => {
                if (!valid) return false
                if (this.ruleForm.accountRole === 'EMPLOYEE') {
                    this.ruleForm.menuCode = []
                    this.ruleForm.menuCode = this.menuCode
                    if (!this.menuCode) {
                        this.searchKeyOfSelected(this.menuTree)
                        this.ruleForm.menuCode = this.defaultSelected
                    }
                }
                delete this.ruleForm.lockStatus
                try {
                    const res = await addAccount(this.ruleForm)
                    if (!res.result) {
                        this.$alert({
                            title: '名额已满',
                            message: `当前${ this.ruleForm.accountRole === 'ADMIN' ? '高级管理员' : '子账号' }名额已满，如若设置请先禁用其他管理员。`,
                            cancelButtonText: ''
                        })
                        return
                    }
                    this.$success('新增成功')
                    this.$router.push({ name: 'AccountList' })
                } catch (e) {
                    throw e
                }
            })
        }
    }

    cancel () {
        this.$router.back()
    }

    async searchMobile (query: string) {
        if (query !== '') {
            this.loading = true
            const roleCode = this.ruleForm.accountRole
            const params = {
                current: 1,
                size: 100,
                mobile: query,
                roleCode
            }
            try {
                const res = await searchMobile(params)
                this.loading = false
                this.mobileOptions = res.result.records
                if (res.result.records.length === 1) {
                    this.handleSelect(res.result.records[0])
                }
                if (this.mobileOptions.length === 0) {
                    this.error = '该手机号不存在'
                } else {
                    this.error = ''
                }
            } catch (e) {
                this.loading = false
                throw e
            }
        }
    }

    clearMobile () {
        this.ruleForm.realName = ''
        // this.ruleForm.accountRole = ''
        this.ruleForm.position = ''
        this.ruleForm.nickName = ''
    }

    selectChange (val: string) {
        this.ruleForm.mobile = val
        const selected = this.mobileOptions.find(item => item.mobile === val)
        if (selected) {
            this.handleSelect(selected)
        }
    }

    selectBlur (e: any) {
        const num = /\d+/.exec(e.target.value)
        if (num && !this.loading && this.ruleForm.mobile) {
            this.ruleForm.mobile = num[0]
            this.searchMobile(this.ruleForm.mobile)
        }
    }

    handleSelect (selectItem: any) {
        this.ruleForm.realName = selectItem.realName
        this.ruleForm.nickName = selectItem.nickName
        this.ruleForm.mobile = selectItem.mobile
        this.ruleForm.position = selectItem.position
        // this.$refs['ruleForm'].clearValidate(['mobile'])
        if (!selectItem.realName) {
            this.realNameDisabled = false
            this.namePlacehoder = '请输入真实姓名'
        }
    }

    goBack () {
        this.$router.go(-1)
    }

    handleRadioChange () {
        if (this.query.roleCode === 'ADMIN' && this.ruleForm.accountRole === 'EMPLOYEE') {
            this.getEmployeeDefaultFun()
        }
        if (this.ruleForm.userId) return
        this.ruleForm.realName = ''
        this.ruleForm.mobile = ''
        this.ruleForm.position = ''
        this.error = ''
        this.realNameDisabled = true
        this.mobileOptions = []
    }

    editPermission () {
        this.visible = !this.visible
        this.roleCode = 'EMPLOYEE'
    }

    searchKeyOfSelected (list: any[]) {
        for (const item of list) {
            if (item.checked) {
                if (item.children) {
                    this.defaultSelected.push(item.aclCode)
                    this.searchKeyOfSelected(item.children)
                } else {
                    this.defaultSelected.push(item.aclCode)
                }
            }
        }
    }

    async getEmployeeDefaultFun () {
        const res = await getEmployeeDefault()
        res.result[0].children[0].disabled = true
        res.result[0].children[0].children[0].disabled = true
        res.result[0].children[0].children[1].disabled = true
        res.result[0].children[0].children[2].disabled = true
        this.menuTree = res.result
    }
}

</script>

<style scoped lang="scss">
  .fl{
    display: flex;
  }
  .fline{
    display: inline-flex;
  }
  .red{
    color: #D0423C;
  }
  .w180{
    width: 180px;
  }
.account-new {
  .el-form {
    width: 500px;
  }
  > .content {
    width: 70%;
    margin: 0 auto;
  }
}
  .permission-label-box{
    width: 320px;
    & .label{
      display: inline-flex;
      padding: 0 11px;
      font-size: 12px;
      margin-right: 10px;
      margin-bottom: 10px;
      background: #ccc;
      color: #fff;
      border-radius: 4px;
    }
  }
  .edit-label{
    display: inline-flex;
    align-items: flex-end;
    padding-bottom: 5px;
    padding-left: 5px;
    color: $--color-primary-blue;
    font-size: 12px;
  }
</style>
