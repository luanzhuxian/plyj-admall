<template>
    <div :class="$style.login">
        <div :class="$style.loginBody">
            <div :class="$style.loginBg">
                <router-view ref="child" @emitLogin="login" />
            </div>
        </div>
        <Vcode :imgs="codeImg" :show="codeShow" @success="success" @close="close" />
    </div>
</template>

<script lang=ts>
import { Component, Vue, Watch } from 'vue-property-decorator'
import Vcode from 'vue-puzzle-vcode'
import { namespace } from 'vuex-class'
import { SessionEnum } from '@/enum/storage'
import { MutationTypes } from '@/store/mutation-type'
const userModule = namespace('user')
interface CodeShowFooType {
    type: boolean;
    name: string;
}
Component.registerHooks([
    'beforeRouteLeave'
])
@Component({
    components: {
        Vcode
    }
})
export default class Login extends Vue {
    toName= ''
    routerName = ''
    @userModule.Mutation(MutationTypes.logout) logout!: Function
    @userModule.Mutation(MutationTypes.setCodePass) setCodePass!: Function
    @userModule.Mutation(MutationTypes.setCodeShow) setCodeShow!: Function
    @userModule.Action(MutationTypes.getAllMallInfo) getAllMallInfo!: Function
    @userModule.Action(MutationTypes.getAgencyList) getAgencyList!: Function
    @userModule.Action('selectMall') selectMall!: Function
    @userModule.Getter('codeImg') codeImg!: any
    @userModule.Getter('codeShow') codeShow!: boolean

    @Watch('$route.name', { immediate: true })
    onChangeValue (newVal: string) {
        this.routerName = newVal
    }

    async login () {
        try {
            await this.getAgencyList()
            await this.selectMall()
            await this.getAllMallInfo()
            this.$router.replace({ name: 'Home' })
        } catch (e) {
            this.logout()
            throw e
        }
    }

    async success () {
        this.setCodePass(true)
        this.setCodeShow(false)
        if (this.routerName === 'PasswordLogin') {
            await (this.$refs.child as HTMLFormElement).login()
        } else {
            await (this.$refs.child as HTMLFormElement).getCode()
        }
    }

    close () {
        this.setCodePass(false)
        this.setCodeShow(false)
    }

    clearCode () {
        sessionStorage.removeItem(SessionEnum.redirectCode)
        sessionStorage.removeItem(SessionEnum.redirectState)
        sessionStorage.removeItem('login_state')
    }

    beforeRouteLeave (to: any, from: any, next: any): void {
        this.toName = to.name
        next()
    }

    destroyed (): void {
        if (this.toName !== 'WxBindPhone' && this.toName !== 'RegisterAccount') this.clearCode()
    }
}
</script>

<style module lang="scss">
    .login {
        .login-body{
            height: calc(100vh - 80px);
            position: relative;
            background: url("https://mallcdn.youpenglai.com/static/admall-new/3.0.0/new-login-bg.jpg");
            background-size: cover;
            .login-bg {
                position: absolute;
                right: 17%;
                top: 21%;
                margin-right: 10px;
            }
        }
    }
</style>
