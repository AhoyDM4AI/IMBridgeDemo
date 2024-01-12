<template>
  <div>
  <div id='showorders' style='width:1000px; height:300px'></div>

  </div>
</template>
 
<script>
import { ref, onMounted } from "vue";
import * as echarts from 'echarts';
export default {
    data(){
    },
    props:{
      charData:{
        type:Object,
        default(){
          return {
            x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            y:[150, 230, 224, 218, 135, 147, 260],
            titleText:"default"
          }
        }
      }
    },
    methods:{
        showorders(){
            // 基于准备好的dom，初始化echarts实例
            var chartDom = document.getElementById('showorders');
            var myChart = echarts.init(chartDom);
            // 指定图表的配置项和数据
            var option;
 
            option = {
                title: {
                  text: this.charData.titleText
                },
                xAxis: {
                    type: 'category',
                    data: this.charData.x
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    data:this.charData.y,
                    type: 'line'
                    }
                ]
            };
            option && myChart.setOption(option);
        },
       
    },
    mounted() {
        this.showorders()
    },
 
}
</script>
 
<style>
 
</style>