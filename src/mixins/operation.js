// 资质工单接口导入
import { xtOrderJobCenterList } from "@/api/workOrderOperation";
import {
  xtProjectCategory,
  xtProjectType,
} from "@/api/workOrderProcessing/qualification";
import {
  getFinancialCheckList,
  xtFinancialSettlementFinancialCheck,
} from "@/api/settlement";
// 格式化表格数据方法
import {
  formatterCallback,
  getOrderJobColor,
  htmlCallback,
} from "@/utils/common";

import { mapState } from "vuex";
export const operation = {
  data() {
    return {
      // 表格数据接口
      apiFn: xtOrderJobCenterList,
      parmas: null,
      pagesId: "",
      //   表格配置信息
      tableOptions: [
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
          label: "订单类型",
          prop: "orderType",
          width: "160px",
          sortable: true,
          formatter: (row, column, value) => {
            return formatterCallback(this.commonData.xtOrderType, value);
          },
        },
        {
          label: "工单类别",
          prop: "projectCategoryName",
          width: "150px",
          sortable: true,
        },
        {
          label: "项目类型",
          prop: "projectType",
          width: "150px",
          sortable: true,
        },
        {
          label: "项目产品名称",
          prop: "projectName",
          width: "240px",
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
          label: "节点未收款",
          prop: "balancePrice",
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
          label: "产品未收款",
          prop: "productBalancePrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "紧急程度",
          prop: "emergencyStatus",
          width: "150px",
          sortable: true,
          formatter: (row, column, value) => {
            return formatterCallback(this.emergencyStatus, value);
          },
        },
        {
          label: "服务顾问（制）",
          prop: "makeUserName",
          width: "150px",
          sortable: true,
        },
        {
          label: "服务顾问（审）",
          prop: "auditUserName",
          width: "150px",
          sortable: true,
        },
        {
          label: "财务顾问",
          prop: "financeAdvisor",
          width: "150px",
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
          label: "工单提交时间",
          prop: "orderJobSubmitTime",
          width: "150px",
          sortable: true,
        },
        {
          label: "期望完成时间",
          prop: "promiseTime",
          width: "150px",
          sortable: true,
        },
        {
          label: "订单编号",
          prop: "orderCode",
          width: "160px",
        },

        {
          label: "操作",
          width: "150px",
          action: true,
          fixed: "right",
          btns: [
            {
              id: "detail",
              text: "详情",
              type: "text",
              hasPermi: ["xt:orderJobCenter:info"],
            },
            {
              id: "job",
              text: "作业",
              type: "text",
              hasPermi: ["xt:orderJobCenter:job"],
            },
          ],
        },
      ],
      //   筛选表单配置信息
      searchOptions: [],

      // 核销
      destroyVisible: false,
      isCompile: false,
      collectionData: [
        {
          rowEdit: true,
        },
      ],
      rowId: "",
    };
  },
  methods: {
    getSpanData(data) {
      data.forEach((item) => {
        const {
          planPrice,
          actualPrice,
          balancePrice,
          productPlanPrice,
          productActualPrice,
          productBalancePrice,
        } = item.moneyNodeVoList[0];
        item.planPrice = planPrice;
        item.actualPrice = actualPrice;
        item.balancePrice = balancePrice;
        item.productPlanPrice = productPlanPrice;
        item.productActualPrice = productActualPrice;
        item.productBalancePrice = productBalancePrice;
      });

      return data;
    },
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
          type: "treeselect",
          prop: "categoryName",
          placeholder: "项目类别",
          options: [],
          attrs: {
            style: "width:250px",
            placeholder: "请选择项目类别",
            normalizer: this.tenantIdnormalizer,
          },
          isSelectLabel: true, //是否选择label值
          dataProp: "projectCategoryName", //数据中label值的prop
        },
        {
          type: "select",
          prop: "orderType",
          placeholder: "订单类型",
          children: this.commonData.xtOrderType,
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          prop: "projectType",
          placeholder: "项目类型",
          children: [],
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          prop: "orderJobStatus",
          placeholder: "工单状态",
          children: this.commonData.orderJobStatus,
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
    // 表格当前行操作
    setupEvents({ type, row }) {
      if (type === "detail") {
        // 详情
        this.$router.push({
          name: "OperationDetail",
          query: {
            id: row.id,
            pagesId: this.pagesId,
            projectId: row.projectId,
          },
        });
      } else if (type === "job") {
        // 详情
        this.$router.push({
          name: "OperationDetail",
          query: {
            id: row.id,
            pagesId: this.pagesId,
            projectId: row.projectId,
            type: "job",
          },
        });
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
    getProjectCategory() {
      xtProjectCategory().then((res) => {
        this.projectCategory = this.handleTree(res);
        let row = this.searchOptions.find(
          (item) => item.prop === "categoryName"
        );
        row.options = this.projectCategory;
      });
    },
    // 项目类型
    getProjectType() {
      xtProjectType().then((res) => {
        let arr = res.map((item) => {
          return {
            label: item,
            value: item,
          };
        });

        this.projectType = arr;

        let row = this.searchOptions.find(
          (item) => item.prop === "projectType"
        );
        row.children = this.projectType;
      });
    },
    // 标记当前表格行变色
    tableRowClassName: function ({ row, rowIndex }) {
      if (row.isOperateUser) {
        return "warm-row";
      }
    },
    async getFinancialCheck(orderJobId) {
      this.rowId = orderJobId;
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
        this.destroyVisible = true;
      }
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
    destroySubmit() {
      console.log(this.collectionData, "hhh1");
      let flag = this.isTableEary(this.collectionData);
      if (!flag) return this.$message.error("请填写表格数据");
      let sendData = {
        moneyNodeList: this.collectionData,
        orderJobId: this.rowId,
      };

      xtFinancialSettlementFinancialCheck(sendData).then((res) => {
        if (res.code === 200) {
          this.$refs["tableRef"].getTableData();
          this.destroyCancel();
          this.$message.success("已成功核销");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    destroyCancel() {
      this.destroyVisible = false;
      this.rowId = "";
      this.collectionData = [
        {
          rowEdit: true,
        },
      ];
    },
  },
  mounted() {
    this.initOption();
    this.getProjectCategory();
    this.getProjectType();
    this.pagesId = this.projectCategoryType.find(
      (item) => item.label === this.pagesType
    ).value;
    this.parmas = {
      projectCategory: this.pagesId,
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
      projectCategoryType: (state) => state.commonData.projectCategoryType,
      handleType: (state) => state.commonData.handleType,
      emergencyStatus: (state) => state.commonData.emergencyStatus,
      orderJobStatus: (state) => state.commonData.orderJobStatus,
    }),
  },
};
