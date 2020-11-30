<template>
    <div
        :class="$style.schemePack"
        :style="{
            '--name-color': bgImgSrc ? '#fff' : '#333',
            '--desc-color': bgImgSrc ? '#fff' : '#999',
            '--tip-color': bgImgSrc ? '#fff' : '#6E7B8E',
            '--border-color': bgImgSrc ? '#fff' : '#e7e7e7',
            '--opacity': bgImgSrc ? 0.6 : 1,
            '--border-opacity': bgImgSrc ? 0.2 : 1,
            'background-image': `url(${bgImgSrc})`,
        }"
        @click="target"
    >
        <div :class="$style.content">
            <img :class="$style.img" :src="imgSrc">
            <div :class="$style.detail">
                <div :class="$style.title">
                    <span :class="$style.name" v-text="name" />
                    <span :class="$style.tag" v-for="item in tags" :key="item">{{ item }}</span>
                </div>
                <div :class="$style.desc" v-text="desc" />
            </div>
        </div>
        <div :class="$style.tip">
            <div v-if="expired">有效期：{{ expired }}</div>
            <div>当前活动：{{ count }}个</div>
        </div>
        <div
            :class="{
                [$style.lock]: true,
                [$style.unlock]: !isLock,
                [$style.bg]: bgImgSrc
            }"
        >
            <img :src="isLock ? 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/lock.png' : 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/unlock.png'" alt="">
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MutationTypes } from '@/store/mutation-type'
import { namespace } from 'vuex-class'
import moment from 'moment'
const accountMoudel = namespace('account')
interface RouteInfo {
    params: {
        programId: string;
    };
    [propName: string]: object | string;
}

@Component
export default class SchemePack extends Vue {
    @Prop({
        type: String,
        default: ''
    }) readonly name: string | undefined

    @Prop({
        type: String,
        default: ''
    }) readonly imgSrc: string | undefined

    @Prop({
        type: String,
        default: ''
    }) readonly desc: string | undefined

    @Prop({
        type: String,
        default: '长期有效'
    }) readonly expired: string | undefined

    @Prop({
        type: Array,
        default: () => []
    }) readonly tags: string[] | undefined

    @Prop({
        type: Boolean,
        default: false
    }) readonly isLock: boolean | undefined

     @Prop({
         type: String,
         default: ''
     }) readonly bgImgSrc: string | undefined

    @Prop({
        type: [String, Object],
        default: ''
    }) readonly routeInfo: string | object | undefined

    @Prop({
        type: [String, Number],
        default: 0
    }) readonly count: string | number | undefined

    @accountMoudel.Action(MutationTypes.getMarketStatusAuth) getMarketStatusAuth!: Function
    @accountMoudel.Getter('marketStatusAuth') marketStatusAuth!: any

    private async target () {
        const schemeProgramId: string = (this.routeInfo as RouteInfo)?.params?.programId
        const isLongmen = ['2', '6', '7'].includes(schemeProgramId)
        if (isLongmen) {
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this.getMarketStatusAuth()
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) return this.$alert('龙门节专属活动，若要开通请联系城市经理或者客服')
            const info = this.marketStatusAuth.find(({ programId }: { programId: string }) => programId === schemeProgramId)
            if (!info || moment(info.validity).valueOf() < Date.now()) return this.$alert('龙门节专属活动，若要开通请联系城市经理或者客服')
        }

        console.log(this.routeInfo)
        console.log(this.routeInfo)
        console.log(this.routeInfo)
        if (typeof this.routeInfo === 'string') {
            return this.$router.push({ name: this.routeInfo })
        }
        this.$router.push(this.routeInfo as object)
    }
}
</script>

<style module lang="scss">

.scheme-pack {
    position: relative;
    display: inline-block;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #F5F6FA;
    transition: 0.5s;
    &:hover {
        cursor: pointer;
        transform: translate3d(0, -6px, 0);
        box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    }
    > .content {
        display: flex;
        box-sizing: border-box;
        height: 88px;
        padding: 20px;
        > .img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
        }
        > .detail {
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            margin-left: 10px;
            > .title {
                display: flex;
                align-items: flex-start;
                width: 100%;
                > .name {
                    margin-bottom: 4px;
                    font-size: 14px;
                    color: var(--name-color);
                }
                > .tag {
                    display: inline-block;
                    width: 16px;
                    line-height: 14px;
                    box-sizing: border-box;
                    margin-left: 6px;
                    border: 1px solid #F79F1A;
                    border-radius: 2px;
                    text-align: center;
                    font-size: 12px;
                    color: #F79F1A;
                }
            }
            > .desc {
                font-size: 12px;
                color: var(--desc-color);
                opacity: var(--opacity);
            }
        }
    }
    > .tip {
        position: relative;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px 20px;
        font-size: 10px;
        color: var(--tip-color);
        &:before {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            height: 1px;
            width: 100%;
            background-color: var(--border-color);
            opacity: var(--border-opacity);
        }
    }
    > .lock {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        border-radius: 0px 10px 0px 10px;
        text-align: center;
        background-color: #DCDDE0;
        &.bg {
            background-color: #FF7046 !important;
        }
        &.unlock {
            background-color: #fff;
        }
    }
}

</style>
