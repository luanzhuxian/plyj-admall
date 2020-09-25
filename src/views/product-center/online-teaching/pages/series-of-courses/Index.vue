<template>
    <div class="series-of-courses">
        <div class="data-wrap" v-if="showStatisticsRouter.indexOf(routeName) !== -1">
            <div class="data-box">
                <div class="data-type-name">
                    订购总量
                </div>
                <div class="data-value">
                    <span>{{ statistics.orderTotal || 0 }}</span>个
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    收益金额
                </div>
                <div class="data-value">
                    <span>{{ statistics.orderTotalPrice || 0 }}</span>元
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    总点播次数
                </div>
                <div class="data-value">
                    <span>{{ statistics.ovdNumberTotal || 0 }}</span>次
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    观看IP数
                </div>
                <div class="data-value">
                    <span>{{ statistics.ipNumberTotal || 0 }}</span>个
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    总观看时长
                </div>
                <div class="data-value">
                    <span>{{ statistics.watchTimeTotalTime || 0 }}</span>分钟
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    已消耗点播流量
                </div>
                <div class="data-value">
                    <span>{{ statistics.useDataFlowSize_G || 0 }}</span>G
                </div>
            </div>
        </div>
        <keep-alive exclude="AddSeriesOfCourses">
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
import { getStatistics } from './../../../../../apis/product-center/line-teaching/series-of-courses'
export default {
    name: 'SeriesOfCourses',
    data () {
        return {
            statistics: {},
            showStatisticsRouter: ['SeriesOfCoursesList'],
            warn: true
        }
    },
    async activated () {
        try {
            await this.getStatistics()
            if (this.warn) {
                await this.checkFLow()
            }
        } catch (e) {
            throw e
        }
    },
    computed: {
        routeName () {
            return this.$route.name
        }
    },
    methods: {
    // 获取统计数据
        async getStatistics () {
            try {
                const { result } = await getStatistics()
                this.statistics = result
            } catch (e) {
                throw e
            }
        },
        // 流量不足，提醒(只在第一次进来)
        async checkFLow () {
            this.warn = false
            if (this.statistics.remainderDataFlowSizeH <= 0) {
                await this.$confirm({
                    title: '',
                    message: '<div style="text-align: center; font-size: 18px; font-weight: bold; color: #333333"><p>您的点播剩余流量不足哦~</p><p>请尽快进行点播流量的充值，避免影响用户正常的点播观看服务！</p></div>',
                    dangerouslyUseHTMLString: true,
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonText: '去充流量'
                })
                this.$router.push({ name: 'PayAndOrder', params: { isRenew: '1', type: '3' } })
            }
        }
    }
}
</script>

<style scoped lang="scss">
.data-wrap {
    display: flex;
    padding: 24px 56px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e7e7e7;
    background-color: #fff;
    .data-box {
        flex: 1;
        margin-right: 40px;
        border-right: 1px solid #e7e7e7;
        &:nth-last-of-type(1) {
            border-right: none;
            margin-right: 0;
        }
    }
    .data-type-name {
        margin-bottom: 28px;
        font-size: 18px;
        line-height: 24px;
        font-weight: bold;
    }
    .data-value {
        margin-bottom: 6px;
        color: #666;
        > span {
            margin-right: 14px;
            font-size: 50px;
            line-height: 50px;
            color: #333;
        }
    }
}

</style>
