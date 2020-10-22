<template>
    <div class="helper-detail">
        <div class="detail-top">
            <span class="status">{{ statusMap[detail.auditStatus] }}</span>
            <span class="apply-date" v-if="detail.auditStatus === 'AWAIT'">{{ detail.createTime }} 申请</span>
            <span class="apply-date" v-else>{{ detail.auditDate }} 审核</span>
            <span>
                所属账号：<span v-if="detail.ownedMobile">{{ detail.ownedMobile }}-</span>
                {{ detail.ownedUser }}
                <span v-if="detail.ownedRole">
                    ({{ roleCodeMap[detail.ownedRole] }})
                </span>
            </span>
        </div>
        <div :class="$style.module" class="mt-30">
            <div :class="$style.moduleTitle">用户基本信息</div>
            <BaseInfo
                :avatar="detail.userImage"
                :nick-name="detail.nickName"
                :role-code="detail.roleCode"
                :mobile="detail.mobile"
                :user-name="detail.name"
                :tags="detail.tags"
                :type="detail.type"
                :gender="detail.gender"
                :address="detail.address"
                :source="detail.source"
                :other="detail.other"
                :create-time="detail.createTime"
                :user-create-time="detail.userCreateTime"
                :edit-tags="false"
            />
        </div>
        <div :class="$style.module" class="mt-30">
            <div :class="$style.moduleTitle">申请资料</div>
            <el-table :data="detail.data">
                <el-table-column label="真实姓名" prop="name" />
                <el-table-column label="手机号" prop="mobile" />
                <el-table-column label="身份证号码" prop="idCard" />
            </el-table>
        </div>
        <div :class="$style.module" style="margin-top: 80px;">
            <div :class="$style.moduleTitle">操作日志</div>
            <ul :class="$style.logs">
                <li v-for="(log, i) of detail.logs" :key="i">
                    <span v-text="log.createTime" class="mr-30" />
                    <span> 操作人：{{ log.operationName }} </span>
                    <span v-if="log.operationRole"> （{{ roleCodeMap[log.operationRole] }}） </span>
                    <span v-text="log.content" />
                </li>
            </ul>
        </div>
        <div class="mt-30" v-if="detail.auditStatus === 'AWAIT'">
            <el-button type="primary" round @click="updateBrokerStatus(detail.id, 'PASS')">审核通过</el-button>
            <el-button type="text" @click="updateBrokerStatus(detail.id, 'REJECT')">审核驳回</el-button>
        </div>
        <el-dialog
            width="480px"
            title="确定驳回该用户的申请吗"
            :visible="dialogAuditVisible"
            @close="dialogAuditCancel()"
        >
            <el-form
                label-width="70px"
                style="width: 376px;height: 47px"
            >
                <el-form-item
                    class="mb-0"
                    label="驳回理由"
                >
                    <el-input
                        v-model="rejectReason"
                        placeholder="请输入驳回理由"
                        autocomplete="off"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
            >
                <el-button @click="dialogAuditCancel()">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="dialogAuditConfirm()"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getHelperDetail, updateBrokerStatus } from '../../../../apis/member'
import BaseInfo from '../../../../components/user-center/Base-Info.vue'
@Component({
    components: {
        BaseInfo
    }
})
export default class MemberManageDetail extends Vue {
        roleCodeMap = {
            ENTERPRISE_ADMIN: '企业管理员',
            EMPLOYEE: '子账号',
            ADMIN: '高级管理员'
        }

        detail = {
            data: [] as any[],
            tags: [] as any[]
        }

        statusMap = { AWAIT: '待审核', PASS: '审核通过', REJECT: '审核驳回' }

        dialogAuditVisible = false
        rejectReason = ''
        id = ''

        async created () {
            this.id = this.$route.params.id
            await this.getHelperDetail()
        }

        beforeRouteLeave (to: DynamicObject, from: DynamicObject, next: FunctionConstructor) {
            if (to.name === 'HelperReviewList') {
                to.query.currentStatus = this.$route.query.currentStatus
                next()
            } else {
                next()
            }
        }

        // methods
        async getHelperDetail () {
            try {
                const { result } = await getHelperDetail(this.id)
                if (result && result.idCard) {
                    result.idCard = result.idCard.replace(/^(\d{4})\d{9}(\d+)/, '$1*********$2')
                }
                this.detail = result || {}
                this.detail.data = [{ name: result.name, mobile: result.mobile, idCard: result.idCard }] as any[]
            } catch (e) {
                throw e
            }
        }

        async updateBrokerStatus (id: string, status: string) {
            try {
                if (status === 'REJECT') {
                    this.dialogAuditVisible = true
                } else {
                    await this.$confirm('确定通过该用户的申请吗？')
                    await updateBrokerStatus({ ids: [id], status, reviewContent: '' })
                    this.$success('审核成功')
                    this.getHelperDetail()
                }
            } catch (e) {
                throw e
            }
        }

        dialogAuditCancel () {
            this.dialogAuditVisible = false
            this.rejectReason = ''
        }

        async dialogAuditConfirm () {
            const ids = [this.id]
            const status = 'REJECT'
            const reviewContent = this.rejectReason
            await updateBrokerStatus({ ids, status, reviewContent })
            this.dialogAuditVisible = false
            this.$success('审核驳回')
            this.getHelperDetail()
        }
}
</script>
<style module lang="scss">
    .module {
        margin-bottom: 20px;
        .module-title {
            font-weight: bold;
            font-size: 16px;
        }
    }
    .logs {
        li {
            margin-top: 33px;
            line-height: 20px;
        }
    }
</style>
<style scoped lang="scss">
    .helper-detail {
        .detail-top {
            border-bottom: 1px solid #F5F5F5;
            padding-left: 16px;
            padding-bottom: 24px;

            .status {
                font-size: 20px;
                font-weight: bold;
                margin-right: 25px;
            }

            .apply-date {
                margin-right: 80px;
            }
        }
    }
</style>
