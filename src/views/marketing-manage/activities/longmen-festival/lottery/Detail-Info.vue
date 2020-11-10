<template>
    <div class="detail-info">
        <div class="wrap">
            <el-button
                :disabled="Number($route.query.status) > 2"
                type="primary"
                round
                @click="$router.push({ name: 'EditLongmenLottery', params: { id } })"
            >
                编 辑
            </el-button>
        </div>
        <el-form
            class="wrap"
            label-width="150px"
            label-position="left"
            ref="form"
        >
            <el-form-item label="活动名称">
                {{ form.name }}
            </el-form-item>
            <el-form-item label="活动时间">
                {{ form.startTime }} - {{ form.endTime }}
            </el-form-item>
            <el-form-item label="活动对象">
                <span v-if="form.userRange === 0">所有用户</span>
                <span v-if="form.userRange === 1">Helper</span>
                <span v-if="form.userRange === 2">普通会员</span>
                <span v-if="form.userRange === 3">部分用户组：<span>{{ form.userGroups.map(item => item.groupName).join() }}</span></span>
            </el-form-item>
            <el-form-item label="活动明细">
                <pre v-text="form.activityRule" />
            </el-form-item>
            <el-form-item label="奖项类型">
                大转盘
            </el-form-item>
            <el-form-item label="中奖率">
                {{ winningProbability }}%
            </el-form-item>
            <el-form-item label="奖品设置">
                <div class="head-title" v-for="(item,index) in form.gifts" :key="index">
                    <div class="video-item1">
                        <span v-if="index < 3">
                            {{ SectionToChinese(index + 1) }}等奖
                        </span>
                        <span v-else>好礼</span>
                    </div>
                    <div class="video-item2">
                        {{ item.awardName }}
                        <template v-if="item.awardType === 2">
                            {{ item.scholarshipPrice }} 元
                        </template>
                    </div>
                    <div class="video-item3">
                        {{ awardTypeDictionary[item.awardType] }}
                    </div>
                    <div class="video-item4">
                        {{ item.stock }} 个
                    </div>
                    <div class="video-item5">
                        中奖概率{{ item.winningProbability }}%
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="获得抽奖条件">
                <div v-for="(item,index) in form.terms" :key="index">
                    用户
                    <span v-if="item.luckDrawType === 1">首次注册</span>
                    <span v-if="item.luckDrawType === 2">每天进入商城</span>
                    <!--订单实际支付后端金额单位为分  需除100-->
                    <span v-if="item.luckDrawType === 3">单笔订单实际支付满 {{ item.money/100 }} 元</span>
                    获得 {{ item.availableLuckDrawNumber }} 次 抽奖机会
                </div>
            </el-form-item>
            <el-form-item label="品牌曝光">
                {{ form.isShowLog ? '':'不' }}曝光
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getLotteryDetail } from '../../../../../apis/marketing-manage/lonmen-festival/lottery'
import { SectionToChinese } from '../../../../../assets/ts/utils'
export default {
    name: 'LongmenLotteryInfo',
    data () {
        return {
            form: {},
            winningProbability: 0,
            status: 2,
            // 1 礼品 2 奖学金 3 全场满减券 4 品类券
            awardTypeDictionary: {
                1: '礼品',
                2: '奖学金',
                3: '全场满减券',
                4: '品类券'
            },
            SectionToChinese
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async created () {
        try {
            await this.getDetail()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getDetail () {
            try {
                const { result } = await getLotteryDetail(this.id)
                this.form = result
                this.winningProbability = 0
                for (const item of this.form.gifts) {
                    this.winningProbability += item.winningProbability * 1000
                }
                this.winningProbability = this.winningProbability / 1000
                // this.form.gifts.map(item => item.winningProbability).sort((a, b) => a - b)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .detail-info {
    padding: 20px 0;
    ::v-deep .el-form-item__label {
      padding-left: 30px !important;
      font-size: 16px;
      color: #999;
    }
    .head-title {
      display: flex;
      padding-bottom: 10px;
      font-size: 14px;
      color: #333;
      /*font-weight: bold;*/
      >div {
        padding-left: 10px;
      }
      .video-item1 {
        width: 120px;
        padding-left: 0;
      }
      .video-item2 {
        width: 200px;
      }
      .video-item3 {
        width: 120px;
      }
      .video-item4 {
        width: 120px;
      }
      .video-item5 {
        width: 120px;
      }
    }
  }
</style>
