<template>
  <div>
    <el-button class="filter-item" type="primary" icon="el-icon-plus"
               @click="handleAddDialog">
      添加设备
    </el-button>
    <el-table :data="list" style="width: 100%;padding-top: 15px;" v-loading="listLoading">
      <el-table-column label="ID" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="设备类型" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.type.label }}
        </template>
      </el-table-column>
      <el-table-column label="设备描述" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="设备IP" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.ipaddress }}
        </template>
      </el-table-column>
      <el-table-column label="上线时间" min-width="100">
        <template slot-scope="scope">
          <span
            v-if="scope.row.onlineTime!==null">{{ $moment(scope.row.onlineTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下线时间" min-width="100">
        <template slot-scope="scope">
          <span
            v-if="scope.row.offlineTime!==null">{{ $moment(scope.row.offlineTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button size="small" @click="handleViewCert(scope.row.id)">凭证</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="fetchDevices"/>

    <!-- 新增或编辑设备Dialog -->
    <el-dialog :title="isDeviceEdit?'修改设备':'添加设备'" :visible.sync="dialogDeviceEditVisible">
      <el-form :model="deviceEditForm" :rules="deviceEditFormRules" ref="deviceEditForm" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="deviceEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="deviceEditForm.type" placeholder="请选择设备类型" :disabled="isDeviceEdit">
            <el-option
              v-for="item in deviceTypes"
              :key="item.id"
              :label="item.label"
              :value="item.type"
            >
              <span>{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备描述">
          <el-input v-model="deviceEditForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeviceEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDeviceSave">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看凭证Dialog -->
    <el-dialog title="设备凭证" :visible.sync="dialogCertVisible">
      {{ certificate }}
    </el-dialog>
  </div>

</template>

<script>
  import Pagination from '@/components/Pagination'
  import {getDevices, getDeviceTypes, getDeviceCertificate, editDevice, addDevice, removeDevice} from '@/api/devicemgr'

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
        deviceTypes: [],
        dialogDeviceEditVisible: false,
        dialogCertVisible: false,
        certificate: '',
        isDeviceEdit: false,
        deviceEditForm: {
          id: '',
          name: '',
          type: '',
          desc: ''
        },
        deviceEditFormRules: {
          name: [
            {required: true, message: '请输入设备名称', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择设备类型', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.fetchDevices()
      this.fetchDeviceTypes()
    },
    methods: {
      /**
       * 获取设备列表
       */
      fetchDevices() {
        this.listLoading = true
        getDevices(this.listQuery.page, this.listQuery.limit).then(res => {
          let data = res['data']
          this.list = data['list']
          this.total = data['total']
        }).finally(() => {
          this.listLoading = false
        })
      },
      /**
       * 获取设备类型
       */
      fetchDeviceTypes() {
        getDeviceTypes().then(res => {
          this.deviceTypes = res['data']['list']
        })
      },
      /**
       * 添加设备Dialog
       */
      handleAddDialog() {
        this.isDeviceEdit = false;
        // 初始化表单
        this.deviceEditForm.desc = ''
        this.deviceEditForm.name = ''
        this.deviceEditForm.type = this.deviceTypes.length > 0 ? this.deviceTypes[0]['type'] : ''
        this.dialogDeviceEditVisible = true
      },
      /**
       * 查看凭证
       * @param deviceId
       */
      handleViewCert(deviceId) {
        getDeviceCertificate(deviceId).then(res => {
          this.certificate = res['data']['ciphertext']
          this.dialogCertVisible = true
        })
      },
      /**
       * 修改设备
       * @param row
       */
      handleEdit(row) {
        this.isDeviceEdit = true
        this.deviceEditForm.name = row.name
        this.deviceEditForm.desc = row.description
        this.deviceEditForm.type = row.type.type
        this.deviceEditForm.id = row.id
        this.dialogDeviceEditVisible = true
      },
      /**
       * 保存设备
       */
      handleDeviceSave() {
        this.$refs['deviceEditForm'].validate((valid) => {
          if (valid) {
            if (this.isDeviceEdit) {
              editDevice(this.deviceEditForm.id,
                this.deviceEditForm.name,
                this.deviceEditForm.desc,
                this.deviceEditForm.type).then(res => {
                this.fetchDevices()
                this.dialogDeviceEditVisible = false
              })
            } else {
              addDevice(this.deviceEditForm.name,
                this.deviceEditForm.desc,
                this.deviceEditForm.type).then(res => {
                this.fetchDevices()
                this.dialogDeviceEditVisible = false
              })
            }
          }
        });
      },
      /**
       * 删除设备
       * @param deviceId
       */
      handleDelete(deviceId) {
        this.$confirm('此操作将永久删除该设备，并清除该设备的所有事件及指令, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeDevice(deviceId).then(res => {
            this.fetchDevices()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

          })
        }).catch(() => {
        });
      }
    }
  }
</script>
