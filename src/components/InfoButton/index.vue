<template>
  <el-tooltip class="item" effect="dark" :content="title" placement="top">
    <el-button
      size="mini"
      style="margin-top: 20px"
      v-on="$listeners"
      v-bind="$attrs"
    ></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: "InfoButton",
  props: ["title"],
};
</script>

<style>
</style>