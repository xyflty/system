<template>
  <div class="tabs-public">
    <div>
      <div class="table-header" v-if="tabsData.length">
        <div class="table-tabs">
          <template v-for="item in tabsData">
            <span
              :key="item.id"
              :class="{ active: pageActive === item.id }"
              @click="toggleTabs(item.id)"
            >
              {{ item.title }}
            </span>
          </template>
        </div>
        <div class="btns" v-if="mode === 'edit'">
          <slot name="editBtn"></slot>
        </div>
        <slot name="actions"></slot>
      </div>
      <div class="header-btns__container" v-else>
        <div class="btns">
          <slot name="editBtn"></slot>
        </div>
      </div>
    </div>

    <div class="showData">
      <div class="public-items">
        <div class="tableCard-container" v-if="allData.descData">
          <the-descriptions
            :title="title1"
            border
            :column="2"
            :comparison="config.comparison"
            :data="allData.descData"
            :labelWidth="labelWidth"
            @change="
              ({ obj, row }) =>
                handleChange({ obj, row, data: allData.descData })
            "
            @changeInput="
              ({ val, row }) =>
                changeInput({ val, row, data: allData.descData })
            "
          >
          </the-descriptions>
        </div>

        <!--  项目信息 -->
        <div class="tableCard-container" v-if="allData.projectData">
          <h3 class="card-header">项目信息</h3>
          <div class="card-content">
            <multi-table
              :Options="configOPtions.projectOptions"
              :isSearchForm="false"
              border
              align="center"
              isIndex
              indexLabel="序号"
              stripe
              :show-summary="pageMode === 'base'"
              :summary-method="projectSummary"
              :data="allData.projectData"
            >
              <template #total="{ scope }">
                <div>
                  {{ (scope.unitPrice * scope.quantity).toFixed(2) }}
                </div>
              </template>
            </multi-table>
          </div>
        </div>

        <!--  人才需求信息 -->
        <div class="tableCard-container" v-if="allData.talentData">
          <h3 class="card-header">人才需求信息补充</h3>
          <div class="card-content">
            <multi-table
              :Options="configOPtions.talentOptions"
              :isSearchForm="false"
              border
              align="center"
              isIndex
              indexLabel="序号"
              :data="allData.talentData"
            >
            </multi-table>
          </div>
        </div>
        <!--  人才需求信息 -->
        <div class="tableCard-container" v-if="allData.talentDemandData">
          <h3 class="card-header">人才需求信息</h3>
          <div class="card-content">
            <multi-table
              :Options="configOPtions.talentDemandOptions"
              :isSearchForm="false"
              border
              align="center"
              isIndex
              indexLabel="序号"
              :data="allData.talentDemandData"
            >
              <template #editRowOperation="{ scope }">
                <el-button
                  :disabled="allData.talentDemandData.length === 1"
                  type="text"
                  @click="delTalen(scope)"
                  >删除</el-button
                >
              </template>
            </multi-table>
          </div>
          <div
            class="card-footer"
            style="justify-content: center"
            v-if="mode === 'edit'"
          >
            <p style="cursor: pointer" @click="addTalentDemand">
              <i class="el-icon-circle-plus-outline"></i> 点击添加
            </p>
          </div>
        </div>
        <!--  项目变更信息 -->
        <div
          class="tableCard-container"
          v-if="allData.addOrSubOrderInfo && isShowUpdateOrder"
        >
          <h3 class="card-header">项目变更信息</h3>
          <div class="card-content">
            <multi-table
              :Options="configOPtions.addOrSubOrderOptions"
              :isSearchForm="false"
              border
              align="center"
              isIndex
              indexLabel="序号"
              :isSlice="isSlice"
              :sliceNum="5"
              :data="allData.addOrSubOrderInfo"
            >
              <template #originalTotle="{ scope }">
                <span>{{
                  scope.originalUnitPrice * scope.originalQuantity
                }}</span>
              </template>
              <template #changeTotle="{ scope }">
                <span>{{ scope.changeUnitPrice * scope.changeQuantity }}</span>
              </template>
            </multi-table>
            <div class="card-footer" style="justify-content: center">
              <p style="cursor: pointer" @click="catMore('addOrSubOrderInfo')">
                {{ isSlice ? "查看更多" : "收起" }}
              </p>
            </div>
          </div>
        </div>
        <!--  收款节点信息配置 -->
        <div
          class="tableCard-container"
          v-if="allData.collectionData && loanAmount"
        >
          <h3 class="card-header">收款节点信息配置</h3>
          <div class="card-content">
            <multi-table
              :Options="collectionOptions"
              :isSearchForm="false"
              border
              align="center"
              :data="allData.collectionData"
            >
              <template #moneyTag="{ scope, index }">
                <el-select
                  v-if="scope.rowEdit && !forbid"
                  v-model="scope.moneyTag"
                  @focus="(e) => setDisabledProjectNode('moneyTag', index)"
                  @change="(val) => setDisabledProjectNode('moneyTag', index)"
                >
                  <el-option
                    v-for="option in moneyTagOptions"
                    :key="option.value"
                    v-bind="option"
                  ></el-option>
                </el-select>
                <span v-else>{{ scope["moneyTag"] }}</span>
              </template>
              <template #nodeName="{ scope, index }">
                <el-select
                  v-if="scope.rowEdit && !forbid"
                  v-model="scope.nodeName"
                  @focus="(e) => setDisabledProjectNode('nodeName', index)"
                  @change="(val) => setDisabledProjectNode('nodeName', index)"
                >
                  <el-option
                    v-for="option in nodeNameOptions"
                    :key="option.value"
                    v-bind="option"
                  ></el-option>
                </el-select>
                <span v-else>{{ scope["nodeName"] }}</span>
              </template>
              <template #planPrice="{ scope }">
                <el-input-number
                  v-if="scope.rowEdit && !scope.actualPrice"
                  style="width: 100%"
                  class="planPrice-number"
                  :controls="false"
                  :min="0"
                  placeholder="请填写收款金额"
                  v-model.number="scope['planPrice']"
                  @input.native="(val) => handleBlur(val, scope, 'planPrice')"
                ></el-input-number>
                <span v-else>{{ scope["planPrice"] }}</span>
              </template>
              <template #plannedProportion="{ scope }">
                <!-- <span>{{  }}</span> -->
                <el-input-number
                  style="width: 80%"
                  :controls="false"
                  :min="0"
                  :max="100"
                  placeholder="请填写收款占比"
                  v-model.number="scope['plannedProportion']"
                  @input.native="
                    (val) => handleBlur(val, scope, 'plannedProportion')
                  "
                ></el-input-number
                >%
              </template>
              <template #editRowOperation="{ scope }">
                <el-button type="text" @click="handleCollectRow('add', scope)"
                  >新增</el-button
                >
                <el-button type="text" @click="handleCollectRow('del', scope)"
                  >删除</el-button
                >
              </template>
            </multi-table>
          </div>
          <div class="card-footer">
            <p>
              总计划期次： <span>{{ allData.collectionData.length }}</span> 期
              收款节点：<span>{{ allData.collectionData.length }}</span> 个
              拆账金额：¥
              <span>{{ loanAmount }}</span>
              总收款金额：¥
              <span>{{ totalPrice }}</span>
            </p>
          </div>
        </div>
        <!--  审批信息 -->
        <div class="tableCard-container" v-if="allData.approvalData">
          <h3 class="card-header">审批信息</h3>
          <div class="card-content">
            <multi-table
              :Options="configOPtions.approvalOptions"
              :isSearchForm="false"
              border
              align="center"
              stripe
              :data="allData.approvalData"
            >
              <template #auditStage="{ scope }">
                <span>审批人{{ scope.orderNum }}：</span>
              </template>
            </multi-table>
          </div>
        </div>

        <!-- 处理详情信息 -->
        <div class="tableCard-container">
          <the-descriptions
            v-if="allData.processingData"
            :title="config.processing.title"
            border
            :column="2"
            :comparison="config.processing.comparison"
            :data="allData.processingData"
          >
          </the-descriptions>
        </div>
        <!--   财务收款进度信息 -->
        <div class="tableCard-container" v-if="allData.financeData">
          <h3 class="card-header">财务收款进度信息</h3>
          <div class="card-content">
            <multi-table
              :key="Math.random()"
              :Options="financeOptions"
              :isSearchForm="false"
              border
              align="center"
              isIndex
              indexLabel="序号"
              :span-method="objectSpanMethod"
              :data="allData.financeData"
            >
              <template #planPriceActualPrice="{ scope }">
                <span v-if="scope.planPrice">{{
                  (scope.planPrice - scope.actualPrice).toFixed(2)
                }}</span>
                <span v-else>0.00</span>
              </template>
              <!-- 产品应收 -->
              <template #productPlanTotalPrice="{ scope }">
                {{ scope.productPlanPrice }}
              </template>

              <!-- 产品未收 -->
              <template #productUnPrice="{ scope }">
                <span v-if="scope.productPlanPrice">{{
                  (scope.productPlanPrice - scope.productActualPrice).toFixed(2)
                }}</span>
                <span v-else>0.00</span>
              </template>
              <template #projectUnPrice="{ scope }">
                <span v-if="scope.projectPlanPrice">{{
                  (scope.projectPlanPrice - scope.projectActualPrice).toFixed(2)
                }}</span>
                <span v-else>0.00</span>
              </template>
            </multi-table>
          </div>
        </div>
        <!--  市场业务要求备注 -->
        <!-- <div class="tableCard-container">
         
          <div class="card-content">
            <el-input
              type="textarea"
              v-model="allData.descData.note"
              placeholder="请填写备注信息"
              :rows="6"
              maxlength="3000"
              show-word-limit
              :disabled="mode === 'show'"
            ></el-input>
          </div>
        </div> -->
        <!--  账号信息 -->
        <div class="tableCard-container" v-if="allData.accountInfoData">
          <the-descriptions
            title="账号信息"
            border
            :column="2"
            :comparison="accountInfoComparison"
            :data="allData.accountInfoData"
          >
          </the-descriptions>
        </div>
        <div v-if="pageMode === 'base'" class="tableCard-container">
          <EditorRemark
            title="市场业务要求备注"
            :toolbarConfig="toolbarConfig"
            :editorConfig="editorConfig"
            :remark.sync="allData.descData.note"
          ></EditorRemark>
          <!-- <h3 class="card-header">市场业务要求备注</h3>
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="editorMode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="allData.descData.note"
              :defaultConfig="editorConfig"
              :mode="editorMode"
              @onCreated="onCreated"
            />
          </div> -->
        </div>
        <div
          class="tableCard-container"
          v-if="isShowUpdateOrder && allData.descData"
        >
          <EditorRemark
            title="项目变更备注信息"
            :editorConfig="{ readOnly: true }"
            :remark.sync="allData.descData.itemModifiedRemark"
          ></EditorRemark>
        </div>
        <div
          class="tableCard-container"
          v-if="isShowBorrowMoney && allData.descData"
        >
          <EditorRemark
            title="项目拆账备注"
            :remark.sync="allData.descData.itemDismantleRemark"
          ></EditorRemark>
        </div>

        <!--  项目相关附件 -->
        <div class="tableCard-container" v-if="allData.accessoryData">
          <h3 class="card-header">项目相关附件</h3>
          <div class="card-content">
            <multi-table
              :Options="configOPtions.accessoryOptions"
              :isSearchForm="false"
              border
              align="center"
              :data="allData.accessoryData"
              @setupEvents="setupEvents"
            >
              <template #operation="{ scope }">
                <el-button
                  v-if="!['zip', 'rar'].includes(scope.row.fileSuffix)"
                  type="text"
                  @click="setupEvents({ type: 'preview', row: scope.row })"
                  >预览</el-button
                >
              </template>
            </multi-table>
          </div>
        </div>
        <!--  作业相关附件 -->
        <div class="tableCard-container" v-if="allData.jobData">
          <h3 class="card-header">作业相关附件</h3>
          <div class="card-content">
            <multi-table
              :Options="configOPtions.accessoryOptions"
              :isSearchForm="false"
              border
              align="center"
              :data="allData.jobData"
              @setupEvents="setupEvents"
            >
              <template #operation="{ scope }">
                <el-button
                  v-if="!['zip', 'rar'].includes(scope.row.fileSuffix)"
                  type="text"
                  @click="setupEvents({ type: 'preview', row: scope.row })"
                  >预览</el-button
                >
              </template>
            </multi-table>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="文件预览"
      class="previewDialog"
      :visible.sync="previewDialog"
      width="1240px"
    >
      <files-view :url="previewUrl"></files-view>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialog = false">取 消</el-button>
        <el-button type="primary" @click="previewDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TheDescriptions from "@/components/TheDescriptions";
import MultiTable from "@/components/MultiTable";
// 富文本备注输入框
import EditorRemark from "@/views/components/EditorRemark";

// 格式化表格数据方法
import { formatterCallback } from "@/utils/common";
import { mapState } from "vuex";

// 获取部门下的人员
import { pageListUser } from "@/api/system/user";
import { xtSynergyOrderGetOrderBelongsDept } from "@/api/workOrderProcessing/qualification";
import { treeselect } from "@/api/system/dept";
import { downFile } from "@/utils/previewAndDownload";

import FilesView from "@/components/FilesView";

// 配置信息
import { configData } from "@/mixins/configData/configOptions";
import cloneDeep from "lodash/cloneDeep";

// import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// import "@wangeditor/editor/dist/css/style.css";

export default {
  name: "TabsPublic",
  components: {
    TheDescriptions,
    MultiTable,
    FilesView,
    EditorRemark,
  },
  props: {
    config: {
      type: Object,
    },

    allData: {
      type: Object,
    },
    showPage: {
      type: String,
      default: "",
    },
    // 是否可编辑
    mode: "edit" | "show",
    // 页面模式
    pageMode: String,
    labelWidth: String,
    pageActive: Number | String,
    tabsData: {
      type: Array,
      default: () => [],
    },
    // 配置收款节点的动态数据
    collectionConfigNode: {
      type: Array,
      default: () => [],
    },
    financeConfig: {
      type: Array,
      default: () => [],
    },
    // 是否显示项目变更信息
    isShowUpdateOrder: Boolean,
    // 显示拆账信息
    isShowBorrowMoney: Boolean,
  },
  data() {
    return {
      title1: "",
      title2: "",
      isSlice: true,

      configOPtions: configData,

      data: {},
      collectionOptions: [],
      moneyTagOptions: [
        { label: "首款", value: "首款", disabled: false },
        { label: "二期款", value: "二期款", disabled: false },
        { label: "三期款", value: "三期款", disabled: false },
        { label: "四期款", value: "四期款", disabled: false },
        { label: "五期款", value: "五期款", disabled: false },
        { label: "尾款", value: "尾款", disabled: false },
        { label: "全款", value: "全款", disabled: false },
      ],
      nodeNameOptions: [],
      forbid: false, //收款节点是否已确认
      // 收款节点信息配置
      sourceCollectionOptions: [
        {
          // editType: "select",
          label: "计划收款期次",
          slotName: "moneyTag",
          // editOptions: [
          //   { label: "首款", value: "首款" },
          //   { label: "二期款", value: "二期款" },
          //   { label: "三期款", value: "三期款" },
          //   { label: "四期款", value: "四期款" },
          //   { label: "五期款", value: "五期款" },
          //   { label: "尾款", value: "尾款" },
          //   { label: "全款", value: "全款" },
          // ],
        },
        {
          // editType: "select",
          label: "收款节点配置",
          slotName: "nodeName",
          // editOptions: [],
        },

        {
          label: "计划收款金额（元）",
          slotName: "planPrice",
        },
        {
          label: "收款节点占比（自动计算）",
          slotName: "plannedProportion",
        },
      ],

      // 财务收款进度表格配置信息
      financeOptions: [],
      finance: [
        { label: "工单阶段", prop: "nodeName" },
        { label: "收款名称", prop: "moneyTag" },
        { label: "节点应收", prop: "planPrice" },
        { label: "节点已收", prop: "actualPrice" },
        { label: "节点未收", slotName: "planPriceActualPrice" },
        { label: "产品应收", prop: "productPlanPrice" },

        { label: "产品已收", prop: "productActualPrice" },
        { label: "产品未收", slotName: "productUnPrice" },
        { label: "收款主体", prop: "subjectName" },
        { label: "收款方式", prop: "payment" },
        { label: "收款提起人", prop: "launchPerson" },
        { label: "收款经手人", prop: "handlePerson" },
        { label: "财务确认", prop: "financeUserName" },
      ],

      accountInfoComparison: [
        {
          label: "三库账号：",
          prop: "threeLibraryAccount",
        },
        {
          label: "三库密码：",
          prop: "threeLibraryPassword",
        },
        {
          label: "一建账号：",
          prop: "constructorAccount",
        },
        {
          label: "一建密码：",
          prop: "constructorPassword",
        },
        {
          label: "二建账号：",
          prop: "associateConstructorAccount",
        },
        {
          label: "二建密码：",
          prop: "associateConstructorPassword",
        },
        {
          label: "社保账号：",
          prop: "socialSecurityAccount",
        },
        {
          label: "社保密码：",
          prop: "socialSecurityPassword",
        },
        {
          label: "政务网络账号：",
          prop: "governmentAffairsNetworkAccount",
        },
        {
          label: "政务网络密码：",
          prop: "governmentAffairsNetworkPassword",
        },
      ],

      previewDialog: false, //文件预览
      previewUrl: "", //预览文件路径

      // 富文本
      // editor: null,
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容...",
        readOnly: this.mode === "show",
      },
      // editorMode: "simple", // or 'simple'
    };
  },
  methods: {
    // onCreated(editor) {
    //   this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    // },
    // 设置标题
    setTitle(key) {
      if (this.mode === "show") return (this.title1 = "基本信息");
      switch (key) {
        case "base":
          this.title1 = "基本信息";
          break;
        case "safety":
          this.title1 = "安证基础信息配置";
          break;
        case "certification":
          this.title1 = "资质基础信息配置";
          break;

        case "talents":
          this.title1 = "人才基础信息配置";
          break;
        case "certificate":
          this.title1 = "证书基础信息配置";
          break;
        case "ICBC":
          this.title1 = "工商基础信息配置";

          break;
        case "property":
          this.title1 = "知识产权基础信息配置";

          break;
        default:
          break;
      }
    },
    handleCollectRow(type, scope) {
      if (type === "add") {
        this.allData.collectionData.push({
          rowEdit: true,
          projectId: scope.row.projectId,
        });
      } else if (type === "del") {
        let index = scope.$index;
        this.allData.collectionData.splice(index, 1);
      }
    },
    // 表格行操作
    setupEvents({ type, row }) {
      if (type === "preview") {
        // 预览

        this.previewDialog = true;
        this.$nextTick(() => {
          // window.open(row.url,'_self')
          this.previewUrl = row.url;
        });
      } else if (type === "down") {
        // 下载
        downFile(row.url, row.fileName);
      }
    },
    // 添加人才
    addTalentDemand() {
      this.allData.talentDemandData.push({ rowEdit: true });
    },
    // 删除人才
    delTalen(scope) {
      let index = scope.$index;
      this.allData.talentDemandData.splice(index, 1);
    },
    // 计算收款节点的占比
    proportionFn(val) {
      if (!val) return "0";
      let str = parseFloat((val / this.loanAmount) * 100, 2).toFixed(2);

      return str;
    },
    // 获取部门下的人员
    getListUser(id) {
      if (!id) return;
      let sendData = {
        deptId: id,
      };
      pageListUser(sendData).then((res) => {
        let row = this.config.comparison.find(
          (item) => item.prop === "launchUserId"
        );

        row.options = res.rows.map((item) => {
          return {
            label: item.userName,
            value: item.userId,
          };
        });
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect(id) {
      if (!id) return;
      let sendData = {
        deptId: id,
      };
      xtSynergyOrderGetOrderBelongsDept(sendData).then((res) => {
        let row = this.config.comparison.find(
          (item) => item.prop === "ascriptionDeptId"
        );

        row.options = res.data;
      });
    },
    // input,时间选择器发生改变
    changeInput({ val, row, data }) {
      this.$emit("changeInput", { val, row, data });
    },
    // 下拉发生改变时触发
    handleChange({ obj, row, data }) {
      if (row.prop === "subjectDeptId") {
        // 订单签约主体
        // this.getTreeselect(obj.value);
        // this.allData.descData.subjectDeptName = obj.label;
      } else if (row.prop === "ascriptionDeptId") {
        // 订单所属部门
        this.getListUser(obj.value);
        this.allData.descData.ascriptionDeptName = obj.label;
      } else if (row.prop === "launchUserId") {
        // 订单所属人
        this.allData.descData.transUserId = obj.value;
        this.allData.descData.transUserName = obj.label;
        this.allData.descData.launchUserName = obj.label;
      } else if (row.prop === "transUserId") {
        // 订单转化人员
        this.allData.descData.transUserName = obj.label;
      } else if (row.prop === "handleUserId") {
        // 经办人员
        this.allData.descData.handleUserName = obj.label;
      } else if (row.prop === "handleDeptId") {
        // 经办部门
        this.allData.descData.handleDeptName = obj.label;
      }
      this.$emit("change", { obj, row, data });
    },
    // 收款编辑新增操作选项
    collectionEdit() {
      // 安证、资质、证书、人才、工商、知识产权
      let arr = [
        "safety",
        "certification",
        "talents",
        "certificate",
        "ICBC",
        "property",
      ];
      this.forbid = this.allData.descData?.forbid ? true : false; //判断是否已拆账，

      if (this.forbid) {
        // 已拆账，只能修改价格
        // let arr = this.sourceCollectionOptions.map((item) => {
        //   return { ...item, editType: "string" };
        // });
        this.collectionOptions = this.sourceCollectionOptions;
      } else {
        if (this.mode === "edit" && arr.includes(this.pageMode)) {
          let actions = {
            label: "操作",
            action: true,
          };
          this.collectionOptions = [...this.sourceCollectionOptions, actions];
        }
      }
    },
    toggleTabs(id) {
      this.$emit("update:pageActive", id);
    },
    // 项目数据总计
    projectSummary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        } else if (index === 7 || index === 9) {
          sums[index] = data.reduce((prev, item) => {
            const value = Number(item[column.property]);
            if (!isNaN(value)) {
              return prev + value;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = index === 9 ? sums[index].toFixed(2) : sums[index];
        } else if (index === 8) {
          sums[index] = data
            .reduce((prev, item) => {
              return (prev += item.quantity * item.unitPrice);
            }, 0)
            .toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    handleBlur(e, scope, type) {
      const val = +e.target.value;

      if (type === "planPrice") {
        // 价格
        if (+val > +this.loanAmount) {
          // 单次输入价格大于总计
          scope["planPrice"] = "";
          this.$message.error("输入的价格大于总价格");
          return;
        }
        let num = parseFloat((val / this.loanAmount) * 100, 2).toFixed(2);
        scope["planPrice"] = val;

        this.$set(scope, "plannedProportion", num);
      } else if (type === "plannedProportion") {
        // 占比

        if (val >= 100) {
          e.target.value = 100;
          scope["planPrice"] = this.loanAmount;
          return;
        }

        scope["planPrice"] = ((val * this.loanAmount) / 100).toFixed(2);
      }
    },
    // 处理财务数据
    dealFinanceData() {
      if (this.allData.financeData) {
        // let productPlanPrice = 0;
        let productActualPrice = 0;
        let productUnPrice = 0;

        this.allData.financeData.forEach((item) => {
          // productPlanPrice += item.hasOwnProperty("productPlanPrice")
          //   ? +item.productPlanPrice
          //   : +item.planPrice; //应收productActualPrice
          productActualPrice += item.hasOwnProperty("productActualPrice")
            ? +item.productActualPrice
            : +item.actualPrice; //已收
          productUnPrice += item.productPlanPrice - item.productActualPrice;
        });
        this.allData.financeData.forEach((item) => {
          // item.productPlanPrice = productPlanPrice;
          item.productActualPrice = productActualPrice;
          item.productUnPrice = productUnPrice > 0 ? productUnPrice : "0.00";
        });
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = ["项目应收", "项目已收", "项目未收"];

      if (arr.includes(column.label)) {
        if (rowIndex === 0) {
          return {
            rowspan: this.allData.financeData.length,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },

    setDisabledProjectNode(prop, index) {
      console.log(index, prop);
      console.log(this.allData.collectionData, "collectionData");
      if (index === 0) {
        this[`${prop}Options`].map((item) => {
          // item.disabled = false;
          this.$set(item, "disabled", false);
        });
        return;
      }
      const { collectionData } = this.allData;
      // 获取表格上条数据
      let i = index - 1;
      let value = collectionData[i][prop];
      console.log(value);
      // 获取上条表格选中的数据的下标
      let newIndex = this[`${prop}Options`].findIndex(
        (item) => item.value == value
      );
      console.log(newIndex, "newIndex");
      this[`${prop}Options`].map((item, idx) => {
        if (newIndex >= idx) {
          // item.disabled = true;
          this.$set(item, "disabled", true);
        } else {
          // item.disabled = false;
          this.$set(item, "disabled", false);
        }
      });
    },
    catMore(type) {
      this.isSlice = !this.isSlice;
    },
  },
  mounted() {
    this.setTitle(this.pageMode);

    this.addOrSubOrderInfo = cloneDeep(this.allData.addOrSubOrderInfo);
    this.allData.addOrSubOrderInfo.slice(0, 5);

    if (this.pageMode === "base" && this.mode === "edit") {
      // 基础信息
      // this.getTreeselect(this.allData.descData.subjectDeptId);
      this.getListUser(this.allData.descData.ascriptionDeptId);
    }
    if (this.mode === "edit") {
      this.accountInfoComparison = this.accountInfoComparison.map((item) => {
        return {
          ...item,
          type: "input",
        };
      });
    }
    // this.dealFinanceData();
    this.$nextTick(() => {
      if (this.pageMode !== "base") return;
      let tds = document.querySelectorAll(
        ".el-table .el-table__footer-wrapper tr>td"
      );
      tds.forEach((item, index) => {
        if (index === 0) {
          item.colSpan = 7;
          item.style.textAlign = "center";
        } else if (index == 7 || index == 8 || index == 9) {
        } else {
          item.style.display = "none";
        }
      });
    });
  },
  computed: {
    // // 获取项目总价
    // projectTotal() {
    //   let total =
    //     this.allData.projectData[0].unitPrice *
    //     this.allData.projectData[0].quantity;
    //   if (!total) {
    //     this.allData.collectionData = [];
    //   }
    //   return total;
    // },
    totalPrice() {
      return this.allData.collectionData
        .reduce((prep, item) => {
          if (item.planPrice) {
            return (prep += +item.planPrice);
          } else {
            return (prep += 0);
          }
        }, 0)
        .toFixed(2);
    },
    // 拆账金额
    loanAmount() {
      const { projectData } = this.allData;
      let sum = 0;
      projectData.forEach((item) => {
        sum += +item.dismantlePrice ?? 0;
      });
      return sum.toFixed(2);
    },

    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    pageMode(newVal) {
      this.setTitle(newVal);
      this.collectionEdit();
    },
    // allData: {
    //   handler(newVal) {
    //     this.dealFinanceData();
    //   },
    //   deep: true,
    // },
    // "allData.collectionData": {
    //   handler(newVal) {
    //     this.collectionEdit();
    //     if (
    //       this.allData?.collectionData &&
    //       this.allData?.collectionData.length
    //     ) {
    //       console.log(this.allData.collectionData);
    //       // this.allData.collectionData.map((item) => {
    //       //   this.$set(
    //       //     item,
    //       //     "plannedProportion",
    //       //     this.proportionFn(item.planPrice)
    //       //   );
    //       // });
    //     }
    //   },
    //   deep: true,
    // },

    pageActive() {
      this.collectionEdit();
      if (this.allData?.collectionData && this.allData?.collectionData.length) {
        this.allData.collectionData.map((item) => {
          this.$set(
            item,
            "plannedProportion",
            this.proportionFn(item.planPrice)
          );
        });
      }
    },
    collectionConfigNode(newVal) {
      if (newVal.length) {
        // this.sourceCollectionOptions[1].editOptions = newVal;
        this.nodeNameOptions = newVal;
      }
    },
    financeConfig: {
      handler(newVal) {
        console.log({ newVal });
        if (newVal.length) {
          this.financeOptions = newVal;
        } else {
          this.financeOptions = this.finance;
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-public {
  .actions {
    display: flex;
    justify-content: flex-end;
  }

  // .previewDialog {
  //   overflow: hidden;
  //   :deep(.el-dialog__body) {
  //     overflow-x: auto;
  //   }
  // }
}
::v-deep .planPrice-number {
  .el-input--medium {
    .el-input__inner {
      border-color: red;
    }
  }
}
</style>
