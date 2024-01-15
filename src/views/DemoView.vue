<template>
  <main>
    <n-spin :show="loading" size="large">
      <n-layout has-sider>
        <n-layout-sider
          bordered
          :width="443"
          style="background: rgb(234, 238, 243)"
        >
          <div>
            <h2 id="title">Query Editor</h2>
            <CodeEditor
              :lines="10"
              :lang="'sql'"
              :readonly="false"
              fontsize="12"
              ref="query_editor"
            />
          </div>
          <n-divider />
          <div>
            <h2 id="title">Function Editor</h2>
            <CodeEditor
              :lines="20"
              :lang="'python'"
              :readonly="false"
              fontsize="12"
              ref="udf_editor"
            />
            <div style="padding: 3px; padding-top: 8px">
              <n-flex justify="end">
                <div style="display: flex; align-items: center">
                  <n-grid :y-gap="8" :x-gap="4" :cols="2">
                    <n-gi>
                      <n-checkbox
                        v-model:checked="rewrite_on"
                        label="Function Rewrite"
                      />
                    </n-gi>
                    <n-gi>
                      <n-checkbox
                        v-model:checked="adaptive_on"
                        label="Adaptive Batching"
                      />
                    </n-gi>
                  </n-grid>
                </div>
              </n-flex>
              <n-flex justify="end" style="padding: 10px">
                <n-button
                  type="info"
                  size="medium"
                  :disabled="loading"
                  @click="handleClick"
                  >Deploy&Run</n-button
                >
              </n-flex>
            </div>
          </div>
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
                  <n-card id="plan" title="Naive Code:">
                    <n-image width="80" src="/src/assets/all.svg" />
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
                  <n-card id="plan" title="Rewritten Code:">
                    <n-image
                      v-if="rewrite_on"
                      width="53"
                      src="/src/assets/rewrite.svg"
                    />
                    <n-image v-else width="80" src="/src/assets/all.svg" />
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
                  <n-card id="plan" title="Naive Plan:">
                    <PlanTree content="naive_plan" ref="naive_tree" />
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="plan" title="Optimized Plan:">
                    <PlanTree content="opt_plan" :isOpt="true" ref="opt_tree" />
                  </n-card>
                </n-gi>
              </n-grid>
            </n-collapse-item>
            <n-collapse-item title="Execution Process" name="3">
              <n-h3 style="margin-left: 12px; margin-bottom: 10px">
                Total Elapsed Time (naive/opt): {{ naive_exec }}s/{{
                  opt_exec
                }}s
              </n-h3>
              <n-grid x-gap="12" y-gap="12" :cols="2">
                <n-gi>
                  <n-card id="plan" title="Naive Execution">
                    <ExecutionProcess :data="exec_process_n"></ExecutionProcess>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="plan" title="Optimized Execution">
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
              <ResultSet :columns="results_columns" :data="results" />
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
import { q1 } from "../data/q1/staff";
import { q2 } from "../data/q2/staff";

const query_editor = ref(null);
const udf_editor = ref(null);
const udf_plan_n = ref(null);
const udf_plan_o = ref(null);

const batch_chart = ref(null);
const time_chart = ref(null);
const efficient_chart = ref(null);

let rewrite_on = ref(false);
let adaptive_on = ref(false);

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

const results_columns = ref([]);
const results = ref([]);

const showedQuery = q1;

onMounted(() => {
  query_editor.value.setVal(showedQuery.input.query);
  udf_editor.value.setVal(showedQuery.input.udf);
});

const reRender = () => {
  if (udf_plan_n.value) {
    udf_plan_n.value.setVal(code);
  }
  if (udf_plan_o.value) {
    if (rewrite_on.value) {
      udf_plan_o.value.setVal(rewrite_code);
    } else {
      udf_plan_o.value.setVal(code);
    }
  }
  if (time_chart.value) {
    time_chart.value.reDraw(time_chart_data);
  }
  if (batch_chart.value) {
    batch_chart.value.reDraw(batch_chart_data);
  }
  if (efficient_chart.value) {
    efficient_chart.value.reDraw(efficient_chart_data);
  }
  if(naive_tree.value){
    naive_tree.value.Draw(naive_tree_data);
  }
  if(opt_tree.value){
    opt_tree.value.Draw(opt_tree_data);
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
  let win_len =
    x1_data.length < x2_data.length ? x1_data.length : x2_data.length;
  win_len = win_len <= 50 ? win_len : 50;
  return {
    x: x1_data.slice(0, win_len),
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
    code = base.function;
    rewrite_code = comp.function;

    //set tree data here.
    naive_tree_data = base.plan;
    opt_tree_data = comp.plan;

    // set total time here.
    naive_exec.value = Number(base.total).toFixed(2);
    opt_exec.value = Number(comp.total).toFixed(2);

    // set chart data here.
    base.exec = base.exec.map((x) => {
      return { no: x.no, t: x.t, bs: x.bs, ef: (x.bs / x.t).toFixed(2) };
    });
    comp.exec = comp.exec.map((x) => {
      return { no: x.no, t: x.t, bs: x.bs, ef: (x.bs / x.t).toFixed(2) };
    });
    batch_chart_data = extractChartData(base.exec, comp.exec, "bs");
    time_chart_data = extractChartData(base.exec, comp.exec, "t");
    efficient_chart_data = extractChartData(base.exec, comp.exec, "ef");
    // set execution process here
    exec_process_n.value = base.exec;
    exec_process_o.value = comp.exec;

    // set result set here
    results_columns.value = q1.result_set.result_cols;
    results.value = q1.result_set.result_rows;
    reRender();
  }, 5000);
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
