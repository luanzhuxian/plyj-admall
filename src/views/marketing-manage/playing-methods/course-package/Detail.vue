<template>
    <div :class="$style.detail">
        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情', name:'CoursePackageDetailInfo'},
                {label:'活动数据', name:'CoursePackageDetailData'},
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
  .detail {
    background: #fff;
      padding: 0 30px 30px;
  }
</style>
