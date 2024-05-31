<template>
  <div>
    <el-button
      type="primary"
      plain
      @click="dialogVisible = true"
      style="margin-bottom: 10px"
      >新增子公司</el-button
    >
    <el-table :data="list" stripe style="width: 100%" border>
      <el-table-column prop="subsidiaryName" label="子公司名称" />
      <el-table-column prop="city" label="子公司公关地区" />
      <el-table-column prop="advantageEvent" label="子公司优势项目" />
      <el-table-column prop="mainProject" label="子公司主营项目" />
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增子公司"
      :visible.sync="dialogVisible"
      width="40%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="子公司名称" prop="subsidiaryName">
          <el-input v-model="form.subsidiaryName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="子公司公关地区" prop="city">
          <!-- <el-input v-model="form.publicRelationArea" autocomplete="off" /> -->
          <ProvinceSelect
            :dialogVisible="dialogVisible"
            ref="province"
            size="small"
            placeholder="客户所在地"
            :showAllLevels="false"
            :checkStrictly="false"
            @change="
              (e) => {
                form.city = e.city;
              }
            "
          />
        </el-form-item>
        <el-form-item label="子公司优势项目" prop="advantageProject">
          <el-input
            @click.stop.native="advantageProjectSh = true"
            v-model="form.advantageEvent"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="子公司主营项目" prop="mainProject">
          <el-input
            @click.stop.native="mainProjectSh = true"
            v-model="form.mainProject"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="advantageProjectSh"
      width="40%"
      geight="60%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-table
        v-loading="loading"
        :data="getChannelProjectListData"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column
          prop="projectName"
          label="项目名称
"
        />
        <el-table-column prop="id" label="ID" />
        <el-table-column v-if="advantageProjectSh" label="选中">
          <template slot-scope="{ row, $index }">
            <el-checkbox
              @change="changger(row, $index)"
              v-model="row.show"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :visible.sync="mainProjectSh"
      width="40%"
      geight="60%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-table
        v-loading="loading"
        :data="getChannelProjectListData"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column
          prop="projectName"
          label="项目名称
"
        />
        <el-table-column prop="id" label="ID" />
        <el-table-column v-if="mainProjectSh" label="选中">
          <template slot-scope="{ row, $index }">
            <el-checkbox
              @change="changger1(row, $index)"
              v-model="row.show"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getChannelProjectList } from "../../../../api/irrigationDitch/opportunity";
export default {
  props: ["list"],
  name: "addPerson",
  data() {
    return {
      rules: {
        subsidiaryName: [
          {
            required: true,
            message: "子公司名称不能为空",
            trigger: ["blur", "change"],
          },
        ],
      },
      // === 资质 ===
      dialogVisible: false,
      form: {
        subsidiaryName: undefined,
        city: undefined,
        advantageEvent: undefined,
        advantageEventId: undefined,
        mainProject: undefined,
        mainProjectId: undefined,
      },
      loading: false,
      CategoryNameList: [],
      advantageProjectSh: false,
      mainProjectSh: false,
      index: undefined,
      index1: undefined,
      getChannelProjectListData: [],
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  watch: {
    dialogVisible(show) {
      if (!show) {
        this.index = undefined;
        this.index1 = undefined;
      }
    },
    advantageProjectSh(show) {
      if (show) {
        this.loading = true;
        this.getChannelProjectList(1);
      }
    },
    mainProjectSh(show) {
      if (show) {
        this.loading = true;
        this.getChannelProjectList(2);
      }
    },
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
    changger(row, index) {
      if (typeof this.index == "number") {
        this.getChannelProjectListData[this.index].show = false;
      }
      this.index = index;
      if (this.form.advantageEventId == row.id) {
        this.form.advantageEvent = undefined;
        this.form.advantageEventId = undefined;
      } else {
        this.form.advantageEvent = row.projectName;
        this.form.advantageEventId = row.id;
        this.getChannelProjectListData[index].show = true;
      }
    },
    changger1(row, index) {
      if (typeof this.index1 == "number") {
        this.getChannelProjectListData[this.index1].show = false;
      }
      this.index1 = index;
      if (this.form.mainProjectId == row.id) {
        this.form.mainProject = undefined;
        this.form.mainProjectId = undefined;
      } else {
        this.form.mainProject = row.projectName;
        this.form.mainProjectId = row.id;
        this.getChannelProjectListData[index].show = true;
      }
    },
    getChannelProjectList(row) {
      getChannelProjectList().then((res) => {
        this.getChannelProjectListData = res.data;
        if (typeof this.index == "number" && row == 1) {
          this.getChannelProjectListData[this.index].show = true;
        }
        if (typeof this.index1 == "number" && row == 2) {
          this.getChannelProjectListData[this.index1].show = true;
        }
        this.loading = false;
      });
    },
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
          this.loading = true;
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
