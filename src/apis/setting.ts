import axios from 'axios'
// 获取权限树
export const getAllRolesByCode = (roleCode: string) => axios.patch(`/apis/v1/menu/role/${ roleCode }`)
