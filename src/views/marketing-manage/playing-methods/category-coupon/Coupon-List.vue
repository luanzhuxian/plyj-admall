<template>
    <div class="coupon-list wrap">
        <!--        支持发放品类券的发放，用户在商城购买商品满足一定金额，可抵扣优惠金额<br>-->
        <!--        例如：设置满2000减200元的品类券，则用户在商城购买只要满足支付2000元<br>-->
        <!--        的金额，即可立即减免200元的金额，即用户只需支付1800元即可下单成功。-->
        <ListHeader icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/品类券.png"
                    title="品类券"
                    description="支持发放多种品类券，购买减免部分商品和课程金额"
                    :permanent="true"
        />
        <el-button type="primary" round @click="$router.push({name:'AddCategoryCoupon'})">
            新增品类券
            <i class="el-icon-plus el-icon--right" />
        </el-button>
        <search-box class="mt-24">
            <el-form-item label="搜索内容">
                <el-input
                    v-model.trim="form.name"
                    placeholder="请输入品类券名称"
                    @change="search"
                    clearable
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    :clearable="true"
                    v-model="form.status"
                    @change="search"
                >
                    <el-option
                        label="全部"
                        value=""
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
                    <el-option
                        label="已结束"
                        :value="3"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="用券时间：">
                <date-range
                    ref="dateRange"
                    :clearable="true"
                    @change="dateChange"
                    type="date"
                    size="small"
                    start-label="用券时间："
                    range-separator="至"
                    end-label=""
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <div>
            <el-table
                class="content-table"
                :data="table"
                ref="table"
            >
                <span
                    slot="empty"
                    class="empty"
                >
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 暂无品类券，快去创建吧！
                </span>
                <el-table-column
                    prop="couponName"
                    label="品类券名称 "
                    header-align="left"
                    align="left"
                />
                <el-table-column
                    prop="orderDetails"
                    label="品类券金额"
                >
                    <template slot-scope="{row}">
                        满{{ row.useLimitAmount }}减{{ row.amount }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="领取方式"
                >
                    <template slot-scope="{row}">
                        {{ row.distributionMethod === 0 ? '自行领取': '活动发放' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="适用用户"
                    width="200"
                >
                    <template slot-scope="{row}">
                        <div v-if="row.receiveLimit !== 3">
                            {{ row.receiveLimit === '' && row.distributionMethod === 1 ? '所有注册用户' : receiveLimitType[row.receiveLimit] }}
                        </div>
                        <el-dropdown v-else trigger="click">
                            <span class="user-category-dropdown">
                                部分用户<i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item,index) in row.couponTagList" :key="index">
                                    {{ item.tagName }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column
                    label="用券时间"
                    width="300"
                >
                    <template slot-scope="{row}">
                        {{ row.useStartTime.split(' ')[0] }} ~ {{ row.useEndTime.split(' ')[0] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="receiveAmount"
                    label="领取量"
                    width="100"
                />
                <el-table-column
                    prop="usedAmount"
                    label="使用量"
                    width="100"
                />
                <el-table-column
                    prop="statusText"
                    label="状态"
                    width="80"
                />
                <el-table-column
                    label="操作"
                    align="right"
                    header-align="right"
                    width="100"
                >
                    <template slot-scope="{ row }">
                        <Operating>
                            <template slot="button-box">
                                <!--  除'已结束'以外的，'待开始/进行中/已停止'均可编辑 -->
                                <a
                                    v-if="row.status !==3"
                                    @click="$router.push({name: 'EditCategoryCoupon',params: { id: row.id}})"
                                >
                                    编辑
                                </a>
                                <!-- 除'已结束'以外的，'待开始/进行中/已停止'均可'结束'活动；与优惠卷领取方式无关 -->
                                <a
                                    v-if="row.status !==3"
                                    @click="finish(row)"
                                >
                                    结束
                                </a>
                                <a
                                    @click="$router.push({name: 'CopyCategoryCoupon',params: { id: row.id}})"
                                >
                                    复制
                                </a>
                                <a
                                    @click="viewCoupon(row)"
                                >
                                    查看
                                </a>
                                <!-- 仅'已结束'的优惠券支持删除 -->
                                <a
                                    v-if="row.status === 3"
                                    @click="deleteCoupon(row.id)"
                                >
                                    删除
                                </a>
                                <!--  除'待开始/已结束'以外的，只有'进行中/已停止'的'自行领取'的品类券均可开启/停止 -->
                                <div class="inline-b" v-if="row.status !==2 && row.status !==3 && row.distributionMethod === 0">
                                    <el-switch
                                        :disabled="row.status === 2"
                                        class="switch"
                                        v-model="row.pureStatus"
                                        @change="switchChange(row)"
                                        active-color="#4F63FF"
                                        :active-value="1"
                                        :inactive-value="0"
                                    />
                                    <span v-if="row.pureStatus" style="color: #4F63FF">
                                        开启
                                    </span>
                                    <span v-else style="color: #ccc">
                                        停止
                                    </span>
                                </div>
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
                :sizes="true"
            />
        </div>
        <!-- TODO: 暂时隐藏 -->
        <div class="guide-add" v-if="guideStatus">
            <img :src="`https://mallcdn.youpenglai.com/static/admall-new/3.0.0/img_step${guideStatus}.png`" alt="" @click="guideNext">
        </div>
    </div>
</template>

<script>
import {
    getCouponList,
    couponModifystatus,
    coupleIsFirstTime,
    getActivityListUseCoupon,
    deleteCoupon
} from '../../../../apis/marketing-manage/coupon'
import ListHeader from '../../components/List-Header.vue'

export default {
    name: 'CouponList',
    components: {
        ListHeader
    },
    data () {
        return {
            table: [],
            detail: {},
            keywords: '',
            form: {
                couponType: 2,
                name: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            total: 0,
            guideStatus: 0,
            receiveLimitType: ['所有注册用户', 'helper可用', '普通会员', '部分用户']
        }
    },
    watch: {
    // $route (to, from) {
    //   this.form.size = 10
    //   this.getList()
    // }
    },
    activated () {
        this.getList()
    },
    deactivated () {
        this.$refs.dateRange.clear()
        this.form = {
            couponType: 2,
            name: '',
            status: '',
            startTime: '',
            endTime: '',
            current: 1,
            size: 10
        }
    },
    async created () {
        const { result } = await coupleIsFirstTime()
        if (result) this.guideStatus = 1
    },
    methods: {
        async viewCoupon (row) {
            this.$router.push({ name: 'ViewCategoryCouponListActive', params: { id: row.id } })
        },
        async deleteCoupon (id) {
            try {
                await this.$confirm({
                    title: '确认要删除该优惠券吗？',
                    message: '优惠券删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                })
                await deleteCoupon(id)
                this.$success('删除成功')
                this.getList()
            } catch (e) {
                throw e
            }
        },
        async switchChange (row) {
            try {
                const data = {
                    id: row.id,
                    status: row.pureStatus
                }
                await couponModifystatus(data)
                this.getList()
            } catch (e) {
                if (row.status) {
                    row.pureStatus = 0
                } else {
                    row.pureStatus = 1
                }
                throw e
            }
        },
        async finish (row) {
            try {
                const res = await getActivityListUseCoupon(row.id)
                const result = res.result
                if (result.containInviting || result.containLiveActivity || result.containNewcomer) {
                    await this.$confirm({
                        title: '确认结束该品类券？',
                        message: `结束后${ result.containInviting ? '赢取豪礼活动将移除该品类券，' : '' }${ result.containNewcomer ? '新人有礼活动将结束或移除该品类券，' : '' }${ result.containLiveActivity ? '直播活动将移除该品类券，' : '' }请慎重考虑！！！`
                    })
                } else {
                    await this.$confirm({ title: '确认要结束品类券发放活动吗？', message: '该品类券结束发放后，其他营销活动不可选择进行活动发放，且不可重新进行开启，已领取成功用户不受此改动的影响' })
                }
                const data = {
                    id: row.id,
                    status: 3
                }
                await couponModifystatus(data)
                this.$success('该券结束成功')
                this.search()
            } catch (e) {
                throw e
            }
        },
        search () {
            this.form.current = 1
            this.getList()
        },
        sizeChange (val) {
            this.form.current = 1
            this.form.size = val
            this.getList()
        },
        async getList () {
            try {
                const res = await getCouponList(this.form)
                this.table = res.result.records
                this.total = res.result.total
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            this.form.current = 1
            this.getList()
        },
        guideNext () {
            this.guideStatus++
            if (this.guideStatus >= 5) this.guideStatus = 0
        }
    }
}
</script>

<style scoped lang="scss">
  .inline-b{
    display: inline-block;
    padding-right: 10px;
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
  .switch{
    margin-left: 10px;
  }
  .coupon-list{
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    background-color: #ffffff;
    .title-box{
      display: flex;
      align-items: center;
      padding: 10px 23px;
      .title{
        color: #333333;
        font-weight: bold;
        font-size: 16px;
        padding-left: 11px;
      }
      .title-detail{
        color: #999999;
        font-size: 16px;
      }
      .title-alert{
        margin: 0 20px;
      }
    }
    .right-btn {
      position: absolute;
      right: 40px;
    }

    .ml-40 {
      margin-left: 40px;
    }

    .empty{
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 12px;
        margin-right: 8px;
      }
    }

    .invoice-detail {
      line-height: 24px;

      .box {
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        color: #666;
        font-size: 12px;
        border-bottom: 1px solid #e7e7e7;

        &:nth-last-of-type(1) {
          border: none;
        }

        .status {
          font-size: 14px;
        }

        .time {
          display: inline-flex;
          flex-direction: column;
        }

        p {
          display: inline-flex;
          justify-content: space-between;

          span:nth-of-type(1) {
            width: 120px;
            text-align: right;
          }

          span:nth-of-type(2) {
            width: 100%;
            text-align: right;
          }
        }
      }
    }

    /*::v-deep .batch {*/
    /*  .el-table__header-wrapper {*/
    /*    .has-gutter {*/
    /*      tr {*/
    /*        th {*/
    /*          padding-top: 50px;*/
    /*        }*/

    /*        .el-table-column--selection {*/
    /*          padding: 0;*/
    /*          padding-bottom: 30px;*/
    /*        }*/
    /*      }*/
    /*    }*/
    /*  }*/
    /*}*/

    ::v-deep .content-table {
      .el-table__expand-column {
        .cell {
          display: none;
        }
      }

      .el-table__expanded-cell {
        padding: 0;

        .table-expand {
          display: flex;
          flex-direction: column;
          padding-left: 244px;

          .el-form-item {
            margin: 12px 0;
          }
        }
      }
    }

    .detail-Box {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      line-height: 21px;

      > .detail-content {
        display: flex;
        flex-direction: column;
        padding: 16px 0;
        border-bottom: 1px solid #E7E7E7;

        span {
          padding: 6px 0;
        }
      }

      > .detail-content:first-child {
        padding-top: 0;
      }

      .order-box {
        padding: 16px 0;
        border-bottom: 1px solid #E7E7E7;
        font-size: 14px;
        color: #666;

        .order-content {
          padding-bottom: 16px;

          .detail-content {
            display: flex;
            flex-direction: column;
            background-color: #F6F6F6;
            padding: 16px;

            > span {
              padding: 6px 0;
            }

            .commodity {
              padding: 6px 0;
              display: flex;
              flex-direction: row;

              .commodity-title {
                /*width: 124px;*/
              }

              .commodity-content {
                display: flex;
                flex: 1;
                flex-direction: column;
                div {
                  display: flex;
                  /*justify-content: space-between;*/
                  padding: 5px 0;
                  .commodity-name {
                    width: 233px;
                  }

                  .commodity-num {
                    width: 60px;
                    padding-left: 15px;
                  }
                }
                div:first-child{
                  padding-top: 0;
                }
              }
            }
          }

          .detail-content:first-child {
            border-bottom: 1px solid #E7E7E7;
          }
        }

        .order-content:last-child {
          padding-bottom: 0;
        }
      }
    }

    .more {
      display: flex;
      flex-direction: column;
      >div {
        display: flex;
        flex-direction: row;
        padding: 10px 0 10px 200px;
        font-size: 12px;
        color: #222222;
      }
    }
  }
  .guide-add {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 140px;
      z-index: 11;
      img{
          width: calc(100% - 140px);
      }
  }

  .user-category-dropdown {
    padding: 3px 10px;
    font-size: 12px;
    color: #222222;
    background-color: #eee;
    border: 1px solid #ccc;
  }
</style>
