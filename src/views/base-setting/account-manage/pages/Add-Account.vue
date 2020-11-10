<template>
    <div class="account-new">
        <div class="wrap">
            <div class="title">
                <span class="float-left">{{ query.userId ? '编辑账号' : '添加账号' }}</span>
            </div>

            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="158px"
                label-position="right"
            >
                <el-form-item label="手机号（账号）:" v-if="query.userId">
                    {{ ruleForm.mobile }}
                </el-form-item>
                <el-form-item
                    prop="mobile"
                    :error="error"
                    label="手机号（账号）:"
                    v-else
                >
                    <el-input
                        class="w250"
                        clearable
                        :disabled="!canEdit()"
                        v-model.trim="ruleForm.mobile"
                        placeholder="请输入手机号或账号"
                        maxlength="11"
                        show-word-limit
                    />
                    <span class="inp-tips">所有员工手机号即为员工账号，请谨慎填写</span>
                </el-form-item>
                <!-- <el-form-item
                    :error="error"
                    v-if="!query.selfEdit && query.canEdit"
                    label="状态："
                >
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
                </el-form-item> -->
                <el-form-item prop="realName" label="真实姓名：">
                    <el-input
                        class="w250"
                        v-model.trim="ruleForm.realName"
                        :disabled="!canEdit()"
                        placeholder="请输入员工真实姓名"
                        maxlength="16"
                        show-word-limit
                    />
                </el-form-item>
                <!-- <el-form-item prop="nickName" label="昵称：">
                    <el-input
                        class="w250"
                        v-model="ruleForm.nickName"
                        placeholder="请输入昵称"
                    />
                </el-form-item> -->
                <el-form-item prop="position" label="职位：">
                    <el-input
                        class="w250"
                        autocomplete="off"
                        v-model="ruleForm.position"
                        :disabled="!canEdit()"
                        placeholder="请输入职位信息"
                        maxlength="16"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="选择角色：" prop="accountRole">
                    <el-radio-group v-model="ruleForm.accountRole" @change="handleRadioChange">
                        <el-radio :disabled="!(currentRoleCode==='ENTERPRISE_ADMIN')" label="ADMIN">
                            高级管理员
                        </el-radio>
                        <el-radio :disabled="!(currentRoleCode==='ADMIN' && ruleForm.accountRole === 'EMPLOYEE' || currentRoleCode==='ENTERPRISE_ADMIN')" label="EMPLOYEE">
                            子账号
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="权限范围：" v-if="canEdit()">
                    <el-button v-if="(this.$route.name === 'AddAccount' || this.query.canEdit) && ruleForm.accountRole !== 'ADMIN'" type="text" @click="editPermission">
                        编辑
                    </el-button>
                    <el-button v-if="ruleForm.accountRole === 'ADMIN' || this.query.selfEdit && (this.currentRoleCode === 'ADMIN' || this.currentRoleCode === 'ENTERPRISE_ADMIN')" type="text" @click="editPermission">
                        查看
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="account-handle">
            <el-button
                round
                @click="cancel"
            >
                取消
            </el-button>
            <el-button
                round
                type="primary"
                @click="submit"
            >
                保存
            </el-button>
        </div>

        <role-tree
            :visible.sync="visible"
            :tree-list="menuTree"
            :show-checkbox="ruleForm.accountRole === 'ADMIN' ? false : !query.selfEdit || query.canEdit"
            :role-code="currentRoleCode"
            @changeTree="changeTree"
        />
    </div>
</template>

<script lang="ts">
import RoleTree from '../../../../components/base-setting/account-manage/Role-Tree.vue'
import { addAccount, getSingleAccount, editAccount, getEmployeeDefault } from '../../../../apis/account'
import { testPhone } from '../../../../assets/ts/validate'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { LocalEnum } from '@/enum/storage'
const userModule = namespace('user')
@Component({
    components: {
        RoleTree
    }
})
export default class AddAccount extends Vue {
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
    rules = {
        realName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            { min: 1, max: 16, message: '请输入至多16字的员工真实姓名', trigger: 'blur' }
        ],
        mobile: [
            { required: true, message: '请填写手机号', trigger: 'blur' },
            { validator: testPhone, message: '请输入11位的手机号作为员工账号', trigger: 'blur' }
        ],
        nickName: [
            { required: false, message: '请输入昵称', trigger: 'blur' },
            { min: 1, max: 16, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        accountRole: [
            { required: true, message: '请选择角色', trigger: 'blur' }
        ]
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

    async created () {
        try {
            this.ruleForm.accountRole = this.$route.params.mode || 'EMPLOYEE'
            this.query = JSON.parse(localStorage.getItem(LocalEnum.editAccount) || 'null') || {}
            this.detailForm.userId = this.query.userId || ''
            this.detailForm.roleCode = this.query.roleCode || ''
            if (this.query.userId) {
                await this.getData()
            } else {
                await this.getEmployeeDefaultFun()
            }
        } catch (e) {
            throw e
        }
    }

    canEdit () {
        return this.$route.name === 'AddAccount' || this.query.canEdit || (this.query.selfEdit && (this.currentRoleCode === 'ADMIN' || this.currentRoleCode === 'ENTERPRISE_ADMIN'))
    }

    changeTree ($event: any) {
        this.menuTree = $event.menuTree
        this.menuCode = $event.menuCode
        // this.submit()
    }

    async getData () {
        const { result } = await getSingleAccount(this.detailForm)
        this.ruleForm = {
            accountRole: result.roleCode,
            lockStatus: result.lockStatus,
            mobile: result.mobile,
            nickName: result.nickName,
            realName: result.realName,
            position: result.position,
            userId: result.userId
        }
        this.setDefaultNode(result.menuTree[0])
        this.menuTree = result.menuTree
    }

    async getEmployeeDefaultFun () {
        const res = await getEmployeeDefault()
        this.setDefaultNode(res.result[0])
        // res.result[0].children[0] && (res.result[0].children[0].disabled = true)
        // res.result[0].children[0].children[0] && (res.result[0].children[0].children[0].disabled = true)
        // res.result[0].children[0].children[1] && (res.result[0].children[0].children[1].disabled = true)
        // res.result[0].children[0].children[2] && (res.result[0].children[0].children[2].disabled = true)
        this.menuTree = res.result
    }

    setDefaultNode (tree: { children: any[] }) {
        // 找到必选的一级节点
        const defaultSelectedNodes = tree.children.filter((node: { status: number }) => node.status === 0)
        if (defaultSelectedNodes.length) {
            for (const node of defaultSelectedNodes) {
                this.disableItem(node)
            }
        }
    }

    disableItem (item: any) {
        item.disabled = true
        if (item.children && item.children.length > 0) {
            for (const child of item.children) {
                this.disableItem(child)
            }
        }
    }

    async submit () {
        if (this.query.userId) {
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

                /* this.$router.replace({
                     name: 'AccountDetail',
                     query: { mobile: this.query.mobile, userId: this.query.userId, roleCode: this.ruleForm.accountRole, selfEdit: this.query.selfEdit, canEdit: this.query.canEdit }
                }) */

                this.$router.go(-1)
            } catch (e) {
                throw e
            }
        } else {
            try {
                await (this.$refs.ruleForm as HTMLFormElement).validate()
                if (this.ruleForm.accountRole === 'EMPLOYEE') {
                    this.ruleForm.menuCode = []
                    this.ruleForm.menuCode = this.menuCode
                    if (!this.menuCode) {
                        this.searchKeyOfSelected(this.menuTree)
                        this.ruleForm.menuCode = this.defaultSelected
                    }
                }
                delete this.ruleForm.lockStatus
                const { result } = await addAccount(this.ruleForm)
                if (!result.result) {
                    this.$alert({
                        title: '名额已满',
                        message: `当前${ this.ruleForm.accountRole === 'ADMIN' ? '高级管理员' : '子账号' }名额已满，如若设置请先移除其他管理员。`,
                        cancelButtonText: ''
                    })
                    return
                }
                if (result.accountStatus === 2) {
                    await this.$confirm({
                        title: '账号已添加成功',
                        message: `（${ this.ruleForm.mobile }）暂无雅集账号，用户通过手机验证码登录朋来雅集机构管理平台即可激活账号`,
                        showCancelButton: false
                    })
                } else {
                    await this.$confirm({
                        title: '账号已添加成功',
                        message: `（${ this.ruleForm.mobile }）通过手机验证码登录朋来雅集机构管理平台即可正常进入店铺进行管理`,
                        showCancelButton: false
                    })
                }
                this.$router.push({ name: 'AccountList' })
            } catch (e) {
                throw e
            }
        }
    }

    cancel () {
        this.$router.back()
    }

    goBack () {
        this.$router.go(-1)
    }

    handleRadioChange () {
        if (this.query.roleCode === 'ADMIN' && this.ruleForm.accountRole === 'EMPLOYEE') {
            this.getEmployeeDefaultFun()
        }
        if (this.ruleForm.userId) return
        // this.ruleForm.realName = ''
        // this.ruleForm.mobile = ''
        // this.ruleForm.position = ''
        this.error = ''
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
}

</script>

<style scoped lang="scss">
    .account-new {
        position: relative;
        height: 100%;
        .w250{
            width: 250px;
        }
        .title {
            margin-bottom: 40px;
            font-size: 16px;
            font-weight: 600;
        }
        > .account-handle {
            position: absolute;
            left: -10px;
            bottom: -10px;
            width: calc(100% + 20px);
            padding: 16px 0;
            text-align: center;
            background-color: #fff;
        }
        .inp-tips{
            color: #999;
            font-size: 12px;
            margin-left: 20px;
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
