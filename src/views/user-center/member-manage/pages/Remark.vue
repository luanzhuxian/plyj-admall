<template>
    <div>
        <el-button
            @click="addRemark"
            style="width: 98px;"
            type="primary"
            size="middle"
            round
        >
            添加备注
        </el-button>
        <el-table
            key="RemarkList"
            :data="remarkList"
            class="table-customer"
            style="width: 100%"
        >
            <el-table-column
                prop="content"
                label="备注内容">
                <template #default="{row}">
                    <el-tooltip
                        width="500"
                        effect="dark"
                        placement="top-start"
                    >
                        <div slot="content" style="width: 500px; line-height: 20px;">{{ row.content }}</div>
                        <span class="show-first-line">{{ row.content }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="添加时间"
            />
            <el-table-column
                prop="createUser"
                label="添加人">
                <template #default="{row}">
                    {{ row.createUser }}
                    <template v-if="row.createUserRoleName">
                        （{{ roleType[row.createUserRoleName] }}）
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
            >
                <template #default="{row}">
                    <div class="operate">
                        <a @click="deleteRemark(row.id)">
                            删除
                        </a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            @change="getRemarkList"
            v-model="remarkListForm.current"
            :total="remarkListTotal"
        />

        <!--添加备注-->
        <AddRemark :show.sync="showAddRemark"
                   :user-id="userId"
                   @success="addRemarkSuccess"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import {
    deleteRemark,
    getRemarkList
} from '../../../../apis/member'
import AddRemark from '../components/Add-Remark.vue'

@Component({
    components: {
        AddRemark
    }
})
export default class MemberRemark extends Vue {
    remarkList = []
    remarkListTotal = 0
    showAddRemark = false
    remarkListForm = {
        mallUserId: '',
        current: 1,
        size: 10
    }

    @Prop() userId!: string

    async activated () {
        await this.getRemarkList()
    }

    // methods
    addRemark () {
        this.showAddRemark = true
    }

    async getRemarkList () {
        try {
            this.remarkListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getRemarkList(this.remarkListForm)
            this.remarkList = records || []
            this.remarkListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async addRemarkSuccess () {
        try {
            await this.getRemarkList()
            this.$emit('addRemarkSuccess')
        } catch (e) {
            throw e
        }
    }

    async deleteRemark (id: string) {
        try {
            await deleteRemark({ id })
            await this.getRemarkList()
            this.$emit('addRemarkSuccess')
        } catch (e) {
            throw e
        }
    }
}
</script>

<style module lang="scss">

</style>
