<template>
  <div>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column label="ID" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.device.name }}
        </template>
      </el-table-column>
      <el-table-column label="设备类型" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.device.type.label }}
        </template>
      </el-table-column>
      <el-table-column label="设备IP" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.ipaddress }}
        </template>
      </el-table-column>
      <el-table-column label="上线时间" min-width="200">
        <template slot-scope="scope">
          {{ $moment(scope.row.onlineTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="下线时间" min-width="200">
        <template slot-scope="scope">
          {{ $moment(scope.row.offlineTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="fetchData"/>
  </div>


</template>

<script>
  import Pagination from '@/components/Pagination'
  import {getDeviceRecords} from '@/api/devicemgr'

  export default {
    components: {Pagination},
    data() {
      return {
        list: null,
        total: 10,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        getDeviceRecords(this.listQuery.page, this.listQuery.limit).then(res => {
          let data = res['data']
          this.list = data['list']
          this.total = data['total']
        })
      }
    }
  }
</script>
