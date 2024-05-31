<template>
  <div>
    <el-button
      type="primary"
      plain
      @click="asyncCount"
      style="margin-bottom: 10px"
      >新增项目</el-button
    >

    <el-table :data="select_project" border style="width: 100%" stripe>
      <el-table-column
        label="项目名称"
        align="center"
        key="projectName"
        prop="projectName"
      />
      <el-table-column
        label="项目二级分类"
        align="center"
        key="categoryName"
        prop="categoryName"
      />
      <el-table-column
        label="项目类型"
        align="center"
        key="projectType"
        prop="projectType"
        v-if="type != 'opportunity'"
      />
      <el-table-column
        label="渠道最低限价"
        align="center"
        key="channelFloorPrice"
        prop="channelFloorPrice"
        v-if="type != 'opportunity'"
      />
      <el-table-column
        label="渠道指导价"
        align="center"
        key="channelGuidePrice"
        prop="channelGuidePrice"
        v-if="type != 'opportunity'"
      />

      <el-table-column
        v-if="typeP == 2"
        label="成交单价"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-input
            type="number"
            v-model="row.bargainPrice"
            placeholder="请输入单价"
            @change="changeopportunityPrice($event, row, $index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        label=" 商机单价"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-input
            type="number"
            v-model="row.opportunityPrice"
            placeholder="请输入单价"
            @change="changeopportunityPrice($event, row, $index)"
          ></el-input>
        </template>
      </el-table-column>

      <!-- <el-table-column
        :label="typeP == 2 ? '成交单价' : '商机单价'"
        align="center"
        class-name="small-padding fixed-width"
        v-if="type != 'opportunity'"
      >
        <template slot-scope="{ row }">
          <el-input
            type="number"
            v-model="row.opportunityPrice"
            placeholder="请输入单价"
          ></el-input>
        </template>
      </el-table-column> -->
      <el-table-column
        label="数量"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-input-number
            v-model="row.num"
            size="small"
            @change="handleChange($event, row, $index)"
            :min="0"
            :max="type == 'opportunity' ? 1 : 9999"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        label="预计总价"
        align="center"
        key="totalPrice"
        prop="totalPrice"
      />
    </el-table>

    <el-dialog
      title="新增项目"
      :visible.sync="dialogVisible"
      width="60%"
      class="addDialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="" label-width="0" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="projectList" border>
        <el-table-column
          label="项目名称"
          align="center"
          key="projectName"
          prop="projectName"
        />
        <el-table-column
          label="项目二级分类"
          align="center"
          key="categoryName"
          prop="categoryName"
        />
        <el-table-column
          label="项目类型"
          align="center"
          key="projectType"
          prop="projectType"
          v-if="type != 'opportunity'"
        />
        <el-table-column
          label="渠道最低限价"
          align="center"
          key="channelFloorPrice"
          prop="channelFloorPrice"
          v-if="type != 'opportunity'"
        />
        <el-table-column
          label="渠道指导价"
          align="center"
          key="channelGuidePrice"
          prop="channelGuidePrice"
          v-if="type != 'opportunity'"
        />

        <el-table-column
          v-if="typeP == 2"
          label="成交单价"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-input
              type="number"
              v-model="row.bargainPrice"
              placeholder="请输入单价"
              @change="changeopportunityPrice($event, row, $index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          label=" 商机单价"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-input
              type="number"
              v-model="row.opportunityPrice"
              placeholder="请输入单价"
              @change="changeopportunityPrice($event, row, $index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-input-number
              v-model="row.num"
              size="small"
              @change="handleChange($event, row, $index)"
              :min="0"
              :max="type == 'opportunity' ? 1 : 9999"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="预计总价"
          align="center"
          key="totalPrice"
          prop="totalPrice"
          v-if="type != 'opportunity'"
        />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div class="total_data flex flex-between" v-if="type != 'opportunity'">
        <div>
          <span
            ><span class="fw_600 color_333 fs_16">产品报价记录：</span>
            <span class="main_color fs_14">{{ select_project.length }}</span>
          </span>
          <span
            ><span class="fw_600 color_333 fs_16 ml_20">产品总数量：</span>
            <span class="main_color fs_14">{{ select_total || 0 }} </span>
          </span>
          <span
            ><span class="fw_600 color_333 fs_16 ml_20">产品总金额： </span>
            <span class="main_color fs_14">{{ price_total || 0 }} </span></span
          >
        </div>
        <!-- <div class="fw_600 color_333 fs_16 ml_20 flex">
          <span>报价总金额：</span>
          <el-input
            v-model="price_total"
            placeholder=" "
            style="width: 100px"
          ></el-input>
        </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancelAdd">取 消</el-button> -->
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { list } from "@/api/core/project/index";
import { delOrderProject } from "@/api/core/order";
import { list } from "../../../../api/irrigationDitch/opportunity";

export default {
  props: ["orderProjects", "price", "type", "typeP"],
  name: "AddProject",

  computed: {
    select_total() {
      const totalMap = this.select_project.map((item) => item.num);
      return eval(totalMap.toString().replace(/\,/g, "+"));
    },
    price_total() {
      const priceMap = this.select_project.map((item) => {
        if (this.typeP == 2) {
          return item.num * item.bargainPrice;
        } else {
          return item.num * item.opportunityPrice;
        }
      });
      return eval(priceMap.toString().replace(/\,/g, "+"));
    },
  },

  watch: {
    select_project: {
      handler(n) {
        this.$emit("update:price", this.price_total);
      },
      deep: true,
    },

    orderProjects: {
      handler(n) {
        this.select_project = Object.assign([], this.orderProjects);
      },
      deep: true,
    },
  },
  data() {
    return {
      dialogVisible: false,

      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
      },
      // 总条数
      total: 0,
      projectList: [],
      select_project: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 查询项目列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        response.rows.forEach((item) => {
          if (this.typeP == 2) {
            item.bargainPrice = item.guidancePrice;
          } else {
            item.opportunityPrice = item.guidancePrice;
          }

          item.num = 0;
        });
        this.projectList = response.rows;
        this.total = response.total;
        this.select_project.forEach((item) => {
          this.projectList.forEach((val) => {
            if (item.id == val.id || item.projectId == val.id) {
              val.num = item.num;
              if (this.typeP == 2) {
                val.bargainPrice = item.guidancePrice;
              } else {
                val.opportunityPrice = item.guidancePrice;
              }
            }
          });
        });
        this.loading = false;
      });
    },

    // 同步列表数量
    asyncCount(boolean) {
      var arr = [];
      this.select_project.forEach((item) => {
        this.projectList.forEach((val, index) => {
          if (item.id == val.id || item.projectId == val.id) {
            arr.push(index);
            val.num = item.num;
            val.totalPrice = item.totalPrice;

            if (this.typeP == 2) {
              val.bargainPrice = item.bargainPrice;
            } else {
              val.opportunityPrice = item.opportunityPrice;
            }
          }
        });
      });
      this.projectList.forEach((val, index) => {
        if (!arr.includes(index)) {
          val.num = 0;
          val.totalPrice = 0;
          if (this.typeP == 2) {
            val.bargainPrice = 0;
          } else {
            val.opportunityPrice = 0;
          }
        }
      });
      this.dialogVisible = true;
    },
    changeopportunityPrice(value, item, index) {
      this.select_project.forEach((item1, index) => {
        if (item.id == item1.id || item1.projectId == item.id) {
          if (this.typeP == 2) {
            item1.bargainPrice = value;
          } else {
            item1.opportunityPrice = value;
          }
          this.$set(this.select_project[index], "totalPrice", value * item.num);
          this.$set(
            this.select_project,
            index,
            JSON.parse(JSON.stringify(this.select_project[index]))
          );
        }
      });

      if (this.typeP == 2) {
        item.bargainPrice = value;
      } else {
        item.opportunityPrice = value;
      }
      item.totalPrice = value * item.num;
      this.$set(this.projectList, index, JSON.parse(JSON.stringify(item)));
    },
    // 改变数量
    handleChange(value, item, index) {
      let isInclude = this.select_project.some(
        (val) => item.id == val.id || item.id == val.projectId
      );
      if (isInclude) {
        this.select_project.forEach((val, index, array) => {
          if (val.id == item.id || item.id == val.projectId) {
            if (value == 0) {
              array.splice(index, 1);
              this.$emit("update:orderProjects", this.select_project);
              item.totalPrice = 0;
            } else {
              if (this.typeP == 2) {
                item.totalPrice = value * item.bargainPrice;
                val.totalPrice = value * item.bargainPrice;
              } else {
                item.totalPrice = value * item.opportunityPrice;
                val.totalPrice = value * item.opportunityPrice;
              }
              val.num = value;
            }
          }
        });
        this.select_project = JSON.parse(
          JSON.stringify(this.select_project.filter((item) => item.num != 0))
        );
      } else {
        item.num = 1;
        if (this.typeP == 2) {
          item.totalPrice = item.bargainPrice;
        } else {
          item.totalPrice = item.opportunityPrice;
        }

        this.select_project.push(item);
      }
    },

    // 删除订单中的项目
    delOrderProject(id) {
      delOrderProject(id).then((res) => {});
    },

    // cancelAdd() {
    //   this.dialogVisible = false;
    // },
    submitAdd() {
      this.$emit("update:orderProjects", this.select_project);
      this.dialogVisible = false;
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
</style>
