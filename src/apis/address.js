import axios from 'axios'

export const getCityListByParentId = parentCode => axios.get(`/apis/v1/systemctl/location/parent/${ parentCode }`)

// 创建地址
export const createAddress = data => axios.post('/apis/v1/publicuser/address', data)

// 获取地址列表
export const getAddress = type => axios.get(`/apis/v1/publicuser/address/me/list?type=${ type }`)

export const updateAddress = ({ data, sequenceNbr }) => axios.put(`/apis/v1/publicuser/address/${ sequenceNbr }`, data)

export const setDefaultAddress = ({ sequenceNbr, type }) => axios.put(`/apis/v1/publicuser/address/default/${ sequenceNbr }?type=${ type }`)

export const deleteAddress = ({ sequenceNbr, type }) => axios.delete(`/apis/v1/publicuser/address/${ sequenceNbr }?type=${ type }`)
