// 企业安证资质信息

<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <avue-form
      :option="queryOptions"
      v-model="queryForm"
      @submit="handleSubmit"
      @reset-change="handleReset"
    ></avue-form>
    <!-- 表格数据 -->
    <avue-crud
      :data="tableData"
      :option="options"
      :page.sync="pager"
      :span-method="spanMethod"
      v-loading="loading"
      @on-load="getList"
      @sort-change="sortChange"
    >
      <template slot="menuLeft">
        <PresentationStatistics
          :comparison="contrast"
          :data="statisticData"
          :loading="statisticsLoading"
        />
      </template>
      <template slot="menuRight">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['synergy:companyMonitor:importData']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['synergy:companyMonitor:export']"
              >导出</el-button
            >
          </el-col>
        </el-row>
      </template>
      <!-- 操作栏 -->
      <template slot-scope="{ type, size, row, index }" slot="menu">
        <el-button
          icon="el-icon-view"
          :size="size"
          :type="type"
          v-hasPermi="['synergy:companyMonitor:query']"
          @click="goDetail(row, index)"
          >详细</el-button
        >
      </template>
    </avue-crud>

    <!-- 企业安证资质信息导入对话框 -->
    <ImportModel
      title="企业安证资质信息导入"
      :visible.sync="open"
      action="/synergy/companyMonitor/importData"
      templateUrl="/synergy/companyMonitor/importTemplate"
      templateName="企业安证资质信息模版"
      @success="handleFileSuccess"
    />
  </div>
</template>

<script>
import {
  companyMonitorList,
  companyMonitorTotal,
} from "@/api/newreport/threeKu";
import { areaClass } from "@/api/xt/monitor";
import { getToken } from "@/utils/auth";

import ImportModel from "@/views/components/ImportModel.vue";

import { cityArea } from "@/utils/area";

import { mapState } from "vuex";

export default {
  components: {
    ImportModel,
  },
  data() {
    return {
      loading: false,
      queryForm: {},
      // 查询菜单配置
      queryOptions: {
        labelWidth: 120,
        menuSpan: 4,
        submitText: "查询",
        emptyText: "重置",

        filterNull: true,
        filterDic: true,
        column: [],
      },

      tableData: [],
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      options: {
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        editBtn: false,
        delBtn: false,
        border: true,
        menuFixed: "right", // 操作栏列冻结列
        menuWidth: 100, //操作栏宽度

        stripe: true,

        headerAlign: "center",
        align: "center",
        column: [],
      },

      // 统计
      // 统计对照表（根据prop对照其label）
      contrast: [
        {
          label: "企业数量：",
          value: "total",
        },
        {
          label: "安全许可证：",
          value: "azCertTotal",
        },
        {
          label: "资质证书：",
          value: "aptCertTotal",
        },
        // {
        //   label: "重点关注：",
        //   value: "focusTotal",
        // },
        // {
        //   label: "紧急关注：",
        //   value: "focusOnMiningTotal",
        // },
      ],

      statisticData: {},
      statisticsLoading: false,

      // 导入
      open: false,

      // 表格合并
      spanData: [],
      pos: 0,
    };
  },
  methods: {
    setOptions() {
      this.queryOptions.column = [
        {
          label: "关键词",
          prop: "searchValue",
          span: 4,
        },
        {
          label: "所在城市",
          prop: "city",
          type: "select",
          dicData: cityArea,
          span: 4,
        },
        {
          label: "证书类别",
          prop: "certType",
          type: "select",
          dicData: [
            { label: "工程设计", value: "工程设计" },
            { label: "工程勘察", value: "工程勘察" },
            { label: "建筑业", value: "建筑业" },
          ],
          span: 4,
        },
        {
          label: "安证有效期",
          prop: "expireDate",
          type: "datetimerange",
          format: "yyyy-MM-dd HH:mm:ss",
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          span: 6,
        },
        {
          label: "资质有效期",
          prop: "aptExpireDate",
          type: "datetimerange",
          format: "yyyy-MM-dd HH:mm:ss",
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          span: 6,
        },
        {
          label: "安证发证机关",
          prop: "issueOrg",
          type: "select",
          dicData: [],
          props: {
            label: "name",
            value: "name",
          },
          span: 5,
          allowCreate: true,
          filterable: true,
        },
        {
          label: "资质发证机关",
          prop: "aptIssueOrg",
          type: "select",
          dicData: [],
          props: {
            label: "name",
            value: "name",
          },
          span: 5,
          allowCreate: true,
          filterable: true,
        },
        {
          label: "安证到期预警",
          prop: "warningStatus",
          type: "select",
          dicData: this.commonData.threeKuEnum,
          span: 4,
        },
        {
          label: "资质到期预警",
          prop: "aptWarningStatus",
          type: "select",
          dicData: this.commonData.threeKuEnum,
          span: 4,
        },
        {
          label: "对比crm未跟进",
          prop: "enableFollowContrast",
          type: "switch",
          span: 4,
        },
      ];
      this.options.column = [
        {
          label: "企业名称",
          prop: "companyName",
          width: 200,
          fixed: true,
        },
        {
          label: "所在城市",
          prop: "city",
          width: 120,
        },
        {
          label: "证书编码",
          prop: "certNum",
          width: 220,
        },
        {
          label: "安证发证机关",
          prop: "issueOrg",
          width: 180,
        },
        {
          label: "安证有效期",
          prop: "expireDate",
          width: 120,
          sortable: "custom",
        },
        {
          label: "安证到期预警",
          prop: "warningStatus",
          html: true,
          width: 110,
          formatter: (val) => {
            let row = this.commonData.threeKuEnum.find(
              (item) => item.value == val.warningStatus
            );

            return (
              (row &&
                `<span class="tag" style="background-color:${row.color}; border: 1px solid ${row.color};">${row.label}</span>`) ||
              ""
            );
          },
        },
        {
          label: "证书类别",
          prop: "certType",
          align: "center",
          width: 100,
        },
        {
          label: "资质(备案)等级",
          prop: "quaLevel",
          width: 300,
          align: "center",
          overHidden: true,
        },
        {
          label: "资质发证机关",
          prop: "aptIssueOrg",
          width: 180,
        },
        {
          label: "资质有效期",
          prop: "aptExpireDate",
          width: 150,
          sortable: "custom",
        },
        {
          label: "资质到期预警",
          prop: "aptWarningStatus",
          html: true,
          width: 110,
          formatter: (val) => {
            let row = this.commonData.threeKuEnum.find(
              (item) => item.value == val.aptWarningStatus
            );
            return (
              (row &&
                `<span class="tag" style="background-color:${row.color}; border: 1px solid ${row.color};">${row.label}</span>`) ||
              ""
            );
          },
        },
      ];
    },
    // 查询
    handleSubmit(form, done) {
      this.pager.currentPage = 1;
      this.getList();
      this.getStatistics();
      done();
    },
    // 重置
    handleReset() {
      this.getList();
      this.getStatistics();
    },
    // 排序
    sortChange(row) {
      this.queryForm.orderBy = row.prop;
      this.queryForm.orderType = row.order === "descending" ? "desc" : "asc";
      this.getList();
    },

    // 跳转到详情页
    goDetail(row, index) {
      this.$router.push({
        name: "ThreeKuDetail",
        query: { id: row.id },
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      // this.upload.title = "企业安证资质信息导入";

      // this.upload.open = true;
      this.open = true;
    },

    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.getList();
    },

    /** 导出按钮操作 */
    handleExport() {
      const sendParams = this.getDealParams();
      this.download(
        "/synergy/companyMonitor/export",
        {
          ...sendParams,
        },
        `企业安证资质监测管理_${new Date().getTime()}.xlsx`
      );
    },

    // 根据订单id判断需要合并的行
    getSpanId() {
      this.spanData = [];
      this.pos = 0;
      for (let index = 0; index < this.tableData.length; index++) {
        if (index === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (
            this.tableData[index].markId === this.tableData[index - 1].markId
          ) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = index;
          }
        }
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      let obj = [
        "企业名称",
        "所在城市",
        "证书编码",
        "安证发证机关",
        "安证有效期",
        "安证到期预警",
        "操作",
      ];
      if (obj.includes(column.label)) {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
    // 获取处理的参数，处理参数的时间
    getDealParams() {
      const { aptExpireDate, expireDate } = this.queryForm;

      let sendParams = {
        ...this.queryForm,
        aptExpireDateStart: (aptExpireDate && aptExpireDate[0]) || null,
        aptExpireDateEnd: (aptExpireDate && aptExpireDate[1]) || null,
        expireDateStart: (expireDate && expireDate[0]) || null,
        expireDateEnd: (expireDate && expireDate[1]) || null,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      };
      delete sendParams.aptExpireDate;
      delete sendParams.expireDate;

      return sendParams;
    },

    // 获取表格数据
    async getList() {
      const sendParams = this.getDealParams();

      this.loading = true;
      try {
        const res = await companyMonitorList(sendParams);
        if (res.code === 200) {
          let arr = [];
          res.rows.forEach((item) => {
            if (item.list && item.list.length) {
              // 将相同的字段加入到子数组里
              item.list = item.list.map((ele, index) => {
                // 这里因id相同，数据生成会提示id重复报错，除第一个其他改变其id
                let id = index == 0 ? item.id : item.id + ele.aptCertNum;
                return {
                  ...item,
                  ...ele,
                  id,
                  // 用于合并标记
                  markId: item.id,
                };
              });
            } else {
              // 没有list,表示没有资质数据，表格使用公用数据
              arr.push({ ...item, markId: item.id });
            }
            // 将子数组解构到表格数据，在通过合并操作
            if (item.list && item.list.length) {
              arr.push(...item.list);
            }
          });
          this.tableData = arr;
          this.getSpanId();

          this.pager.total = res.total;

          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    // 获取表格统计数据
    async getStatistics() {
      const sendParams = this.getDealParams();
      this.statisticsLoading = true;
      try {
        const res = await companyMonitorTotal(sendParams);
        if (res.code === 200) {
          this.statisticData = res.data;
          console.log(this.statisticData);
        }
        this.statisticsLoading = false;
      } catch (error) {
        this.statisticsLoading = false;
      }
    },
    // 获取发证机关
    async getAreaClass() {
      const res = await areaClass();
      if (res.code === 200) {
        let areaList = res.data;
        this.queryOptions.column.forEach((item) => {
          if (["issueOrg", "aptIssueOrg"].includes(item.prop)) {
            item.dicData = areaList;
          }
        });
      }
    },
  },
  mounted() {
    this.setOptions();
    this.getAreaClass();
    this.getStatistics();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
::v-deep .avue-crud__left {
  flex: 1;
}
::v-deep .cell span.tag {
  display: inline-block;
  height: 28px;
  padding: 0 10px;
  line-height: 26px;
  color: #fff;
  background-color: transparent;
  border: 1px solid #606266;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>
