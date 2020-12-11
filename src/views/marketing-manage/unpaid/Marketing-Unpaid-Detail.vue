<template>
    <div class="content-box">
        <div class="content-title">
            查看详情
        </div>
        <div class="tips" v-if="hasTips && day && day > 0 && day <31">
            <pl-svg name="yaji-tips" width="20" />
            <div>
                <p>温馨提示</p>
                <p>
                    该营销玩法还在使用中,<span>{{ day }}</span>天后即将过去，如需继续使用，请及时进行续订；
                </p>
            </div>
        </div>
        <div class="tips free" v-if="hasTips && !info && moment() < moment('2021.03.31')">
            <pl-svg fill="#4F63FF" name="yaji-tips" width="20" />
            <div>
                <p>免费提醒</p>
                <p>
                    新春开学季用户在活动期间可免费使用，可联系城市经理或者客服开通
                </p>
            </div>
        </div>
        <div class="content">
            <div class="title">
                <span>{{ getBaseMarketData.programName }}</span>
                <span class="status" v-if="moment(getBaseMarketData.activityStartTime).valueOf() > moment().valueOf()"><pl-svg
                    width="16" name="icon-timeOut-d1750" />暂未开启</span>
                <span class="status" v-if="moment(getBaseMarketData.activityEndTime).valueOf() < moment().valueOf()"><pl-svg
                    width="16" name="icon-timeOut-d1750" />已结束</span>
                <span class="status status-open"
                      v-if="moment(getBaseMarketData.activityStartTime).valueOf() < moment().valueOf() && moment(getBaseMarketData.activityEndTime).valueOf() > moment().valueOf()"><pl-svg
                          width="16" name="icon-bofang" />已开启</span>
            </div>
            <div class="title-p">
                <span v-if="programId === '1'">组合商品打包售卖，立享优惠</span>
                <span v-if="programId === '2'">粽行四海，端午安康</span>
                <span v-if="programId === '3'">限时抢购，引导用户消费</span>
                <span v-if="programId === '4'">微信裂变，快速引流</span>
                <span v-if="programId === '5'">分批支付，提前享服务</span>
                <span v-if="programId === '6'">学子携手，贡献爱心</span>
                <span v-if="programId === '7'">抽奖嗨翻天</span>
                <span v-if="programId === '8'">支持多商品兑换，使用即可减免商品费用</span>
                <span v-if="programId === '9'">低价购买福利红包，支付抵扣享优惠</span>
                <span v-if="programId === '10'">低成本高引流，多种主题任意选</span>
            </div>
            <div class="price-box">
                <span>￥{{ getBaseMarketData.presentPrice }}</span>
                <span class="original-price">原价：<span class="price">{{ getBaseMarketData.originalPrice }}</span></span>
                <!--        <span class="use-num">{{ getBaseMarketData.sales }} 家已使用</span>-->
            </div>
            <div class="longmen-hint">
                <el-button class="buy" type="primary" size="large"
                           :disabled="!(moment(getBaseMarketData.activityStartTime).valueOf() < moment().valueOf() && moment(getBaseMarketData.activityEndTime).valueOf() > moment().valueOf())"
                           @click="$router.replace({ name:'MarketingPay', params: { programId: programId }})">
                    立即订购
                </el-button>
                <!--                <div v-if="programId === '3' || programId === '4' || programId === '5'">-->
                <!--                    (龙门节用户免费使用，请联系城市经理或者客服开通)-->
                <!--                </div>-->
            </div>
            <div class="expiration-date">
                <div>
                    <span>使用有效期:</span>
                    <span class="date-detail">购买后 <span v-if="parseInt(getBaseMarketData.validityNumber/365)">{{ parseInt(getBaseMarketData.validityNumber/365) }} 年</span> <span
                        v-if="getBaseMarketData.validityNumber - 365*parseInt(getBaseMarketData.validityNumber/365)"> {{ getBaseMarketData.validityNumber - 365*parseInt(getBaseMarketData.validityNumber/365) }} 天</span>内可使用</span>
                </div>
                <div class="precautions">
                    <span>注意事项:</span><span>订购成功后，营销活动功能将可直接使用；使用有效期到期后，如未续订服务，则营销工具<span
                        class="date-detail">自动锁定</span></span>
                </div>
            </div>
            <div class="content-deatil">
                <div class="deatil-title" v-if="programId !== '8'">
                    活动详情：
                </div>
                <div class="detail-box">
                    <img v-if="programId === '1'" src="https://mallcdn.youpenglai.com/static/admall/2.8.0/组合聚惠学.jpg" alt="">
                    <img v-if="programId === '2'" src="https://mallcdn.youpenglai.com/static/admall/2.8.0/粽粽有礼.jpg" alt="">
                    <img v-if="programId === '3'" src="https://mallcdn.youpenglai.com/static/admall/2.8.0/限时秒杀.jpg" alt="">
                    <img v-if="programId === '4'" src="https://mallcdn.youpenglai.com/static/admall/2.8.0/众志成团2.jpg" alt="">
                    <img v-if="programId === '5'" src="https://mallcdn.youpenglai.com/static/admall/2.8.0/预购.jpg" alt="">
                    <img v-if="programId === '6'" src="https://mallcdn.youpenglai.com/static/admall/2.8.0/公益棕行动.jpg" alt="">
                    <img v-if="programId === '7'" src="https://mallcdn.youpenglai.com/static/admall/2.8.0/龙门抽大奖.jpg" alt="">
                    <div class="red-package-bg" v-if="programId === '9'">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.8.0/福利红包01.png" alt="">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.8.0/福利红包02.png" alt="">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.8.0/福利红包03.png" alt="">
                    </div>
                    <div class="red-package-bg" v-if="programId === '10'">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.8.0/福利红包01.png" alt="">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.8.0/福利红包02.png" alt="">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.8.0/福利红包03.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getBaseMarket } from '../../../apis/marketing-manage/gameplay'
import moment from 'moment/moment'
import { mapActions, mapGetters } from 'vuex'
import { MutationTypes } from '../../../store/mutation-type'

export default {
    name: 'CoursePackagePayDetali',
    props: {
        programId: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    data () {
        return {
            getBaseMarketData: {},
            day: '',
            info: '',
            hasTips: false,
            moment
        }
    },
    async created () {
        try {
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
            await this.getBaseMarket(this.programId)
            this.hasTips = ['9', '10'].includes(this.programId)
            if (this.hasTips) this.getValidity()
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
        // 查询年年翻活动详情
        async getBaseMarket () {
            try {
                const { result } = await getBaseMarket(this.programId)
                this.getBaseMarketData = result
            } catch (e) {
                throw e
            }
        },
        getValidity () {
            this.info = this.marketStatusAuth.find(({ programId }) => programId === this.programId)
            if (this.info) this.day = moment(this.info.validity).diff(moment(), 'day')
        }
    }
}
</script>

<style lang="scss" scoped>
    .content-box {
        margin-top: 20px;
        background-color: #fff;

        .content-title {
            display: flex;
            align-items: center;
            height: 60px;
            margin-top: 37px;
            padding-left: 30px;
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #e7e7e7;
            background-color: #fbfbfb;
        }

        .tips{
            display: flex;
            padding: 16px;
            margin: 20px 40px 0 40px;
            background-color: #FFFAF3;
            border: 1px solid #F79F1A;
            border-radius: 10px;
            >div{
                padding-left: 9px;
                p:first-child{
                    font-size: 14px;
                    font-weight: 400;
                }
                p:last-child{
                    font-size: 12px;
                    font-weight: 400;
                    color: #999999;
                    >span{
                        color: #F79F1A;
                    }
                }
            }
        }

        .free{
            border-color: #4F63FF;
            background-color: #F6F7FF
        }

        .content {
            padding: 24px;

            .title {
                display: flex;
                align-items: center;
                font-size: 32px;
                font-weight: bold;
                color: #333;

                .status {
                    margin-left: 16px;
                    padding: 6px 12px;
                    background: #ccc;
                    border-radius: 130px;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 400;

                    svg {
                        margin-right: 8px;
                    }
                }

                .status-open {
                    background-color: #ec742e;
                }
            }

            .title-p {
                margin-top: 18px;
                font-size: 22px;
                font-weight: 400;
                color: #666;
            }

            .price-box {
                margin-top: 41px;
                font-size: 36px;
                font-weight: bold;
                color: #ec742e;

                .original-price {
                    margin-left: 10px;
                    font-size: 12px;
                    color: #999;
                    text-decoration: line-through;

                    .price {
                        &:before {
                            content: '￥';
                        }
                    }
                }

                .use-num {
                    margin-left: 32px;
                    font-size: 18px;
                    font-weight: 400;
                    color: #999;
                }
            }

            .buy {
                width: 280px;
                height: 56px;
                margin-top: 18px;
                font-size: 18px;
            }

            .expiration-date {
                padding: 24px 40px;
                margin-top: 56px;
                border: 1px solid #E7E7E7;
                border-radius: 10px;
                font-size: 14px;
                color: #333;
                div{
                    > span:first-child {
                        color: #333333;
                        font-weight: bold;
                        font-size: 14px;
                    }
                }
                .precautions {
                    display: flex;
                    margin-top: 10px;
                    > span:first-child {
                        display: flex;
                        margin-right: 10px;
                        padding-left: 14px;
                    }
                    .date-detail {
                        margin-left: 0;
                    }
                }

                .date-detail {
                    margin-left: 10px;
                    color: #F79F1A;
                }
            }

            .longmen-hint {
                display: flex;
                align-items: center;

                > div {
                    padding-top: 10px;
                    padding-left: 15px;
                    color: #D0423C;
                }
            }

            .content-deatil{
                padding: 20px;
                margin-top: 24px;
                border: 1px solid #E7E7E7;
                border-radius: 10px;
                .deatil-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                }

                .detail-box {
                    margin-top: 16px;
                    background: #f8f8f8;

                    >img {
                        width: 100%;
                    }

                    .red-package-bg {
                        padding: 0 32px;
                        >img{
                            padding: 16px 0;
                        }
                    }
                }
            }

            .longmen-hint {
                display: flex;
                align-items: center;

                > div {
                    padding-top: 10px;
                    padding-left: 15px;
                    color: #D0423C;
                }
            }
        }
    }

</style>
