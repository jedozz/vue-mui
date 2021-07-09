//2021.07.09
<template>
  <div class="mui-scroll-wrapper haslogo" @scroll="onScroll">
    <div class="mui-scroll" ref="pulldown">
      <slot></slot>
    </div>
  </div>
</template>
<style>
.mui-scroll-wrapper.haslogo .mui-scroll {
  min-height: 100%;
}

.mui-scroll-wrapper.haslogo:before {
  content: "";
  width: 45px;
  height: 35px;
  background: url(~@assets/images/login-top.png);
  background-size: 105px 35px;
  background-repeat: no-repeat;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.mui-scroll-wrapper.haslogo:after {
  content: "";
  width: 45px;
  height: 35px;
  background: url(~@assets/images/login-top.png);
  background-size: 105px 35px;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
@import "~@assets/css/mui.pullToRefresh.css";
</style>
<script>
import mui from "@assets/js/mui.loader.js";
import "@assets/lib/mui.pullToRefresh.js";
import "@assets/lib/mui.pullToRefresh.material.js";

export default {
  data() {
    return {
      scroll: null,
      pulldown: null,
      timeoutSeed: null,
      innerScrollY: null,
    };
  },
  mounted() {
    var that = this;
    that.$nextTick(() => {
      that.scroll = mui(that.$el).scroll();
      if (that.enablePulldown === true) {
        that.pulldown = mui(that.$refs.pulldown).pullToRefresh({
          down: {
            callback: function () {
              that.$emit("update:pulling", true);
              var pulldown = this;
              that.$emit("pulldown");
              that.timeoutSeed = setTimeout(function () {
                if (pulldown.loading) {
                  pulldown.endPullDownToRefresh();
                }
                that.$emit("update:pulling", false);
              }, that.pulldownTimeout);
            },
          },
        });
        that.$emit("pulldownReady");
      }
    });
  },
  watch: {
    pulling(newValue) {
      if (newValue && !this.pulldown.loading) {
        this.pulldown.pullDownLoading();
      } else if (!newValue && this.pulldown.loading) {
        clearTimeout(this.timeoutSeed);
        this.pulldown.endPullDownToRefresh();
      }
    },
    scrollY() {
      if (this.scrollY != this.innerScrollY) {
        this.scroll.scrollTo(0, this.scrollY, 200);
      }
    },
  },
  beforeDestroy() {
    if (this.pulldown && this.pulldown.loading) {
      clearTimeout(this.timeoutSeed);
      this.pulldown.endPullDownToRefresh();
    }
  },
  deactivated() {
    if (this.pulldown && this.pulldown.loading) {
      clearTimeout(this.timeoutSeed);
      this.pulldown.endPullDownToRefresh();
    }
  },
  methods: {
    onScroll(e) {
      this.innerScrollY = e.detail.y;
      this.$emit("update:scrollY", this.innerScrollY);
    },
  },
  props: {
    enablePulldown: Boolean,
    pulling: {
      type: Boolean,
      default: false,
    },
    pulldownTimeout: {
      type: Number,
      default: 10000,
    },
    scrollY: Number,
  },
};
</script>