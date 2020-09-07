<template>
    <div>
        <phoneLogin />
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import phoneLogin from './components/Phone-Login'
import wxLogin from './components/Wx-Login'
import passwordLogin from './components/Password-Login'
    @Component({
        components: {
            phoneLogin,
            wxLogin,
            passwordLogin
        }
    })
export default class Login extends Vue {

}
</script>

<style module lang="scss">

</style>
