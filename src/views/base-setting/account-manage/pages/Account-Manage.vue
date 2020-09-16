<template>
    <div class="account-manage">
        <div class="box-card mt-20 hover-up">
            <div class="mb-20">
                <span class="font-18 font-weight-bold">企业管理员</span>
            </div>
            <div>
                <Field
                    title="姓名："
                    :text="enterpriseAdminModel.name"
                />
                <Field
                    title="身份证："
                    :text="enterpriseAdminModel.idCard"
                />
                <Field
                    title="手机号："
                    :text="enterpriseAdminModel.mobile"
                />
            </div>
        </div>

        <el-row
            style="margin-top: 24px;"
            :gutter="24"
        >
            <el-col :span="12">
                <div class="box-card hover-up">
                    <div class="box-card-top">
                        <span class="title">高级管理员</span>
                        <span style="color: #999;">
                            （限
                            <i
                                class="font-weight-bold"
                                v-text="adminModel.maxCount"
                            />
                            个 已任命
                            <i
                                class="color-orange font-weight-bold"
                                v-text="adminModel.currentCount"
                            /> 个）
                        </span>
                        <el-button
                            type="text"
                            class="underline color-blue"
                            @click="showTree('ADMIN')"
                        >
                            查看权限
                        </el-button>
                    </div>
                    <div
                        class="account-intro"
                        style="margin-bottom: 50px;"
                    >
                        <p>具备店铺维护和管理的权限</p>
                        <p>可进行运营账号和子账号的管理</p>
                        <p>只对企业经验值有贡献，无员工贡献值增长体系</p>
                        <p>推荐使用人员：公司管理人员、财务人员</p>
                    </div>
                    <div class="">
                        <el-button
                            plain
                            size="medium"
                            @click="$router.push({name:'AccountList'})"
                        >
                            管理账号
                        </el-button>
                        <el-button
                            type="primary"
                            size="medium"
                            :disabled="currentRoleCode !== 'ENTERPRISE_ADMIN' || adminModel.maxCount === adminModel.currentCount"
                            @click="toAdd('ADMIN')"
                        >
                            新增账号
                        </el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="box-card hover-up">
                    <div class="box-card-top">
                        <span class="title">子账号</span>
                        <span style="color: #999;">
                            （限
                            <i
                                class="font-weight-bold"
                                v-text="employeeModel.maxCount"
                            />
                            个 已任命
                            <i
                                class="color-orange font-weight-bold"
                                v-text="employeeModel.currentCount"
                            /> 个）
                        </span>
                        <el-button
                            type="text"
                            class="underline color-blue"
                            @click="showTree('EMPLOYEE')"
                        >
                            查看权限
                        </el-button>
                    </div>
                    <div
                        class="account-intro"
                        style="margin-bottom: 29px;"
                    >
                        <p>具备店铺维护和管理的权限</p>
                        <p>可进行会员用户和Helper账号的管理</p>
                        <p>具有员工贡献值的增加体系</p>
                        <p>推荐使用人员：公司营销人员，</p>
                        <p>具有销售指标的人。</p>
                    </div>
                    <div>
                        <el-button
                            plain
                            size="medium"
                            @click="$router.push({ name:'AccountList' })"
                        >
                            管理账号
                        </el-button>
                        <el-button
                            type="primary"
                            size="medium"
                            @click="toAdd('EMPLOYEE')"
                        >
                            新增账号
                        </el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <role-tree
            :visible.sync="visible"
            :role-code="this.roleCode"
        />
    </div>
</template>

<script>
import { AccountInfo } from '../../../../apis/account'
import RoleTree from '../components/Role-Tree.vue'
import Field from '../../../../components/common/Field.vue'
import { mapGetters } from 'vuex'

export default {
    name: 'AccountManage',
    components: {
        RoleTree,
        Field
    },
    computed: {
        ...mapGetters({
            currentRoleCode: 'user/currentRoleCode'
        })
    },
    data: () => ({
        visible: false,
        adminModel: {},
        employeeModel: {},
        enterpriseAdminModel: {},
        roleCode: ''
    }),
    async created () {
        const res = await AccountInfo()
        const { adminModel, employeeModel, enterpriseAdminModel } = res.result
        this.adminModel = adminModel
        this.employeeModel = employeeModel
        enterpriseAdminModel.idCard = enterpriseAdminModel.idCard.replace(/^(\d{6})\d{8}(\d+)/, '$1********$2')
        enterpriseAdminModel.mobile = enterpriseAdminModel.mobile.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
        this.enterpriseAdminModel = enterpriseAdminModel
    },
    methods: {
        showTree (roleCode) {
            this.roleCode = roleCode
            this.visible = !this.visible
        },
        toAdd (mode) {
            this.$router.push({ name: 'AddAccount', params: { mode } })
        }
    }
}
</script>

<style scoped lang="scss">
  .account-manage {
    width: 64%;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }

  .box-card {
    padding: 32px 56px;
    background-color: #fff;
  }

  .box-card-top {
    margin-bottom: 16px;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .account-intro {
    color: #999;
    line-height: 21px;
  }
</style>
