import moment from 'moment'
import 'moment/locale/zh-cn'
interface Filter {
    [key: string]: (arg1: string, arg2: string) => string | number;
}
export default {
    dateFrom (val) {
        if (val) {
            return moment(val).calendar('', {
                sameElse: 'YYYY-MM-DD'
            })
        }
        return '--'
    },
    dateFormat (val, format) {
        if (!val) return ''
        return moment(val).format(format)
    },
    // 审核状态该
    agencyStatus (val: agencyStatusType) {
        const STATUS = {
            AUTHENTICATE: '已认证',
            AUDITING: '审核中',
            AUTH_FAIL: '认证失败',
            MICRO_NOT_UPGRADE: '小微商户未升级',
            MICRO_NOT_APPLY: '小微商户未申请',
            MP_NOT_AUTHORIZED: '微信公众号未授权给朋来雅集',
            MALL_NOT_COMPLETED: '注册B端账号，商城信息未完善'
        }
        return STATUS[val] || ''
    },
    // 隐藏账号中间几个字符
    formatAccount (str) {
        if (!str) return ''
        if (str.length < 8) {
            return str.replace(/(.)(.+)(.)/, '$1*****$3')
        }
        return str.replace(/(.{3})(.{4})(.+)/, '$1****$3')
    }
} as Filter
