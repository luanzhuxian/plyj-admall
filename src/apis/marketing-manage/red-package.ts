import axios from '../../assets/ts/axios-config'

export const addRedPackage = (data: object) => axios.post('/apis/v2/red-package-activities', data)

export const getRedPackageDetail = (id: string) => axios.get(`/apis/v2/red-package-activities/${ id }`)
