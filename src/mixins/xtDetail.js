// 协同工单详情配置的公共方法
import { configData } from "./configData/configData.js";
import { processingData } from "@/mixins/configData/processingData";
import {
  synergyOrderDetails,
  systemResourceAnnexList,
} from "@/api/workOrderProcessing/qualification";

// 基础信息
import { synergyOrder } from "@/api/core/order";

export const xtDetail = {
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
      pageData: {},
      // 子页面下的tabs数据
      tabsData: [],
      // 子页面选中的tabs
      pageActive: -1,
      // 当前页面模式，默认为基础信息
      pageMode: "base",
      cloneConfigData: null,
    };
  },
  methods: {
    // 生成当前页面配置
    initConfig(key) {
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
        case "资料附件":
        case "资料文件":
          this.pageMode = "attachment";

          break;
        case "三库一平台账号密码":
          this.pageMode = "accountPassword";

          break;

        default:
          break;
      }
      this.cloneConfigData = configData[this.pageMode];
      if (
        this.pageMode !== "base" &&
        this.pageMode !== "attachment" &&
        this.pageMode !== "accountPassword"
      ) {
        this.cloneConfigData.processing =
          processingData[`${this.pageMode}`].processing;
      }
    },
    // 处理数据生成label和value格式
    dealTabs(data) {
      return data.map((item) => {
        return {
          label: item.categoryName,
          value: item.id,
        };
      });
    },
    generateData(data, key) {
      switch (key) {
        case "base":
          // 基础
          this.allData[key].descData = data.zwOrderVo;
          this.allData[key].approvalData = data.zwAuditDetails;
          this.allData[key].accountInfoData = data.zwOrderVo.customerAccount;

          this.pageData = {
            projectData: this.projectData,
            ...this.allData.base,
            remark: "",
          };

          break;
        case "safety":
        case "certification":
        case "talents":
        case "certificate":
        case "ICBC":
        case "property":
          data.forEach((item) => {
            this.allData[key][item.orderProject.id] = {
              descData: item.xtProjectBasicInfo,
              projectData: [item.orderProject],
              collectionData: item.xtMoneyNodes,
              talentDemandData:
                this.pageMode === "talents"
                  ? item.xtTalentDemandInfos
                  : undefined,
            };
          });
          this.pageData = this.allData[this.pageMode][this.pageActive];

          break;

        case "attachment":
          this.allData[key].accessoryData = data;
          this.pageData = this.allData[this.pageMode];

          break;
        default:
          break;
      }
    },
    // 获取当前页详情
    getDetail() {
      this.tabsData = [];

      if (this.pageMode === "base") {
        // 基础页面
        synergyOrder(this.detailId).then((res) => {
          if (res.code === 200) {
            this.detailData = res.data;
            this.projectData = res.data.orderProjects;
            if (this.flag) {
              // 只有执行一次
              let newTabs = this.dealTabs(res.data.xtProjectCategoryVos);
              this.tabs.push(...newTabs);
              this.tabs.push({
                label: "资料附件",
                value: Date.now(),
              });
            }
            this.flag = false;
            this.generateData(res.data, this.pageMode);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else if (this.pageMode === "attachment") {
        // 附件

        this.getResourceAnnexList();
      } else {
        // 切换协同分类详情数据
        let sendParams = {
          orderId: this.detailId,
          xtProjectCategoryId: this.active,
        };
        synergyOrderDetails(sendParams).then((res) => {
          this.tabsData = res.data.map((item) => {
            return {
              id: item.orderProject.id,
              title: item.orderProject.projectName,
            };
          });
          this.pageActive = this.tabsData[0].id;
          this.generateData(res.data, this.pageMode);
        });
      }
    },
    // 获取资料附件列表数据
    getResourceAnnexList() {
      let sendParams = {
        uploadedId: this.detailId,
      };
      systemResourceAnnexList(sendParams).then((res) => {
        this.generateData(res.rows, this.pageMode);
      });
    },
    handleTogggle(item) {
      this.pageData = null;
      this.active = item.value;
      this.initConfig(item.label);
      this.getDetail();
    },
  },
  mounted() {
    this.detailId = this.$route.query.id;
    this.initConfig("基本信息");

    this.getDetail();
  },
  watch: {
    pageActive(newval) {
      if (this.tabsData.length) {
        this.pageData = this.allData[this.pageMode][newval];
      }
    },
  },
};
