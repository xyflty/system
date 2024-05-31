<template>
  <div>
    <el-button
      type="primary"
      plain
      @click="asyncCount"
      style="margin-bottom: 10px"
      v-if="isEdit"
      >新增项目</el-button
    >
    <el-table :data="select_project" border style="width: 100%" stripe>
      <el-table-column
        label="项目分类"
        align="center"
        key="allCategoryName"
        prop="allCategoryName"
      />
      <el-table-column
        label="项目名称"
        align="center"
        key="projectName"
        prop="projectName"
      />
      <el-table-column
        label="最低限价"
        align="center"
        key="lowestQuotation"
        prop="lowestQuotation"
        v-if="type != 'opportunity'"
      />
      <el-table-column
        label="指导单价"
        align="center"
        key="guidancePrice"
        prop="guidancePrice"
        v-if="type != 'opportunity'"
      />

      <el-table-column
        label="单价"
        align="center"
        class-name="small-padding fixed-width"
        v-if="type != 'opportunity'"
      >
        <template slot-scope="{ row }">
          <span v-if="!isEdit">{{ row.unitPrice }}</span>
          <el-input
            v-else
            type="number"
            v-model="row.unitPrice"
            placeholder="请输入单价"
            :disabled="row.isGift == 1"
            @change="handlePrice($event, row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="数量"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <span v-if="!isEdit">{{ row.quantity }}</span>
          <el-input-number
            v-model="row.quantity"
            :key="row.id"
            size="small"
            @change="handleChange($event, row, 'quantity')"
            :min="0"
            v-else
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$route.query.type == 1 && type != 'opportunity'"
        label="变更前单价"
        align="center"
        class-name="small-padding fixed-width"
        prop="beforeUnitPrice"
      >
      </el-table-column>
      <el-table-column
        v-if="$route.query.type == 1 && type != 'opportunity'"
        label="变更前数量"
        align="center"
        class-name="small-padding fixed-width"
        prop="beforeQuantity"
      >
      </el-table-column>
      <el-table-column
        label="是否赠品"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-checkbox
            v-model="row.isGift"
            :true-label="1"
            :false-label="0"
            :disabled="!isEdit"
            @change="(val) => changeGift(row, val)"
            >是</el-checkbox
          >
        </template>
      </el-table-column>
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
        @submit.native.prevent
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
          label="项目分类"
          align="center"
          key="allCategoryName"
          prop="allCategoryName"
        />
        <el-table-column
          label="项目名称"
          align="center"
          key="projectName"
          prop="projectName"
        />
        <el-table-column
          label="最低限价"
          align="center"
          key="lowestQuotation"
          prop="lowestQuotation"
          v-if="type != 'opportunity'"
        />
        <el-table-column
          label="指导单价"
          align="center"
          key="guidancePrice"
          prop="guidancePrice"
          v-if="type != 'opportunity'"
        />

        <el-table-column
          label="单价"
          align="center"
          class-name="small-padding fixed-width"
          v-if="type != 'opportunity'"
        >
          <template slot-scope="{ row }">
            <el-input
              type="number"
              v-model="row.unitPrice"
              placeholder="请输入单价"
              @change="handlePrice($event, row, true)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-input-number
              v-model="row.quantity"
              size="small"
              @change="handleChange($event, row, 'quantity', true)"
              :min="0"
              :max="type == 'opportunity' ? 1 : 9999"
            ></el-input-number>
          </template>
        </el-table-column>
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
import { list } from "@/api/core/project/index";
import { delOrderProject } from "@/api/core/order";

export default {
  props: ["orderProjects", "price", "type"],
  name: "AddProject",
  computed: {
    select_total() {
      const totalMap = this.select_project.map((item) => item.quantity);
      return eval(totalMap.toString().replace(/\,/g, "+"));
    },
    price_total() {
      const priceMap = this.select_project.map(
        (item) => item.quantity * item.unitPrice
      );
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
        if (this.orderProjects && this.orderProjects.length) {
          this.unitPriceArr = this.orderProjects.map((item) => +item.unitPrice);
          this.ProjectIdArr = this.orderProjects.map((item) => item.projectId);
        }
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

      unitPriceArr: [],
      ProjectIdArr: [],
      isEdit: true, //是否可以添加项目数据
    };
  },
  mounted() {
    this.isEdit = !(this.$route.query.type == 1 && this.type === "order");
    console.log(this.isEdit);
    // this.getList();
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
    getList(boolean) {
      this.loading = true;
      list(this.queryParams).then((response) => {
        response.rows.forEach((item) => {
          item.unitPrice = item.guidancePrice;
          item.quantity = 0;
        });
        this.projectList = response.rows;
        this.total = response.total;
        // this.select_project.forEach((item) => {
        //   this.projectList.forEach((val) => {
        //     if (
        //       (item.id == val.id || item.projectId == val.id)
        //     ) {
        //     if (item.id == val.id || item.projectId == val.id) {
        //       val.quantity = item.quantity;
        //       val.unitPrice = item.unitPrice;
        //     }
        //   });
        // });
        this.loading = false;
        if (boolean) {
          this.dialogVisible = true;
        }
      });
    },

    // 同步列表数量
    asyncCount() {
      // this.select_project.forEach((item) => {
      //   this.projectList.forEach((val) => {
      //     if (item.id == val.id || item.projectId == val.id) {
      //       val.quantity = 0;
      //       val.unitPrice = "0.00";
      //     }
      //   });
      // });
      this.getList(true);
    },

    handlePrice(value, item, flag = false) {
      if (flag) {
        item.unitPrice = value;
      }
    },

    // 改变数量
    handleChange(value, item, type, flag = false) {
      console.log(value, "数量");
      if (value >= 10) {
        this.$alert("您填写的产品数量达到异常值，请确定产品数量", "异常提醒", {
          confirmButtonText: "确定",
        });
      }
      if (flag) {
        if (
          this.unitPriceArr.includes(+item.unitPrice) &&
          this.ProjectIdArr.includes(item.id)
        ) {
          this.$message.error("项目已存在，请重新选择项目");
          return;
        }
      }

      let isInclude = this.select_project.some(
        (val) =>
          (item.id == val.id || item.id == val.projectId) &&
          +item.unitPrice == +val.unitPrice
      );

      if (isInclude) {
        this.select_project.forEach((val, index, array) => {
          if (
            (val.id == item.id || item.id == val.projectId) &&
            +item.unitPrice == +val.unitPrice
          ) {
            if (value == 0) {
              array.splice(index, 1);

              this.$emit("update:orderProjects", this.select_project);

              val.quantity = 0;

              if (!this.select_project.length) {
                this.$emit("update:orderProjects", undefined);
                this.$emit("addProMet");
              }
              // val.projectId && this.delOrderProject(val.id);
            } else {
              if (type === "quantity") {
                val.quantity = value;
              }
            }
          }
        });
        this.select_project = JSON.parse(
          JSON.stringify(
            this.select_project.filter((item) => item.quantity != 0)
          )
        );
        // this.select_project.forEach((item, index) =>
        //   this.$set(this.select_project, index, item)
        // );
      } else {
        item.quantity = value;

        this.select_project.push(item);
      }
      this.$emit("update:orderProjects", this.select_project);
    },

    // 删除订单中的项目
    delOrderProject(id) {
      delOrderProject(id).then((res) => {});
    },

    // cancelAdd() {
    //   this.dialogVisible = false;
    // },
    submitAdd() {
      // console.log(12312312);
      console.log(this.select_project);

      // if (this.type !== "opportunity") {
      //   this.select_project = this.select_project.filter((item) => {
      //     if (item.isGift) {
      //       return item.quantity != 0;
      //     } else {
      //       // return item.quantity != 0 && +item.unitPrice != 0;
      //       return item.quantity != 0;
      //     }
      //   });
      // }

      this.$emit("update:orderProjects", this.select_project);
      this.$emit("addProMet");

      this.dialogVisible = false;
    },
    // 正品发生改变触发
    changeGift(row, val) {
      if (val === 1) {
        // 是赠品，价格为0
        row.unitPrice = "0.00";
      }
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
