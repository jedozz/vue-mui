//2021.06.24
<template>
  <div class="rollnumber">
    <div class="rollnumber-numbers">
      <div>0</div>
      <div>9</div>
      <div>8</div>
      <div>7</div>
      <div>6</div>
      <div>5</div>
      <div>4</div>
      <div>3</div>
      <div>2</div>
      <div>1</div>
      <div>0</div>
      <div>9</div>
      <div>8</div>
      <div>7</div>
      <div>6</div>
      <div>5</div>
      <div>4</div>
      <div>3</div>
      <div>2</div>
      <div>1</div>
      <div>0</div>
    </div>
  </div>
</template>

<style>
.rollnumber {
  position: relative;
  overflow: hidden;
  display: inline-block;
  line-height: 20px;
  width: 10px;
  height: 20px;
}
.rollnumber .rollnumber-numbers {
  position: absolute;
  top: 0px;
}
</style>

<script>
import $ from "@assets/js/jquery.loader.js";
import "jquery.easing";

class RollNumber {
  constructor(el) {
    this.__$numberContainer = $(el).find(".rollnumber-numbers");
    this.__$numberContainer.data("rollNumber", this);
  }

  __rollSpeed = 1;
  __timeKind = 5; //0:开始，1:开始-加速滚动，2:正常滚动，3:结束，4：结束 -减速滚动 5:已结束
  __beginValue = 0;
  __stopValue;
  __temporaryStopFullValue; //开始执行stop操作后，临时停留的值
  __$numberContainer;

  __setContainerPoition = (value) => {
    value = isNaN(value) ? 0 : value;
    this.__$numberContainer.css(
      "top",
      -this.__$numberContainer.height() +
        (value + 1) * this.__$numberContainer.find("div").height()
    );
  };

  __getIntValue = () => {
    var value = this.__getCurrentIntFullValue();
    if (value >= 20) {
      value = 0;
    } else if (value >= 10) {
      value -= 10;
    }
    return value;
  };

  __getCurrentIntFullValue = () => {
    return Math.floor(this.__getCurrentExactFullValue());
  };

  __getCurrentExactFullValue = () => {
    var oneNumberHeight = this.__$numberContainer.find("div").height();
    var containerHeight = this.__$numberContainer.height();
    var value =
      (containerHeight + this.__$numberContainer.position().top) /
        oneNumberHeight -
      1;
    value = Math.ceil(value * 1000) / 1000;
    return value;
  };

  __getTop = (value) => {
    var oneNumberHeight = this.__$numberContainer.find("div").height();
    var containerHeight = this.__$numberContainer.height();
    return -containerHeight + oneNumberHeight * (value + 1);
  };

  __rollNow = () => {
    var top;
    var speed;
    var easing;
    if (this.__timeKind == 0) {
      this.__setContainerPoition(this.__beginValue);
      top = this.__getTop(2 + this.__beginValue);
      speed = 350 * this.__rollSpeed;
      easing = "easeInSine";
    } else if (this.__timeKind == 1) {
      //使用备用数字
      top = this.__getTop(10);
      speed =
        ((1000 * this.__rollSpeed) / 10) *
        (10 - this.__getCurrentIntFullValue());
      easing = "linear";
    } else if (this.__timeKind == 2) {
      this.__setContainerPoition();
      top = this.__getTop(10);
      speed = 1000 * this.__rollSpeed;
      easing = "linear";
    } else if (this.__timeKind == 4) {
      //开始结束
      var currentValue = this.__getIntValue();
      this.__setContainerPoition(currentValue);
      var stopFullValue;
      if (this.__stopValue <= currentValue + 2) {
        stopFullValue = this.__stopValue + 10;
      } else {
        stopFullValue = this.__stopValue;
      }
      top = this.__getTop(stopFullValue);
      speed =
        ((1000 * this.__rollSpeed) / 12) * (5 + stopFullValue - currentValue);
      easing = "easeOutSine";
    }

    this.__$numberContainer.animate(
      {
        top: top,
      },
      {
        duration: speed,
        easing: easing,
        complete: () => {
          if (this.__timeKind < 3) {
            if (this.__timeKind == 0 && this.__onStartComplete != null) {
              this.__onStartComplete();
            }
            if (this.__timeKind < 2) {
              this.__timeKind++;
            }
            this.__rollNow();
          } else if (this.__timeKind == 3) {
            this.__timeKind = 4;
            this.__$numberContainer.stop();
            this.__rollNow();
          } else if (this.__timeKind == 4) {
            this.__timeKind = 5;
            this.__beginValue = parseInt(this.__stopValue);
            this.__setContainerPoition(this.__beginValue);
          }
        },
        step: () => {
          if (
            this.__timeKind == 3 &&
            this.__getCurrentExactFullValue() >= this.__temporaryStopFullValue
          ) {
            this.__timeKind = 4;
            this.__$numberContainer.stop();
            this.__rollNow();
          }
        },
      }
    );
  };

  __checkValue = (value) => {
    value = isNaN(value) ? 0 : value;
    value = Math.floor(value);
    value = value > 9 ? 9 : value;
    value = value < 0 ? 0 : value;
    return value;
  };

  setValue = (value) => {
    this.__beginValue = this.__checkValue(value);
    this.__setContainerPoition(this.__beginValue);
  };

  start = () => {
    return new Promise((resolve) => {
      if (this.__timeKind > 2) {
        //开始stop后，或者静止状态才能执行
        this.__$numberContainer.stop();
        if (this.__timeKind < 5) {
          //非静止状态，设置动画开始的数字
          this.__beginValue = this.__getIntValue();
        }
        this.__timeKind = 0;
        this.__rollNow();
        this.__onStartComplete = () => {
          this.__onStartComplete = null;
          resolve();
        };
      }
    });
  };

  stop = (value) => {
    return new Promise((resolve) => {
      if (this.__timeKind < 5) {
        this.__timeKind = 3;
        this.__temporaryStopFullValue = this.__getCurrentIntFullValue() + 1;
        //因为temporaryStopFullValue=20的时候，给timekind赋值3的代码可能执行不了
        this.__temporaryStopFullValue =
          this.__temporaryStopFullValue == 20
            ? 10
            : this.__temporaryStopFullValue;
        this.__stopValue = this.__checkValue(value);
      }
    });
  };

  setSpeed = (speed) => {
    this.__rollSpeed = speed;
  };

  isRolling = () => this.__timeKind < 5;
}

export default {
  data() {
    return {
      width: "0px",
      height: "0px",
      rn: null,
    };
  },
  mounted() {
    this.rn = new RollNumber(this.$el);
    this.rn.setSpeed(this.speed);
    if (this.number == null) {
      this.rn.start();
    } else {
      if (this.initNumberRoll) {
        this.rn.start().then(() => {
          this.rn.stop(this.number);
        });
      } else {
        this.rn.setValue(this.number);
      }
    }
  },
  watch: {
    number(newValue) {
      if (newValue == null) {
        this.rn.start();
      } else if (this.rn.isRolling()) {
        this.rn.stop(newValue);
      } else {
        this.rn.start().then(() => {
          this.rn.stop(newValue);
        });
      }
    },
  },
  props: {
    number: Number,
    speed: {
      type: Number,
      default: 1,
    },
    //初始化的数字是否滚动
    initNumberRoll: {
      type: Boolean,
      default: true,
    },
  },
};
</script>