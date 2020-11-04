import { RawLocation, Route as ExportRoute } from 'vue-router/types/router'
import Vue from 'vue'
declare global {
    // 短信类型
    export type SmsType = 'ACCOUNT_BIND_PHONE_NUMBER' | 'AGENT_USER_LOGIN' | 'AGENCY_MOBILE_REGISTER' | 'AGENCY_MOBILE_PASSWD_REST'
    export type agencyStatusType = 'AUTHENTICATE' | 'AUDITING' | 'AUTH_FAIL' | 'MICRO_NOT_UPGRADE' | 'MICRO_NOT_APPLY' | 'MP_NOT_AUTHORIZED' | 'MALL_NOT_COMPLETED'
    // Route
    export type RouteNext = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void
    export type Route = ExportRoute
    export type RouteConfig = {
        path: string;
        name: string;
        props?: boolean;
        redirect?: string;
        component?: () => Promise<any>;
        matched?: RouteConfig[],
        meta?: {
            // 路由标题
            title?: string;
            // 路由唯一标识
            index?: string;
            // 是否忽略该路由的鉴权
            ignore?: boolean;
            // 该权限菜单是否可配置 0 不可配置， 1 可配置（前端可以不写，写入后台menu.xml即可）
            status?: 0 | 1;
        };
        children?: RouteConfig[];
    }
}
