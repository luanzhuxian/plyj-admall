<template>
    <div :class="$style.live">
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Live extends Vue {

}
</script>

<style lang='scss' module>

.live {
    height: 100%;
}

</style>
