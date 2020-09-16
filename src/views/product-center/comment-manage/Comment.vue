<template>
    <div class="comment wrap">
        <search-box label-width="90px">
            <el-form-item label="商品名称：">
                <el-input
                    @change="handleSearch"
                    clearable
                    v-model="filter.productName"
                    placeholder="请输入商品名称"
                />
            </el-form-item>
            <el-form-item label="评价时间：">
                <date-range
                    @change="dateChange"
                    :clearable="true"
                    :init="[filter.startTime, filter.endTime]"
                />
            </el-form-item>
            <el-form-item class="mr-10 mb-0">
                <el-button
                    style="width:98px;"
                    type="primary"
                    @click.enter.native="handleSearch"
                >
                    搜索
                </el-button>
            </el-form-item>
        </search-box>

        <el-table :data="commentData" size="small">
            <el-table-column
                prop="id"
                label="编号"
                width="200"
                fixed="left"
            />
            <el-table-column
                prop="productName"
                label="商品名称"
                width="250"
            />
            <el-table-column
                prop="productName"
                label="规格名称"
                width="200"
            >
                <template slot-scope="{ row }">
                    <span v-text="row.skuCode1Name" />
                    <template v-if="row.skuCode2Name">
                        ,<span v-text="row.skuCode2Name" />
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="评论内容"
                min-width="200"
                class-name="nowrap"
            />
            <el-table-column
                prop="nickName"
                label="买家昵称"
                class-name="nowrap"
                width="150"
            />
            <el-table-column
                prop="mobile"
                label="手机号"
                width="120"
            />
            <el-table-column
                prop="createTime"
                label="评论时间"
                width="150"
            />
            <el-table-column
                label="状态"
                width="120"
            >
                <template slot-scope="{ row }">
                    <el-switch
                        class="switch"
                        v-model="row.status"
                        @change="switchChange(row)"
                        :active-value="1"
                        :inactive-value="0"
                    />
                    <span v-if="row.status" style="color: #4F63FF">显示</span>
                    <span v-else style="color: #ccc">隐藏</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="100"
                fixed="right"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                @click="getCommentDetail(row.id)"
                            >
                                查看
                            </a>
                            <a
                                @click="handleDelete(row.id)"
                            >
                                删除
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="commentTotal"
            v-model="filter.current"
            @change="getCommentList"
        />

        <!--评价详情-->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="detailVisible"
            title="评价详情"
        >
            <div
                class="border-bottom"
                style="padding: 12px 0"
            >
                <el-row>
                    <el-col :span="2">
                        <img
                            v-imgError
                            :src="commentDetail.productImg"
                            width="60"
                            height="60"
                        >
                    </el-col>
                    <el-col :span="22">
                        <p style="line-height: 20px;">
                            货号: {{ commentDetail.id }}
                        </p>
                        <p style="line-height: 20px;">
                            商品名称: {{ commentDetail.productName }}
                        </p>
                        <p style="line-height: 20px;">
                            规格名称:
                            <span> {{ commentDetail.skuCode1Name }}</span>
                            <span v-if="commentDetail.skuCode2Name">,{{ commentDetail.skuCode2Name }}</span>
                        </p>
                    </el-col>
                </el-row>
            </div>
            <ul class="comment-list">
                <li
                    v-if="!commentDetail.child"
                    class="replay-form"
                >
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input v-model="content" />
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="handleReply(commentDetail.id)">
                                回复
                            </el-button>
                        </el-form-item>
                    </el-form>
                </li>
                <li v-if="commentDetail.child">
                    <div class="time">
                        {{ commentDetail.child.createTime | dateFrom }}
                    </div>
                    <div>回复：{{ commentDetail.child.content }}</div>
                </li>
                <li>
                    <div class="time">
                        {{ commentDetail.createTime | dateFrom }}
                    </div>
                    <div>{{ commentDetail.nickName || '匿名' }}：{{ commentDetail.content }}</div>
                </li>
                <li v-if="commentDetail.commentImgUrls && commentDetail.commentImgUrls.length" class="img-li">
                    <div class="empty" />
                    <div class="img-box">
                        <img v-for="(item,index) of commentDetail.commentImgUrls" :key="index" :src="item"
                             v-img-error v-viewer alt=""
                        >
                    </div>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>
<script>
import {
    getCommentData,
    replyComment,
    getCommentById,
    updateComment,
    deleteComment
} from '../../../apis/goods'
export default {
    data () {
        return {
            filter: {
                productName: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            detailVisible: false,
            commentData: [],
            commentTotal: 0,
            content: '',
            commentDetail: {}
        }
    },
    created () {
        this.getCommentList()
    },
    methods: {
        async getCommentList () {
            const { result } = await getCommentData(this.filter)
            this.commentData = result.records
            this.commentTotal = result.total
        },
        async handleSearch () {
            this.filter.current = 1
            try {
                await this.getCommentList()
            } catch (e) {
                throw e
            }
        },
        indexMethod () {
            return Number(Comment + 1) + this.filter.size * (this.filter.current - 1)
        },
        dateChange (val) {
            this.filter.startTime = val.start || ''
            this.filter.endTime = val.end || ''
            this.handleSearch()
        },
        async getCommentDetail (id) {
            this.detailVisible = true
            const data = await getCommentById(id)
            this.commentDetail = data.result
        },
        async handleReply (parentId) {
            try {
                await replyComment(parentId, { content: this.content })
                this.getCommentList()
                const { result } = await getCommentById(parentId)
                this.commentDetail = result
                this.content = ''
            } catch (e) {
                throw e
            }
        },
        async switchChange (row) {
            try {
                const data = {
                    id: row.id,
                    status: row.status
                }
                await updateComment(data)
                await this.getCommentList()
                this.$success(row.status ? '评论已显示！' : '评论已隐藏！')
            } catch (e) {
                if (row.status) {
                    row.status = 0
                } else {
                    row.status = 1
                }
                throw e
            }
        },
        async handleDelete (id) {
            try {
                await this.$confirm('您确定删除此条评价吗？')
                await deleteComment(id)
                this.getCommentList()
                this.$success('删除成功！')
            } catch (e) {
                throw e
            }
        }
    }
}

</script>

<style lang="scss" scoped>
  .comment{
    min-height: calc(100vh - 110px);
    background-color: #ffffff;
    .switch{
      margin-right: 10px;
    }
    .comment-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 30px 0;
      li {
        position: relative;
        display: flex;
        padding-bottom: 10px;
        &:last-of-type{
          padding-bottom: 0;
        }
        &:after {
          position: absolute;
          left: 170px;
          content: '';
          width: 1px;
          height: 100%;
          background-color: #fe7b21;
        }
        > div {
          position: relative;
          height: 100%;
          padding: 0 20px;
          line-height: 30px;
          &.time {
            width: 170px;
            text-align: center;
            &:before {
              position: absolute;
              content: '';
              right: -4px;
              top: 50%;
              transform: translate3d(0, -50%, 0);
              width: 7px;
              height: 7px;
              border-radius: 50%;
              background-color: #fe7b21;
            }
          }
          &:nth-of-type(2) {
            flex: 1;
            /*border-left: 1px solid #fe7b21;*/
          }
        }
        &.replay-form {
          display: flex;
          padding-left: 190px;
        }
        &.img-li{
          .empty{
            width: 170px;
          }
          .img-box{
            img{
              width: 50px;
              margin: 0 15px;
              &:first-of-type{
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
