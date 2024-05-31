<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "RuoYiDoc",
  data() {
    return {
      url: "https://gitee.com/JavaLionLi/易为CRM管理/wikis/pages",
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    },
  },
};
</script>
