<template>
  <div class="detail-container">
    <DetailPage
      v-if="detailData"
      :title="detailData.zwOrderVo.companyName"
      :tabs="tabs"
      :active="active"
      @togggle="handleTogggle"
    >
      <template #content>
        <TabsPublic
          v-if="pageData"
          :config="cloneConfigData"
          :allData="pageData"
          :financeConfig="financeConfig"
          mode="show"
          isShowUpdateOrder
          isShowBorrowMoney
          :pageMode="pageMode"
          :tabsData="tabsData"
          :pageActive.sync="pageActive"
        >
          <template #actions>
            <el-button type="primary" @click="handleActions">核销</el-button>
            <!--  v-show="detailData.financialCheckButtonFlag" -->
            <!--   v-if="detailData.zwOrderVo.orderType === 3" -->
          </template>
        </TabsPublic>
      </template>
    </DetailPage>

    <el-dialog
      title="提示"
      width="1200px"
      :visible.sync="destroyDialog"
      @close="cancel"
    >
      <multi-table
        :Options="collectionOptions"
        :isSearchForm="false"
        border
        align="center"
        :data="collectionData"
      >
        <template #editRowOperation="{ scope }">
          <!-- <el-button type="text" @click="handleCollectRow('add')"
            >新增</el-button
          > -->
          <el-button
            type="text"
            :disabled="!isCompile"
            @click="handleCollectRow('del', scope)"
            >删除</el-button
          >
        </template>
      </multi-table>

      <div v-if="isCompile" class="card-footer" style="justify-content: center">
        <p style="cursor: pointer" @click="handleCollectRow('add')">
          <i class="el-icon-plus"></i>新增
        </p>
      </div>
      <div class="tableFooter" v-else>
        <p>
          应收款金额:<span>{{ totalObj.receivableTotal }}</span>
        </p>
        <p>
          已收款金额: <span>{{ totalObj.receivedTotal }}</span>
        </p>
        <p>
          未收款金额: <span>{{ totalObj.uncollected }}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DetailPage from "@/components/DetailPage";
import TabsPublic from "@/components/TabsPublic";
import MultiTable from "@/components/MultiTable";
import {
  xtFinancialSettlementFinancialInfo,
  xtFinancialSettlementProjectDetails,
  xtFinancialSettlementFinancialCheck,
  getFinancialCheckList,
} from "@/api/settlement";

// import { configData } from "@/mixins/configData/configData";
// import { processingData } from "@/mixins/configData/processingData";

// import { dealTabs } from "@/utils/common";
import { xtCommonDetail } from "@/mixins/xtCommonDetail";
export default {
  components: {
    DetailPage,
    TabsPublic,
    MultiTable,
  },
  mixins: [xtCommonDetail],
  data() {
    return {
      baseApi: xtFinancialSettlementFinancialInfo,
      projectDetailApi: xtFinancialSettlementProjectDetails,
      isAccessory: true, //是否有项目附件
      // 当前页面是财务详情
      pagesDetailType: "financial",
      type: "",

      destroyDialog: false,
      collectionOptions: [
        {
          editType: "select",
          label: "计划收款期次",
          prop: "moneyTag",
          editOptions: [
            { label: "首款", value: "首款" },
            { label: "二期款", value: "二期款" },
            { label: "三期款", value: "三期款" },
            { label: "四期款", value: "四期款" },
            { label: "五期款", value: "五期款" },
            { label: "尾款", value: "尾款" },
            { label: "全款", value: "全款" },
          ],
          attrs: {
            placeholder: "请选择计划收款期次",
          },
        },
        {
          editType: "input",
          label: "已收款金额(元)",
          prop: "actualPrice",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款主体",
          prop: "subjectName",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "select",
          label: "收款方式",
          prop: "payment",
          editOptions: [
            { label: "公户收款", value: "公户收款" },
            { label: "扫码收款", value: "扫码收款" },
          ],
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款提起人",
          prop: "launchPerson",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款经手人",
          prop: "handlePerson",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "date-picker",
          label: "收款时间",
          prop: "receiveDate",
          width: "250px",
          attrs: {
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
        },
        {
          label: "操作",
          action: true,
        },
      ],
      collectionData: [
        {
          rowEdit: true,
        },
      ],
      financeConfig: [],
      isCompile: true, //判断核销是否可增删操作
    };
  },
  methods: {
    /**
     *
     * 核销逻辑start
     */
    handleActions() {
      this.getFinancialCheck(this.orderJobId);
    },
    cancel() {
      this.destroyDialog = false;
      this.collectionData = [{ rowEdit: true }];
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
    // 财务结算中心-特殊订单核销
    confirm() {
      let flag = this.isTableEary(this.collectionData);
      if (!flag) return this.$message.error("请填写表格数据");
      let sendData = {
        moneyNodeList: this.collectionData,
        orderJobId: this.orderJobId,
      };

      xtFinancialSettlementFinancialCheck(sendData).then((res) => {
        if (res.code === 200) {
          this.cancel();
          this.$message.success("已成功核销");
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 获取当前已核销数据
    async getFinancialCheck(orderJobId) {
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
        this.destroyDialog = true;
      }
    },
    /**
     *
     * 核销逻辑end
     */

    handleCollectRow(type, scope) {
      if (type === "add") {
        this.collectionData.push({
          rowEdit: true,
        });
      } else if (type === "del") {
        let index = scope.$index;
        this.collectionData.splice(index, 1);
      }
    },
    // 配置财务信息
    setFinanceConfig() {
      if (this.pageMode == "base") {
        this.financeConfig = [
          { label: "项目名称", prop: "projectName" },
          { label: "总价", prop: "productPlanPrice" },
          { label: "产品应收", slotName: "productPlanTotalPrice" },

          { label: "产品已收", prop: "productActualPrice" },
          { label: "产品未收", slotName: "productUnPrice" },

          { label: "项目应收", prop: "projectPlanPrice" },
          { label: "项目已收", prop: "projectActualPrice" },
          { label: "项目未收", slotName: "projectUnPrice" },
        ];
      } else {
        this.financeConfig = [];
      }
    },
  },
  mounted() {
    this.setFinanceConfig();
  },
  computed: {
    totalObj() {
      // 应收
      let receivableTotal = this.collectionData.reduce((prev, item) => {
        return (prev += +item.planPrice);
      }, 0);
      // 已收
      let receivedTotal = this.collectionData.reduce((prev, item) => {
        return (prev += +item.actualPrice);
      }, 0);

      let uncollected = receivableTotal - receivedTotal;
      return { receivableTotal, receivedTotal, uncollected };
    },
  },
};
</script>

<style lang='scss' scoped>
.card-footer {
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #333;
  padding: 0 20px;
  background: #f8f8f9;
  span {
    color: red;
    font-size: 16px;
    font-weight: 500;
  }
}
.tableFooter {
  display: flex;
  justify-content: flex-end;
  background: #f8f8f9;
  color: #333;
  font-size: 14px;
  padding: 20px 10px;
  p {
    span {
      padding: 0 8px;
      font-size: 18px;
      font-weight: 500;
      color: #f56c6c;
    }
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>