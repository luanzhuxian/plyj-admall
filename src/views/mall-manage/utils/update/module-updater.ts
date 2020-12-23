import { TemplateModule, UpdateData, UpdateFn } from '../types'

// 状态机
export class StateMachine {
    current!: any
    list: any[] = []
    constructor (options: DynamicObject) {
        let { methods, ...rest } = options
        methods = this.translateMethods(methods)
        Object.assign(this, rest)
        Object.assign(this, methods)

        return new Proxy(this, {
            get (target, key) {
                return Reflect.get(target, key)
            },
            set (target, key, value) {
                return Reflect.set(target, key, value)
            }
        })
    }

    add (...items: any[]) {
        Array.prototype.push.apply(this.list, items)
    }

    remove (key: string, val: string | number | boolean) {
        this.list = this.list.filter(item => (item[key] !== val))
    }

    // 以on开头的方法，以去除on的同名方法另外保存
    private translateMethods (methods: DynamicObject) {
        let newKey
        for (const key of Object.getOwnPropertyNames(methods)) {
            if (typeof methods[key] !== 'function') {
                continue
            }
            if (/on([A-Z])/g.test(key)) {
                newKey = key
                    .replace(/on/, '')
                    .replace(/[A-Z]/, c => c.toLowerCase())
                methods[newKey] = methods[key]
            }
        }
        return methods
    }
}

// 给模块添加数据
export class ModulesUpdater {
    data: TemplateModule
    moduleType: number
    moduleName: string
    constructor (data: TemplateModule, moduleName: string) {
        this.data = data
        this.moduleType = data.moduleType
        this.moduleName = moduleName || data.moduleName
    }
}

/**
 * 工厂函数
 * @param {object} options
 * @return {object} StateMachine
 */
export const getStateMachine = (options: DynamicObject) => new StateMachine(options)

/**
 * 工厂函数
 * @param {object} module 单个模块
 * @param {string} moduleName 模块名
 * @param {function} updateFn 更新函数
 * @return {object} ModulesUpdater
 */
export const getModulesUpdater = (module: TemplateModule, moduleName: string, updateFn: UpdateFn, args?: DynamicObject) => {
    class Updater extends ModulesUpdater {
        constructor (module: TemplateModule, moduleName: string) {
            super(module, moduleName)
            if (args) {
                Object.assign(args)
            }
        }

        update (updateData: UpdateData, tmplType: number) {
            updateFn(this.data, updateData, tmplType)
        }
    }
    return new Updater(module, moduleName)
}
