//2021.07.16
<template>
  <div class="rollnumbers">
    <transition-group name="rollnumber">
      <rollnumber
        v-for="(bit, index) in bits"
        :speed="speed"
        :initNumberRoll="false"
        :key="index"
        :number="bit"
      />
    </transition-group>
  </div>
</template>

<style>
.rollnumbers {
  display: inline-block;
}

.rollnumbers::before,
.rollnumbers::after {
  content: " ";
  clear: both;
  display: table;
}

.rollnumbers .rollnumber {
  float: right;
}

.rollnumber-enter-active,
.rollnumber-leave-active {
  transition: all 1s;
}
.rollnumber-enter,
.rollnumber-leave-to {
  opacity: 0;
}
</style>

<script>
import rollnumber from "./rollnumber.vue";

export default {
  data() {
    var zeroBits = [];
    var nullBits = [];
    for (var i = 0; i < this.count; i++) {
      zeroBits.push(0);
      nullBits.push(null);
    }
    return {
      bits:
        this.number == null
          ? zeroBits
          : this.initNumberRoll
          ? nullBits
          : this.getBits(),
    };
  },
  components: {
    rollnumber,
  },
  mounted() {
    if (this.number == null) {
      this.start();
    } else {
      this.bits = this.getBits();
    }
  },
  methods: {
    getBits() {
      var newBits = [];
      if (this.number == null) {
        for (i = 0; i < this.count; i++) {
          newBits.push(null);
        }
      } else {
        var numberStr = (new Array(this.count).join(0) + this.number).slice(
          -this.count
        );
        for (var i = 0; i < this.count; i++) {
          let bit = parseInt(numberStr[i]);
          bit = isNaN(bit) ? 0 : bit;
          newBits.push(bit);
        }
        newBits.reverse();
      }
      return newBits;
    },
    start() {
      return new Promise((resolve) => {
        var i = 0;
        var interval = setInterval(() => {
          if (i < this.bits.length) {
            this.$set(this.bits, i, null);
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    },
    stop() {
      this.bits = this.getBits();
    },
  },
  watch: {
    number(newValue) {
      if (newValue == null) {
        this.start();
      } else {
        this.start().then(() => {
          this.stop();
        });
      }
    },
    count() {
      this.bits = this.getBits();
    },
  },
  props: {
    number: Number,
    count: {
      required: true,
      type: Number,
    },
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