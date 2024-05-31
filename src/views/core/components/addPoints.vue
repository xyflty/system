<template>
  <div>
    <el-button
      type="primary"
      plain
      @click="dialogVisible = true"
      style="margin-bottom: 10px"
      >新增投标加分项</el-button
    >
    <el-table :data="list" stripe style="width: 100%" border>
      <el-table-column prop="situation" label="企业认证情况" align="center" />
      <el-table-column prop="expiryDate" label="有效期" align="center" />
      <el-table-column prop="patent" label="专利" align="center" />
      <el-table-column prop="trademark" label="商标" align="center" />
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增投标加分项"
      :visible.sync="dialogVisible"
      width="30%"
      class="addDialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="qualificationForm"
        :model="qualificationForm"
        label-width="100px"
        :rules="qualification_rules"
      >
        <el-form-item label="企业认证情况" prop="situation">
          <el-input
            v-model="qualificationForm.situation"
            placeholder="请输入企业认证情况"
          ></el-input>
        </el-form-item>
        <el-form-item label="发证时间" prop="expiryDate">
          <el-date-picker
            v-model="qualificationForm.expiryDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="专利" prop="patent">
          <el-input
            v-model="qualificationForm.patent"
            placeholder="请输入专利"
          ></el-input>
        </el-form-item>
        <el-form-item label="商标" prop="trademark">
          <el-input
            v-model="qualificationForm.trademark"
            placeholder="请输入商标"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delCustomerTender } from "@/api/core/order";
export default {
  props: ["list"],
  name: "addQualification",
  data() {
    return {
      // === 资质 ===
      dialogVisible: false,
      qualificationForm: {
        situation: undefined, //企业认证情况
        expiryDate: undefined, //有效期
        patent: undefined, //专利
        trademark: undefined, //商标
      },
      qualification_rules: {
        certName: [
          { required: true, message: "资质名称不能为空", trigger: "blur" },
        ],
      },
      // === 资质 ===
    };
  },
  mounted() {},
  methods: {
    cancelAdd() {
      this.dialogVisible = false;
      this.qualificationForm = {
        certName: undefined,
        expireDate: undefined,
        certNo: undefined,
        signDate: undefined,
      };
    },
    submitAdd() {
      this.$refs["qualificationForm"].validate((valid) => {
        if (valid) {
          let arr = this.list || [];
          arr.push({
            ...Object.assign({}, this.qualificationForm),
            localId: arr.length + 1,
          });
          //   this.list = arr;
          this.$emit("update:list", arr);
          this.cancelAdd();
        }
      });
    },
    // 移除资质  有localId 本地删除  无 走请求删除
    handleDelClick(row) {
      console.log(row);
      if (row.localId) {
        const index = this.list.findIndex(
          (item) => item.localId === row.localId
        );
        this.list.splice(index, 1);
        let arr = this.list;
        this.$emit("update:list", arr);
      } else {
        this.$modal
          .confirm("是否确认删除该投标加分项？")
          .then(() => {
            this.loading = true;
            return delCustomerTender(row.id);
          })
          .then(() => {
            this.$modal.msgSuccess("删除成功");
            const index = this.list.findIndex((item) => item.id === row.id);
            this.list.splice(index, 1);
            let arr = this.list;
            this.$emit("update:list", arr);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/dialog.scss";

::v-deep .el-card__body {
  padding: 20px 100px;
}

.addDialog ::v-deep .el-form-item {
  margin-bottom: 20px;
}
.box-card {
  width: 70%;
  margin: 30px auto;
}
.header-box {
  display: flex;
  justify-content: space-between;
}
.header-box span:nth-child(2) {
  color: #999;
}
.footer-box {
  display: flex;
  justify-content: center;
}
</style>
