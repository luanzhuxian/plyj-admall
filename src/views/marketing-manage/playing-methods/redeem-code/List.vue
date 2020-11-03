<template>
    <div class="wrap">
        <ListHeader icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/兑换码.png"
                    title="兑换码"
                    description="支持多商品兑换，使用即可减免商品费用"
                    :start-time="start"
                    :end-time="end"
        />
        <el-button type="primary" round @click="$router.push({ name: 'AddRedeemCode' })">
            新建活动
            <i class="el-icon-plus el-icon--right" />
        </el-button>
        <el-button type="text" @click="showExplanation = true">
            活动说明
        </el-button>

        <!--<pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'RedeemCodeListData'},
                {label:'活动设置',name:'RedeemCodeSetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />
-->
        <router-view />
        <Setting :show.sync="showExplanation" />
    </div>
</template>

<script>
import Setting from './Setting'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
import ListHeader from '../../components/List-Header'
export default {
    name: 'RedeemCodeList',
    components: {
        Setting,
        ListHeader
    },
    data () {
        return {
            start: '',
            end: '',
            showExplanation: false
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async mounted () {
        try {
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
            const redeemCodeInformation = this.marketStatusAuth.find(({ programId }) => programId === '8')
            this.start = (redeemCodeInformation && redeemCodeInformation.createTime) || ''
            this.end = (redeemCodeInformation && redeemCodeInformation.validity) || ''
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth])
    }
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
    }
    .active-time{
        font-size: 12px;
        color: #999;
        margin-left: 100px;
        margin-top: 10px;
    }
</style>
