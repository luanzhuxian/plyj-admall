<template>
    <el-dialog
        class="select-coupon"
        :visible="show"
        width="1100px"
        @close="closeHandler"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
    >
        <div slot="title" class="title">
            选择优惠券<span class="sub-title">(已选{{ allSelect.length }}/{{ maxSelect }})</span>
        </div>
        <el-form
            size="small"
            :inline="true"
            class="border-bottom"
            style="padding-bottom: 20px"
        >
            <el-form-item class="mb-0">
                <el-input
                    v-model.trim="form.name"
                    placeholder="请输入优惠券名称"
                    style="width: 180px;"
                    @change="search"
                    clearable
                />
            </el-form-item>
            <el-form-item
                class="mb-0"
                label="优惠券类型："
            >
                <el-select
                    v-model="form.couponType"
                    @change="search"
                    style="width: 90px;"
                >
                    <el-option
                        label="全部"
                        value="1,2"
                    />
                    <el-option
                        label="满减券"
                        value="1"
                    />
                    <el-option
                        label="品类券"
                        value="2"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="mb-0" label="用券有效期：">
                <!-- <date-range
          :clearable="true"
          disable-before
          @change="dateChange"
          type="datetimerange"
          size="small"
          start-label="有效日期："
          range-separator="至"
          end-label=""
        /> -->
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
                    plain
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    type="text"
                    @click="resetFormFilter"
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            class="content-table"
            :data="table"
            ref="table"
            :row-key="getRowKeys"
            @select="handleSelect"
            @select-all="handleSelectAll"
            @selection-change="handleSelectionChange"
        >
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />暂无优惠券，快去创建吧！
            </span>
            <el-table-column
                type="selection"
                :reserve-selection="true"
                width="55"
            />
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
                    满{{ row.useLimitAmount }}减{{ row.amount }}元
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
                label="用券有效期"
                width="300"
            >
                <template slot-scope="{row}">
                    {{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}
                </template>
            </el-table-column>
            <el-table-column
                prop="statusText"
                label="状态"
                width="80"
            />
        </el-table>
        <div v-if="canAdd">
            <el-button type="text" @click="addCoupon('AddReductionCoupon')">
                创建满减券
            </el-button>
            <el-button type="text" @click="addCoupon('AddCategoryCoupon')">
                创建品类券
            </el-button>
        </div>
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
import { getCouponList } from '../../../apis/marketing-manage/coupon'
import { resetForm } from '../../../assets/ts/utils'
import { SessionEnum } from '../../../enum/storage'

export default {
    name: 'SelectCoupon',
    props: {
        show: Boolean,
        // 是否可以新增优惠券
        canAdd: Boolean,
        // 默认传入的已选择的优惠券列表
        initCouponArray: {
            type: Array,
            default () {
                return []
            }
        },

        /** couponStatus
     * 1 3 结束  0停止
     * 4 进行中  2带开始
     * 5 包含 2，4
     */
        couponStatus: {
            type: Number,
            default: 4
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
        // 优惠券类型 1-满减券 2-品类券
        couponType: {
            type: String,
            default: '1'
        },
        // 最大可选择的优惠券个数，默认不限制个数
        maxSelect: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            // 深拷贝的父组件已选择的优惠券列表，当取消选择时，修改该列表
            originalSelected: [],
            // 新建优惠券之前，新选择的
            newSelected: [],
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
            daterange: []
        }
    },
    watch: {
        async show (val) {
            if (val) {
                this.form.status = this.couponStatus

                /* 顺序不能变 start */
                this.originalSelected = JSON.parse(JSON.stringify(this.initCouponArray))
                this.resetSelectedCouponList()
                this.addNewCoupon()

                /* 顺序不能变 end */
                await this.getList()
            } else {
                this.table = []
                this.selected = []
                this.newSelected = []
                this.originalSelected = []
                resetForm(this.form, {
                    current: 1,
                    size: 10,
                    status: 4,
                    distributionMethod: 1,
                    couponType: this.couponType
                })
                this.daterange = []
                // 隐藏弹框时，清空选中状态
                const table = this.$refs.table
                table.clearSelection()
            }
        }
    },
    computed: {
        allSelect () {
            const allSelect = JSON.parse(JSON.stringify(this.selected))
            for (const item of this.originalSelected) {
                const index = this.findIndex(this.selected, item.id)
                const hadExist = allSelect.some(iItem => iItem.id === item.id)
                if (index === -1 && !hadExist) allSelect.push(item)
            }
            for (const item of this.newSelected) {
                const index = this.findIndex(this.selected, item.id)
                const hadExist = allSelect.some(iItem => iItem.id === item.id)
                if (index === -1 && !hadExist) allSelect.push(item)
            }
            return allSelect
        }
    },
    methods: {
        async getList () {
            try {
                const { data } = await getCouponList(this.form)
                this.table = data.result.records
                this.total = data.result.total
                // 翻页时，为每页数据主备一个数组，如果这一页之前有选中的项，则使用之前的选择
                // this.selected[this.form.current - 1] = this.selected[this.form.current - 1] && this.selected[this.form.current - 1].length ? this.selected[this.form.current - 1] : []
                // this.setDefaultSelected()
                this.defaultSelect()
            } catch (e) {
                throw e
            }
        },
        findIndex (list, id) {
            return list.findIndex(item => item.id === id)
        },
        addNewCoupon () {
            const newCoupon = JSON.parse(sessionStorage.getItem(SessionEnum.couponResultData))
            sessionStorage.removeItem(SessionEnum.couponResultData)
            // 活动发放的才可
            if (!(newCoupon && newCoupon.id && newCoupon.distributionMethod === 1)) return
            if (this.allSelect.length >= this.maxSelect) return
            this.newSelected.push(newCoupon)
        },
        // 新建满减券/品类券之后，返回后重置数据
        resetSelectedCouponList () {
            // 来源于两部分： 点击确认选择的initCouponArray -> originalSelected; 本次新选的
            const selectedList = JSON.parse(sessionStorage.getItem(SessionEnum.selectedCouponList))
            sessionStorage.removeItem(SessionEnum.selectedCouponList)
            // 没有该记录，不影响正常操作
            if (!selectedList) return
            // 选出上次点击确认后，在本次影响后的结果
            this.originalSelected = this.initCouponArray.filter(item => this.findIndex(selectedList, item.id) !== -1)
            // 新建优惠券之前，新选择的
            this.newSelected = selectedList.filter(item => this.findIndex(this.originalSelected, item.id) === -1)
        },
        async defaultSelect () {
            if (this.originalSelected.length || this.newSelected.length) {
                await this.$nextTick()
                const table = this.$refs.table
                for (const item of this.table) {
                    // 是否应该被选中
                    const willSelected = this.originalSelected.some(row => row.id === item.id)
                    const willNewSelected = this.newSelected.some(row => row.id === item.id)
                    // 是否已被选中
                    const hasSelected = this.selected.some(row => row.id === item.id)
                    if ((willSelected || willNewSelected) && !hasSelected) {
                        table.toggleRowSelection(item, true)
                    }
                }
            }
        },
        search () {
            this.form.current = 1
            this.getList()
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
        resetFormFilter () {
            this.form = {
                name: '',
                status: 4,
                distributionMethod: 1,
                startTime: '',
                endTime: '',
                current: 1,
                size: 10,
                couponType: this.couponType
            }
            this.daterange = []
            this.search()
        },
        getRowKeys (row) {
            return row.id
        },
        deleteOriginalSelected (id) {
            const currentIndex = this.findIndex(this.originalSelected, id)
            if (currentIndex !== -1) this.originalSelected.splice(currentIndex, 1)
            const currentNewIndex = this.findIndex(this.newSelected, id)
            if (currentNewIndex !== -1) this.newSelected.splice(currentNewIndex, 1)
        },
        handleSelect (selection, row) {
            // 判断是否选中
            const isSelected = selection.includes(row)
            // 若是取消选中，将源数据的也删除掉
            if (!isSelected) this.deleteOriginalSelected(row.id)
        },
        handleSelectAll (selection) {
            // 取消全选 当前页所有数据
            const isAll = selection.length === this.table.length
            if (!isAll) {
                for (const item of this.table) {
                    this.deleteOriginalSelected(item.id)
                }
            }
        },
        handleSelectionChange (list) {
            this.selected = JSON.parse(JSON.stringify(list))
        },
        addCoupon (name) {
            // 记录当前页面的选择
            sessionStorage.setItem(SessionEnum.selectedCouponList, JSON.stringify(this.allSelect))
            this.$router.push({ name })
        },
        confirm () {
            if (this.maxSelect && this.allSelect.length > this.maxSelect) {
                return this.$warning(`您仅可选择${ this.maxSelect }张优惠券哦~`)
            }
            this.$emit('confirm', this.allSelect)
            this.closeHandler()
        },
        closeHandler () {
            this.$emit('update:show', false)
        },
        setDefaultSelected () {
            // let table = this.$refs.table
            // for (let item of this.selected[this.form.current - 1]) {
            //   let row = this.table.find(row => row.id === item.id)
            //   table.toggleRowSelection(row, false)
            // }
        }
    // dateChange ({ end, start }) {
    //   this.form.startTime = start
    //   this.form.endTime = end
    //   this.search()
    // },
    }
}
</script>

<style scoped lang="scss">
.title{
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
  color: #333;
  .sub-title{
    font-size: 10px;
    color: #999;
    font-weight: normal;
    margin-left: 10px;
  }
}
</style>
