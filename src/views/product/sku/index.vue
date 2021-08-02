<template>
  <div>
    <el-card shadow="always" style="margin: 20px 0">
      <el-table border style="width: 100%" :data="skuList">
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="skuName" label="名称"> </el-table-column>
        <el-table-column prop="skuDesc" label="描述"> </el-table-column>
        <el-table-column label="默认图片" width="150">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)"> </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80">
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="{ row }">
            <InfoButton
              :title="!row.isSale ? '上架' : '下架'"
              :type="!row.isSale ? 'info' : 'success'"
              :icon="!row.isSale ? 'el-icon-top' : 'el-icon-bottom'"
              size="min"
              @click.prevent="saleOrcancelSale(row.isSale, row.id)"
            ></InfoButton>
            <InfoButton
              title="修改"
              type="primary"
              icon="el-icon-edit"
              size="min"
              @click.prevent="deletespuSaleAttr()"
            ></InfoButton>
            <InfoButton
              title="查看详情"
              type="info"
              icon="el-icon-info"
              size="min"
              style="margin-right: 10px"
              @click.prevent="getSkuInfo(row.id)"
            ></InfoButton>
            <el-popconfirm
              :title="`你确定要删除${row.skuName}吗？`"
              @onConfirm="deleteSku(row.id)"
            >
              <InfoButton
                title="删除"
                type="danger"
                icon="el-icon-delete"
                size="min"
                slot="reference"
              ></InfoButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="text-align: center"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="prev, pager, next, jumper,->, sizes,total "
        :total="total"
      >
      </el-pagination>

      <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :with-header="false"
        direction="rtl"
        size="50%"
      >
        <el-row class="line">
          <el-col :span="5" class="text">名称</el-col>
          <el-col :span="16"> {{ sku.skuName }}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="5" class="text">描述</el-col>
          <el-col :span="16"> {{ sku.skuDesc }}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="5" class="text">价格</el-col>
          <el-col :span="16"> {{ sku.price }}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="5" class="text">平台属性</el-col>
          <el-col :span="16">
            <template>
              <el-tag v-for="skuAttr in sku.skuAttrValueList" :key="skuAttr.id">
                {{ skuAttr.attrName }}-{{ skuAttr.valueName }}
              </el-tag>
            </template></el-col
          >
        </el-row>
        <el-row class="line">
          <el-col :span="5" class="text">产品图片</el-col>
          <el-col :span="16">
            <template>
              <el-carousel
                trigger="click"
                height="400px"
                style="width: 400px; border: 1px solid #000"
              >
                <el-carousel-item
                  v-for="item in sku.skuImageList"
                  :key="item.id"
                >
                  <img
                    :src="item.imgUrl"
                    alt=""
                    style="width: 400px; height: 400px"
                  />
                </el-carousel-item>
              </el-carousel>
            </template>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
import InfoButton from "../../../components/InfoButton";
export default {
  name: "Sku",
  data() {
    return {
      skuList: [],
      page: 1,
      pageSize: 10,
      total: 2,
      drawer: false,
      sku: {},
    };
  },
  components: {
    InfoButton,
  },
  mounted() {
    this.getSku(this.page, this.pageSize);
  },
  methods: {
    //获取sku
    async getSku(page, pageSize) {
      const { data } = await this.$API.sku.getList(page, pageSize);
      // console.log(res);
      this.skuList = data.records;
      this.page = data.current;
      this.total = data.total;
      this.pageSize = data.size;
    },
    //删除sku
    async deleteSku(id) {
      try {
        await this.$API.sku.remove(id);
        this.getNewInfo();
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
        });
      } catch (error) {
        this.$message({
          showClose: true,
          message: "删除失败",
          type: "error",
        });
      }
    },
    //上架onSale//下架cancelSale
    async saleOrcancelSale(isSale, id) {
      if (!isSale) {
        try {
          await this.$API.sku.onSale(id);
          this.getNewInfo();
          this.$message({
            showClose: true,
            message: "上架成功",
            type: "success",
          });
        } catch (error) {
          this.$message({
            showClose: true,
            message: "上架失败",
            type: "error",
          });
        }
      } else {
        try {
          await this.$API.sku.cancelSale(id);
          this.getNewInfo();
          this.$message({
            showClose: true,
            message: "下架成功",
            type: "success",
          });
        } catch (error) {
          this.$message({
            showClose: true,
            message: "下架失败",
            type: "error",
          });
        }
      }
    },
    //查看sku详情
    async getSkuInfo(id) {
      const res = await this.$API.sku.get(id);
      this.drawer = true;
      this.sku = res.data;
      // console.log(res);
    },
    //当当前页面发生变化时触发
    handleCurrentChange(page) {
      this.getSku(page, this.pageSize, this.Category3Id);
      this.page = page;
    },
    //当每页条数发生改变时触发
    handleSizeChange(pageSize) {
      // console.log(pageSize);
      let page = this.page;
      if (page > Math.ceil(this.total / pageSize)) {
        page = Math.ceil(this.total / pageSize);
      }
      this.getSku(page, pageSize, this.Category3Id);
      this.pageSize = pageSize;
      this.page = page;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getNewInfo() {
      let { page, pageSize, total } = this;
      if (Math.floor(total / pageSize) < page) {
        page = page - 1;
      }
      this.getSku(this.page, this.pageSize);
    },
    //修改sku
    deletespuSaleAttr() {
      this.$message({
        message: "该功能正在开发中",
        type: "info",
      });
    },
  },
};
</script>

<style>
.text {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  margin-right: 20px;
}
.line {
  line-height: 40px;
}
</style>