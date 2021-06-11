//2021.06.10 10:47
<template>
  <transition name="yjtooltip-animation">
    <div
      v-if="message != null && message != ''"
      class="yjtooltip"
      :class="[placement]"
      :style="{
        left,
        top,
        width,
      }"
    >
      <div class="yjtooltip-arrow" :style="arrowStyle"></div>
      <div class="yjtooltip-bg" :style="{ backgroundColor }"></div>
      <div
        class="yjtooltip-text"
        :style="{ color, whiteSpace: textWrap ? 'normal' : 'nowrap' }"
      >
        {{ message }}
      </div>
    </div>
  </transition>
</template>
<style>
.yjtooltip-animation-enter-active,
.yjtooltip-animation-leave-active {
  transition: opacity 0.3s;
}

.yjtooltip-animation-leave,
.yjtooltip-animation-enter-to {
  opacity: 1;
}

.yjtooltip-animation-enter,
.yjtooltip-animation-leave-to {
  opacity: 0;
}

.yjtooltip {
  position: absolute;
  padding: 1px 10px;
  z-index: 100;
}

.yjtooltip .yjtooltip-text {
  font-size: 12px;
  position: relative;
  overflow: hidden;
}

.yjtooltip .yjtooltip-bg {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 10px;
  box-shadow: 3px 3px 3px #5f5f5f;
  opacity: 0.6;
}

.yjtooltip .yjtooltip-arrow {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  opacity: 0.6;
}

.yjtooltip.bottom .yjtooltip-arrow,
.yjtooltip.top .yjtooltip-arrow {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  transform: translateX(-3px);
  left: 50%;
}

.yjtooltip.bottom .yjtooltip-arrow {
  border-bottom: 5px solid;
  top: -5px;
}

.yjtooltip.top .yjtooltip-arrow {
  border-top: 5px solid;
  bottom: -5px;
}

.yjtooltip.left .yjtooltip-arrow,
.yjtooltip.right .yjtooltip-arrow {
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  transform: translateY(-3px);
  top: 50%;
}

.yjtooltip.left .yjtooltip-arrow {
  border-left: 5px solid;
  right: -5px;
}
.yjtooltip.right .yjtooltip-arrow {
  border-right: 5px solid;
  left: -5px;
}

.yjtooltip.topleft .yjtooltip-arrow,
.yjtooltip.lefttop .yjtooltip-arrow {
  border-bottom: 7px solid;
  border-right: 7px solid transparent;
  right: -4px;
  bottom: 0px;
  transform: rotate(30deg);
}

.yjtooltip.topright .yjtooltip-arrow,
.yjtooltip.righttop .yjtooltip-arrow {
  border-bottom: 7px solid;
  border-left: 7px solid transparent;
  left: -4px;
  bottom: 0px;
  transform: rotate(-30deg);
}

.yjtooltip.bottomleft .yjtooltip-arrow,
.yjtooltip.leftbottom .yjtooltip-arrow {
  border-top: 7px solid;
  border-right: 7px solid transparent;
  right: -5px;
  top: 1px;
  transform: rotate(-20deg);
}

.yjtooltip.bottomright .yjtooltip-arrow,
.yjtooltip.rightbottom .yjtooltip-arrow {
  border-top: 7px solid;
  border-left: 7px solid transparent;
  left: -5px;
  top: 1px;
  transform: rotate(20deg);
}
</style>
<script>
import $ from "@assets/js/jquery.loader.js";

export default {
  data() {
    return {
      left: 0,
      top: 0,
    };
  },
  computed: {
    arrowStyle() {
      switch (this.placement) {
        case "bottom":
          return { borderBottomColor: this.backgroundColor };
        case "top":
          return { borderTopColor: this.backgroundColor };
        case "left":
          return { borderLeftColor: this.backgroundColor };
        case "right":
          return { borderRightColor: this.backgroundColor };
        case "topleft":
        case "lefttop":
        case "topright":
        case "righttop":
          return { borderBottomColor: this.backgroundColor };
        case "bottomleft":
        case "leftbottom":
        case "bottomright":
        case "rightbottom":
          return { borderTopColor: this.backgroundColor };
      }
    },
  },
  methods: {
    updatePosition() {
      if (
        this.$parent &&
        this.$parent.$vnode &&
        this.$el.previousElementSibling &&
        !(this.$el instanceof Comment) // v-if触发transition时，this.$el会变成备注，不执行下面的代码
      ) {
        var $my = $(this.$el);
        var $target = $(this.$el.previousElementSibling);
        var targetPosition = $target.position();
        var left = targetPosition.left;
        var top = targetPosition.top;
        var placement = this.placement.toLowerCase();
        var topOfTop,
          leftOfTop,
          topOfBottom,
          leftOfBottom,
          leftOfLeft,
          topOfLeft,
          leftOfRight,
          topOfRight;
        topOfTop = () => {
          top -= parseInt($my.outerHeight()) + 5;
        };
        leftOfTop = leftOfBottom = () => {
          left +=
            parseInt($target.outerWidth() / 2) - parseInt($my.outerWidth() / 2);
        };
        topOfBottom = () => {
          top += parseInt($target.outerHeight()) + 7;
        };
        leftOfLeft = () => {
          left -= parseInt($my.outerWidth()) + 5;
        };
        topOfLeft = topOfRight = () => {
          top +=
            parseInt($target.outerHeight() / 2) -
            parseInt($my.outerHeight() / 2);
        };
        leftOfRight = () => {
          left += parseInt($target.outerWidth()) + 5;
        };
        if (placement == "bottom") {
          leftOfBottom();
          topOfBottom();
        } else if (placement == "top") {
          leftOfTop();
          topOfTop();
        } else if (placement == "left") {
          leftOfLeft();
          topOfLeft();
        } else if (placement == "right") {
          leftOfRight();
          topOfRight();
        } else if (placement == "topleft" || placement == "lefttop") {
          leftOfLeft();
          topOfTop();
        } else if (placement == "topright" || placement == "righttop") {
          leftOfRight();
          topOfTop();
        } else if (placement == "bottomleft" || placement == "leftbottom") {
          leftOfLeft();
          topOfBottom();
        } else if (placement == "bottomright" || placement == "rightbottom") {
          leftOfRight();
          topOfBottom();
        }
        this.left = left + this.offsetLeft + "px";
        this.top = top + this.offsetTop + "px";
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updatePosition();
    });
  },
  updated() {
    this.updatePosition();
  },
  props: {
    message: String,
    placement: {
      type: String,
      default: "bottom",
      validator(value) {
        var types = [
          "top",
          "bottom",
          "left",
          "right",
          "topleft",
          "lefttop",
          "topright",
          "righttop",
          "bottomleft",
          "leftbottom",
          "bottomright",
          "rightbottom",
        ];
        return types.indexOf(value) >= 0;
      },
    },
    offsetLeft: {
      type: Number,
      default: 0,
    },
    offsetTop: {
      type: Number,
      default: 0,
    },
    backgroundColor: {
      type: String,
      default: "#1d1d1d",
    },
    color: {
      type: String,
      default: "#e6e6e6",
    },
    textWrap: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "auto",
    },
  },
};
</script>