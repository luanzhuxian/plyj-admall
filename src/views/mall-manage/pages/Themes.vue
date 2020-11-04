<template>
    <div :class="$style.mallThemes">
        <el-tabs :value="currentTab" type="card" @tab-click="handleTabClick">
            <el-tab-pane
                v-for="item in tabs"
                :key="item.name"
                :label="item.label"
                :name="item.name"
            />
        </el-tabs>

        <div :class="$style.mallThemesContainer">
            <!--  首页  -->
            <div :class="$style.mallThemesList" v-show="currentTab === 'HOME'">
                <TemplateItem
                    v-for="(item, index) of templateList"
                    :key="index"
                    :data="item"
                    :current="currentHomeType"
                    @use="toNextPage(item)"
                    @preview="previewTemplate(item)"
                />
            </div>

            <!--  主会场  -->
            <div v-show="currentTab === 'ACTIVITY'">
                <div :class="$style.mallThemesTitle" v-if="double12TemplateList.length">
                    双十二主会场（仅在主会场按钮下显示）
                </div>
                <div :class="$style.mallThemesList" v-if="double12TemplateList.length">
                    <TemplateItem
                        v-for="(item, index) of double12TemplateList"
                        :key="index"
                        :data="item"
                        :current="currentActivityType"
                        @use="compose(toNextPage, check)(item)"
                        @preview="compose(previewTemplate, check)(item)"
                    />
                </div>

                <div :class="$style.mallThemesTitle" v-if="dragonGateTemplateList.length">
                    龙门节主会场（仅在主会场按钮下显示）
                </div>
                <div :class="$style.mallThemesList" v-if="dragonGateTemplateList.length">
                    <TemplateItem
                        v-for="(item, index) of dragonGateTemplateList"
                        :key="index"
                        :data="item"
                        :current="currentActivityType"
                        @use="compose(toNextPage, check)(item)"
                        @preview="compose(previewTemplate, check)(item)"
                    />
                </div>

                <div :class="$style.mallThemesTitle" v-if="xinchunTemplateList.length">
                    新春主会场（仅在主会场按钮下显示）
                </div>
                <div :class="$style.mallThemesList" v-if="xinchunTemplateList.length">
                    <TemplateItem
                        v-for="(item, index) of xinchunTemplateList"
                        :key="index"
                        :data="item"
                        :current="currentActivityType"
                        @use="compose(toNextPage, check)(item)"
                        @preview="compose(previewTemplate, check)(item)"
                    />
                </div>
            </div>

            <!--  皮肤  -->
            <div :class="$style.mallThemesList" v-show="currentTab === 'SKIN'">
                <TemplateItem
                    v-for="(item, index) of skinList"
                    :key="index"
                    :data="item"
                    :current="currentSkinId"
                >
                    <template #buttons>
                        <el-button plain @click="previewTemplate(item)">
                            预览皮肤
                        </el-button>
                        <el-button plain @click="cancelSkin" v-if="item.skinId === currentSkinId">
                            取消换肤
                        </el-button>
                        <el-button plain @click="asyncCompose(updateSkin, checkIsExpired)(item)" v-else>
                            立即换肤
                        </el-button>
                    </template>
                </TemplateItem>
            </div>
        </div>

        <!--  预览  -->
        <TemplatePreview :show.sync="showPreview">
            <Render
                :tmpl-type="previewTmplType"
                :skin-id="previewSkinId"
                :data="previewData"
                is-preview
                is-empty-show
                :is-clickable="false"
                :render="(h, props) => h(tag, { props })"
            />
        </TemplatePreview>
    </div>
</template>

<script lang="ts">
/* eslint-disable prefer-spread */

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import {
    getDefaultTemplateList,
    updateSkinStatus,
    cancelSkinStatus,
    getSkinStatus,
    getServerTime
} from '../../../apis/mall'
import { getActivityAuth } from '../../../apis/marketing-manage/gameplay'
import TemplateB from '../components/templates/Template-B.vue'
import TemplateC from '../components/templates/Template-C.vue'
import TemplateD from '../components/templates/Template-D.vue'
import TemplateFengqiang from '../components/templates/Template-Fengqiang.vue'
import TemplateBaofa from '../components/templates/Template-Baofa.vue'
import TemplateFanchang from '../components/templates/Template-Fanchang.vue'
import TemplateXinchun from '../components/templates/Template-Xinchun.vue'
import TemplateDragonGate from '../components/templates/Template-Dragon-Gate.vue'
import TemplateDouble12 from '../components/templates/Template-Double-12.vue'
import TemplateItem from '../components/Template-Item.vue'
import TemplatePreview from '../components/Template-Preview.vue'
import Render from '../components/Render'
import { rebuild } from '../utils/rebuild'
import { isString } from '../utils/helper'
import { tagMap, TemplateTypes } from '../utils/map'
import { Template, TemplateSkinModel } from '../utils/types'

const mall = namespace('mall')

const templateModels = [{
    category: 'template',
    type: -1,
    img: 'https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/0f6361c5-9706-4cfe-9417-5018ca8dd83f.png',
    isHover: false,
    isFree: true,
    charge: '免费',
    expire: '永久使用'
}, {
    category: 'template',
    type: 3,
    img: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/add-product-example/template/template-top-2.png',
    isHover: false,
    isFree: true,
    charge: '免费',
    expire: '永久使用'
}, {
    category: 'template',
    type: 4,
    img: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/template-top-4.png',
    isHover: false,
    isFree: true,
    charge: '免费',
    expire: '永久使用'
    // }, {
    //     category: 'template',
    //     type: 5,
    //     img: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/template-top-5.jpg',
    //     isHover: false,
    //     isFree: false,
    //     charge: '已过期',
    //     expire: '2019.12.31'
    // }, {
    //     category: 'template',
    //     type: 6,
    //     img: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/template-top-6.jpg',
    //     isHover: false,
    //     isFree: false,
    //     charge: '已过期',
    //     expire: '2019.12.31'
    // }, {
    //     category: 'template',
    //     type: 7,
    //     img: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/template-top-7.jpg',
    //     isHover: false,
    //     isFree: false,
    //     charge: '已过期',
    //     expire: '2019.12.31'
}, {
    category: 'template',
    type: 8,
    img: 'https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/f70ba451-dbc1-4efe-9530-82ab5d94896b.png',
    isHover: false,
    isFree: false,
    charge: '已过期',
    expire: '2020.03.31'
}, {
    category: 'template',
    type: 9,
    img: 'https://mallcdn.youpenglai.com/static/admall/mall-management/template-d.jpg',
    isHover: false,
    isFree: false,
    charge: '免费',
    expire: '永久使用'
}, {
    category: 'template',
    type: 10,
    img: 'https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/template-top.jpg',
    isHover: false,
    isFree: false,
    charge: '已过期',
    expire: '2020.08.31'
}, {
    category: 'template',
    type: 11,
    img: 'https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/template-top.png',
    isHover: false,
    isFree: false,
    charge: '双十二用户可用',
    expire: '2020.12.31'
}]

const skinModels = [{
    category: 'skin',
    skinId: 1,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/5974a66e-2638-4023-b520-441d776feba7.jpeg',
    isHover: false,
    templateName: '圣诞皮肤'
}, {
    category: 'skin',
    skinId: 2,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/2a7871e3-d5d7-4801-ab2d-86cf7b532418.jpeg',
    isHover: false,
    templateName: '元旦皮肤'
}, {
    category: 'skin',
    skinId: 3,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/2d8b1945-12d4-4bca-aacc-0e0ce9a8af5e.jpeg',
    isHover: false,
    templateName: '新春皮肤'
}, {
    category: 'skin',
    skinId: 4,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/cf839390-03a3-43dc-8ec3-9bddbb40daa4.jpeg',
    isHover: false,
    templateName: '小年皮肤'
}, {
    category: 'skin',
    skinId: 5,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/2ae956b0-5490-4ba4-a836-e21a4768e470.png',
    isHover: false,
    templateName: '元宵皮肤'
}, {
    category: 'skin',
    skinId: 6,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-women-day.jpg',
    isHover: false,
    templateName: '妇女节皮肤'
}, {
    category: 'skin',
    skinId: 7,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-nnf.jpg',
    isHover: false,
    templateName: '年年翻皮肤'
}, {
    category: 'skin',
    skinId: 8,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-earth-day.jpg',
    isHover: false,
    templateName: '世界地球日皮肤'
}, {
    category: 'skin',
    skinId: 9,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-labour-day.jpg',
    isHover: false,
    templateName: '劳动节皮肤'
}, {
    category: 'skin',
    skinId: 10,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-mothers-day.jpg',
    isHover: false,
    templateName: '母亲节皮肤'
}, {
    category: 'skin',
    skinId: 11,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-children-day.jpg',
    isHover: false,
    templateName: '儿童节皮肤'
}, {
    category: 'skin',
    skinId: 12,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-fathers-day.jpg',
    isHover: false,
    templateName: '父爱如山',
    charge: '限时免费',
    chargeTextColor: 'red',
    expire: '2020.08.31'
}, {
    category: 'skin',
    skinId: 13,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/skin-dragon-boat.jpg',
    isHover: false,
    templateName: '粽情端午',
    charge: '限时免费',
    chargeTextColor: 'red',
    expire: '2020.08.31'
}, {
    category: 'skin',
    skinId: 14,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/skin-mid-autumn.jpg',
    isHover: false,
    templateName: '中秋佳节'
}, {
    category: 'skin',
    skinId: 15,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/skin-national-day.jpg',
    isHover: false,
    templateName: '喜迎国庆'
}, {
    category: 'skin',
    skinId: 16,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/cover.jpg',
    isHover: false,
    templateName: '双十二文化类',
    charge: '限时免费',
    chargeTextColor: 'red',
    expire: '2020.12.31'
}, {
    category: 'skin',
    skinId: 17,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/cover.jpg',
    isHover: false,
    templateName: '双十二运动类',
    charge: '限时免费',
    chargeTextColor: 'red',
    expire: '2020.12.31'
}, {
    category: 'skin',
    skinId: 18,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/art/cover.jpg',
    isHover: false,
    templateName: '双十二艺术类',
    charge: '限时免费',
    chargeTextColor: 'red',
    expire: '2020.12.31'
}, {
    category: 'skin',
    skinId: 19,
    img: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/cover.jpg',
    isHover: false,
    templateName: '双十二皮肤',
    charge: '限时免费',
    chargeTextColor: 'red',
    expire: '2020.12.31'
}]

@Component({
    components: {
        TemplateB,
        TemplateC,
        TemplateD,
        TemplateFengqiang,
        TemplateBaofa,
        TemplateFanchang,
        TemplateXinchun,
        TemplateDragonGate,
        TemplateDouble12,
        TemplateItem,
        TemplatePreview,
        Render
    }
})
export default class MallThemes extends Vue {
    /* data */
    tabs = [
        { label: '首页模板', name: 'HOME' },
        { label: '主会场模板', name: 'ACTIVITY' },
        { label: '皮肤主题', name: 'SKIN' }
    ]

    currentTab = 'HOME'
    templateList: Template[] = []
    double12TemplateList: Template[] = []
    xinchunTemplateList: Template[] = []
    dragonGateTemplateList: Template[] = []
    skinList: TemplateSkinModel[] = []
    currentSkinId = 0 // 当前使用皮肤

    // 预览
    showPreview = false
    previewData = {}
    previewTmplType = 0 // 预览模板id
    previewSkinId = 0 // 预览皮肤id

    // 模板使用权限: 1 '开启', 2: '过期', 3: '未开启活动'
    double12LockStatus = 3 // 双十二权限
    xinchunLockStatus = 3 // 新春权限
    dragonGateLockStatus = 3 // 龙门节权限

    /* computed */
    @mall.Getter('currentHomeType') currentHomeType!: number // 当前首页模板类型
    @mall.Getter('currentActivityType') currentActivityType!: number // 当前主会场模板类型

    get tag () {
        return tagMap[this.previewTmplType]
    }

    async created () {
        try {
            const { currentTab } = this.$route.query
            if (currentTab && isString(currentTab) && ['HOME', 'ACTIVITY', 'SKIN'].includes(currentTab)) {
                this.currentTab = currentTab
            }

            const requests = [
                this.getDefaultTemplate(),
                this.getActivityAuth(),
                this.getSkinStatus()
            ]

            await Promise.all(requests.map(p => p.catch(e => {
                console.error(e)
                return { result: null }
            })))
        } catch (error) {
            throw error
        }
    }

    /* methods */
    @mall.Action('getCurrentTemplate') getCurrentTemplate!: (type: number) => Promise<void>

    async handleTabClick (tab: { name: '' }) {
        try {
            this.currentTab = tab.name
        } catch (error) {
            throw error
        }
    }

    async getDefaultTemplate () {
        try {
            const data = await getDefaultTemplateList()
            const result: Template[] = data.result
            if (result.length) {
                for (const item of result) {
                    const model = templateModels.find(m => m.type === item.type)
                    Object.assign(item, model)
                }

                // 首页模版
                this.templateList = result.filter(item => ~[
                    TemplateTypes.TemplateB,
                    TemplateTypes.TemplateB2,
                    TemplateTypes.TemplateC,
                    TemplateTypes.TemplateD
                ].indexOf(item.type))

                // 双12主会场模版
                this.double12TemplateList = result.filter(item => ~[
                    // TemplateTypes.TemplateFengQiang,
                    // TemplateTypes.TemplateBaoFa,
                    // TemplateTypes.TemplateFanChang,
                    TemplateTypes.TemplateDouble12
                ].indexOf(item.type))

                // 新春主会场模版
                this.xinchunTemplateList = result.filter(item => item.type === TemplateTypes.TemplateXinChun)

                // 龙门节主会场模版
                this.dragonGateTemplateList = result.filter(item => item.type === TemplateTypes.TemplateDragonGate)

                // 皮肤
                this.skinList = skinModels
                    .map(model => {
                        const template = JSON.parse(JSON.stringify(this.templateList[1]))
                        return {
                            ...template,
                            ...model
                        }
                    })
                    .reverse()
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * 获取主会场模板使用权限
     * lockStatus 1 '开启', 2: '过期', 3: '未开启活动'
     */
    async getActivityAuth () {
        type lockStatusInfo = {
            activityName: string;
            activityValue: string;
            lockName: string;
            lockStatus: number;
        }
        try {
            const { result }: { result: lockStatusInfo[] } = await getActivityAuth()
            const double12 = result.find(item => item.activityValue === '4')
            const xinChun = result.find(item => item.activityValue === '2')
            const dragonGate = result.find(item => item.activityValue === '3')
            this.double12LockStatus = double12 ? double12.lockStatus : 3
            this.xinchunLockStatus = xinChun ? xinChun.lockStatus : 3
            this.dragonGateLockStatus = dragonGate ? dragonGate.lockStatus : 3
        } catch (error) {
            throw error
        }
    }

    // 获取当前皮肤
    async getSkinStatus () {
        try {
            const { result } = await getSkinStatus({ type: 1 })
            this.currentSkinId = result
        } catch (error) {
            throw error
        }
    }

    // 预览
    previewTemplate (item: Template | TemplateSkinModel) {
        if (item && item.moduleModels) {
            if ('skinId' in item) {
                this.previewSkinId = item.skinId
            }
            this.previewTmplType = item.type
            this.previewData = rebuild(item.type, item.moduleModels)
            this.showPreview = true
        }
    }

    toNextPage ({ type }: { type: number }) {
        if (!type) return false
        this.$router.push({ name: 'MallDecoration', query: { from: 'THEME', id: String(type) } })
    }

    // 检查是否有模板使用权限
    check (item: Template) {
        // 双十二
        if (item.type === TemplateTypes.TemplateDouble12) {
            if (this.double12LockStatus === 1) {
                return item
            }

            const modalText = this.double12LockStatus === 2
                ? '该主会场模板已过期，不可使用，请选择其他主会场模板吧~'
                : '参与双十二的用户，请联系您的城市经理和客服开通使用权限。'
            this.$confirm({
                title: modalText,
                confirmButtonText: '朕知道了',
                showCancelButton: false
            })
        }
        // 新春
        if (item.type === TemplateTypes.TemplateXinChun) {
            if (this.xinchunLockStatus === 1) {
                return item
            }

            const modalText = this.xinchunLockStatus === 2
                ? '该主会场模板已过期，不可使用，请选择其他主会场模板吧~'
                : '参与新春的用户，请联系您的城市经理和客服开通使用权限。'
            this.$confirm({
                title: modalText,
                confirmButtonText: '朕知道了',
                showCancelButton: false
            })
        }
        // 龙门节
        if (item.type === TemplateTypes.TemplateDragonGate) {
            if (this.dragonGateLockStatus === 1) {
                return item
            }

            const modalText = this.dragonGateLockStatus === 2
                ? '该主会场模板已过期，不可使用，请选择其他主会场模板吧~'
                : '参与龙门节的用户，请联系您的城市经理和客服开通使用权限。'
            this.$confirm({
                title: modalText,
                confirmButtonText: '朕知道了',
                showCancelButton: false
            })
        }
        return false
    }

    // 皮肤是否过期
    async checkIsExpired (item: TemplateSkinModel) {
        try {
            const { expire } = item
            const ts = new Date(expire).valueOf()
            // 无过期日期 默认通过
            if (isNaN(ts)) {
                return item
            }

            const { result = Date.now() } = await getServerTime()
            const isExpired = result > ts

            // 过期
            if (isExpired) {
                return false
            }

            return item
        } catch (error) {
            throw error
        }
    }

    compose (...fns: Function[]) {
        return (...args: any) => fns.reduceRight((val, fn) => fn.apply(null, [].concat(val)), args)
    }

    asyncCompose (...fns: Function[]) {
        return (...args: any) => fns.reduceRight(async (promise, fn) => {
            const val = await promise
            const result = await fn.apply(null, [].concat(val))
            return result
        }, Promise.resolve(args))
    }

    // 换肤
    async updateSkin ({ skinId }: { skinId: number }) {
        try {
            if (!skinId) {
                return this.$warning('抱歉无法使用该皮肤')
            }

            const { result } = await updateSkinStatus(skinId, { type: 1 }) // type: 1 首页换肤
            if (result) {
                this.$success('换肤成功')
                this.currentSkinId = skinId
                await this.$nextTick()
                await this.getCurrentTemplate(1)
            } else {
                this.$error('换肤失败，请先装修商城')
            }
        } catch (error) {
            throw error
        }
    }

    // 取消换肤
    async cancelSkin () {
        try {
            const { result } = await cancelSkinStatus({ type: 1 })
            if (result) {
                this.$success('取消换肤成功')
                this.currentSkinId = 0
                await this.$nextTick()
                await this.getCurrentTemplate(1)
            } else {
                this.$error('取消换肤失败')
            }
        } catch (error) {
            throw error
        }
    }
}
</script>

<style module lang="scss">
.mall-themes {
    min-height: calc(100vh - 160px);
    &-container {
        margin-top: 30px;
    }
    &-title {
        font-size: 18px;
        font-weight: bolder;
    }
    &-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 50px;
    }
}

</style>
