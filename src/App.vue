<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div>
    <n-config-provider :hljs="hljs">
    <n-layout>
          <n-layout-header bordered style="background: rgb(219,223,227)">
            <h1 style="margin-left:5px; font-weight: bold;">IMPEX Demonstration</h1>
          </n-layout-header>
          <n-layout-content bordered>
            <RouterView/>
          </n-layout-content>
          <n-layout-footer bordered style="text-align: center;">IMPEX DEMO</n-layout-footer>
    </n-layout>
    </n-config-provider>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import hljs from 'highlight.js/lib/core'
  import python from 'highlight.js/lib/languages/python'

  hljs.registerLanguage('python', python)

  export default defineComponent({
    setup() {
      return {
        hljs
      }
    }
  })
</script>