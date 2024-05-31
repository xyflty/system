// 三库资源库
<template>
  <div class="app-container">
    <el-card>
      <avue-form
        :option="queryOptions"
        v-model="queryParams"
        @submit="handleQuery"
        @resetForm="resetQuery"
      >
      </avue-form>
    </el-card>
    <el-card>
      <avue-crud
        :option="tableOptions"
        :data="tableData"
        :page.sync="pager"
        v-loading="loading"
        @on-load="getList"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-row :gutter="10" class="mb8">
            <template v-if="queryParams.isReceive == 0">
              <el-col :span="1.5">
                <el-button
                  size="small"
                  plain
                  @click="handleReceive"
                  v-hasPermi="['zw:threeLibrarySea:threeLibrarySeaTake']"
                  >领取资源</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-badge :value="badgeNum" class="item">
                  <el-button size="small" plain @click="handleChanegType(1, '')"
                    >我领取的资源</el-button
                  >
                </el-badge>
              </el-col>
            </template>
            <template v-if="queryParams.isReceive == 1">
              <el-col :span="1.5">
                <el-button size="small" plain @click="handleChanegType(0, '')"
                  >去三库资源库</el-button
                >
              </el-col>
            </template>
          </el-row>
        </template>

        <!-- 操作栏 -->
        <template slot-scope="{ row }" slot="menu">
          <div v-if="queryParams.isReceive == 1">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-refresh"
              @click="handleAction(row, 'convert')"
              v-hasPermi="['zw:threeLibrarySea:convertClue']"
              >转入线索</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="
                $router.push({
                  name: 'SeaDetail',
                  query: { id: row.id, type: 'threeLibrarySea', val: 1 },
                })
              "
              v-hasPermi="['zw:threeLibrarySea:query']"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-refresh-left"
              @click="handleAction(row, 'putBackSea')"
              v-hasPermi="['zw:threeLibrarySea:putBackSea']"
              >放回公海</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-refresh-left"
              @click="handleFeedback(row)"
              >反馈</el-button
            >
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleReceive(row)"
              v-hasPermi="['zw:threeLibrarySea:threeLibrarySeaTake']"
              >领取</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-d-arrow-right"
              @click="
                $router.push({
                  name: 'SeaDetail',
                  query: { id: row.id, type: 'threeLibrarySea' },
                })
              "
              v-hasPermi="['zw:threeLibrarySea:query']"
              >详细</el-button
            >
          </div>
        </template>
      </avue-crud>
    </el-card>

    <ThreeKuClue
      :visible.sync="visible"
      :form="clueForm"
      @submit="addClueSbumit"
      @reset="handleReset"
    />

    <FeedbackModel ref="feedbackRef" @submit="feedbackSubmit" />
  </div>
</template>

<script>
import {
  threeLibrarySeaList,
  threeLibrarySeaTake,
  threeLibrarySeaPutBackSea,
  convertClue,
} from "@/api/core/threeKuSea";

import { seaHistory } from "@/api/core/clueSea";

import ThreeKuClue from "@/views/core/components/threeKuClue.vue";
import FeedbackModel from "@/views/core/components/FeedbackModel.vue";
import { mapState } from "vuex";
export default {
  components: {
    ThreeKuClue,
    FeedbackModel,
  },
  data() {
    return {
      // 筛选表单配置
      queryOptions: {
        labelWidth: 20,
        menuSpan: 6,

        filterDic: true,
        filterNull: true,

        submitText: "搜索",
        emptyText: "重置",
        column: [],
      },
      //   筛选参数
      queryParams: {
        isReceive: 0,
      },

      // 表格配置数据
      tableOptions: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        columnBtn: false,

        border: true,
        stripe: true,
        selection: true,
        headerAlign: "center",
        align: "center",
        column: [],
      },
      // 表格加载状态
      loading: false,
      //   分页数据
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 表格数据
      tableData: [],
      //   表格选中的数据
      selectData: [],

      visible: false,
      clueForm: {},

      badgeNum: 0,

      rowItem: {},
    };
  },
  methods: {
    setOptions() {
      this.queryOptions.column = [
        // {
        //   label: "",
        //   prop: "keyword",
        //   placeholder: "资源名称",
        //   span: 6,
        // },
        {
          label: "安证有效时间",
          prop: "safetyPermitsTime",
          type: "monthrange",
          format: "yyyy-MM",
          valueFormat: "yyyy-MM",
          span: 6,
          labelWidth: 120,
          startPlaceholder: "开始月份",
          endPlaceholder: "结束月份",
        },
        {
          label: "资质有效期",
          prop: "expireDate",
          type: "monthrange",
          format: "yyyy-MM",
          valueFormat: "yyyy-MM",
          span: 6,
          labelWidth: 100,
          startPlaceholder: "开始月份",
          endPlaceholder: "结束月份",
        },
      ];

      this.tableOptions.column = [
        {
          label: "资源名称",
          prop: "companyName",
        },
        // {
        //   label: "资源来源",
        //   prop: "companyName",
        // },
        {
          label: "所在地区",
          prop: "city",
        },
        {
          label: "首次领取人",
          prop: "firstReceivePerson",
        },
        {
          label: "最后领取人",
          prop: "lastReceivePerson",
        },
      ];
    },

    // 筛选
    handleQuery(form, done) {
      this.pager.currentPage = 1;
      this.getList();
      done();
    },
    // 重置
    resetQuery() {
      this.getList();
    },
    // 表格多选
    selectionChange(list) {
      this.selectData = list.map((item) => item.id);
    },

    // 切换表格数据类型
    handleChanegType(isReceive) {
      this.pager.currentPage = 1;
      this.queryParams.isReceive = isReceive;
      this.getList();
    },
    // 领取资源（表格操作栏和多选领取资源操作）
    handleReceive(row) {
      const ids = row.id ? [row.id] : this.selectData;
      if (ids.length == 0 || ids[0] == undefined) {
        this.$message.warning("请至少选择一项");
        return;
      }
      this.$modal
        .confirm("是否确认领取所选的三库资源数据项？")
        .then(() => {
          this.loading = true;
          return threeLibrarySeaTake({ ids: ids });
        })
        .then((res) => {
          this.loading = false;

          if (res.data && res.data.length) {
            this.$alert(
              "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
                res.data.join("<br />") +
                "</div>",
              "导入结果",
              { dangerouslyUseHTMLString: true }
            );
          } else {
            this.getList();
            this.$modal.msgSuccess("领取成功");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    putSeaFn(row) {
      this.$modal
        .confirm(`是否确认将所选择的资源放回公海？`)
        .then(() => {
          this.loading = true;
          // return type == 1
          //   ? convertClue({
          //       archiveId: row.archiveId,
          //       id: row.id,
          //       companyName: row.companyName,
          //     })
          //   : putBack({ id: row.id });
          return threeLibrarySeaPutBackSea({ id: row.id });
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("操作成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 操作栏操作
    handleAction(row, type) {
      if (type === "convert") {
        this.clueForm = row;

        this.visible = true;
      } else if (type === "putBackSea") {
        this.putSeaFn(row);
      } else if (type === "edit") {
        // 编辑
        this.$router.push({
          name: "SeaDetail",
          query: { id: row.id, type: "threeKuSea", val: 1 },
        });
      }
      console.log(row, type);
    },

    async addClueSbumit(form, done) {
      let sendData = {
        id: form.id,
        contactInfoList: form.contactInfoList,
      };
      console.log(sendData);

      try {
        const res = await convertClue(sendData);

        if (res.code === 200) {
          this.handleReset();
          this.getList();
          this.$message.success("已转线索");
        } else {
          this.$message.error(res.msg);
        }
        done();
      } catch (error) {
        done();
      }
    },

    handleReset() {
      this.visible = false;
      this.clueForm = {};
    },
    // 获取筛选参数
    getParams() {
      const { currentPage, pageSize } = this.pager;
      const { safetyPermitsTime, expireDate } = this.queryParams;
      const sendParams = {
        ...this.queryParams,
        pageNum: currentPage,
        pageSize,
        safetyPermitsTimeBeginTime:
          (safetyPermitsTime && safetyPermitsTime[0]) || null,
        safetyPermitsTimeEndTime:
          (safetyPermitsTime && safetyPermitsTime[1]) || null,
        expireDateBeginTime: (expireDate && expireDate[0]) || null,
        expireDateEndTime: (expireDate && expireDate[1]) || null,
      };
      delete sendParams.safetyPermitsTime;
      delete sendParams.expireDate;
      return sendParams;
    },
    // 获取表格数据
    async getList() {
      const sendParams = this.getParams();
      this.loading = true;

      try {
        const res = await threeLibrarySeaList(sendParams);
        if (res.code === 200) {
          console.log({ res });
          this.tableData = res.rows;

          this.pager.total = res.total;
          this.badgeNum = res.param.receiveCount;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    // 反馈
    handleFeedback(row) {
      this.rowItem = row;
      this.$refs.feedbackRef.show();
    },

    feedbackSubmit(model, hide) {
      console.log(model);
      let sendData = {
        userId: this.rowItem.userId,
        threeLibraryId: this.rowItem.id,
        ...model,
      };
      seaHistory(sendData).then((res) => {
        if (res.code === 200) {
          this.getList();
          hide();
          this.$message.success("反馈意见成功");
        }
      });
    },
  },
  mounted() {
    this.setOptions();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 15px;
}
::v-deep .avue-crud__header {
  padding-top: 15px;
}
</style>
