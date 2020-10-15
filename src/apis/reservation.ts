import axios from '../assets/ts/axios-config'

/**
 * 获取预约列表
 * @param params {Object}
 * @property params.current {number}
 * @property params.size {number}
 * @property params.keyword {string}
 * @property params.startTime {string}
 * @property params.endTime {string}
 * @property params.status {number}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getReservationQuery = (params: DynamicObject) => axios.get('/apis/v1/base/reservation/page', { params })

export const getBaseUserInfo = () => axios.get('/apis/v2/base/baseUserInfo/list')

export const getReservationDetail = ({ id }: { id: string }) => axios.get(`/apis/v1/base/reservation/${ id }`)

/**
 * 添加预约
 * @param data {Object}
 * @property params.id {string}
 * @property params.remark {string}
 * @property params.operatorUserId {string}
 * @property params.operatorUserName {number}
 * @return {Promise<AxiosResponse<T>>}
 */
export const addReservation = (data: DynamicObject) => axios.post('/apis/v1/base/reservation/add', data)

/**
 * 导出
 * @param params {Object}
 * @property params.keyword {string}
 * @property params.startTime {string}
 * @property params.endTime {string}
 * @property params.status {number}
 * @return {Promise<AxiosResponse<T>>}
 */
export const exportReservationQuery = (params: DynamicObject): Promise<Blob> => axios.post(
    '/apis/v1/base/reservation/export',
    null,
    {
        responseType: 'blob',
        timeout: 0,
        params
    }
)
