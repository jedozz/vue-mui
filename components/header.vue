//2021.04.16
<template>
  <header class="mui-navbar-inner mui-bar mui-bar-nav">
    <button
      type="button"
      class="mui-left mui-action-back mui-btn mui-btn-link mui-btn-nav mui-pull-left"
    >
      <span class="mui-icon mui-icon-left-nav"></span>
    </button>
    <h1 class="mui-center mui-title">{{title}}</h1>
  </header>
</template>
<style>
</style>
<script>
export default {
  props: ["title"]
};
</script>