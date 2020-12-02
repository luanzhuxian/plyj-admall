<template>
    <div class="org-index">
        <div class="index-item" v-for="(item,index) of orgIndex" :key="index">
            <p class="item-title">
                <span class="title-sub-1" v-text="getTitleText(item.type)" />
                <span class="title-sub-2" v-if="getTitleLimit(item.type)">{{ item.mediaDetailModelList.length || 0 }}/{{ getTitleLimit(item.type) }}</span>
                <span class="title-sub-3" v-text="getTitleSize(item.type)" />
            </p>
            <el-card class="item-card">
                <el-form v-if="item.type">
                    <el-form-item label="标题：">
                        <span class="input-wrap">
                            <el-input v-model="item.inputTitle" @focus="item.isInput = true" maxlength="6" />
                            <span class="input-tips">{{ item.inputTitle.length || 0 }}/6</span>
                        </span>
                        <el-button round type="primary" @click="validate(item)" v-if="item.isInput">
                            确定
                        </el-button>
                        <el-button round @click="cancelInput(item)" v-if="item.isInput">
                            取消
                        </el-button>
                    </el-form-item>
                </el-form>
                <UploadImage
                    v-model="item.mediaList"
                    :width="getImgEditWidth(item.type)"
                    :box-width="256"
                    :height="getImgEditHeight(item.type)"
                    :box-height="getImgShowHeight(item.type)"
                    :border-radius="16"
                    :hide-edit-btn="item.type === 5"
                    :count="getTitleLimit(item.type)"
                    @change="updateMedia($event,index)"
                    multiple
                    delete-truth
                    :disabled-draggable="item.type === 5"
                    @drag-end="updateMedia($event,index)"
                    v-if="item.type !== 3 && item.type !== 4"
                >
                    <template #image-item-bottom="{ $index }" v-if="item.type === 5">
                        <div class="input-wrap">
                            <el-input placeholder="标题（非必填）" v-model="item.mediaDetailModelList[$index].mediaTitle" @blur="updateOrgIndex(item)" maxlength="12" style="width: 256px;margin-top: 10px;" />
                            <span class="input-tips" style="top:16px;">{{ item.mediaDetailModelList[$index].mediaTitle.length || 0 }}/12</span>
                        </div>
                    </template>
                </UploadImage>
                <div class="editor-wrap">
                    <UploadVideo
                        v-model="item.mediaList"
                        :count="1"
                        :show-delete="false"
                        :box-height="256"
                        :box-width="256"
                        :size="100"
                        :border-radius="16"
                        disabled-draggable
                        @change="updateMedia($event,index)"
                        v-if="item.type === 3"
                    />
                    <el-button
                        plain
                        round
                        type="primary"
                        @click="deleteVideo(item)"
                        v-if="item.type === 3 && item.mediaList[0]"
                        style="width: 80px;margin-left: 10px;"
                    >
                        删除
                    </el-button>
                    <span class="ml-10 fz-12 gray-3" v-if="item.type === 3">视频大小不能超过100M，且仅支持mp4格式</span>
                </div>
                <div class="editor-wrap" v-if="item.type === 4">
                    <PlEditor :show-video="false" v-model="item.inputContent" @input="updateInputContent(item)" />
                    <el-button plain round type="primary" @click="updateOrgIndex(item)" style="width: 80px;margin-left: 10px;" v-if="item.isInputContent">
                        保存
                    </el-button>
                    <el-button round @click="cancelInputContent(item)" style="width: 80px;" v-if="item.isInputContent">
                        取消
                    </el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { brandingQuery, brandingUpdate } from '../../../apis/setting'
import UploadImage from '../../../components/common/file/Image-Manager.vue'
import UploadVideo from '../../../components/common/file/Video-Manager.vue'
import PlEditor from '../../../components/common/Pl-Editor.vue'

@Component({
    components: {
        UploadImage,
        UploadVideo,
        PlEditor
    }
})
export default class OrgIndex extends Vue {
    orgIndex: { mediaDetailModelList: DynamicObject[] }[] = []

    created () {
        this.getOrgIndex()
    }

    // methods
    async getOrgIndex () {
        const { result } = await brandingQuery()
        if (result && result.mallBrandingRequestModels && result.mallBrandingRequestModels.length) {
            for (const item of result.mallBrandingRequestModels) {
                // 标题输入框状态
                item.isInput = false
                item.isInputContent = false
                // 标题备份
                item.inputTitle = item.titleName
                // 内容备份
                item.inputContent = item.detailContent
                // 图片与视频归纳为一个数组
                const media = []
                for (const value of item.mediaDetailModelList) {
                    media.push(value.mediaUrl)
                }
                item.mediaList = media
            }
            this.orgIndex = result.mallBrandingRequestModels
        }
    }

    getTitleText (type: number) {
        switch (type) {
            case 0: {
                return '封面图设置'
            }
            case 1: {
                return '模块一设置'
            }
            case 2: {
                return '模块二设置'
            }
            case 3: {
                return '模块三设置'
            }
            case 4: {
                return '模块四设置'
            }
            case 5: {
                return '模块五设置'
            }
        }
    }

    getTitleLimit (type: number) {
        switch (type) {
            case 0: {
                return 1
            }
            case 1: {
                return 12
            }
            case 2: {
                return 12
            }
            case 3: {
                return 0
            }
            case 4: {
                return 0
            }
            case 5: {
                return 6
            }
        }
    }

    getTitleSize (type: number) {
        switch (type) {
            case 0: {
                return '（图片建议尺寸：750 x 578像素）'
            }
            case 1: {
                return '（图片建议尺寸：320 x 230像素）'
            }
            case 2: {
                return '（图片建议尺寸：340 x 340像素）'
            }
            case 3: {
                return ''
            }
            case 4: {
                return ''
            }
            case 5: {
                return ''
            }
        }
    }

    getImgShowHeight (type: number) {
        switch (type) {
            case 0: {
                return 198
            }
            case 1: {
                return 184
            }
            case 2: {
                return 256
            }
            case 3: {
                return 0
            }
            case 4: {
                return 0
            }
            case 5: {
                return 256
            }
        }
    }

    getImgEditWidth (type: number) {
        switch (type) {
            case 0: {
                return 750
            }
            case 1: {
                return 320
            }
            case 2: {
                return 340
            }
            case 3: {
                return 0
            }
            case 4: {
                return 0
            }
            case 5: {
                return 0
            }
        }
    }

    getImgEditHeight (type: number) {
        switch (type) {
            case 0: {
                return 578
            }
            case 1: {
                return 230
            }
            case 2: {
                return 340
            }
            case 3: {
                return 0
            }
            case 4: {
                return 0
            }
            case 5: {
                return 0
            }
        }
    }

    validate (item: DynamicObject) {
        if (!item || !item.inputTitle.trim()) {
            return this.$warning('标题不能为空')
        }
        this.updateOrgIndex(item)
    }

    cancelInput (item: DynamicObject) {
        item.isInput = false
        item.inputTitle = item.titleName
    }

    updateInputContent (item: DynamicObject) {
        if (item.inputContent === item.detailContent) {
            item.isInputContent = false
        } else {
            item.isInputContent = true
        }
    }

    cancelInputContent (item: DynamicObject) {
        item.isInputContent = false
        item.inputContent = item.detailContent
    }

    updateMedia (array: string[], index: number) {
        const imgList = []
        if (array && array.length) {
            if (this.orgIndex[index].mediaDetailModelList.length) {
                for (const value of array) {
                    for (const [key, item] of new Map(this.orgIndex[index].mediaDetailModelList.map((item, i) => [i, item]))) {
                        if (value === item.mediaUrl) {
                            imgList.push({
                                id: item.id,
                                mediaTitle: item.mediaTitle,
                                mediaUrl: value
                            })
                            break
                        } else {
                            if (key === this.orgIndex[index].mediaDetailModelList.length - 1) {
                                imgList.push({
                                    mediaTitle: '',
                                    mediaUrl: value
                                })
                            }
                        }
                    }
                }
            } else {
                for (const value of array) {
                    imgList.push({
                        mediaTitle: '',
                        mediaUrl: value
                    })
                }
            }
        } else {
            if (index === 3) {
                return false
            }
        }
        this.orgIndex[index].mediaDetailModelList = imgList
        this.updateOrgIndex(this.orgIndex[index])
    }

    deleteVideo (item: DynamicObject) {
        item.mediaDetailModelList = []
        this.updateOrgIndex(item)
    }

    async updateOrgIndex (item: DynamicObject) {
        const data = JSON.parse(JSON.stringify(item))
        data.titleName = data.inputTitle
        data.detailContent = data.inputContent
        delete data.inputTitle
        delete data.inputContent
        delete data.mediaList
        delete data.isInput
        delete data.isInputContent
        await brandingUpdate(data)
        await this.getOrgIndex()
        this.$success('操作成功')
    }
}
</script>

<style scoped lang="scss">
    .org-index {
        min-width: 900px;
        .index-item{
            &:first-of-type{
                margin-top: 10px;
            }
            margin-bottom: 40px;
            .item-title{
                color: #999999;
                .title-sub-1{
                    color: #666666;
                    font-size: 16px;
                    font-weight: 600;
                }
                .title-sub-2{
                    margin-left: 16px;
                    font-size: 16px;
                }
                .title-sub-3{
                    font-size: 12px;
                }
            }
            ::v-deep .el-card{
                margin-top: 15px;
                .el-card__body{
                    padding: 24px;
                    .el-form{
                        .el-form-item__label{
                            font-size: 12px;
                            font-weight: 600;
                            padding: 0;
                        }
                        .el-button--mini{
                            padding: 3px 4px;
                            font-size: 12px;
                        }
                    }
                    .input-wrap{
                        position: relative;
                        .el-input{
                            margin-right: 10px;
                            width: 140px;
                            .el-input__inner{
                                padding-right: 50px;
                            }
                        }
                        .input-tips{
                            color: #999999;
                            font-size: 12px;
                            position: absolute;
                            right: 20px;
                        }
                    }
                    .pl-quill-editor{
                        .ql-editor{
                            height: 500px !important;
                            max-height: 500px !important;
                        }
                        .pl-quill-toolbar.toolbarFloat{
                            position: relative;
                        }
                    }
                    .editor-wrap{
                        display: flex;
                        align-items: flex-end;
                    }
                }
            }
        }
    }
</style>
