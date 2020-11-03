<template>
    <div class="together">
        <div class="together-data-top">
            <div class="together-title">
                <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png">
                众志成团
            </div>
            <div class="activity-status">
                <span v-if="activityDetail.status === 0">未开始</span>
                <span v-if="activityDetail.status === 1">进行中</span>
                <span v-if="activityDetail.status === 2">已成功</span>
                <span v-if="activityDetail.status === 3">已结束</span>
            </div>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'TogetherBuyDetail'},
                {label:'活动数据',name:'TogetherBuyData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div class="detail">
            <el-button
                type="primary"
                plain
                size="mini"
                @click="$router.push({name:'EditTogether', params:{id: activityDetail.id}})"
                v-if="activityDetail.status === 0 || activityDetail.status === 1"
            >
                编辑
            </el-button>
            <ul class="detail-wrap">
                <li>
                    <label>活动细则：</label>
                    <div class="rule" v-html="activityDetail.activityBrief " />
                </li>
                <li>
                    <label>适用用户：</label>
                    <div class="value">
                        <span>{{ userTag[activityDetail.receiveLimit] || '' }}</span>
                        <el-button v-if="activityDetail.receiveLimit === 3" @click="showUserTags" type="primary" class="ml-10">
                            查看
                        </el-button>
                    </div>
                </li>
                <li>
                    <label>可拼团数：</label>
                    <div class="value">
                        1
                    </div>
                </li>
                <li>
                    <label>团购商品：</label>
                    <div class="product">
                        <img :src="activityDetail.productMainImage">
                        <div class="title">
                            {{ activityDetail.productName }}
                        </div>
                    </div>
                </li>
                <li>
                    <label>团购库存：</label>
                    <div class="value">
                        {{ activityDetail.stock }}件
                    </div>
                </li>
                <li>
                    <label>商品限购：</label>
                    <div class="value">
                        <span v-if="activityDetail.activityLimit === 0">不限制</span>
                        <span v-else>每人限购{{ activityDetail.activityLimitNumber }}件</span>
                    </div>
                </li>
                <li>
                    <label>团购价位：</label>
                    <div class="value">
                        {{ activityDetail.price }}元
                    </div>
                </li>
                <li>
                    <label>活动预热：</label>
                    <div class="value">
                        提前 {{ activityDetail.countdown || 0 }} 天预热
                    </div>
                </li>
                <li>
                    <label>活动时间：</label>
                    <div class="value">
                        {{ activityDetail.activityStartTime }} - {{ activityDetail.activityEndTime }}
                    </div>
                </li>
                <li v-if="activityDetail.productType !== 'PHYSICAL_GOODS'">
                    <label>核销使用时间：</label>
                    <div class="value">
                        <template v-if="activityDetail.validityPeriodStart && activityDetail.validityPeriodEnd">
                            {{ activityDetail.validityPeriodStart }} - {{ activityDetail.validityPeriodEnd }}
                        </template>
                        <template v-else>
                            长期有效
                        </template>
                    </div>
                </li>
                <li>
                    <label>成团瓜分奖：</label>
                    <div class="value" v-if="activityDetail.hasReward === 0">
                        <span>有红包奖池，瓜分1次</span>
                        <div v-for="(item,index) in activityDetail.prizeList" :key="index">
                            满 {{ item.numberLimit }} 件，瓜分 {{ item.prize }} 元红包
                        </div>
                    </div>
                    <div class="value" v-else>
                        无奖励
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { togetherActivityDetail, getUserTagList } from '../../../../apis/marketing-manage/together'
export default {
    components: {
    },
    data () {
        return {
            activityDetail: {},
            userTagList: [], // 用户标签
            userTag: ['所有注册用户', 'helper可用', '普通会员', '部分用户组可用']
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
        userTags () {
            if (this.userTagList.length > 0 && this.activityDetail.receiveLimit === 3) {
                const mes = this.userTagList.filter(({ id }) => this.activityDetail.userTagIdList.includes(id))
                const tagList = mes.map(({ tagName }) => tagName)
                const arr = []
                // 每行显示三个
                const rowNum = tagList.length % 3 === 0 ? tagList.length / 3 : Math.ceil(tagList.length / 3)
                for (let i = 0; i < rowNum; i++) {
                    arr.push(tagList.slice(i * 3, i * 3 + 3))
                }
                return arr
            }
            return []
        }
    },
    async created () {
        this.getTogetherActivityDetail(this.id)
        // 获取用户分组
        try {
            const { result } = await getUserTagList()
            this.userTagList = result
        } catch (e) { throw e }
    },
    methods: {
        async getTogetherActivityDetail (id) {
            const data = await togetherActivityDetail(id)
            this.activityDetail = data.result
        },
        // 展示部分用户
        showUserTags () {
            if (this.userTags.length === 0) {
                return this.$error('所属用户标签数据被清空')
            }
            let htmlStr = '<div style="display:inline-grid;width:100%;grid-template-columns: auto auto auto;" >'
            for (const item of this.userTags) {
                for (const i in item) {
                    htmlStr += `<span style="display:inline-block;margin-bottom:10px;background:#eee;border:1px solid #ccc;padding:6px;margin-right:${ i <= 1 ? '20px' : '0px' }">${ item[i] }</span>`
                }
            }
            htmlStr += '</div>'
            this.$alert({
                title: '部分用户组',
                message: htmlStr,
                dangerouslyUseHTMLString: true
            })
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "src/views/marketing-manage/playing-methods/together-buy/together";
  .detail{
    margin: 32px 0 0 32px;
    .detail-wrap{
      margin-top: 32px;
      font-size: 18px;
      li{
        display: flex;
        margin-top: 20px;
        label{
          color: #666666;
          margin-right: 10px;
        }
        .value{
          font-weight: bold;
          color: #333333;
        }
        .rule{
          font-weight: bold;
          color: #333333;
          word-break: break-all;
          white-space: pre-wrap
        }
        .product{
          border: 1px solid #CCCCCC;
          padding: 7px;
          display: flex;
          width: 420px;
          position: relative;
          img{
            width: 100px;
            height: 100px;
            margin-right: 10px;
          }
          .title{
            width: 290px;
            line-height: 1.6;
            word-break: break-all;
            color: #666666;
          }
        }
      }
    }
  }
</style>
