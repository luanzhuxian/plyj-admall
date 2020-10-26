<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="见学之旅"
    >
        <div class="setting">
            <div class="setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                见学之旅活动，是在一定活动时间内进行的签到活动，满足活动签到条件，即可抽取奖品；<br>
                见学之旅目前涉及的签到数量是固定的，为10次，每次签到都会体现出见学轨迹；
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
    name: 'RoadLearningSetting',
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
</style>
