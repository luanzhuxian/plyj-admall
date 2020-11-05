<template>
    <div :class="$style.library" class="wrap">
        <router-view :key="$route.path" :class="$style.libraryContainer" />
    </div>
</template>

<script>
export default {
    name: 'Library'
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
