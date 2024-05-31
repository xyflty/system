// 格式化表格数据方法
import {
  formatterCallback,
  getOrderJobColor,
  htmlCallback,
} from "@/utils/common";

import { mapState } from "vuex";
import {
  xtOrderJobList,
  xtOrderJobAuditPass,
  xtOrderJobAuditNotPass,
  xtOrderJobAssignment,
  xtOrderJobRespite,
  xtOrderJobWithdraw,
  xtProjectCategory,
  xtProjectType,
  xtOrderJobExitOrder,
  xtOrderJobSubmitAudit,
} from "@/api/workOrderProcessing/qualification";
export const processing = {
  data() {
    return {
      // 表格数据接口
      apiFn: xtOrderJobList,
      // 接口参数
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
          prop: "orderJobCode", //1
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
        }, //1
        {
          label: "项目类别",
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
          label: "工单作业节点",
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
          label: "紧急程度",
          prop: "emergencyStatus",
          width: "150px",
          sortable: true,
          formatter: (row, column, value) => {
            return formatterCallback(this.emergencyStatus, value);
          },
        }, //1
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
          label: "服务顾问（制）",
          prop: "makeUserName",
          width: "150px",
          sortable: true,
        }, //1
        {
          label: "服务顾问（审）",
          prop: "auditUserName",
          width: "150px",
          sortable: true,
        }, //1
        {
          label: "财务顾问",
          prop: "financeAdvisor",
          width: "150px",
          sortable: true,
        }, //1
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
          label: "承诺完成时间",
          prop: "promiseTime",
          width: "150px",
          sortable: true,
        }, //1
        {
          label: "处理类型",
          prop: "handleType",
          width: "150px",
          sortable: true,
          formatter: (row, column, value) => {
            return formatterCallback(this.handleType, value);
          },
        }, //1
        {
          label: "订单编号",
          prop: "orderCode",
          width: "160px",
        }, //1

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
              hasPermi: ["xt:orderJobCenter:query"],
            },
          ],
        },
      ],
      //   筛选表单配置信息
      searchOptions: [],
      //   表格批量操作
      tableActions: [
        {
          id: "audit",
          title: "审核工单",
          hasPermi: ["xt:orderJob:audit"],
        },
        {
          id: "allot",
          title: "分配工单",
          hasPermi: ["xt:orderJob:assignment"],
        },
        {
          id: "defer",
          title: "暂缓工单",
          disabled: true,
          hasPermi: ["xt:orderJob:respite"],
        },
        {
          id: "back",
          title: "退回工单",
          disabled: true,
          hasPermi: ["xt:orderJob:withdraw"],
        },
        {
          id: "export",
          title: "导出",
          hasPermi: ["xt:orderJob:export"],
        },
      ],
      selectTableData: [],
      //   审批状态弹出框
      visible: false,
      mode: "",
      dialogTitle: "",
      formData: {},
      projectType: [],
      projectCategory: [],

      // 退回和暂缓
      approveVisible: false,
      approveForm: {
        auditUserIds: [{ id: "" }],
        orderId: "",
        remark: "",
      },
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
    // 表格多选操作
    SelectionChange(list) {
      let launchUserId = list.map((item) => item.launchUserId);

      this.formData.toUserIds = [...new Set(launchUserId)];

      this.selectTableData = list;
      if (list.length === 1) {
        this.tableActions[2].disabled = false;
        this.tableActions[3].disabled = false;
      } else {
        this.tableActions[2].disabled = true;
        this.tableActions[3].disabled = true;
      }
    },
    auditCallback(mode, str) {
      this.mode = mode;
      this.dialogTitle = str;
      this.visible = true;
    },
    // 获取暂缓和退回的审批人
    async getOrderJobExitOrder(id) {
      let sendData = {
        id: id,
      };
      const res = await xtOrderJobExitOrder(sendData);
      console.log({ res });
      if (res.code === 200) {
        if (res.data.length) {
          let auditUserIds = [];
          res.data.forEach((item) => {
            auditUserIds.push({
              id: item,
            });
          });
          console.log(auditUserIds);
          this.approveForm.auditUserIds = auditUserIds;
        }
        this.approveVisible = true;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 表格批量操作
    batchActions(row) {
      if (!this.selectTableData.length && row.id !== "export")
        return this.$message.error("请选择选中的表格数据");
      let mode = "audit";
      let str = "审批";

      if (row.id === "audit") {
        mode = "audit";
        str = "审批";
        this.auditCallback(mode, str);
      } else if (row.id === "allot") {
        mode = "allot";
        str = "分配工单审批";
        this.auditCallback(mode, str);
      } else if (row.id === "defer") {
        this.mode = "defer";

        this.getOrderJobExitOrder(this.selectTableData[0].id);
        this.approveForm.remark = this.selectTableData[0].remark;
      } else if (row.id === "back") {
        this.mode = "back";
        this.getOrderJobExitOrder(this.selectTableData[0].id);
        this.approveForm.remark = this.selectTableData[0].remark;
      } else if (row.id === "export") {
        let getQueryParams = this.$refs["tableRef"].getQueryParams();

        this.handleExport(getQueryParams);

        return;
      }
    },
    //当前表格行操作
    setupEvents({ type, row }) {
      if (type === "detail") {
        this.$router.push({
          name: "ProcessingDetail",
          query: {
            id: row.id,
            pagesId: this.pagesId,
            projectId: row.projectId,
          },
        });
      }
    },
    // 导出回调
    handleExport(queryParams) {
      this.download(
        "xt/orderJob/export",
        {
          ...queryParams,
        },
        `orderJob_${new Date().getTime()}.xlsx`
      );
    },
    // 订单审批
    orderJobAudit(ids, model, msg, form, flag) {
      let sendData = {
        orderJobIds: ids,
        ...model,
      };
      let fn = xtOrderJobAuditPass;
      if (flag) {
        sendData.orderJobStatus = 8;
        fn = xtOrderJobAuditNotPass;
      }
      fn(sendData).then((res) => {
        if (res.code === 200) {
          this.$refs["tableRef"].getTableData();
          this.visible = false;
          form.resetFields();
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 审批取消操作
    approveCancel(form) {
      this.visible = false;
      form.resetFields();
    },
    // 审批不通过
    approveFail({ form, model }) {
      let ids = this.selectTableData.map((item) => item.id);
      let msg = "审批不通过";
      this.orderJobAudit(ids, model, msg, form, true);
    },
    // 审批通过提交
    approvePass({ form, model }) {
      let ids = this.selectTableData.map((item) => item.id);
      let msg = "";
      let fn = null;
      let sendData = {};
      if (this.mode === "audit") {
        // 审批
        msg = "审批通过";
        this.orderJobAudit(ids, model, msg, form);
        return;
      } else if (this.mode === "allot") {
        // 分配
        sendData = {
          orderJobIds: ids,
          handleType: 2, //分配工单
          ...model,
        };
        fn = xtOrderJobAssignment;

        msg = "工单分配成功";
      } else if (this.mode === "defer") {
        // 暂缓
        fn = xtOrderJobRespite;
        sendData = {
          orderJobIds: ids,
          handleType: 5, //暂缓工单
          orderJobStatus: 7,
          ...model,
        };

        msg = "暂缓工单成功";
      } else if (this.mode === "back") {
        // 退回
        fn = xtOrderJobWithdraw;
        sendData = {
          orderJobIds: ids,
          handleType: 6, //退回工单
          orderJobStatus: 4,
          ...model,
        };

        msg = "退回工单成功";
      }

      fn(sendData).then((res) => {
        if (res.code === 200) {
          this.$refs["tableRef"].getTableData();
          this.approveCancel(form);

          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
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
    approveConfirm({ form, model }) {
      form.validate(async (valid) => {
        if (valid) {
          let ids = this.selectTableData.map((item) => item.id);
          const { auditUserIds, remark } = model;
          let str = "";
          let sendData = {
            auditUserIds: auditUserIds.map((item) => item.id),
            orderJobIds: ids,
            orderJobAuditRemark: remark,
          };
          if (this.mode === "defer") {
            sendData.orderJobAuditType = 2;
            str = "已暂缓工单";
          } else if (this.mode === "back") {
            sendData.orderJobAuditType = 3;
            str = "已退回工单";
          }

          const res = await xtOrderJobSubmitAudit(sendData);

          if (res.code === 200) {
            this.$message.success(str);
            this.$refs["tableRef"].getTableData();
            this.approveVisible = false;
          } else {
            this.$message.error(res.msg);
            this.approveVisible = false;
          }
        } else {
          this.$message.error("请填写必填参数");
        }
      });
    },
    approveConcel({ form }) {
      this.approveVisible = false;
    },
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
      // 项目分类
      projectCategoryType: (state) => state.commonData.projectCategoryType,
      //   处理类型
      handleType: (state) => state.commonData.handleType,
      //   紧急程度
      emergencyStatus: (state) => state.commonData.emergencyStatus,
      //   工单状态
      orderJobStatus: (state) => state.commonData.orderJobStatus,
    }),
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
};
