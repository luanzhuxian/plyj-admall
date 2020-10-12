import myAxios from '@/assets/ts/axios-config'
// 获取提现申请列表
export const getWithdrawDepositList = (data: DynamicObject) => myAxios.get('/apis/v2/agent/user/withdraw/deposit/page', { params: data })

// 提现审核通过
export const passWithdrawDeposit = (data: { ids: string[] }) => myAxios.post('/apis/v2/agent/user/withdraw/deposit/transfer/accounts', data)

// 拒绝提现
export const rejectWithdrawDeposit = (data: { ids: string[]; status: string; message: string }) => myAxios.post('/apis/v2/agent/user/withdraw/deposit/update', data)
