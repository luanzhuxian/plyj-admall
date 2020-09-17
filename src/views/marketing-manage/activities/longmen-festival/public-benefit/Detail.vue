<template>
    <div class="detail">
        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情', name:'LongmenPublicBenefitInfo'},
                {label:'活动数据', name:'LongmenPublicBenefitData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div :class="$style.content">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LongmenPublicBenefitDetail',
    data () {
        return {}
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    }
}
</script>

<style module lang="scss">
.content {
    background-color: #fff;
}

</style>
