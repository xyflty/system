// 格式化表格数据方法
import {
  formatterCallback,
  getOrderJobColor,
  htmlCallback,
} from "@/utils/common";
import { mapState } from "vuex";
import {
  xtFinancialSettlementList,
  xtFinancialSettlementSpecialOrderList,
  getFinancialCheckList,
  xtFinancialSettlementFinancialCheck,
} from "@/api/settlement";
import { xtProjectType } from "@/api/workOrderProcessing/qualification";

export const settlement = {
  data() {
    return {
      apiFn: xtFinancialSettlementList,
      parmas: null,
      pagesId: "",
      tableOption: [
        {
          label: "客户名称",
          prop: "companyName",
          width: "160px",
          sortable: true,
          fixed: true,
        },
        {
          label: "工单编号",
          prop: "orderJobCode",
          width: "160px",
          sortable: true,
        },

        {
          label: "工单类别",
          prop: "projectCategoryName",
          width: "120px",
          sortable: true,
        },
        {
          label: "项目类型",
          prop: "projectType",
          width: "120px",
          sortable: true,
        },

        {
          label: "项目产品名称",
          prop: "projectName",
          width: "240px",
          sortable: true,
        },
        {
          label: "工单作业阶段",
          prop: "rootNode",
          width: "150px",
          sortable: true,
        },
        {
          label: "工单节点动态",
          prop: "childNode",
          width: "150px",
          sortable: true,
        },
        {
          label: "超时预警",
          prop: "warnTypeString",
          isHtml: (row, column, value) => {
            return htmlCallback(value);
          },
          width: "200px",
          sortable: true,
        },
        {
          label: "收款节点",
          prop: "moneyTag",
          width: "120px",
          sortable: true,
        },
        {
          label: "节点应收款",
          prop: "planPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "节点已收款",
          prop: "actualPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "产品应收款",
          prop: "productPlanPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "产品已收款",
          prop: "productActualPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "项目应收款",
          prop: "projectPlanPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "项目已收款",
          prop: "projectActualPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "订单发起人",
          prop: "orderInitiator",
          width: "150px",
          sortable: true,
        },
        {
          label: "工单发起人",
          prop: "orderJobInitiator",
          width: "150px",
          sortable: true,
        },
        {
          label: "工单状态",
          prop: "orderJobStatus",
          width: "120px",
          sortable: true,
          isHtml: (row, column, value) => {
            let color = getOrderJobColor(this.commonData.orderJobStatus, value);
            return `<div class="circle-container">
              <span class="circle-status" style="background:${color}; box-shadow: 0 0 5px ${color};"></span>
              <span>${formatterCallback(
                this.commonData.orderJobStatus,
                value
              )}</span>
            </div>`;
          },
        },
        {
          label: "工单作业人",
          prop: "makeUserName",
          width: "120px",
          sortable: true,
        },
        {
          label: "订单编号",
          prop: "orderCode",
          width: "160px",
        },

        {
          label: "操作",
          fixed: "right",
          action: true,
          width: "120px",
          btns: [
            {
              id: "detail",
              text: "详情",
              type: "text",
              hasPermi: ["xt:financialSettlementInfo:info"],
            },
          ],
        },
      ],
      searchOptions: [],
      selectTable: [],

      spanData: [],
      pos: 0,

      // 核销
      destroyDialog: false,
      collectionOptions: [
        {
          editType: "select",
          label: "计划收款期次",
          prop: "moneyTag",
          editOptions: [
            { label: "首款", value: "首款" },
            { label: "二期款", value: "二期款" },
            { label: "三期款", value: "三期款" },
            { label: "四期款", value: "四期款" },
            { label: "五期款", value: "五期款" },
            { label: "尾款", value: "尾款" },
            { label: "全款", value: "全款" },
          ],
          attrs: {
            placeholder: "请选择计划收款期次",
          },
        },
        {
          editType: "input",
          label: "已收款金额(元)",
          prop: "actualPrice",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款主体",
          prop: "subjectName",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "select",
          label: "收款方式",
          prop: "payment",
          editOptions: [
            { label: "公户收款", value: "公户收款" },
            { label: "扫码收款", value: "扫码收款" },
          ],
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款提起人",
          prop: "launchPerson",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款经手人",
          prop: "handlePerson",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "date-picker",
          label: "收款时间",
          prop: "receiveDate",
          width: "250px",
          attrs: {
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
        },
        {
          label: "操作",
          action: true,
        },
      ],
      collectionData: [
        {
          rowEdit: true,
        },
      ],
      rowId: "", //当前选中的数据id
      isCompile: true, //判断核销是否可增删操作
    };
  },
  methods: {
    initOption() {
      this.searchOptions = [
        {
          type: "input",
          prop: "searchValue",
          placeholder: "搜索关键词",
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          prop: "projectCategory",
          placeholder: "项目类别",
          children: this.commonData.projectCategoryType,
          attrs: {
            clearable: true,
          },
        },
        // {
        //   type: "select",
        //   prop: "orderType",
        //   value: 2,
        //   placeholder: "订单类型",
        //   children: this.commonData.xtOrderType,
        //   attrs: {
        //     clearable: true,
        //   },
        // },
        {
          type: "select",
          prop: "projectType",
          placeholder: "项目类型",
          children: this.commonData.xtProjectType,
          attrs: {
            clearable: true,
          },
        },
        {
          type: "date-picker",
          prop: "orderJobLaunchTime",
          placeholder: "工单发起时间",
          attrs: {
            type: "datetime",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd hh:mm:ss",
          },
        },
      ];
    },
    setupEvents({ type, row }) {
      if (type === "detail") {
        if (this.pagesType === "特殊订单") {
          this.$router.push({
            name: "SettlementDetail",
            query: { id: row.id, type: this.pagesId },
          });
        } else {
          this.$router.push({
            name: "SettlementDetail",
            query: { id: row.orderId },
          });
        }
      } else if (type === "cancel") {
        this.rowId = row.id;

        this.getFinancialCheck(row.id);
      }
    },

    SelectionChange(list) {
      this.selectTable = list;
    },
    handleActions(type) {
      if (!this.selectTable.length)
        return this.$message.error("请选择表格数据");

      let ids = this.selectTable.map((item) => item.id);
      if (type === "cancel") {
        //
      }
    },
    tenantIdnormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.categoryName,
        children: node.children,
      };
    },
    // 项目类别
    // getProjectCategory() {
    //   xtProjectCategory().then((res) => {
    //     this.projectCategory = this.handleTree(res);
    //     let row = this.searchOptions.find(
    //       (item) => item.prop === "categoryName"
    //     );
    //     row.options = this.projectCategory;
    //   });
    // },
    // 项目类型
    async getProjectType() {
      if (!sessionStorage.getItem("XT_PROJECTTYPE_KEY")) {
        const xtProjectType = await this.$store.dispatch(
          "commonData/getProjectType"
        );
        // 第一次调用接口，值会为空，需要先赋值
        let row = this.searchOptions.find(
          (item) => item.prop === "projectType"
        );
        row.children = xtProjectType;
      }
    },
    // 根据订单id判断需要合并的行
    getSpanId(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (arr[i].orderId === arr[i - 1].orderId) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 仓处理表格数据
    getSpanData(data) {
      // 判断是否处理表格数据
      if (this.isDealTable) {
        // 重置掉上次存储的值
        this.spanData = [];
        this.pos = 0;

        let arr = [];
        data.forEach((item) => {
          if (item.xtOrderJobVoList.length) {
            item.xtOrderJobVoList = item.xtOrderJobVoList.map((ele) => {
              return {
                ...ele,
                companyName: item.companyName,
                projectActualPrice: item.projectActualPrice,
                projectPlanPrice: item.projectPlanPrice,
              };
            });
          }

          arr.push(...item.xtOrderJobVoList);
        });
        this.getSpanId(arr);
        return arr;
      } else {
        // 不处理
        return arr;
      }
    },
    // 合并单元格
    handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.isMergeCells) {
        // 判断是否合并单元格
        let obj = ["客户名称", "订单编号", "项目应收款", "项目已收款", "操作"];

        if (obj.includes(column.label) || column.type === "selection") {
          let row = this.spanData[rowIndex];
          let col = row > 0 ? 1 : 0;
          return {
            rowspan: row,
            colspan: col,
          };
        }
      } else {
        // 不合并
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
    },
    /**
     *
     * 核销逻辑start
     */
    // 核销表格新增和删除操作
    handleCollectRow(type, scope) {
      if (type === "add") {
        this.collectionData.push({
          rowEdit: true,
        });
      } else if (type === "del") {
        let index = scope.$index;
        this.collectionData.splice(index, 1);
      }
    },

    cancel() {
      this.destroyDialog = false;
      this.collectionData = [{ rowEdit: true }];
    },
    // 判断表格数据是否为空
    isTableEary(data) {
      let arr = [
        "moneyTag",
        "actualPrice",
        "subjectName",
        "payment",
        "launchPerson",
        "handlePerson",
        "receiveDate",
      ];

      return data.every((item) => {
        return arr.every((ele) => item.hasOwnProperty(ele) && item[ele] != "");
      });
    },
    // 财务结算中心-特殊订单核销
    confirm() {
      let flag = this.isTableEary(this.collectionData);
      if (!flag) return this.$message.error("请填写表格数据");
      let sendData = {
        moneyNodeList: this.collectionData,
        orderJobId: this.rowId,
      };

      xtFinancialSettlementFinancialCheck(sendData).then((res) => {
        if (res.code === 200) {
          this.$refs["tableRef"].getTableData();
          this.cancel();
          this.$message.success("已成功核销");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     *
     * 核销逻辑end
     */

    // 获取当前已核销数据
    async getFinancialCheck(orderJobId) {
      let sendData = {
        orderJobId: orderJobId,
      };
      const res = await getFinancialCheckList(sendData);
      console.log(res);
      if (res.code === 200) {
        if (res.data && res.data.length) {
          this.collectionData = res.data.map((item) => {
            return {
              ...item,
              rowEdit: true,
            };
          });
          this.isCompile = false;
        } else {
          this.isCompile = true;
        }
        console.log(this.collectionData, "this.collectionData");
        this.destroyDialog = true;
      }
    },
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      // 项目分类
      commonData: (state) => state.commonData,
    }),
    totalObj() {
      // 应收
      let receivableTotal = this.collectionData.reduce((prev, item) => {
        return (prev += +item.planPrice);
      }, 0);
      // 已收
      let receivedTotal = this.collectionData.reduce((prev, item) => {
        return (prev += +item.actualPrice);
      }, 0);

      let uncollected = receivableTotal - receivedTotal;
      return { receivableTotal, receivedTotal, uncollected };
    },
  },
  mounted() {
    this.getProjectType();
    this.initOption();
    if (this.pagesType === "特殊订单") {
      this.apiFn = xtFinancialSettlementSpecialOrderList;
    }
    this.pagesId = this.commonData.xtOrderType.find(
      (item) => item.label === this.pagesType
    ).value;
    this.parmas = {
      orderType: this.pagesId,
    };

    // this.getProjectCategory();
  },
};
