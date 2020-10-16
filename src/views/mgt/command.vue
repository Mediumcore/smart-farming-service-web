<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <command-table/>
    </el-row>
  </div>
</template>

<script>
  import CommandTable from './components/CommandTable'

  export default {
    name: "CommandManagement",
    components: {CommandTable},
  }
</script>

<style scoped>

</style>
