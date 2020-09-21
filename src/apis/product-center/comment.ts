/* 商家端-评价分页查询 */
import axios from '@/assets/ts/axios-config'

export const getCommentData = (params: DynamicObject) => axios.get('/apis/v2/order/comment/page', { params })

// 查询评论详情
export const getCommentById = (id: string) => axios.get(`/apis/v2/order/comment/${ id }`)

// 回复评论
export const replyComment = (id: string, data: DynamicObject) => axios.post(`/apis/v2/order/comment/reply/${ id }`, data)

/* 显示隐藏评论 */
export const updateComment = ({ id, status }: DynamicObject) => axios.put(`/apis/v2/order/comment/hidden/${ id }`, null, { params: { status } })

// 删除评论
export const deleteComment = (id: string) => axios.delete(`/apis/v2/order/comment/delete/${ id }`)
