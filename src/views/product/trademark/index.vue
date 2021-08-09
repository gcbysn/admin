<template>
  <div>
    <el-button
      type="primary"
      @click="dialogFormVisible = true"
      icon="el-icon-plus"
      class="btn"
     v-has-permission="`Trademark.add`"
      >添加</el-button
    >
    <el-table border :data="tradmarkList" style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌logo">
        <template slot-scope="{ row }">
          <img style="width: 100px; height: 80px" :src="row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="warning" size="small" @click="updataTm(row)"  v-has-permission="`Trademark.update`"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="deleteTm(row)" v-has-permission="`Trademark.remove`"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 6, 9, 12, 15]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes ,total"
      :total="total"
    >
    </el-pagination>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="logo图片" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      tradmarkList: [],
      page: 1,
      limit: 3,
      total: 16,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      dialogFormVisible: false,
      imageUrl: "",
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "请上传logo图片", trigger: "blur" },
        ],
      },
      title: "添加品牌",
    };
  },
  async mounted() {
    this.getTmList(this.page, this.limit);
  },
  methods: {
    async getTmList(page, limit) {
      const { data } = await this.$API.tradmark.getTradmarkList(page, limit);
      this.page = data.current;
      this.limit = data.size;
      this.total = data.total;
      this.tradmarkList = data.records;
      // console.log(res);
    },
    //每页条数发生变化时触发
    handleSizeChange(limit) {
      if (this.page > this.total / this.limit) {
        this.page = Math.ceil(this.total / this.limit);
      }
      this.limit = limit;
      this.getTmList(this.page, limit);
    },
    //当前页发生变化时
    handleCurrentChange(page) {
      this.page = page;
      this.getTmList(page, this.limit);
    },
    //图片上传成功时触发
    handleAvatarSuccess(res, file) {
      console.log(file, res);
      this.tmForm.logoUrl = res.data;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //图片上传之前触发
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加品牌
    submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const res = await this.$API.tradmark.addOrUpdate(this.tmForm);
          if ((res.code = 200)) {
            this.dialogFormVisible = false;
            this.getTmList(this.page, this.limit);
            this.$message({
              message: "恭喜你，添加成功",
              type: "success",
            });
          }
        } else {
          console.log("输入的信息不正确");
          return false;
        }
      });

      // this.tmForm={
      //   tmName:'',
      //   logoUrl:''
      // }
    },
    //修改品牌
    updataTm(row) {
      this.dialogFormVisible = true;
      this.title = "修改品牌";
      this.tmForm = {...row};
    },
    //删除品牌
    deleteTm(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.tradmark.deleteTradmark(row.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          if (this.total % this.page === 1) {
            this.page = this.page - 1;
          }
          this.getTmList(this.page, this.limit);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // console.log(id);
    },
  },
  watch: {
    dialogFormVisible: {
      handler() {
        if (!this.dialogFormVisible) {
          this.tmForm = {
            tmName: "",
            logoUrl: "",
          };
        }
      },
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.btn{
  margin: 10px 0px;
}
</style>