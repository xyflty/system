<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" v-bind="$attrs">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="工单作业阶段：" prop="nodeName">
        <el-input v-model="ruleForm.nodeName" disabled></el-input>
      </el-form-item>
      <el-form-item label="收款阶段：" prop="moneyTag">
        <el-input v-model="ruleForm.moneyTag" disabled></el-input>
      </el-form-item>
      <el-form-item label="收款金额：" prop="planPrice">
        <el-input v-model="ruleForm.planPrice" disabled></el-input>
      </el-form-item>
      <el-form-item label="收款主体：" prop="subjectName">
        <el-select
          filterable
          v-model="ruleForm.subjectName"
          placeholder="请选择收款主体"
          style="width: 100%"
        >
          <el-option
            v-for="item in commonData.subjectDept"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款方式：" prop="payment">
        <el-select
          style="width: 100%"
          v-model="ruleForm.payment"
          placeholder="请选择"
        >
          <el-option value="公户收款" label="公户收款"></el-option>
          <el-option value="扫码收款" label="扫码收款"></el-option>
          <el-option value="私户收款" label="私户收款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款提起人：" prop="launchPerson">
        <el-select
          style="width: 100%"
          v-model="ruleForm.launchPerson"
          placeholder="请选择收款提起人"
          filterable
        >
          <el-option
            v-for="item in commonData.userList"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款经手人：" prop="handlePerson">
        <el-select
          style="width: 100%"
          v-model="ruleForm.handlePerson"
          placeholder="请选择收款经手人"
          filterable
        >
          <el-option
            v-for="item in commonData.userList"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="tip">
        <span>注：当前收款节点未收款的金额会自动累加到下一收款节点</span>
      </div>
      <el-form-item label="编辑收款信息" prop="tableData">
        <div v-if="ruleForm.moneyNodeList">
          <MultiTable
            border
            align="center"
            :Options="tableOption"
            :data="ruleForm.moneyNodeList"
          >
            <template #actualPrice="{ scope }">
              <el-input
                v-if="scope.rowEdit"
                v-model="scope['actualPrice']"
                @change="(val) => handleChange(val, scope)"
              ></el-input>
              <span v-else>{{ scope["actualPrice"] }}</span>
            </template>
            <template #uncollected="{ scope }">
              <span>{{
                (scope.planPrice - scope.actualPrice).toFixed(2)
              }}</span>
            </template>
          </MultiTable>
          <div class="tableFooter">
            <p>
              总计划期次:<span>{{ ruleForm.moneyNodeList.length }}</span
              >期
            </p>
            <p>
              应收款金额:<span>{{ totalObj.receivableTotal }}</span>
            </p>
            <p>
              已收款金额: <span>{{ totalObj.receivedTotal }}</span>
            </p>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fileUpload } from "@/api/upload/upload";
import MultiTable from "@/components/MultiTable";
import { mapState } from "vuex";
import commonData from "../../../../store/modules/commonData";
export default {
  name: "FinancialCollection",
  components: {
    MultiTable,
  },
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      ruleForm: this.form,
      rules: {
        subjectName: [
          { required: true, message: "请输入收款主体", trigger: "blur" },
        ],
        payment: [
          { required: true, message: "请选择收款方式", trigger: "change" },
        ],
        launchPerson: [
          { required: true, message: "请输入收款提起人", trigger: "blur" },
        ],
        handlePerson: [
          { required: true, message: "请输入收款经手人", trigger: "blur" },
        ],
      },
      tableOption: [
        {
          editType: "string",
          label: "期次",
          prop: "moneyTag",
          width: "100px",
        },
        {
          editType: "date-picker",
          label: "收款日期",
          prop: "receiveDate",
          attrs: {
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
        },
        {
          editType: "string",
          label: "收款阶段应收(元)",
          prop: "planPrice",
          width: "150px",
        },
        {
          label: "收款阶段已收(元)",
          slotName: "actualPrice",
          width: "150px",
        },
        {
          label: "收款阶段未收(元)",
          slotName: "uncollected",
          width: "150px",
        },
      ],
    };
  },
  methods: {
    // 值方式改变
    handleChange(val, scope) {
      let uncollected = scope.receivable - val;
      if (uncollected < 0) {
        scope.received = 0;
        uncollected = scope.receivable;
        this.$message.error("值超出了,请重新输入");
      }
      scope.uncollected = uncollected;
    },
    // 取消
    handleCancel() {
      this.$emit("cancel", { form: this.$refs.ruleForm, model: this.ruleForm });
    },
    // 提交
    handleConfirm() {
      this.$emit("confirm", {
        form: this.$refs.ruleForm,
        model: this.ruleForm,
      });
    },
  },
  mounted() {},
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
    form(newVal) {
      this.ruleForm = newVal;
    },
  },
  computed: {
    totalObj() {
      let receivableTotal = this.ruleForm.moneyNodeList.reduce((prev, item) => {
        return (prev += +item.planPrice);
      }, 0);
      let receivedTotal = this.ruleForm.moneyNodeList.reduce((prev, item) => {
        return (prev += +item.actualPrice);
      }, 0);
      return { receivableTotal, receivedTotal };
    },
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
.upload-img {
  width: 120px;
  height: 120px;
  background-color: rgba(249, 249, 249, 1);
  border: 1px solid rgba(233, 233, 233, 1);
  border-radius: 3px;
  color: #cccccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  i {
    font-size: 25px;
  }
}
.tableFooter {
  display: flex;
  justify-content: flex-end;
  padding: 20px 10px;
  background: #f8f8f9;
  color: #333;
  font-size: 14px;
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
.tip {
  color: #f56c6c;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 14px;
  padding: 0 0 22px 120px;
  &::before {
    content: "*";
    color: #f56c6c;
    padding-right: 5px;
  }
}
</style>
