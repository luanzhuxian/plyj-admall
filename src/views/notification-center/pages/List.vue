<template>
    <div class="message-container">
        <top-back v-if="auditStatus==='AUTHENTICATE'" />
        <div
            class="px-1 pb-1"
            v-if="notificationList.length>0"
        >
            <div class="header">
                <span>消息内容</span>
                <span>发布时间</span>
            </div>
            <el-card
                class="box-card mt-1"
                v-for="(item, index) in notificationList"
                :key="index"
            >
                <div slot="header" class="title">
                    <div>
                        <span class="type-title" v-if="item.version">【公告】</span>
                        <span class="type-title" v-else>【通知】</span>
                        <span class="new" v-if="item.isNew">new</span>
                        <span class="announcement-title" v-if="item.version" @click="$router.push({name:'NotificationDetail',params:{id:item.version}})">{{ item.title }}</span>
                        <span class="notice-title" v-else>{{ item.title }}</span>
                    </div>
                    <div>
                        {{ item.recDate || item.createTime }}
                    </div>
                </div>
                <div class="font-14" v-if="!item.version">
                    <p>{{ item.content }}</p>
                </div>
            </el-card>
            <Pagination
                @change="getList"
                @sizeChange="sizeChange"
                v-model="form.current"
                :total="total"
                :sizes="true"
            />
        </div>

        <div
            v-else
            class="mt-20"
        >
            <h2 style="text-align: center;">
                还没有消息
            </h2>
        </div>
    </div>
</template>

<script>
import { getNotificationList, markReaded } from '../../../apis/base/message'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    name: 'NotificationList',
    data () {
        return {
            notificationList: [],
            total: 0,
            form: {
                current: 1,
                size: 10 // 最多显示5条
            }
        }
    },
    computed: {
        ...mapGetters(['auditStatus'])
    },
    async created () {
        await this.getList()
    },
    methods: {
        sizeChange (val) {
            this.form.current = 1
            this.form.size = val
            this.getList()
        },
        async getList () {
            try {
                const res = await getNotificationList(this.form)
                this.notificationList = res.result.records
                this.total = res.result.total
                // 5秒后标记当前页为已读
                const ids = []
                for (const item of this.notificationList) {
                    item.isNew = false
                    if ((moment(item.recDate).valueOf() + 1000 * 60 * 60 * 24 * 10) > moment().valueOf()) {
                        item.isNew = true
                    }
                    ids.push(item.sequenceNbr)
                }
                if (!ids.length) return
                this.markReaded(ids)
            } catch (e) {
                throw e
            }
        },
        async markReaded (ids) {
            try {
                await markReaded(ids)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .message-container {
    .el-card__header {
      border-bottom: 0;
      padding-bottom: 0;
    }
  }
  .header{
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 20px 25% 10px 120px;
  }
  .title{
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    padding-right: 20%;
  }
  .type-title{
    margin-right: 20px;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  }
  .new{
    font-size:12px;
    font-weight:400;
    color:#EC742E;
    margin-right: 16px;
  }
  .notice-title{
    font-size:12px;
    font-weight:400;
    color:#333333;
  }
  .announcement-title{
    display: inline-flex;
    font-size:12px;
    font-weight:400;
    color:#598BF8;
    text-decoration: underline;
    cursor:pointer
  }
</style>
