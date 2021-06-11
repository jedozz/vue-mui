//2021.06.10
<template>
  <tooltip
    :message="message"
    :placement="placement"
    :offsetLeft="offsetLeft"
    :offsetTop="offsetTop"
    :textWrap="textWrap"
    :width="width"
    backgroundColor="red"
  />
</template>
<script>
import tooltip from "@components/tooltip";

export default {
  components: {
    tooltip,
  },
  mounted() {
    console.log(this);
  },
  props: {
    message: String,
    placement: {
      type: String,
      default: "bottom",
    },
    offsetLeft: {
      type: Number,
      default: 0,
    },
    offsetTop: {
      type: Number,
      default: 0,
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