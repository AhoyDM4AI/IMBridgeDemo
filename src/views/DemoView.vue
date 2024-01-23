<template>
  <main>
    <n-spin :show="loading" size="large">
      <n-layout has-sider>
        <n-layout-sider
          bordered
          :width="475"
          style="background: rgb(234, 238, 243)"
        >
          <n-grid y-gap="6" :cols="1">
            <n-gi style="padding-top: 8px">
              <h2 id="title">Settings</h2>
              <n-flex style="padding-left: 30px; padding-top: 5px" justify="space-between">
                <n-grid :cols="3" :x-gap="12">
                  <n-gi :span="2">
                    <n-select 
                      size="medium"
                      placeholder="Select Prediction Query"
                      :options="options"
                      @update:value="handleSelect"
                    />
                  </n-gi>
                  <n-gi :span="1">
                    <n-button
                      type="info"
                      size="medium"
                      :disabled="loading"
                      @click="handleClick"
                      >Deploy & Run</n-button
                    >
                  </n-gi>
                </n-grid>
                <n-flex justify="left" style="padding-top: 3px">
                  <n-switch 
                    :rail-style="railStyle"
                    v-model:value="activeSwitch"
                    @update:value="handleSwitch"
                  >
                    <template #checked>
                      <p style="color:black">IMBridge</p>
                    </template>
                    <template #unchecked>
                      <p style="color:black">OceanBase</p>
                    </template>
                  </n-switch>
                  <n-checkbox
                    v-model:checked="rewrite_on"
                    :disabled="offCheckbox"
                    label="Function Rewrite"
                  />
                  <n-checkbox
                    v-model:checked="adaptive_on"
                    :disabled="offCheckbox"
                    label="Adaptive Batching"
                  />
                </n-flex>
              </n-flex>
            </n-gi>
            <n-gi>
              <h2 id="title">SQL Editor</h2>
              <CodeEditor
                :lines="15"
                :lang="'sql'"
                :readonly="false"
                fontsize="12"
                ref="query_editor"
              />
            </n-gi>
            <n-gi>
              <h2 id="title">Function Editor</h2>
              <CodeEditor
                :lines="25"
                :lang="'python'"
                :readonly="false"
                fontsize="12"
                ref="udf_editor"
              />
            </n-gi>
          </n-grid>
        </n-layout-sider>
        <n-divider vertical style="margin-left: 4px; margin-right: 0" />
        <n-layout-content
          bordered
          content-style="padding: 10px;"
          style="height: 91vh; background: rgb(234, 238, 243)"
        >
          <h2 id="title">Analysis Report</h2>
          <n-collapse
            style="padding-left: 6px; padding-top: 4px"
            display-directive="show"
            :default-expanded-names="['1', '2', '3', '4']"
            @click="reRender"
          >
            <n-collapse-item title="Prediction Function Code" name="1">
              <n-grid x-gap="12" :cols="2">
                <n-gi>
                  <n-card id="plan" title="OceanBase Original Code:">
                    <!--<n-image width="80" src="/src/assets/all.svg" />-->
                    <CodeEditor
                      :lines="15"
                      :lang="'python'"
                      :readonly="true"
                      fontsize="12"
                      ref="udf_plan_n"
                    />
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="plan" title="IMBridge Rewritten Code:">
                    <!--<n-image
                      v-if="rewrite_on"
                      width="53"
                      src="/src/assets/rewrite.svg"
                    />
                    <n-image v-else width="80" src="/src/assets/all.svg" />-->
                    <CodeEditor
                      :lines="15"
                      :lang="'python'"
                      :readonly="true"
                      fontsize="12"
                      ref="udf_plan_o"
                    />
                  </n-card>
                </n-gi>
              </n-grid>
            </n-collapse-item>
            <n-collapse-item title="Prediction Query Plan" name="2">
              <n-grid x-gap="12" :cols="2">
                <n-gi>
                  <n-card id="plan" title="OceanBase Plan:">
                    <PlanTree content="naive_plan" ref="naive_tree" />
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="plan" title="IMBridge Plan:">
                    <PlanTree content="opt_plan" :isOpt="true" ref="opt_tree" />
                  </n-card>
                </n-gi>
              </n-grid>
            </n-collapse-item>
            <n-collapse-item title="Execution Process" name="3">
              <n-h3 style="margin-left: 12px; margin-bottom: 10px">
                Total Elapsed Time (OceanBase/IMBridge): {{ naive_exec }}s/{{
                  opt_exec
                }}s
              </n-h3>
              <n-grid x-gap="12" y-gap="12" :cols="2">
                <n-gi>
                  <n-card id="plan" title="OceanBase Execution">
                    <ExecutionProcess :data="exec_process_n"></ExecutionProcess>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="plan" title="IMBridge Execution">
                    <ExecutionProcess :data="exec_process_o"></ExecutionProcess>
                  </n-card>
                </n-gi>
              </n-grid>
              <n-card class=”chart title="Batch Size Comparison">
                <ExecutionChart
                  chart_id="batch"
                  ref="batch_chart"
                  yName="Batch Size"
                ></ExecutionChart>
              </n-card>
              <n-card class=”chart title="Predition Time Comparison">
                <ExecutionChart
                  chart_id="timing"
                  yName="Prediction Time (ms)"
                  ref="time_chart"
                ></ExecutionChart>
              </n-card>
              <n-card class=”chart title="Predition Efficiency Comparison">
                <ExecutionChart
                  chart_id="efficient"
                  yName="Prediction Efficiency(row/ms)"
                  ref="efficient_chart"
                ></ExecutionChart>
              </n-card>
            </n-collapse-item>
            <n-collapse-item title="Result Set" name="4">
              <n-grid x-gap="12" y-gap="12" :cols="2">
                <n-gi>
                  <n-card id="result" title="OceanBase Results">
                    <ResultSet :columns="vanilla_results_columns" :data="vanilla_results" />
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="result" title="IMBridge Results">
                    <ResultSet :columns="IMBridge_results_columns" :data="IMBridge_results" />
                  </n-card>
                </n-gi>
              </n-grid>
            </n-collapse-item>
          </n-collapse>
        </n-layout-content>
      </n-layout>
    </n-spin>
  </main>
</template>

<script setup>
import ResultSet from "../components/ResultSet.vue";
import CodeEditor from "../components/CodeEditor.vue";
import ExecutionProcess from "../components/ExecutionProcess.vue";
import ExecutionChart from "@/components/ExecutionChart.vue";
import PlanTree from "../components/PlanTree.vue";
import { ref, onMounted } from "vue";

const query_editor = ref(null);
const udf_editor = ref(null);
const udf_plan_n = ref(null);
const udf_plan_o = ref(null);

const batch_chart = ref(null);
const time_chart = ref(null);
const efficient_chart = ref(null);

let activeSwitch = ref(false);
let offCheckbox = ref(true);

let rewrite_on = ref(false);
let adaptive_on = ref(false);

let vanilla_exec = ref(null);
let IMBridge_exec = ref(null);

let loading = ref(false);

let naive_exec = ref(0);
let opt_exec = ref(0);

let code = "",
  rewrite_code = "";

const naive_tree = ref();
const opt_tree = ref();

let naive_tree_data = null;
let opt_tree_data = null;

let batch_chart_data = null;
let time_chart_data = null;
let efficient_chart_data = null;

const exec_process_n = ref([]);
const exec_process_o = ref([]);

const vanilla_results_columns = ref([]);
const IMBridge_results_columns = ref([]);
const vanilla_results = ref([]);
const IMBridge_results = ref([]);

let showedQuery = null; // default

const queryMap = {'query1': 'q1', 'query2': 'q2', 'query3': 'q3'};

// select prediction query
const handleSelect = (value, option) => {
  if (value == 'query0') {
    query_editor.value.setVal("");
    udf_editor.value.setVal("");
  } else {
    loading.value = !loading.value;
    import(`../data/${queryMap[value]}/staff.js`).then((module) => {
      showedQuery = module.query;
      query_editor.value.setVal(showedQuery.input.query);
      udf_editor.value.setVal(showedQuery.input.udf);
      loading.value = !loading.value;
    });
  }
}

// select component options.
const options = [
{
  label: 'Expedia Qeury With Sklearn',
  value: 'query1'
},
{
  label: 'Expedia Qeury With PyTorch',
  value: 'query2'
},
{
  label: 'Expedia Qeury With ONNX',
  value: 'query3'
},
{
  label: "User Define (Custom)",
  value: 'query0'
}];

// switch color setting
const railStyle = ({
  focused,
  checked
}) => {
  const style = {};
  if (!checked) {
    style.background = "#3da0ff";
    if (focused) {
      style.boxShadow = "0 0 0 2px #3da0ff40";
    }
  } else {
    style.background = "#42b983";
    if (focused) {
      style.boxShadow = "0 0 0 2px #42b98340";
    }
  }
  return style;
};

onMounted(() => {});

const reRender = () => {
  if (!activeSwitch.value && udf_plan_n.value) {
    udf_plan_n.value.setVal(code);
  }
  if (activeSwitch.value && udf_plan_o.value) {
    if (rewrite_on.value) {
      udf_plan_o.value.setVal(rewrite_code);
    } else {
      udf_plan_o.value.setVal(code);
    }
  }
  // reDraw echarts
  if (time_chart.value) {
    time_chart.value.reDraw(time_chart_data);
  }
  if (batch_chart.value) {
    batch_chart.value.reDraw(batch_chart_data);
  }
  if (efficient_chart.value) {
    efficient_chart.value.reDraw(efficient_chart_data);
  }

  if(!activeSwitch.value && naive_tree.value){
    naive_tree.value.Draw(naive_tree_data);
  }
  if(activeSwitch.value && opt_tree.value){
    if (adaptive_on.value) {
      opt_tree.value.Draw(opt_tree_data);
    } else {
      opt_tree.value.Draw(naive_tree_data);
    }
  }
};

const extractChartData = (rawData1, rawData2, colName) => {
  var x1_data = [];
  var x2_data = [];
  var y1_data = [];
  var y2_data = [];
  for (let i in rawData1) {
    x1_data.push(rawData1[i].no);
    y1_data.push(rawData1[i][colName]);
  }
  for (let i in rawData2) {
    x2_data.push(rawData2[i].no);
    y2_data.push(rawData2[i][colName]);
  }
  return {
    x: x1_data,
    y1: y1_data,
    y2: y2_data,
    titleText: "",
  };
};

const handleClick = () => {
  // submit a query and udf.
  loading.value = !loading.value;
  setTimeout(() => {
    loading.value = !loading.value;
    let base = showedQuery.analysis.naive;
    let comp = showedQuery.analysis.naive;
    if (rewrite_on.value && adaptive_on.value) {
      comp = showedQuery.analysis.opt_both;
    } else {
      if (rewrite_on.value) {
        comp = showedQuery.analysis.opt_1;
      } else {
        if (adaptive_on.value) {
          comp = showedQuery.analysis.opt_2;
        }
      }
    }

    // set code data here.
    code = base.function_code;
    rewrite_code = comp.function_code;
    
    //set tree data here.
    naive_tree_data = base.plan;
    opt_tree_data = comp.plan;

    // set total time here.
    if (!activeSwitch.value)
      naive_exec.value = Number(base.total).toFixed(2);
    else
      opt_exec.value = Number(comp.total).toFixed(2);
    
    // set chart data here.
    base.exec = base.exec.map((x) => {
      return { no: x.no, t: x.t, bs: x.bs, ef: (x.bs / x.t).toFixed(2) };
    });
    comp.exec = comp.exec.map((x) => {
      return { no: x.no, t: x.t, bs: x.bs, ef: (x.bs / x.t).toFixed(2) };
    });
    
    if (!activeSwitch.value) 
      vanilla_exec.value = base.exec;
    else 
      IMBridge_exec.value = comp.exec;

    batch_chart_data = extractChartData(vanilla_exec.value, IMBridge_exec.value, "bs");
    time_chart_data = extractChartData(vanilla_exec.value, IMBridge_exec.value, "t");
    efficient_chart_data = extractChartData(vanilla_exec.value, IMBridge_exec.value, "ef");
    // set execution process here
    if (!activeSwitch.value)
      exec_process_n.value = base.exec;
    else
      exec_process_o.value = comp.exec;

    // set result set here
    if (!activeSwitch.value) {
      vanilla_results_columns.value = base.result_cols;
      vanilla_results.value = base.result_rows;
    } else {
      IMBridge_results_columns.value = comp.result_cols;
      IMBridge_results.value = comp.result_rows;
    }
    reRender();
  }, 2000);
};


const handleSwitch = (value) => {
  offCheckbox = !value;
};

</script>

<style scoped>
.h2,
#title {
  margin-left: 5px;
  padding: 5px;
  font-weight: bold;
}
.chart {
  text-align: center;
}
</style>
