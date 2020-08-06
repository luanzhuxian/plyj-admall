import moment from 'moment'
import 'moment/locale/zh-cn'
interface Filter {
    [key: string]: (arg1: string, arg2: string) => string
}
export default {
    dateFrom (val) {
        if (val) {
            return moment(val).calendar('', {
                sameElse: 'YYYY-MM-DD'
            })
        }
        return ''
    },
    dateFormat (val, format) {
        if (!val) return ''
        return moment(val).format(format)
    }
} as Filter
