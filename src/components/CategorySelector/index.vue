<template>
  <div class="category">
    <el-card shadow="always">
      <el-form
        ref="form"
        style="display: flex"
        :disabled="!isShow"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="一级分类">
          <el-select
            v-model="Category1"
            placeholder="请选择"
            size="medium"
            @change="getCategory2List(Category1)"
          >
            <el-option
              v-for="cat1 in Category1List"
              :key="cat1.id"
              :label="cat1.name"
              :value="cat1.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="Category2"
            placeholder="请选择"
            size="medium"
            @change="getCategory3List(Category2)"
          >
            <el-option
              v-for="cat2 in Category2List"
              :key="cat2.id"
              :label="cat2.name"
              :value="cat2.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="Category3"
            placeholder="请选择"
            size="medium"
            @change="getAttrList"
          >
            <el-option
              v-for="cat3 in Category3List"
              :key="cat3.id"
              :label="cat3.name"
              :value="cat3.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props: {
    getAttr: {
      type: Function,
    },
    isShow: {
      type: Boolean,
    },
  },
  data() {
    return {
      Category1: "",
      Category2: "",
      Category3: "",
      Category1List: [],
      Category2List: [],
      Category3List: [],
    };
  },
  async mounted() {
    const res = await this.$API.attr.getCategory1List();
    this.Category1List = res.data;
  },
  methods: {
    async getCategory2List(val) {
      this.$emit("getAttr");
      this.Category2List = [];
      this.Category2 = "";
      this.Category3List = [];
      this.Category3 = "";
      const res = await this.$API.attr.reqGetCategory2List(val);
      this.Category2List = res.data;
    },
    async getCategory3List(val) {
      this.$emit("getAttr");
      this.Category3List = [];
      this.Category3 = "";
      const res = await this.$API.attr.reqGetCategory3List(val);
      this.Category3List = res.data;
    },
    async getAttrList() {
      // console.log(1);
      this.$emit("getAttr", this.Category1, this.Category2, this.Category3);
    },
  },
};
</script>

<style>
.category {
  margin: 15px 0px;
}
</style>