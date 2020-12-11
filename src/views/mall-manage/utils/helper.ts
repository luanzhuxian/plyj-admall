/* eslint-disable no-underscore-dangle */

import moment from 'moment'
import Vue from 'vue'
import { TemplateModuleItem } from './types'
import { ActivityStatus } from './map'

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)
export const isPlainObject = <T>(val: unknown): val is T => toTypeString(val) === '[object Object]'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isNumberOrString = (val: any) => {
    // isNaN()把''、null按照0来处理，所以先去除，
    if (val === '' || val === null || val === undefined) {
        return false
    }
    if (typeof val === 'boolean') {
        return false
    }
    if (typeof val === 'string') {
        val = Number(val)
    }
    return !isNaN(val)
}

export const isEmpty = (data: any[] | DynamicObject) => {
    if (!data) {
        return true
    }

    // 数组是否为空
    if (data instanceof Array) {
        return !data.length
    }

    // 对象是否为空，对象所有字段是否为空
    if ((data as DynamicObject) instanceof Object) {
        const keys = Object.keys(data)
        if (!keys.length) {
            return true
        }
        for (const key of keys) {
            if (data[key] === '' || data[key] === null || data[key] === undefined) {
                continue
            } else {
                return false
            }
        }
        return true
    }
}

export const getPrice = <T extends object, U extends keyof T> (list: T[]) => (key: U) => {
    const arr = list.map(item => item[key]).filter(val => isNumberOrString(val))
        .map(val => Number(val))
    return key === 'originalPrice' ? Math.max(...arr) : Math.min(...arr)
}

export const getDate = (val: string, format: string) => {
    if (!val) return
    return moment(val).format(format)
}

export const getTime = ({ activityStartTime, activityEndTime, startTime, endTime, status }: { activityStartTime?: string; activityEndTime?: string; startTime?: string; endTime?: string; status: number }) => {
    // 0: 未开始 1: 进行中
    const startTs = moment(activityStartTime || startTime).valueOf()
    const endTs = moment(activityEndTime || endTime).valueOf()
    let ts = 0
    if (status === ActivityStatus.NotStarted) {
        ts = startTs
    } else if (status === ActivityStatus.Started) {
        ts = endTs
    }
    return ts
}

export const getDuration = (activity: { activityStartTime?: string; activityEndTime?: string; startTime?: string; endTime?: string; status: number }) => {
    const duration = Date.now().valueOf() - getTime(activity)
    return Math.abs(duration)
}

export const reset = (item: TemplateModuleItem) => {
    if (isPlainObject<DynamicObject>(item.goodsInfo) && !(item.goodsInfo instanceof Array)) {
        if (!Reflect.has(item.goodsInfo, 'activityInfo')) return false

        if (item.goodsInfo.activityInfo.status === ActivityStatus.NotStarted) {
            item.goodsInfo.activityInfo.status = ActivityStatus.Started
        } else if (item.goodsInfo.activityInfo.status === ActivityStatus.Started) {
            item.goodsInfo.activityInfo.status = ActivityStatus.Finished
        }
    }
}

export const getBtnText = ({ isOpenSale, regularSaleTime = '' }: { isOpenSale: number; regularSaleTime: string }) => {
    let text = '立即订购'
    if (isOpenSale === 1) {
        const saleTime = new Date(regularSaleTime).valueOf()
        if (saleTime > Date.now()) {
            text = '即将开售'
        }
    }
    return text
}

export const sub = (arg1: number, arg2: number) => {
    let r1
    let r2
    try {
        r1 = arg1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    const m = Math.pow(10, Math.max(r1, r2))
    const n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

export const multiply = (...args: number[]) => args.reduce((acc, current) => {
    let m = 0
    const s1 = current.toString()
    const s2 = acc.toString()
    try { m += s1.split('.')[1].length } catch (e) {}
    try { m += s2.split('.')[1].length } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
})

export const getTotalPrice = (item: TemplateModuleItem) => {
    if (isPlainObject<DynamicObject>(item.goodsInfo) && !(item.goodsInfo instanceof Array)) {
        if (item.goodsInfo.activityInfo.activityPrice >= item.goodsInfo.activityInfo.skuPrice) {
            return item.goodsInfo.activityInfo.price
        }

        return sub(Number(item.goodsInfo.activityInfo.skuPrice), Number(sub(Number(item.goodsInfo.activityInfo.activityPrice), Number(item.goodsInfo.activityInfo.price))))
    }
}

export const findBrothersComponents = (ctx: Vue, componentName: string, exceptMe = true) => {
    // @ts-ignore
    // 打包压缩后组件的名称会被更改，所以通过在组件 data 上添加 name 的方式来找到组件
    const list = ctx.$parent.$children.filter(item => item?.$options?.name === componentName || item.name === componentName)
    // @ts-ignore
    const index = list.findIndex(item => item._uid === ctx._uid)
    if (exceptMe && index !== -1) {
        list.splice(index, 1)
    }
    return list
}

// 单位转换：分转元
export const fenToYuan = function (num: number) {
    const regexp = /(?:\.0*|(\.\d+?)0+)$/
    let numStr = (num / 100).toFixed(2)
    numStr = numStr.replace(regexp, '$1')
    return Number(numStr)
}
