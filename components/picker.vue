//2021.06.22
<template>
  <div
    class="picker"
    @tap="show"
    :class="[type == 'datePicker' ? 'picker-date' : 'picker-pop']"
  >
    <slot
      ><div class="text">{{ content }}</div>
    </slot>
  </div>
</template>
<style>
@import "~@assets/css/mui.picker.min.css";
.picker {
  position: relative;
  padding-right: 25px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picker:active {
  background: #eee;
}

.picker:after {
  font-family: Muiicons;
  font-size: inherit;
  line-height: 1;
  position: absolute;
  top: 50%;
  right: 10px;
  display: inline-block;
  transform: translateY(-50%);
  text-decoration: none;
  color: #bbb;
  content: "\e581";
}

.picker .text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
<script>
import mui from "@assets/js/mui.loader.js";
import lang from "@assets/js/language.js";
import "@assets/js/yj.dateFormat.js";
import "@assets/lib/mui.picker.all.yjmodify.js";

export default {
  data() {
    return {
      content: null,
      muiPicker: null,
      selectedItems: null,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    hasData() {
      return this.muiPicker.pickers[0].items.length > 0;
    },
    values() {
      if (this.type == "popPicker") {
        return this.selectedItems
          ? this.selectedItems.length == 1
            ? this.selectedItems[0].value
            : this.selectedItems.select((m) => m.value)
          : null;
      } else {
        return this.selectedItems ? this.selectedItems.value : null;
      }
    },
  },
  watch: {
    data(newData, oldData) {
      if (JSON.stringify(newData) != JSON.stringify(oldData)) {
        this.setData(newData);
      }
    },
    val(newValue) {
      if (JSON.stringify(newValue) != JSON.stringify(this.values)) {
        this.setValue(this.convertPickerValue(newValue));
      }
    },
  },
  methods: {
    init() {
      this.createMuiPicker();
      if (this.type == "popPicker") {
        this.setData(this.data);
      }
      setTimeout(() => {
        if (this.val != null) {
          this.setValue(this.convertPickerValue(this.val));
        } else if (this.type == "datePicker") {
          this.setValue(this.convertPickerValue(this.currentDate));
        }
      }, 100); //延迟100ms，不然可能setValue不成功.
    },
    createMuiPicker() {
      let opts = {
        buttons: this.buttons,
      };
      if (this.type == "popPicker") {
        opts = mui.extend(opts, {
          layer: this.layer,
        });
        this.muiPicker = new mui.PopPicker(opts);
      } else if (this.type == "datePicker") {
        opts = mui.extend(opts, {
          beginYear: this.beginYear,
          type: this.dateType,
          labels: [
            lang.DateTimeWords.Year,
            lang.DateTimeWords.Month,
            lang.DateTimeWords.Day,
            lang.DateTimeWords.Hour,
            lang.DateTimeWords.Minute,
          ],
        });
        this.muiPicker = new mui.DtPicker(opts);
      } else {
        throw Error("Picker类型错误");
      }
    },
    onSelected(selectedItems, canEmitChangedEvent) {
      var text,
        isChanged = false;
      if (this.type == "popPicker" && this.hasData) {
        var format = "";
        if (this.format) {
          format = this.format;
        } else {
          for (let i = 0; i < selectedItems.length; i++) {
            format += "{" + i + "}";
          }
        }
        text = format;
        for (let i = 0; i < selectedItems.length; i++) {
          text = text.replace(
            "{" + i + "}",
            selectedItems[i].text ? selectedItems[i].text : ""
          );
          if (
            this.selectedItems == null ||
            this.selectedItems[i] != selectedItems[i]
          ) {
            isChanged = true;
          }
        }
      } else if (this.type == "datePicker") {
        text = selectedItems.value;
        isChanged =
          this.selectedItems == null ||
          this.selectedItems.value != selectedItems.value;
      }

      if (isChanged) {
        var oldSelectedItems = this.selectedItems;
        this.selectedItems = selectedItems;
        if (canEmitChangedEvent) {
          let para;
          if (this.type == "popPicker") {
            para =
              selectedItems.length == 1
                ? {
                    newValue: selectedItems[0].value,
                    newItem: selectedItems[0],
                    oldValue: oldSelectedItems
                      ? oldSelectedItems[0].value
                      : null,
                    oldItem: oldSelectedItems ? oldSelectedItems[0] : null,
                  }
                : {
                    newValues: selectedItems.select((m) => m.value),
                    newItems: selectedItems,
                    oldValues: oldSelectedItems
                      ? oldSelectedItems.select((m) => m.value)
                      : null,
                    oldItems: oldSelectedItems,
                  };
          } else {
            para = {
              newValue: selectedItems.value,
              newItem: selectedItems,
              oldValue: oldSelectedItems.value,
              oldItem: oldSelectedItems,
            };
          }
          this.$emit(
            "update:val",
            this.type == "popPicker" && selectedItems.length > 1
              ? para.newValues
              : para.newValue
          );
          this.$nextTick(() => {
            this.$emit("changed", para);
          });
        }
        if (typeof this.formatter == "function") {
          this.content = this.formatter(selectedItems);
        } else {
          this.content = text;
        }
      }
    },
    convertPickerValue(value) {
      var pickerValue;
      if (this.type == "datePicker" && value instanceof Date) {
        pickerValue = value.format("yyyy-MM-dd HH:mm");
      } else if (
        this.type == "datePicker" &&
        isNaN(new Date(value).getFullYear())
      ) {
        throw new Error("日期不合法");
      } else {
        pickerValue = value;
      }
      return pickerValue;
    },
    show() {
      if (this.muiPicker) {
        this.muiPicker.show((selectedItems) => {
          let para;
          if (this.type == "popPicker") {
            para =
              selectedItems.length == 1
                ? { value: selectedItems[0].value, item: selectedItems[0] }
                : {
                    values: selectedItems.select((m) => m.value),
                    items: selectedItems,
                  };
          } else {
            para = { value: selectedItems.value, item: selectedItems };
          }
          this.$emit("pick", para);
          this.onSelected(selectedItems, true);
        });
      }
    },
    setData(data) {
      if (data instanceof Array) {
        this.muiPicker.setData(data);
        this.selectedItems = null;
      }
    },
    setValue(value) {
      return new Promise((resolve, reject) => {
        if (value == null) {
          reject("参数不能为空");
        } else {
          if (this.type == "popPicker") {
            if (value instanceof Array) {
              var hasSelected = false;
              var set = (i) => {
                if (i < this.muiPicker.pickers.length) {
                  this.muiPicker.pickers[i].setSelectedValue(
                    value[i],
                    0,
                    () => {
                      set(++i);
                    }
                  );
                  hasSelected = true;
                } else if (hasSelected) {
                  this.onSelected(this.muiPicker.getSelectedItems(), false);
                  resolve();
                }
              };
              set(0);
            } else {
              this.muiPicker.pickers[0].setSelectedValue(value, 0, () => {
                this.onSelected(this.muiPicker.getSelectedItems(), false);
                resolve();
              });
            }
          } else if (this.type == "datePicker") {
            this.muiPicker.setSelectedValue(value, () => {
              this.onSelected(this.muiPicker.getSelected(), false);
              resolve();
            });
          }
        }
      });
    },
  },
  destroyed() {
    this.muiPicker.dispose();
  },
  model: {
    prop: "val",
    event: "update:val",
  },
  props: {
    type: {
      // popPicker, datePicker
      type: String,
      default: "popPicker",
    },
    data: {
      //type为popPicker的时候才需要此属性， 格式 [{value:1, text:'aa'}]
      type: Array,
      default() {
        return [];
      },
    },
    val: [Number, String, Array, Date],
    format: {
      type: String,
      default: () => "",
    },
    formatter: {
      type: Function,
      default: null,
    },
    buttons: {
      type: Array,
      default: () => [lang.Cancel, lang.Ok],
    },
    layer: {
      type: Number,
      default: 1,
      validator: (value) => {
        return value == parseInt(value) && value > 0;
      },
    },
    beginYear: {
      type: Number,
      default: () => new Date().getUTCFullYear() - 50,
    },
    dateType: {
      //'datetime'	完整日期视图(年月日时分)
      //'date'	年视图(年月日)
      //'time'	时间视图(时分)
      //'month'	月视图(年月)
      //'hour'	时视图(年月日时)
      type: String,
      default: () => "date",
    },
    currentDate: {
      type: [Date, String],
      default: () => new Date(),
    },
  },
};
</script>
 