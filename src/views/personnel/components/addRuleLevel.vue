<template>
  <div>
    <div class="flex">
      <el-button plain @click="handleAdd" style="margin-bottom: 10px"
        >新增层级</el-button
      >
      <span class="ml_20 color_999">设置说明：层级需从低级到高级设置</span>
    </div>
    <el-table :data="list" border style="width: 100%" stripe>
      <el-table-column
        label="层级名称"
        align="center"
        key="levelName"
        prop="levelName"
      />
      <el-table-column
        label="标准条件"
        align="center"
        key="lowestQuotation"
        prop="lowestQuotation"
      >
        <template slot-scope="{ row }">
          <span class="ableClick" @click="handleEdit(row, 2)">查看详情</span>
        </template>
      </el-table-column>
      <el-table-column
        label="晋升条件"
        align="center"
        key="guidancePrice"
        prop="guidancePrice"
      >
        <template slot-scope="{ row }">
          <span class="ableClick" @click="handleEdit(row, 1)">查看详情</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleEdit(row, 0)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="flex flex-between">
      <span class="mt_20">已设置层级记录 {{ total }}条 </span>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog
      :title="
        showType == 0
          ? '层级信息'
          : showType == 1
          ? '晋升条件详情'
          : '标准条件详情'
      "
      :visible.sync="dialogVisible"
      width="70%"
      class="addDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="formRule"
        :rules="rules"
        label-width="120px"
        :loading="loading"
      >
        <el-form-item v-show="showType == 0" label="层级名称" prop="levelName">
          <el-input
            v-model="formRule.levelName"
            :maxlength="20"
            placeholder="不能超过20个字"
          />
        </el-form-item>
        <el-form-item
          v-show="showType == 0 || showType == 1"
          :label="showType == 0 ? '晋升条件' : ''"
          :label-width="showType != 0 ? '0' : '120px'"
          prop="promoteRuleList"
        >
          <dynamicTable
            :formRule.sync="formRule"
            :type="1"
            @change="handleInput"
          />
          <div v-show="showType == 0" class="color_999">
            每列条件之间的关系为“或”，每条条件之间的关系为“且”。
          </div>
        </el-form-item>
        <el-form-item
          v-show="showType == 0 || showType == 2"
          :label="showType == 0 ? '标准条件' : ''"
          :label-width="showType != 0 ? '0' : '120px'"
          prop="standardRuleList"
          style="mt_20"
        >
          <dynamicTable
            :formRule.sync="formRule"
            :type="2"
            @change="handleInput"
          />
          <div v-show="showType == 0" class="color_999">
            每列条件之间的关系为“或”，每条条件之间的关系为“且”。
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer" v-show="showType == 0">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPromoteLevel,
  getPromoteLevel,
  addPromoteLevel,
  updatePromoteLevel,
  delPromoteLevel,
  addPromoteRule,
  updatePromoteRule,
} from "@/api/personnel/rule";
import dynamicTable from "@/views/personnel/components/dynamicTable";

export default {
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  name: "AddRule",
  components: { dynamicTable },
  computed: {},

  watch: {
    form: {
      handler(n) {
        console.log(n.id);
        if (n.id) {
          this.id = n.id;
          this.getList(n.id);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      id: "",
      dialogVisible: false,

      showType: 0,

      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 总条数
      total: 0,
      list: [],

      formRule: {},
      rules: {
        levelName: [
          {
            required: true,
            message: "规则名称不能为空",
            trigger: "blur",
          },
        ],
        // promotion_condition: [
        //   {
        //     required: true,
        //     message: "晋级条件不能为空",
        //     trigger: "blur",
        //   },
        // ],
        // demotion_condition: [
        //   {
        //     required: true,
        //     message: "标准条件不能为空",
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  mounted() {},
  methods: {
    /** 查询项目列表 */
    getList() {
      this.loading = true;

      listPromoteLevel({ mainId: this.id, ...this.queryParams }).then(
        (response) => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    // 层级信息改变
    handleInput(e) {
      console.log(e);
      if (e[0].type == 1) {
        this.formRule.promoteRuleList = e;
      } else {
        this.formRule.standardRuleList = e;
      }
    },

    /** 新增按钮操作 */
    handleAdd() {
      if (this.form.id == undefined) {
        this.$notify.error({
          title: "错误",
          message: "请先添加层级规则后，再到列表中编辑层级信息的设置",
        });
        return;
      }
      this.formRule = {
        mainId: this.form.id,
      };
      this.dialogVisible = true;
    },
    /** 修改按钮操作 */
    handleEdit(row, val) {
      this.loading = true;
      const id = row.id || this.ids;
      getPromoteLevel(id).then((response) => {
        this.loading = false;
        this.formRule = response.data;
        this.showType = val;
        this.formRule.showType = val;
        this.dialogVisible = true;
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除层级规则编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPromoteLevel(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    cancelAdd() {
      this.dialogVisible = false;
    },

    // 保存层级信息
    submitAdd() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          // if (this.formRule.id != null) {
          //   updatePromoteRule(this.formRule)
          //     .then((response) => {
          //       this.$modal.msgSuccess("修改成功");
          //       this.dialogVisible = false;
          //       this.getList();
          //     })
          //     .finally(() => {
          //       this.buttonLoading = false;
          //     });
          // } else {
          this.formRule.promoteRuleList.forEach(
            (item) => (item.levelId = this.formRule.id)
          );
          this.formRule.standardRuleList.forEach(
            (item) => (item.levelId = this.formRule.id)
          );
          this.formRule.levelId = this.formRule.id || null;
          addPromoteRule(this.formRule)
            .then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.dialogVisible = false;
              this.getList();
              this.formRule = {};
            })
            .finally(() => {
              this.buttonLoading = false;
            });
          // }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
@import "@/assets/styles/dialog.scss";

::v-deep .el-card__body {
  padding: 20px 100px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
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

.total_data {
  margin: 40px 10px 0 10px;
}

.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
