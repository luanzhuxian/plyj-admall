<template>
    <div class="bought">
        <el-button
            type="primary"
            size="middle"
            plain
            @click="showActivate = true"
        >
            我已购买，立即激活
        </el-button>

        <el-dialog
            width="484px"
            :visible.sync="showActivate"
            title="激活视频卡"
            :close-on-click-modal="false"
        >
            <el-form
                label-width="87px"
                label-position="left"
                ref="activeForm"
                :model="activeForm"
                :rules="activeFormRules"
            >
                <el-form-item label="输入卡号" prop="cardId">
                    <el-input
                        v-model="activeForm.cardId"
                        style="width: 266px;"
                        placeholder="请输入卡号"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="输入密码" prop="passwd">
                    <el-input
                        v-model="activeForm.passwd"
                        style="width: 266px;"
                        placeholder="请输入密码"
                        clearable
                    />
                    <el-tooltip effect="dark" content="需刮开密码显示" placement="top-start">
                        <pl-svg class="ml-20" name="icon-jinggao" fill="#999" width="20" />
                    </el-tooltip>
                </el-form-item>
                <el-checkbox v-model="isAgreementProtocol">
                    我已阅读并同意 <a style="color: #007bff;" href="javascript:;" @click="showProtocol = true">《服务协议》</a>
                </el-checkbox>
            </el-form>
            <div class="mt-24" style="text-align: center">
                <el-button @click="showActivate = false">
                    我还没卡，需要购买
                </el-button>
                <el-button type="primary" @click="beActivited" :disabled="!isAgreementProtocol">
                    确认激活
                </el-button>
            </div>
        </el-dialog>
        <Agreement
            :type="6"
            :show.sync="showProtocol"
        />
    </div>
</template>

<script>
import Agreement from '../../../../components/register/Agreement'
import {
    checkCard,
    confirmUse
} from './../../../../apis/product-center/line-teaching/live'
import Field from '../../../../components/common/Field.vue'
export default {
    name: 'Bought',
    components: {
        Agreement
    },
    data () {
        return {
            showProtocol: false,
            showActivate: false,
            isAgreementProtocol: false,
            activeForm: {
                cardId: '',
                passwd: ''
            },
            activeFormRules: {
                cardId: [
                    { required: true, message: '请输入卡号', trigger: 'blur' }
                ],
                passwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
    // 激活
        async beActivited () {
            try {
                await this.$refs.activeForm.validate()
                const { data } = await checkCard(this.activeForm)
                const { result } = data
                result.storageSize = this.formatFlowSize(result.storageSize)
                result.flowSize = this.formatFlowSize(result.flowSize)
                if (result.errorCode !== 0) {
                    this.$error(result.errorMsg)
                    return
                }
                const h = this.$createElement
                await this.$confirm({
                    title: '确认激活吗？',
                    message: h('div', null, [
                        h(Field, { props: { title: '卡号：', text: result.cardId } }),
                        h(Field, { props: { title: '套餐：', text: result.name } }),
                        h(Field, { props: { title: '金额：', text: `${ result.money / 100 }元` } }),
                        h(Field, { props: { title: '充值分钟数：', text: `${ result.rechargeMinute + result.giveMinute }分钟` } }),
                        h(Field, { props: { title: '充值存储空间：', text: result.storageSize } }),
                        h(Field, { props: { title: '充值观看流量：', text: result.flowSize } }),
                        h(Field, { props: { title: '使用时间：', text: result.startTime } }),
                        h(Field, { props: { title: '过期时间：', text: result.endTime } })
                    ]),
                    dangerouslyUseHTMLString: true
                })
                this.showActivate = false
                await confirmUse(this.activeForm)
                this.$router.push({ name: 'SeriesOverview' })
            } catch (e) {
                throw e
            }
        },
        // 转换流量大小的单位，不足1G的为M, 超过1G按G算
        formatFlowSize (size) {
            if (size > 1024) {
                return `${ (size / 1024).toFixed(2) }G`
            }
            return `${ size }M`
        }
    }
}
</script>
