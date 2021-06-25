//2021.06.16
<template>
  <span>{{ displayNumber }}</span>
</template>

<script>
import TWEEN from "@tweenjs/tween.js";

var goNumber = function(vm, newValue, oldValue) {
  function animate() {
    if (TWEEN.update()) {
      requestAnimationFrame(animate);
    }
  }
  new TWEEN.Tween({
    number: oldValue
  })
    .easing(TWEEN.Easing.Quadratic.Out)
    .to(
      {
        number: newValue
      },
      vm.duration
    )
    .onUpdate((tween)=> {
      var displayNumber = tween.number.toFixed(vm.precision);
      showDisplayNumber(vm, displayNumber);
    })
    .start();
  animate();
};

var showDisplayNumber = function(vm, displayNumber) {
  if (vm.cutDirection == "toLeft") {
    displayNumber = displayNumber.substring(
      displayNumber.length - vm.cut.start,
      displayNumber.length - 1 - vm.cut.end
    );
  } else {
    displayNumber = displayNumber.substring(vm.cut.start, vm.cut.end + 1);
  }
  if (!displayNumber) {
    displayNumber = 0;
  }
  vm.displayNumber = displayNumber;
};

export default {
  mounted() {
    showDisplayNumber(this, this.number.toFixed(this.precision));
  },
  props: {
    number: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 2000
    },
    precision: {
      type: Number,
      default: 0
    },
    cut: {
      type: Object,
      default() {
        return {
          start: 0,
          end: 9999
        };
      }
    },
    cutDirection: {
      type: String,
      default: "toLeft"
    }
  },
  data() {
    return {
      displayNumber: 0
    };
  },
  watch: {
    number(newValue, oldValue) {
      goNumber(this, newValue, oldValue);
    }
  }
};
</script>