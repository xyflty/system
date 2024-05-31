<template>
  <div>
    <el-button
      type="primary"
      plain
      @click="dialogVisible = true"
      style="margin-bottom: 10px"
      >新增资质</el-button
    >
    <el-table :data="list" stripe style="width: 100%" border>
      <el-table-column prop="certName" label="名称" align="center">
      </el-table-column>
      <!-- <el-table-column prop="signDate" label="发证时间" align="center">
      </el-table-column> -->
      <el-table-column prop="expireDate" label="到期时间" align="center">
      </el-table-column>
      <!-- <el-table-column prop="certNo" label="证书编码" align="center">
      </el-table-column> -->
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增资质"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      class="addDialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="qualificationForm"
        :model="qualificationForm"
        label-width="80px"
        :rules="qualification_rules"
      >
        <el-form-item label="资质名称" prop="certName">
          <el-input
            v-model="qualificationForm.certName"
            placeholder="请输入资质名称"
          ></el-input>

          <!-- <el-select
            style="width: 100%"
            v-model="qualificationForm.categoryId"
            filterable
            clearable
            placeholder="资质名称"
            remote
            :remote-method="getProjectCategoryNameList"
            @focus="getProjectCategoryNameList($event, true)"
          >
            <el-option
              v-for="item in CategoryNameList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
        <!-- <el-form-item label="发证时间" prop="signDate">
          <el-date-picker
            v-model="qualificationForm.signDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="到期时间" prop="expireDate">
          <el-date-picker
            v-model="qualificationForm.expireDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="证书编码" prop="certNo">
          <el-input
            v-model="qualificationForm.certNo"
            placeholder="请输入证书编码"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  delBuildingQualification,
  getProjectCategoryNameList,
} from "@/api/core/buildingQualification";
export default {
  props: ["list"],
  name: "addQualification",
  data() {
    return {
      // === 资质 ===
      dialogVisible: false,
      qualificationForm: {
        certName: undefined,
        expireDate: undefined,
        certNo: undefined,
        signDate: undefined,
      },
      qualification_rules: {
        certName: [
          { required: true, message: "资质名称不能为空", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "资质名称不能为空", trigger: "blur" },
        ],
      },
      // === 资质 ===

      CategoryNameList: [],
    };
  },
  watch: {
    "qualificationForm.categoryId": {
      handler(n) {
        console.log(n);
        // this.qualificationForm.certName = this.CategoryNameList.find(
        //   (item) => item.id == n
        // )
        //   ? this.CategoryNameList.find((item) => item.id == n)["categoryName"]
        //   : "";
      },
    },
  },
  mounted() {},
  methods: {
    getProjectCategoryNameList(e, isFocus) {
      getProjectCategoryNameList().then((res) => {
        this.CategoryNameList = res.data;
      });
    },
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
          .confirm("是否确认删除该资质？")
          .then(() => {
            this.loading = true;
            return delBuildingQualification(row.id);
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
