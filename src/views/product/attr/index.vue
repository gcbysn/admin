<template>
  <div>
    <CategorySelector :isShow="isShow" @getAttr="getAttr" />
    <el-card>
      <el-main v-show="!isAdd">
        <el-button
          type="primary"
          @click="isAdd = true"
          :disabled="attrList.length === 0"
          icon="el-icon-plus"
          class="btn"
          >添加</el-button
        >
        <el-table border :data="attrList" style="width: 100%">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称"> </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                class="eltag"
                type="warning"
                :key="attr.id"
                v-for="attr in row.attrValueList"
                >{{ attr.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <InfoButton
                title="修改"
                @click="updataAttr(row)"
                type="primary"
                icon="el-icon-edit"
                style="margin-right:20px"
              />
              <el-popconfirm
                @onConfirm="deleteAttr(row.id)"
                :title="'你确定要删除' + row.attrName + '吗？'"
              >
                <InfoButton
                  title="删除"
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-main v-show="isAdd">
        <el-form
          :model="attrForm"
          label-position="left"
          label-width="80px"
          style="width: 20%"
        >
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="addAttr"
          :disabled="attrForm.attrName === ''"
          icon="el-icon-plus"
          class="btn"
          >添加属性</el-button
        >
        <el-button type="primary" @click="isAdd = false">取消</el-button>
        <el-table border :data="attrForm.attrValueList" style="width: 100%">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column label="属性名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.isInput"
                ref="input"
                size="small"
                v-model="row.valueName"
                @blur="handleInputConfirm(row, $index)"
              ></el-input>
              <div v-else @click="changeInput($index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template>
              <InfoButton title="删除" type="danger" icon="el-icon-delete" />
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrForm.attrValueList.length === 0"
          @click="save"
          >保存</el-button
        ><el-button type="primary" @click="isAdd = false">取消</el-button>
      </el-main>
    </el-card>
  </div>
</template>

<script>
import CategorySelector from "../../../components/CategorySelector";
import InfoButton from "../../../components/InfoButton";
import cloneDeep from "lodash/cloneDeep";
let flag = false;
export default {
  name: "Attr",
  data() {
    return {
      isShow: true, //控制三级的禁用状态
      category1: "",
      category2: "",
      category3: "",
      attrList: [],
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryLevel: 3,
        categoryId: "",
        id: "",
      },
      isAdd: false, //控制添加属性表格的显示隐藏
    };
  },
  components: {
    CategorySelector,
    InfoButton,
  },
  methods: {
    async getAttr(category1, category2, category3) {
      if (category3) {
        const res = await this.$API.attr.reqGetAttrList(
          category1,
          category2,
          category3
        );
        this.category1 = category1;
        this.category2 = category2;
        this.category3 = category3;
        this.attrForm.categoryId = category3;
        // console.log(res);
        // res.data.attrValueList.forEach((item) => {
        //   item.isInput = false;
        // });
        this.attrList = res.data;
      } else {
        this.attrList = [];
      }
    },
    //添加
    addAttr() {
      this.attrForm.attrValueList.push({
        isInput: true,
      });
      this.$nextTick((_) => {
        this.$refs.input.focus();
      });
    },
    //更换显示input组件
    changeInput(index) {
      let {
        attrForm: { attrValueList },
      } = this;
      attrValueList.forEach((item) => {
        item.isInput = false;
      });
      attrValueList[index].isInput = true;
      this.$nextTick((_) => {
        this.$refs.input.focus();
      });
    },
    handleInputConfirm(row, index) {
      let {
        attrForm: { attrValueList },
      } = this;
      const res = attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });
      if (res) {
        this.$message({
          message: "属性值名称重复,请重新输入",
          type: "info",
        });
        flag = true;
        return;
      }
      // console.log(row);
      if (!row.valueName.trim()) {
        this.$message({
          message: "属性值名称不能为空，请输入值",
          type: "info",
        });
        flag = true;
        return;
      }
      attrValueList[index].isInput = false;
      flag = false;
    },
    //保存
    async save() {
      this.attrForm.categoryId = this.category3;
      if (!flag) {
        try {
          await this.$API.attr.reqSaveAttrInfo(this.attrForm);
          this.$message({
            message: "恭喜你，操作成功",
            type: "success",
          });
          this.attrForm = {
            attrName: "",
            attrValueList: [],
            categoryLevel: 3,
            categoryId: "",
          };
          this.getAttr(this.category1, this.category2, this.category3);
          this.isAdd = false;
        } catch (error) {
          this.$message({
            message: "抱歉此次操作失败",
            type: "info",
          });
        }
      } else {
        this.$message({
          message: "抱歉你输入的属性值有误",
          type: "info",
        });
      }
    },
    //修改
    updataAttr(row) {
      this.isAdd = true;
      row.attrValueList.forEach((item) => {
        item.isInput = false;
      });
      this.attrForm = cloneDeep(row);
      // this.attrForm = row;
    },
    //删除
    deleteAttr(id) {
      this.$API.attr.reqDeleteAttr(id);
      this.$message({
        message: "恭喜你，操作成功",
        type: "success",
      });
      this.getAttr(this.category1, this.category2, this.category3);
    },
  },
};
</script>

<style>
.eltag {
  margin: 0 5px;
}
.btn {
  margin: 10px 0px;
}
</style>