//2021.5.20
<template>
  <div class="yj-slider mui-slider" ref="yjSlider">
    <div
      class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted"
    >
      <a
        v-for="(tab, index) in tabs"
        :key="index"
        class="mui-control-item"
        :class="[currentTab == tab ? 'mui-active' : '']"
        @tap="sliderGo(index)"
        >{{ tabKey == "" ? tab : tab[tabKey] }}</a
      >
    </div>
    <div
      v-if="tabs.length > 0"
      class="mui-slider-progress-bar"
      :style="{ width: 100 / tabs.length + '%' }"
    ></div>
    <div class="mui-slider-group">
      <slot></slot>
    </div>
  </div>
</template>
<style>
.mui-slider-indicator.mui-segmented-control {
  background: #fff;
}

.mui-segmented-control.mui-segmented-control-inverted
  ~ .mui-slider-progress-bar {
  background: #01b7ff;
}

.mui-segmented-control.mui-segmented-control-inverted .mui-control-item {
  color: #868686;
}

.mui-segmented-control.mui-segmented-control-inverted
  .mui-control-item.mui-active {
  color: #000;
}
</style>
<script>
import mui from "@assets/js/mui.loader.js";
export default {
  data() {
    return {
      innerCurrentTab: null,
    };
  },
  mounted() {
    if (this.currentTab != null) {
      throw new Error("currentTab默认值必须为null");
    }
    this.innerCurrentTab = this.currentTab;
    this.$nextTick(() => {
      this.muiObj.slider();
      this.muiObj[0].addEventListener("slide", (event) => {
        var index = event.detail.slideNumber;
        this.onSlide(index);
      });
    });
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
      validator(value) {
        return value.length > 0;
      },
    },
    currentTab: {
      type: [Object, String],
    },
    tabKey: {
      type: String,
      default: "",
    },
  },
  computed: {
    index() {
      let index = this.tabs.indexOf(this.currentTab);
      index = index >= 0 ? index : 0;
      return index;
    },
    tabSliderItems() {
      return this.$children.findAll(
        (m) => m.$vnode.componentOptions.tag == "tab-slider-item"
      );
    },
    muiObj() {
      return mui(this.$refs.yjSlider);
    },
  },
  methods: {
    onSlide(index) {
      this.innerCurrentTab = this.tabs[index];
      this.$emit("slide", index);
      this.$emit("update:currentTab", this.innerCurrentTab);
      this.$nextTick(() => {
        this.tabSliderItems[index].$emit("update:alreadyShowed", true);
      });
    },
    sliderGo(index) {
      this.muiObj.slider().gotoItem(index);
    },
  },
  watch: {
    tabs() {
      this.$nextTick(() => {
        this.muiObj.slider();
      });
    },
    currentTab(newValue, oldValue) {
      if (newValue == null) {
        throw new Error("currentTab非默认值不能为null");
      }
      if (this.innerCurrentTab != newValue) {
        if (oldValue == null && this.index == 0) {
          this.tabSliderItems[this.index].$emit("update:alreadyShowed", true);
        } else {
          this.sliderGo(this.index);
        }
      }
    },
  },
  destroyed() {
    this.muiObj.slider().destroy();
  },
};
</script>