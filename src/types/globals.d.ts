import { AxiosRequestConfig, AxiosStatic } from 'axios'

declare global {
  interface Uuid {
    v1: () => string;
  }
  interface ResponseData<T> {
    status: number;
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
  }
}
