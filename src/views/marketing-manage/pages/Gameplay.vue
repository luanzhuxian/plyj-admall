<template>
    <div :class="$style.gameplay">
        <div :class="$style.banner" />
        <SchemeLabel :class="$style.label" name="基础方案包" content="吸粉、老客带新客，提高下单转化率" />
        <div :class="$style.packageContainer">
            <SchemePack
                :class="$style.package"
                name="新人有礼"
                desc="新人注册立享豪礼大礼包"
                :count="activitiesInfo.helperActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新人有礼.png"
            />
            <SchemePack
                :class="$style.package"
                name="公众号增粉"
                desc="商城引导关注服务号"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公众号增粉.png"
            />
            <SchemePack
                :class="$style.package"
                name="组合聚惠学"
                desc="组合商品打包售卖，立享优惠"
                :expired="activitys.compound.status ? `${getDate(activitys.compound.createTime)}-${getDate(activitys.compound.validity)}` : ''"
                :count="activitiesInfo.combinationMarketActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/组合聚惠学.png"
            />
            <SchemePack
                :class="$style.package"
                name="秒杀"
                desc="限时抢购，引导用户消费"
                :expired="activitys.secondBuy.status ? `${getDate(activitys.secondBuy.data.createTime)}-${getDate(activitys.secondBuy.data.validity)}` : ''"
                :count="activitiesInfo.seckillActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/秒杀.png"
            />
            <SchemePack
                :class="$style.package"
                name="众志成团"
                desc="微信裂变，快速引流"
                :expired="activitys.togetherBuy.status ? `${getDate(activitys.togetherBuy.data.createTime)}-${getDate(activitys.togetherBuy.data.validity)}` : ''"
                :count="activitiesInfo.newyearGroupActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
            <SchemePack
                :class="$style.package"
                name="预购"
                desc="分批支付，提前享服务"
                :expired="activitys.bookingBuy.status ? `${getDate(activitys.bookingBuy.data.createTime)}-${getDate(activitys.bookingBuy.data.validity)}` : ''"
                :count="activitiesInfo.newyearPreActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/预购.png"
            />
            <SchemePack
                :class="$style.package"
                name="Helper活动"
                desc="设置Helper返现活动"
                :count="activitiesInfo.helperActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/Helper.png"
            />
            <SchemePack
                :class="$style.package"
                name="品类券"
                desc="支持发放多种品类券，购买减免商品和课程金额"
                :count="activitiesInfo.categoryCouponActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/品类券.png"
            />
        </div>
        <SchemeLabel :class="$style.label" name="双十二疯狂同学会" content="吸粉、老客带新客，提高下单转化率" />
        <div :class="$style.packageContainer">
            <SchemePack
                :class="$style.package"
                name="赢取豪礼"
                desc="邀请新用户助力，获得小礼品"
                expired="2019.10.28-2020.01.31"
                :count="activitiesInfo.invitingActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
            <SchemePack
                :class="$style.package"
                name="见学之旅"
                desc="签到小活动，点亮赢大奖"
                expired="2019.10.28-2020.01.31"
                :count="activitiesInfo.checkinActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
            <SchemePack
                :class="$style.package"
                name="秒杀"
                desc="限时抢购，引导用户消费"
                expired="2019.10.28-2020.01.31"
                :count="activitiesInfo.seckillActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
            <SchemePack
                :class="$style.package"
                name="众志成团"
                desc="微信裂变，快速引流"
                expired="2020.05.06-2021.05.06"
                :count="activitiesInfo.groupActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
        </div>
        <SchemeLabel :class="$style.label" name="新春开学季" content="吸粉、老客带新客，提高下单转化率" />
        <div :class="$style.packageContainer">
            <SchemePack
                :class="$style.package"
                name="我心中的年味"
                desc="获得我的年味，即可参与抽奖有机会获得年味大礼"
                expired="2019.12.26-2020.04.30"
                :count="activitiesInfo.signinActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/年味.png"
                bg-img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/方案包背景.png"
            />
            <SchemePack
                :class="$style.package"
                name="春耘计划"
                desc="组合购买，打包商品享优惠"
                expired="2019.12.26-2020.04.30"
                :count="activitiesInfo.combinationActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/春耘.png"
                bg-img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/方案包背景.png"
            />
            <SchemePack
                :class="$style.package"
                name="满减券"
                desc="支持发放多种满减券，购买减免商品和课程金额"
                :count="activitiesInfo.promptCouponActivityCount"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/满减券.png"
            />
        </div>
    </div>
</template>

<script lang='ts'>
import moment from 'moment'
import { Vue, Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import SchemeLabel from './../components/Scheme-Label.vue'
import SchemePack from './../components/Scheme-Pack.vue'
import { GET_MRKET_STATU_AUTH } from './../../../store/mutation-type'
import { getActivitiesInfo, getActivityAuth } from './../../../apis/marketing-manage/gameplay'

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
    @Getter mrketStatuAuth!: string
    @Action(GET_MRKET_STATU_AUTH) GET_MRKET_STATU_AUTH: any

    activitiesInfo: ActivityCounts = {}

    menuArray: Menu[] = []
    activeTab = 0
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
        }
    }

    async activated () {
        // await Promise.all([
        //     this.getActivitiesInfo(),
        //     this.getActivityAuth()
        // ])
    }

    private async getActivitiesInfo () {
        const data: unknown = await getActivitiesInfo()
        this.activitiesInfo = data as ActivityCounts
    }

    private async getActivityAuth () {
        const data = await getActivityAuth()
        this.menuArray = data.filter(({ activityValue }) => activityValue !== '3')
    }

    private async getmMrketStatuAuth () {
        await this[GET_MRKET_STATU_AUTH]()
        if (!this.mrketStatuAuth || !this.mrketStatuAuth.length) return

        const timeNow = moment().valueOf()
        const { mrketStatuAuth, activitys } = this
        const info = {
            compound: '1',
            dumplings: '2',
            secondBuy: '3',
            togetherBuy: '4',
            bookingBuy: '5',
            benefit: '6',
            LongmenLottery: '7',
            redeemCode: '8'
        }

        for (const key of Object.keys(info)) {
            const data = mrketStatuAuth.find(({ programId }) => programId === info[key])
            const status = !!(data && moment(data.validity).valueOf() > timeNow)
            activitys[key] = {
                data,
                status
            }
        }
    }

    private getDate (date: string): string {
        return date.split(' ')[0].replace(/-/g, '.')
    }

    get activityName () {
        const { menuArray, activeTab } = this
        return menuArray.length && menuArray[activeTab - 1] ? menuArray[activeTab - 1].activityName : ''
    }
}
</script>

<style module lang="scss">

.gameplay {
    box-sizing: border-box;
    padding: 36px;
    overflow-y: auto;
    background-color: #FFFFFF;
    > .banner {
        height: 90px;
        border-radius: 10px;
        background-color: pink;
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
