<template>
    <div :class="$style.gameplay">
        <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/营销中心-banner.png" :class="$style.banner">
        <SchemeLabel :class="$style.label" name="基础方案包" content="吸粉、老客带新客，提高下单转化率" />
        <div :class="$style.packageContainer">
            <SchemePack
                name="Helper活动"
                desc="设置Helper返现活动"
                :count="activitiesInfo.helperActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/Helper.png"
                route-info="MarketingHelper"
            />
            <SchemePack
                name="满减券"
                desc="支持发放多种满减券，购买减免商品和课程金额"
                :count="activitiesInfo.promptCouponActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/满减券.png"
                route-info="ReductionCouponList"
            />
            <SchemePack
                name="品类券"
                desc="支持发放多种品类券，购买减免商品和课程金额"
                :count="activitiesInfo.categoryCouponActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/品类券.png"
                route-info="CategoryCouponList"
            />
            <SchemePack
                name="新人有礼"
                desc="新人注册立享豪礼大礼包"
                :count="activitiesInfo.helperActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新人有礼.png"
                route-info="NewcomersGift"
            />
            <SchemePack
                name="公众号增粉"
                desc="商城引导关注服务号"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公众号增粉.png"
                route-info="MpWeixin"
            />
            <SchemePack
                name="组合聚惠学"
                desc="组合商品打包售卖，立享优惠"
                :expired="activitys.compound.status ? `${getDate(activitys.compound.data.createTime)}-${getDate(activitys.compound.data.validity)}` : ''"
                :count="activitiesInfo.combinationMarketActivityCount"
                :tags="['限']"
                :is-lock="!activitys.compound.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/组合聚惠学.png"
                :route-info="{
                    name: 'CoursePackage',
                    params: {
                        programId: '1'
                    }
                }"
            />
            <SchemePack
                name="秒杀"
                desc="限时抢购，引导用户消费"
                :expired="activitys.secondBuy.status ? `${getDate(activitys.secondBuy.data.createTime)}-${getDate(activitys.secondBuy.data.validity)}` : ''"
                :count="activitiesInfo.seckillActivityCount"
                :tags="['限','新']"
                :is-lock="!activitys.secondBuy.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/秒杀.png"
                :route-info="{
                    name: 'SecondBuy',
                    params: {
                        programId: '3'
                    }
                }"
            />
            <SchemePack
                name="众志成团"
                desc="微信裂变，快速引流"
                :expired="activitys.togetherBuy.status ? `${getDate(activitys.togetherBuy.data.createTime)}-${getDate(activitys.togetherBuy.data.validity)}` : ''"
                :count="activitiesInfo.newyearGroupActivityCount"
                :tags="['限','新']"
                :is-lock="!activitys.togetherBuy.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
                :route-info="{
                    name: 'TogetherBuy',
                    params: {
                        programId: '4'
                    }
                }"
            />
            <SchemePack
                name="预购"
                desc="分批支付，提前享服务"
                :expired="activitys.bookingBuy.status ? `${getDate(activitys.bookingBuy.data.createTime)}-${getDate(activitys.bookingBuy.data.validity)}` : ''"
                :count="activitiesInfo.newyearPreActivityCount"
                :tags="['限','新']"
                :is-lock="!activitys.bookingBuy.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/预购.png"
                :route-info="{
                    name: 'BookingBuy',
                    params: {
                        programId: '5'
                    }
                }"
            />
            <SchemePack
                name="兑换码"
                desc="支持多商品兑换，使用即可减免商品费用"
                :expired="activitys.redeemCode.status ? `${getDate(activitys.redeemCode.data.createTime)}-${getDate(activitys.redeemCode.data.validity)}` : ''"
                :count="activitiesInfo.exchangeCodeCount"
                :tags="['限']"
                :is-lock="!activitys.redeemCode.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/兑换码.png"
                :route-info="{
                    name: 'RedeemCode',
                    params: {
                        programId: '8'
                    }
                }"
            />
            <SchemePack
                name="粽粽有礼"
                desc="粽行四海，端午安康"
                :expired="activitys.dumplings.status ? `${getDate(activitys.dumplings.data.createTime)}-2020.08.31` : ''"
                :count="activitiesInfo.dragonBoatSigninActivityCount"
                :is-lock="!activitys.dumplings.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/粽粽有礼.png"
                :route-info="{
                    name: 'GeneralCoursePackage',
                    params: {
                        programId: '2'
                    }
                }"
            />
            <SchemePack
                name="公益行动"
                desc="学子携手，贡献爱心"
                :expired="activitys.benefit.status ? `${getDate(activitys.benefit.data.createTime)}-2020.08.31` : ''"
                :count="activitiesInfo.commonwealActivityCount"
                :is-lock="!activitys.benefit.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公益行动.png"
                :route-info="{
                    name: 'LongmenPublicBenefit',
                    params: {
                        programId: '6'
                    }
                }"
            />
            <SchemePack
                name="龙门抽大奖"
                desc="抽奖嗨翻天"
                :expired="activitys.LongmenLottery.status ? `${getDate(activitys.LongmenLottery.data.createTime)}-2020.08.31` : ''"
                :count="activitiesInfo.luckDrawActivityCount"
                :is-lock="!activitys.LongmenLottery.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/龙门抽大奖.png"
                :route-info="{
                    name: 'LongmenLottery',
                    params: {
                        programId: '7'
                    }
                }"
            />
            <SchemePack
                name="福利红包"
                desc="低价购买福利红包  支付抵扣享优惠"
                :expired="activitys.redPackage.status ? `${getDate(activitys.redPackage.data.createTime)}--${getDate(activitys.redPackage.data.validity)}` : ''"
                :count="activitiesInfo.redPackageActivityCount"
                :tags="['限','新']"
                :is-lock="!activitys.redPackage.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/福利红包.png"
                :route-info="{
                    name: 'RedPackage',
                    params: {
                        programId: '9'
                    }
                }"
            />
            <SchemePack
                name="抽奖乐翻天"
                desc="低成本高引流，多种主题任意选"
                :expired="activitys.happyLottery.status ? `${getDate(activitys.happyLottery.data.createTime)}--${getDate(activitys.happyLottery.data.validity)}` : ''"
                :count="activitiesInfo.happyLotteryActivityCount"
                :tags="['限','新']"
                :is-lock="!activitys.happyLottery.status"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/抽奖乐翻天.png"
                :route-info="{
                    name: 'HappyLottery',
                    params: {
                        programId: '10'
                    }
                }"
            />
            <SchemePack
                name="打卡聪明年"
                desc="打卡签到答题参与抽奖"
                :expired="activitys.dumplings.status ? `${getDate(activitys.dumplings.data.createTime)}-2020.08.31` : ''"
                :count="activitiesInfo.dragonBoatSigninActivityCount"
                :is-lock="!activitys.dumplings.status"
                :tags="['限','新']"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/抽奖乐翻天.png"
                :route-info="{
                    name: 'NewYearSignIn',
                    params: {
                        programId: '11'
                    }
                }"
            />
        </div>
        <!--        双十二 新春 隐藏               -->
        <!--        <SchemeLabel :class="$style.label" name="双十二疯狂同学会" content="吸粉、老客带新客，提高下单转化率" />-->
        <!--        <div :class="$style.packageContainer" @click.capture="tryTo(menuArray[0].lockStatus, '双十二疯狂同学会', $event)">-->
        <!--            <SchemePack-->
        <!--                name="赢取豪礼"-->
        <!--                desc="邀请新用户助力，获得小礼品"-->
        <!--                expired="2019.10.28-2020.01.31"-->
        <!--                :count="activitiesInfo.invitingActivityCount"-->
        <!--                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/赢取豪礼.png"-->
        <!--                route-info="InviteNewcomersGift"-->
        <!--            />-->
        <!--            <SchemePack-->
        <!--                name="见学之旅"-->
        <!--                desc="签到小活动，点亮赢大奖"-->
        <!--                expired="2019.10.28-2020.01.31"-->
        <!--                :count="activitiesInfo.checkinActivityCount"-->
        <!--                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/见学之旅.png"-->
        <!--                route-info="RoadLearning"-->
        <!--            />-->
        <!--        </div>-->
        <!--        <SchemeLabel :class="$style.label" name="新春开学季" content="吸粉、老客带新客，提高下单转化率" />-->
        <!--        <div :class="$style.packageContainer" @click.capture="tryTo(menuArray[1].lockStatus, '新春开学季', $event)">-->
        <!--            <SchemePack-->
        <!--                name="我心中的年味"-->
        <!--                desc="获得我的年味，即可参与抽奖有机会获得年味大礼"-->
        <!--                expired="2019.12.26-2020.04.30"-->
        <!--                :count="activitiesInfo.signinActivityCount"-->
        <!--                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/年味.png"-->
        <!--                bg-img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/方案包背景.png"-->
        <!--                route-info="YearFlavor"-->
        <!--            />-->
        <!--            <SchemePack-->
        <!--                name="春耘计划"-->
        <!--                desc="组合购买，打包商品享优惠"-->
        <!--                expired="2019.12.26-2020.04.30"-->
        <!--                :count="activitiesInfo.combinationActivityCount"-->
        <!--                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/春耘.png"-->
        <!--                bg-img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/方案包背景.png"-->
        <!--                route-info="SpringPloughing"-->
        <!--            />-->
        <!--        </div>-->
        <el-dialog top="40vh" custom-class="warn-12" width="620px" :visible.sync="dlgUnOpened">
            <div slot="title">
                您尚未获取{{ activityName }}授权校权限，请联系您的咨询师和客服开通。
            </div>
            <!-- <div class="dbl12-contact-us">
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/qingfeng-weixin.png">
        <div class="content">
          朋来清风<br>
          微信号：plyj007<br>
          电话：18601773363
        </div>
      </div> -->
            <div slot="footer">
                <el-button @click="dlgUnOpened = false">
                    朕知道了
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :title="`${activityName}专场活动已结束！`" :visible.sync="dlgExpired">
            <div slot="footer">
                <el-button @click="dlgExpired = false">
                    朕知道了
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import moment from 'moment'
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import SchemeLabel from '../../../components/marketing-manage/Scheme-Label.vue'
import SchemePack from '../../../components/marketing-manage/Scheme-Pack.vue'
import { getActivitiesInfo, getActivityAuth } from '../../../apis/marketing-manage/gameplay'
import { MutationTypes } from '@/store/mutation-type'
const account = namespace('account')

interface Menu {
    activityName: string;
    activityValue: number;
}

interface Activitys {
    [propName: string]: {
        data: object;
        status: boolean;
    };
}

interface ActivityCounts {
    [propName: string]: number;
}

@Component({
    components: {
        SchemeLabel,
        SchemePack
    }
})

export default class Gameplay extends Vue {
    @account.Getter marketStatusAuth!: any[]
    @account.Action(MutationTypes.getMarketStatusAuth) getMarketStatusAuth: any

    dlgExpired = false
    dlgUnOpened = false
    activityName = ''
    menuArray: Menu[] = []
    activitiesInfo: ActivityCounts = {}
    activitys: Activitys = {
        compound: {
            data: {},
            status: false
        },
        dumplings: {
            data: {},
            status: false
        },
        secondBuy: {
            data: {},
            status: false
        },
        togetherBuy: {
            data: {},
            status: false
        },
        bookingBuy: {
            data: {},
            status: false
        },
        benefit: {
            data: {},
            status: false
        },
        LongmenLottery: {
            data: {},
            status: false
        },
        redeemCode: {
            data: {},
            status: false
        },
        redPackage: {
            data: {},
            status: false
        },
        happyLottery: {
            data: {},
            status: false
        }
    }

    async created () {
        await Promise.all([
            this.getActivitiesInfo(),
            this.getActivityAuth()
        ])
        await this.getmMrketStatuAuth()
    }

    private tryTo (lockStatus: number, activityName: string, e: Event) {
        this.activityName = activityName
        if (lockStatus === 2) {
            this.dlgExpired = true
        } else if (lockStatus === 3) {
            this.dlgUnOpened = true
        }

        // 若锁定，阻止子事件
        if (lockStatus !== 1) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    private async getActivitiesInfo () {
        const { result } = await getActivitiesInfo()
        this.activitiesInfo = result as ActivityCounts
    }

    private async getActivityAuth () {
        const { result } = await getActivityAuth()
        this.menuArray = result.filter(({ activityValue }: any) => activityValue !== '3')
    }

    private async getmMrketStatuAuth () {
        await this.getMarketStatusAuth()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return

        const timeNow = moment().valueOf()
        const { marketStatusAuth, activitys } = this
        const info: any = {
            compound: '1',
            dumplings: '2',
            secondBuy: '3',
            togetherBuy: '4',
            bookingBuy: '5',
            benefit: '6',
            LongmenLottery: '7',
            redeemCode: '8',
            redPackage: '9',
            happyLottery: '10'
        }

        for (const key of Object.keys(info)) {
            const data = marketStatusAuth.find(({ programId }) => programId === info[key])
            const status = !!(data && moment(data.validity).valueOf() > timeNow)
            activitys[key] = {
                data,
                status
            }
        }
    }

    private getDate (date: string): string | undefined {
        if (date) return date.split(' ')[0].replace(/-/g, '.')
    }
}
</script>

<style module lang="scss">

.gameplay {
    height: 100%;
    box-sizing: border-box;
    padding: 36px;
    overflow-y: auto;
    background-color: #FFFFFF;
    > .banner {
        width: 100%;
    }
    > .label {
        margin: 40px 0 24px 0;
    }
    > .package-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 24px;
    }
}

@media screen and (max-width: 1500px) {
    .gameplay {
        .package-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 24px;
        }
    }
}

</style>
