<template>
  <div class="dashboard-editor-container">

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-row>
        <el-button type="primary" @click="handleDrawDialogOpen('')">绘制路线</el-button>
        <el-button type="primary" @click="dialogImportVisible=true">导入路线</el-button>
        <el-button type="primary" @click="dialogKMLVisible=true">上传KML</el-button>
      </el-row>
      <el-row style="margin-top: 10px" :gutter="15" class="route-box">
        <el-col :sm="24" :md="12" :lg="8" v-for="(item, index) in list" :key="item.id" style="margin-bottom: 10px">
          <el-card :body-style="{ padding: '0',height: '400px' }">
            <div style="height: 320px;" :id="'route-map-'+item.id">

            </div>
            <div style="padding: 14px;">
              <span>{{ item.name }}</span>
              <div class="bottom clearfix" style="margin-top: 5px">
                <el-button type="default" size="mini" plain @click="handleRouteExport(item.id)">下载</el-button>
                <el-button type="primary" size="mini" plain @click="handleDrawDialogOpen(item)">编辑</el-button>
                <el-button type="danger" size="mini" plain @click="handleRouteDelete(item.id)">删除</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <pagination v-show="total>0" :total="total" :page-sizes="[6, 12, 24, 48]" :page.sync="listQuery.page"
                    :limit.sync="listQuery.limit"
                    @pagination="fetchRoutes"/>
      </el-row>

      <!--  导入txt Dialog -->
      <el-dialog title="导入路线" :visible.sync="dialogImportVisible">
        <el-input v-model="importData.name" placeholder="请输入路线名称"></el-input>
        <el-upload
          ref="importFile"
          drag
          action="/api/v1/devicemgr/traceroute/import"
          :data="importData"
          :limit=1
          :before-upload="handleBeforeImport"
          :on-success="handleImportSuccess"
          :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传Text文件，且不超过1MB</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogImportVisible = false">取 消</el-button>
          <el-button style="margin-left: 10px;" type="success" @click="confirmImport">上传</el-button>
        </div>

      </el-dialog>

      <!--  上传KML Dialog -->
      <el-dialog title="上传KML" :visible.sync="dialogKMLVisible">
        <el-upload
          ref="uploadFile"
          drag
          action="/api/v1/devicemgr/traceroute/kml/upload"
          :limit=1
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传kml文件，且不超过1MB</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogKMLVisible = false">取 消</el-button>
          <el-button style="margin-left: 10px;" type="success" @click="confirmUpload">上传</el-button>
        </div>

      </el-dialog>

      <!--  绘制路线 Dialog -->
      <el-dialog title="绘制路线" :visible.sync="dialogDrawVisible" :fullscreen="true">
        <el-form :inline="true" :model="drawLineForm" :rules="drawLineRules" ref="drawParamForm">
          <el-form-item label="路线名称" prop="name">
            <el-input v-model="drawLineForm.name" placeholder="请输入路线名称"></el-input>
          </el-form-item>
          <el-form-item label="作业机械">
            <el-select v-model="drawLineForm.device"
                       :loading="deviceLoading"
                       filterable
                       remote
                       reserve-keyword
                       @focus="fetchDevices('')"
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
        </el-form>
        <el-table
          :data="drawLines"
          :height="winHeight-300"
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index">
          </el-table-column>
          <el-table-column
            label="经度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lng"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="纬度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lat"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="定位时间">
            <template slot-scope="scope">
              <span>{{ scope.row.created }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="small" @click="drawLineDemarcate(scope.row)">标定</el-button>
              <el-button size="small" type="primary" @click="drawLineInsert(scope.$index)">插入</el-button>
              <el-button size="small" type="danger" @click="drawLineDelete(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDrawVisible = false">取 消</el-button>
          <el-button style="margin-left: 10px;" type="primary" @click="drawLinesSave">保存</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import map_transform from "../../utils/map-transform";
import Pagination from "@/components/Pagination/index";
import {exportTraceRoute, getTraceRoutes, removeTraceRoute, saveTraceRoute} from "@/api/traceroute";
import {getDevices} from "@/api/devicemgr";
import {getLastEvent} from "@/api/eventmgr";

export default {
  name: "track-route",
  components: {Pagination},
  data() {
    return {
      list: [],
      total: 10,
      listQuery: {
        name: '',
        page: 1,
        limit: 6
      },
      drawLineForm: {
        name: '',
        device: ''
      },
      drawEdit: {
        id: '',
        center: ''
      },
      drawLineRules: {
        name: [
          {required: true, message: '请输入路线名称', trigger: 'blur'}
        ],
      },
      drawLines: [],
      devices: [],
      deviceLoading: false,
      winHeight: window.innerHeight,
      dialogImportVisible: false,
      importData: {
        name: ''
      },
      dialogKMLVisible: false,
      dialogDrawVisible: false
    }
  },
  created() {
    this.fetchRoutes()
  },
  mounted() {
    const _this = this
    window.onresize = () => {
      _this.winHeight = window.innerHeight
    }
  },
  methods: {
    /**
     * 获取所有的路线
     */
    fetchRoutes() {
      let loading
      this.$nextTick(() => {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          fullscreen: false,
          target: document.querySelector('.route-box')
        });
      });
      getTraceRoutes(this.listQuery.name,
        this.listQuery.page === -1 ? this.total : this.listQuery.page,
        this.listQuery.limit).then(res => {
        let data = res['data']
        this.list = data['list']
        this.total = data['total']

        // 重新绘制路线
        this.$nextTick(() => {
          setTimeout(() => {
            if (loading) {
              loading.close()
            }
            this.drawRouteMap()
          }, 100)
        })
      })
    },
    /**
     * 绘制路线地图
     */
    drawRouteMap() {
      this.list.forEach(route => {
        let mapId = "route-map-" + route.id
        let locations = route.locations
        let center = route.center ? route.center : locations[0]
        let map = new AMap.Map(mapId, {
          center: map_transform['a_wgs2gcj'](center),
          resizeEnable: true,
          layers: [new AMap.TileLayer.Satellite()],
          zoom: 17
        });

        // 同时引入工具条插件，比例尺插件和鹰眼插件
        AMap.plugin([
          'AMap.MapType'
        ], function () {
          // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
          map.addControl(new AMap.MapType());
        });
        // 画路线
        new AMap.Polyline({
          map: map,
          path: locations.map(l => map_transform['a_wgs2gcj'](l)),
          showDir: true,
          strokeColor: "#28F",  //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          // strokeStyle: "solid"  //线样式
        });
      })
    },

    handleBeforeImport(file) {
      if(this.importData.name===''){
         this.$message.error('路线名称不能为空')
        return false;
      }
      var isTxt = file.name.substring(file.name.lastIndexOf('.') + 1) === 'txt'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isTxt) {
        this.$message.error('请上传格式为.txt的文件')
        return false
      }
      if (!isLt1M) {
        return this.$message.error('文件大小不能超过 1MB!')
      }
      return isTxt && isLt1M
    },

    handleImportSuccess(res, file) {
      if (res.code === 0) {
        this.$message.success('上传成功！')
        this.fetchRoutes()
        this.dialogImportVisible = false
      }else{
            this.$message.error('上传失败!'+res.msg)
      }
    },

    confirmImport() {
      if (this.$refs.importFile.uploadFiles.length > 0) {
        this.$refs.importFile.submit()
      } else {
        this.$message.error('未选择上传文件！请选择！')
      }
    },

    handleBeforeUpload(file) {
      var isXlsx = file.name.substring(file.name.lastIndexOf('.') + 1) === 'kml'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isXlsx) {
        this.$message.error('请上传格式为.kml的文件')
        return false
      }
      if (!isLt1M) {
        return this.$message.error('文件大小不能超过 1MB!')
      }
      return isXlsx && isLt1M
    },

    handleUploadSuccess(res, file) {
      if (res.code === 0) {
        this.$message.success('上传成功！')
        this.fetchRoutes()
        this.dialogKMLVisible = false
      }
    },

    confirmUpload() {
      if (this.$refs.uploadFile.uploadFiles.length > 0) {
        this.$refs.uploadFile.submit()
      } else {
        this.$message.error('未选择上传文件！请选择！')

      }
    },

    handleRouteDelete(routeId) {
      this.$confirm('此操作将永久删除当前寻迹路线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeTraceRoute(routeId).then(res => {
          this.fetchRoutes()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        })
      }).catch(() => {
      });
    },
    /**
     * 打开绘制路线的Dialog
     * @param route
     */
    handleDrawDialogOpen(route) {
      this.dialogDrawVisible = true
      if (route) {
        // 修改路线
        this.drawEdit.id = route.id
        this.drawEdit.center = route.center
        this.drawLineForm.name = route.name
        this.drawLines = []
        for (const location of route.locations) {
          this.drawLines.push({
            lng: location[0],
            lat: location[1]
          })
        }
      } else {
        // 新增路线
        this.$nextTick(() => {
          this.$refs['drawParamForm'].resetFields()
        })
        this.drawLines.push({
          lng: '',
          lat: '',
          created: ''
        })
      }
    },
    drawLineDemarcate(row) {
      if (!this.drawLineForm.device) {
        this.$message({
          type: 'error',
          message: '请选择作业机械!'
        });
        return
      }
      getLastEvent(this.drawLineForm.device, 'location').then(res => {
        let data = res['data']
        let body = JSON.parse(data['body'])
        row.created = data['created']
        row.lat = body['lat']
        row.lng = body['lng']
      })
    },
    drawLineInsert(index) {
      this.drawLines.splice(index + 1, 0, {
        lng: '',
        lat: '',
        created: ''
      })
    },
    drawLineDelete(index) {
      if (this.drawLines.length === 1) {
        this.$message({
          type: 'error',
          message: '至少保留1个点!'
        });
        return
      }
      this.drawLines.splice(index, 1)
    },
    drawLinesSave() {
      this.$refs['drawParamForm'].validate((valid) => {
        if (valid) {
          let lines = []
          for (let i = 0; i < this.drawLines.length; i++) {
            const item = this.drawLines[i]
            if (!item.lng || !item.lat) {
              // 校验数组
              this.$message({
                type: 'error',
                message: '存在未填写的经纬度，请检查并填写，序号：' + i + '。'
              });
              return
            } else if (item.lng) {
              lines.push([parseFloat(item.lng), parseFloat(item.lat)])
            }
          }
          saveTraceRoute({
            name: this.drawLineForm.name,
            center: this.drawEdit.center ? this.drawEdit.center : lines[0],
            locations: lines,
            id: this.drawEdit.id ? this.drawEdit.id : null
          }).then(res => {
            console.log(res)
            this.dialogDrawVisible = false
            this.fetchRoutes()
          })
        } else {
          this.$message({
            type: 'error',
            message: '请输入路线名称!'
          });
        }
      });
    },

    /**
     * 获取设备列表
     */
    fetchDevices(query) {
      this.deviceLoading = true
      getDevices(1, 20, query, 'machinery').then(res => {
        this.devices = res['data']['list']
        this.deviceLoading = false
      })
    },
    handleRouteExport(routeId) {
      window.location.href = "/api/v1/devicemgr/traceroute/" + routeId + "/export"
    }

  }
}
</script>

<style scoped>

</style>
