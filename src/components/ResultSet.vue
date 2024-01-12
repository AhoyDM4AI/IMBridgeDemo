<template>
  <n-layout>
    <n-layout-content bordered style="height: 500px padding: 10px">
      <div class="results">
        <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :max-height="200"
          :scroll-x="500"
        />
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
const props = defineProps({
    data: Array,
    columns: Array,
})

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
