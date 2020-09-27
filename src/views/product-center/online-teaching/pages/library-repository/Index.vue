<template>
    <div :class="$style.library" class="wrap">
        <transition name="breadcrumb">
            <div :class="$style.giveNotice" v-if="giveResourceList.length && $route.name === 'VideoRepository'">
                <pl-svg name="icon-sound" width="22" height="20" />
                <span :class="$style.text">您有 {{ giveResourceList.length }} 个赠送资源课程待授权，立即免费授权！</span>
                <el-button type="text" size="mini" @click="showGiveResource = true">
                    立即查看
                </el-button>
            </div>
        </transition>

        <keep-alive>
            <router-view :key="$route.path" :class="$style.libraryContainer" />
        </keep-alive>

        <!-- 赠送资源弹窗 -->
        <ResourceWarranty :show.sync="showGiveResource" :list="giveResourceList" />
    </div>
</template>

<script>
import { getWaitWarrantyResource } from './../../../../../apis/product-center/line-teaching/repository'
import ResourceWarranty from './components/Resource-Warranty'
export default {
    name: 'Library',
    components: {
        ResourceWarranty
    },
    deactivated () {
        this.giveResourceList = []
    },
    data () {
        return {
            showGiveResource: false,
            giveResourceList: []
        }
    },
    methods: {
    // 获取送课的资源
        async getWaitWarrantyResource () {
            try {
                const { result } = await getWaitWarrantyResource(1)
                this.giveResourceList = result || []
            } catch (e) { throw e }
        }
    },
    watch: {
        '$route.name': {
            async handler (next) {
                if (next !== 'VideoRepository') {
                    return
                }
                try {
                    await this.getWaitWarrantyResource()
                } catch (e) { throw e }
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" module>

.library {
    > .give-notice {
        margin-bottom: 20px;
        padding: 18px 24px;
        background-color: #e7e7e7;
        > .text {
            margin: 0 25px;
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
    }
    .library-container {
        padding-bottom: 20px;
    }
}

</style>
