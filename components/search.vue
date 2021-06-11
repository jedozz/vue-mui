//2021.06.11
<template>
  <div class="mui-input-row mui-search" ref="componentRoot">
    <input
      type="search"
      v-bind:value="value"
      v-on="inputListeners"
      class="mui-input-clear"
      placeholder
    />
  </div>
</template>
<script>
import mui from "@assets/js/mui.loader.js";

export default {
  props: ["value"],
  mounted() {
    var that = this;
    this.$nextTick(() => {
      mui(this.$refs.componentRoot.querySelector(".mui-input-clear")).input();
      mui(this.$refs.componentRoot).on("tap", ".mui-icon-clear", () => {
        that.$emit("input", "");
        that.$emit("clear");
      });
    });
  },
  computed: {
    inputListeners() {
      var that = this;
      return {
        ...that.$listeners,
        ...{
          input(event) {
            that.$emit("input", event.target.value);
          },
        },
      };
    },
  },
};
</script>