import { AxiosRequestConfig, AxiosStatic } from 'axios'
declare global {
    interface Uuid {
        v1: () => string;
    }
    interface ResponseData<T> {
        code: number;
        result: any;
        message: string;
        devMessage: string;
    }
    interface MyAxios extends AxiosStatic {
        request<T = any, R = ResponseData<T>> (config: AxiosRequestConfig): Promise<R>;
        get<T = any, R = ResponseData<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
        delete<T = any, R = ResponseData<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
        head<T = any, R = ResponseData<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
        options<T = any, R = ResponseData<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
        post<T = any, R = ResponseData<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
        put<T = any, R = ResponseData<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
        patch<T = any, R = ResponseData<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    }
    interface Window {
        uuid: Uuid;
        createObjectURL: Function;
        [key: string]: any;
        Qrcode: new(arg: {
        render: string;
        // 纠错级别
        correctLevel: 3;
        // 内容
        text: string;
        // 大小
        size: number;
        background: '#fff';
        foreground: '#000';
        pdground: '#000';
        }) => HTMLCanvasElement;
        WxLogin: new(arg: {
        self_redirect: boolean;
        id: string;
        appid: string;
        scope: 'snsapi_login';
        redirect_uri: string;
        state: string;
        style: string;
        href: '';
        }) => void;
    }
    // 短信类型
    type SmsType = 'ACCOUNT_BIND_PHONE_NUMBER' | 'AGENT_USER_LOGIN'

    // 动态属性的对象
    interface DynamicObject {
        [propName: string]: any;
    }
}
