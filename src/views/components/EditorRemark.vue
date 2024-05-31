// 富文本备注信息
<template>
  <div>
    <h3 class="card-header">{{ title }}</h3>
    <div class="wangeditor-box" style="border: 1px solid #ccc">
      <Toolbar
        class="wangeditor-toolbar"
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="editorMode"
      />
      <Editor
        :style="`height: ${height}; overflow-y: hidden`"
        v-model="newRemark"
        :defaultConfig="editorConfig"
        :mode="editorMode"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
export default {
  props: {
    height: {
      type: String,
      default: "300px",
    },
    title: String,
    editorMode: {
      type: String,
      default: "simple",
    },
    toolbarConfig: {
      type: Object,
      default: () => {},
    },
    editorConfig: {
      type: Object,
      default: () => {
        return {
          readOnly: true,
        };
      },
    },
    remark: String,
  },
  components: {
    Editor,
    Toolbar,
  },
  data() {
    return {
      editor: null,
      newRemark: this.remark,
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
  },
  mounted() {},
  watch: {
    newRemark(newVal) {
      this.$emit("update:remark", newVal);
    },
    remark(newVal) {
      this.newRemark = newVal ?? "";
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>

<style lang='scss' scoped>
</style>