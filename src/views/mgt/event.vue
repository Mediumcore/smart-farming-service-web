<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <event-table/>
    </el-row>
  </div>
</template>

<script>
  import EventTable from './components/EventTable'

  export default {
    name: "EventManagement",
    components: {EventTable},
  }
</script>

<style scoped>

</style>
