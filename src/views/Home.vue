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
            <div v-for="(item, key) in functions" :key="key">
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
                    <router-link class="write-off-panel__item-number" :to="{ name: ' '}">1</router-link>
                </div>
                <router-link class="write-off-panel__item-link" :to="{ name: ' '}">
                    <div>查看详情</div>
                </router-link>
            </div>
            <div class="write-off-panel__item">
                <div>
                    <div>课程商品</div>
                    <router-link class="write-off-panel__item-number" :to="{ name: ' '}">18</router-link>
                </div>
                <router-link class="write-off-panel__item-link" :to="{ name: ' '}">
                    <div>查看详情</div>
                </router-link>
            </div>
        </Panel>

        <!-- 经营数据 -->
        <Panel custom-class="data-panel" title="经营数据">
            123
        </Panel>

        <!-- 待办事宜 -->
        <Panel custom-class="to-do-panel" title="待办事宜">
            123
        </Panel>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Panel from '../components/common/Panel.vue'

@Component({
    components: {
        Panel
    }
})
export default class Home extends Vue {
    private functions = [
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
    .data-panel,
    .to-do-panel {
        padding: 0 36px;
        border: 1px solid #E7E7E7;
    }

    .data-panel,
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
            > span {
                cursor: pointer;
            }
        }
    }
}

</style>
