<template>
    <div class="helper-detail">
        <div class="detail-top">
            <span class="status">{{ statusMap[detail.auditStatus] }}</span>
            <span class="apply-date" v-if="detail.auditStatus === 'AWAIT'">{{ detail.createTime }} 申请</span>
            <span class="apply-date" v-else>{{ detail.auditDate }} 审核</span>
            <span>所属账号：{{ detail.ownedUser }}</span>
        </div>
        <div class="detail-main">
            <div class="title">用户基本信息</div>
            <div class="user-info">
                <div class="user-avatar">
                    <div class="avatar">
                        <img :src="detail.userImage">
                    </div>
                    <div>
                        <div style="font-size: 16px;margin-bottom: 12px">{{ detail.nickName }}</div>
                        <div>普通会员</div>
                    </div>
                </div>
                <ul class="info-list">
                    <li>
                        <div class="info-list-li"><div class="label">手机：</div>{{ detail.mobile }}</div>
                        <div class="label">姓名：</div>{{ detail.name }}</li>
                    <li>
                        <div class="info-list-li"><div class="label">地址：</div>{{ detail.address }}</div>
                        <div class="label">标签：</div>{{ detail.tags }}<a v-if="detail.tags">编辑</a>
                    </li>
                    <li>
                        <div class="label">来源：</div>{{ detail.source }}
                    </li>
                    <li>
                        <div class="label">记录：</div>{{ detail.createTime }} 注册
                    </li>
                </ul>
            </div>
            <div class="title">申请资料</div>
            <el-table :data="detail.data">
                <el-table-column label="真实姓名" prop="name" />
                <el-table-column label="手机号" prop="mobile" />
                <el-table-column label="身份证号码" prop="idCard" />
            </el-table>
            <div class="title">操作日志</div>
            <ul class="logs">
                <li v-for="(log, k) in detail.logs" :key="k">{{ log }}</li>
            </ul>
        </div>
        <div class="btns" v-if="detail.auditStatus === 'AWAIT'">
            <el-button type="primary" size="mini" @click="updateBrokerStatus(detail.id, 'PASS')">审核通过</el-button>
            <el-button type="text" size="mini" @click="updateBrokerStatus(detail.id, 'REJECT')">审核驳回</el-button>
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

<script>
import { Vue, Component } from 'vue-property-decorator'
import { getHelperDetail, updateBrokerStatus } from '../../../../apis/member'

  @Component({
  })

export default class MemberManageDetail extends Vue {
    detail = {
        data: []
    }

    statusMap = { AWAIT: '待审核', PASS: '审核通过', REJECT: '审核驳回' }

    dialogAuditVisible = false
    rejectReason = ''
    id = ''
    async created () {
        this.id = this.$route.params.id
        await this.getHelperDetail()
    }

    // methods
    async getHelperDetail () {
        try {
            const { result } = await getHelperDetail(this.id)
            if (result && result.idCard) {
                result.idCard = result.idCard.replace(/^(\d{4})\d{9}(\d+)/, '$1*********$2')
            }
            if (result && result.tags) {
                result.tags = result.tags.join(' | ')
            }
            this.detail = result || {}
            this.detail.data = [{ name: result.name, mobile: result.mobile, idCard: result.idCard }]
        } catch (e) {
            throw e
        }
    }

    async updateBrokerStatus (id, status) {
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

<style scoped lang="scss">
    .helper-detail {
        .detail-top{
            border-bottom: 1px solid #F5F5F5;
            padding-left: 16px;
            padding-bottom: 24px;
            .status{
                font-size: 20px;
                font-weight: bold;
                margin-right: 25px;
            }
            .apply-date{
                margin-right: 80px;
            }
        }
        .detail-main{
            padding: 0 16px;
            .title{
                font-size: 16px;
                margin: 24px 0;
            }
            .user-info{
                display: flex;
                .user-avatar{
                    display: flex;
                    margin-right: 60px;
                    .avatar{
                        width: 88px;
                        height: 88px;
                        border-radius: 50%;
                        background: #DFE5FC;
                        margin-right: 16px;
                        img{
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
                .info-list{
                    line-height: 2;
                    li{
                        display: flex;
                        margin-bottom: 24px;
                        .info-list-li{
                            display: flex;
                            width: 220px;
                        }
                    }
                }
            }
            .logs{
                li{
                    font-size: 14px;
                    line-height: 2;
                }
            }
        }
        .btns{
            margin: 32px 16px 0;
            button{
                height: 40px;
                border-radius: 120px;
                padding: 0 20px;
            }
        }
    }
</style>
