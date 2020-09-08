<template>
    <div class="helper-list">
        <el-form
            :inline="true"
            class="wrap border-bottom"
        >
            <el-form-item class="mb-0">
                <el-input
                    clearable
                    v-model.trim="form.realName"
                    placeholder="真实姓名"
                    @change="search"
                />
            </el-form-item>
            <el-form-item class="mb-0">
                <el-input
                    clearable
                    v-model.trim="form.mobile"
                    placeholder="手机号"
                    @change="search"
                />
            </el-form-item>
            <!--<el-form-item label="helper等级">-->
            <!--<el-select v-model="form.level" clearable @change="getList">-->
            <!--<el-option label="等级1" value="1" />-->
            <!--<el-option label="等级2" value="2" />-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item class="mb-0">
                <el-button
                    type="primary"
                    style="width:98px"
                    size="mini"
                    @click="search"
                >
                    搜索
                </el-button>
            </el-form-item>
            <el-form-item
                class="mb-0 "
                label="所属账号"
                v-if="currentRoleCode !== 'EMPLOYEE'"
            >
                <el-select
                    v-model="form.ownnerUserId"
                    clearable
                    @change="search"
                >
                    <el-option
                        v-for="(item, index) of accountList"
                        :key="index"
                        :label="item.realName"
                        :value="item.userId"
                    />
                </el-select>
            </el-form-item>
        </el-form>

        <div class="wrap mb-20" v-if="$route.name === 'HelperWaiting'">
            <el-button type="primary" :disabled="!currentSelect.length" @click="batchAudit">
                批量通过
            </el-button>
        </div>

        <el-table
            @selection-change="selectionChange"
            :data="table"
        >
            <el-table-column
                type="selection"
                width="55"
                v-if="$route.name === 'HelperWaiting'"
            />
            <el-table-column
                prop="userId"
                label="ID"
            />
            <el-table-column label="头像">
                <template slot-scope="scope">
                    <img
                        height="50"
                        :src="scope.row.avatarUrl"
                        alt=""
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="realName"
                label="真实姓名"
            />
            <el-table-column
                prop="mobile"
                label="手机号（登录账户）"
            />
            <el-table-column
                prop="ownnerName"
                label="所属账号"
            />
            <!--<el-table-column prop="weChatNumber" label="Helper等级" />-->
            <!--<el-table-column prop="weChatNumber" label="成长值" />-->
            <!-- <el-table-column prop="ownnerName" label="所属账号" /> -->
            <!-- <el-table-column prop="status" label="状态" /> -->
            <!--<template slot-scope="scope">-->
            <!--<span v-if="scope.row.auditStatus === 'AWAIT'">待审核</span>-->
            <!--<span v-else-if="scope.row.auditStatus === 'PASS'">正常（已论证）</span>-->
            <!--<span v-else-if="scope.row.auditStatus === 'REJECT'">驳回</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
                :label="$route.name === 'HelperWaiting'? '申请时间':'审核时间'"
            >
                <template slot-scope="{ row }">
                    {{ $route.name === 'HelperWaiting'? row.applyTime:row.auditTime }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="$route.name==='HelperRejected'"
                prop="agentWriteBack"
                label="驳回理由"
            />
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <template v-if="routeName === 'HelperWaiting'">
                                <a
                                    @click="updateBrokerStatus(row.id, 'PASS')"
                                >
                                    通过
                                </a>
                                <a
                                    @click="updateBrokerStatus(row.id, 'REJECT')"
                                >
                                    驳回
                                </a>
                            </template>

                            <a
                                @click="$router.push({ name: 'MemberDetail', params: { id: row.mallUserId, roleCode: 'HELPER', fromRouteName: routeName }, query: { from: 'audit' } })"
                            >
                                查看
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>

        <Pagination
            @change="getList"
            @sizeChange="sizeChange"
            v-model="form.current"
            :total="total"
        />

        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="showDialog"
            title="选择所属账号"
            width="40%"
        >
            <el-form :inline="true">
                <el-form-item>
                    <el-input
                        clearable
                        @clear="getAccountList"
                        v-model="searchAccountsForm.realName"
                        placeholder="真实姓名"
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        clearable
                        @clear="getAccountList"
                        v-model="searchAccountsForm.mobile"
                        placeholder="手机号"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        @click="getAccountList"
                        type="primary"
                    >
                        查询
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table :data="accountList">
                <el-table-column
                    prop="realName"
                    label="真实姓名"
                />
                <el-table-column
                    prop="mobile"
                    label="手机号（登录账户）"
                />
                <el-table-column
                    prop="roleName"
                    label="角色"
                />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="changeHelperAccount(scope.row)"
                        >
                            选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

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

  @Component
export default class HelperReviewList extends Vue {
}
</script>

<style module lang="scss">

</style>
