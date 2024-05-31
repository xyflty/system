import { getCommonData } from "@/api/commonData";
import { systemUserListForSelect } from "@/api/system/user";
import { xtProjectType } from "@/api/workOrderProcessing/qualification";

const state = {
  commonData: {
    customerBehavior: [
      {
        label: "首次成交",
        value: 1,
      },
      {
        label: "二次成交",
        value: 2,
      },
      {
        label: "多次成交",
        value: 3,
      },
      {
        label: "粉丝客户",
        value: 4,
      },
      {
        label: "忠实客户",
        value: 5,
      },
    ],
    customerGrade: [
      {
        label: "企业服务",
        value: 0,
      },
      {
        label: "人才服务",
        value: 1,
      },
      {
        label: "职训服务",
        value: 2,
      },
      {
        label: "教育中心",
        value: 3,
      },
    ],
    dataSourceCommon: [
      {
        label: "考场数据",
        value: 1,
      },
      {
        label: "工商数据",
        value: 2,
      },
      {
        label: "渠道数据",
        value: 3,
      },
      {
        label: "其他数据",
        value: 4,
      },
    ],
    typeEn: ["clue", "demand", "opportunity", "order", "customer"],
    typeCh: ["线索", "挖需", "商机", "订单", "客户"],
    followMethodList: [
      {
        label: "面谈",
        value: 1,
      },
      {
        label: "电话",
        value: 2,
      },
      {
        label: "微信",
        value: 3,
      },
      {
        label: "短信",
        value: 4,
      },
      {
        label: "邮件",
        value: 5,
      },
      {
        label: "QQ",
        value: 6,
      },
      {
        label: "其他",
        value: 7,
      },
    ],
    roleList: [
      {
        label: "资质负责人",
        value: 1,
      },
      {
        label: "证书负责人",
        value: 2,
      },
      {
        label: "协办人",
        value: 3,
      },
      {
        label: "其他",
        value: 4,
      },
    ],
    dataSourceList: [
      {
        label: "电话营销",
        value: 1,
      },
      {
        label: "工商客户",
        value: 2,
      },
      {
        label: "网推客户",
        value: 3,
      },
      {
        label: "跨部门客户",
        value: 4,
      },
      {
        label: "客户转介绍",
        value: 5,
      },
      {
        label: "其它途径",
        value: 6,
      },
      {
        label: "考场数据",
        value: 8,
      },
      {
        label: "渠道数据",
        value: 8,
      },
    ],
    businessTypeList: [
      {
        label: "线索",
        value: 1,
      },
      // {
      //   label: "挖需",
      //   value: 2,
      // },
      {
        label: "商机",
        value: 3,
      },
      {
        label: "订单",
        value: 4,
      },
      {
        label: "客户",
        value: 5,
      },
    ],

    orderTypeList: [
      {
        label: "资质订单",
        value: 1,
      },
      {
        label: "安证订单",
        value: 2,
      },
      {
        label: "其他订单",
        value: 3,
      },
    ],
    projectTypeList: [
      {
        label: "建筑资质",
        value: 1,
      },
      {
        label: "基础证书",
        value: 2,
      },
      {
        label: "项目和安证",
        value: 3,
      },
      {
        label: "其他",
        value: 4,
      },
    ],

    paymentMethodList: [
      {
        label: "对公账户",
        value: 1,
      },
      {
        label: "对私账户",
        value: 2,
      },
      {
        label: "现金",
        value: 3,
      },
    ],

    customerGradeList: [
      {
        label: "VIP类",
        value: 4,
      },
      {
        label: "A类",
        value: 3,
      },
      {
        label: "B类",
        value: 2,
      },
      {
        label: "C类",
        value: 1,
      },
    ],
    customerTypeList: [
      {
        label: "企业客户",
        value: 1,
      },
      {
        label: "个人客户",
        value: 2,
      },
      {
        label: "渠道客户",
        value: 3,
      },
    ],
    // 项目分类类型
    projectCategoryType: [
      { label: "安证项目", value: 1, type: "safety" },
      { label: "资质项目", value: 2, type: "certification" },
      { label: "人才项目", value: 3, type: "talents" },
      { label: "证书项目", value: 4, type: "certificate" },
      { label: "工商项目", value: 5, type: "ICBC" },
      { label: "知识产权项目", value: 6, type: "property" },
    ],
    // 处理工单类型
    handleType: [
      { label: "审核工单", value: 1 },
      { label: "分配工单", value: 2 },
      { label: "取消工单", value: 3 },
      { label: "退单处理", value: 4 },
      { label: "暂缓工单", value: 5 },
    ],
    // 工单状态类型
    orderJobStatus: [
      { label: "未激活", value: 1, color: "#909399" },
      { label: "已停单", value: 2, color: "#F56C6C" },
      { label: "正在作业", value: 3, color: "#409EFF" },
      { label: "已完结", value: 4, color: "#67C23A" },
      { label: "已取消", value: 5, color: "#F56C6C" },
      { label: "已退单", value: 6, color: "#F56C6C" },
      { label: "已暂缓", value: 7, color: "#F56C6C" },
      { label: "审核未通过", value: 8, color: "#F56C6C" },
      { label: "等待取消", value: 9, color: "#E6A23C" },
      { label: "等待暂缓", value: 10, color: "#E6A23C" },
      { label: "等待退单", value: 11, color: "#E6A23C" },
    ],
    // 紧急程度状态
    emergencyStatus: [
      { label: "暂不紧急", value: 1 },
      { label: "一般紧急", value: 2 },
      { label: "非常紧急", value: 3 },
    ],
    // 订单类型
    xtOrderType: [
      { label: "普通订单", value: 1 },
      { label: "综合订单", value: 2 },
      { label: "特殊订单", value: 3 },
    ],
    // 订单状态
    xtOrderStatus: [
      { label: "支付首款", value: 1 },
      { label: "进度款", value: 2 },
      { label: "收取尾款", value: 3 },
      { label: "已办结", value: 4 },
      { label: "已退单", value: 5 },
      { label: "支付全款", value: 6 },
    ],
    // 审批状态
    auditstatus: [
      { label: "待审批", value: 1 },
      { label: "审批通过", value: 2 },
      { label: "已驳回", value: 3 },
      { label: "已撤回", value: 4 },
      { label: "已作废", value: 10 },
    ],
    // 审批类型
    auditType: [
      { label: "取消工单", value: 1 },
      { label: "暂缓工单", value: 2 },
      { label: "退回工单", value: 3 },
    ],
    isGift: [
      { label: "否", value: 0 },
      { label: "是", value: 1 },
    ],
    orderProjectChangeType: [
      { label: "原始项目", value: 1 },
      { label: "增单", value: 2 },
      { label: "减单", value: 3 },

      { label: "停单", value: 4 },
      { label: "新增项目", value: 5 },
      { label: "赠品", value: 6 },
    ],
    xtConfigFlagStatus: [
      { label: "未配置", value: false },
      { label: "已配置", value: true },
    ],
    warnType: [
      { label: "暂无预警", value: 0, type: "option" },
      { label: "节点停留", value: 1, type: "option" },
      { label: "工单停滞", value: 2, type: "option" },

      { label: "工单超时", value: 3, type: "option" },
    ],
    // 主体
    subjectDept: [
      {
        label: "广东易为建工科技集团有限公司",
        value: "广东易为建工科技集团有限公司",
      },
      {
        label: "广东伯乐人才服务有限公司",
        value: "广东伯乐人才服务有限公司",
      },
      {
        label: "广东省粤建职业培训学校",
        value: "广东省粤建职业培训学校",
      },
      {
        label: "粤建人力资源（广东）有限公司",
        value: "粤建人力资源（广东）有限公司",
      },
      {
        label: "广东众为建筑咨询有限公司",
        value: "广东众为建筑咨询有限公司",
      },
      {
        label: "广东拓廷科技有限公司",
        value: "广东拓廷科技有限公司",
      },
      {
        label: "广州市筑为企业管理咨询有限公司",
        value: "广州市筑为企业管理咨询有限公司",
      },
      {
        label: "广东科管家企业服务有限公司",
        value: "广东科管家企业服务有限公司",
      },
      {
        label: "广州市天河区易为教育培训中心有限公司",
        value: "广州市天河区易为教育培训中心有限公司",
      },
      {
        label: "广州市信为企业管理咨询有限公司",
        value: "广州市信为企业管理咨询有限公司",
      },
      {
        label: "广州粤创建筑科技有限公司",
        value: "广州粤创建筑科技有限公司",
      },
      {
        label: "广东领跑建筑服务有限公司",
        value: "广东领跑建筑服务有限公司",
      },
      {
        label: "广东易为愿景投资有限公司",
        value: "广东易为愿景投资有限公司",
      },
    ],
    userList: JSON.parse(sessionStorage.getItem("USERLIST_KEY")),
    // 渠道部和领跑咨询的全体人员
    needUserList: JSON.parse(sessionStorage.getItem("NEEDUSERLIST")) || [],

    orderNeedType: [
      { label: "新申请", value: 1 },
      { label: "增项", value: 2 },
      { label: "整转", value: 3 },
      { label: "分立", value: 4 },
      { label: "只配人才", value: 5 },
      { label: "升级", value: 6 },
      { label: "定制", value: 7 },
    ],

    orgNameEnun: [
      { value: "007482612", label: "广州市住房和城乡建设局" },
      { value: "693981103", label: "深圳市住房和建设局" },
      { value: "698125891", label: "珠海市住房和城乡建设局" },
      { value: "553696992", label: "汕头市住房和城乡建设局" },
      { value: "574466125", label: "佛山市住房和城乡建设局" },
      { value: "006946251", label: "韶关市住房和城乡建设管理局" },
      { value: "765706259", label: "河源市住房和城乡建设局" },
      { value: "007207952", label: "梅州市住房和城乡建设局" },
      { value: "007187920", label: "惠州市住房和城乡建设局" },
      { value: "007240285", label: "汕尾市住房和城乡建设局" },
      { value: "007329909", label: "东莞市住房和城乡建设局" },
      { value: "007332710", label: "中山市住房和城乡建设局" },
      { value: "553661319", label: "江门市住房和城乡建设局" },
      { value: "698175178", label: "阳江市住房和城乡建设局" },
      { value: "00708880X", label: "湛江市住房和城乡建设局" },
      { value: "007122086", label: "茂名市住房和城乡建设局" },
      { value: "007141447", label: "肇庆市住房和城乡建设局" },
      { value: "007299770", label: "清远市住房和城乡建设局" },
      { value: "007336033", label: "潮州市住房和城乡建设局" },
      { value: "007026537", label: "揭阳市住房和城乡建设局" },
      { value: "551692832", label: "云浮市住房和城乡建设局" },
    ],

    applyQuaTypeEnun: [
      { value: 101, label: "建设工程勘察企业资质" },
      { value: 102, label: "建设工程设计企业资质" },
      { value: 103, label: "工程建设项目招标代理机构资格" },
      { value: 104, label: "建筑业企业资质" },
      { value: 105, label: "工程监理企业资质" },
      { value: 106, label: "工程造价咨询企业资质" },
      { value: 107, label: "城乡规划编制单位资质" },
      { value: 108, label: "房地产开发企业资质" },
      { value: 109, label: "物业服务企业资质" },
      { value: 117, label: "建设工程质量检测资质" },
    ],
    entTypeEnun: [
      { value: 1, label: "申请资质企业信息公开" },
      { value: 2, label: "企业资质审查意见公示" },
    ],
    threeKuEnum: [
      {
        value: 0,
        label: "暂无预警",
        color: "#909399",
      },
      // {
      //   value: 1,
      //   label: "一般关注",
      //   color: "#7D7DFF",
      // },
      {
        value: 2,
        label: "重点关注",
        color: "#E6A23C",
      },
      {
        value: 3,
        label: "紧急关注",
        color: "#EA0000",
      },
      {
        value: 4,
        label: "关注挖掘",
        color: "#00DB00",
      },
      {
        value: 5,
        label: "已过期",
        color: "#009393",
      },
    ],

    // 财务搜索项目类型
    xtProjectType: JSON.parse(sessionStorage.getItem("XT_PROJECTTYPE_KEY")),

    clueSourceTypeList: [
      {
        label: "CRM管理",
        value: 1,
      },
      {
        label: "线索公海",
        value: 2,
      },
      {
        label: "三库公海",
        value: 3,
      },
      {
        label: "动态核查资源库",
        value: 4,
      },
    ],
    // 报告类型
    reportTypeEnum: [
      {
        label: "日报",
        value: 1,
      },
      {
        label: "周报",
        value: 2,
      },
      {
        label: "月报",
        value: 3,
      },
    ],
    // 批阅状态
    perusalEnum: [
      {
        label: "未批阅",
        value: 0,
      },
      {
        label: "已批阅",
        value: 1,
      },
    ],
    // 商机状态
    opportunityStatusEnum: [
      {
        label: "合同阶段",
        value: 1,
      },
      {
        label: "商机流失",
        value: 2,
      },
      {
        label: "发现需求",
        value: 3,
      },
      {
        label: "确认需求",
        value: 4,
      },
      {
        label: "提供解决方案",
        value: 5,
      },
      {
        label: "促成及处理异议",
        value: 6,
      },
    ],
  },
};

const mutations = {
  SET_DATA: (state, commonData) => {
    const stateCommonData = state.commonData;
    const data = commonData;
    for (const key in data) {
      data[key] = data[key].map((val) => ({
        label: val.name,
        value: val.code,
      }));
    }

    state.commonData = {
      ...stateCommonData,
      ...data,
    };
  },
  SET_USERLIST: (state, commonData) => {
    const stateCommonData = state.commonData;
    state.commonData = {
      ...stateCommonData,
      userList: commonData,
    };
  },
  // 协同项目类型
  SET_XT_PROJECTTYPE_KEY: (state, commonData) => {
    const stateCommonData = state.commonData;
    state.commonData = {
      ...stateCommonData,
      xtProjectType: commonData,
    };
  },
};

const actions = {
  getCommonData({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      getCommonData()
        .then((res) => {
          commit("SET_DATA", res.data);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getUserList({ commit }) {
    let sendData = {
      userName: "",
    };

    if (sessionStorage.getItem("USERLIST_KEY")) {
      commit(
        "SET_USERLIST",
        JSON.parse(sessionStorage.getItem("USERLIST_KEY"))
      );
    } else {
      systemUserListForSelect(sendData).then((res) => {
        let userList = res.rows.map((item) => {
          return {
            label: item.userName,
            value: item.userId,
          };
        });

        sessionStorage.setItem("USERLIST_KEY", JSON.stringify(userList));
        commit("SET_USERLIST", userList);
      });
    }
  },
  getProjectType({ commit }) {
    return xtProjectType().then((res) => {
      let xtProjectType = res.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      sessionStorage.setItem(
        "XT_PROJECTTYPE_KEY",
        JSON.stringify(xtProjectType)
      );
      commit("SET_XT_PROJECTTYPE_KEY", xtProjectType);
      return xtProjectType;
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
