<template>
  <div style="text-align: center">
    <div :id="props.chart_id" style="height: 300px" ref="chartDom"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  chart_id: "default",
  yName: String,
});

const chartDom = ref();
let myChart = null;

const init = () => {
  myChart = echarts.init(chartDom.value);
};

const reDraw = (chartData) => {
  let option = {
    xAxis: {
      name: "Iteration Number",
      type: "category",
      nameLocation: "middle",
      data: chartData.x,
      nameGap: 25,
    },
    yAxis: {
      name: props.yName,
      //type: "log",
      // logBase: 10,
    },
    legend: {
      // Try 'horizontal'
      orient: "horizontal",
      top: "top",
      //left: 160
    },
    series: [
      {
        name: "naive",
        data: chartData.y1,
        type: "bar",
      },
      {
        name: "optimized",
        data: chartData.y2,
        type: "bar",
      },
    ],
  };
  option && myChart.setOption(option);
};
onMounted(() => {
  init();
});
defineExpose({
  reDraw,
});
</script>

<style></style>
