//2021.6.25
<template>
  <div class="paging">
    <div class="paging-btns">
      <a class="prev" :class="{ disabled: prevDisabled }" @tap="prev">«</a>
      <picker :data="pickerData" :val.sync="innerPage">
        <roll-numbers
          :number="innerPage"
          :count="innerPage.toString().length"
          :speed="0.5"
        />
        <div class="paging-number-shadow"></div>
      </picker>
      <a class="next" :class="{ disabled: nextDisabled }" @tap="next">»</a>
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
  padding: 0;
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

.paging .paging-number-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: linear-gradient(#fff, #fff0, #fff);
}

.paging .rollnumber {
  line-height: 40px;
  height: 40px;
}
</style>
<script>
import picker from "./picker";
import rollNumbers from "./rollnumbers.vue";

export default {
  data() {
    return {
      innerPage: 0,
      pickerData: [],
      pageCount: 0,
    };
  },
  components: {
    picker,
    rollNumbers,
  },
  mounted() {
    this.innerPage = this.page;
    this.$emit("changed", {
      page: this.innerPage,
      pagingData: this.pagingData,
    });
    this.caculatePageCount();
    this.buildPickerData();
  },
  computed: {
    prevDisabled() {
      return !(this.innerPage > 1);
    },
    nextDisabled() {
      return !(this.innerPage < this.pageCount);
    },
    pagingData() {
      var pagingDatas = [];
      if (this.innerPage > 0 && this.data != null) {
        for (
          var i = this.pageSize * (this.innerPage - 1);
          i < this.pageSize * this.innerPage && i < this.data.length;
          i++
        ) {
          pagingDatas.push(this.data[i]);
        }
      }
      return pagingDatas;
    },
  },
  methods: {
    caculatePageCount() {
      if (this.data == null) {
        this.pageCount = 0;
      } else {
        this.pageCount = parseInt((this.data.length - 1) / this.pageSize + 1);
      }
    },
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
      if (this.pageCount > 0 && (this.page == null || this.page == 0)) {
        this.innerPage = 1;
      } else if (this.pageCount < this.page) {
        this.innerPage = this.pageCount;
      }
    },
    triggerChangedEvent() {
      this.$emit("changed", {
        page: this.innerPage,
        pagingData: this.pagingData,
      });
    },
  },
  watch: {
    page(newValue) {
      if (newValue != this.innerPage) {
        this.innerPage = newValue;
        this.triggerChangedEvent();
      }
    },
    innerPage(newValue) {
      if (newValue != this.page) {
        this.$emit("update:page", newValue);
        this.triggerChangedEvent();
      }
    },
    pageCount() {
      this.buildPickerData();
    },
    data() {
      this.triggerChangedEvent();
      this.caculatePageCount();
    },
  },
  props: {
    page: {
      type: Number,
      default: 0,
    },
    data: Array,
    pageSize: {
      type: Number,
      default: 10,
    },
  },
};
</script>