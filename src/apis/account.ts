import axios from '../assets/ts/axios-config'

// 获取账户首页信息
export const AccountInfo = () => axios.get('/apis/v2/systemctl/account/index')

// 添加一个账户
export const addAccount = (data: any) => axios.post('/apis/v2/systemctl/account/add', data)

// 获取启用，禁用账户列表
export const getAccounts = (params: any) => axios.get('/apis/v2/systemctl/account/roleUser/list', { params })

// 获取启用，禁用账户列表
export const getOwnedAccountList = (params: any) => axios.get('/apis/v2/helper/owner', { params })

// 获取待激活账户列表
export const getNotActiveAccounts = (params: any) => axios.get('/apis/v2/systemctl/account/roleUser/list/acting', { params })

// 获取单个账户的详情
export const getSingleAccount = (params: any) => axios.get('/apis/v2/systemctl/account/detail', { params })
// 获取单个账户所属helper
export const getSingleAccountHerlerList = (params: any) => axios.get('/apis/v2/systemctl/account/detail/helpers', { params })

// 通过手机号查询公司员工列表
export const searchMobile = (params: any) => axios.get('/apis/v2/systemctl/account/mobile', { params })

// 从此公司删除这个账户
export const deleteAccount = (params: any) => axios.put('/apis/v2/systemctl/account/delete', null, { params })

// 从此公司启用一个账户
export const enableAccount = (params: any) => axios.put('/apis/v2/systemctl/account/enable', null, { params })

// 降级这个账户
export const downgradeAccount = (params: any) => axios.put('/apis/v2/systemctl/account/downgrade', null, { params })

// 编辑这个账户
export const editAccount = (data: any) => axios.post('/apis/v2/systemctl/account/edit', data)

// 查看这个账户权限
export const getMenuByUser = ({ roleCode, userId }: any) => axios.patch(`/apis/v2/menu/user/${ roleCode }/${ userId }`)

// 新增子账户获取默认权限
export const getEmployeeDefault = () => axios.get('/apis/v2/menu/list/all?roleCode=EMPLOYEE')

// 添加一个账户
export const validatedOpen = (data: any) => axios.post('/apis/v2/systemctl/account/validated', data)
