<template>
  <div>
    <el-form inline :model="listQuery" ref="queryForm" label-width="100px">
      <el-form-item label="设备名称" prop="name">
        <el-select v-model="listQuery.name"
                   :loading="deviceLoading"
                   filterable
                   remote
                   reserve-keyword
                   :remote-method="fetchDevices"
                   placeholder="请选择设备">
          <el-option
            v-for="item in devices"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <span>{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件类型" prop="type">
        <el-select v-model="listQuery.type"
                   placeholder="请选择事件类型"
                   :loading="eventTypeLoading"
                   @focus="fetchEventTypes">
          <el-option
            v-for="item in eventTypes"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
            <span>{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围" prop="rangeTime">
        <el-date-picker
          v-model="listQuery.rangeTime"
          :pickerOptions="pickerOptions"
          type="datetimerange"

          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFormReset">重置</el-button>
        <el-button type="primary" @click="fetchEvents">查询</el-button>
      </el-form-item>

    </el-form>
    <el-table :data="list" style="width: 100%;padding-top: 15px;" v-loading="listLoading">
      <el-table-column label="ID" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="事件类型" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.type.label }}
        </template>
      </el-table-column>
      <el-table-column label="事件内容" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.body }}
        </template>
      </el-table-column>
      <el-table-column label="所属设备" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.device.name }}
        </template>
      </el-table-column>
      <el-table-column label="产生时间" min-width="100">
        <template slot-scope="scope">
          <span
            v-if="scope.row.created!==null">{{ $moment(scope.row.created).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="fetchEvents"/>

  </div>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import {getDevices} from "@/api/devicemgr";
  import {getEvents, getEventTypes} from "@/api/eventmgr";

  export default {
    name: "EventTable",
    components: {Pagination},
    data() {
      return {
        list: null,
        total: 10,
        listLoading: true,
        listQuery: {
          rangeTime: '',
          page: 1,
          limit: 10
        },
        deviceLoading: false,
        eventTypeLoading: false,
        devices: [],
        eventTypes: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
      this.fetchEvents()
    },
    methods: {
      /**
       * 获取事件类型列表
       */
      fetchEvents() {
        this.listLoading = true
        let startTime, endTime = null

        if (this.listQuery.rangeTime.length > 1) {
          startTime = this.listQuery.rangeTime[0].getTime()
          endTime = this.listQuery.rangeTime[1].getTime()
        }
        getEvents(this.listQuery.name,
          this.listQuery.type,
          startTime,
          endTime,
          this.listQuery.page,
          this.listQuery.limit).then(res => {
          let data = res['data']
          this.list = data['list']
          this.total = data['total']
        }).finally(() => {
          this.listLoading = false
        })
      },
      /**
       * 获取事件类型列表
       */
      fetchEventTypes() {
        if (this.eventTypes.length > 0) return
        this.eventTypeLoading = true
        getEventTypes().then(res => {
          this.eventTypes = res['data']['list']
          this.eventTypeLoading = false
        })
      },
      /**
       * 获取设备列表
       */
      fetchDevices(query) {
        if (query !== '') {
          this.deviceLoading = true
          getDevices(1, 20, query, '').then(res => {
            this.devices = res['data']['list']
            this.deviceLoading = false
          })
        }

      },
      handleFormReset() {
        this.$refs['queryForm'].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
