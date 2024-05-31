import { mapState } from "vuex";
import { getBusinessDataRank } from "@/api/index/index";
import { formatDate_1 } from "@/utils";
export const posts = {
  data() {
    return {
      // crm简报
      crmQuery: {
        type: "",
        timeType: 3,
        date: "",
      },
      //   协同数据简报
      xtQuery: {
        type: "",
      },
      //   业务排名简报
      rankingQuery: {
        type: "",
        timeType: 3,
        date: "",
      },
      parmas: null, //表格传递的参数
      apiFn: getBusinessDataRank,

      sourceReport: [
        {
          label: "我的简报",
          value: 1,
        },
        {
          label: "部门简报",
          value: 2,
        },
        {
          label: "公司简报",
          value: 3,
        },
      ],
      reportOptions: [],
    };
  },
  methods: {
    // 获取当前一月一号和当前时间
    getDate() {
      let nowDate = new Date();

      let year = nowDate.getFullYear();
      let startDate = new Date(year, 0, 1);
      this.rankingQuery.date = [formatDate_1(startDate), formatDate_1(nowDate)];
    },
    // 判断是否符合条件
    regStr() {
      let rolesStr = this.roles.join(",");

      let reg = RegExp(/DataAnalysisGroup/);
      let reg1 = RegExp(/DataAnalysisSubject/);
      let reg2 = RegExp(/DataAnalysisDept/);
      if (reg.test(rolesStr) || reg1.test(rolesStr)) {
        return 3;
      }
      if (reg2.test(rolesStr)) {
        return 2;
      }

      return 1;
    },
    // 通过角色权限判断简报数据
    getReportType() {
      const reportType = this.regStr();

      console.log({ reportType });

      this.crmQuery.type = reportType;
      this.xtQuery.type = reportType;
      this.rankingQuery.type = reportType;
      // 公司
      if (reportType === 3) {
        this.reportOptions = this.sourceReport;
        return;
      }
      if (reportType === 2) {
        this.reportOptions = this.sourceReport.slice(0, -1);
        return;
      }
      this.reportOptions = this.sourceReport.slice(0, 1);
    },
  },
  mounted() {
    this.getReportType();
  },

  computed: {
    ...mapState({
      posts: (state) => state.user.posts,
      roles: (state) => state.user.roles,
    }),
    detailOptions() {
      return this.briefingOptions.XT.tableOptions[this.showType] || [];
    },
  },
  watch: {
    rankingQuery: {
      handler(newVal) {
        const { type, timeType, date } = newVal;
        this.parmas = {
          reportType: type,
          timeType,
          beginTime: date == null ? "" : date[0],
          endTime: date == null ? "" : date[1],
        };
      },
      deep: true,
    },
    crmQuery: {
      handler(newVal) {
        this.getCrmReport();
      },
      deep: true,
    },
    xtQuery: {
      handler(newVal) {
        this.getOrderJobDataReport();
      },
      deep: true,
    },
  },
};
