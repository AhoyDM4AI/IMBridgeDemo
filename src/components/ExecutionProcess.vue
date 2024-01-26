<template>
  <n-layout>
    <n-layout-content bordered style="height: 500px padding: 10px">
      <n-flex justify="space-between" style="padding-bottom:10px">
        <n-text style="font-size:large; font-weight:600; color:black">{{props.title}}</n-text>
        <n-popover trigger="click" placement="bottom" >
          <template #trigger>
            <n-button text style="font-size: 24px">
              <n-icon>
                <img src="../../public/MdSettings.svg" />
              </n-icon>
            </n-button>
          </template>
          <template #header>
            <n-text strong depth="1">
              列显示设置
            </n-text>
          </template>
          <n-checkbox-group v-model:value="checked_cols" @update:value="handleCheckedCol">
            <n-grid :cols="1" y-gap="10">
              <n-gi><n-checkbox value="bs" label="Inference Batch Size" /></n-gi>
              <n-gi><n-checkbox value="t" label="Elapsed Time" /></n-gi>
              <n-gi><n-checkbox value="ef" label="Throughput" /></n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-popover>
      </n-flex>
      <div class="results">
        <n-data-table
          size="small"
          :columns="show_columns"
          :data="data"
          :loading="table_loading"
          :pagination="{
            pageSize: 10,
          }"
        />
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  data: Array,
  title: String,
});
const createColumns = () => {
  return [
    {
      title: "Iteration",
      key: "no",
      align: "center",
      titleAlign: "center",
    },
    {
      title: "Inference Batch Size",
      key: "bs",
      align: "center",
      titleAlign: "center",
    },
    {
      title: "Elapsed Time (ms)",
      key: "t",
      align: "center",
      titleAlign: "center",
    },
    {
      title: "Throughput (row/ms)",
      key: "ef",
      align: "center",
      titleAlign: "center",
    },
  ];
};

const checked_cols = ref(["bs", "t", "ef"]);

const table_loading = ref(false);

const columns = createColumns();

let show_columns = columns;
const handleCheckedCol = (value) => {
  show_columns = columns.filter(item => item.key == "no" || (value.includes(item.key)));
  table_loading.value = true;
  table_loading.value = false;
};

</script>

<style scoped lang="scss">
.results {
  display: flex;
  flex-direction: column;
  #editor {
    flex-grow: 1;
    margin: 10px 0;
  }
}
</style>
