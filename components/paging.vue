//2021.6.10
<template>
  <div class="paging">
    <div class="paging-btns">
      <a class="prev" :class="{ disabled: prevDisabled }" @click="prev">«</a>
      <picker :data="pickerData" :val.sync="innerPage" />
      <a class="next" :class="{ disabled: nextDisabled }" @click="next">»</a>
    </div>
  </div>
</template>
<style>
.paging {
  width: 240px;
}

.paging .paging-btns {
  width: 240px;
  display: flex;
}

.paging .paging-btns > .prev,
.paging .paging-btns > .next,
.paging .paging-btns > .picker {
  display: inline-block;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #007aff;
  text-decoration: none;
  font-size: 20px;
  width: 80px;
  height: 40px;
  text-align: center;
}

.paging .paging-btns > .prev,
.paging .paging-btns > .next {
  line-height: 37px;
}

.paging .paging-btns > *:not(:first-child) {
  border-left: none;
}

.paging .paging-btns > *:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.paging .paging-btns > *:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.paging .paging-btns > .prev.disabled,
.paging .paging-btns > .next.disabled {
  color: #b5b5b5;
}

.paging .paging-btns > .picker {
  width: 80px;
  height: 40px;
  display: inline-block;
  color: #000;
  line-height: 40px;
}

.paging .paging-btns > .picker:after {
  content: none;
}

.paging .paging-btns > .picker .text {
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<script>
import picker from "./picker";

export default {
  data() {
    return {
      innerPage: 0,
      pickerData: [],
    };
  },
  components: {
    picker,
  },
  mounted() {
    this.innerPage = this.page;
    this.buildPickerData();
  },
  computed: {
    prevDisabled() {
      return !(this.innerPage > 1);
    },
    nextDisabled() {
      return !(this.innerPage < this.pageCount);
    },
  },
  methods: {
    prev() {
      if (!this.prevDisabled) {
        this.innerPage -= 1;
      }
    },
    next() {
      if (!this.nextDisabled) {
        this.innerPage += 1;
      }
    },
    buildPickerData() {
      var newPickerData = [];
      for (var i = 1; i <= this.pageCount; i++) {
        newPickerData.push({ text: i, value: i });
      }
      this.pickerData = newPickerData;
      if (this.pageCount > 0 && this.page == null) {
        this.innerPage = 1;
      } else if (this.pageCount < this.page) {
        this.innerPage = this.pageCount;
      }
    },
  },
  watch: {
    page(newValue) {
      if (newValue != this.innerPage) {
        this.innerPage = newValue;
      }
    },
    innerPage(newValue) {
      if (newValue != this.page) {
        this.$emit("update:page", newValue);
      }
    },
    pageCount() {
      this.buildPickerData();
    },
  },
  props: {
    pageCount: {
      type: Number,
      default: 0,
    },
    page: {
      type: Number,
      default: 0,
    },
  },
};
</script>