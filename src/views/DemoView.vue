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
            :default-expanded-names="['1', '4']"
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
                    <PlanTree />
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="plan" title="Optimized Plan:">
                    <PlanTree />
                  </n-card>
                </n-gi>
              </n-grid>
            </n-collapse-item>
            <n-collapse-item title="Execution Process" name="3">
              <n-h3 style="margin-left: 12px; margin-bottom: 10px">
                Elapsed Time (naive/opt): {{ naive_exec }}s/{{ opt_exec }}s
              </n-h3>
              <n-grid x-gap="12" y-gap="12" :cols="2">
                <n-gi>
                  <n-card id="plan" title="Naive Execution">
                    <ExecutionProcess :data="exec_process_n" ></ExecutionProcess>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card id="plan" title="Optimized Execution">
                    <ExecutionProcess :data="exec_process_o" ></ExecutionProcess>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card title="Batch Size Comparison">
                    <ExecutionChart
                      chart_id="batch"
                      ref="batch_chart"
                      yName="Batch Size"
                    ></ExecutionChart>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card title="Predition Time Comparison">
                    <ExecutionChart
                      chart_id="timing"
                      yName="Prediction Time (ms)"
                      ref="time_chart"
                    ></ExecutionChart>
                  </n-card>
                </n-gi>
              </n-grid>
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

const query_editor = ref(null);
const udf_editor = ref(null);
const udf_plan_n = ref(null);
const udf_plan_o = ref(null);

const batch_chart = ref(null);
const time_chart = ref(null);

let rewrite_on = ref(false);
let adaptive_on = ref(false);

let loading = ref(false);

let naive_exec = ref(0);
let opt_exec = ref(0);

let code = "",
  rewrite_code = "";

let batch_chart_data = null;
let time_chart_data = null;

const exec_process_n = ref([]);
const exec_process_o = ref([]);

const results_columns = ref([]);
const results = ref([]);

onMounted(() => {
  query_editor.value.setVal(q1.input.query);
  udf_editor.value.setVal(q1.input.udf);
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
};

const handleClick = () => {
  // submit a query and udf.
  loading.value = !loading.value;
  setTimeout(() => {
    loading.value = !loading.value;

    // set code data here.
    code = q1.analysis.naive.function;
    rewrite_code = q1.analysis.opt.function;
    // set chart data here.
    batch_chart_data = {
      x: [1, 2],
      y1: [1, 2],
      y2: [1, 4],
      titleText: "",
    };
    time_chart_data = {
      x: [1, 2],
      y1: [1, 4],
      y2: [256, 3000],
      titleText: "",
    };
    exec_process_n.value = [
      { no: "Name", bs: "address", t: "tags" },
      { no: "Name", bs: "address", t: "tags" },
    ];
    exec_process_o.value = [
      { no: "Name", bs: "address", t: "tags" },
      { no: "Name", bs: "address", t: "tags" },
    ];
    results_columns.value = [
      {
        title: "prop_id",
        key: "prop_id",
      },
      {
        title: "price_usd",
        key: "price_usd",
      },
      {
        title: "count_bookings",
        key: "count_bookings",
      },
      {
        title: "count_clicks",
        key: "count_clicks",
      },
    ];
    results.value = [
      {
        prop_id: "94330",
        price_usd: "80",
        count_bookings: "33",
        count_clicks: "48",
      },
    ];
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
</style>
