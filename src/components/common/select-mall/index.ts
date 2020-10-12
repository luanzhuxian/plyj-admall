import SelectMall from './Main.vue'
import Vue from 'vue'
const SelectMallClass = Vue.extend(SelectMall)
interface SelectMallInterface {
    show: boolean;
    $el: HTMLElement;
    formatAgencyList: () => any[];
    $on: Function;
    agencyList: any[];
    roleMap: any;
}
/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-promise-reject-errors */
const select = (agencyList: any[], roleMap: DynamicObject): Promise<DynamicObject> => new Promise(async (resolve, reject) => {
    const Instance: SelectMallInterface = new SelectMallClass({
        el: document.createElement('div')
    })
    Instance.agencyList = agencyList
    Instance.roleMap = roleMap
    // 如果只有一个商城，且是这个商城的企业管理员，则不弹出选择框
    if (agencyList.length === 1 && agencyList.some(item => item.roleCode === 'ENTERPRISE_ADMIN')) {
        const mallList = Instance.formatAgencyList()
        resolve(mallList[0])
        return
    }
    document.body.appendChild(Instance.$el)
    Instance.$on('confirm', (mall: any) => {
        resolve(mall)
    })
    Instance.$on('close', () => {
        reject('close')
    })
    Instance.show = true
})
export default select
