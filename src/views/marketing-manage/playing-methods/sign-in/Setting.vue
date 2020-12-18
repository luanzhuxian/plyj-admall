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
                1.打卡聪明年活动，是在一定活动时间内用户用户打卡参与答题的形式，满足签到的次数，即可抽取智慧礼的活动，智慧礼至多可设置3个奖品；<br>
                2.打卡聪明年参与答题的次数自行设置，累计打卡所有的智力题即可抽奖，每次签到均会弹出相应智力题的海报；<br>
                3.打卡聪明年可设置阶梯奖品，阶梯奖品至多可设置6个，可自行设置阶梯奖励的条件，即打卡几个答题活动可获得相应的奖品；<br>
                4.智慧礼仅可设置实物礼品，阶梯奖励的奖品，可支持设置优惠券、奖学金和实物礼品三种奖品类型；<br>
                5.打卡聪明年活动目前包括全脑潜力开发、逻辑思维启蒙、疯狂大脑燃烧、创造力大爆炸的5个主题类的智力题目，暂不支持自行修改；<br>
                6.参与活动的用户每天仅可以打卡1个智力题，完成所有打卡答题活动的用户，可获得1次抽取智慧礼的机会；
            </p>
            <div class="setting-title">
                <div class="line" />活动设置：
            </div>
            <p class="text">
                第一步 打开“营销中心”，找到“打卡聪明年”活动；<br>
                第二步 点开“创建活动”，开始创建活动内容；<br>
                1.选择活动时间，即设置本次活动的时间；<br>
                2.打卡聪明年活动内容：可设置打卡智力题的数量，最少设置7个，最多可设置20个；<br>
                3.选择适合用户，可以选择helper用户，全部用户，选择某些分组可见；<br>
                4.活动细则，该活动细则在活动期间将在用户端显示；<br>
                5.设置总中奖概率，进行中奖人数的限定；<br>
                6.设置智慧礼的礼品，至多可设置3个，仅支持实际礼品的设置；<br>
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
