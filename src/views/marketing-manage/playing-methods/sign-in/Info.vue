<template>
    <div :class="$style.container">
        <el-button
            type="primary"
            round
            @click="$router.push({name:'SignInEdit', params:{id: activityDetail.entity.id}})"
            v-if="activityDetail.entity.activityStatus === 0 || activityDetail.entity.activityStatus === 1"
        >
            编辑
        </el-button>
        <ul :class="$style.detailWrap">
            <li>
                <label>活动时间：</label>
                <div :class="$style.value">
                    {{ activityDetail.entity.activityStartTime }} - {{ activityDetail.entity.activityEndTime }}
                </div>
            </li>
            <li>
                <label>答题数量：</label>
                <div :class="$style.value">
                    {{ activityDetail.entity.checkDays }}个智力题目
                </div>
            </li>
            <li>
                <label>适用用户：</label>
                <div :class="$style.value">
                    <span>{{ userTag[activityDetail.entity.userScope] || '' }}</span>
                    <el-button v-if="activityDetail.entity.userScope === 3" @click="showUserTags" type="primary" class="ml-10">
                        查看
                    </el-button>
                </div>
            </li>
            <li>
                <label>抽奖条件：</label>
                <div :class="$style.value">
                    参与已勾选的全部智力题，即可获得 1 次抽奖机会
                </div>
            </li>
            <li>
                <label>抽奖时间：</label>
                <div :class="$style.value">
                    用户签到参与全部的智力题，即可进行智慧礼的抽奖
                </div>
            </li>
            <li>
                <label>活动细则：</label>
                <div :class="$style.rule" v-html="activityDetail.entity.activityRule" />
            </li>
            <li>
                <label>总中奖率：</label>
                <div :class="$style.value">
                    {{ activityDetail.entity.winningProbability }}%
                </div>
            </li>
            <li>
                <label>智慧礼：</label>
                <div>
                    <div :class="$style.product" v-for="(item,index) in activityDetail.bigGifts" :key="index">
                        <img :src="item.giftImage">
                        <div :class="$style.title">
                            <div>{{ item.giftName }}</div>
                            <div>库存：{{ item.allAwardLimit }} 个</div>
                            <div>已领取：{{ item.awardDraw }} 个</div>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <label>是否设置奖品：</label>
                <div :class="$style.value">
                    <span v-if="activityDetail.entity.ladderAward !== undefined && activityDetail.entity.ladderAward === 0">无</span>
                    <template v-else>
                        <div :class="$style.gifts" v-for="(item,index) in activityDetail.smallGifts" :key="index">
                            <span>累计获得打卡 {{ item.location }} 个智力题，可获得{{ ladderTag[item.ladderAwardType - 1] || '' }}</span>
                        </div>
                    </template>
                </div>
            </li>
            <li v-if="activityDetail.entity.isShowLog === 1">
                <label>品牌 logo：</label>
                <div :class="$style.value">
                    <img :src="activityDetail.entity.logImgUrl" alt="">
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { getUserTagList } from '../../../../apis/marketing-manage/together'
import { materialSchemeList } from '../../../../apis/marketing-manage/new-year/year-flavor'
export default {
    name: 'SignInInfo',
    data () {
        return {
            activityDetail: {
                // 详细
                entity: {},
                bigGifts: [],
                smallGifts: [],
                // 用户分组
                tagGroups: [],
                // 端午活动
                materialSchemes: []
            },
            // 端午活动
            yearFlavorList: [],
            // 用户标签
            userTagList: [],
            userTag: ['所有注册用户', 'helper可用', '普通会员', '部分用户组可用'],
            // 阶梯奖品类型 ' 1 礼品 2 奖学金  3 全场满减券 4 品类券'
            ladderTag: ['礼品', '奖学金', '全场满减券', '品类券']
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        userTags () {
            if (this.userTagList.length > 0 && this.activityDetail.entity.userScope && this.activityDetail.entity.userScope === 3) {
                const tagGroups = this.activityDetail.tagGroups.map(({ groupTagId }) => groupTagId)
                const mes = this.userTagList.filter(({ id }) => tagGroups.includes(id))
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
        try {
            this.activityDetail = this.data
            // 获取用户分组,端午活动列表
            const [{ result: userTagList }, { result: yearFlavorList }] = await Promise.all([getUserTagList(), materialSchemeList({ activityType: 3 })])
            this.yearFlavorList = yearFlavorList
            this.userTagList = userTagList
        } catch (e) { throw e }
    },
    methods: {
        // 展示部分用户
        showUserTags () {
            if (this.userTags.length === 0) {
                return this.$error('所属用户标签数据被清空')
            }
            let htmlStr = '<div style="display:inline-grid;width:100%;grid-template-columns: auto auto auto;" >'
            for (const item of this.userTags) {
                for (const i in item) {
                    htmlStr += `<span style="display:inline-block;background:#eee;border:1px solid #ccc;padding:6px;margin-bottom:10px;margin-right:${ i <= 1 ? '20px' : '0px' }">${ item[i] }</span>`
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

<style lang="scss" module scoped>

.container {
    padding: 32px;
    box-sizing: border-box;
    background: #fff;
    > .detail-wrap {
        margin-top: 32px;
        font-size: 14px;
        > li {
            display: flex;
            margin-top: 20px;
            > label {
                width: 130px;
                color: #999;
                margin-right: 10px;
            }
            > .value {
                color: #333;
                font-size: 14px;
                > .gifts {
                    color: #666;
                    margin-bottom: 16px;
                    > span {
                        display: inline-block;
                        padding: 8px;
                        background: #f7f7f7;
                    }
                }
                > img {
                    width: 100px;
                    height: 100px;
                }
            }
            > .rule {
                font-size: 14px;
                color: #333;
                word-break: break-all;
                white-space: pre-wrap;
                line-height: 30px;
            }
            .product {
                border: 1px solid #ccc;
                padding: 7px;
                display: flex;
                width: 420px;
                margin-bottom: 16px;
                font-size: 14px;
                position: relative;
                background: #f7f7f7;
                > img {
                    width: 100px;
                    height: 100px;
                    margin-right: 10px;
                }
                > .title {
                    width: 290px;
                    line-height: 1.6;
                    word-break: break-all;
                    color: #666;
                }
            }
        }
    }
}

</style>
