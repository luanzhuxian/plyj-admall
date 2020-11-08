<template>
    <div>
        <router-view v-if="loaded" />
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MutationTypes } from '@/store/mutation-type'
const onlineTeaching = namespace('onlineTeaching')

@Component
export default class OnlineTeaching extends Vue {
    loaded = false
    @onlineTeaching.Action(MutationTypes.hasLiveModule) getHasLiveModule!: Function
    // 是否开通了直播
    async created () {
        await this.getHasLiveModule()
        this.loaded = true
    }
}
</script>
