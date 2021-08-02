<template>
  <div>
    <el-card>
      <el-form
        :model="skuForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="spu名称">
          {{ spuForm.spuName }}
        </el-form-item>
        <el-form-item label="sku名称">
          <el-input
            v-model="skuForm.skuName"
            placeholder="请输入sku名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input
            type="number"
            v-model="skuForm.price"
            placeholder="请输入sku价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <el-input
            type="number"
            v-model="skuForm.weight"
            placeholder="请输入sku重量"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input
            type="textarea"
            placeholder="请输入sku规格描述"
            v-model="skuForm.skuDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-form ref="form" label-width="80px" size="mini" inline>
            <el-form-item
              :key="attr.id"
              v-for="attr in attrList"
              :label="attr.attrName"
            >
              <el-select v-model="attr.attrIdValueId" placeholder="请输入">
                <el-option
                  :key="attrValue.id"
                  v-for="attrValue in attr.attrValueList"
                  :label="attrValue.valueName"
                  :value="`${attr.id}:${attrValue.id}`"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-form
            ref="form"
            style="display: flex"
            label-width="80px"
            size="mini"
          >
            <el-form-item
              :key="spuSaleAttr.id"
              v-for="spuSaleAttr in spuSaleAttrList"
              :label="spuSaleAttr.saleAttrName"
            >
              <el-select
                v-model="spuSaleAttr.attrIdValueId"
                placeholder="请输入"
                size="medium"
              >
                <el-option
                  :key="spuSaleAttrValue.id"
                  v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                  :label="spuSaleAttrValue.saleAttrValueName"
                  :value="`${spuSaleAttr.id}:${spuSaleAttrValue.baseSaleAttrId}`"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table
            border
            style="width: 100%; margin: 20px 0"
            :data="spuImageList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{ row }">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="row.imgUrl"
                  fit="fill"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  type="primary"
                  @click="changeImg(row)"
                  v-if="row.isDefault === '0'"
                  >设为默认</el-button
                >
                <el-tag :disable-transitions="true" type="success" v-else
                  >默认</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="canel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "skuFrom",
  props: ["category3", "category2", "category1", "SkuForm"],
  data() {
    return {
      skuForm: {
        skuName: "", //sku名称
        price: "", //价格
        weight: "", //重量
        skuDesc: "", //描述
        spuSaleAttrList: [
          // {
          //   saleAttrId:'',
          //   saleAttrValueId:'',
          // }
        ], //spu销售属性列表
        category3Id: "",
        skuAttrValueList: [
          // {
          //   attrId:'',
          //   valueId:'',
          // }
        ], //sku平台属性值列表
        skuImageList: [
          // {
          //   id:'',
          //   imgName:'',
          //   imgUrl:'',
          //   isDefault:'',
          //   spuId:'',
          //   spuImgId:'',
          // }
        ], //sku图片列表
        spuName: "",
        skuDefaultImg: "",
        tmId: "",
      },
      spuForm: {},
      attrList: [], //平台属性列表
      spuSaleAttrList: [], //销售属性列表
      spuImageList: [], //全部图片
      changeImgList: [], //选中的图片列表
    };
  },
  methods: {
    getSkuInfo(row) {
      this.getSkuImage(row.id);
      this.getSpuSaleAttr(row.id);
      this.spuForm = { ...row };
      this.getAttr();
    },
    //获取图片列表
    async getSkuImage(id) {
      const res = await this.$API.sku.getSpuImageList(id);
      res.data.forEach((item) => {
        item.isDefault = "0";
      });
      this.spuImageList = res.data;
    },
    //获取销售属性
    async getSpuSaleAttr(id) {
      const res = await this.$API.sku.getSpuSaleAttrList(id);
      this.spuSaleAttrList = res.data;
    },
    //获取品牌属性
    async getAttr() {
      const { category1, category2, category3 } = this.$props;
      const res = await this.$API.attr.reqGetAttrList(
        category1,
        category2,
        category3
      );
      this.attrList = res.data;
      // console.log(res,this.$attrs);
    },
    //点击
    handleSelectionChange(val) {
      this.changeImgList = val;
    },
    //设置默认图片
    changeImg(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = "0";
      });
      row.isDefault = "1";
      this.skuForm.skuDefaultImg = row.imgUrl;
    },
    //点击保存
    async submitForm() {
      let { skuForm, attrList, spuSaleAttrList, changeImgList } = this;
      //处理数据
      //1.处理图片列表
      skuForm.skuImageList = changeImgList;

      //2.处理平台属性列表
      skuForm.skuAttrValueList = attrList.reduce((prev, item) => {
        if (item.attrIdValueId) {
          let [attrId, valueId] = item.attrIdValueId.split(":");
          prev.push({
            attrId,
            valueId,
          });
        }
        return prev;
      }, []);
      //3.处理销售属性
      skuForm.spuSaleAttrList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdValueId) {
          let [saleAttrId, saleAttrValueId] = item.attrIdValueId.split(":");
          prev.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
      }, []);
      //4.处理其他数据
      skuForm.category3Id = this.category3;
      skuForm.spuName = this.spuForm.spuName;
      skuForm.tmId = this.spuForm.tmId;

      try {
        await this.$API.sku.addOrUpdate(skuForm);
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.resetSkuForm();
        this.$emit("update:isSku", false);
        this.$emit("update:isInfo", true);
      } catch (error) {
        this.$message({
          message: "操作失败",
          type: "info",
        });
      }
    },
    //取消
    canel() {
      this.$emit("update:isSku", false);
      this.$emit("SkuForm");
      this.resetSkuForm();
    },
    //重置当前组件状态
    resetSkuForm() {
      Object.assign(this.$data, this.$options.data());
    },
  },
};
</script>

<style>
</style>