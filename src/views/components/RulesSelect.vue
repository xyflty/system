<template>
  <div style="display: flex; flex-direction: column">
    <div class="job-rules">
      <span>{{ item.triggerOrderProjectName }}</span>
      <span>{{ item.relateOrderProjectName }}</span>
    </div>

    <div class="rules-select">
      <template v-for="(domain, domainIndex) in item.ruleSubList">
        <div class="rules-select__list" :key="domain.key">
          <div class="rules-select__item">
            <span> 当触发项目流程节点</span>
            <el-select
              v-model="domain.triggerProjectNode"
              @focus="
                (e) => focusProjectNode('triggerProjectNode', domainIndex)
              "
              @change="
                (val) => selectProjectNode('triggerProjectNode', domainIndex)
              "
            >
              <el-option
                v-for="option in triggerProjectNodeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              ></el-option> </el-select
            ><span>完成时，关联项目流程节点进行</span>
            <el-select
              v-model="domain.relateProjectNode"
              @focus="(e) => focusProjectNode('relateProjectNode', domainIndex)"
              @change="
                (val) => selectProjectNode('relateProjectNode', domainIndex)
              "
            >
              <el-option
                v-for="option in relateProjectNodeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              ></el-option>
            </el-select>
            <div class="rules-select__del">
              <el-button type="danger" @click="delRules(domain)"
                >删除</el-button
              >
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
export default {
  name: "RulesSelect",
  props: {
    item: {
      type: Object,
    },

    relateProject: {
      type: Array,
    },
    triggerProject: {
      type: Array,
    },
  },
  data() {
    return {
      relateProjectNodeOptions: [],
      triggerProjectNodeOptions: [],
    };
  },
  methods: {
    // 处理规则节点禁止选中
    setDisabledProjectNode(prop, index) {
      if (index === 0) {
        this[`${prop}Options`].map((item) => {
          item.disabled = false;
        });
        return;
      }
      let i = index - 1;
      let value = this.item.ruleSubList[i][prop];
      let newIndex = this[`${prop}Options`].findIndex(
        (item) => item.value == value
      );
      this[`${prop}Options`].map((item, idx) => {
        if (newIndex >= idx) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },
    // 下拉框获取焦点
    focusProjectNode(prop, index) {
      this.setDisabledProjectNode(prop, index);
    },
    // 下拉框选中触发
    selectProjectNode(prop, index) {
      let length = this.item.ruleSubList.length;
      for (let i = 0; i < length; i++) {
        if (index < i) {
          this.item.ruleSubList[i][prop] = "";
        }
      }
      this.setDisabledProjectNode(prop, index);
    },
    // 删除规则
    delRules(row) {
      this.$emit("delRules", row);
    },
  },
  mounted() {
    this.relateProjectNodeOptions = cloneDeep(
      this.item.relateOrderProjectOptions
    );
    this.triggerProjectNodeOptions = cloneDeep(
      this.item.triggerOrderProjectOptions
    );
  },

  watch: {
    relateProject: {
      handler(newVal) {
        this.relateProjectNodeOptions = cloneDeep(newVal);
      },
      deep: true,
    },
    triggerProject: {
      handler(newVal) {
        this.triggerProjectNodeOptions = cloneDeep(newVal);
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.job-rules {
  display: flex;
  margin-bottom: 15px;
  > span {
    flex: 0 0 490px;
    text-align: center;
  }
}
.rules-select {
  .rules-select__item {
    display: flex;
    margin-bottom: 15px;
    > span {
      display: inline-block;
      letter-spacing: 2px;
      margin: 0 8px;
    }
    .rules-select__del {
      margin-left: 20px;
    }
  }
}
</style>