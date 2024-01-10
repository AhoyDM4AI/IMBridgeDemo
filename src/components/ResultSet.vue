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
      title: 'prop_id',
      key: 'prop_id'
    },
    {
      title: 'price_usd',
      key: 'price_usd'
    },
    {
      title: 'count_bookings',
      key: 'count_bookings'
    },
    {
      title: 'count_clicks',
      key: 'count_clicks'
    }
  ]
}

export default defineComponent({
  setup () {
    return {
      data: ref([
        {prop_id: '94330', price_usd:"80", count_bookings: "33", count_clicks: "48"},
        {prop_id: '85222', price_usd:"50", count_bookings: "4", count_clicks: "3"},
        {prop_id: '54507', price_usd:"74", count_bookings: "34", count_clicks: "49"},

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
