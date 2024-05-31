<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "RuoYiGit",
  data() {
    return {
      url: "https://gitee.com/JavaLionLi/易为CRM管理",
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    },
  },
};
</script>
