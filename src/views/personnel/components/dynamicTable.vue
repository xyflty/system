<template>
  <el-table :data="list" border style="width: 100%" stripe>
    <el-table-column label="条件" align="center" type="index" width="50">
    </el-table-column>
    <el-table-column
      label="线索数据"
      align="center"
      key="validCount"
      prop="validCount"
    >
      <template slot-scope="{ row }">
        <el-input
          placeholder=""
          v-model="row.validCount"
          :readonly="showType == type"
          size="mini"
        >
          <template slot="append">个</template>
        </el-input>
      </template>
    </el-table-column>

    <el-table-column
      label="订单数据"
      align="center"
      key="orderCount"
      prop="orderCount"
    >
      <template slot-scope="{ row }">
        <el-input
          placeholder=""
          v-model="row.orderCount"
          :readonly="showType == type"
          size="mini"
        >
          <template slot="append">单</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="业绩数据"
      align="center"
      key="transactionAmount"
      prop="transactionAmount"
    >
      <template slot-scope="{ row }">
        <el-input
          placeholder=""
          v-model="row.transactionAmount"
          :readonly="showType == type"
          size="mini"
        >
          <template slot="append">元</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="咨询订单"
      align="center"
      key="consultOrderCount"
      prop="consultOrderCount"
    >
      <template slot-scope="{ row }">
        <el-input
          placeholder=""
          v-model="row.consultOrderCount"
          :readonly="showType == type"
          size="mini"
        >
          <template slot="append">单</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="商机数据"
      align="center"
      key="opportunityCount"
      prop="opportunityCount"
    >
      <template slot-scope="{ row }">
        <el-input
          placeholder=""
          v-model="row.opportunityCount"
          :readonly="showType == type"
          size="mini"
        >
          <template slot="append">个</template>
        </el-input>
      </template>
    </el-table-column>
    <!-- <el-table-column
      :label="`有效数据新增法人数${typeStr}`"
      align="center"
      key="data5"
      prop="data5"
    >
      <template slot-scope="{ row }">
        <el-input placeholder="" v-model="row.input2" size="mini">
          <template slot="append">个</template>
        </el-input>
      </template>
    </el-table-column> -->
    <!-- <el-table-column
      :label="`网推数据转化${typeStr}`"
      align="center"
      key="conversionRate"
      prop="conversionRate"
    >
      <template slot-scope="{ row }">
        <el-input
          placeholder=""
          v-model="row.conversionRate"
          :readonly="showType == type"
          size="mini"
        >
          <template slot="append">%</template>
        </el-input>
      </template>
    </el-table-column> -->

    <el-table-column
      label="操作"
      align="center"
      class-name="small-padding fixed-width"
      v-if="showType == 0"
    >
      <template slot-scope="{ row }">
        <el-button
          icon="el-icon-delete"
          size="mini"
          type="text"
          @click="handleDelete(row)"
          >删除</el-button
        >
        <el-button
          v-if="row.index == list.length"
          icon="el-icon-plus"
          size="mini"
          type="text"
          @click="handleAdd(row)"
          >新增条件</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {
  listPromoteRule,
  getPromoteRule,
  delPromoteRule,
} from "@/api/personnel/rule";

export default {
  name: "DynamicTable",
  props: {
    formRule: {
      type: Object,
      default: () => {},
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    formRule: {
      handler(n) {
        console.log(n.id);
        if (n.id) {
          this.id = n.id;
          this.getList(n.id);
        } else {
          this.list = [
            {
              index: 1,
              type: this.type,
            },
          ];
        }

        // 详情
        this.showType = n.showType || 0;
      },
      deep: true,
      immediate: true,
    },

    list: {
      handler(n) {
        this.$emit("change", this.list);
      },
      deep: true,
    },
  },
  computed: {
    typeStr() {
      return this.type == 1 ? "大于" : "大于";
    },
  },
  data() {
    return {
      id: "",
      list: [],
      showType: 0,
    };
  },
  methods: {
    /** 查询项目列表 */
    getList() {
      listPromoteRule({ levelId: this.id }).then((response) => {
        let data = response.rows;
        data = data.filter((item) => item.type == this.type);
        data.forEach((item, index) => {
          item.index = index + 1;
        });
        this.list = data.length
          ? data
          : [
              {
                index: 1,
                type: this.type,
              },
            ];
      });
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.list.push({
        index: this.list.length + 1,
        type: this.type,
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      if (ids == undefined) {
        this.list.splice(row.index - 1, 1);
        this.list.forEach((item, index) => (item.index = index + 1));
        return;
      }
      this.$modal
        .confirm('是否确认删除层级规则编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPromoteRule(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
