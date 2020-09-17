<template>
    <div class="marketingManage wrap">
        <keep-alive :exclude="['AddHelperMarketing']">
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'MarketingManagement'
}
</script>
