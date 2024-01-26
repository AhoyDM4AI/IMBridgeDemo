<template>
  <div style="text-align: center; padding-top: 20px;" >
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
    dataZoom: [{
      show: true,
      type:"inside",
      maxValueSpan: 40,
      minValueSpan: 20,
      startValue: 0,
      endValue: 40,
    }],
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
    tooltip: {
      // 当trigger : axis 鼠标移入标线不会有悬浮框出现 params的值为一个数组，只会悬浮series
      // 当trigger : item 鼠标移入标线有悬浮框出现 params的值为一个对象，会区别鼠标移入的是series还是markLine
      // 使用axis 注释掉formatter 自己写也行 ；使用item放开formatter
      show: true,
      trigger: "item",//axis item
      axisPointer: {
          type: "cross",
          label: {
              backgroundColor: "#6a7985",
          },
      },
      formatter: (params) => {
          if(params.componentType === "series"){
              return "iter: " + params.name + '<br>' + params.marker+' '+params.data;
          }else if(params.componentType === "markLine"){
              return params.data.label.formatter + ': ' + params.value ;
          }
      }
    },
    series: [
      {
        name: "OceanBase",
        data: chartData.y1,
        type: "bar",
      },
      {
        name: "IMBridge",
        data: chartData.y2,
        type: "bar",
      },
    ],
    textStyle: {
      fontSize: 18,
    }
  };
  let markLine_option = {
    symbol: ['none', 'none'],
    data: [{
      type: "max",
      name: "Desirable Batch Size",
      label: {
        show: true,
        position: 'end',
        formatter: 'Desirable'
      },
      lineStyle: {
        color: "black",
      },
    }],
  }
  if (props.chart_id == "batch") 
    option.series[1].markLine = markLine_option;

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
