<template>
    <div class="benefit wrap">
        <ListHeader
            v-if="showTop"
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/公益活动.png"
            title="公益助力"
            description="公益千挑万选，爱心接力一点，学子共献真情"
            :start-time="publicBenefitInformation.createTime"
            end-time="2020-08-31"
        />
        <el-button style="margin-left: 10px" type="primary" round
                   @click="$router.push({ name: 'AddLongmenPublicBenefit' })"
        >
            新建活动
            <i class="el-icon-plus el-icon--right" />
        </el-button>
        <el-button class="underline" type="text" @click="explainFlag = true">
            活动说明
        </el-button>
        <pl-tabs
            v-if="showTop"
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'LongmenPublicBenefitList'},
            ]"
        />

        <router-view />

        <!--活动说明弹窗-->
        <el-dialog
            :visible.sync="explainFlag"
            width="50%"
            class="explain"
        >
            <div class="title" slot="title">
                <pl-svg name="icon-jinggao" class="tips-icon" width="32" fill="#ec742e" style="margin-right: 10px;" />
                <span>活动说明</span>
            </div>
            <div class="explain-content" slot="">
                <ul>
                    <li>活动说明：</li>
                    <li>1.设置选择参与公益活动的商品，支持普通商品，视频单课和系列课，机构可自由选择相应的商品参与活动；</li>
                    <li>2.活动期间，所有商品默认不支持退款，不支持线上发票；</li>
                    <li>3.家长购买相应的商品，可捐赠相应的公益金，放入整个活动的公益池进行累加；</li>
                    <li>4.活动结束后，活动期间累积的公益金将由机构统一进行捐赠；</li>
                </ul>
                <ul>
                    <li>活动设置：</li>
                    <li>第一步 打开“营销中心”，找到“公益行动”活动；</li>
                    <li>第二步 点开“创建活动”，开始创建活动内容；</li>
                    <li>1.活动名称，可设置活动名称，并可在活动界面中展示；</li>
                    <li>2.活动细则，该活动细则在活动期间将在用户端显示；</li>
                    <li>3.选择适合用户，可以选择helper用户，全部用户，选择某些分组可见；</li>
                    <li>4.选择活动时间，即在指定时间段内，购买参与活动的商品可捐赠相应的公益金；</li>
                    <li>5.选择活动商品，可选择普通商品（包括实体、虚拟和课程商品），知识课程（包括视频单课和系列课）；</li>
                    <li>6.选择商品后，可对商品设置可捐赠的公益金额；</li>
                    <li>7.支持设置捐赠冲顶公益金，即设定本次活动的目标捐赠金额；</li>
                </ul>
            </div>
            <div class="footer">
                <el-button type="primary" @click="explainFlag = false">
                    我知道了
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../../store/mutation-type'
import ListHeader from '../../../components/List-Header'
export default {
    name: 'LongmenPublicBenefit',
    components: { ListHeader },
    data () {
        return {
            explainFlag: false
        }
    },
    async created () {
        try {
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        } catch (e) { throw e }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        }),
        showTop () {
            return this.$route.name === 'LongmenPublicBenefitList'
        },
        publicBenefitInformation () {
            if (!this.marketStatusAuth || !this.marketStatusAuth.find(({ programId }) => programId === '6')) return {}
            const { createTime = '', validity = '' } = this.marketStatusAuth.find(({ programId }) => programId === '6')
            return { createTime, validity }
        }
    }
}
</script>

<style scoped lang="scss">

.benefit {
    .activity-icon {
        width: 23px;
    }

    > .tab {
        width: 116px;
        margin-top: 20px;
        padding: 0 30px;
        font-weight: bold;
        line-height: 39px;
        font-size: 14px;
        color: #333;
        background-color: #fff;
    }

    > .header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 52px;
        padding-left: 20px;

        > .active-time {
            display: inline-flex;
            align-items: center;
            height: 30px;
            margin-right: 24px;
            font-size: 16px;
            padding: 0 10px;
            border: 1px solid #ccc;
            border-radius: 15px;
        }

        .items {
            margin-right: 24px;
        }

        .description {
            color: #a8a8a8;
        }
    }
}

.explain {
    .title {
        display: flex;
        align-items: center;

        > span {
            color: #333;
            font-size: 18px;
            font-weight: bold;
        }

        > i {
            font-size: 32px;
            color: #ec742e;
            margin-right: 10px;
        }
    }

    .footer {
        text-align: center;
    }

    ::v-deep .el-dialog__body {
        padding: 0 65px 32px 65px;

        > .explain-content {
            > div {
                color: #ec742e;
                margin-bottom: 20px;
            }

            > ul {
                > li {
                    margin-bottom: 20px;
                }

                > li:nth-of-type(1) {
                    font-size: 16px;
                    font-weight: 800;
                }
            }
        }
    }
}

</style>
