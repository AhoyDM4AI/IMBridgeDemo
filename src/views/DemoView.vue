<template>
  <main>
    <n-layout has-sider>
      <n-layout-sider bordered :width="443" style="background: rgb(234,238,243);">
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
            :lines="22"
            :lang="'python'"
            :readonly="false"
            fontsize="10"
            ref="udf_editor"
          />
          <div style="padding: 3px; padding-top: 8px">
            <n-flex justify="end">
              <div style="display: flex; align-items: center">
                <n-grid :y-gap="8" :x-gap="4" :cols="2">
                  <n-gi>
                    <n-checkbox
                      v-model:checked="rewrite_on"
                      label="Hoisting Rewrite"
                    />
                  </n-gi>
                  <n-gi>
                    <n-checkbox
                      v-model:checked="adaptive_on"
                      label="Adaptive Batch Size"
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
      <n-layout-content
        bordered
        content-style="padding: 10px;"
        style="height: 93vh;background: rgb(234,238,243);"
      >
        <h2 id="title">Analysis Report</h2>
        <n-spin :show="loading" size="large">
          <n-collapse
            style="padding-left: 6px; padding-top: 4px"
            :default-expanded-names="['1', '4']"
          >
            <n-collapse-item
              title="Prediction Function Code"
              @click="handleReset"
              name="1"
            >
              <n-flex>
                <n-card id="plan" title="Naive Code:">
                  <CodeEditor
                    :lines="15"
                    :lang="'python'"
                    :readonly="true"
                    fontsize="10"
                    ref="udf_plan_n"
                  />
                </n-card>
                <n-card id="plan" title="Rewritten Code:">
                  <CodeEditor
                    :lines="15"
                    :lang="'python'"
                    :readonly="true"
                    fontsize="10"
                    ref="udf_plan_o"
                  />
                </n-card>
              </n-flex>
            </n-collapse-item>
            <n-collapse-item title="Prediction Query Plan" name="2">
              <n-flex>
                <n-card id="plan" title="Naive Plan:">
                  <PlanTree />
                </n-card>
                <n-card id="plan" title="Optimized Plan:">
                  <PlanTree />
                </n-card>
              </n-flex>
            </n-collapse-item>
            <n-collapse-item title="Execution Process" name="3">
              <n-flex vertical>
                <n-h3 style="margin-left: 24px;margin-bottom: 10px;">
                  Elapsed Time (naive/opt): {{ naive_exec }}s/{{ opt_exec }}s
                </n-h3>
                <n-flex>
                  <n-card id="plan" title="Naive Execution">
                    <ExecutionProcess></ExecutionProcess>
                  </n-card>
                  <n-card id="plan" title="Optimized Execution">
                    <ExecutionProcess></ExecutionProcess>
                  </n-card>
                </n-flex>
              </n-flex>
            </n-collapse-item>
            <n-collapse-item title="Result Set" name="4">
              <ResultSet />
            </n-collapse-item>
          </n-collapse>
        </n-spin>
      </n-layout-content>
    </n-layout>
  </main>
</template>

<script setup>
import ResultSet from "../components/ResultSet.vue";
import CodeEditor from "../components/CodeEditor.vue";
import ExecutionProcess from "../components/ExecutionProcess.vue";
import PlanTree from "../components/PlanTree.vue";
import { ref, onMounted } from "vue";
import { input, analysis } from "../data/q1/staff";

const query_editor = ref(null);
const udf_editor = ref(null);
const udf_plan_n = ref(null);
const udf_plan_o = ref(null);

let rewrite_on = ref(false);
let adaptive_on = ref(false);
let loading = ref(false);
let naive_exec = ref(100);
let opt_exec = ref(100);

let code = "",
  rewrite_code = "";

onMounted(() => {
  query_editor.value.setVal(input.query);

  udf_editor.value.setVal(input.udf);

  udf_plan_n.value.setVal(analysis.naive.function);

  udf_plan_o.value.setVal(analysis.opt.function);
});

const handleClick = () => {
  // submit a query and udf.
  loading.value = !loading.value;
  console.log(udf_editor.value.getVal());
  setTimeout(() => {
    loading.value = !loading.value;
  }, 8000);
  console.log(input);
};

const handleReset = () => {
  code = analysis.naive.function
  rewrite_code = analysis.opt.function
  console.log(udf_plan_n.value.setVal(code));
  console.log(udf_plan_o.value.setVal(rewrite_code));
};
</script>

<style scoped>
.h2,
#title {
  margin-left: 5px;
  padding: 5px;
  font-weight: bold;
}
#plan {
  max-width: 465px;
}
</style>
