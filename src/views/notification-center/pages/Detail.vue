<template>
    <div class="detail">
        <top-back />
        <div class="detail-box">
            <div class="title1">
                {{ detail.title }}
            </div>
            <div class="time">
                {{ detail.releaseTime }}
            </div>
            <div class="content" v-html="detail.content" />
        </div>
    </div>
</template>

<script>
import { findAnnouncement } from '../../../apis/base/message'
import moment from 'moment'
export default {
    name: 'NotificationDetail',
    data () {
        return {
            id: '',
            detail: ''
        }
    },
    async created () {
        this.id = this.$route.params.id
        await this.init()
    },
    methods: {
        async init () {
            try {
                const res = await findAnnouncement({ version: this.id })
                this.detail = res.result
                this.detail.releaseTime = moment(Number(this.detail.releaseTime)).format('YYYY-MM-DD HH:mm:ss')
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .detail{
    background-color: #ffffff;
    min-height: 100%;
    .detail-box{
      box-sizing: content-box;
      margin: 20px 60px;
      padding: 32px 60px;;
      border: 1px solid #cccccc;
      .title1{
        font-size:24px;
        color: #333333;
        font-weight: 400;
        text-align: center;
      }
      .time{
        font-size:18px;
        color: #333333;
        font-weight: 400;
        padding-top: 14px;
        padding-bottom: 32px;
        margin-bottom: 24px;
        text-align: center;
        border-bottom: 1px solid #cccccc;
      }
    }
  }
</style>
