<template>
    <div class="add-product">
        <top-back />
        <div class="add-content">
            <el-form label-width="150px" :model="form" :rules="rules" ref="ruleForm" label-position="left" class="main-form">
                <div class="content-title">
                    基本信息
                </div>
                <el-form-item v-if="!isStart" label="活动时间" label-width="170px" prop="activityEndTime">
                    <date-range
                        type="datetime"
                        @change="formatActivityTime"
                        :init="activityTimeRange"
                        disable-before
                    />
                </el-form-item>
                <el-form-item v-else label="活动时间" label-width="170px" prop="activityEndTime">
                    <div style="display: flex">
                        <el-date-picker
                            disabled
                            v-model="form.activityStartTime"
                            type="datetime"
                            placeholder="选择开始时间"
                            :editable="false"
                        />
                        <span style="padding: 0 10px">至</span>
                        <el-date-picker
                            v-model="form.activityEndTime"
                            :picker-options="startPickerOptions"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="选择结束时间"
                            default-time="23:59:59"
                            :editable="false"
                        />
                    </div>
                </el-form-item>
                <el-form-item>
                    <span slot="label">
                        <span>参与条件</span>
                        <span class="red">*</span>
                    </span>
                    <div class="man-l20">
                        <div>
                            签到累计满10次可点亮抽大奖，获得 1次抽奖机会
                        </div>
                    </div>
                </el-form-item>
                <!-- 特等奖设置 -->
                <el-form-item>
                    <span slot="label">
                        <span>特等奖设置</span>
                        <span class="red">*</span>
                    </span>
                    <div class="man-l20">
                        <el-button
                            type="primary"
                            plain
                            @click="editPresent(0, {}, '')"
                            :disabled="giftList.length > 1 || giftList.length === 1"
                        >
                            添加礼品
                        </el-button>
                        <span class="purchase-sort-description ml-10">(仅支持添加1个特等奖)</span>
                    </div>
                    <div class="tabel-box man-l20">
                        <el-table
                            :data="giftList"
                            border
                            style="width: 100%"
                        >
                            <el-table-column
                                fixed
                                prop="giftName"
                                label="礼品名称"
                                width="150"
                            />
                            <el-table-column :label="status === 2 ? '剩余库存':'库存'" width="180">
                                <template slot-scope="scope">
                                    <el-input-number v-model="scope.row.stock" :min="0" label="库存" />
                                </template>
                            </el-table-column>
                            <el-table-column label="领用量" prop="salesVolume" />
                            <el-table-column label="兑换时间">
                                <template slot-scope="scope">
                                    {{ scope.row.useStartTime }} - {{ scope.row.useEndTime }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="editPresent(0, scope.row, scope.$index)"
                                        type="text"
                                        size="small"
                                    >
                                        编辑
                                    </el-button>
                                    <el-button
                                        @click.native.prevent="deletePresent(scope.$index, 0)"
                                        type="text"
                                        size="small"
                                        :disabled="!!(isStart && scope.row.id)"
                                    >
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
                <!-- 是否设置安慰奖 -->
                <el-form-item>
                    <span slot="label">
                        <span>是否设置安慰奖</span>
                        <span class="red">*</span>
                    </span>
                    <div class="man-l20">
                        <div>
                            <el-radio-group size="small" v-model="hasConsolationPrize" @change="changeConsolationPrize" :disabled="!canConsolationPrize">
                                <el-radio :label="1">
                                    是
                                </el-radio>
                                <el-radio :label="0">
                                    否
                                </el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="hasConsolationPrize">
                            <el-button
                                type="primary"
                                plain
                                @click="editPresent(1, {}, '')"
                                :disabled="consolationPrizeList.length > 3 || consolationPrizeList.length === 3"
                            >
                                添加礼品
                            </el-button>
                            <span class="purchase-sort-description ml-10">(至多可设置3个安慰奖)</span>
                        </div>
                    </div>
                    <div class="tabel-box man-l20" v-if="hasConsolationPrize">
                        <el-table
                            :data="consolationPrizeList"
                            border
                            style="width: 100%"
                        >
                            <el-table-column
                                fixed
                                prop="giftName"
                                label="礼品名称"
                                width="150"
                            />
                            <el-table-column :label="status === 2 ? '剩余库存':'库存'" width="180">
                                <template slot-scope="scope">
                                    <el-input-number v-model="scope.row.stock" :min="0" label="库存" />
                                </template>
                            </el-table-column>
                            <el-table-column label="领用量" prop="salesVolume" width="80" />
                            <el-table-column label="兑换时间">
                                <template slot-scope="scope">
                                    {{ scope.row.useStartTime }} - {{ scope.row.useEndTime }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="editPresent(1, scope.row, scope.$index)"
                                        type="text"
                                        size="small"
                                    >
                                        编辑
                                    </el-button>
                                    <el-button
                                        @click.native.prevent="deletePresent(scope.$index, 1)"
                                        type="text"
                                        size="small"
                                        :disabled="!!(isStart && scope.row.id)"
                                    >
                                        移除
                                    </el-button>
                                    <el-button
                                        v-if="scope.row.status === 0"
                                        @click.native.prevent="scope.row.status = 1"
                                        type="text"
                                        size="small"
                                    >
                                        隐藏
                                    </el-button>
                                    <el-button
                                        v-if="scope.row.status === 1"
                                        @click.native.prevent="scope.row.status = 0"
                                        type="text"
                                        size="small"
                                    >
                                        显示
                                    </el-button>
                                    <div class="sort">
                                        <pl-svg
                                            name="icon-shang"
                                            width="40"
                                            height="16"
                                            :class="{ disabled: scope.$index === 0 }"
                                            :fill="scope.$index === 0 ? '#c0c4cc' : '#333'"
                                            @click="sort(scope.$index === 0, true, scope.$index)"
                                        />
                                        <pl-svg
                                            name="icon-xia"
                                            width="40"
                                            height="16"
                                            :fill="scope.$index === consolationPrizeList.length - 1 ? '#c0c4cc' : '#333'"
                                            :class="{ disabled: scope.$index === consolationPrizeList.length - 1 }"
                                            @click="sort(scope.$index === consolationPrizeList.length - 1, false, scope.$index)"
                                        />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" width="60">
                                <template slot-scope="scope">
                                    {{ scope.row.status === 0 ? '显示': '隐藏' }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
                <el-form-item label="使用须知" prop="activityBrief">
                    <div class="flex" style="margin-left: 20px;">
                        <el-input
                            type="textarea"
                            placeholder="请输入使用须知的内容"
                            v-model="form.activityBrief"
                            maxlength="500"
                            style="width: 420px;"
                            :rows="8"
                            resize="none"
                            show-word-limit
                        />
                    </div>
                </el-form-item>
                <div class="btn-box">
                    <el-button size="mini" plain style="width: 90px;margin-left: 20px" @click="cancel">
                        取消
                    </el-button>
                    <el-button size="mini" type="primary" plain @click="save">
                        保存
                    </el-button>
                    <el-button size="mini" type="primary" plain @click="isShowPreviewDialog = true">
                        预览
                    </el-button>
                </div>
            </el-form>
            <!-- 见学之旅示例 -->
            <div class="newcomer-example">
                <div class="newcomer-example-top" />
                <div class="newcomer-example-title">
                    见学之旅示例
                </div>
                <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/road-learning/road-learning-demo.png">
            </div>
        </div>
        <Edit-Present
            :show.sync="isShowAddPresent"
            :gift-type="giftType"
            :gift-detail.sync="giftDetail"
            @confirm="edit"
        />
        <Activity-Preview :is-show-dialog.sync="isShowPreviewDialog" :activity-start-time="form.activityStartTime" :activity-end-time="form.activityEndTime" />
    </div>
</template>
<script>
import EditPresent from '../../../../../components/common/Edit-Present.vue'
import ActivityPreview from './components/Activity-Preview.vue'
import { copyFields } from '../../../../../assets/ts/utils'
import { saveRoadLearningActivitys, getRoadLearningActivitysDeatil, updateRoadLearningActivitys } from '../../../../../apis/marketing-manage/newcomers'

export default {
    name: 'RoadLearningEdit',
    components: {
        EditPresent,
        ActivityPreview
    },
    data () {
        return {
            id: '',
            isCopy: false,
            status: 1, // 0-已结束 1-未开始 2-进行中 只有1-未开始 + 2-进行中可进入编辑页面
            isStart: false,
            giftType: '',
            giftDetail: {},
            startPickerOptions: { // 时间开始时间不能迟于当前时间
                disabledDate: time => time.getTime() < Date.now() - 8.64e7
            },
            form: {
                activityBrief: '1.在活动有效期内，累计签到满10次，即可开启见学之旅，开启大奖；\n' +
          '2.每人仅有1次抽取奖品的机会；\n' +
          '3.奖品：用户抽奖采用先到先到的方式，奖品派发完毕，则活动结束；\n' +
          '4.获得的奖品将自动存入“我的礼品”中，使用有效期内用户可随时查看使用；\n' +
          '5.“我的礼品”中存放的礼品需在该礼品使用有效期内到店兑换；过期或未到兑换时间使用时不予兑换，请妥善保管。', // 使用说明, string
                activityEndTime: '', // 活动结束时间 2019-10-22T02:53:47.339Z
                activityStartTime: '', // 活动开始时间 2019-10-22T02:53:47.339Z
                mallCheckinActivityGiftEntities: [

                    /* {
            checkinId: 0,
            giftBrief: '', // 礼品描述，string
            giftImage: '', // 礼品图片
            giftName: '', // 礼品名称
            giftType: 0, // 0 - 奖品， 1- 安慰奖
            id: 0, // 只修改时需要传
            stock: 0, // 库存
            useEndTime: '', // 使用截至时间
            useStartTime: '' // 使用开始时间
          } */
                ]
            },
            activityTimeRange: [],
            rules: {
                activityEndTime: [
                    { required: true, message: '结束时间不能为空', trigger: ['blur', 'change'] }
                ],
                activityBrief: [
                    { required: true, message: '使用须知不能为空', trigger: ['blur', 'change'] },
                    { max: 500, message: '使用须知不能超过500个字符', trigger: ['blur', 'change'] }
                ]
            },
            hasConsolationPrize: 1, // 是否设置安慰奖， 默认设置
            canConsolationPrize: true, // 是否可设置安慰奖
            giftList: [], // 当前奖品列表
            consolationPrizeList: [], // 安慰奖列表
            isShowAddPresent: false,
            giftIndex: '',
            isShowPreviewDialog: false // 是否显示预览框
        }
    },
    async activated () {
    // 获取当前奖品的ID,有ID的话就为编辑，反之亦然
        const params = this.$route.params
        this.id = params.id || ''
        this.isCopy = params.isCopy || false
        // 存在ID，加载当前奖品的信息
        if (this.id) {
            await this.init()
        } else {
            this.clearData()
        }
    },
    async deactivated () {
        await this.clearData()
    },
    methods: {
        async init () {
            try {
                const { data: res } = await getRoadLearningActivitysDeatil(this.id)
                this.status = res.result.mallCheckinActivityEntity.status
                if (this.status === 2) this.isStart = true
                copyFields(this.form, res.result.mallCheckinActivityEntity)
                this.form.mallCheckinActivityGiftEntities = res.result.mallCheckinActivityGiftEntities

                // 活动时间范围
                this.activityTimeRange = [this.form.activityStartTime, this.form.activityEndTime]

                // 奖品列表
                this.giftList = this.form.mallCheckinActivityGiftEntities.filter(item => !item.giftType)
                this.consolationPrizeList = this.form.mallCheckinActivityGiftEntities.filter(item => item.giftType)

                // 若活动未开始，或者未已设置安慰奖，不可再将不设置安慰奖
                this.canConsolationPrize = !this.isStart || !this.consolationPrizeList.length

                this.hasConsolationPrize = this.consolationPrizeList.length ? 1 : 0

                if (this.isCopy) {
                    // 若是复制过来的数据，需删除各处的id
                    this.id = ''
                    this.giftList.map(item => delete item.id)
                    this.giftList.map(item => delete item.id)
                }
            } catch (e) {
                throw e
            }
        },
        formatActivityTime ({ start, end }) {
            this.form.activityStartTime = start || ''
            this.form.activityEndTime = end || ''
        },
        changeConsolationPrize () {
            try {
                if (!this.hasConsolationPrize) {
                    this.$confirm({
                        title: '警告',
                        message: '确认点击“否”，不设置安慰奖吗！<br>如果确认，则会清空已设置的安慰奖信息！请谨慎操作！',
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        dangerouslyUseHTMLString: true
                    })
                        .then(() => {
                            this.consolationPrizeList = this.hasConsolationPrize ? this.consolationPrizeList : []
                        })
                        .catch(() => {
                            this.hasConsolationPrize = 1
                        })
                }
            } catch (e) {
                throw e
            }
        },
        async cancel () { // 取消
            await this.clearData()
            this.$router.back()
        },
        save () { // 保存
            this.$refs.ruleForm.validate(valid => {
                if (valid && this.checkGiftNum() && this.checkConsolationPrize()) {
                    this.saveCoupon()
                } else {
                    return false
                }
            })
        },
        async saveCoupon () {
            const form = {
                mallCheckinActivityEntity: {
                    activityBrief: '', // 使用说明, string
                    activityEndTime: '', // 活动结束时间 2019-10-22T02:53:47.339Z
                    activityStartTime: '' // 活动开始时间 2019-10-22T02:53:47.339Z
                },
                mallCheckinActivityGiftEntities: []
            }
            copyFields(form.mallCheckinActivityEntity, this.form)
            form.mallCheckinActivityGiftEntities = [...this.giftList, ...this.consolationPrizeList]

            if (this.id) { // 编辑活动
                await updateRoadLearningActivitys(this.id, form)
            } else { // 新加活动
                await saveRoadLearningActivitys(form)
            }

            this.$success('保存成功')
            await this.clearData()
            this.$router.back()
        },
        editPresent (giftType, giftDetail, giftIndex) {
            // 编辑奖品 or 添加奖品
            this.isShowAddPresent = true
            this.giftDetail = giftDetail
            this.giftType = String(giftType)
            this.giftIndex = giftIndex
        },
        deletePresent (index, giftType) {
            //  删除奖品
            if (giftType) {
                this.consolationPrizeList.splice(index, 1)
            } else {
                this.giftList.splice(index, 1)
            }
        },
        sort (isDisabled, isUp, index) {
            if (isDisabled) return
            const currentPresent = this.consolationPrizeList.splice(index, 1)[0]
            isUp ? this.consolationPrizeList.splice(index - 1, 0, currentPresent)
                : this.consolationPrizeList.splice(index + 1, 0, currentPresent)
        },
        edit (data) {
            // 将编辑的礼品信息放入礼品数组中
            const giftType = Number(data.giftType) // 礼品类型，0 - 奖品， 1- 安慰奖
            const giftDetail = data.giftDetail
            if (this.giftIndex === '') {
                giftType ? this.consolationPrizeList.push(giftDetail) : this.giftList.push(giftDetail)
            } else {
                const list = giftType ? this.consolationPrizeList : this.giftList
                copyFields(list[this.giftIndex], giftDetail)
            }
        },
        checkGiftNum () {
            if (!this.giftList.length) {
                this.$warning('特等奖设置不能为空')
                return false
            }
            return true
        },
        checkConsolationPrize () {
            // 设置安慰奖时，至少要设置一个安慰奖
            if (this.hasConsolationPrize && !this.consolationPrizeList.length) {
                this.$warning('请至少设置一个安慰奖')
                return false
            }
            return true
        },
        async clearData () {
            // 还原默认值
            this.form = {
                activityBrief: '1.在活动有效期内，累计签到满10次，即可开启见学之旅，开启大奖；\n' +
          '2.每人仅有1次抽取奖品的机会；\n' +
          '3.奖品：用户抽奖采用先到先到的方式，奖品派发完毕，则活动结束；\n' +
          '4.获得的奖品将自动存入“我的礼品”中，使用有效期内用户可随时查看使用；\n' +
          '5.“我的礼品”中存放的礼品需在该礼品使用有效期内到店兑换；过期或未到兑换时间使用时不予兑换，请妥善保管。', // 使用说明, string
                activityEndTime: '', // 活动结束时间 2019-10-22T02:53:47.339Z
                activityStartTime: '', // 活动开始时间 2019-10-22T02:53:47.339Z
                mallCheckinActivityGiftEntities: []
            }
            this.activityTimeRange = []
            this.hasConsolationPrize = 1
            this.giftList = []
            this.consolationPrizeList = []
            this.canConsolationPrize = true

            await this.$refs.ruleForm.clearValidate() // 清除校验
        }
    },
    watch: {
        $route () {
            try {
                const params = this.$route.params
                this.id = params.id || ''
                this.isStart = params.status && params.status.toString() === '2'
                this.clearData()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>
<style lang="scss" scoped>
  .red{
    color: #D0423C;
  }
  .man-l20{
    margin-left: 20px;
  }
  .man-t10{
    margin-top: 10px;
  }
  .font-12c{
    font-size: 12px;
    color: #cccccc;
  }
  .main-form {
    width: 1000px;
    ::v-deep .el-form-item__label {
      padding-left: 30px !important;
    }
  }
  .alink {
    color: #598bf8;
    font-size: 12px;
    text-decoration-line: underline;
  }

  .add-product {
    background-color: #f5f6f7;
    min-width: 1000px;
  }
  .add-content {
    display: flex;
    margin-top: 20px;
    margin-left: 80px;
    margin-right: 26px;
    background-color: #fff;
    .content-title {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      height: 60px;
      padding-left: 30px;
      font-size: 14px;
      font-weight: bold;
      border-top: 1px solid #e7e7e7;
      background-color: #fbfbfb;
    }

    .btn-box {
      border-top: 1px solid #e7e7e7;
      padding: 24px;
    }
    .newcomer-example{
      width: 40%;
      border-top: 1px solid #e7e7e7;
      .newcomer-example-top{
        height: 60px;
        background-color: #fbfbfb;
      }
      .newcomer-example-title{
        padding-left: 80px;
        padding-top: 80px;
        color: #666;
        font-size: 16px;
        padding-bottom: 14px;
      }
      img{
        padding-left: 80px;
        width: 180px;
      }
    }
  }
  .tabel-box{
    margin-top: 12px;
    width: 800px;
    border-top: 1px solid #CCCCCC;
    border-right: 1px solid #CCCCCC;
    border-left: 1px solid #CCCCCC;
    .tabel-head{
      .head-title{
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #CCCCCC;
        font-size: 12px;
        color: #333333;
        font-weight: bold;
        .empty{
          width: 30px;
        }
        .coupon-name{
          width: 160px;
        }
        .coupon-menoy{
          width: 160px;
        }
        .coupon-num{
          width: 160px;
        }
        .coupon-button{
          width: 70px;
        }
      }
      .tabel-content{
        font-weight: normal;
      }
    }
  }
  .purchase-sort-description {
    font-size: 12px;
    color: #999;
  }

  .sort {
    position: absolute;
    right: 20px;
    top: 50%;
    height: 80%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
      border: 1px solid #dcdfe6;
      color: #606266;
      &:hover {
        fill: #409eff;
      }
    }
    .disabled {
      cursor: not-allowed;
    }
  }
</style>
