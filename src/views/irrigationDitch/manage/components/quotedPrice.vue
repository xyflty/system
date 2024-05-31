<template>
  <el-dialog
    :visible="show"
    width="70%"
    append-to-body
    :close-on-click-modal="false"
    @close="close"
  >
    <!-- 报价列表数据 -->
    <avue-crud
      :data="priceData"
      v-loading="loading"
      :option="option"
      :page.sync="pager"
      @size-change="getList"
      @current-change="getList"
    >
      <template slot="menuLeft">
        <el-row :gutter="10" class="mb8">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            v-hasPermi="['channel:channelAuditReferPrice:add']"
            @click="handleAdd"
            >新增</el-button
          >
        </el-row>
      </template>
      <template slot="auditResult" slot-scope="scope">
        <el-button size="mini" type="text" @click="goPage(scope.row)">{{
          scope.row.auditResult
        }}</el-button>
      </template>
    </avue-crud>

    <!-- 新增报价 (渠道部) -->
    <addPrice
      :showAddForm.sync="showAddForm"
      :companyName="queryParams.companyName"
      :quotedArea="quotedArea"
      :customerType="customerType"
      type="1"
      @getList="getList"
    />
  </el-dialog>
</template>

<script>
import { channelChannelAuditReferPrice } from "@/api/irrigationDitch/opportunity";

import addPrice from "@/views/core/demand/components/addPrice.vue";
export default {
  name: "QuotedPrice",
  components: { addPrice },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    quotedPriceForm: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      queryParams: {
        companyName: "",
      },

      priceData: [],
      loading: false,
      pager: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },

      option: {
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,

        stripe: true,

        menu: false,
        headerAlign: "center",
        align: "center",
        column: [
          { label: "现合作项目", prop: "nowProject" },
          { label: "报价时间", prop: "createTime" },
          { label: "低于限价原因", prop: "reason" },
          { label: "地区", prop: "area" },
          { label: "报价内容及价格", prop: "priceContent" },
          { label: "报价人员", prop: "applyUserName" },
          {
            label: "报价审核",
            prop: "auditResult",
            slot: true,
          },
        ],
      },

      //   报价弹窗
      showAddForm: false,
      priceForm: { projectCategory: 3 },
      quotedArea: [],

      // 客户类型
      customerType: "",
    };
  },
  methods: {
    // 新增操作
    handleAdd() {
      console.log(this.priceForm);
      this.showAddForm = true;
    },

    // 获取列表数据
    async getList() {
      this.loading = true;
      let sendParams = {
        ...this.queryParams,
        pageNum: this.pager.currentPage,
        pageSize: this.pager.pageSize,
      };
      try {
        const res = await channelChannelAuditReferPrice(sendParams);

        if (res.code === 200) {
          this.priceData = res.rows;
          this.pager.total = res.total;
        } else {
          console.log(res.msg);
        }

        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    // 关闭弹窗
    close() {
      this.$emit("update:show", false);
    },

    // // 新增报价提交
    // async handleSumbit({ model, form }) {
    //   console.log({ model });
    //   let imgUrl = "";
    //   if (model.content && model.content.length) {
    //     imgUrl = model.content.map((item) => item.url).join(",");
    //   }
    //   let sendData = {
    //     ...model,
    //     area: model.area.join("-"),
    //     remindUserIds: model.remindUserIds && model.remindUserIds.join(","),

    //     imgUrl: imgUrl,
    //   };

    //   try {
    //     const res = await channelChannelAuditReferPriceAdd(sendData);
    //     console.log(res);
    //     if (res.code === 200) {
    //       this.getList();
    //       this.showAddForm = false;
    //       form.resetFields();
    //       this.$message.success("新增报价成功");
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   } catch (error) {}
    // },

    goPage(row) {
      this.$emit("update:show", false);
      this.$router.push({
        name: "ChannelPriceDetail",
        query: { id: row.id, type: 0, pageType: "1" },
      });
    },
  },
  mounted() {},
  watch: {
    quotedPriceForm: {
      handler(newForm) {
        console.log(newForm);
        const { province, city, area } = newForm;
        this.queryParams.companyName = newForm.companyName;
        this.customerType = n.customerType;

        this.quotedArea = [province, city, area];
      },
      deep: true,
      immediate: true,
    },

    show(flag) {
      flag && this.getList();
    },
  },
};
</script>

<style lang='scss' scoped>
</style>