import { passLabelGetValue } from "@/utils/common";
import { mapState } from "vuex";

import { customerOptions } from "../config/Option";

export const common = {
  data() {
    return {
      previousRouterName: "", //当前页面
    };
  },
  methods: {
    // 获取客户等级对应的数字
    getCustomerType(key) {
      switch (key) {
        case "VIP":
          return 4;
        case "A类":
          return 3;
        case "B类":
          return 2;
        case "C类":
          return 1;
      }
    },
    // 获取粉丝客户的参数
    getFans(key) {
      switch (key) {
        case "粉丝客户":
          return 1;
        case "忠实客户":
          return 2;
      }
    },
    // 获取项目大类
    projectBigClassId(key, row) {
      switch (key) {
        case "职训服务":
          return row.vocationalTrainingServicesId;
        case "企业服务":
          return row.enterpriseServicesId;
        case "人才服务":
          return row.talentServicesId;
        case "教育中心":
          return row.educationCenterId;
      }
    },
    // 表格数据点击
    handleView({ row, column, item }) {
      const { name } = this.$route;
      let query = {
        deptIds: [row.deptId].join(","),

        dateType: this.queryParams.dateType,
        endTime: this.queryParams.endTime,
        beginTime: this.queryParams.beginTime,
        userId: row.userId || this.queryParams.userId,
      };

      if (name === "Useranalyselist") {
        // 用户表格
        query.userId = row.userId;
      }

      if (["VIP", "A类", "B类", "C类"].includes(item.label)) {
        query.type = "customerGrade";
        query.dataSourceType = this.getCustomerType(item.label);
      } else if (["客户数量"].includes(item.label)) {
        query.type = "customer";
      } else if (
        [
          "电话营销",
          "工商客户",
          "网推客户",
          "跨部门客户",
          "客户转介绍",
          "其他途径",
          "考场数据",
          "渠道数据",
        ].includes(item.label)
      ) {
        query.type = "dataSource";
        query.dataSourceType = passLabelGetValue(
          this.commonData.dataSourceList,
          item.label
        );
      } else if (
        ["职训服务", "企业服务", "人才服务", "教育中心"].includes(item.label)
      ) {
        query.type = "project";
        query.dataSourceType = passLabelGetValue(
          this.commonData.customerGrade,
          item.label
        );
        query.projectBigClassId = this.projectBigClassId(item.label, row);
      } else if (["首次成交", "二次成交", "多次成交"].includes(item.label)) {
        query.type = "behavior";
        query.dataSourceType = passLabelGetValue(
          this.commonData.customerBehavior,
          item.label
        );
      } else if (["粉丝客户", "忠实客户"].includes(item.label)) {
        query.type = "fans";
        query.dataSourceType = this.getFans(item.label);
      }

      this.setStorage();

      this.$router.push({
        name: "Pielist",
        query: query,
      });
    },

    // 用于判断当前部门是否为最后一级
    getTreeselectList1(tree, id) {
      let res = "";
      let state = false;
      function readTree(tree, id) {
        if (state) return;
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].id == id) {
            state = true;
            res = tree[i];
          } else {
            if (tree[i].children && tree[i].children.length) {
              readTree(tree[i].children, id);
            }
          }
        }
      }
      readTree(tree, id);

      return res.children.map((item) => item.id);
    },

    handleQuery(form) {
      if (
        this.queryParams.deptIds &&
        !this.queryParams.deptIds.length &&
        !this.isUserRole
      ) {
        this.$message.error("请至少选择一个部门");
        return;
      }
      this.queryParams = form;
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.getData();
    },
    resetQuery(formName) {
      formName.resetFields();

      this.init();
    },

    handleBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.previousRouterName = sessionStorage.getItem("ROUTERNAME");
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    // 表格标题
    tableTitle() {
      if (!this.pageType) return; //判空
      return customerOptions[this.pageType].title;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!from.name) return;
      // vm.previousRouterName = from.name;
      sessionStorage.setItem("ROUTERNAME", from.name);
    });
  },
};
