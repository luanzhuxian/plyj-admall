<template>
    <div class="add-content">
        <el-form label-width="150px" label-position="left">
            <el-button
                v-if="newcomersInfo.status === 1 || newcomersInfo.status === 2"
                type="primary"
                @click="$router.push({ name: 'NewcomersEdit', params: { id: newcomersInfo.id } })"
            >
                编 辑
            </el-button>
            <div class="content-title">
                基本信息
            </div>
            <el-form-item label="活动名称" prop="activityName">
                {{ newcomersInfo.activityName }}
            </el-form-item>
            <el-form-item label="活动时间">
                {{ newcomersInfo.activityStartTime | dateFormat('YYYY-MM-DD') }} - {{ newcomersInfo.activityEndTime | dateFormat('YYYY-MM-DD') }}
            </el-form-item>
            <el-form-item label="活动对象">
                新注册会员
            </el-form-item>
            <el-form-item label="活动细则" prop="activityBrief">
                <pre v-html="newcomersInfo.activityBrief" style="width: 720px; white-space: pre-wrap" />
            </el-form-item>
            <div class="content-title">
                礼品信息
            </div>
            <el-form-item label="发放数量">
                {{ newcomersInfo.limited === 0 ? '不限' : `${newcomersInfo.publishNum}份新人优惠大礼包` }}
            </el-form-item>
            <el-form-item label="可领取礼品">
                <div class="man-t10" v-if="newcomersInfo.couponModels && newcomersInfo.couponModels.length">
                    优惠券 ({{ newcomersInfo.totalCouponAmount || 0 }}元)
                </div>
                <div class="tabel-box" v-if="newcomersInfo.couponModels && newcomersInfo.couponModels.length">
                    <el-table :data="newcomersInfo.couponModels" border>
                        <el-table-column label="优惠券类型">
                            <template #default="{row}">
                                {{ row.couponType === 1 ? '满减券' : '品类券' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠名称" prop="couponName" />
                        <el-table-column label="面值">
                            <template #default="{row}">
                                满{{ row.useLimitAmount }}减{{ row.amount }}元
                            </template>
                        </el-table-column>
                        <el-table-column label="赠送数量" width="70">
                            1
                        </el-table-column>
                        <el-table-column label="用券时间" width="170">
                            <template #default="{row}">
                                {{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}
                                <div class="date-tips" v-if="Number(Date.parse(row.useEndTime)) > Number(Date.parse(newcomersInfo.activityStartTime)) && Number(Date.parse(row.useEndTime)) < Number(Date.parse(newcomersInfo.activityEndTime))">
                                    用券有效期过期后，新用户不可领取
                                </div>
                                <div class="date-tips" v-if="row.status === 3 || (Number(Date.parse(row.useEndTime)) < Number(Date.parse(newcomersInfo.activityStartTime)))">
                                    {{ row.status === 3 ? `${row.couponType === 1 ? '满减券已失效，新用户不可领取' : '品类券已失效，新用户不可领取'}` : '用券有效期已过期，新用户不可领取' }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="man-t10" v-if="newcomersInfo.scholarships && newcomersInfo.scholarships.length">
                    奖学金 ({{ newcomersInfo.totalScholarshipPrice || 0 }}元)
                </div>
                <div class="tabel-box" v-if="newcomersInfo.scholarships && newcomersInfo.scholarships.length">
                    <el-table :data="newcomersInfo.scholarships" border>
                        <el-table-column label="奖学金名称">
                            新人奖学金
                        </el-table-column>
                        <el-table-column label="金额（元）" prop="scholarshipPrice" />
                        <el-table-column label="赠送数量" width="70">
                            1
                        </el-table-column>
                        <el-table-column label="有效时间" width="170">
                            <template #default="{row}">
                                奖学金领取当日起{{ row.scholarshipEffectiveTime }}日内使用，过期自动作废
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="man-t10" v-if="newcomersInfo.gifts && newcomersInfo.gifts.length">
                    礼品 ({{ newcomersInfo.gifts.length || 0 }}个)
                </div>
                <div class="tabel-box" v-if="newcomersInfo.gifts && newcomersInfo.gifts.length">
                    <el-table :data="newcomersInfo.gifts" border>
                        <el-table-column label="礼品图片">
                            <template #default="{row}">
                                <img :src="row.giftImage" width="60" height="60" v-viewer>
                            </template>
                        </el-table-column>
                        <el-table-column label="礼品名称" prop="giftName" />
                        <el-table-column label="赠送数量">
                            1
                        </el-table-column>
                        <el-table-column label="兑换有效期">
                            <template #default="{row}">
                                {{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}
                                <div class="date-tips" v-if="Number(Date.parse(row.useEndTime)) > Number(Date.parse(newcomersInfo.activityStartTime)) && Number(Date.parse(row.useEndTime)) < Number(Date.parse(newcomersInfo.activityEndTime))">
                                    兑换有效期过期后，新用户不可领取
                                </div>
                                <div class="date-tips" v-if="Number(Date.parse(row.useEndTime)) < Number(Date.parse(newcomersInfo.activityStartTime))">
                                    兑换有效期已过期，新用户不可领取
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form-item>
            <div class="content-title">
                其它信息
            </div>
            <el-form-item label="品牌曝光">
                <div v-if="newcomersInfo.logoShow">
                    <div>展示品牌logo</div>
                    <img :src="newcomersInfo.logoUrl" width="60" height="60" v-viewer>
                </div>
                <div v-else>
                    不展示品牌logo
                </div>
            </el-form-item>
        </el-form>
        <div class="newcomer-example">
            <div class="newcomer-example-title">
                新人有礼示例
            </div>
            <img width="360" src="https://mallcdn.youpenglai.com/static/admall/2.11.0/newcomer.png">
        </div>
        <div class="btn-box">
            <el-button size="mini" plain style="width: 90px;margin-left: 20px" @click="$router.go(-1)">
                返回
            </el-button>
        </div>
    </div>
</template>

<script>
import { getNewcomerActivitysDeatil } from '../../../../apis/marketing-manage/newcomers'

export default {
    name: 'NewcomersDetail',
    data () {
        return {
            STATUS: ['已结束', '未开始', '进行中'],
            newcomersInfo: {}
        }
    },
    async created () {
        await this.getDetail()
    },
    methods: {
        async getDetail () {
            const { result } = await getNewcomerActivitysDeatil(this.$route.params.id)
            this.$parent.newcomersInfo = result
            this.newcomersInfo = result
        }
    }
}
</script>

<style lang="scss" scoped>
  .add-content {
    padding: 20px;
    background: #fff;
    position: relative;
    .content-title {
      margin-top: 24px;
      height: 60px;
      font-size: 14px;
      font-weight: bold;
    }
    .newcomer-example {
      position: absolute;
      top: 0;
      right: 100px;
      .newcomer-example-title {
        padding-left: 80px;
        padding-top: 20px;
        color: #666;
        font-size: 16px;
        padding-bottom: 14px;
      }
      img {
        padding-left: 80px;
      }
    }
    .tabel-box {
      margin-top: 12px;
      width: 700px;
    }
    .btn-box {
      border-top: 1px solid #e7e7e7;
      padding: 30px 0;
    }
    .date-tips{
      font-size: 10px;
      color: #FEB105
    }
  }
</style>
