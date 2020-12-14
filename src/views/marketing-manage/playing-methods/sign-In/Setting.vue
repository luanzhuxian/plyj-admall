<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="打卡聪明年"
    >
        <div class="setting">
            <div class="setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                1.粽粽有礼活动，是在一定活动时间内用户以签到端午活动的形式，满足签到的次数，即可抽取粽粽大礼的活动，粽粽大礼至多可设置3个奖品；<br>
                2.粽粽有礼参与签到的端午活动可由机构自行设置，累计签到所有的端午活动即可抽奖，每次签到均会弹出相应的端午活动的海报；<br>
                3.粽粽有礼可设置阶梯奖品，阶梯奖品至多可设置6个，可自行设置阶梯奖励的条件，即签到几个端午活动可获得相应的奖品；<br>
                4.粽粽大礼仅可设置实物礼品，阶梯奖励的奖品，可支持设置优惠券、奖学金和实物礼品三种奖品类型；<br>
                5.端午活动目前包括和端午相关的起源传说、端午食俗、端午配饰、民间习俗中的30个相关的端午活动，暂不支持自行修改；<br>
                6.参与活动的用户每天仅可签到1个端午活动，每个签到所有端午活动的用户，仅可获得1个抽奖机会；
            </p>
            <div class="setting-title">
                <div class="line" />活动设置：
            </div>
            <p class="text">
                第一步 打开“营销中心”，找到“粽粽有礼”活动；<br>
                第二步 点开“创建活动”，开始创建活动内容；<br>
                1.选择活动时间，即设置本次活动的时间；<br>
                2.端午活动内容：可设置签到端午活动的内容，最少设置7个，最多可设置30个；<br>
                3.选择适合用户，可以选择helper用户，全部用户，选择某些分组可见；<br>
                4.活动细则，该活动细则在活动期间将在用户端显示；<br>
                5.设置总中奖概率，进行中奖人数的限定；<br>
                6.设置粽粽大礼的礼品，至多可设置3个，仅支持实际礼品的设置；<br>
                7.设置阶梯奖励，支持不设置阶梯奖励，如果设置仅支持6个阶梯奖励，每个奖励仅支持1种类型，包括优惠券、奖学金和礼品；<br>
                8.设置品牌曝光，可支持上传品牌logo图片，在活动海报中展示。
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button round type="primary" @click="close">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'SignInSetting',
    props: {
        show: Boolean
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #E7E7E7;
    }
    .setting {
        height: 300px;
        overflow-y: auto;
        padding: 0 4px;
        font-size: 14px;
        .tips {
            font-weight: bold;
            margin-top: 30px;
            line-height: 28px;
        }
        .setting-title {
            display: flex;
            align-items: center;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 10px;
            .line{
                width: 2px;
                height: 12px;
                background: #4F63FF;
                margin-right: 10px;
            }
        }
        .text {
            line-height: 28px;
            margin-left: 12px;
            .blue{
                color: #4F63FF;
            }
        }
    }
    .dialog-footer {
        text-align: center;
    }
</style>
