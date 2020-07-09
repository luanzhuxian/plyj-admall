import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
    dateFrom (val) {
        if (val) {
            return moment(val).calendar(null, {
                sameElse: 'YYYY-MM-DD'
            })
        }
        return ''
    },
    dateFormat (val, format) {
        if (!val) return ''
        return moment(val).format(format)
    }
}
