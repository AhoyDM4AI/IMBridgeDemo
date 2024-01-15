<template>
  <div class="ace">
    <div id="editor" ref="aceDom"></div>
  </div>
</template>

<script setup>
import "../assets/ace/ace";
import "../assets/ace/mode-python";
import "../assets/ace/mode-sql";
import "../assets/ace/theme-chrome";
import {ref, onMounted} from "vue";

const props = defineProps({
  lines: Number,
  lang: String,
  fontsize: String,
  readonly: Boolean,
})

const aceDom = ref();
let aceEditor = null;
onMounted(() => {
  init();
});
const init = () => {
  aceEditor = ace.edit(aceDom.value);
  aceEditor.setOptions({
    autoScrollEditorIntoView: true,
    wrap: true,
    fontSize: props.fontsize + 'px',
    maxLines: props.lines? props.lines: 15,
    minLines: props.lines? props.lines: 15,
    readOnly: props.readonly
  })
  aceEditor.session.setMode("ace/mode/"+props.lang);
};
const setVal = (val) => {
  aceEditor.setValue(val, 1);
};
const getVal = () => {
    return aceEditor.getValue();
}
defineExpose({
  setVal,
  getVal
});
</script>

<style scoped lang="scss">
.ace {
  display: flex;
  flex-direction: column;
  #editor {
    flex-grow: 1;
  }
}
</style>
