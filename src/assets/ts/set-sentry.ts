import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Vue from 'vue'
const {
    VUE_APP_VERSION,
    NODE_ENV,
    VUE_APP_MODEL
} = process.env
console.log('version:', VUE_APP_VERSION)

/**
 * 初始化sentry
 * @param getters {Object}
 * @return {null|Event}
 */
export default function (getters: any) {
    if (!getters) return
    // 只有生产环境才启用日志
    if (NODE_ENV === VUE_APP_MODEL) {
        Sentry.init({
            dsn: 'https://ccd60edf247e405589fa32a3c1e4d6d9@frontlog.youpenglai.com/3',
            // 对应发布的版本号，这个版本号取自package.json中配置的版本号
            release: VUE_APP_VERSION,
            // 面包屑最大数量
            maxBreadcrumbs: 30,
            // VUE 集成
            integrations: [
                new Integrations.Vue({
                    Vue,
                    // 是否把错误打印到控制台
                    logErrors: false,
                    // Passing in attachProps is optional and is true if it is not provided. If you set it to false, Sentry will suppress sending all Vue components’ props for logging.
                    attachProps: true
                })
            ],
            beforeSend (event: any) {
                if (!event) {
                    return null
                }
                if ('message' in event && (!event.message || event.message === 'cancel')) {
                    return null
                }
                if (event.exception.values.some((item: any) => item.type === 'ResponseError')) {
                    event.fingerprint = ['response-error']
                    event.level = 'warning'
                }
                return event
            }
        })
        const { userId, agencyCode, bindPhone, currentRoleCode, currentStep, mallNumber: mallId, mallName, mallUrl, appId } = getters
        Sentry.setUser({
            id: userId,
            username: mallName
        })
        // 添加标签，以便搜索
        Sentry.setTags({
            mallName,
            mallUrl,
            appId,
            agencyCode,
            mallId,
            bindPhone,
            currentStep,
            currentRoleCode
        })
    }
}
