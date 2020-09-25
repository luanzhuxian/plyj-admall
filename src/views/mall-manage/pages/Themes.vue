<template>
    <div :class="$style.mallThemes">
        <PlSvg name="icon-ygxfb-e36c1" height="80" />
        <!--  首页  -->
        <div :class="$style.mallThemesList" v-show="type === 'home'">
            <TemplateItem
                v-for="(item, index) of templateList"
                :key="index"
                :data="item"
                @use="toNextPage(item)"
                @preview="previewTemplate(item)"
            />
        </div>

        <!--  主会场  -->
        <div v-show="type === 'activity'">
            <div :class="$style.mallThemesTitle" v-if="dragonGateTemplateList.length">
                龙门节主会场（仅在主会场按钮下显示）
            </div>
            <div :class="$style.mallThemesList" v-if="dragonGateTemplateList.length">
                <TemplateItem
                    v-for="(item, index) of dragonGateTemplateList"
                    :key="index"
                    :data="item"
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
                    @use="compose(toNextPage, check)(item)"
                    @preview="compose(previewTemplate, check)(item)"
                />
            </div>

            <div :class="$style.mallThemesTitle" v-if="activityTemplateList.length">
                双十二主会场（仅在主会场按钮下显示）
            </div>
            <div :class="$style.mallThemesList" v-if="activityTemplateList.length">
                <TemplateItem
                    v-for="(item, index) of activityTemplateList"
                    :key="index"
                    :data="item"
                    @use="compose(toNextPage, check)(item)"
                    @preview="compose(previewTemplate, check)(item)"
                />
            </div>
        </div>

        <!--  皮肤  -->
        <div :class="$style.mallThemesList" v-show="type === 'skin'">
            <TemplateItem
                v-for="(item, index) of skinList"
                :key="index"
                :data="item"
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

        <!--  预览  -->
        <TemplatePreview :show.sync="templatePreviewShow">
            <Render
                :tmpl-id="tmplId"
                :skin-id="skinId"
                :data="templateModels"
                is-preview
                is-empty-show
                is-campaign-hide
                :is-clickable="false"
                :render="(h, props) => h(tag, { props })"
            />
        </TemplatePreview>
        <el-dialog custom-class="warn-12" top="40vh" width="620px" :visible.sync="showAlertModal">
            <div slot="title">
                {{ `您尚未获取${modalText}授权校权限，请联系您的城市经理和客服开通。` }}
            </div>
            <div slot="footer">
                <el-button @click="showAlertModal = false">
                    朕知道了
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/* eslint-disable prefer-spread */

import { Vue, Component, Watch } from 'vue-property-decorator'
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
import TemplateItem from '../components/Template-Item.vue'
import TemplatePreview from '../components/Template-Preview.vue'
import Render from '../components/Render'
import { rebuild } from '../utils/service'
import { tagMap } from '../utils/map'
import { Template, TemplateIds, TemplateSkinModel } from '../utils/types'

const models = [
    {
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
    }, {
        category: 'template',
        type: 5,
        img: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/template-top-5.jpg',
        isHover: false,
        isFree: false,
        charge: '双十二用户可用',
        expire: '12月31日'
    }, {
        category: 'template',
        type: 6,
        img: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/template-top-6.jpg',
        isHover: false,
        isFree: false,
        charge: '双十二用户可用',
        expire: '12月31日'
    }, {
        category: 'template',
        type: 7,
        img: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/template-top-7.jpg',
        isHover: false,
        isFree: false,
        charge: '双十二用户可用',
        expire: '12月31日'
    }, {
        category: 'template',
        type: 8,
        img: 'https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/f70ba451-dbc1-4efe-9530-82ab5d94896b.png',
        isHover: false,
        isFree: false,
        charge: '新春用户可用',
        expire: '3月31日'
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
        charge: '龙门节用户可用',
        expire: '8月31日'
    }
]

const skinModles = [
    {
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
        img: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/skin-national-day.jpg',
        isHover: false,
        templateName: '喜迎国庆'
    }
]

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
        TemplateItem,
        TemplatePreview,
        Render
    }
})
export default class MallThemes extends Vue {
    /* data */
    templateList: Template[] = []
    activityTemplateList: Template[] = []
    xinchunTemplateList: Template[] = []
    dragonGateTemplateList: Template[] = []
    skinList: TemplateSkinModel[] = []
    templateModels = {}
    templatePreviewShow = false
    tmplId = 0 // 预览模板id
    skinId = 0 // 预览皮肤id
    currentSkinId = 0 // 当前使用皮肤
    isD12Available = false // 双十二权限
    isXinchunAvailable = false // 新春权限
    isDragonGateAvailable = false // 龙门节权限
    showAlertModal = false
    modalText = ''
    type = ''

    /* computed */
    get tag () {
        return tagMap[this.tmplId]
    }

    /* watch */
    @Watch('$route.path', { immediate: true })
    async onChange (val: string) {
        if (!val) return
        const map: DynamicObject = {
            '/mall-manage/themes/template-home': 'home',
            '/mall-manage/themes/template-activity': 'activity',
            '/mall-manage/themes/skin': 'skin'
        }
        this.type = map[val]
        if (this.type && !this.templateList.length) {
            this.getDefaultTemplate()
        }
    }

    async created () {
        try {
            // 获取当前皮肤
            getSkinStatus({ type: 1 }).then(({ result }) => {
                this.currentSkinId = result
            })
            // 获取主会场模板使用权限
            getActivityAuth().then(({ result }) => {
                // lockStatus: 1 '开启', 2: '过期', 3: '未开启活动'
                const [d12 = {}, xinChun = {}, dragonGate = {}] = result
                this.isD12Available = d12.lockStatus === 1
                this.isXinchunAvailable = xinChun.lockStatus === 1
                this.isDragonGateAvailable = dragonGate.lockStatus === 1
            })
        } catch (error) {
            throw error
        }
    }

    /* methods */
    async getDefaultTemplate () {
        try {
            const data = await getDefaultTemplateList()
            const result: Template[] = data.result
            if (result.length) {
                for (const item of result) {
                    const model = models.find(m => m.type === item.type)
                    Object.assign(item, model)
                }
                // 首页模版
                this.templateList = result.filter(item => ~[
                    TemplateIds.TemplateB,
                    TemplateIds.TemplateB2,
                    TemplateIds.TemplateC,
                    TemplateIds.TemplateD
                ].indexOf(item.type))
                // 双12主会场模版
                this.activityTemplateList = result.filter(item => ~[
                    TemplateIds.TemplateFengQiang,
                    TemplateIds.TemplateBaoFa,
                    TemplateIds.TemplateFanChang
                ].indexOf(item.type))
                // 新春主会场模版
                this.xinchunTemplateList = result.filter(item => item.type === TemplateIds.TemplateXinChun)
                // 龙门节主会场模版
                this.dragonGateTemplateList = result.filter(item => item.type === TemplateIds.TemplateDragonGate)
                // 皮肤
                this.skinList = skinModles
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

    // 预览
    previewTemplate (item: Template | TemplateSkinModel) {
        if (!item) return false
        if ('skinId' in item) {
            this.skinId = item.skinId
        }
        this.tmplId = item.type
        this.templateModels = rebuild(this.tmplId, item.moduleModels)
        this.templatePreviewShow = true
    }

    toNextPage ({ type }: { type: number }) {
        if (!type) return false
        this.$router.push({ name: 'Decoration', query: { from: 'template', id: String(type) } })
    }

    // 检查是否有模板使用权限
    check (item: Template) {
        if (~[TemplateIds.TemplateFengQiang, TemplateIds.TemplateBaoFa, TemplateIds.TemplateFanChang].indexOf(item.type) && !this.isD12Available) {
            this.modalText = '双十二'
            this.showAlertModal = true
            return false
        }
        if (item.type === 8 && !this.isXinchunAvailable) {
            this.modalText = '新春'
            this.showAlertModal = true
            return false
        }
        if (item.type === 10 && !this.isDragonGateAvailable) {
            this.modalText = '龙门节'
            this.showAlertModal = true
            return false
        }
        return item
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
            } else {
                this.$error('取消换肤失败')
            }
        } catch (error) {
            throw error
        }
    }
}
</script>

<style lang="scss">
.warn-12 {
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    .el-dialog__body {
        padding: 0;
    }
}
</style>
<style module lang="scss">
.mall-themes {
    min-height: calc(100vh - 160px);
    padding: 60px 100px;
    background-color: #fff;
    &-title {
        font-size: 18px;
        font-weight: bolder;
        margin-bottom: 30px;
    }
    &-list {
        display: flex;
        flex-wrap: wrap;
    }
}

</style>
