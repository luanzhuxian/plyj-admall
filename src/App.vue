<template>
    <div id="main-app">
        <router-link to="/admall/login">v2</router-link>
        <router-view v-show="$route.name" />
        <!-- 子应用渲染区 -->
        <section id="child-app" v-show="!$route.name" />
    </div>
</template>
<script>
export default {
    name: 'App',
    components: {
    },
    data () {
        return {
        }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
    }
}
</script>
