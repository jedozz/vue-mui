//2021.06.09 9:15
<template>
  <div class="imgs" ref="imgs">
    <div
      class="img"
      v-for="(image, index) in displayImages"
      :key="index"
      :style="{ height: imgsHeight }"
    >
      <div class="img-container">
        <img
          v-if="image.path == null"
          class="img-button"
          src="~@assets/images/Button_T_photo.png"
          @tap="pickImage(image)"
        />
        <img
          v-if="image.path != null"
          class="img-preview"
          :src="image.path"
          data-preview-src
        />
        <button
          class="btn-blue btn-delete"
          @tap="deleteImage(image)"
          v-if="image.path != null && !disableEdit"
        >
          {{ lang.Delete }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.imgs {
  width: 100%;
  float: left;
  padding: 0 5px 5px 5px;
  padding-bottom: 35px;
}

.imgs .img {
  width: 20%;
  float: left;
  margin-bottom: 40px;
}

.imgs .img-container {
  height: 100%;
  margin: 0px 5px;
}

.imgs .img .img-button {
  width: 100%;
  height: 100%;
  background-size: 100%;
  display: block;
}

.imgs .img .img-preview {
  width: 100%;
  height: 100%;
}

.imgs .img .btn-blue.btn-delete {
  line-height: 12px;
  font-size: 12px;
  width: 100%;
  height: 25px;
}
@import "~@assets/css/mui.imageviewer.css";
</style>

<script>
import comm from "@assets/js/comm.js";
import mui from "@assets/js/mui.loader.js";
import "@assets/lib/mui.previewimage.js";
import "@assets/lib/mui.zoom.js";
export default {
  data() {
    return {
      imgsHeight: 0,
    };
  },
  mounted() {
    var that = this;
    that.$nextTick(() => {
      that.imgsHeight = (that.$refs.imgs.clientWidth - 50) / 5 + "px";
    });
  },
  methods: {
    pickImage(img) {
      var that = this;
      comm
        .getCameraImage()
        .then((imagePath) => {
          img.path = imagePath;
          that.images.push(img);
          that.$nextTick(() => {
            mui.previewImage();
          });
        })
        .catch((e) => {
          console.log(e);
          mui.toast(that.lang.PhotoError);
        });
    },
    deleteImage(img) {
      var that = this;
      that.images.remove((m) => m == img);
    },
  },
  watch: {
    images(newValue) {
      if (newValue.length > this.max) {
        throw new Error("数量超过最大值");
      }
      this.$emit("changed", newValue);
      this.$nextTick(() => {
        mui.previewImage();
      });
    },
  },
  computed: {
    displayImages() {
      let r;
      r = this.images.findAll((m, index) => index < this.max).select((m) => m);
      if (
        (r.length < this.max || r.length == this.max - 1) &&
        !this.disableEdit
      ) {
        r.push({ path: null, isNew: true });
      }
      return r;
    },
  },
  props: {
    images: {
      type: Array,
      required: true,
      validator: (value) => {
        return !value.exists((m) => typeof m.path != "string");
      },
    },
    max: {
      type: Number,
      default: 5,
      validator: (value) => {
        return value == parseInt(value) && value > 0;
      },
    },
    disableEdit: {
      type: Boolean,
      default: false,
    },
  },
};
</script>