<template>
    <el-dialog
        class="select-coupon"
        :visible="show"
        title="选择优惠券"
        width="65%"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <el-form
            size="small"
            :inline="true"
            class="wrap border-bottom"
        >
            <el-form-item class="mb-0">
                <el-input
                    v-model.trim="form.name"
                    placeholder="请输入优惠券名称"
                    style="width: 220px;"
                    @change="search"
                    clearable
                />
            </el-form-item>
            <el-form-item
                class="mb-0"
                label="状态："
            >
                <el-select
                    v-model="form.status"
                    :disabled="true"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        label="全部"
                        :value="5"
                    />
                    <el-option
                        label="已停止"
                        :value="0"
                    />
                    <el-option
                        label="进行中"
                        :value="4"
                    />
                    <el-option
                        label="待开始"
                        :value="2"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="mb-0 ml-40" label="用券时间：">
                <el-date-picker
                    v-model="daterange"
                    @change="daterangeChange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :editable="false"
                />
            </el-form-item>
            <el-form-item class="mb-0">
                <el-button
                    type="primary"
                    @click="search"
                    style="width: 98px;"
                >
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            class="content-table"
            :data="table"
            ref="table"
            :row-key="getRowKeys"
        >
            <span
                slot="empty"
                class="empty"
                style="font-size: 14px;"
            >
                <p>
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                    暂无优惠券
                </p>
                <p>
                    <el-button @click="jump('AddReductionCoupon')">新增满减券</el-button>
                    <el-button @click="jump('AddCategoryCoupon')">新增品类券</el-button>
                </p>
            </span>
            <el-table-column
                label="选择 "
                width="55"
            >
                <template slot-scope="{ row }">
                    <el-radio class="coupon-radio" v-model="radioCoupon" :label="row">
            &nbsp;
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column
                prop="couponName"
                label="优惠券名称 "
            />
            <el-table-column
                prop="orderDetails"
                label="优惠券面值"
                width="150"
            >
                <template slot-scope="{row}">
                    满{{ row.useLimitAmount }}减{{ row.amount }}
                </template>
            </el-table-column>
            <el-table-column
                prop="couponName"
                label="优惠券类型 "
            >
                <template slot-scope="{row}">
                    {{ row.couponType === 1 ? '满减券': '品类券' }}
                </template>
            </el-table-column>
            <el-table-column
                label="领取方式"
                width="80"
            >
                <template slot-scope="{row}">
                    {{ row.distributionMethod === 0 ? '自行领取': '活动发放' }}
                </template>
            </el-table-column>
            <el-table-column
                label="用券时间"
                width="300"
            >
                <template slot-scope="{row}">
                    {{ row.useStartTime }} - {{ row.useEndTime }}
                </template>
            </el-table-column>
            <el-table-column
                prop="statusText"
                label="状态"
                width="80"
            />
        </el-table>
        <Pagination
            @change="getList"
            v-model="form.current"
            :total="total"
            :size="form.size"
        />

        <div class="mt-20" style="text-align: center;">
            <el-button @click="closeHandler">
                取 消
            </el-button>
            <el-button type="primary" @click="confirm">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getCouponList } from '../../apis/coupon'
import { resetForm } from '../../assets/ts/utils'

export default {
    name: 'RadioSelectCoupon',
    props: {
        show: Boolean,

        /** couponStatus
     * 1 3 结束  0停止
     * 4 进行中  2带开始
     * 5 包含 2，4
     */
        couponStatus: {
            type: Number,
            default: 5
        },

        /** packageType
     * 2019_01    2019年双十二优惠券
     * 2019_02       2019年新春优惠券
     * 2019_01，2019_02   双十二优惠券和新春优惠券
     */
        // packageType: {
        //   type: String,
        //   default: '2019_01'
        // },
        // 1 满减 2 品类
        couponType: {
            type: String,
            default: '1'
        }
    },
    data () {
        return {
            table: [],
            total: 0,
            selected: [],
            form: {
                name: '',
                status: 4,
                distributionMethod: 1,
                startTime: '',
                endTime: '',
                current: 1,
                size: 10,
                couponType: this.couponType
            },
            daterange: [],
            radioCoupon: ''
        }
    },
    watch: {
        async show (val) {
            if (val) {
                this.form.status = this.couponStatus
                await this.getList()
            } else {
                this.table = []
                resetForm(this.form, {
                    current: 1,
                    size: 10,
                    status: 4,
                    distributionMethod: 1,
                    couponType: this.couponType
                })
                const table = this.$refs.table // 隐藏弹框时，清空选中状态
                table.clearSelection()
            }
        }
    },
    methods: {
        getRowKeys (row) {
            return row.id
        },
        async getList () {
            try {
                const { data } = await getCouponList(this.form)
                this.table = data.result.records
                this.total = data.result.total
            } catch (e) {
                throw e
            }
        },
        daterangeChange () {
            if (!this.daterange) {
                this.form.startTime = ''
                this.form.endTime = ''
            }
            if (this.daterange && this.daterange.length === 2) {
                this.form.startTime = this.daterange[0]
                this.form.endTime = this.daterange[1]
                this.search()
            }
        },
        search () {
            this.form.current = 1
            this.getList()
        },
        confirm () {
            if (!this.radioCoupon) return this.$warning('请选择优惠券')
            this.$emit('confirm', JSON.parse(JSON.stringify(this.radioCoupon)))
            this.closeHandler()
        },
        closeHandler () {
            this.radioCoupon = ''
            this.$emit('update:show', false)
            this.$emit('close')
        },
        jump (routeName) {
            this.$router.push({ name: routeName })
            this.closeHandler()
        }
    },
    beforeRouteLeave (to, from, next) {
        next()
        this.closeHandler()
    }
}
</script>

<style scoped lang="scss">
::v-deep .coupon-radio {
    .el-radio__label {
        display: none;
    }
}

</style>
