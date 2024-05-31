<template>
  <div>
    <el-button
      type="primary"
      plain
      @click="dialogVisible = true"
      style="margin-bottom: 10px"
      >新增项目</el-button
    >
    <el-table :data="list" stripe style="width: 100%" border>
      <el-table-column prop="city" label="可公关地区" />
      <el-table-column prop="advantageEvent" label="优势项目" />
      <el-table-column prop="mainProject" label="主营项目" />
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增客户优势项目与主营项目"
      :visible.sync="dialogVisible"
      width="40%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="可公关地区" prop="city">
          <!-- <el-input v-model="form.publicRelationArea" autocomplete="off" /> -->
          <ProvinceSelect
            ref="province"
            size="small"
            placeholder="客户所在地"
            :showAllLevels="false"
            :checkStrictly="false"
            :dialogVisible="dialogVisible"
            @change="
              (e) => {
                form.city = e.city;
              }
            "
          />
        </el-form-item>
        <el-form-item label="优势项目" prop="advantageProject">
          <el-input
            @click.stop.native="advantageProjectSh = true"
            v-model="form.advantageEvent"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="主营项目" prop="mainProject">
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
      :before-close="dialogMet1"
      :visible.sync="advantageProjectSh"
      width="40%"
      geight="60%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="queryParams1"
        ref="queryForm"
        size="small"
        :inline="true"
      >
        <el-form-item prop="keyword">
          <el-input
            v-model="queryParams1.keyword"
            placeholder="请输入关键字"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getChannelProjectList"
            >搜索</el-button
          >
          <el-button @click="resetQuery1" icon="el-icon-refresh" size="mini"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
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
      :before-close="dialogMet2"
      :visible.sync="mainProjectSh"
      width="40%"
      geight="60%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="queryParams1"
        ref="queryForm"
        size="small"
        :inline="true"
      >
        <el-form-item prop="keyword">
          <el-input
            v-model="queryParams1.keyword"
            placeholder="请输入关键字"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getChannelProjectList"
            >搜索</el-button
          >
          <el-button @click="resetQuery1" icon="el-icon-refresh" size="mini"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
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
        <el-table-column label="选中">
          <template v-if="mainProjectSh" slot-scope="{ row, $index }">
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
      queryParams1: {
        keyword: "",
      },
      rules: {
        city: [
          {
            required: true,
            message: "可公关地区不能为空",
            trigger: ["blur", "change"],
          },
        ],
      },
      loading: false,
      // === 资质 ===
      dialogVisible: false,
      form: {
        city: undefined,
        advantageEvent: undefined,
        advantageEventId: undefined,
        mainProject: undefined,
        mainProjectId: undefined,
      },

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
  methods: {
    dialogMet1() {
      this.queryParams1.keyword = "";
      if (typeof this.index == "number") {
        this.getChannelProjectListData[this.index].show = false;
      }
      this.advantageProjectSh = false;
    },
    dialogMet2() {
      this.queryParams1.keyword = "";
      if (typeof this.index1 == "number") {
        this.getChannelProjectListData[this.index1].show = false;
      }
      this.mainProjectSh = false;
    },
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
      getChannelProjectList(this.queryParams1).then((res) => {
        this.getChannelProjectListData = JSON.parse(JSON.stringify(res.data));
        if (typeof this.index == "number" && row == 1) {
          this.getChannelProjectListData[this.index].show = true;
        }
        if (typeof this.index1 == "number" && row == 2) {
          this.getChannelProjectListData[this.index1].show = true;
        }
        this.loading = false;
      });
    },
    resetQuery1() {
      this.resetForm("queryForm");
      this.getChannelProjectList();
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
