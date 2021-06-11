//2021.04.18
<template>
  <div
    class="yj-actionsheet mui-popover mui-popover-action mui-popover-bottom"
    @shown="onShown"
    @hidden="onHidden"
  >
    <ul
      class="mui-table-view"
      v-for="(group, groupIndex) in data"
      :key="groupIndex"
    >
      <li
        class="mui-table-view-cell"
        v-for="(sheet, index) in group"
        :key="index"
      >
        <a
          :class="{ disabled: sheet.disabled === true }"
          @tap="onSheetTap(sheet)"
          >{{ sheet.name }}</a
        >
      </li>
    </ul>
  </div>
</template>
<style>
.yj-actionsheet li a.disabled {
  color: #868686;
}
</style>
<script>
import mui from "@assets/js/mui.loader.js";

export default {
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    show(newValue) {
      if (newValue === true) {
        mui(this.$el).popover("show");
      } else if (newValue === false) {
        mui(this.$el).popover("hide");
      }
    },
  },
  methods: {
    onShown() {
      this.$emit("shown");
    },
    onHidden() {
      this.$emit("hidden");
    },
    onSheetTap(sheet) {
      if (typeof sheet.onTap == "function" && sheet.disabled != false) {
        sheet.onTap();
      }
    },
  },
};
</script>