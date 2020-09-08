<template>
    <div :class="$style.gameplay">
        <div :class="$style.banner" />
        <SchemeLabel :class="$style.label" name="基础方案包" content="吸粉、老客带新客，提高下单转化率" />
        <div :class="$style.packageContainer">
            <SchemePack
                :class="$style.package"
                name="新人有礼"
                desc="新人注册立享豪礼大礼包"
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
                expired="2020.03.27-2021.03.27"
                desc="组合商品打包售卖，立享优惠"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/组合聚惠学.png"
            />
            <SchemePack
                :class="$style.package"
                name="众志成团"
                expired="2020.05.06-2021.05.06"
                desc="微信裂变，快速引流"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
            <SchemePack
                :class="$style.package"
                name="预购"
                expired="2020.05.06-2021.05.06"
                desc="分批支付，提前享服务"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/预购.png"
            />
            <SchemePack
                :class="$style.package"
                name="Helper活动"
                desc="设置Helper返现活动"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/Helper.png"
            />
            <SchemePack
                :class="$style.package"
                name="品类券"
                desc="支持发放多种品类券，购买减免商品和课程金额"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/品类券.png"
            />
        </div>
        <SchemeLabel :class="$style.label" name="双十二疯狂同学会" content="吸粉、老客带新客，提高下单转化率" />
        <div :class="$style.packageContainer">
            <SchemePack
                :class="$style.package"
                name="赢取豪礼"
                expired="2019.10.28-2020.01.31"
                desc="邀请新用户助力，获得小礼品"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
            <SchemePack
                :class="$style.package"
                name="见学之旅"
                expired="2019.10.28-2020.01.31"
                desc="签到小活动，点亮赢大奖"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
            <SchemePack
                :class="$style.package"
                name="秒杀"
                expired="2019.10.28-2020.01.31"
                desc="限时抢购，引导用户消费"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png"
            />
        </div>
        <SchemeLabel :class="$style.label" name="新春开学季" content="吸粉、老客带新客，提高下单转化率" />
        <div :class="$style.packageContainer">
            <SchemePack
                :class="$style.package"
                name="我心中的年味"
                expired="2019.12.26-2020.04.30"
                desc="获得我的年味，即可参与抽奖有机会获得年味大礼"
                img-src="https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/973e5a2a-0849-4caa-9c4a-5877abed78c7.png"
            />
            <SchemePack
                :class="$style.package"
                name="春耘计划"
                expired="2019.12.26-2020.04.30"
                desc="组合购买，打包商品享优惠"
                img-src="https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/973e5a2a-0849-4caa-9c4a-5877abed78c7.png"
            />
            <SchemePack
                :class="$style.package"
                name="满减券"
                desc="支持发放多种满减券，购买减免商品和课程金额"
                img-src="https://mallcdn.youpenglai.com/static/admall/marketing-manage/marketing-gameplay/973e5a2a-0849-4caa-9c4a-5877abed78c7.png"
            />
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import SchemeLabel from './components/Scheme-Label'
import SchemePack from './components/Scheme-Pack'

@Component({
    components: {
        SchemeLabel,
        SchemePack
    }
})
export default class Gameplay extends Vue {

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
