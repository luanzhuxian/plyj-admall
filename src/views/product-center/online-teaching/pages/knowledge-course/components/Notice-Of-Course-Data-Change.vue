<template>
    <el-dialog
        :visible.sync="show"
        :close-on-click-modal="false"
        width="800px"
        @close="close"
    >
        <div style="font-size: 14px; color: #333333;">
            <p>好消息好消息！雅集系统升级后，为方便C端用户的观看体验，优化了免费课程的免费截止时间功能，大家快来体验吧！</p>
            <p style="margin-top: 20px;">
                原版本：免费课程需要设置学习时间，不方便C端用户的免费观看体验；
            </p>
            <img src="https://mallcdn.youpenglai.com/static/admall/2.9.0/old-course-data.png" alt="" style="width: 100%; margin: 15px 0;">
            <p>
                现版本：免费课程可设置免费截止时间了，无需设置学习时间；
                <br>
                C端用户订购买免费课程后，在免费截止时间之内都可以随时进行观看学习了！
                <br>
                免费截止时间设置如下图所示哦:
            </p>
            <img src="https://mallcdn.youpenglai.com/static/admall/2.9.0/new-course-data.png" alt="" style="width: 100%; margin: 15px 0;">
            <p>
                所有免费课程数据也进行了统一优化：
                <br>
                1.自行上传的免费课程，免费截止时间更新为2020年12月31日；
                <br>
                2.购买资源库视频的免费课程，免费截止时间更新为该视频资源的使用截止时间；
            </p>
            <p style="margin-top: 20px;">
                如您需要对免费课程的免费截止时间进行优化调整，可自行编辑免费截止时间哦！
            </p>
        </div>
        <p style="text-align: center; margin-top: 20px;">
            <el-button
                type="primary"
                @click="close"
            >
                确 定
            </el-button>
        </p>
    </el-dialog>
</template>

<script>
export default {
    name: 'NoticeOfCourseDataChange',
    props: {
        show: Boolean
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$emit('close')
        }
    }
}
</script>
