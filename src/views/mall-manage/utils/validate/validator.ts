/* eslint-disable no-proto */
/* eslint-disable func-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { Lengthwise, Range } from './types'
// import { TemplateModule, TemplateModuleItem } from '../types'

// TODO: ts DynamicObject
export const methods: DynamicObject = {
    required (value: any) {
        if (value == null) {
            return false
        }
        if (typeof value === 'boolean') {
            return !0
        }
        if (typeof value === 'number') {
            value = value.toString()
        }
        return value.length > 0
    },
    checkType (value: number) {
        return ~[1, 2].indexOf(value)
    },
    isLength (value: Lengthwise, { min, max }: Range) {
        return value.length <= max && value.length >= min
    },
    max (value: number, max: number) {
        return value <= max && value > 0 && /^(0|\+?[1-9][0-9]*)$/.test(String(value))
    },
    isEmpty (obj: { image: string; name: string; value: string }) {
        return !obj.image && !obj.name && !obj.value
    }
}

class Validator {
    data: DynamicObject
    constructor () {
        this.data = {}
    }

    // 沿原型链找出属性名
    // TODO: ts DynamicObject
    _findKeys (instance: DynamicObject, { prefix, Type, filter }: { prefix?: string; Type?: Function; filter?: Function }) {
        // TODO: ts (key as string)
        function _shouldKeep (key: string | number | symbol) {
            if (filter) {
                if (filter(key)) {
                    return true
                }
            }

            if (prefix) {
                if ((key as string).startsWith(prefix)) {
                    return true
                }
            }

            if (Type) {
                if (instance[(key as string)] instanceof Type) {
                    return true
                }
            }

            return false
        }

        function _find (instance: DynamicObject): (string | number | symbol)[] {
            if (instance.__proto__ === null) {
                return []
            }

            let keys = Reflect.ownKeys(instance)
            keys = keys.filter(key => _shouldKeep(key))

            return [...keys, ..._find(instance.__proto__)]
        }

        return _find(instance)
    }

    // 过滤属性名，属性值必须是包含 Rule 的数组，或是以 customValidate 开头的方法名
    // TODO: ts (this as any)
    _findKeysFilter (key: string) {
        if (/customValidate([A-Z])\w+/g.test(key)) {
            return true
        }
        if ((this as any)[key] instanceof Array) {
            if (!(this as any)[key].length) {
                return false
            }
            for (const value of (this as any)[key]) {
                const isRuleType = value instanceof Rule
                if (!isRuleType) {
                    return false
                }
            }
            return true
        }
        return false
    }

    async validate (data: DynamicObject) {
        this.data = JSON.parse(JSON.stringify(data))
        let result
        const errorMsgs = []
        const memberKeys = this._findKeys(this, {
            filter: this._findKeysFilter.bind(this)
        })

        for (const key of memberKeys) {
            result = await this._check(key, this.data[key as string])
            if (result instanceof RuleResult) {
                if (!result.pass) {
                    errorMsgs.push(result.msg)
                }
            }
        }
        if (errorMsgs.length) {
            throw new Error(errorMsgs[0])
        }
        return result
    }

    async _check (key: string | number | symbol, field: any) {
        const isFunction = typeof ((this as any)[key]) === 'function'
        let result
        // 函数验证
        if (isFunction) {
            try {
                result = new RuleFieldResult(true, '')
                result.value = await (this as any)[key](this.data)
            } catch (error) {
                result = new RuleResult(false, error.msg || error.message || '出错了')
            }
        } else if ((this as any)[key] instanceof Array) {
            // 属性验证, 数组，内有一组Rule
            const rules = (this as any)[key]
            const ruleField = new RuleField(rules)

            result = ruleField.validate(field)
            // result.msg = result.pass ? 'ok' : result.msg
        }
        return result
    }
}

class RuleResult {
    pass: boolean
    msg: string
    constructor (pass: boolean, msg = '') {
        // Object.assign(this, {
        //     pass,
        //     msg
        // })
        this.pass = pass
        this.msg = msg
    }
}

class RuleFieldResult extends RuleResult {
    value: any
    constructor (pass: boolean, msg = '', value = null) {
        super(pass, msg)
        this.value = value
    }
}

class Rule {
    name: string
    msg?: string
    params: any[]
    constructor (name: string, msg?: string, ...params: any[]) {
        this.name = name
        this.msg = msg
        this.params = params
        // Object.assign(this, {
        //     name,
        //     msg,
        //     params
        // })
    }

    validate (field: any) {
        if (this.name === 'isOptional') {
            return new RuleResult(true)
        }

        if (!methods[this.name](field, ...this.params)) {
            return new RuleResult(false, this.msg || '出错了')
        }

        return new RuleResult(true, '')
    }
}

class RuleField {
    rules: Rule[]
    constructor (rules: Rule[]) {
        this.rules = rules
    }

    validate (field: any) {
        if (field == null) {
            const allowEmpty = this._allowEmpty()
            const defaultValue = this._hasDefault()
            if (allowEmpty) {
                return new RuleFieldResult(true, '', defaultValue)
            }
            // return new RuleFieldResult(false, '字段不能为空')
        }

        const filedResult = new RuleFieldResult(false)
        for (const rule of this.rules) {
            const result = rule.validate(field)
            if (!result.pass) {
                filedResult.msg = result.msg
                filedResult.value = null
                return filedResult
            }
        }
        return new RuleFieldResult(true, '', this._convert(field))
    }

    _convert (value: any) {
        for (const rule of this.rules) {
            if (rule.name === 'isInt') {
                return parseInt(value)
            }
            if (rule.name === 'isFloat') {
                return parseFloat(value)
            }
            if (rule.name === 'isBoolean') {
                return !!value
            }
        }
        return value
    }

    // 是否是必填项
    _allowEmpty () {
        for (const rule of this.rules) {
            if (rule.name === 'isOptional') {
                return true
            }
        }
        return false
    }

    // 是否有默认值
    _hasDefault () {
        for (const rule of this.rules) {
            const defaultValue = rule.params[0]
            if (rule.name === 'isOptional') {
                return defaultValue
            }
        }
    }
}

export {
    Rule,
    RuleResult,
    Validator
}
