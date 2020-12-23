import { getStateMachine, getModulesUpdater, ModulesUpdater } from './module-updater'
import {
    updateBanner,
    updateCatagoryProduct,
    updatePackage,
    updateDistribution,
    updateOnlineCourse,
    updateCoupon,
    updateRedPackage,
    updatePintuanYugou,
    updateMiaosha
} from './methods'
import {
    TemplateCrosses,
    TemplateModule
} from '../types'
import { ModuleTypes } from '../map'

const iniStateMachine = () => getStateMachine({
    methods: {
        is (id: string | number) {
            return this.current.moduleType === id || this.current.moduleName === id
        },
        find (id: string | number) {
            return this.list.find((item: ModulesUpdater) => item.moduleType === id || item.moduleName === id)
        },
        switch (id: string | number) {
            const current: ModulesUpdater = this.find(id)
            if (current) {
                this.current = current
                this.currentModuleType = current.moduleType
                this.currentModuleName = current.moduleName
            }
        }
        // update () {
        //     if (this.current) {
        //         this.current.update()
        //     }
        // }
    }
})

/**
 * 生成状态机
 * 为某个模板的所有模块生成对应的 ModuleUpdater，并存入状态机返回
 * @param {number} type 模板 type
 * @param {object} modules 当前模板 modules 集合
 * @return {object} StateMachine
 */
export const initModuleUpdater = (modules: TemplateCrosses | {}) => {
    const stateMachine = iniStateMachine()
    let module: TemplateModule
    let updater: ModulesUpdater
    for (const name of Object.getOwnPropertyNames(modules)) {
        // @ts-ignore
        module = modules[name]
        // 首页模块
        if (module.moduleType === ModuleTypes.Banner) {
            const moduleName = module.sort === 2 ? 'Adv' : 'Banner'
            updater = getModulesUpdater(module, moduleName, updateBanner)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.Popular) {
            updater = getModulesUpdater(module, 'Popular', updateCatagoryProduct)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.Class) {
            updater = getModulesUpdater(module, 'Class', updateCatagoryProduct)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.Package) {
            updater = getModulesUpdater(module, 'Package', updatePackage)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.Distribution) {
            updater = getModulesUpdater(module, 'Distribution', updateDistribution)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.SingleCourse) {
            updater = getModulesUpdater(module, 'SingleCourse', updateOnlineCourse)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.SeriesCourse) {
            updater = getModulesUpdater(module, 'SeriesCourse', updateOnlineCourse)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.ImageText) {
            updater = getModulesUpdater(module, 'ImageText', updateOnlineCourse)
            stateMachine.add(updater)
        }
        // 主会场模块
        if (module.moduleType === ModuleTypes.Coupon) {
            updater = getModulesUpdater(module, 'Coupon', updateCoupon)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.RedPackage) {
            updater = getModulesUpdater(module, 'RedPackage', updateRedPackage)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.Pintuan) {
            updater = getModulesUpdater(module, 'Pintuan', updatePintuanYugou)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.Yugou) {
            updater = getModulesUpdater(module, 'Yugou', updatePintuanYugou)
            stateMachine.add(updater)
        }
        if (module.moduleType === ModuleTypes.Miaosha) {
            updater = getModulesUpdater(module, 'Miaosha', updateMiaosha)
            stateMachine.add(updater)
        }
    }

    return stateMachine
}
