import { configData } from "@/mixins/configData/configData.js";
import { processingData } from "@/mixins/configData/processingData";
// 通过label获取分类id
import { getPagesCategoryId, getPagesCategorylabelType } from "@/utils/common";
import { xtFinancialSettlementSpecialOrderInfo } from "@/api/settlement";
// 处理数组格式，生成label和value
import { dealTabs } from "@/utils/common";
export const xtCommonDetail = {
  data() {
    return {
      tabs: [
        {
          value: 1,
          label: "基本信息",
        },
      ],
      active: 1,
      detailId: "",
      detailData: null,
      allData: {
        base: {},
        safety: {},
        certificate: {},
        certification: {},
        talents: {},
        ICBC: {},
        property: {},
        attachment: {},
        accountPassword: {},
      },
      //   项目表格数据
      projectData: [],
      flag: true,
      pageData: null,
      // 子页面下的tabs数据
      tabsData: [],
      // 子页面选中的tabs
      pageActive: -1,
      // 当前页面模式，默认为基础信息
      pageMode: "base",
      cloneConfigData: null,

      //  当前页面显示的分类类型
      pagesType: "",
      pagesId: "", //当前页面分类id
      label: "",
      orderJobId: "", //工单id
    };
  },
  mounted() {
    this.initFun();
    this.initConfig("基本信息");
    this.getDetail();
  },
  methods: {
    // 初始化数据，获取传递过来的参数信息
    initFun() {
      this.detailId = this.$route.query.id;
      this.type = this.$route.query.type;
      if (this.type == 3) {
        // 特殊订单
        this.baseApi = xtFinancialSettlementSpecialOrderInfo;
      }
    },
    // 生成当前页面配置
    initConfig(key) {
      //
      if (key === "base") {
        if (this.flag) {
          this.pagesId = getPagesCategoryId(this.tabs[1].label);
        }
      } else {
        this.pagesId = getPagesCategoryId(key);
      }

      this.pagesType = getPagesCategorylabelType(key);
      switch (key) {
        case "基本信息":
          this.pageMode = "base";

          break;
        case "安证项目":
          this.pageMode = "safety";

          break;
        case "资质项目":
          this.pageMode = "certification";

          break;
        case "人才项目":
          this.pageMode = "talents";

          break;
        case "证书项目":
          this.pageMode = "certificate";

          break;
        case "工商项目":
          this.pageMode = "ICBC";

          break;
        case "知识产权项目":
          this.pageMode = "property";

          break;

        default:
          break;
      }
      this.cloneConfigData = configData[this.pageMode];
      if (this.pageMode !== "base") {
        this.cloneConfigData.processing =
          processingData[`${this.pageMode}`].processing;
      }

      if (this.pagesDetailType === "financial") {
        this.setFinanceConfig();
      }
    },
    // 生成页面数据
    generateData(data, key) {
      let accessoryData = this.detailData.resourceAnnexList.filter(
        (item) => item.annexType === 1
      );
      switch (key) {
        case "base":
          // 基础

          this.allData[key].descData = data.zwOrderVo; //基础信息
          // this.allData[key].descData.remindContent = data.zwOrderVo.remindContent; //基础信息
          this.allData[key].projectData =
            this.pagesDetailType === "financial"
              ? data.financialProjectInfoList
              : data.orderProjectList; //项目数据
          // 财务的特殊订单
          this.allData[key].financeData =
            this.pagesDetailType === "financial"
              ? this.type == 3
                ? data.xtOrderJobVoList
                : data.xtOrderFinancialProgress
              : data.xtMoneyNodeList; //财务收款
          this.allData[key].collectionData = this.isCollection
            ? data.xtMoneyNodes
            : null; //收款节点

          this.allData[key].accessoryData = this.isAccessory
            ? accessoryData
            : null; //项目相关附件
          this.allData[key].addOrSubOrderInfo =
            data.xtOrderProjectChangeRecordList; //项目变更数据
          this.pageData = this.allData[this.pageMode];

          break;
        case "safety":
        case "certification":
        case "talents":
        case "certificate":
        case "ICBC":
        case "property":
          data.forEach((item) => {
            this.allData[key][item.orderProject.id] = {
              orderJob: item.orderJob,
              descData:
                this.pagesDetailType === "financial"
                  ? {
                      ...item.xtProjectBasicInfo,
                      itemModifiedRemark: item.zwOrder.itemModifiedRemark,
                      itemDismantleRemark:
                        this.allData["base"].descData.itemDismantleRemark, //拆账备注信息
                    }
                  : item.xtProjectBasicInfo,
              projectData:
                this.pagesDetailType === "financial"
                  ? item.zwOrderProjectList
                  : [item.orderProject],
              collectionData: this.isCollection ? data.xtMoneyNodes : null, //收款节点
              financeData: item.xtMoneyNodeVoList, //财务收款
              processingData:
                {
                  ...item.projectMainInfo,
                  auditUserName: item.orderJob
                    ? item.orderJob.auditUserName
                    : "",
                  makeUserName: item.orderJob ? item.orderJob.makeUserName : "",
                } || {}, //当前页面数据
              talentDemandData:
                this.pageMode === "talents"
                  ? item.xtTalentDemandInfos
                  : undefined,

              accessoryData: this.isAccessory ? accessoryData : null,
              addOrSubOrderInfo: item.xtOrderProjectChangeRecordList, ////项目变更数据
            };
          });
          this.pageData = this.allData[this.pageMode][this.pageActive];

          break;
        default:
          break;
      }
      if (this.pagesType === "certification") {
        // 资质需要判断多种情况
        let projectNature = this.pageData.descData.projectNature;
        if (projectNature === "增项" || projectNature === "新申请") {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.add;
        } else if (projectNature === "整转") {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.full;
        } else {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.part;
        }
      }
    },
    // 切换当前节点
    handleTogggle(row) {
      this.pageData = null;
      this.active = row.value;

      this.initConfig(row.label);
      this.getDetail();
    },
    // 获取详情接口
    getDetail() {
      this.tabsData = [];
      if (this.pageMode === "base") {
        this.getBaseInfo();
      } else {
        this.getXtBaseInfoProjectDetail();
      }
    },
    // 获取基础信息
    getBaseInfo() {
      let sendParams = {};
      if (this.pagesDetailType === "financial") {
        if (this.type == 3) {
          // 特殊订单详情
          sendParams = { id: this.detailId };
        } else {
          sendParams = {
            orderId: this.detailId,
          };
        }
      } else {
        this.auditId = this.$route.query.auditId;
        sendParams = {
          id: this.detailId,
          auditId: this.auditId,
          auditOrderNum: this.$route.query.auditOrderNum,
        };
      }
      this.baseApi(sendParams).then((res) => {
        if (res.code === 200) {
          this.detailData = res.data;
          if (this.flag) {
            // 只有执行一次
            let newTabs = dealTabs(res.data.xtProjectCategoryVos);
            this.tabs.push(...newTabs);
          }
          this.flag = false;
          if (res.data.xtProjectCategoryVos.length) {
            this.pagesId = getPagesCategoryId(this.tabs[1].label);
          }

          this.generateData(res.data, this.pageMode);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取项目分类数据的详情
    getXtBaseInfoProjectDetail() {
      // 切换协同分类详情数据
      let sendParams = {};
      if (this.pagesDetailType === "financial") {
        sendParams = {
          xtProjectCategoryId: this.active,
        };
        if (this.type == 3) {
          sendParams.orderId = this.detailData.zwOrderVo.id;
        } else {
          sendParams.orderId = this.detailId;
        }
      } else {
        sendParams = {
          orderId: this.detailData.zwOrderVo.id,
          orderJobId: this.detailId,
          xtProjectCategoryId: this.active,
        };
      }
      this.projectDetailApi(sendParams).then((res) => {
        if (this.pagesDetailType === "financial") {
          this.tabsData = res.data.map((item) => {
            item.orderProject = item.zwOrderProjectList[0];
            return {
              id: item.zwOrderProjectList[0].id,
              title: item.zwOrderProjectList[0].projectName,
            };
          });
        } else {
          this.tabsData = res.data.map((item) => {
            return {
              id: item.orderProject.id,
              title: item.orderProject.projectName,
            };
          });
        }
        this.pageActive = this.tabsData[0].id;
        this.generateData(res.data, this.pageMode);
      });
    },
  },

  watch: {
    pageActive(newval) {
      if (this.tabsData.length) {
        this.pageData = this.allData[this.pageMode][newval];
        console.log(this.pageData, "6666");
        this.orderJobId = this.pageData.orderJob.id;
      }
    },
  },
};
