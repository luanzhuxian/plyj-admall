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

const initModulesUpdater = () => getStateMachine({
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
 * @param {number} type 模板 type
 * @param {object} modules 当前模板 modules 集合
 * @return {object} StateMachine
 */
export const initModuleUpdater = (modules: TemplateCrosses | {}) => {
    const modulesUpdater = initModulesUpdater()
    let module: TemplateModule
    let updater: ModulesUpdater
    for (const name of Object.getOwnPropertyNames(modules)) {
        // @ts-ignore
        module = modules[name]
        // 首页模块
        if (module.moduleType === ModuleTypes.Banner) {
            updater = getModulesUpdater(module, 'Banner', updateBanner)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.Popular) {
            updater = getModulesUpdater(module, 'Popular', updateCatagoryProduct)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.Class) {
            updater = getModulesUpdater(module, 'Class', updateCatagoryProduct)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.Package) {
            updater = getModulesUpdater(module, 'Package', updatePackage)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.Distribution) {
            updater = getModulesUpdater(module, 'Distribution', updateDistribution)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.SingleCourse) {
            updater = getModulesUpdater(module, 'SingleCourse', updateOnlineCourse)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.SeriesCourse) {
            updater = getModulesUpdater(module, 'SeriesCourse', updateOnlineCourse)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.ImageText) {
            updater = getModulesUpdater(module, 'ImageText', updateOnlineCourse)
            modulesUpdater.add(updater)
        }
        // 主会场模块
        if (module.moduleType === ModuleTypes.Coupon) {
            updater = getModulesUpdater(module, 'Coupon', updateCoupon)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.RedPackage) {
            updater = getModulesUpdater(module, 'RedPackage', updateRedPackage)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.Pintuan) {
            updater = getModulesUpdater(module, 'Pintuan', updatePintuanYugou)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.Yugou) {
            updater = getModulesUpdater(module, 'Yugou', updatePintuanYugou)
            modulesUpdater.add(updater)
        }
        if (module.moduleType === ModuleTypes.Miaosha) {
            updater = getModulesUpdater(module, 'Miaosha', updateMiaosha)
            modulesUpdater.add(updater)
        }
    }

    return modulesUpdater
}
