<template>
    <div class="detail wrap">
        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情', name:'CoursePackageDetailInfo'},
                {label:'活动数据', name:'CoursePackageDetailData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div :class="$style.content">
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CoursePackageDetail',
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
