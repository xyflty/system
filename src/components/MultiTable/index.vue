<template>
  <div class="multiTable">
    <!-- 搜索表单 -->
    <div class="search-form" v-if="isSearchForm">
      <MyForm
        inline
        v-bind="searchAttrs"
        :formOptions="searchOptions"
        @treeSelect="treeSelect"
      >
        <template #formAction="{ form, model }">
          <div v-if="$scopedSlots['searchActions']">
            <slot name="searchActions" :form="form" :model="model"></slot>
          </div>

          <div v-else>
            <div class="btns">
              <el-button
                class="btn"
                type="primary"
                @click="handleSearch(form, model)"
                >{{ searchConfirm }}</el-button
              >
              <el-button @click="handleReset(form, model)">{{
                searchCancel
              }}</el-button>
            </div>
          </div>
        </template>
      </MyForm>
    </div>

    <div class="table-page">
      <!-- 表格操作区域 -->
      <div class="actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
      <!-- 表格 -->
      <el-table
        ref="tablerRef"
        :key="itemKey"
        :class="{ tableBox: isShowAllSelect }"
        :data="tableData"
        v-loading="loading"
        :element-loading-text="elementLoadingText"
        :element-loading-svg-view-box="elementLoadingSvgViewBox"
        :element-loading-spinner="elementLoadingSpinner"
        :element-loading-background="elementLoadingBackground"
        @selection-change="handleSelectionChange"
        @current-change="tableCurrent"
        @row-click.self="rowClick"
        @sort-change="sortChange"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <!-- 多选 -->
        <el-table-column
          v-if="isSelection"
          type="selection"
          :reserve-selection="reserveSelection"
          width="55"
          :align="align"
          :selectable="selectable"
        ></el-table-column>
        <!-- 单选 -->
        <el-table-column
          :label="indexLabel"
          v-if="isIndex"
          type="index"
          width="50"
          :align="align"
        >
        </el-table-column>
        <!-- 表格数据 -->
        <template v-for="item in tableOption">
          <template v-if="item.ColumnSlot">
            <slot :name="item.ColumnSlot"></slot>
          </template>
          <template v-else>
            <el-table-column
              v-if="item.visible === false ? false : true"
              show-overflow-tooltip
              :key="item.prop"
              :align="align"
              v-bind="item"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.rowEdit">
                  <div v-if="item.slotName">
                    <slot
                      :name="item.slotName"
                      :scope="scope.row"
                      :index="scope.$index"
                    ></slot>
                  </div>
                  <div v-else>
                    <el-select
                      v-if="item.editType === 'select'"
                      v-model="scope.row[item.prop]"
                      v-bind="item.attrs"
                      @change="handleChange($event, item)"
                      @keyup.enter.native="submit(scope.row)"
                    >
                      <el-option
                        v-for="option in item.editOptions"
                        :key="option.vlaue"
                        v-bind="option"
                      ></el-option>
                    </el-select>

                    <el-date-picker
                      v-if="item.editType === 'date-picker'"
                      v-model="scope.row[item.prop]"
                      v-bind="item.attrs"
                      @change="handleChange($event, item, scope.row)"
                    ></el-date-picker>

                    <el-input
                      v-if="item.editType === 'input'"
                      v-model="scope.row[item.prop]"
                      v-bind="item.attrs"
                      @change="handleChange($event, item, scope.row)"
                      @keyup.enter.native="submit(scope.row)"
                    ></el-input>
                    <el-input-number
                      v-if="item.editType === 'input-number'"
                      v-model="scope.row[item.prop]"
                      v-bind="item.attrs"
                      @change="handleChange($event, item, scope.row)"
                      @keyup.enter.native="submit(scope.row)"
                    ></el-input-number>
                    <el-checkbox
                      v-if="item.editType === 'checkbox'"
                      v-model="scope.row[item.prop]"
                      v-bind="item.attrs"
                      @change="handleChange($event, item, scope.row)"
                      >{{ item.label }}</el-checkbox
                    >
                    <span v-if="item.editType === 'string'">{{
                      scope.row[item.prop]
                    }}</span>
                  </div>
                </div>

                <template v-else>
                  <div v-if="item.slotName">
                    <slot :name="item.slotName" :scope="scope.row"></slot>
                  </div>
                  <template v-else>
                    <div v-if="item.currentRow">
                      <component
                        :is="`el-input-number`"
                        v-model="scope.row[item.prop]"
                        v-bind="item.attrs"
                        @change="handleChange($event, item, scope.row)"
                      ></component>
                    </div>
                    <template v-else>
                      <span
                        v-if="item.isHtml"
                        v-html="
                          item.isHtml(
                            scope.row,
                            scope.column,
                            scope.row[item.prop]
                          )
                        "
                      ></span>

                      <span
                        class="click--active"
                        v-else-if="item.isCheck"
                        @click="viewClick(scope.row, scope.column, item)"
                        >{{ scope.row[item.prop] }}</span
                      >
                      <span v-else>{{
                        item.formatter
                          ? item.formatter(
                              scope.row,
                              scope.column,
                              scope.row[item.prop]
                            )
                          : scope.row[item.prop] !== "" &&
                            scope.row[item.prop] !== null
                          ? scope.row[item.prop]
                          : "--"
                      }}</span>
                    </template>
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>
        </template>

        <!-- 操作项 -->
        <el-table-column
          v-if="actionOptions"
          :align="align"
          v-bind="actionOptions"
        >
          <template #default="scope">
            <div v-if="scope.row.rowEdit">
              <template v-for="item in actionOptions.rowEditBtn">
                <el-button
                  v-if="item.hasPermi"
                  :key="item.id"
                  v-hasPermi="item.hasPermi"
                  :type="item.type"
                  v-bind="item"
                  @click="setupEvents(item.id, scope.row)"
                  >{{ item.text }}</el-button
                >
                <el-button
                  v-else
                  :key="item.id"
                  :type="item.type"
                  v-bind="item"
                  @click="setupEvents(item.id, scope.row)"
                  >{{ item.text }}</el-button
                >
              </template>
              <slot name="editRowOperation" :scope="scope"></slot>
            </div>
            <div v-else>
              <slot name="operation" :scope="scope"></slot>
              <template v-for="item in actionOptions.btns">
                <el-button
                  v-if="item.hasPermi"
                  :key="item.id"
                  v-hasPermi="item.hasPermi"
                  :type="item.type"
                  v-bind="item"
                  @click="setupEvents(item.id, scope.row)"
                  >{{ item.text }}</el-button
                >
                <el-button
                  v-else
                  :key="item.id"
                  :type="item.type"
                  v-bind="item"
                  @click="setupEvents(item.id, scope.row)"
                  >{{ item.text }}</el-button
                >
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div
        class="pagination"
        v-if="isPagination && tableTotal"
        :style="`justify-content:${pagingLocation}`"
      >
        <el-pagination
          :page-size="pager.pageSize"
          :current-page="pager.pageNum"
          :page-sizes="pager.sizes"
          v-bind="pager"
          :total="tableTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MyForm from "../MyForm";
import cloneDeep from "lodash/cloneDeep";

/**
 * 暴露事件
 *  表格行操作  setupEvents(type,row)  type当前类型 ，row当前行数据
 *  表格单选操作   tableCurrent
 *  表格多选操作    SelectionChange
 *  切换页码      SizeChange      表格数据传入需要使用
 *  切换当前页      CurrentChange      表格数据传入需要使用
 *  切换表单筛选      search      表格数据传入需要使用
 *  切换表单重置      reset      表格数据传入需要使用
 */
export default {
  name: "MultiTable",
  components: {
    MyForm,
  },
  props: {
    // 如果有传api,data不生效
    api: {
      type: Function,
    },
    // 父组件传递过来的表格数据
    data: {
      type: Array,
    },
    // 使用data传入，需要传入total,分页总页数
    total: {
      type: Number,
      default: 0,
    },
    parmas: {
      type: Object,
      default: () => {},
    },
    // 表格表格头数据
    Options: {
      type: Array,
      required: true,
    },
    // 是否开启多选
    isSelection: Boolean,
    selectable: Function,
    reserveSelection: Boolean,
    // 是否开启单选
    isIndex: Boolean,
    indexLabel: String,
    // 是否显示全选选择框
    isShowAllSelect: {
      type: Boolean,
      default: true,
    },
    // 表格对齐方式
    align: {
      type: String,
      default: "left",
    },
    // 是否开启分页
    isPagination: {
      type: Boolean,
      default: false,
    },
    // 表格分页配置信息,data传入需要配置分页信息
    paginationAttrs: {
      type: Object,
    },
    // 分页位置
    paginationLocation: {
      type: String,
      default: "right",
    },
    // 表格数据加载配置
    elementLoadingText: String,
    elementLoadingBackground: String,
    elementLoadingSpinner: String,
    elementLoadingSvgViewBox: String,

    // 是否有搜索表单
    isSearchForm: {
      type: Boolean,
      default: false,
    },
    // 配置搜索表单
    searchOptions: {
      type: Array,
      default: () => [],
    },
    // 搜索表单的基础配置
    searchAttrs: {
      type: Object,
    },
    searchConfirm: {
      type: String,
      default: "查询",
    },
    searchCancel: {
      type: String,
      default: "重置",
    },
    // 是否可编辑
    isEditRow: {
      type: Boolean,
      default: false,
    },
    // 编辑的标识符
    editRowIndex: {
      type: String,
      default: "",
    },
    // // 是否使用筛选表单按钮插槽
    // isUserSearchAction: {
    //   type: Boolean,
    //   default: false,
    // },
    // 用于处理合并表格的数据处理方法
    getSpanData: {
      type: Function,
    },
    isSlice: Boolean,
    sliceNum: Number,
  },

  data() {
    return {
      cloneDeepData: [],
      tableData: [],
      tableTotal: 0,
      pager: {}, //分页配置
      loading: false,
      searchForm: {},
      cloneEditRowIndex: this.editRowIndex,
      itemKey: false,
    };
  },
  methods: {
    initPagination() {
      this.pager = {
        pageNum: 1,
        pageSize: 10,
        sizes: [10, 20, 30, 50, 100],
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pagerCount: 7,
        ...this.paginationAttrs,
      };
    },
    // 克隆表格数据（父组件传入数据）
    cloneDeepTable() {
      this.cloneDeepData = cloneDeep(this.data);
      this.tableData = this.isSlice
        ? this.cloneDeepData.slice(0, this.sliceNum)
        : this.data;

      this.tableTotal = this.total;
      this.loading = false;
    },
    getTableData() {
      this.loading = true;

      if (this.api) {
        // 使用接口
        let sendData = {};

        if (this.isPagination) {
          // sendData.pageNum = this.pager.pageNum;
          // sendData.pageSize = this.pager.pageSize;
          sendData = {
            ...this.parmas,
            ...this.searchForm,
            pageNum: this.pager.pageNum,
            pageSize: this.pager.pageSize,
          };
        } else {
          sendData = {
            ...this.searchForm,
            ...this.parmas,
          };
        }

        if (this.SelectLabel.length) {
          this.SelectLabel.forEach((item) => {
            if (this.searchForm.hasOwnProperty(item.prop)) {
              if (!this.searchForm[item.prop]) {
                sendData[item.dataProp] = "";
              }
              delete sendData[item.prop];
            }
          });
        }

        this.api(sendData)
          .then((res) => {
            this.tableData = res.rows;
            this.tableTotal = res.total;
            this.loading = false;
            this.tableData.map((item) => (item.rowEdit = false));
            if (this.getSpanData) {
              this.tableData = this.getSpanData(this.tableData, res);
            }
          })
          .catch((err) => {
            this.loading = false;
          });
      } else {
        // 传递进来的数据
        this.cloneDeepTable();
      }
    },

    // 表格行操作
    setupEvents(type, row) {
      this.$emit("setupEvents", { type, row });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.$emit("SelectionChange", val);
    },
    // 单选操作
    tableCurrent(val) {
      this.$emit("tableCurrent", val);
    },
    // 切换页码
    handleSizeChange(size) {
      if (this.api) {
        this.pager.pageSize = size;
        this.pager.pageNum = 1;

        this.getTableData();
      } else {
        this.$emit("SizeChange", size);
      }
    },
    // 切换当前页
    handleCurrentChange(current) {
      if (this.api) {
        this.pager.pageNum = current;
        this.getTableData();
      } else {
        this.$emit("CurrentChange", current);
      }
    },
    // 筛选表单提交和重置
    handleSearch(form, model) {
      if (this.api) {
        this.pager.pageNum = 1;
        this.searchForm = model;
        this.getTableData();
      } else {
        // 父组件传递数据
        this.$emit("search", { form, model });
      }
    },
    handleReset(form, model) {
      if (this.api) {
        this.pager.pageNum = 1;
        form.resetFields();
        this.getTableData();
      } else {
        // 父组件传递数据
        this.$emit("reset", { form, model });
      }
    },
    // 点击表格行触发的方法
    rowClick(row, column) {
      if (column?.label === this.actionOptions?.label) {
        if (this.isEditRow && this.cloneEditRowIndex === this.editRowIndex) {
          // row.rowEdit=!row.rowEdit
          this.$set(row, "rowEdit", !row.rowEdit);
          this.tableData.map((item) => {
            if (item !== row) item.rowEdit = false;
          });
          // 刷新表格页面
          this.itemKey = !this.itemKey;
          // 重置标识符
          if (!row.rowEdit) this.$emit("update:editRowIndex", "");
        }
      }
    },
    sortChange({ column, prop, order }) {
      this.$emit("sort", { column, prop, order });
    },
    treeSelect({ data, model, prop }) {
      this.$nextTick(() => {
        this.searchForm[prop] = data.label;
      });
    },
    getQueryParams() {
      return {
        ...this.parmas,
        ...this.searchForm,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
      };
    },
    handleChange(val, item, row) {
      this.$emit("change", { val, item, row });
    },
    submit(row) {
      this.$emit("keyup", row);
    },

    viewClick(row, column, item) {
      this.$emit("view", { row, column, item });
    },
  },

  mounted() {
    this.initPagination();
    this.getTableData();

    this.$refs.getTableData = this.getTableData;
    this.$refs.getQueryParams = this.getQueryParams;
    this.$refs.clearSelection = this.$refs["tablerRef"].clearSelection;
    this.toggleRowSelection = this.$refs["tablerRef"].toggleRowSelection;
  },
  computed: {
    tableOption() {
      return this.Options.filter((item) => !item.hasOwnProperty("action"));
    },
    actionOptions() {
      return this.Options.find((item) => item.action);
    },
    SelectLabel() {
      return this.searchOptions.filter((item) => item.isSelectLabel);
    },
    pagingLocation() {
      switch (this.paginationLocation) {
        case "right":
          return "flex-end";
        case "center":
          return "center";
        case "left":
          return "flex-start";
      }
    },
  },
  watch: {
    parmas: {
      handler(val) {
        if (!val) return;
        const { pageSize, pageNum } = val;
        // this.searchForm = { ...this.searchForm, ...this.parmas };

        if (pageSize && pageNum) {
          this.pager.pageNum = pageNum;
          this.pager.pageSize = pageSize;
        }
        if (this.pager.pageNum) {
          this.getTableData();
        }
      },
      deep: true,
      // immediate: true,
    },
    searchForm: {
      handler(val) {
        // this.getTableData();
      },
      deep: true,
    },
    data: {
      handler() {
        this.cloneDeepTable();
      },
      deep: true,
    },
    editRowIndex(val) {
      if (val) this.cloneEditRowIndex = val;
    },
    isSlice(newVal) {
      if (newVal) {
        this.tableData = this.data.slice(0, this.sliceNum);
      } else {
        this.tableData = this.cloneDeepData;
      }
    },
    Options: {
      handler(val) {
        if (this.$refs["tablerRef"] && this.$refs["tablerRef"].doLayout) {
          this.$refs["tablerRef"].doLayout();
          // 刷新表格页面
          this.itemKey = !this.itemKey;
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.multiTable {
  .actions {
    padding: 15px 0;
  }

  .pagination {
    display: flex;

    padding: 20px 10px;
  }
}

::v-deep.tableBox {
  .el-table__header {
    .el-table-column--selection {
      .cell {
        .el-checkbox {
          display: none;
        }
      }
    }
  }
}

// ::v-deep.el-table--scrollable-x {
//   .el-table__body-wrapper::-webkit-scrollbar {
//     width: 25px;
//     height: 17px;
//   }

//   .el-table__body-wrapper::-webkit-scrollbar-thumb {
//     background-color: #ddd;
//     border-radius: 12px;
//   }
// }

.click--active {
  color: #409eff;
  cursor: pointer;
}
</style>
