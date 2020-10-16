<template>
  <div class="dashboard-editor-container">
    <panel-group/>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div align="center">设备连接记录</div>
      <record-table/>
    </el-row>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import PanelGroup from './components/PanelGroup'
import RecordTable from './components/RecordTable'
import {setToken} from '@/utils/auth' // get token from cookie

export default {
  name: 'Dashboard',
  components: {PanelGroup, RecordTable},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
