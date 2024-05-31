<template>
  <div class="synergyConfig-warp">
    <DetailPage
      v-if="detailData"
      :title="detailData.zwOrderVo.companyName"
      :tabs="tabs"
      :active="active"
      @togggle="handleTogggle"
    >
      <template #actions>
        <el-button
          v-if="!type"
          type="primary"
          size="mini"
          @click="approveDialogSubmit"
          >提交下单{{ isContainsAllCertificateInfo ? "" : "审批" }}</el-button
        >
        <el-popover
          v-if="type == 1"
          placement="bottom-start"
          title="帮助"
          trigger="hover"
        >
          <ol>
            <li>1.同一个角色不可存在多个用户。</li>
            <li>2.财务顾问可能没分配，请分配。</li>
          </ol>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            @click="secondSave"
            >生成工单</el-button
          >
        </el-popover>
      </template>
      <template #content>
        <TabsPublic
          v-if="pageData && pageMode !== 'borrowMoney'"
          :config="cloneConfigData"
          :allData="pageData"
          mode="edit"
          :collectionConfigNode="collectionConfigNode"
          :pageMode="pageMode"
          :tabsData="tabsData"
          :pageActive.sync="pageActive"
          :isShowUpdateOrder="true"
          :isShowBorrowMoney="type && true"
          @change="selectChange"
          @changeInput="changeInput"
        >
          <template #editBtn>
            <el-button
              v-if="pageMode !== 'attachment'"
              type="primary"
              @click="saveData"
            >
              保存
            </el-button>
            <el-button
              v-else
              type="primary"
              :v-hasPermi="[`system:oss:upload`]"
              @click="uploadDialog = true"
            >
              上传附件
            </el-button>
          </template>
        </TabsPublic>
        <DismantlingArrangement
          v-if="pageMode === 'borrowMoney'"
          :data="allData['base']"
        ></DismantlingArrangement>
      </template>
    </DetailPage>

    <!-- 文件上传 -->

    <el-dialog title="上传文件" :visible.sync="uploadDialog" width="40%">
      <el-form :model="uploadObj" labelWidth="100px" :rules="uploadRules">
        <el-form-item label="上传文件" prop="url">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            action="#"
            :http-request="uploadImg"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary" :loading="uploadLoading"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              请上传 大小不超过 1G 格式为 doc/xls/ppt/txt/pdf/zip/rar 的文件
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注信息" prop="remake">
          <el-input
            v-model="uploadObj['remake']"
            type="textarea"
            :rows="6"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadConcel">取 消</el-button>
        <el-button
          type="primary"
          :disabled="uploadLoading"
          @click="uploadConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 提交下单审批 -->
    <el-dialog
      title="提交协同下单审批"
      :visible.sync="approveDialog"
      width="40%"
      @close="approveConcel('approveRef')"
    >
      <el-form
        ref="approveRef"
        :model="approveForm"
        :rules="approveRules"
        labelWidth="100px"
      >
        <el-form-item
          v-for="(domain, index) in approveForm.auditUserIds"
          :label="'审批人' + Number(+index + 1)"
          :key="domain.key"
          :prop="'auditUserIds.' + index + '.id'"
          :rules="{
            required: true,
            message: '审批人不能为空',
            trigger: 'blur',
          }"
        >
          <el-select
            v-model="domain.id"
            style="width: 85%"
            filterable
            remote
            reserve-keyword
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              v-bind="item"
              :disabled="disabledChoose(item)"
            ></el-option> </el-select
          ><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增</el-button>
        </el-form-item>

        <el-form-item label="提醒谁看" prop="remindUserIds">
          <el-select
            v-model="approveForm.remindUserIds"
            multiple
            style="width: 100%"
            filterable
            remote
            reserve-keyword
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              v-bind="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="approveConcel('approveRef')">取 消</el-button>
        <el-button type="primary" @click="xtSaveAndApproval('approveRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 协同工单派发规则 -->
    <XtRules
      ref="xtRulesRef"
      :close-on-click-modal="false"
      title="协同工单派发规则"
      width="1600px"
      :visible.sync="xtRulesVisible"
    ></XtRules>

    <!-- 紧急情况备注 -->
    <el-dialog
      title="紧急情况备注"
      :visible.sync="emergencyStatusDialog"
      width="40%"
    >
      <el-form
        ref="emergencyStatusRef"
        :model="emergencyStatusForm"
        labelWidth="100px"
      >
        <el-form-item label="备注信息" prop="emergencyRemark">
          <el-input
            v-model="emergencyStatusForm['emergencyRemark']"
            type="textarea"
            :rows="6"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="emergencyStatusSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 生成工单弹出框 -->
    <el-dialog
      title="生成工单"
      :visible.sync="generateWorkOrderVisible"
      @close="projectClose"
    >
      <MultiTable
        ref="projectTableRef"
        border
        align="center"
        isSelection
        :selectable="selecTableDisabled"
        :data="projectData"
        :Options="tableOptions"
        :row-class-name="rowClassName"
        @SelectionChange="selectionChange"
      >
        <template #total="{ scope }">
          <div>
            {{ (scope.unitPrice * scope.quantity).toFixed(2) }}
          </div>
        </template>
      </MultiTable>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generateWorkOrder"
          >生成工单</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DetailPage from "@/components/DetailPage";
import TabsPublic from "@/components/TabsPublic";
import MultiTable from "@/components/MultiTable";
// 拆单规则
import XtRules from "@/views/components/XtRules";
// 拆账配置
import DismantlingArrangement from "@/views/components/DismantlingArrangement";

import { synergyOrder, coreCustomerAccount } from "@/api/core/order";

import {
  synergyOrderDetails,
  xtSynergyOrder,
  systemResourceAnnex,
  systemResourceAnnexList,
  xtSynergyOrderForApproval,
  xtSynergyOrderGetOrderJobIdList,
  xtSynergyOrderProjectApproval,
  xtSynergyOrderOrderUpdate,
  xtSynergyOrderGenerateOrderJob,
  xtAllCertificateInfoSubmit,
} from "@/api/workOrderProcessing/qualification";
//获取收款节点动态数据
import { synergyNodeGetProcessNodeByProjectCategory } from "@/api/workOrderOperation";
import { systemUserListForSelect } from "@/api/system/user";
import { systemDeptTreeselect } from "@/api/system/dept";
// 保存基础信息

import { configData } from "./configData";

// 文件上传
import { fileUpload } from "@/api/upload/upload";

// 获取文件类型
import { getType } from "@/utils/previewAndDownload";
import { getAllData } from "@/utils/common";

import cloneDeep from "lodash/cloneDeep";

import { mapState } from "vuex";
export default {
  components: {
    MultiTable,
    DetailPage,
    TabsPublic,
    XtRules,
    DismantlingArrangement,
  },
  data() {
    return {
      detailId: "",
      detailData: null,
      tabs: [
        {
          label: "基础信息",
          value: 1,
        },
      ],
      //   当前选中的tabs
      active: 1,
      // 当前页面模式，默认为基础信息
      pageMode: "base",

      // 项目数据
      projectData: [],
      cloneConfigData: null,
      allData: {
        // base: {},
        // safety: {},
        // certificate: {},
        // certification: {},
        // talents: {},
        // ICBC: {},
        // property: {},
        // attachment: {},
      },
      pageData: null,
      userList: [],
      flag: true,
      // 子页面下的tabs数据
      tabsData: [],
      // 子页面选中的tabs
      pageActive: -1,
      uploadDialog: false,
      uploadObj: {}, //上传的参数对象
      uploadSendData: [], //上传参数
      uploadRules: {
        // remake: { required: true, message: "请输入备注信息", trigger: "blur" },
      },
      approveDialog: false, //提交审批信息
      approveForm: {
        auditUserIds: [{ id: "" }],
        orderId: "",
        remindUserIds: [],
      },
      approveRules: {},
      cityArr: [
        "qualificationsHandlingArea",
        "customersLocation",
        "declareYourLocation",
        "socialSecurityMonth",
      ],
      type: "",
      isSaveData: false,

      collectionConfigNode: [], //动态配置收款节点数据

      pages: {
        pageNum: 1,
        total: 0,
      },

      // 协同配置规则
      xtRulesVisible: false,

      //紧急情况弹出框
      emergencyStatusDialog: false,
      emergencyStatusForm: {},

      // 生成工单弹出框
      generateWorkOrderVisible: false,
      savedItem: [], //已保存的项目id
      tableOptions: [
        {
          label: "项目名称",
          prop: "projectName", //1
          width: 250,
          fixed: true,
        },
        {
          label: "项目分类",
          prop: "allCategoryName",
          width: 260,
        },
        {
          label: "项目类型",
          prop: "projectType",
          width: 200,
        },

        {
          label: "实际单价",
          prop: "unitPrice", //1
          width: 120,
        },
        {
          label: "数量",
          prop: "quantity", //1
          width: 100,
        },
        {
          label: "实际总价",
          slotName: "total",

          width: 120,
        },
        {
          label: "拆账金额",
          prop: "dismantlePrice",

          width: 180,
        },
      ],
      orderProjectIds: [], //表格选中要生成的项目id

      uploadLoading: false,

      projectInfoBoList: [],
      isContainsAllCertificateInfo: false,
      approveLoading: null,
      saveDataSuccess: false,
    };
  },
  methods: {
    // 用于判断表格是否可以选择
    selecTableDisabled(row, index) {
      return !this.savedItem.includes(row.id);
    },
    rowClassName({ row, rowIndex }) {
      return this.savedItem.includes(row.id) && "changeRowBg";
    },
    // 表格选中的项目id
    selectionChange(list) {
      this.orderProjectIds = list.map((item) => item.id);
    },
    // 基础信息选中后，同个大项目里面的小项目为空时，对其赋值
    setDescData(setData, prop) {
      if (this.pageMode === "base") return;
      for (const key in this.allData[this.pageMode]) {
        if (!this.allData[this.pageMode][key].descData[prop]) {
          this.allData[this.pageMode][key].descData[prop] = setData;
        }
      }
    },

    // 基础信息选中input和时间选择器
    changeInput({ val, row, data }) {
      this.setDescData(val, row.prop);
    },
    // 基础信息选中select操作
    selectChange({ obj, row, data }) {
      if (row.prop === "isSignedContract" && data["isSignedContract"] == "是") {
        // 是否已签合同
        this.uploadDialog = true;
      } else if (row.prop === "emergencyStatus" && data["emergencyStatus"]) {
        this.emergencyStatusForm = data;
        this.emergencyStatusDialog = true;
      }
      this.setDescData(obj.value, row.prop);
    },
    // 保存紧急情况备注
    emergencyStatusSubmit() {
      this.emergencyStatusDialog = false;
      this.setDescData(
        this.emergencyStatusForm["emergencyRemark"],
        "emergencyRemark"
      );
    },

    // 生成当前页面配置
    initConfig(key) {
      switch (key) {
        case "基础信息":
          this.pageMode = "base";
          this.cloneConfigData = configData.base;
          break;
        case "安证项目":
          this.pageMode = "safety";
          this.cloneConfigData = configData.safety;
          break;
        case "资质项目":
          this.pageMode = "certification";

          this.cloneConfigData = configData.certification;
          break;
        case "人才项目":
          this.pageMode = "talents";
          this.cloneConfigData = configData.talents;
          break;
        case "证书项目":
          this.pageMode = "certificate";
          this.cloneConfigData = configData.certificate;
          break;
        case "工商项目":
          this.pageMode = "ICBC";
          this.cloneConfigData = configData.ICBC;
          break;
        case "知识产权项目":
          this.pageMode = "property";
          this.cloneConfigData = configData.property;
          break;
        case "资料附件":
          this.pageMode = "attachment";
          this.cloneConfigData = configData.attachment;
          break;

        default:
          break;
      }
    },
    // 生成当前页面数据
    generateData(data, key) {
      switch (key) {
        case "base":
          // 基础
          if (Object.keys(this.allData[key]).length) {
            if (this.type == 1) {
              // 订单中心配置
              // 判断是否存储了值，有值则不进行覆盖
              this.allData[key].descData.itemDismantleRemark =
                data.zwOrderVo?.itemDismantleRemark || "";
              this.allData[key].projectData = this.projectData; ////更新项目信息
            }
            this.pageData = this.allData[key];
            return;
          }
          this.allData[key].descData = data.zwOrderVo;
          this.allData[key].accountInfoData = data.zwOrderVo.customerAccount;
          this.allData[key].projectData = this.projectData;
          this.allData[key].addOrSubOrderInfo =
            data.xtOrderProjectChangeRecordList; //项目变更数据
          this.pageData = this.allData[key];
          break;
        case "safety":
        case "certification":
        case "talents":
        case "certificate":
        case "ICBC":
        case "property":
          if (Object.keys(this.allData[key]).length) {
            if (this.type == 1) {
              // 订单中心配置
              // 判断是否存储了值，有值则不进行覆盖

              data.forEach((item) => {
                this.allData[key][item.orderProject.id].descData = {
                  ...this.allData[key][item.orderProject.id].descData,
                  forbid: item.orderJobId, //已拆账，禁止收款节点操作
                  itemDismantleRemark: item.zwOrder.itemDismantleRemark ?? "",
                };

                this.allData[key][item.orderProject.id].projectData = [
                  item.orderProject,
                ]; //更新项目信息
              });
            }

            //拆账备注信息
            this.pageData = this.allData[key][this.pageActive];
            return;
          }
          data.forEach((item) => {
            // 把字符串的城市数据转换成数值
            for (const key1 in item.xtProjectBasicInfo) {
              if (
                item.xtProjectBasicInfo[`${key1}`] &&
                this.cityArr.includes(key1)
              ) {
                item.xtProjectBasicInfo[`${key1}`] =
                  item.xtProjectBasicInfo[`${key1}`].split("/");
              }
            }
            let collectionData = item.xtMoneyNodes.length
              ? item.xtMoneyNodes.map((ele) => {
                  return {
                    ...ele,
                    projectId: item.orderProject.id,
                    rowEdit: true,
                  };
                })
              : [
                  {
                    projectId: item.orderProject.id,
                    rowEdit: true,
                  },
                ];
            console.log({ collectionData });
            this.allData[key][item.orderProject.id] = {
              descData: this.type
                ? {
                    ...item.xtProjectBasicInfo,
                    itemModifiedRemark: item.zwOrder.itemModifiedRemark,
                    forbid: item.orderJobId, //已拆账，禁止收款节点操作
                    itemDismantleRemark: item.zwOrder.itemDismantleRemark,
                  }
                : item.xtProjectBasicInfo,
              projectData: [item.orderProject],
              collectionData: collectionData,
              addOrSubOrderInfo: item.xtOrderProjectChangeRecordList, //项目对应的项目变更数据
              talentDemandData:
                this.pageMode === "talents"
                  ? item.xtTalentDemandInfos.length
                    ? item.xtTalentDemandInfos.map((item) => {
                        return { ...item, rowEdit: true };
                      })
                    : [
                        {
                          rowEdit: true,
                        },
                      ]
                  : undefined,
            };
          });

          this.pageData = this.allData[this.pageMode][this.pageActive];

          break;

        case "attachment":
          this.$set(this.allData[key], "accessoryData", data);
          this.pageData = this.allData[this.pageMode];

          break;
        default:
          break;
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
    // 获取当前页详情
    getDetail() {
      this.tabsData = [];
      if (this.active === 1) {
        // 基础页面
        synergyOrder(this.detailId).then((res) => {
          if (res.code === 200) {
            this.detailData = res.data;
            this.projectData = res.data.orderProjects;
            this.isContainsAllCertificateInfo =
              res.data.isContainsAllCertificateInfo;
            if (this.flag) {
              // 只有执行一次
              let newTabs = this.dealTabs(res.data.xtProjectCategoryVos);
              this.tabs.push(...newTabs);
              this.tabs.push({
                label: "资料附件",
                value: Date.now(),
              });

              if (this.type) {
                let arr = [
                  { label: "工单派发规则配置", value: "rules" },
                  { label: "项目拆账配置", value: "borrowMoney" },
                ];

                this.tabs = this.tabs.concat(arr);
              }
              this.allData = getAllData(this.tabs);
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
    // 获取类型节点动态数据
    getProcessNodeByProjectCategory() {
      let sendData = {
        orderProjectId: this.pageActive,
      };
      synergyNodeGetProcessNodeByProjectCategory(sendData).then((res) => {
        if (res.code === 200) {
          let arr = res.data.map((item) => {
            return {
              label: item,
              value: item,
            };
          });
          this.collectionConfigNode = arr;
        }
      });
    },

    // tabs切换
    handleTogggle(row) {
      this.toggleCallBack(row);
    },
    toggleCallBack(row) {
      if (row.value === "rules") {
        this.xtRulesVisible = true;
        this.$refs.xtRulesRef.$refs.getList();
        return;
      } else if (row.value === "borrowMoney") {
        this.pageData = null;
        this.active = row.value;
        this.pageMode = row.value;
        return;
      }

      this.pageData = null;
      this.active = row.value;
      this.initConfig(row.label);
      this.getDetail();
    },

    // 判断当前的收款节点配置信息总计是否相等
    isCollectionTotal(data) {
      // 特殊订单除外
      if (this.detailData.zwOrderVo.orderType === 3) return true;
      let collection = data.collectionData;
      // 获取拆账总金额
      // let total = data.projectData[0].unitPrice * data.projectData[0].quantity;
      let total = 0;
      data.projectData.forEach((item) => {
        total += +item.dismantlePrice ?? 0;
      });

      if (!collection.length) return true;
      // let arr = collection.filter((item) => item.planPrice);
      if (!total) {
        return true;
      }
      let collectionTotal = collection.reduce((prep, item) => {
        return (prep += +item.planPrice);
      }, 0);

      if (collectionTotal == total) {
        return true;
      } else {
        return false;
      }
    },
    // 提交下单审批
    async approveDialogSubmit() {
      if (this.isContainsAllCertificateInfo) {
        if (!this.isPassed("", false)) return;

        await coreCustomerAccount(this.allData["base"].accountInfoData);
        this.saveData();
        let allData = cloneDeep(this.allData);
        const { base } = allData;
        const sendData = {
          orderId: this.detailId,
          projectInfoBoList: this.projectInfoBoList,
          zwOrderBo: base.descData,
        };
        xtAllCertificateInfoSubmit(sendData)
          .then((res) => {
            this.approveLoading.close();
            if (res.code === 200) {
              this.$router.push("/customerManager/order");

              this.$message.success("提交成功");
            }
          })
          .catch((err) => {
            this.approveLoading.close();
          });
      } else {
        this.approveDialog = true;
      }
    },
    // 判断当前页面是否有必填信息，
    isSubmit(data) {
      let isflag = true;
      let rules = configData.base.comparison
        .filter((item) => item.requred)
        .map((item) => item.prop);

      rules.forEach((rule) => {
        let index = configData.base.comparison.findIndex(
          (ele) => ele.prop === rule
        );
        if (!data[rule] || data[rule] == "") {
          configData.base.comparison[index].isShowErrMsg = true;
          isflag = false;
        } else {
          configData.base.comparison[index].isShowErrMsg = false;
        }
      });
      return isflag;
    },
    // 保存数据
    async saveData(row) {
      if (this.pageMode === "base") {
        // 基础
        //是否可提交
        console.log("我进来了");

        if (!this.isSubmit(this.pageData.descData)) return; //如果必填信息没填，提式

        let sendData = {
          ...this.pageData.descData,
        };

        await coreCustomerAccount(this.pageData.accountInfoData);
        xtSynergyOrderOrderUpdate(sendData).then((res) => {
          if (res.code === 200) {
            this.$message.success("保存成功");
            this.saveDataSuccess = true;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        // 其他保存接口调用

        // 判断当前的收款节点配置信息总计是否相等
        let cloneData = cloneDeep(this.pageData);
        console.log(this.pageData, "cloneData");

        let flag = this.isCollectionTotal(cloneData);
        if (!flag) {
          this.$message.error("收款总收款跟项目总计不相等，请重新检查后修改");
          return;
        }

        // 处理城市数组转字符串

        for (const key in cloneData.descData) {
          if (cloneData.descData[`${key}`] && this.cityArr.includes(key)) {
            cloneData.descData[`${key}`] =
              cloneData.descData[`${key}`].join("/");
          }
        }

        // 人才
        cloneData.talentDemandData = cloneData.talentDemandData
          ? cloneData.talentDemandData
          : [];
        let sendData = {
          xtMoneyNodes: cloneData.collectionData,
          xtProjectBasicInfoBo: cloneData.descData,
          xtTalentDemandInfos: cloneData.talentDemandData,
        };

        xtSynergyOrder(sendData).then((res) => {
          if (res.code === 200) {
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },

    // 上传之前对文件进行校验
    beforeUpload(rawFile) {
      console.log(rawFile);

      let fileType = [
        ".jpg",
        ".png",
        ".JPG",
        ".PNG",
        ".pdf",
        ".PDF",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".txt",
        ".zip",
        ".rar",
      ];
      const type = rawFile.name.substring(rawFile.name.lastIndexOf("."));

      const isImage = fileType.indexOf(type) > -1;

      let imgSize = Number(rawFile.size / 1024); // kb

      if (!isImage) {
        this.$message.error(
          "上传文件只能是 以 doc/xls/ppt/txt/pdf/zip/rar 格式!"
        );
        return false;
      }
      if (imgSize > 1024 * 1024) {
        this.$message.error("上传头像图片大小不能超过 1G!");
        return false;
      }
      this.uploadObj.fileSize = imgSize.toFixed(2) + "KB";
      return;
    },
    /** 图片上传 */
    uploadImg(file) {
      this.uploadLoading = true;
      fileUpload(file)
        .then((res) => {
          if (res.code == 200) {
            // 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台

            this.uploadSendData.push({
              fileSuffix: getType(res.data.url),
              url: res.data.url,
              fileName: res.data.fileName,
              fileSize: this.uploadObj.fileSize,
              uploadedId: this.detailId,
              uploadUser: this.name,
              annexType: 3,
            });
          } else {
            this.$message.error("上传图片异常");
            this.uploadLoading = false;
          }
        })
        .finally((err) => {
          console.log(err);
          this.uploadLoading = false;
        });
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

    // 上传文件取消框
    uploadConcel() {
      this.uploadDialog = false;
      this.$refs.uploadRef.clearFiles();
      this.uploadObj = {};
      this.uploadSendData = [];
    },
    // 上传文件确定框
    uploadConfirm() {
      if (!this.uploadSendData.length) return this.$message.error("请上传文件");
      this.uploadSendData.map((item) => {
        item.remake = this.uploadObj.remake;
      });

      console.log(this.uploadSendData);

      systemResourceAnnex(this.uploadSendData).then((res) => {
        if (res.code === 200) {
          this.getDetail();
          this.$message.success("添加成功");

          this.uploadConcel();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 提交下单审批取消操作
    approveConcel(formName) {
      this.approveDialog = false;
      this.$refs[formName].resetFields();
      this.approveForm = {
        auditUserIds: [{ id: "" }],
        orderId: "",
        remindUserIds: [],
      };
    },
    formatterFun(obj) {
      let arr = [];
      for (const key in obj) {
        // 处理地区数组转字符串
        for (const childrenKey in obj[key].descData) {
          if (
            obj[key].descData[`${childrenKey}`] &&
            this.cityArr.includes(childrenKey)
          ) {
            obj[key].descData[`${childrenKey}`] =
              obj[key].descData[`${childrenKey}`].join("/");
          }
        }
        // 处理人才
        obj[key].talentDemandData = obj[key].talentDemandData
          ? obj[key].talentDemandData
          : [];
        let collectionData = obj[key].collectionData.filter((item) => {
          return item.moneyTag && item.nodeName && item.planPrice;
        });
        arr.push({
          xtMoneyNodes: collectionData,
          xtProjectBasicInfoBo: obj[key].descData,
          xtTalentDemandInfos: obj[key].talentDemandData,
          obj: {
            title: `<b  style="padding:0 8px">${obj[key].projectData[0].projectType}</b>中的<span style="padding:0 8px">${obj[key].projectData[0].projectName}</span>`,
            flag: this.isCollectionTotal(obj[key]),
          },
        });
      }
      return arr;
    },
    dealData(obj) {
      let dataObj = [];
      let arr = [
        "safety",
        "certificate",
        "talents",
        "certification",
        "ICBC",
        "property",
      ];
      for (const key in obj) {
        if (arr.includes(key)) {
          dataObj.push(...this.formatterFun(obj[key]));
        }
      }
      return dataObj;
    },
    // 是否通过
    isPassed(formName, isFormName = true) {
      this.approveLoading = this.$loading({
        lock: true,
        text: "正在保存中...，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let allData = cloneDeep(this.allData);
      const { base } = allData;

      if (!this.isSubmit(base.descData)) {
        if (isFormName) {
          this.approveConcel(formName);
        }
        this.$message.error("请填写基础信息的必填信息");
        this.approveLoading.close();
        return false;
      } //如果必填信息没填，提式

      let flag = false;
      for (const key in allData) {
        if (!Object.keys(allData[key]).length && key !== "attachment") {
          flag = true;
        }
      }
      if (flag) {
        this.approveLoading.close();
        this.$message.error("请配置其他项目信息");
        return false;
      }

      this.projectInfoBoList = this.dealData(allData);
      if (!this.projectInfoBoList.length) {
        this.approveLoading.close();
        this.$message.error("请配置项目信息");
        return false;
      }
      let flagArr = this.projectInfoBoList.filter((item) => {
        return !item.obj.flag;
      });

      // 判断收款节点是否填写，特殊订单除外
      if (flagArr.length && base.descData.orderType !== 3) {
        let strArr = flagArr.map((item) => {
          return `${item.obj.title}的收款总收款跟项目总计不相等，请重新检查后修改<br />`;
        });

        this.$message({
          type: "error",
          dangerouslyUseHTMLString: true,
          message: strArr.join(""),
        });
        this.approveLoading.close();
        return false;
      }
      return true;
    },
    // 保存和下单审批
    xtSaveAndApproval(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let allData = cloneDeep(this.allData);
          const { base } = allData;

          if (!this.isPassed(formName)) return;
          let auditUserIds = this.approveForm.auditUserIds.map(
            (item) => item.id
          );
          let forApprovalBo = {
            auditUserIds: auditUserIds,
            orderId: this.detailId,
            remindUserIds: this.approveForm.remindUserIds,
          };

          let sendData = {
            forApprovalBo: forApprovalBo,
            projectInfoBoList: this.projectInfoBoList,
            zwOrderBo: base.descData,
          };

          await coreCustomerAccount(this.allData["base"].accountInfoData);

          xtSynergyOrderProjectApproval(sendData)
            .then((res) => {
              this.approveLoading.close();
              if (res.code === 200) {
                this.$router.push("/customerManager/order");
                this.approveConcel(formName);
                this.$message.success("提交成功");
              }
            })
            .catch((err) => {
              this.approveLoading.close();
            });
        }
      });
    },
    // 提交下单审批
    // approveConfirm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       const loading = this.$loading({
    //         lock: true,
    //         text: "正在保存，正在拆单发送后端中，请稍等，不要关闭页面...",
    //         spinner: "el-icon-loading",
    //         background: "rgba(0, 0, 0, 0.7)",
    //       });
    //       let auditUserIds = this.approveForm.auditUserIds.map(
    //         (item) => item.id
    //       );
    //       let sendData = {
    //         auditUserIds: auditUserIds,
    //         orderId: this.detailId,
    //         remindUserIds: this.approveForm.remindUserIds,
    //       };

    //       xtSynergyOrderForApproval(sendData)
    //         .then((res) => {
    //           loading.close();
    //           if (res.code === 200) {
    //             this.$router.push("/customerManager/order");
    //             this.approveConcel(formName);

    //             this.$message.success("提交成功");
    //           } else {
    //           }
    //         })
    //         .catch((err) => {
    //           loading.close();
    //         });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 二次保存配置
    async secondSave() {
      const res = await xtSynergyOrderGetOrderJobIdList({
        orderId: this.detailId,
      });

      if (res.code === 200) {
        this.savedItem = res.data;
      }
      this.generateWorkOrderVisible = true;
    },
    // 关闭自选订单弹出框
    projectClose() {
      this.$refs.projectTableRef.$refs.clearSelection();
    },
    // 生成订单
    async generateWorkOrder() {
      if (!this.orderProjectIds.length)
        return this.$message.error("请选中要生成的工单");
      let sendData = {
        orderId: this.detailId,
        orderProjectIds: this.orderProjectIds,
      };
      const loading = this.$loading({
        lock: true,
        text: "正在保存，正在拆单发送后端中，请稍等，不要关闭页面...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      try {
        await coreCustomerAccount(this.allData["base"].accountInfoData);
        const res = await xtSynergyOrderGenerateOrderJob(sendData);
        if (res.code === 200) {
          this.generateWorkOrderVisible = false;
          this.$router.push("/xt/xtOrder");
          this.$message.success("已生成工单");
          loading.close();
        } else {
          this.$message.error(res.msg);
          loading.close();
        }
      } catch (error) {
        loading.close();
      }
    },

    addDomain() {
      this.approveForm.auditUserIds.push({
        id: "",
        key: Date.now(),
      });
    },
    removeDomain(item) {
      var index = this.approveForm.auditUserIds.indexOf(item);
      if (index !== -1) {
        this.approveForm.auditUserIds.splice(index, 1);
      }
    },
    // 获取人员信息
    getUserList(e, isFocus) {
      let sendData = {
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      };

      // if (isFocus) {
      //   this.pages.pageNum = 1;
      //   this.userList = [];
      //   sendData = {};
      // } else {
      //   sendData = {};
      // }
      systemUserListForSelect(sendData).then((response) => {
        let newList = response.rows.map((item) => {
          return {
            label: item.userName,
            value: item.userId,
          };
        });
        this.userList = newList;
      });
    },
    // 获取部门
    getTreeselect() {
      systemDeptTreeselect().then((response) => {
        this.deptOptions = response.data;
        console.log(this.deptOptions, "6666");
        let item = this.cloneConfigData.comparison.find(
          (item) => item.prop === "handleDeptId"
        );
        let item1 = this.cloneConfigData.comparison.find(
          (item) => item.prop === "ascriptionDeptId"
        );
        item1.options = response.data;
        item.options = response.data;
      });
    },
  },
  mounted() {
    this.initConfig("基础信息");
    this.detailId = this.$route.query.id;
    this.type = this.$route.query.type;

    this.getDetail();

    // this.getOrderSignSubject();
    this.getTreeselect();
  },
  computed: {
    ...mapState({
      name: (state) => state.user.name,
    }),
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    tabsName() {
      let info = this.tabs.find((item) => item.id === this.active);
      return info ? info.componentName : "";
    },
    disabledChoose() {
      return (item) => {
        let arr = this.approveForm.auditUserIds.map((item) => item.id);

        return arr.includes(item.value);
      };
    },
  },
  watch: {
    pageActive(newval) {
      if (this.tabsData.length) {
        // this.saveData();
        this.pageData = this.allData[this.pageMode][newval];
        this.getProcessNodeByProjectCategory();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
::v-deep .el-table {
  .el-table__body {
    .changeRowBg {
      background: #dcdfe6;
    }
  }
}
</style>