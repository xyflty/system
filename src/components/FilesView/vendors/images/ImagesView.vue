<template>
  <el-image :src="image" :preview-src-list="[image]" fit="fill"></el-image>
</template>



<script>
export default {
  props: {
    image: String,
  },
};
</script>

<style scoped>
</style>