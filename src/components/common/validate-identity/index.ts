import ValidateIdentityComponent from './Main.vue'
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
    Instance.show = true
    Instance.mobile = mobile
    document.body.appendChild(Instance.$el)
    return new Promise((resolve, reject) => {
        Instance.$on('close', () => {
            reject(false)
        })
        Instance.$on('passed', () => {
            resolve(true)
        })
    })
}
export default validate
