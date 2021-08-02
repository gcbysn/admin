import request from "@/utils/request";

export default {
  //获取一级属性列表
  getCategory1List() {
    return request.get(`/product/getCategory1`);
  },
  //获取二级属性列表
  reqGetCategory2List(category1Id) {
    return request.get(`/product/getCategory2/${category1Id}`);
  },
  //获取三级属性列表
  reqGetCategory3List(category2Id) {
    return request.get(`/product/getCategory3/${category2Id}`);
  },
  //获取属性列表
  reqGetAttrList(category1Id,category2Id,category3Id){
    return request.get(`/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`);
  },
  //添加属性列表
  reqSaveAttrInfo(data){
    return request.post(`/product/saveAttrInfo`,data);
  },
  //删除属性列表
  reqDeleteAttr(attrId){
    return request.delete(`/product/deleteAttr/${attrId}`);
  }
};
