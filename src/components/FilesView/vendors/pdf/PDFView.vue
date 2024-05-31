<template>
  <iframe :src="url" frameborder="0" width="1000" height="800"></iframe>
</template>

<script>

export default {
  props: {
    buffer: ArrayBuffer,
  },
  data() {
    return {
      url: "",
    };
  },
  mounted() {
    console.log(this.buffer,555);
    this.url = window.URL.createObjectURL(
      new Blob([this.buffer], { type: "application/pdf;chartset=UTF-8" })
    );
  },
};
</script>

<style scoped>
</style>