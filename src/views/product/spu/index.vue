<template>
  <div>
    <CategorySelector :isShow="isShow" @getAttr="getTmList" />
    <el-card v-show="!isSpu && !isSku">
      <el-button
        type="primary"
        style="margin:10px 0px"
        @click="changeSpu"
        :disabled="spuList.length === 0"
        icon="el-icon-plus"
        class="btn"
        >添加</el-button
      >
      <el-table border :data="spuList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="spuName" label="spu名称"> </el-table-column>
        <el-table-column prop="description" label="spu描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <InfoButton
              @click="changeSku(row)"
              title="添加sku"
              type="success"
              icon="el-icon-plus"
            />
            <InfoButton
              @click="changeSpu(row)"
              title="修改spu"
              type="primary"
              icon="el-icon-edit"
            />
            <InfoButton
              @click="lookSkuList(row)"
              title="查看sku列表"
              type="info"
              icon="el-icon-info"
              style="margin-right:10px"
            />
            <el-popconfirm
              @onConfirm="deleteSpu(row.id)"
              :title="'你确定要删除' + row.spuName + '吗？'"
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

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="text-align: center"
        :current-page="page"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="limit"
        layout="prev, pager, next, jumper, ->, sizes ,total"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- sku列表 -->
    <el-dialog :title="spuName+'=>sku列表'" :visible.sync="dialogTableVisible">
      <el-table :data="skuList" border>
        <el-table-column
          property="skuName"
          label="名称"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
        ></el-table-column>
        <el-table-column
          property="weight"
          label="重量"
        ></el-table-column>
        <el-table-column  label="默认图片">
          <template slot-scope="{row}">
             <img style="width:100px;height:100px;" :src="row.skuDefaultImg" alt="">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <SpuFrom
      ref="spuFrom"
      :isInfo.sync="isInfo"
      :isSpu.sync="isSpu"
      v-show="isSpu"
      :category3="category3"
    />
    <SkuFrom
      ref="skuFrom"
      :isInfo.sync="isInfo"
      :isSku.sync="isSku"
      v-show="isSku"
      :category3="category3"
      :category2="category2"
      :category1="category1"
    />
  </div>
</template>

<script>
import CategorySelector from "../../../components/CategorySelector";
import InfoButton from "../../../components/InfoButton";
import SpuFrom from "../components/spuFrom.vue";
import SkuFrom from "../components/skuFrom.vue";
export default {
  name: "spu",
  data() {
    return {
      category1: "",
      category2: "",
      category3: "",
      isShow: true,
      page: 1,
      limit: 2,
      total: 2,
      spuList: [],
      isSpu: false,
      isSku: false,
      isInfo: false,
      dialogTableVisible:false,
      skuList:[],
      spuName:'',
    };
  },
  mounted() {
    // this.getTmList(this.page,this.limit)
  },
  components: {
    CategorySelector,
    InfoButton,
    SpuFrom,
    SkuFrom,
  },
  methods: {
    async getInfo(page, limit) {
      const { data } = await this.$API.spu.getSpuList(
        page,
        limit,
        this.category3
      );
      this.page = data.current;
      this.limit = data.size;
      this.total = data.total;
      this.spuList = data.records;
    },
    //获取数据
    getTmList(category1, category2, category3) {
      if (category3) {
        this.category1 = category1;
        this.category2 = category2;
        this.category3 = category3;
        this.getInfo(this.page, this.limit, category3);
      } else {
        this.spuList = [];
      }
    },
    //添加spu
    changeSpu(row) {
      this.isSpu = true;
      this.isShow = false;
      //父组件通过$refs找到子组件实例，调用子组件实例上的方法
      this.$refs.spuFrom.getSpuInfo(row);
    },
    //添加sku
    changeSku(row) {
      this.isSku = true;
      this.isShow = false;
      //父组件通过$refs找到子组件实例，调用子组件实例上的方法
      this.$refs.skuFrom.getSkuInfo(row);
    },
    //查看sku列表
    async lookSkuList(row) {
      const res = await this.$API.sku.getSkuList(row.id);
      this.skuList=res.data;
      this.spuName=row.spuName;
      this.dialogTableVisible=true;
    },
    //每页条数发生变化时触发
    handleSizeChange(limit) {
      if (this.page > this.total / this.limit) {
        this.page = Math.ceil(this.total / this.limit);
      }
      this.limit = limit;
      this.getTmList(this.page, limit, this.category3);
    },
    //当前页发生变化时
    handleCurrentChange(page) {
      this.page = page;
      this.getTmList(page, this.limit, this.category3);
    },
    //删除spu
    async deleteSpu(id) {
      await this.$API.spu.deleteSpu(id);
      this.$message({
        message: "恭喜你，操作成功",
        type: "success",
      });
      if (this.total % this.page === 1) {
        this.page = this.page - 1;
      }
      this.getTmList(this.page, this.limit, this.category3);
    },
  },
  watch: {
    isInfo:function () {
        if (this.isInfo) {
          this.isShow=true;
          this.getInfo(this.page, this.limit);
        }
      },
  },
};
</script>

<style>
</style>