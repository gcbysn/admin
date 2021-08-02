import request from '@/utils/request';

export default {
  //分页列表
  getTradmarkList(page,limit){
    return request.get(`/product/baseTrademark/${page}/${limit}`)
  },
  //新增Trademark 修改Trademark
  addOrUpdate(tradmark){
    if(tradmark.id){
      return request.put(`/product/baseTrademark/update`,tradmark)
    }else{
      return request.post(`/product/baseTrademark/save`,tradmark)
    }
  },
  //删除Trademark
  deleteTradmark(id){
    return request.delete(`/product/baseTrademark/remove/${id}`)
  },
  //获取所有品牌
  getTradmarks(){
    return request.get(`/product/baseTrademark/getTrademarkList`)
  },
}