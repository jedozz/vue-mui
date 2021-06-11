//2021.05.20
<template>
  <div class="mui-slider-item mui-control-content">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    alreadyShowed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>