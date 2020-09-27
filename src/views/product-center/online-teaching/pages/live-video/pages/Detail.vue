<template>
    <div class="live-detail wrap">
        <Panel title="查看直播" width="95%" top="20">
            <div class="main">
                <el-form label-width="152px" label-position="left">
                    <el-form-item label="直播互动类型：">
                        <span class="value-view" v-text="detail.liveType === 'live' ? '实时在线直播互动' : '录播视频直播互动'" />
                    </el-form-item>
                    <el-form-item label="直播标题：">
                        <span class="value-view" v-text="detail.name" />
                    </el-form-item>
                    <el-form-item label="直播房间：">
                        <span class="value-view" v-text="detail.roomName" />
                        <el-popover
                            placement="bottom"
                            trigger="click"
                        >
                            <ul class="room-info">
                                <li class="info-item">
                                    <label>房间名称</label>
                                    <span>{{ detail.roomName }}</span>
                                </li>
                                <li class="info-item">
                                    <label>房间号</label>
                                    <span>{{ detail.roomId }}</span>
                                </li>
                                <li class="info-item">
                                    <label>密码</label>
                                    <span>{{ roomInfo.password }}</span>
                                </li>
                                <li class="info-item">
                                    <label>推流地址</label>
                                    <span>{{ roomInfo.url }}</span>
                                    <el-button v-clipboard:copy="roomInfo.url" v-clipboard:success="copyWord" type="text" size="mini">
                                        复制地址
                                    </el-button>
                                </li>
                            </ul>
                            <span slot="reference" class="room-detail" @click="getRoomInfo">查看房间号和密码</span>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="分享链接：">
                        <div v-if="detail.roomMode === 1">
                            房间固定链接
                            <span class="sid-gray">（每个房间固定链接，一个直播间一个，不因直播场次更换而更换）</span>
                        </div>
                        <div v-else>
                            专属链接
                            <span class="sid-gray">（每一场直播生成一个专属链接）</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="开播时间：">
                        <el-date-picker
                            v-model="detail.liveStartTime"
                            type="datetime"
                            readonly
                            :editable="false"
                        />
                    </el-form-item>
                    <el-form-item label="主讲人：" v-if="detail.lecturerName">
                        <span class="value-view" v-text="detail.lecturerName" />
                    </el-form-item>
                    <el-form-item label="观看对象：">
                        <div>
                            <span class="value-view">{{ userTag[detail.userRange - 1] || '' }}</span>
                            <el-button v-if="detail.userRange === 2" @click="showUserTags" type="primary" class="ml-10">
                                查看
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="直播封面：">
                        <img v-viewer :src="detail.coverImg" width="82px" alt="">
                    </el-form-item>
                    <el-form-item v-if="detail.liveType === 'video'" label="选择视频：">
                        <div style="overflow: hidden">
                            <video style="width: 360px; height: 180px; object-fit: cover;" :src="videoSrc" />
                            <br>
                            <el-button @click="showVideo = true">
                                预览
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="是否付费观看：">
                        <span class="value-view">{{ detail.isPay? (detail.paidAmount + '元') : '免费' }}</span>
                    </el-form-item>
                    <el-form-item v-if="detail.isPay === 0 && detail.roomToken" label="直播间口令：">
                        <el-input disabled style="width:100px" v-model="detail.roomToken" />
                        <el-button class="ml-10" v-clipboard:copy="detail.roomToken" v-clipboard:success="copyWord">
                            复制
                        </el-button>
                    </el-form-item>
                    <el-form-item prop="isNeedSignUp" label="观看直播报名：">
                        <div class="sign-in-info" v-if="detail.isNeedSignUp">
                            <template v-for="(item,index) in signInInfo">
                                <span :key="index" v-if="detail[index]">
                                    {{ item }}
                                </span>
                            </template>
                            <span v-if="detail.isHaveCustomer">
                                {{ detail.isHaveCustomer }}
                            </span>
                        </div>
                        <span v-else>不报名</span>
                    </el-form-item>
                    <el-form-item label="限制观看人数：" v-if="false">
                        {{ detail.limitView ? (detail.limitViewCount + '人') : '不限制观看人数' }}
                    </el-form-item>
                    <el-form-item v-if="detail.noticeBeforeDay" label="直播预告：">
                        <span class="value-view" v-text="`提前${detail.noticeBeforeDay}天预告`" />
                        <div>
                            <span>预告图片</span>
                            <br>
                            <img v-viewer :src="detail.noticeImg" width="82px" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item label="是否支持回放：">
                        {{ detail.supportReview ? '支持回放' : '不支持回放' }}
                    </el-form-item>
                    <el-form-item label="商品：">
                        <div>
                            <div class="value-view" v-if="!detail.productList.length && !detail.courseList.length">
                                暂无商品和课程
                            </div>
                            <!-- 商品 -->
                            <el-table v-if="detail.productList.length" key="pro-table" :data="detail.productList">
                                <el-table-column prop="img" label="商品图片">
                                    <template #default="{ row }">
                                        <img v-imgError style="width: 82px; height: 82px" :src="row.productMainImage" alt="">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="productName" label="商品名称" />
                                <el-table-column prop="price" label="价格 (元)">
                                    <template #default="{ row }">
                                        {{ row.price || '免费' }}
                                    </template>
                                </el-table-column>
                            </el-table>

                            <!-- 系列课 -->
                            <el-table v-if="detail.courseList.length" key="course-table" :data="detail.courseList" style="margin-top: 20px">
                                <el-table-column prop="img" label="课程图片">
                                    <template #default="{ row }">
                                        <img v-imgError style="width: 82px; height: 82px" :src="row.productMainImage" alt="">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="productName" label="课程名称" />
                                <el-table-column prop="courseType" label="类型">
                                    <template #default="{ row }">
                                        {{ row.productType === 2 ? '单课程' : '系列课' }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="价格 (元)">
                                    <template #default="{ row }">
                                        {{ row.price || '免费' }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!-- <span v-else class="value-view">暂无商品</span> -->
                    </el-form-item>
                    <el-form-item label="优惠券：">
                        <div v-if="detail.couponList.length" class="coupons">
                            <div class="couponItem" v-for="coupon in detail.couponList" :key="coupon.id">
                                <span class="couponTitle" v-text="coupon.couponName" />
                                <span>{{ coupon.useStartTime | dateFormat('YYYY/MM/DD') }}-{{ coupon.useEndTime | dateFormat('YYYY/MM/DD') }}</span>
                            </div>
                        </div>
                        <span v-else class="value-view">暂无优惠券</span>
                    </el-form-item>
                </el-form>
                <hr class="hr">
                <el-button :disabled="disbledEdit" class="mt-20 mb-20" @click="edit">
                    编 辑
                </el-button>
            </div>
        </Panel>
        <!--预览视频-->
        <VideoPreview :show.sync="showVideo" :src="videoSrc" />
        <!--部分用户显示-->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible="showUsers"
            @close="showUsers = false"
            title="观看对象"
            width="810px"
            class="users-info"
        >
            <div class="user-main">
                <div class="student">
                    <div class="content" v-if="studentList.length">
                        <div class="content-info">
                            <div
                                class="item"
                                v-for="item of studentList"
                                :key="item.id"
                            >
                                <span :title="item.name">
                                    {{ item.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="no-content">
                        暂未选定学员
                    </div>
                </div>
            </div>
            <div class="bottom">
                <el-button type="primary" @click="showUsers = false">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Panel from './../../../../../../components/common/Panel.vue'
import VideoPreview from '././../../../../../../components/common/Preview-Video'
import { getActiveCompleteInfo, getVideoMesById, getRoomInfoById } from './../../../../../../apis/product-center/online-teaching/live'
import { getUserTagList } from './../../../../../../apis/marketing-manage/together'
export default {
    name: 'Detail',
    components: {
        Panel,
        VideoPreview
    },
    data () {
        return {
            showVideo: false,
            disbledEdit: false,
            showUsers: false,
            videoSrc: '',
            signInInfo: {
                isHaveName: '姓名',
                isHaveTelphone: '电话',
                isHaveGrade: '年级',
                isHaveRegion: '所在区域'
            },
            detail: {
                productList: [],
                courseList: [],
                couponList: [],
                isNeedSignUp: 0,
                isHaveName: 0,
                isHaveTelphone: 0,
                isHaveGrade: 0,
                isHaveRegion: 0,
                isHaveCustomer: ''
            },
            roomInfo: {},
            userTagList: [], // 用户标签
            studentList: [], // 观看对象学员列表
            userTag: ['普通会员', '部分用户可观看']
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async activated () {
        await this.handleLiveVideoDetailData()
        await this.getUserTagList()
    },
    methods: {
    // 复制口令
        copyWord () {
            this.$success('复制成功')
        },
        previewClose () {
            // this.$refs.video_.pause()
            this.showVideo = false
        },
        async handleLiveVideoDetailData () {
            try {
                const { result } = await getActiveCompleteInfo(this.id)
                this.detail = result
                // 手动关闭直播后，直播将不可编辑
                this.disbledEdit = !result.statue
                if (result.liveType === 'video') {
                    // 获取视频信息
                    const { result: { url } } = await getVideoMesById(result.videoLibId)
                    this.videoSrc = url
                }
                const studentList = (this.detail.viewObjectModel && this.detail.viewObjectModel.users) || []
                this.studentList = studentList.map(item => ({
                    id: item.userId,
                    name: item.name || item.nickName
                }))
            } catch (e) {
                throw e
            }
        },
        async getUserTagList () {
            const { result } = await getUserTagList()
            this.userTagList = result
        },
        async getRoomInfo () {
            const { result } = await getRoomInfoById(this.detail.roomId)
            this.roomInfo = result
        },
        // 展示部分用户
        showUserTags () {
            this.showUsers = true
        },
        edit () {
            this.$router.push({ name: 'EditLive', params: { id: this.id } })
        }
    }
}
</script>

<style scoped lang="scss">

.sign-in-info {
    > span {
        display: inline-block;
        padding: 0 26px;
        border: 1px solid #ccc;
        margin-right: 10px;
        font-size: 12px;
        line-height: 30px;
    }
}
img {
    vertical-align: middle;
}
.value-view {
    font-size: 14px;
    font-weight: 400;
    color: #666;
    line-height: 19px;
}
.room-info {
    > .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        font-size: 12px;
        > label {
            display: inline-block;
            width: 68px;
        }
        &:nth-last-of-type(1) {
            margin: -7px 0 0 0;
            > span {
                display: inline-block;
                width: 120px;
                margin-right: 35px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
.main {
    padding: 32px 24px;
    margin-bottom: 32px;
    .date {
        position: relative;
        width: 210px;
        height: 30px;
        padding-left: 10px;
        background: rgba(255,255,255,1);
        border: 1px solid rgba(204,204,204,1);
        i {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .coupons {
        .couponItem {
            width: 368px;
            height: 72px;
            line-height: 72px;
            border: 1px solid #ccc;
            margin-bottom: 20px;
            font-size: 12px;
            padding-left: 29px;
            .couponTitle {
                margin-right: 40px;
            }
        }
    }
}

.room-detail {
    margin-left: 30px;
    font-size: 12px;
    cursor: pointer;
    color: #598bf8;
}

.users-info {
    .user-main {
        padding: 0;
    }
    .student {
        background: #fff;
        box-shadow: 0 2px 12px rgba(0,0,0,.16);
    }
    .content {
        padding: 16px;
        max-height: 150px;
        overflow-y: auto;
        > .content-info {
            display: grid;
            grid-template-columns: repeat(auto-fill, 80px);
            grid-template-rows: repeat(auto-fill, 30px);
            grid-gap: 10px;
        }
        .item {
            width: 100%;
            border: 1px solid #ccc;
            padding: 0 5px;
            line-height: 30px;
            text-align: center;
            @include elps();
        }
    }
    .no-content {
        padding: 20px 0;
        text-align: center;
    }
    .bottom {
        margin-top: 20px;
        text-align: center;
    }
}
.el-table {
    border: 1px solid #ebeef5;
}

</style>
