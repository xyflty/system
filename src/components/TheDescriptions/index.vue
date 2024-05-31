<template>
  <el-descriptions class="descriptions" :column="column" v-bind="$attrs">
    <template v-for="(item, index) in comparison">
      <el-descriptions-item
        :key="index"
        v-bind="item"
        label-class-name="my-label"
        content-class-name="my-content"
        :labelStyle="{ width: labelWidth, ...item.labelStyle }"
      >
        <template slot="label">
          <div v-if="openLabel">
            <slot name="label" :row="item"></slot>
          </div>
          <div v-else>
            <span :class="item.requred && 'requried-label'">{{
              item.label
            }}</span>
          </div>
        </template>
        <div v-if="item.type">
          <el-select
            v-if="item.type === 'select'"
            style="width: 100%"
            v-model="data[item.prop]"
            v-bind="item.attrs"
            :ref="`${item.prop}Ref`"
            @change="(val) => handleChange(val, item)"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              v-bind="option"
            ></el-option>
          </el-select>

          <el-input
            v-if="item.type === 'input'"
            v-model="data[item.prop]"
            v-bind="item.attrs"
            @change="(val) => changeInput(val, item)"
          ></el-input>
          <el-input-number
            v-if="item.type === 'input-number'"
            v-model="data[item.prop]"
            v-bind="item.attrs"
            @change="(val) => changeInput(val, item)"
          ></el-input-number>
          <el-date-picker
            v-if="item.type === 'date-picker'"
            style="width: 100%"
            v-model="data[item.prop]"
            v-bind="item.attrs"
            @change="(val) => changeInput(val, item)"
          ></el-date-picker>
          <el-cascader
            :ref="`${item.prop}Ref`"
            v-if="item.type === 'cascader'"
            style="width: 100%"
            v-model="data[item.prop]"
            :options="item.options"
            v-bind="item.attrs"
            @change="(val) => changeInput(val, item)"
          ></el-cascader>
          <el-radio-group
            v-if="item.type === 'radio'"
            v-model="data[item.prop]"
            v-bind="item.attrs"
          >
            <el-radio
              v-for="option in item.options"
              :key="option.value"
              v-bind="option"
            ></el-radio>
          </el-radio-group>
          <treeselect
            v-if="item.type === 'treeselect'"
            v-model="data[item.prop]"
            :options="item.options"
            v-bind="item.attrs"
            :ref="`${item.prop}Ref`"
            @select="(val) => handleChange(val, item)"
          />
          <div class="err-msg" v-if="item.isShowErrMsg">{{ item.errmsg }}</div>
        </div>
        <div v-else>
          <div v-if="item.slotName">
            <slot :name="item.slotName" :row="item"></slot>
          </div>
          <span v-else>{{
            item.formatter ? item.formatter(data[item.prop]) : data[item.prop]
          }}</span>
        </div>
      </el-descriptions-item>
    </template>
    <el-descriptions-item
      v-if="comparison.length % column !== 0"
    ></el-descriptions-item>
  </el-descriptions>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "TheDescriptions",
  components: { Treeselect },
  props: {
    comparison: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
    },
    openLabel: Boolean,
    labelWidth: {
      type: String,
      default: "150px",
    },
    column: {
      type: Number,
      default: 2,
    },
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {
    handleChange(val, item) {
      this.$nextTick(() => {
        let label =
          item.type === "treeselect"
            ? val.label
            : this.$refs[`${item.prop}Ref`][0].selectedLabel;
        let objVal = {
          label: label,
          value: item.type === "treeselect" ? val.id : val,
        };
        this.$emit("change", { obj: objVal, row: item });
      });
    },
    changeInput(val, item) {
      this.$emit("changeInput", { val, row: item });
    },
  },
  computed: {},
  watch: {
    data: {
      handler(newVal) {
        this.$emit("update:data", newVal);
      },
      deep: true,
    },
    comparison(newVal) {
      console.log(this.comparison, "comparison");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.descriptions {
  margin-top: 20px;
  .my-label {
    font-weight: 600;
    color: #333;
    text-align: right;
  }
  .my-content {
    color: #666;
  }
  .is-bordered {
    table-layout: fixed;
  }
  .requried-label {
    &::before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .err-msg {
    color: #f56c6c;
    font-size: 12px;
    padding-top: 4px;
  }
}
</style>