/**
 * 发送验证码以校验身份
 */
import ValidateIdentityComponent from './Main.vue'
import { sessionEnum } from '../../../enum/storage'
import Vue from 'vue'
interface ValidateIdentityClass {
    show: boolean;
    mobile: string;
    $el: HTMLElement;
    $on: Function;
}
const ValidateIdentityClass = Vue.extend(ValidateIdentityComponent)

/* eslint-disable prefer-promise-reject-errors */
const validate = (mobile: string) => {
    const Instance: ValidateIdentityClass = new ValidateIdentityClass({
        el: document.createElement('div')
    })
    Instance.mobile = mobile
    document.body.appendChild(Instance.$el)
    return new Promise((resolve, reject) => {
        const TIME = Number(sessionStorage.getItem(sessionEnum.validateIdentityTime)) || 0
        // 如果校验的时间未超过30分钟，则本次不校验
        if (Date.now() - TIME < 30 * 1000 * 60) {
            resolve(true)
            return
        }
        Instance.show = true
        Instance.$on('close', () => {
            reject(false)
        })
        Instance.$on('passed', () => {
            resolve(true)
            sessionStorage.setItem(sessionEnum.validateIdentityTime, String(Date.now()))
        })
    })
}
export default validate
