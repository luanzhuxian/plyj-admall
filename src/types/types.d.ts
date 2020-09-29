import { RawLocation, Route as ExportRoute } from 'vue-router/types/router'
import Vue from 'vue'
declare global {
    // 短信类型
    export type SmsType = 'ACCOUNT_BIND_PHONE_NUMBER' | 'AGENT_USER_LOGIN' | 'AGENCY_MOBILE_REGISTER' | 'AGENCY_MOBILE_PASSWD_REST'
    export type agencyStatusType = 'AUTHENTICATE' | 'AUDITING' | 'AUTH_FAIL' | 'MICRO_NOT_UPGRADE' | 'MICRO_NOT_APPLY' | 'MP_NOT_AUTHORIZED' | 'MALL_NOT_COMPLETED'
    // Route
    export type RouteNext = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void
    export type Route = ExportRoute
}
