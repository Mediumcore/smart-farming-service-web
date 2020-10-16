<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <device-table/>
    </el-row>
  </div>

</template>

<script>
  import DeviceTable from './components/DeviceTable'

  export default {
    name: "DeviceManagement",
    components: {DeviceTable},
  }
</script>


