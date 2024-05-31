<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-select
            v-model="parmas.userId"
            placeholder="请选择用户名称"
            clearable
            filterable
            size="small"
            style="margin-bottom: 20px"
          >
            <el-option
              v-for="option in commonData.userList"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <MultiTable
          ref="tableRef"
          :parmas="parmas"
          :api="apiFn"
          :Options="tableOptions"
          :searchOptions="searchOptions"
          isSearchForm
          isSelection
          isPagination
          border
          row-key="id"
          :reserveSelection="true"
          align="center"
          :getSpanData="getSpanData"
          @SelectionChange="selectionChange"
        >
          <template #actions>
            <el-button type="prrimary" @click="save">保存</el-button>
          </template>
        </MultiTable>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 表格组件
import MultiTable from "@/components/MultiTable";
import { treeselect } from "@/api/core/project/category";
import {
  synergyOrderJobManagerProjectList,
  synergyOrderJobManagerProjectSave,
} from "@/api/xt/dockingProgram";
import { mapState } from "vuex";

export default {
  components: {
    MultiTable,
  },
  data() {
    return {
      apiFn: null,
      parmas: {
        userId: "",
        categoryId: "",
      },

      userList: [],

      tableOptions: [
        {
          label: "项目名称",
          prop: "projectName",
        },
        {
          label: "项目类型",
          prop: "projectType",
        },
      ],
      searchOptions: [
        {
          type: "input",
          label: "项目名称",
          prop: "projectName",
          attrs: {
            placeholder: "请输入项目名称",
          },
        },
      ],
      deptOptions: [],
      selectDataId: [],

      selectId: [], //存储接口返回的选中的数据id
    };
  },
  methods: {
    handleNodeClick(obj) {
      this.parmas.categoryId = obj.id;
    },
    filterNode() {},

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },

    // 处理表格数据和生成span的数据
    getSpanData(arr) {
      //  this.selectData.concat(
      //     arr.filter((item) => item.bindFlag)
      //   );
      this.selectId = this.selectId.concat(
        arr.filter((item) => item.bindFlag).map((item) => item.id)
      );

      console.log(this.selectId, "咋搞啊");

      this.$nextTick(() => {
        arr.forEach((item) => {
          if (item.bindFlag) {
            this.$refs.tableRef.toggleRowSelection(item, true);
          }
        });
      });

      return arr;
    },
    selectionChange(list) {
      this.selectDataId = list.map((item) => item.id);
    },
    // 过滤掉重复数据
    filterRepetition(arr) {
      return [...new Set([...arr])];
    },
    // 获取移除的项目id
    getRemoveProjectId(arr) {
      let selectId = this.filterRepetition(this.selectId);

      return selectId.filter((item) => !arr.includes(item));
    },
    async save() {
      let projectId = this.filterRepetition(this.selectDataId);
      let removeId = this.getRemoveProjectId(projectId);

      console.log(removeId, "this.removeId");

      let sendData = {
        userId: this.parmas.userId,
        projectIdList: projectId,
        removeProjectIdList: removeId,
      };
      console.log({ sendData });

      const res = await synergyOrderJobManagerProjectSave(sendData);
      console.log(res);
      if (res.code === 200) {
        this.$refs.tableRef.getTableData();
        this.$message.success("保存成功");
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  mounted() {
    this.getTreeselect();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    parmas: {
      handler(newVal) {
        if (this.parmas.userId && this.parmas.categoryId) {
          this.selectId = [];
          this.selectDataId = [];
          this.apiFn = synergyOrderJobManagerProjectList;
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
</style>