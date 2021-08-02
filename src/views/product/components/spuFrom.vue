<template>
  <div>
    <el-card>
      <el-form ref="form" :data="spuForm" label-width="80px">
        <el-form-item label="spu名称" placeholder="请输入spu名称">
          <el-input v-model="spuForm.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in tmList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
              >{{ tm.tmName }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="spu描述">
          <el-input type="textarea" v-model="spuForm.description"></el-input>
        </el-form-item>
        <el-form-item label="spu图片">
          <el-upload
            action="/admin/product/fileUpload"
            list-type="picture-card"
            :file-list="spuImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleChange"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性" class="item">
          <el-select
            v-model="salevalue"
            :placeholder="
              SaleAttrList.length
                ? '还有' + SaleAttrList.length + '项未选中'
                : '没有了'
            "
          >
            <el-option
              :label="sale.name"
              v-for="(sale, index) in SaleAttrList"
              :key="sale.id"
              :value="sale.id + ':' + sale.name"
              >{{ sale.name }}</el-option
            >
          </el-select>
          <el-button
            type="primary"
            :disabled="!salevalue"
            @click="addSaleList()"
            >添加销售属性</el-button
          >
          <el-table
            class="table"
            border
            :data="changeSaleList"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称">
            </el-table-column>
            <el-table-column label="属性值列表">
              <template slot-scope="{ row, $index }">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, $index)"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur.prevent="handleInputConfirm($index)"
                  @keyup.enter.native="handleInputConfirm($index)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click.prevent="showInput($index)"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <!-- <el-popconfirm
                  @onConfirm="deleteAttr(row, $index)"
                  :title="'你确定要删除' + row.saleAttrName + '吗？'"
                > -->
                <!-- <InfoButton
                    title="删除"
                    slot="reference"
                    type="danger"
                    icon="el-icon-delete"
                  /> -->
                <div  class="btn" @click="deleteAttr(row, $index)">
                  删除
                </div>
                <!-- </el-popconfirm> -->
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="cale">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import InfoButton from "../../../components/InfoButton";
export default {
  name: "SpuForm",
  data() {
    return {
      props: ["SpuForm", "category3"],
      spuForm: {
        category3Id: "", //三级分类id
        description: "", //spu描述
        id: "",
        spuImageList: [
          // {
          //   imgName:'',
          //   imgUrl:'',
          // }
        ], //spu图片列表
        spuName: "", //spu名称
        spuSaleAttrList: [
          //选中的销售属性列表
          // {
          //   baseSaleAttrId:'',  //销售属性id
          //   saleAttrName:'',  //销售属性名称
          //   spuSaleAtttrValueList:[   //销售属性值列表
          //     {
          //       baseSaleAttrId:'',  //销售属性id
          //       saleAttrValueName:'', //销售属性值名称
          //     }
          //   ]
          // }
        ],
        tmId: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      tmId: "", //选中的品牌id
      changeSaleList: [], //选中的销售属性列表
      inputVisible: false,
      inputValue: "",
      tmList: [], //全部品牌
      SaleAttrList: [], //全部的销售属性
      imgList: [], //图片列表
      salevalue: "",
      spuImageList: [],
    };
  },
  components: {
    InfoButton,
  },
  async mounted() {
    // const res = await this.$API.tradmark.getTradmarks()
    // const reslut= await this.$API.spu.getBaseSaleAttrList()
    // console.log(res,reslut);
  },
  methods: {
    getSpuInfo(row) {
      if (row.id) {
        this.getTradmarkList();
        this.getSaleList();
        this.getSpu(row.id);
        this.getSpuImage(row.id);
      } else {
        this.getTradmarkList();
        this.getSaleList();
      }
    },
    //获取所有品牌
    async getTradmarkList() {
      const res = await this.$API.tradmark.getTradmarks();
      this.tmList = res.data;
    },
    //获取销售属性
    async getSaleList() {
      const reslut = await this.$API.spu.getBaseSaleAttrList();
      this.SaleAttrList = reslut.data;
    },
    //
    async getSpu(id) {
      const res = await this.$API.spu.getSpuInfo(id);
      res.data.spuSaleAttrList.forEach((item) => {
        item.inputVisible = false;
      });
      this.spuForm = res.data;
      // console.log(res);
      this.changeSaleList = res.data.spuSaleAttrList;
      const { changeSaleList, SaleAttrList } = this;
      for (let i = 0; i < SaleAttrList.length; i++) {
        for (let j = 0; j < changeSaleList.length; j++) {
          if (SaleAttrList[i].name === changeSaleList[j].saleAttrName) {
            console.log(i,1);
            SaleAttrList.splice(i, 1);
          }
        }
      }
      this.SaleAttrList = SaleAttrList;
    },
    //
    async getSpuImage(id) {
      const { data } = await this.$API.sku.getSpuImageList(id);
      data.forEach((imgObj) => {
        imgObj.name = imgObj.imgName;
        imgObj.url = imgObj.imgUrl;
      });
      this.spuImageList = data;
    },
    //添加销售属性
    addSaleList() {
      const { changeSaleList, salevalue, SaleAttrList } = this;
      const arr = salevalue.split(":");
      // console.log(this.SaleAttrList.indexOf(arr[0]));
      // this.SaleAttrList.splice(this.SaleAttrList.indexOf(arr[0]),1)
      this.SaleAttrList = SaleAttrList.filter((item) => {
        return item.name !== arr[1];
      });
      changeSaleList.push({
        baseSaleAttrId: arr[0],
        saleAttrName: arr[1],
        spuSaleAttrValueList: [],
        inputVisible: false,
      });
      this.salevalue = "";
    },
    //删除销售属性值列表中的value时触发
    handleClose(tag, index) {
      this.changeSaleList[index].spuSaleAtttrValueList.splice(
        this.changeSaleList[index].spuSaleAtttrValueList.indexOf(tag),
        1
      );
    },
    //显示input
    showInput(index) {
      this.changeSaleList[index].inputVisible = true;
      this.$nextTick((_) => {
        // console.log(this);
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //输入时
    handleInputConfirm(index) {
      let inputValue = this.inputValue;
      let flag = false;
      const { changeSaleList } = this;
      if (inputValue) {
        //判断是否有重复的值
        if (changeSaleList[index].spuSaleAttrValueList.length !== 0) {
          changeSaleList[index].spuSaleAttrValueList.forEach((item) => {
            if (item.saleAttrValueName === inputValue) {
              this.$message({
                message: "销售属性值不能重复",
                type: "info",
              });
              flag = true;
            }
          });
        }
        //如果值重复就不让添加
        if (!flag) {
          changeSaleList[index].spuSaleAttrValueList.push({
            baseSaleAttrId: changeSaleList[index].baseSaleAttrId,
            saleAttrValueName: inputValue,
          });
        } else {
          this.inputValue = "";
          return;
        }
      }
      changeSaleList[index].inputVisible = false;
      this.inputValue = "";
    },
    //删除销售属性
    deleteAttr(row, index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.changeSaleList.splice(index, 1);
          this.SaleAttrList.push({
            id: row.baseSaleAttrId,
            name: row.saleAttrName,
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

      // console.log(row,index);
    },
    //移除图片时触发
    handleRemove(file, fileList) {
      this.imgList = fileList;
      console.log(file, fileList);
    },
    //点击放大时触发
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传成功时触发
    handleChange(response, file, fileList) {
      // console.log(response, file, fileList);
      this.imgList = fileList;
    },
    //保存
    async onSubmit() {
      const { spuForm, imgList, changeSaleList, tmId } = this;
      //处理需要的图片列表
      spuForm.spuImageList = imgList.map((item) => {
        const obj = {};
        obj.imgName = item.name;
        obj.imgUrl = item.response.data;
        return obj;
      });

      //处理需要的销售属性
      spuForm.spuSaleAttrList = changeSaleList.map((item) => {
        delete item.inputVisible;
        return item;
      });
      spuForm.category3Id = this.$attrs.category3;
      try {
        await this.$API.spu.addOrUpdate(spuForm);
        this.resetSpuForm();
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.$emit("update:isSpu", false);
        this.$emit("update:isInfo", true);
        // this.$emit("getSpuForm");
      } catch (error) {
        this.$message({
          message: "操作失败",
          type: "info",
        });
      }
      // this.spuForm=spuForm;
      //  console.log( spuForm);
    },
    //取消
    cale() {
      this.$emit("update:isSpu", false);
      // this.$emit("SpuForm");
      this.$emit("update:isInfo", true);
      this.resetSpuForm();
    },
    //重置当前组件状态
    resetSpuForm() {
      Object.assign(this.$data, this.$options.data());
    },
  },
};
</script>

<style  scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.table {
  margin-top: 10px;
}
  
.btn{
  border:1px solid #333;
  width: 35px;
  line-height: 25px;
  background-color: red;
  color: #fff;
  text-align: center;
}
.btn:hover{
  cursor: pointer;
}
</style>