// 动态核查资源库
<template>
  <div class="app-container">
    <avue-crud
      :option="tableOptions"
      :search.sync="queryParams"
      :data="tableData"
      :page.sync="pager"
      v-loading="loading"
      @on-load="getList"
      @selection-change="selectionChange"
      @search-change="searchChange"
      @search-reset="resetChange"
    >
      <template slot="menuLeft">
        <el-row :gutter="10" class="mb8">
          <template v-if="queryParams.isReceive == 0">
            <el-col :span="1.5">
              <el-button
                size="small"
                plain
                @click="handleReceive"
                v-hasPermi="[
                  'zw:dynamicVerifyLibrary:dynamicVerifyLibraryTake',
                ]"
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
                >去动态核查资源库</el-button
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
            v-hasPermi="['zw:dynamicVerifyLibrary:convertClue']"
            >转入线索</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="
              $router.push({
                name: 'SeaDetail',
                query: { id: row.id, type: 'inspectSea', val: 1 },
              })
            "
            v-hasPermi="['zw:dynamicVerifyLibrary:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh-left"
            @click="handleAction(row, 'putBackSea')"
            v-hasPermi="['zw:dynamicVerifyLibrary:putBack']"
            >放回公海</el-button
          >
        </div>
        <div v-else>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleReceive(row)"
            v-hasPermi="['zw:dynamicVerifyLibrary:dynamicVerifyLibraryTake']"
            >领取</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-d-arrow-right"
            @click="
              $router.push({
                name: 'SeaDetail',
                query: { id: row.id, type: 'inspectSea' },
              })
            "
            v-hasPermi="['zw:dynamicVerifyLibrary:query']"
            >详细</el-button
          >
        </div>
      </template>
    </avue-crud>

    <ThreeKuClue
      :visible.sync="visible"
      :form="clueForm"
      @submit="addClueSbumit"
      @reset="handleReset"
    />
  </div>
</template>

<script>
import {
  dynamicVerifyLibraryList,
  dynamicVerifyLibraryTake,
  dynamicVerifyLibraryConvertClue,
  putBack,
} from "@/api/core/inspectSea";
import ThreeKuClue from "@/views/core/components/threeKuClue.vue";
export default {
  components: {
    ThreeKuClue,
  },
  data() {
    return {
      loading: false,
      tableOptions: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        columnBtn: false,

        // 搜索配置
        searchFilterDic: true,
        searchFilterNull: true,
        searchMenuSpan: 6,

        border: true,
        stripe: true,
        selection: true,
        headerAlign: "center",
        align: "center",
        column: [],
      },
      tableData: [],
      queryParams: {
        isReceive: 0,
      },
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },

      selectData: [],
      visible: false,
      clueForm: {},
      badgeNum: 0,
    };
  },
  methods: {
    setOptions() {
      this.tableOptions.column = [
        {
          label: "关键字",
          prop: "keyword",
          search: true,
          hide: true,
          showColumn: false,
        },
        {
          label: "资源名称",
          prop: "companyName",
        },
        {
          label: "安证编号",
          prop: "safetyNum",
        },
        {
          label: "核查情况",
          prop: "situation",
        },
        {
          label: "备注",
          prop: "remark",
          overHidden: true,
        },
      ];
    },
    async getList() {
      const { currentPage, pageSize } = this.pager;
      let sendParams = {
        ...this.queryParams,
        pageNum: currentPage,
        pageSize,
      };
      this.loading = true;
      try {
        const res = await dynamicVerifyLibraryList(sendParams);
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
    // 提交
    searchChange(params, done) {
      this.getList();
      done();
    },
    // 重置
    resetChange() {
      this.pager.currentPage = 1;
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
          return dynamicVerifyLibraryTake({ ids: ids });
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
    // 返回公海回调
    putSeaFn(row) {
      this.$modal
        .confirm(`是否确认将所选择的资源放回公海？`)
        .then(() => {
          this.loading = true;

          return putBack({ id: row.id });
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

    // 转为线索确认框
    async addClueSbumit(form, done) {
      let sendData = {
        id: form.id,
        contactInfoList: form.contactInfoList,
      };

      try {
        const res = await dynamicVerifyLibraryConvertClue(sendData);

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
    // 转为线索取消
    handleReset() {
      this.visible = false;
      this.clueForm = {};
    },
  },
  mounted() {
    this.setOptions();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .avue-crud__header {
  height: 50px;
  align-items: flex-end;
}
</style>
