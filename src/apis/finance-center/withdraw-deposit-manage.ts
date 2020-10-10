import myAxios from '@/assets/ts/axios-config'
// 获取提现申请列表
export const getWithdrawDepositList = (data: DynamicObject) => myAxios.get('/apis/v2/agent/user/withdraw/deposit/page', { params: data })
