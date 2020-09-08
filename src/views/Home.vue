<template>
    <!-- <h1>
        HOME
        <div @click="$router.push({name:'Login'})">用户登录</div>
    </h1> -->
    <div class="home">
        <!-- 常用功能 -->
        <Panel
            custom-class="functions-panel"
            title="常用功能"
            value="更多功能"
            is-link
            link-target="pl-cell__value-text"
            :to="{ name: '' }"
        >
            <div v-for="(item, key) in functionsPanelTmpl" :key="key">
                <router-link class="functions-panel__item" :to="item.to">
                    <img class="functions-panel__item-icon" :src="item.icon" alt="">
                    <div class="functions-panel__item-info">
                        <div class="functions-panel__item-name" v-text="item.name" />
                        <div class="functions-panel__item-desc" v-text="item.desc" />
                    </div>
                </router-link>
            </div>
        </Panel>

        <!-- 待核销订单 -->
        <Panel custom-class="write-off-panel" title="待核销订单">
            <div class="write-off-panel__item">
                <div>
                    <div>虚拟商品</div>
                    <router-link class="write-off-panel__item-number" :to="{ name: ' '}">{{ virtual }}</router-link>
                </div>
                <router-link class="write-off-panel__item-link" :to="{ name: ' '}">
                    <div>查看详情</div>
                </router-link>
            </div>
            <div class="write-off-panel__item">
                <div>
                    <div>课程商品</div>
                    <router-link class="write-off-panel__item-number" :to="{ name: ' '}">{{ course }}</router-link>
                </div>
                <router-link class="write-off-panel__item-link" :to="{ name: ' '}">
                    <div>查看详情</div>
                </router-link>
            </div>
        </Panel>

        <!-- 经营数据 -->
        <Panel custom-class="operation-panel" title="经营数据">
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">支付订单量</div>
                <div class="operation-panel__item-total">{{ totalOrders }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${totalOrdersYesterday}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">收益总额</div>
                <div class="operation-panel__item-total">{{ totalIncome }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${totalIncomeYesterday}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">会员数</div>
                <div class="operation-panel__item-total">{{ totalMembers }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${totalMembersYesterday}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">helper数</div>
                <div class="operation-panel__item-total">{{ totalHelpers }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${totalHelpersYesterday}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">月访客人数</div>
                <div class="operation-panel__item-total">{{ totalVisitors }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${totalVisitorsYesterday}人` }}</div>
            </router-link>
        </Panel>

        <!-- 待办事宜 -->
        <Panel custom-class="to-do-panel" title="待办事宜">
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">支付订单量</div>
                <div class="operation-panel__item-total">{{ toDoOrders }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${toDoOrdersYesterday}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待退款订单</div>
                <div class="operation-panel__item-total">{{ toDoRefund }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${toDoRefundYesterday}单` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待审核Helper</div>
                <div class="operation-panel__item-total">{{ toDoHelpers }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${toDoHelpersYesterday}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待审核润笔</div>
                <div class="operation-panel__item-total">{{ toDoRunbi }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${toDoRunbiYesterday}人` }}</div>
            </router-link>
            <router-link class="operation-panel__item" :to="{ name: ''}">
                <div class="operation-panel__item-name">待提现审核</div>
                <div class="operation-panel__item-total">{{ toDoWithdraw }}</div>
                <div class="operation-panel__item-yesterday">{{ `昨日：${toDoWithdrawYesterday}人` }}</div>
            </router-link>
        </Panel>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Panel from '../components/common/Panel.vue'

const functionsPanelTmpl = [
    {
        icon: 'https://mallcdn.youpenglai.com/static/admall/3.0.0/gift-purple.png',
        name: '新人有礼',
        desc: '新人注册送礼活动',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall/3.0.0/subscribe-green.png',
        name: '公众号增粉',
        desc: '商城引导关注服务号',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall/3.0.0/package-yellow.png',
        name: '组合聚惠学',
        desc: '组合商品打包售卖',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall/3.0.0/mobile-orange.png',
        name: '秒杀',
        desc: '多种满减券金额',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall/3.0.0/group-orange.png',
        name: '众志成团',
        desc: '商城引导关注服务号',
        to: {
            name: ''
        }
    }, {
        icon: 'https://mallcdn.youpenglai.com/static/admall/3.0.0/clock-blue.png',
        name: '预购',
        desc: '组合商品打包售卖',
        to: {
            name: ''
        }
    }
]

@Component({
    components: {
        Panel
    }
})
export default class Home extends Vue {
    private functionsPanelTmpl = Object.freeze(functionsPanelTmpl)
    private virtual = 0
    private course = 0
    private totalOrders = 0
    private totalOrdersYesterday = 0
    private totalIncome = 0
    private totalIncomeYesterday = 0
    private totalMembers = 0
    private totalMembersYesterday = 0
    private totalHelpers = 0
    private totalHelpersYesterday = 0
    private totalVisitors = 0
    private totalVisitorsYesterday = 0
    private toDoOrders = 0
    private toDoOrdersYesterday = 0
    private toDoRefund = 0
    private toDoRefundYesterday = 0
    private toDoHelpers = 0
    private toDoHelpersYesterday = 0
    private toDoRunbi = 0
    private toDoRunbiYesterday = 0
    private toDoWithdraw = 0
    private toDoWithdrawYesterday = 0
}
</script>

<style lang="scss">
.home {
    display: grid;
    grid-template-columns: minmax(710px, 1fr) minmax(580px, 1fr);
    grid-template-rows: 267px 239px 239px;
    grid-gap: 10px;

    .functions-panel,
    .write-off-panel,
    .operation-panel,
    .to-do-panel {
        padding: 0 36px;
        border: 1px solid #E7E7E7;
    }

    .operation-panel,
    .to-do-panel {
        grid-column-start: 1;
        grid-column-end: 3;
    }

    .functions-panel {
        &__item {
            display: inline-flex;
            &-icon {
                width: 48px;
                height: 48px;
                object-fit: cover;
            }
            &-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 10px;
            }
            &-name {
                font-size: 14px;
                font-family: Microsoft YaHei;
                line-height: 19px;
                color: #333333;
            }
            &-desc {
                margin-top: 4px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                line-height: 16px;
                color: #999999;
            }
        }
        > .pl-cell-group > .pl-panel__content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-row-gap: 40px;
            padding-top: 16px;
        }
    }
    .write-off-panel {
        > .pl-cell-group > .pl-panel__content {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-around;
            padding-top: 16px;
            padding-left: 36px;
        }
        &__item {
            display: flex;
            font-size: 14px;
            font-family: Microsoft YaHei UI;
            line-height: 19px;
            color: #333333;
            &-number {
                display: block;
                font-size: 48px;
                font-family: Microsoft YaHei UI;
                font-weight: 600;
                line-height: 64px;
                &:hover {
                    color: #4F63FF;
                }
            }
            &-link {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                margin-left: 40px;
                margin-bottom: 13px;
                color: #4F63FF;
            }
        }
    }
    .operation-panel,
    .to-do-panel {
        > .pl-cell-group > .pl-panel__content {
            display: grid;
            grid-template-columns: repeat(5, auto);
            justify-content: space-around;
            // padding-left: 36px;
        }
        &__item {
            font-size: 16px;
            font-family: Microsoft YaHei UI;
            line-height: 21px;
            color: #333333;
            &-total {
                font-size: 48px;
                font-weight: 600;
                line-height: 64px;
            }
            &-yesterday {
                margin-top: 8px;
                font-size: 16px;
                color: #999999;
            }
            &:hover {
                .operation-panel__item-total,
                .to-do-panel__item-total {
                    color: #4F63FF;
                }
            }
        }
    }

    .pl-cell {
        padding: 24px 0;
        &__title {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #333333;
        }
        &__value {
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #4F63FF;
            &-text {
                cursor: pointer;
            }
        }
    }
}

</style>
