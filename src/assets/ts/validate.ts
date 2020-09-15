/**
 * Created by jiachenpan on 16/11/18.
 */

/* 合法uri */
import { codePointNo } from './utils'

export const validateURL = (text: string) => {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(text)
}

// 字母汉字数字
export const validateStr = (str: string) => /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(str)

// 姓名检查
export const isName = (name: string) => {
    if (codePointNo(name) <= 20) {
        return /^[a-zA-Z_\u4e00-\u9fa5\\-]{2,20}$/.test(name)
    }
    return false
}

/* 小写字母 */
export const validateLowerCase = (str: string) => /^[a-z]+$/.test(str)

// 钱数
export const isMoney = (val: string) => /^\d+(\.\d{1,2})?$/.test(val)

// 重量kg
export const isWeight = (val: string) => /^\d+(\.\d{1,2})?$/.test(val)

// 体积
export const isVolume = (val: string) => /^\d+(\.\d{1,2})?$/.test(val)

// 正整数
export const isPositiveInteger = (val: string) => /^[+]{0,1}(\d+)$/.test(val)

// 正数
export const isPositive = (val: string) => /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)

/* 大写字母 */
export const validateUpperCase = (str: string) => /^[A-Z]+$/.test(str)

/* 大小写字母 */
export const validatAlphabets = (str: string) => /^[A-Za-z]+$/.test(str)

// 校验手机号和固定电话
export const isTelNumber = (str: string) => /^(1[0-9]{10})$|^(\d{10})$|^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/.test(str)

export const isPhone = (val: string) => /^1[0-9]{10}$/.test(val)

// 校验快递单号
export const isExpressNumber = (str: string) => /^[0-9a-zA-Z]+$/.test(str)

// 判断身份证号码是否正确
export const isIdCard = (val: string | number) => {
    if (typeof val !== 'string' && typeof val !== 'number') {
        return false
    }
    if (typeof val === 'number') {
        val = `${ val }`
    }

    const regexCheck = /^\d{15}$/.test(val) || /^\d{18}$/.test(val) || /^\d{17}[xX]$/.test(val)
    if (!regexCheck) {
        return false
    }

    if (val.length === 15) {
    // 6位地区编码，2位年，2位月，2位日，3位序号。
    // const year = val.substr(6, 2)
        const month = parseInt(val.substr(8, 2))
        const day = parseInt(val.substr(10, 2))
        if (month < 1 || month > 12) {
            return false
        }
        if (day < 1 || day > 31) {
            return false
        }
        return true
    } else if (val.length === 18) {
    // 6位地区编码，4位年，2位月，2位日，3位序号，1位校验号。
    // 年
        const year = parseInt(val.substr(6, 4))
        if (year < 1900 || year > new Date().getFullYear()) {
            return false
        }

        // 月
        const month = parseInt(val.substr(10, 2))
        if (month < 1 || month > 12) {
            return false
        }

        // 日
        const day = parseInt(val.substr(12, 2))
        if (day < 1 || day > 31) {
            return false
        }

        const ratio = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        const mark = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2']
        let calculate = 0
        for (let i = 0; i < val.length - 1; i++) {
            calculate += parseInt(val[i]) * ratio[i]
        }
        const mod = calculate % 11
        return val[val.length - 1].toLowerCase() === mark[mod]
    }

    return false
}

// 判断账号长度与组合是否正确
export const isAccount = (val: string) => /^[\da-zA-Z_@.]{6,50}$/.test(val)

// 判断统一社会信用编码
export const isCreditNumber = (code: string) => /^([a-zA-Z0-9]{13}|[a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})$/.test(code)

/* 适用于element-ui 表单组件验证的方法 */
export const testPhone = (rule: any, value: any, callback: Function) => {
    if (!isPhone(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

/* 适用于element-ui 表单组件验证的方法 */
export const testName = (rule: any, value: any, callback: Function) => {
    if (!isName(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

export const testAccount = (rule: any, value: any, callback: Function) => {
    if (!isAccount(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

export const testIdCard = (rule: any, value: any, callback: Function) => {
    if (!isIdCard(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

export const testPhoneNumber = (rule: any, value: any, callback: Function) => {
    if (!value) {
        return callback()
    }
    if (!/^\d{3,5}-\d{7,8}$/.test(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

/* 统一社会信用编码 */
export const testCreditNumber = (rule: any, value: any, callback: Function) => {
    if (!isCreditNumber(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

/* 店铺名称检测 长度15字节以内 */
export const testMallName = (rule: any, value: any, callback: Function) => {
    if (value.length > 15) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

export const testProductOptions = (rule: any, value: any, callback: Function) => {
    if (value.length === 0) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

// 检测货币位数
export const testMoney = (rule: any, value: any, callback: Function) => {
    if (isMoney(value)) {
        callback()
    } else {
        callback(new Error(rule.message))
    }
}

// 检测重量kg单位
export const testWeight = (rule: any, value: any, callback: Function) => {
    if (isWeight(value) && value > 0) {
        callback()
    } else {
        callback(new Error(rule.message))
    }
}

export const testPositiveInteger = (rule: any, value: any, callback: Function) => {
    if (isPositiveInteger(value)) {
        callback()
    } else {
        callback(new Error(rule.message))
    }
}

export const testHasImages = (rule: any, value: any, callback: Function) => {
    if (value.length === 0) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}
export const testHasElement = (rule: any, value: any, callback: Function) => {
    if (value.length === 0) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

export const testOptionName = (max: number) => (rule: any, value: any, callback: Function) => {
    const num = codePointNo(value)
    if (num > max) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

/**
 * 校验长度
 * @param maxLength {number} 最大长度
 * @return {const}
 */
export const checkLength = (maxLength: number) => (rule: any, value: any, callback: Function) => {
    const len = String(value).length
    if (len > maxLength) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

// 物流单号
export const testExpressNumber = (rule: any, value: any, callback: Function) => {
    if (isExpressNumber(value)) {
        callback()
    } else {
        callback(new Error(rule.message))
    }
}

// 分类字数
export const testCategory = (len: number) => (rule: any, value: any, callback: Function) => {
    const valLen = codePointNo(value)
    if (valLen > len) {
        callback(new Error(rule.message))
        return
    }
    callback()
    // if (!/^[\u4e00-\u9fa5|A-Za-z|\d]+$/.test(value)) {
    //   callback(new Error(rule.message))
    // } else {
    //   callback()
    // }
}

/**
 * 检查数字
 * @param max {number} 最大值
 * @param min {number} 最小值
 * @param decimals {number} 允许的小数位数
 */
export const checkNumber = (max: number, min: number, decimals: number) => (rule: object, value: any, callback: Function) => {
    if (Number.isNaN(Number(value))) {
        callback(new Error('必须是数字'))
        return
    }
    if (Number(value) > max) {
        callback(new Error(`最大值为${ max }`))
        return
    }
    if (Number(value) < min) {
        callback(new Error(`最小值为${ min }`))
        return
    }
    if (decimals !== undefined) {
        const dec = String(value).split('.')[1] || ''
        if (dec && decimals === 0) {
            callback(new Error('必须是整数'))
            return
        }
        if (dec && dec.length > decimals) {
            callback(new Error(`只允许保留${ decimals }位小数`))
            return
        }
    }
    callback()
}
// 获取字符串中汉字的数量
export const getChineseCount = (string = '') => {
    const strArr = string.split('')
    const reg = /[\u4e00-\u9fa5]/
    let count = 0
    for (const str of strArr) {
        if (reg.test(str)) {
            count++
        }
    }
    return count
}
// 获取字符串非汉字的数量
export const getNotChineseCount = (string = '') => {
    const strArr = string.split('')
    const reg = /[\u4e00-\u9fa5]/
    let count = 0
    for (const str of strArr) {
        if (!reg.test(str)) {
            count++
        }
    }
    return count
}
