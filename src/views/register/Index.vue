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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Vcode from 'vue-puzzle-vcode'
import { namespace } from 'vuex-class'
import { SessionEnum } from '@/enum/storage'
import { MutationTypes } from '@/store/mutation-type'

interface CodeShowFooType {
    type: boolean;
    name: string;
}
Component.registerHooks([
    'beforeRouteLeave'
])
const userModule = namespace('user')
    @Component({
        components: {
            Vcode
        }
    })
export default class RegisterIndex extends Vue {
        toName = ''
        @userModule.Mutation(MutationTypes.setCodePass) setCodePass!: Function
        @userModule.Mutation(MutationTypes.setCodeShow) setCodeShow!: Function
        @userModule.Mutation(MutationTypes.logout) logout!: Function
        @userModule.Action(MutationTypes.getAllMallInfo) getAllMallInfo!: Function
        @userModule.Action(MutationTypes.getAgencyList) getAgencyList!: Function
        @userModule.Action('selectMall') selectMall!: Function
        @userModule.Getter('codeImg') codeImg!: any
        @userModule.Getter('codeShow') codeShow!: boolean

        async login () {
            try {
                await this.getAgencyList()
                await this.selectMall()
                await this.getAllMallInfo()
                await this.$router.replace({ name: 'Home' })
            } catch (e) {
                throw e
            }
        }

        async success () {
            this.setCodePass(true)
            this.setCodeShow(false)
            await (this.$refs.child as HTMLFormElement).getCode()
        }

        clearCode () {
            sessionStorage.removeItem(SessionEnum.redirectCode)
            sessionStorage.removeItem(SessionEnum.redirectState)
            sessionStorage.removeItem(SessionEnum.loginState)
        }

        close () {
            this.setCodePass(false)
            this.setCodeShow(false)
        }

        beforeRouteLeave (to: any, from: any, next: any): void {
            this.toName = to.name
            next()
        }

        destroyed (): void {
            if (this.toName !== 'WxBindPhone') this.clearCode()
        }
}
</script>

<style module lang="scss">
    .login{
        height: calc(100vh - 80px);
        /*display: flex;*/
        /*flex-direction: row;*/
        /*align-items: center;*/
        background-color: #ffffff;
        .login-top{
            width: 100vw;
            height: 80px;
            display: flex;
            align-items: center;
            padding-left: 18%;
        }
        .login-body{
            width: 100vw;
            height: calc(100vh - 80px);
            background: #F5F6FA;
            display: flex;
            justify-content: center;
            padding-top: 4%;
        }
    }
</style>
