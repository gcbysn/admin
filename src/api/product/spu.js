import request from "../../utils/request";
export default {
  // POST /admin/product/saveSpuInfo
  // POST /admin/product/updateSpuInfo
  addOrUpdate(spuInfo) {
    return request.post(
      `/product/${spuInfo.id ? "update" : "save"}SpuInfo`,
      spuInfo
    );
  },

  // DELETE /admin/product/deleteSpu/{spuId}
  deleteSpu(spuId) {
    return request.delete(`/product/deleteSpu/${spuId}`);
  },

  // GET /admin/product/getSpuById/{spuId}
  getSpuInfo(spuId) {
    return request.get(`/product/getSpuById/${spuId}`);
  },

  // GET /admin/product/{page}/{limit}
  getSpuList(page, limit, category3Id) {
    return request.get(`/product/${page}/${limit}`, {
      params: {
        category3Id
      }
    });
  },

  // GET /admin/product/baseSaleAttrList
  getBaseSaleAttrList() {
    return request.get(`/product/baseSaleAttrList`);
  }
};
