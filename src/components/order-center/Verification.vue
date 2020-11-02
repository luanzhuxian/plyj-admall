<template>
    <div>
        <!-- First.输入核销码 -->
        <el-dialog
            width="480px"
            title="核销"
            :visible="dialogVerificationVisible"
            @close="dialogVerificationCancel()"
        >
            <el-form
                label-width="55px"
                style="width: 376px;height: 47px"
            >
                <el-form-item
                    class="mb-0"
                    label="核销码"
                >
                    <el-input
                        v-model="verificationNo"
                        type="number"
                        autocomplete="off"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="dialogVerificationCancel()" round>
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="dialogVerificationConfirm()"
                    round
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <!-- Second.核销码信息 -->
        <el-dialog
            width="380px"
            :visible.sync="invalidVerificationVisible"
        >
            <template v-if="boxStatus === 12">
                <div slot="title" class="tipTtitle" v-if="resData.status === 0">
                    <pl-svg class="icon-jinggao" width="36" fill="#ec742e" name="icon-jinggao" />确认核销
                </div>
                <div slot="title" class="tipTtitle" v-else>
                    <pl-svg class="icon-jinggao" width="36" fill="#ec742e" name="icon-jinggao" />{{ resData.redeemStatus }}
                </div>
                <el-form v-if="!(resData.status === 8)">
                    <div v-if="resData.status === 9" class="verification-status-text">
                        该票使用时间还未到，请核实时间
                    </div>
                    <div v-if="resData.status === 4" class="verification-status-text">
                        该票已过期，请核实后重试
                    </div>
                    <div v-if="resData.status === 1" class="verification-status-text">
                        该票已使用，请核实后重试
                    </div>
                    <div v-if="resData.status === 2 || resData.status === 3" class="verification-status-text">
                        该订单已申请售后，请核实后重试
                    </div>
                    <el-form-item
                        v-if="resData.orderSource !== 1"
                        class="mb-0"
                        label="活动类型:"
                    >
                        <div class="font-bold">
                            {{ activeStatusText[resData.orderSource] }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        v-if="resData.balanceAmount"
                        class="mb-0"
                        label="补尾款:"
                    >
                        <div class="font-bold">
                            {{ resData.balanceAmount/100 }}元
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="mb-0"
                        label="名称:"
                    >
                        <div class="font-bold">
                            {{ resData.productName }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="mb-0"
                        label="票价:"
                    >
                        <div class="font-bold">
                            ￥{{ resData.productPrice/100 }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        v-if="resData.needStudentInfo && resData.user"
                        class="mb-0"
                        label="姓名:"
                    >
                        <div class="font-bold">
                            {{ resData.user }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        v-if="resData.needStudentInfo && resData.userMobile"
                        class="mb-0"
                        label="手机:"
                    >
                        <div class="font-bold">
                            {{ resData.userMobile }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="mb-0"
                        label="票码:"
                    >
                        <div class="font-bold">
                            {{ resData.redeemCode }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="mb-0"
                        v-if="resData.status === 4"
                    >
                        <span slot="label" style="color:#D2524C">过期时间：</span>
                        <div class="font-bold" style="color: #000">
                            {{ resData.useEndTime || resData.validityPeriodEnd }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="mb-0"
                        v-if="resData.status === 1"
                    >
                        <span slot="label" style="color:#D2524C">使用时间：</span>
                        <div class="font-bold" style="color: #000">
                            {{ resData.usageTime }}
                        </div>
                    </el-form-item>
                </el-form>
                <div v-else>
                    未查到相关信息，请核实后重试
                </div>
                <div
                    slot="footer"
                    class="dialog-footer"
                >
                    <div v-if="resData.status === 0">
                        <el-button @click="invalidVerificationConfirm()" round>
                            取 消
                        </el-button>
                        <el-button
                            type="primary"
                            @click="codeConfirm()"
                            round
                        >
                            确 定
                        </el-button>
                    </div>
                    <el-button v-else
                               type="primary"
                               @click="invalidVerificationConfirm()"
                               round
                    >
                        我知道了
                    </el-button>
                </div>
            </template>
            <template v-if="boxStatus === 99">
                <div slot="title" class="tipTtitle" v-if="resData.status === 0">
                    <pl-svg class="icon-jinggao" width="36" fill="#ec742e" name="icon-jinggao" />确认核销
                </div>
                <div slot="title" class="tipTtitle" v-else>
                    <pl-svg class="icon-jinggao" width="36" fill="#ec742e" name="icon-jinggao" />{{ resData.redeemStatus? resData.redeemStatus : statusDesc[resData.status] }}
                </div>
                <el-form v-if="resData.status === 99 || resData.status === 1 || resData.status === 0">
                    <div v-if="resData.status === 99" class="verification-status-text">
                        该票已过期，请核实后重试
                    </div>
                    <div v-if="resData.status === 1" class="verification-status-text">
                        该票已使用，请核实后重试
                    </div>
                    <!-- 活动类型为新春或者双十二 端午活动类型无法显示 隐藏此字段 -->
                    <!--          <el-form-item-->
                    <!--            class="mb-0"-->
                    <!--            label="活动类型:"-->
                    <!--          >-->
                    <!--            <div class="font-bold">-->
                    <!--              {{ resData.activityType }}-->
                    <!--            </div>-->
                    <!--          </el-form-item>-->

                    <el-form-item
                        class="mb-0"
                        label="活动名称:"
                    >
                        <div class="font-bold">
                            {{ resData.activityName }}
                        </div>
                    </el-form-item>

                    <el-form-item
                        class="mb-0"
                        label="礼品名称:"
                    >
                        <div class="font-bold">
                            {{ resData.giftName }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        v-if="resData.name"
                        class="mb-0"
                        label="姓名:"
                    >
                        <div class="font-bold">
                            {{ resData.name }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        v-if="resData.mobile"
                        class="mb-0"
                        label="手机:"
                    >
                        <div class="font-bold">
                            {{ resData.mobile }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="mb-0"
                        label="票码:"
                    >
                        <div class="font-bold">
                            {{ resData.redeemCode }}
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="mb-0"
                        v-if="resData.status === 99"
                    >
                        <span slot="label" style="color:#D2524C">过期时间：</span>
                        <div class="font-bold" style="color: #000">
                            {{ resData.validityPeriodEnd }}
                        </div>
                    </el-form-item>
                </el-form>
                <div v-else>
                    未查到相关信息，请核实后重试
                </div>
                <div
                    slot="footer"
                    class="dialog-footer"
                >
                    <div v-if="resData.status === 0">
                        <el-button @click="invalidVerificationConfirm()" round>
                            取 消
                        </el-button>
                        <el-button
                            type="primary"
                            @click="codeConfirm()"
                            round
                        >
                            确 定
                        </el-button>
                    </div>
                    <el-button v-else
                               type="primary"
                               @click="invalidVerificationConfirm()"
                               round
                    >
                        我知道了
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- Third.核销结果 -->
        <el-dialog
            class="draft-upperLimit"
            :visible.sync="verificationCompleteVisible"
            :show-close="false"
            width="380px"
        >
            <div class="draft-upperLimit-box">
                <div class="content-text" v-if="!codeStatus">
                    核销失败，请重试
                </div>
                <div class="content-text" v-if="codeStatus">
                    核销成功
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click="verificationComplete()"
                    round
                >我知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { byredeemcode, byredeemcodeActive, auditredeemcode, auditredeemcodeActive } from '../../apis/order'
export default {
    name: 'Verification',
    data () {
        return {
            // 12-订单核销码； 99-礼品核销码
            boxStatus: '',
            verificationNo: '',
            verificationCompleteVisible: false,
            invalidVerificationVisible: false,
            resData: '',
            codeStatus: false,
            // 核销状态
            statusDesc: {
                1: '已使用',
                99: '已过期'
            },
            activeStatusText: {
                0: '优惠券订单',
                1: '普通订单',
                2: '团购订单',
                3: '秒杀订单',
                4: '预购订单',
                5: '春耘订单',
                6: '组合课订单',
                7: '公益订单',
                8: '兑换码订单'
            },
            codeStatusText: {
                0: '待使用',
                1: '已使用',
                2: '退款中',
                3: '已退款',
                4: '已过期',
                8: '无效票',
                9: '未开始'
            }
        }
    },
    props: {
        dialogVerificationVisible: Boolean
    },
    methods: {
        async dialogVerificationConfirm () {
            this.verificationNo = this.verificationNo.replace(/\s*/g, '')
            if (!this.verificationNo) {
                return this.$warning('核销码不能为空')
            }
            if (!(this.verificationNo.length === 12 || this.verificationNo.length === 14)) {
                return this.$warning('正确核销码位数为12位或者14位阿拉伯数字')
            }
            try {
                let result = ''
                if (this.verificationNo.length === 14) {
                    this.boxStatus = 99
                    if (!(this.verificationNo.substr(0, 2) === '99')) return this.$warning('无效码')
                    const { result: res } = await byredeemcodeActive({ redeemCode: this.verificationNo })
                    result = res
                } else {
                    this.boxStatus = 12
                    const { result: res } = await byredeemcode({ redeemCode: this.verificationNo })
                    result = res
                }
                this.resData = result
                // if (this.resData.status === 1 || this.resData.status === 2 || this.resData.status === 3 || this.resData.status === 4 || this.resData.status === 8 || this.resData.status === 9) {
                //   this.invalidVerificationVisible = true
                // }
                this.invalidVerificationVisible = true
            } catch (e) {
                throw e
            }
        },
        async codeConfirm () {
            try {
                let result = ''
                if (this.verificationNo.length === 14 && this.verificationNo.substr(0, 2) === '99') {
                    this.boxStatus = 99
                    const { result: res } = await auditredeemcodeActive({ redeemCode: this.verificationNo })
                    result = res
                } else {
                    this.boxStatus = 12
                    const { result: res } = await auditredeemcode({ redeemCode: this.verificationNo })
                    result = res
                }
                this.verificationCompleteVisible = true
                if (result) {
                    this.codeStatus = true
                } else {
                    this.codeStatus = false
                }
            } catch (e) {
                throw e
            }
        },
        dialogVerificationCancel () {
            this.verificationNo = ''
            this.$emit('update:dialogVerificationVisible', false)
        },
        invalidVerificationConfirm () {
            this.verificationNo = ''
            this.invalidVerificationVisible = false
            // this.$emit('update:dialogVerificationVisible', false)
        },
        verificationComplete () {
            this.verificationNo = ''
            this.invalidVerificationVisible = false
            this.verificationCompleteVisible = false
            // if (this.codeStatus) {
            //   this.$emit('update:dialogVerificationVisible', false)
            // }
        }
    }
}

/*
*
*   //核销码状态，0：待使用 1：已使用
  WAIT_USE(0, "待使用"),
    USED(1, "已核销"),

    /**
     * 退款中
     *
REFUNDNING(2, "退款中"),

  /**
   * 已退款
   *
  REFUNDED(3, "已退款"),

  /**
   * 已过期
   *
  EXPIRED(4,"已过期"),
  /**
   * 无效的票
   *
  INVALID_TICKET(8,"无效票"),
  /**
   * 未开始
   *
NOT_STARRED(9,"未到核销开始时间")
*
* */
</script>

<style scoped lang="scss">
  .draft-upperLimit{
    ::v-deep .el-dialog{
      .el-dialog__header {
        padding: 16px;
      }
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
    .draft-upperLimit-box{
      display: flex;
      justify-content: center;
      .content-text{
        width:323px;
        height:42px;
        font-size:16px;
        font-weight:bold;
        color: #333333;
        line-height:21px;
        text-align: center;
      }
    }
  }

  .tipTtitle {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    > .icon-jinggao {
      margin-right: 10px;
    }
  }
  .verification-status-text{
    padding-bottom: 10px;
    border-bottom: 1px solid #E7E7E7;
  }
  .font-bold{
    font-weight: bold;
  }
    .dialog-footer{
        text-align: center;
    }
</style>
