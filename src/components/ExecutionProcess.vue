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

<script lang="js">
import { defineComponent, ref } from 'vue'

const createColumns = () => {
  return [
    {
      title: 'Iteration Number',
      key: 'no'
    },
    {
      title: 'Batch Size',
      key: 'bs'
    },
    {
      title: 'time',
      key: 't'
    },
  ]
}

export default defineComponent({
  setup () {
    return {
      data: ref([
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},
        {no: 'Name', bs:"address", t:"tags"},

      ]),
      columns: createColumns()
    }
  }
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
