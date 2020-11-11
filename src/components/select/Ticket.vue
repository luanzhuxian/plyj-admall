<template>
    <!--
  选择优惠券组件
  @template
    <el-button @click="selectTicket">
      选择优惠券
    </el-button>
    <Ticket ref="ticket" />
  @methods
    selectTicket () {
      this.$refs.ticket.selectTicket()
    }
  父组件获取选择的优惠券：
    this.selectedTicket = this.$refs.ticket.selectedTicket
  父组件传入优惠券：(编辑、复制时)
    this.$refs.ticket.selectedTicket = this.selectedTicket
  活动进行中时隐藏移除按钮：
    if (this.form.invitingEventsEntity.status === 2) {
      this.$refs.ticket.remove = false
    }
  默认领取方式：1活动发放，默认状态：4进行中
    自行领取：this.$refs.ticket.params.distributionMethod = 0
    所有状态：this.$refs.ticket.params.status = ''
    显示状态框：this.$refs.ticket.showStatus = true
  2019-10-23 19:14:41 John
  -->
    <div class="ticket">
        <el-table
            v-if="tableShow && selectedTicket.length>0"
            :data="selectedTicket"
            stripe
            border
            style="width: 780px;margin-top:20px;"
        >
            <el-table-column
                prop="couponName"
                label="优惠券名称"
                width="100"
            />
            <el-table-column
                prop="couponName"
                label="优惠券金额"
                width="130"
            >
                <template slot-scope="{row}">
                    满{{ row.useLimitAmount }}减{{ row.amount }}
                </template>
            </el-table-column>
            <el-table-column
                :label="status === 2? '剩余优惠券库存' : '优惠券库存'"
                width="200"
            >
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.stock" :min="0" step-strictly label="库存" /> &nbsp;份
                </template>
            </el-table-column>
            <el-table-column
                v-if="status === 2"
                prop="salesVolume"
                label="领用量"
                width="80"
            />
            <el-table-column
                prop="operation"
                label="操作"
            >
                <template slot-scope="scope">
                    <div class="operation-column">
                        <el-button :disabled="!remove" @click.native.prevent="deleteRow(scope.$index, selectedTicket)" type="text" size="small">
                            移除
                        </el-button>
                        <div class="sort">
                            <i :class="{ disabled: scope.$index === 0 }">
                                <pl-svg
                                    name="icon-shang"
                                    width="12"
                                    @click="sort(scope.$index === 0, true, scope.$index)"
                                />
                            </i>
                            <i :class="{ disabled: scope.$index === selectedTicket.length - 1 }">
                                <pl-svg
                                    name="icon-xia"
                                    width="12"
                                    @click="sort(scope.$index === selectedTicket.length - 1, false, scope.$index)"
                                />
                            </i>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 选择优惠券弹框 -->
        <el-dialog title="选择优惠券" :visible.sync="dialogTableVisible" width="980px">
            <div class="wrap border-bottom">
                <el-input
                    clearable
                    :maxlength="50"
                    v-model.trim="params.name"
                    placeholder="请输入优惠券名称"
                    prefix-icon="el-icon-search"
                    style="width:160px;margin-right:10px;"
                    @change="search"
                />
                <el-select
                    v-if="showStatus"
                    :clearable="true"
                    v-model="params.status"
                    @change="search"
                    style="width: 88px;margin-right:10px;"
                >
                    <el-option label="全部" value="" />
                    <el-option label="已停止" :value="0" />
                    <el-option label="待开始" :value="2" />
                    <el-option label="已结束" :value="3" />
                    <el-option label="进行中" :value="4" />
                </el-select>
                <el-date-picker
                    v-model="daterange"
                    @change="daterangeChange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="position:relative;top:1px;margin-right:10px;"
                    :editable="false"
                />
                <el-button type="primary" style="width:80px;" @click="search" round>
                    查询
                </el-button>
                <el-button style="float:right;width:98px;" @click="dialogTableVisible=false;$router.push({ name: 'ReductionCouponList' })">
                    优惠券管理
                </el-button>
            </div>
            <el-table :data="gridData" ref="gridData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="right" />
                <el-table-column property="couponName" label="满减券名称" />
                <el-table-column label="满减券金额" width="120">
                    <template slot-scope="{row}">
                        满{{ row.useLimitAmount }}减{{ row.amount }}
                    </template>
                </el-table-column>
                <el-table-column label="领取方式" width="80">
                    <template slot-scope="{row}">
                        {{ row.distributionMethod === 1 ? '活动发放' : '自行领取' }}
                    </template>
                </el-table-column>
                <el-table-column property="time" label="用券时间" width="280">
                    <template slot-scope="{row}">
                        {{ row.useStartTime }} - {{ row.useEndTime }}
                    </template>
                </el-table-column>
                <el-table-column property="receiveAmount" label="领用量" width="70" />
                <el-table-column property="usedAmount" label="使用量" width="70" />
                <el-table-column property="statusText" label="状态" width="70" />
            </el-table>
            <Pagination
                @change="getTicket"
                v-model="params.current"
                :total="total"
                style="margin-bottom:20px;"
            />
            <div style="text-align:center">
                <el-button type="primary" @click="confirmTicket()" style="width:98px;">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getCouponList } from '../../apis/marketing-manage/coupon'

export default {
    props: {
        tableShow: {
            type: Boolean,
            default: true
        },
        status: {
            type: [Number, String],
            default: ''
        },
        // packageType: {
        //   type: String,
        //   default: '2019_01'
        // },
        couponType: {
            type: String,
            default: '1'
        }
    },
    data () {
        return {
            // 选择优惠券
            dialogTableVisible: false,
            gridData: [],
            params: {
                name: '',
                status: '',
                distributionMethod: 1,
                startTime: '',
                endTime: '',
                current: 1,
                size: 10,
                couponType: this.couponType
            },
            total: 0,
            multipleSelection: [],
            selectedTicket: [],
            remove: true,
            daterange: [],
            showStatus: false
        }
    },
    methods: {
    // 选取优惠券
        selectTicket () {
            this.dialogTableVisible = true
            this.getTicket()
        },
        search () {
            this.params.current = 1
            this.getTicket()
        },
        async getTicket () {
            try {
                const { result } = await getCouponList(this.params)
                for (const i in result.records) {
                    result.records[i].stock = 1
                }
                this.gridData = result.records
                this.total = result.total
                if (this.selectedTicket.length) {
                    for (const item of this.gridData) {
                        // 已选择的券
                        const hasSelected = this.selectedTicket.some(row => row.id === item.id)
                        if (hasSelected) {
                            this.$refs.gridData.toggleRowSelection(item)
                        }
                    }
                }
            } catch (e) {
                throw e
            }
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        confirmTicket () {
            // 选择了新的优惠券
            for (const item of this.multipleSelection) {
                const hasSelected = this.selectedTicket.some(row => row.id === item.id)
                if (!hasSelected) {
                    this.selectedTicket.push(item)
                }
            }
            // 取消了已选中的优惠券
            for (let i = 0; i < this.selectedTicket.length; i++) {
                const item = this.selectedTicket[i]
                const selectedTicketIndex = this.multipleSelection.findIndex(row => row.id === item.id)
                if (selectedTicketIndex < 0) {
                    this.selectedTicket.splice(i, 1)
                }
            }
            this.dialogTableVisible = false
        },

        // 移除
        deleteRow (index, rows) {
            rows.splice(index, 1)
        },
        // 时间格式转换
        daterangeChange () {
            if (!this.daterange) {
                this.params.startTime = ''
                this.params.endTime = ''
            }
            if (this.daterange && this.daterange.length === 2) {
                this.params.startTime = this.daterange[0]
                this.params.endTime = this.daterange[1]
            }
            this.search()
        },
        sort (isDisabled, isUp, index) {
            if (isDisabled) return
            const currentPresent = this.selectedTicket.splice(index, 1)[0]
            isUp ? this.selectedTicket.splice(index - 1, 0, currentPresent)
                : this.selectedTicket.splice(index + 1, 0, currentPresent)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-table .el-button{
  min-width:auto;
  padding:0;
}
.operation-column {
  min-height: 50px;
  position: relative;
  button{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
.sort {
  position: absolute;
  right: 20px;
  top: 50%;
  height: 50px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  text-align: center;

  i {
    flex: 1;
    width: 40px;
    height: 16px;
    border: 1px solid #dcdfe6;
    color: #606266;

    &:hover {
      fill: #409eff;
    }
  }

  .disabled {
    border-color: #ebeef5 !important;
    fill: #c0c4cc !important;
    cursor: not-allowed;
  }
}
</style>
