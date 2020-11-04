<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="我心中的年味"
    >
        <div class="setting">
            <div class="setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                1.我心中的年味活动，是在一定活动时间内进行的已签到的形式获得年味，集齐所有年味，即可抽取年味大礼，年味大礼至多可设置3个；<br>
                2.我心中的年味获取年味数量可有机构自行设置，累计获得所有年味即可抽奖，每次获得年味均会弹出相应的年味海报；<br>
                3.我心中的年味可设置阶梯奖品，阶梯奖品至多可设置6个，可自行设置阶梯奖励的条件，即获得几个年味可获得奖品；<br>
                4.年味大礼仅可设置实物礼品，阶梯奖励的奖品，可支持设置优惠券、奖学金和实物礼品三种奖品类型；<br>
                5.年味目前包括送灶上天 、扫舍去尘 、杀猪割年肉、 宰鸡赶集、题写桃符、 上供请祖、贴窗花、吃饺子、除夕守岁、拜年压岁、 逛庙会 、迎灶神；<br>
                五路接财神 、马到成功 、人寿丰年、 放生祈福、祭石感恩、舞狮子、演社火、元宵灯会20个年味内容，暂不支持自行修改；<br>
                6.参与活动的用户每天仅可获得1个年味，每个集齐年味的用户，仅可获得1个抽奖机会；
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
    name: 'YearFlavorSetting',
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
