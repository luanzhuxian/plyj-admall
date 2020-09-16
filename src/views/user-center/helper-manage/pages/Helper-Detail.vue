<template>
    <div class="helper-detail">
        <div class="detail-top">
            <span class="status">待审核</span>
            <span class="apply-date">2020.06.30 12:20:36申请</span>
            <span>所属账号：12359687524-郭老师（企业管理员）</span>
        </div>
        <div class="title">用户基本信息</div>
        <div class="user-info">
            <div class="user-avatar">
                <div class="avatar">
                    <img src="">
                </div>
                <div>
                    <div>小米粉</div>
                    <div>普通会员</div>
                </div>
            </div>
            <ul class="info-list">
                <li>
                    <div class="label">手机：</div>18712341239
                    <div class="label">姓名：</div>李鸣宇</li>
                <li>
                    <div class="label">地址：</div>陕西西安
                    <div class="label">标签：</div>潜在用户 | 一年级 | 语文<a>编辑</a>
                </li>
                <li>
                    <div class="label">来源：</div>微信H5商城 / 小程序
                </li>
                <li>
                    <div class="label">记录：</div>2020.02.03 14:23:24 注册
                </li>
            </ul>
        </div>
        <div class="title">申请资料</div>
        <el-table :data="detail.data">
            <el-table-column label="真实姓名" />
            <el-table-column label="手机号" />
            <el-table-column label="身份证号码" />
        </el-table>
        <div class="title">操作日志</div>
        <ul class="logs">
            <li>2019.12.35 12:25:36 操作人：15968754963-郭老师（企业管理员）申请成为Helper</li>
        </ul>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { getHelperDetail } from '../../../../apis/member'

  @Component({
  })

export default class MemberManageDetail extends Vue {
    detail = {
        data: []
    }

    id = ''
    async created () {
        this.id = this.$route.params.id
        await this.getHelperDetail()
    }

    // methods
    async getHelperDetail () {
        try {
            const { data: res } = await getHelperDetail(this.id)
            if (res.result && res.result.idCard) {
                res.result.idCard = res.result.idCard.replace(/^(\d{4})\d{9}(\d+)/, '$1*********$2')
            }
            this.detail = res.result || {}
        } catch (e) {
            throw e
        }
    }
}
</script>

<style scoped lang="scss">
    .helper-detail {
        .detail-top{
            border-bottom: 1px solid #F5F5F5;
            padding-bottom: 25px;
            .status{
                font-size: 20px;
                font-weight: bold;
                margin-right: 25px;
            }
            .apply-date{
                margin-right: 80px;
            }
        }
        .title{
            font-size: 16px;
            margin: 32px 16px;
        }
        .user-info{
            margin-left: 24px;
            display: flex;
            .user-avatar{
                display: flex;
                margin-right: 60px;
                .avatar{
                    width: 88px;
                    height: 88px;
                    border-radius: 50%;
                    background: #DFE5FC;
                    margin-right: 16px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
            }
            .info-list{
                line-height: 2;
                li{
                    display: flex;
                }
            }
        }
        .logs{
            li{
                font-size: 14px;
                line-height: 2;
            }
        }
    }
</style>
