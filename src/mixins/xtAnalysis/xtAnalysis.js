import {
  getSynergyDataAnalysisContainer,
  QueryOrderJobPageList,
  drillTake,
} from "@/api/xtAnalysis";

import { Options, search } from "@/views/xtAnalysis/components/Options";

export const analysis = {
  data() {
    return {
      apiFn: QueryOrderJobPageList,
      pageData: null,
      tableOptions: Options,
      searchOptions: search,
      parmas: null,

      histogramType: false, //柱状图类型

      pieData: {},
      queryForm: {
        userId: "",
        // timeType: 1,
        // timeValueBegin: "",
        // timeValueEnd: "",
        pageNum: 1,
        pageSize: 10,
        deptIds: null,
        projectCategory: this.pageType,
      },
      drillingVisible: false,

      tableData: [],

      drillingRow: {}, //当前钻取的数据
      jobTitle: "", //钻取标题
      tableName: "", //表格头名称label
      caption: "", //表格标题

      histogramLoading: false, //协同工单分布加载
    };
  },

  methods: {
    handleQuery(model) {
      console.log(model);
      if (!model.deptIds && !model.userId)
        return this.$message.error("请至少选择一个部门或者选择用户");
      this.parmas = {
        projectCategory: this.pageType,
        ...model,
      };

      this.getPageData();
    },
    handleReset(from, model) {
      from.resetFields();
      this.queryForm.deptIds = this.defaultDeptIds.join(",");
      this.parmas = {
        projectCategory: this.pageType,
        ...model,
      };
      this.getPageData();
    },

    // 钻取
    handleDrilling({ row, data }) {
      // console.log(data);
      // this.drillingRow = row;

      // this.tableData = data;

      // this.drillingVisible = true;
      const sendXtAnalysis = {
        data: data,
        queryForm: this.queryForm,
        row: row,
      };
      sessionStorage.setItem("XTPANORAMA_KEY", JSON.stringify(this.queryForm));
      sessionStorage.setItem("XTANALYSIS_KEY", JSON.stringify(sendXtAnalysis));

      this.$router.push({
        name: "XtProportion",
      });
    },

    handleToggle(val) {
      this.histogramType = val;
      this.getPageData();
    },

    // 获取页面数据
    async getPageData() {
      try {
        let sendData = {
          projectCategory: this.pageType,
          histogramType: this.histogramType,
          ...this.queryForm,
        };
        this.histogramLoading = true;

        const res = await getSynergyDataAnalysisContainer(sendData);

        this.pageData = res;
        this.histogramLoading = false;
      } catch (error) {
        console.log(error);
        this.histogramLoading = false;
      }
    },
  },
  mounted() {},
};
