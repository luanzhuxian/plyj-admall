import myAxios from '@/assets/ts/axios-config'
// 获取润笔列表
export const getRunbiList = (data: DynamicObject) => myAxios.get('/apis/v1/agent/user/share/price/record/page', { params: data })

// 修改润笔申请状态
export const updateRunbi = (updateModel: DynamicObject) => myAxios.put('/apis/v1/agent/user/share/price/record/status', updateModel)
