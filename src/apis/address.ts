import axios from '../assets/ts/axios-config'

export const getCityListByParentId = (parentCode: string) => axios.get(`/apis/v2/base/location/parent/${ parentCode }`)

// 创建地址
export const createAddress = (data: any) => axios.post('/apis/v1/publicuser/address', data)

// 获取地址列表
export const getAddress = (type: number) => axios.get(`/apis/v1/publicuser/address/me/list?type=${ type }`)

export const updateAddress = ({ data, sequenceNbr }: any) => axios.put(`/apis/v1/publicuser/address/${ sequenceNbr }`, data)

export const setDefaultAddress = ({ sequenceNbr, type }: any) => axios.put(`/apis/v1/publicuser/address/default/${ sequenceNbr }?type=${ type }`)

export const deleteAddress = ({ sequenceNbr, type }: any) => axios.delete(`/apis/v1/publicuser/address/${ sequenceNbr }?type=${ type }`)
