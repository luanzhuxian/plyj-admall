<template>
    <div class="list-header">
        <div class="header">
            <img width="48" class="mr-10"
                 :src="icon">
            <div>
                <div class="font-weight-bold">{{ title }}</div>
                <div class="description">{{ description }}</div>
            </div>
        </div>
        <div class="active-time">
            <!--            <div v-if="typeof newcomersStatus === 'number'" class="activity-status">-->
            <!--                <pl-svg name="icon-shijian" width="16" class="mr-10" />-->
            <!--                <span v-if="newcomersStatus === 0">已结束</span>-->
            <!--                <span v-if="newcomersStatus === 1">未开始</span>-->
            <!--                <span v-if="newcomersStatus === 2">进行中</span>...-->
            <!--            </div>-->

            <div v-if="typeof coursePackageStatus === 'number' && coursePackageStatus !== -1" class="mr-20">
                <pl-svg name="icon-shijian" width="16" class="mr-10" />
                <span v-if="coursePackageStatus === 1">进行中...</span>
                <span v-else-if="coursePackageStatus === 0">未开始</span>
                <span v-else-if="coursePackageStatus === 2">已结束</span>
            </div>
            使用有效期：
            <span v-if="permanent">
                长期有效
            </span>
            <span v-else>
                {{ startTime | dateFormat('YYYY.MM.DD') }} - {{ endTime | dateFormat('YYYY.MM.DD') }}
            </span>
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

    interface RouteInfo {
        params: {
            programId: string;
        };

        [propName: string]: object | string;
    }

    @Component
export default class ListHeader extends Vue {
    @Prop({
        type: String,
        default: ''
    }) readonly icon: string | undefined

    @Prop({
        type: String,
        default: ''
    }) readonly title: string | undefined

    @Prop({
        type: String,
        default: ''
    }) readonly description: string | undefined

    @Prop({
        type: String,
        default: ''
    }) readonly startTime: string | undefined | ''

    @Prop({
        type: String,
        default: ''
    }) readonly endTime: string | undefined

    @Prop({
        type: Boolean,
        default: false
    }) readonly permanent: boolean | undefined

        @Prop({
            type: Number,
            default: undefined
        }) readonly newcomersStatus: number |undefined

        @Prop({
            type: Number,
            default: undefined
        }) readonly coursePackageStatus: number |undefined
}
</script>

<style lang="scss" scoped>
    .list-header {
        background: #F5F6FA;
        display: flex;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        .header{
            display: flex;
            align-items: center;
        }
        .description {
            font-size: 12px;
            color: #A8A8A8;
            margin-top: 4px;
        }
        .activity-status{
            width: 104px;
            height: 31px;
            background: #EC742E;
            border-radius: 130px;
            color: #ffffff;
            text-align: center;
            line-height: 31px;
            margin-right: 20px;
        }
        .active-time{
            font-size: 12px;
            color: #999;
            margin-left: 100px;
            margin-top: 10px;
            display: flex;
            align-items: center;
        }
    }
</style>
