<template>
  <div>
    <el-button
      type="primary"
      plain
      @click="dialogVisible = true"
      style="margin-bottom: 10px"
      >新增联系人</el-button
    >
    <el-table :data="list" stripe style="width: 100%" border>
      <el-table-column prop="contactName" label="联系人姓名" align="center" />
      <el-table-column prop="gender" label="性别" align="center">
        <template slot-scope="{ row }">
          {{ row.gender == 1 ? "先生" : row.gender == 2 ? "女士" : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center">
        <template slot-scope="{ row }">
          {{ getLabel(commonData[`roleList`], row.role) }}
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位" align="center" />
      <el-table-column prop="cellphone" label="手机号码" align="center" />
      <el-table-column prop="landlinePhone" label="座机" align="center" />
      <el-table-column prop="tencentWx" label="微信" align="center" />
      <el-table-column prop="hobby" label="喜恶" align="center" />
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增联系人"
      :visible.sync="dialogVisible"
      width="40%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="form.contactName" placeholder="联系人姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender">
            <el-option label="先生" :value="1" />
            <el-option label="女士" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role">
            <el-option
              v-for="role in commonData.roleList"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="职位" />
        </el-form-item>
        <el-form-item label="手机号码" prop="cellphone">
          <el-input v-model="form.cellphone" placeholder="手机号码" />
        </el-form-item>
        <el-form-item label="座机" prop="landlinePhone">
          <el-input v-model="form.landlinePhone" placeholder="座机" />
        </el-form-item>
        <el-form-item label="微信" prop="tencentWx">
          <el-input v-model="form.tencentWx" placeholder="微信" />
        </el-form-item>
        <el-form-item label="喜恶" prop="hobby">
          <el-input v-model="form.hobby" placeholder="喜恶" />
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
import { delBuildingQualification } from "@/api/core/buildingQualification";
import { removeContactInfoById } from "@/api/core/clue";

import { mapState } from "vuex";

export default {
  props: {
    list: {
      type: [Array, Object],
      default: null,
    },
    rules: {
      type: [Object],
      default: () => {
        return {
          cellphone: [
            {
              required: true,
              message: "手机号码不能为空",
              trigger: ["blur", "change"],
            },
            {
              pattern: /^1[3456789]\d{9}$/,
              message: "手机号格式不对",

              trigger: "blur",
            },
          ],
          // tencentWx: [
          //   {
          //     required: true,
          //     message: "微信号不能为空",
          //     trigger: "blur",
          //   },
          //   {
          //     pattern: /^[a-zA-Z\d_][a-zA-Z\d_-]{5,19}$/,
          //     message:
          //       "微信号格式不对，请以字母，数字或者下划线开头，字母不区分大小写或6到20位之间",
          //     trigger: "blur",
          //   },
          // ],
        };
      },
    },
  },
  name: "addPerson",
  data() {
    return {
      // === 资质 ===
      dialogVisible: false,
      form: {
        certName: undefined,
        expireDate: undefined,
        certNo: undefined,
        signDate: undefined,
      },

      CategoryNameList: [],
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  watch: {
    "form.categoryId": {
      handler(n) {
        this.form.certName = this.CategoryNameList.find((item) => item.id == n)
          ? this.CategoryNameList.find((item) => item.id == n)["categoryName"]
          : "";
      },
    },
  },
  mounted() {},
  methods: {
    cancelAdd() {
      this.dialogVisible = false;
      this.form = {
        certName: undefined,
        expireDate: undefined,
        certNo: undefined,
        signDate: undefined,
      };
    },
    submitAdd() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let arr = this.list || [];
          arr.push({
            ...Object.assign({}, this.form),
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
      if (row.localId) {
        const index = this.list.findIndex(
          (item) => item.localId === row.localId
        );
        this.list.splice(index, 1);
        let arr = this.list;
        this.$emit("update:list", arr);
      } else {
        this.$modal.confirm("是否确认删除该联系人信息？").then(() => {
          removeContactInfoById({ id: row.id })
            .then((result) => {
              if (result.code === 200) {
                this.loading = true;
                this.$modal.msgSuccess("删除成功");
                const index = this.list.findIndex((item) => item.id === row.id);
                this.list.splice(index, 1);
                let arr = this.list;
                this.$emit("update:list", arr);
              } else {
                this.loading = true;

                this.$modal.msgSuccess(result.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });

          // return delBuildingQualification(row.id);
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
