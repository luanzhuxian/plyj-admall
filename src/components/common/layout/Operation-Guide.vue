<template>
    <div>
        <el-dialog
            :visible="show"
            append-to-body
            title="操作引导"
            width="640px"
            @close="close"
        >
            <div :class="$style.operationGuide">
                <img
                    :class="$style.bg"
                    src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/operation-guid.png"
                    alt=""
                >
                <div :class="$style.steps">
                    <div :class="$style.step">
                        <i class="fz-16 font-weight-bold">01.创建店铺</i>
                        <span>创建一家店铺</span>
                        <el-button plain v-if="!mallNumber" round type="primary" @click="showCreateMall = true">创建</el-button>
                    </div>
                    <div :class="$style.step">
                        <i class="fz-16 font-weight-bold">02.绑定支付</i>
                        <span>让校园有支付功能</span>
                        <el-button v-if="!appId && mallNumber" plain round type="primary" @click="guid('Wechat')">去认证</el-button>
                    </div>
                    <div :class="$style.step">
                        <i class="fz-16 font-weight-bold">03.创建产品</i>
                        <span>收益从产品开始</span>
                        <el-button v-if="appId" plain round type="primary" @click="guid('AddProduct')">创建产品</el-button>
                    </div>
                    <div :class="$style.step">
                        <i class="fz-16 font-weight-bold">04.装修店铺</i>
                        <span>让店铺独具一格</span>
                        <el-button v-if="appId" plain round type="primary" @click="guid('MallThemes')">装修店铺</el-button>
                    </div>
                    <div :class="$style.step">
                        <i class="fz-16 font-weight-bold">05.完成</i>
                        <span>线上如此简单</span>
                    </div>
                </div>
            </div>
        </el-dialog>
        <CreateMall :created-mall-show.sync="showCreateMall" append-to-body />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import CreateMall from '../select-mall/Create-Mall.vue'
const userModule = namespace('user')

@Component({
    components: {
        CreateMall
    }
})
export default class OperationGuide extends Vue {
    private showCreateMall = false

    @userModule.Getter('appId') appId!: string
    @userModule.Getter('mallNumber') mallNumber!: number

    // props
    @Prop({ type: Boolean }) show!: boolean

    close () {
        this.$emit('update:show', false)
    }

    guid (name: string) {
        this.$router.push({ name })
        this.close()
    }
}
</script>

<style module lang="scss">
    .operation-guide {
        padding: 16px;
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-column-gap: 30px;
        background-color: #fff;
    }
    .bg {
        width: 280px;
    }
    .steps {
        display: inline-grid;
        grid-row-gap: 48px;
    }
    .step {
        display: inline-grid;
        grid-template-columns: auto 96px;
        grid-template-rows: 20px 20px;
        grid-auto-flow: column dense;
        line-height: 20px;
        button {
            height: 32px;
        }
    }
</style>
