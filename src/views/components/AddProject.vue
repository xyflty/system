<template>
  <div>
    <el-button
      v-if="type !== 'show'"
      type="primary"
      plain
      @click="asyncCount"
      style="margin-bottom: 10px"
      >新增项目</el-button
    >

    <MultiTable
      border
      align="center"
      isIndex
      indexLabel="序号"
      :data="orderProjects"
      :Options="tableOption"
      :editRowIndex.sync="editRowIndex"
      :isEditRow="isEditRow"
      @setupEvents="setupEvents"
      @change="selectChange"
      @keyup="keyupEnter"
    >
      <template #total="{ scope }">{{
        scope.unitPrice * scope.quantity
      }}</template>
    </MultiTable>

    <el-dialog
      title="新增项目"
      :visible.sync="dialogVisible"
      width="60%"
      class="addDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
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
        />
        <el-table-column
          label="是否赠品"
          align="center"
          key="isGift"
          prop="isGift"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isGift"
              :true-label="1"
              :false-label="0"
              @change="(val) => isGiftChange(val, scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column
          label="指导单价"
          align="center"
          key="guidancePrice"
          prop="guidancePrice"
        />

        <el-table-column
          label="单价"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-input
              type="number"
              v-model="row.unitPrice"
              :disabled="row.isDisabled"
              placeholder="请输入单价"
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
              @change="handleChange($event, row, 'quantity')"
              :min="0"
              :max="9999"
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
      <div class="total_data flex flex-between">
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
import MultiTable from "@/components/MultiTable";
// 项目接口api
import { list } from "@/api/core/project/index";

import {
  xtOrderProjectChangeAuditItemModified,
  xtOrderProjectChangeAuditStopItemModified,
  xtOrderProjectChangeAuditNewOrderItemModified,
  xtOrderProjectChangeRecordItemModified,
  xtOrderProjectChangeAuditGetItemModifiedInfo,
  xtOrderProjectChangeRecordStopItemModified,
} from "@/api/xt";

import { cloneDeep } from "lodash";

import { formatDate } from "@/utils";

import { mapGetters } from "vuex";
export default {
  name: "AddProject",
  components: {
    MultiTable,
  },
  props: {
    type: String,
    orderProjects: Array,
    id: {
      type: [String, Number],
      default: "",
    },
    recordData: {
      type: Array,
    },
    tableRow: {
      type: Object,
    },
  },
  data() {
    return {
      tableOption: [
        {
          editType: "string",
          label: "项目分类",
          prop: "allCategoryName",
          width: "240px",
        },
        {
          editType: "string",
          label: "项目类型",
          prop: "categoryName",
          width: "150px",
        },
        {
          editType: "string",
          label: "项目名称",
          prop: "projectName",
        },
        {
          editType: "checkbox",
          label: "是否赠品",
          prop: "isGift",
          width: "120px",
          formatter: (row, column, val) => {
            return ["否", "是"][val];
          },
          attrs: {
            trueLabel: 1,
            falseLabel: 0,
          },
        },
        {
          editType: "input",
          // editType: "string",
          label: "单价",
          prop: "unitPrice",
          width: "120px",
          attrs: {
            type: "number",
          },
        },
        {
          editType: "input-number",
          label: "数量",
          prop: "quantity",
          width: "150px",
          attrs: {
            min: 0,
            max: 9999,
            style: "width:130px",
          },
        },
        {
          label: "总价",
          slotName: "total",
          width: "120px",
        },
        {
          label: "操作",
          action: true,
          width: "120px",
          fixed: "right",
          btns: [
            {
              id: "update",
              text: "改单",
              type: "text",
            },
            {
              id: "stop",
              text: "停单",
              type: "text",
            },
          ],
          rowEditBtn: [
            {
              id: "confirm",
              text: "确定",
              type: "text",
            },
            {
              id: "cancel",
              text: "取消",
              type: "text",
            },
          ],
        },
      ], //表格配置信息

      editRowIndex: "", //标识符
      isEditRow: false,

      // 新增项目 start
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

      rowItem: {}, //存储当前修改的那条数据
      // 新增项目 end

      unitPriceArr: [],
      ProjectIdArr: [],
      isRepetitionProjectId: [],
    };
  },
  methods: {
    // 同步列表数量
    asyncCount() {
      (this.select_project = []), this.getList(true);
    },
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
        this.loading = false;
        if (boolean) {
          this.dialogVisible = true;
        }
      });
    },
    // isExists() {
    //   return this.select_project.filter(
    //     (item) =>
    //       this.unitPriceArr.includes(+item.unitPrice) &&
    //       this.ProjectIdArr.includes(item.id)
    //   );
    // },
    // handlePrice(value, item) {
    //   item.quantity = 0;
    // },
    isGiftChange(val, row) {
      console.log(val);
      if (val) {
        row.unitPrice = "0.00";
      }
      row.isDisabled = val ? true : false;
    },

    // 改变数量
    handleChange(value, item, type) {
      if (
        this.unitPriceArr.includes(+item.unitPrice) &&
        this.ProjectIdArr.includes(item.id)
      ) {
        this.$message.error("项目已存在，请重新选择项目");
        return;
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
              if (type === "quantity") {
                array.splice(index, 1);

                // this.$emit("update:orderProjects", this.select_project);

                val.quantity = 0;

                // val.projectId && this.delOrderProject(val.id);
              }
            } else {
              val[type] = value;
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
        item[type] = value;
        if (type === "quantity") {
          this.select_project.push(item);
        }
      }
    },
    // 新增项目回调
    addProjectCallback() {
      let newArr = this.select_project
        .filter((item) => {
          if (item.isGift) {
            return item.quantity;
          } else {
            return +item.unitPrice && item.quantity;
          }
        })
        .map((item) => {
          return {
            projectCategoryName: item.allCategoryName,
            projectName: item.projectName,
            projectType: item.categoryName,
            isGift: item.isGift,
            changeType: item.isGift ? 6 : 5,
            originalUnitPrice: item.unitPrice,
            originalQuantity: item.quantity,
            changeUnitPrice: "",
            changeQuantity: "",
            createTime: formatDate(Date.now()),
            orderId: this.id,
            projectId: item.id,
            customerName: this.tableRow.companyName,
            orderCode: this.tableRow.orderCode,
            orderType: this.tableRow.orderType,
            changeUserId: this.userId,
          };
        });

      this.recordData.push(...newArr);
      this.dialogVisible = false;
    },

    submitAdd() {
      this.select_project.forEach((item) => {
        if (!item.hasOwnProperty("isGift") || item.isGift == null) {
          this.$set(item, "isGift", 0);
        } else {
          this.$set(item, "isGift", item.isGift);
        }
      });

      if (this.type === "once") {
        let isFlag = this.select_project.every((item) => {
          if (item.isGift) {
            return item.quantity;
          } else {
            return +item.unitPrice && item.quantity;
          }
        });

        if (!isFlag) return this.$message.error("项目单价或者数量不能为0");
        // 订单配置
        let sendData = this.select_project.map((item) => {
          return {
            ...item,
            projectId: item.id,
            orderId: this.id,
          };
        });
        console.log(sendData);

        if (sendData.length) {
          xtOrderProjectChangeAuditNewOrderItemModified(sendData).then(
            async (res) => {
              if (res.code === 200) {
                let ids = res.data;
                const result =
                  await xtOrderProjectChangeAuditGetItemModifiedInfo(this.id);
                console.log(result);
                let list = result.data.xtOrderProjectChangeAuditList.filter(
                  (item) => ids.includes(item.id)
                );
                console.log(list);
                this.recordData.push(...list);
                this.dialogVisible = false;
              } else {
                this.$message.error(res.msg);
              }
            }
          );
        } else {
          this.dialogVisible = false;
        }
      } else if (this.type === "twice") {
        // 订单中心项目变更
        this.addProjectCallback();
      }
    },
    // 正品发生改变触发
    changeGift(row, val) {
      if (val === 1) {
        // 是赠品，价格为0
        row.unitPrice = "0.00";
      }
    },
    // 改单
    xtUpdateProject(row) {
      // let fn = null;
      // if (this.type === "twice") {
      //   fn = xtOrderProjectChangeRecordItemModified;
      // } else {
      //   fn = ;
      // }
      xtOrderProjectChangeAuditItemModified(row).then((res) => {
        if (res.code === 200) {
          // 获取旧的数量
          let orderQuantity = this.rowItem.quantity;
          //  获取旧的单价
          let orderUnitPrice = this.rowItem.unitPrice;
          let olderIsGift = this.rowItem.isGift;
          // 获取当前的数据
          const { quantity, unitPrice, isGift } = row;
          this.$message.success("已改单");
          if (olderIsGift !== isGift && isGift === 1) {
            // 说明修改了是否正品并且修改为赠品
            this.generateData(row, this.rowItem, 6, res.data);
            return;
          }
          // let quantity = row.quantity;
          // let unitPrice = row.unitPrice;
          if (quantity > orderQuantity || +unitPrice > +orderUnitPrice) {
            // 增单 为2

            this.generateData(row, this.rowItem, 2, res.data);
          } else if (quantity < orderQuantity || +unitPrice < +orderUnitPrice) {
            // 减单 为3
            this.generateData(row, this.rowItem, 3, res.data);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // // 停单
    stopProject(row) {
      let sendData = {
        orderId: this.id,
        ...row,
      };
      // let fn = null;
      // if (this.type === "twice") {
      //   fn = xtOrderProjectChangeRecordStopItemModified;
      // } else {
      //   fn = ;
      // }
      xtOrderProjectChangeAuditStopItemModified(sendData).then((res) => {
        if (res.code === 200) {
          this.generateData(row, this.rowItem, 4, res.data);
          this.$message.success("已停单");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 生成项目变更记录数据
    generateData(row, oldRow, status, id = "") {
      let item = {
        ...oldRow,
        projectCategoryName: row.allCategoryName,
        projectName: row.projectName,
        projectType: row.categoryName,
        isGift: row.isGift,
        changeType: status,
        originalUnitPrice: oldRow.unitPrice,
        originalQuantity: oldRow.quantity,
        changeUnitPrice: status == 4 ? "" : row.unitPrice,
        changeQuantity: status == 4 ? "" : row.quantity,

        createTime: formatDate(Date.now()),
        orderId: this.id,
        projectId: row.projectId,
        orderProjectId: row.id,
        customerName: this.tableRow.companyName,
        orderCode: this.tableRow.orderCode,
        orderType: this.tableRow.orderType,
        changeUserId: this.userId,
        id: id,
      };

      !id && delete item.id; //删除id
      row.unitPrice = oldRow.unitPrice;
      row.quantity = oldRow.quantity;
      row.isGift = oldRow.isGift;

      console.log({ item });

      this.recordData.push(item);
    },
    // 表格确定回调
    confirmCallback(row) {
      // 获取旧的数量
      let orderQuantity = this.rowItem.quantity;
      // //  获取旧的单价
      let orderUnitPrice = this.rowItem.unitPrice;
      let olderIsGift = this.rowItem.isGift;

      // 获取当前的数据
      const { quantity, unitPrice, isGift } = row;

      if (isGift === 0 && !+unitPrice) {
        this.$message.error("请填写单价");
        row.isGift = olderIsGift;
        row.unitPrice = orderUnitPrice;
        return;
      }

      // let quantity = row.quantity;
      // let unitPrice = row.unitPrice;

      if (this.type === "once") {
        if (olderIsGift !== isGift && isGift === 1) {
          // 说明修改了是否正品并且修改为赠品
          row.changeType = 6;

          this.xtUpdateProject(row);
          return;
        }

        // 订单配置
        if (quantity == 0) {
          // 停单
          this.stopProject(row);
        } else if (quantity !== orderQuantity || orderUnitPrice !== unitPrice) {
          // 调用改动接口
          this.xtUpdateProject(row);
        }
      } else if (this.type === "twice") {
        if (olderIsGift !== isGift && isGift === 1) {
          // 说明修改了是否正品并且修改为赠品
          this.generateData(row, this.rowItem, 6);
          return;
        }
        // 订单中心配置
        if (quantity == 0) {
          // 停单
          this.generateData(row, this.rowItem, 4);
        } else if (quantity > orderQuantity || +unitPrice > +orderUnitPrice) {
          // 增单 为2
          this.generateData(row, this.rowItem, 2);
        } else if (quantity < orderQuantity || +unitPrice < +orderUnitPrice) {
          // 减单 为3

          this.generateData(row, this.rowItem, 3);
        }
      }
    },
    // 删除回调
    removeCallBack(row) {
      this.$confirm("停单操作会删除相关工单，是否确认停单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.rowItem = cloneDeep(row);
          // 停单
          this.isEditRow = false;
          if (this.type === "once") {
            // 订单配置
            this.stopProject(row);
          } else if (this.type === "twice") {
            // 订单中心配置
            this.generateData(row, this.rowItem, 4);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 表格行操作
    setupEvents({ type, row }) {
      console.log(type, row);
      if (type === "update") {
        this.isDisabledUnitPrice(row);
        this.rowItem = cloneDeep(row);
        this.isEditRow = true;
        this.editRowIndex = "update";
      } else if (type === "stop") {
        this.removeCallBack(row);
      } else if (type === "confirm") {
        // 表格确定操作
        this.confirmCallback(row);
      } else if (type === "cancel") {
        // 取消

        const { quantity, unitPrice, isGift } = this.rowItem;
        row.quantity = quantity;
        row.unitPrice = unitPrice;
        row.isGift = isGift;
      }
    },
    isDisabledUnitPrice(row) {
      let optionItem = this.tableOption.find(
        (item) => item.prop === "unitPrice"
      );
      if (row.isGift == 1) {
        optionItem.attrs.disabled = true;
      } else {
        optionItem.attrs.disabled = false;
      }
    },
    // 表格表单值改变触发
    selectChange({ val, item, row }) {
      if (item.prop === "isGift") {
        this.isDisabledUnitPrice(row);
        // 赠品
        if (val === 1) {
          row.unitPrice = "0.00";
        }
      } else if (item.prop === "unitPrice") {
        if (row.isGift === 1) return;

        if (this.isRepetitionProjectId.length) {
          // 原始项目操作重复的id，限制相同项目id，价格不能一致
          let flag =
            this.unitPriceArr.includes(+val) &&
            this.isRepetitionProjectId.includes(row.projectId);
          if (flag) {
            this.$message.error("项目已存在,请重新输入单价");
            row.unitPrice = this.rowItem.unitPrice;
          }
        }
      }
    },
    keyupEnter(row) {
      row.rowEdit = false;

      this.confirmCallback(row);
    },
  },
  mounted() {
    if (this.type === "show") {
      this.tableOption.splice(this.tableOption.length - 1, 1);
    }
    if (this.orderProjects && this.orderProjects.length) {
      this.unitPriceArr = this.orderProjects.map((item) => +item.unitPrice);
      this.ProjectIdArr = this.orderProjects.map((item) => item.projectId);
      // 判断源数据中是否有重复项目id
      this.isRepetitionProjectId = this.ProjectIdArr.filter(
        (item) =>
          this.ProjectIdArr.indexOf(item) != this.ProjectIdArr.lastIndexOf(item)
      );
    }
  },
  computed: {
    ...mapGetters(["userId"]),
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
    // select_project: {
    //   handler(n) {
    //
    //     this.$emit("update:price", this.price_total);
    //   },
    //   deep: true,
    // },
    orderProjects: {
      handler(n) {
        this.select_project = Object.assign([], this.orderProjects);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang='scss' scoped>
</style>