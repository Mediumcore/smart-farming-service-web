<template>
  <div>

    <div class="dashboard-editor-container">
      <el-row style="background: white">
        <el-row style="margin: 10px" :gutter="10">
          <el-col :lg="3">
            <el-select v-model="controllerDeviceId"
                       :loading="controllerDeviceLoading"
                       filterable
                       remote
                       reserve-keyword
                       :remote-method="fetchControllerDevices"
                       @focus="fetchControllerDevices('')"
                       placeholder="请选择控制设备">
              <el-option
                v-for="item in operationDevices"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :lg="3">
            <el-select v-model="operationDeviceId"
                       :loading="operationDeviceLoading"
                       filterable
                       remote
                       reserve-keyword
                       :remote-method="fetchOptionDevices"
                       @focus="fetchOptionDevices('')"
                       placeholder="请选择作业设备">
              <el-option
                v-for="item in operationDevices"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :lg="2" style="margin-top: 3px">
            <el-button :type="connectBtnOptions[isConnect].color" size="small" @click="handleConnect">{{
                connectBtnOptions[isConnect].text
              }}
            </el-button>
          </el-col>
          <el-col :lg="6" style="margin-top: 3px">
            <el-divider direction="vertical"></el-divider>
            <el-button type="success" plain size="small" @click="handleTraceDialog"
                       :disabled="!isConnect||tracking.disabled">循迹
            </el-button>
<!--            <el-button type="primary" plain size="small" @click="handleParallelDrive"-->
<!--                       :disabled="!isConnect||operating.disabled">驾驶-->
<!--            </el-button>-->
            <el-button type="warning" plain size="small" @click="handleStandby"
                       :disabled="!isConnect||standby.disabled">停止
            </el-button>
<!--            <el-button type="danger" plain size="small" @click="handleShutdown"-->
<!--                       :disabled="!isConnect||shutdown.disabled">关机-->
<!--            </el-button>-->
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <div style="margin-top: 10px;float: right;margin-right: 10px">
            <el-tooltip content="设备状态" placement="bottom" effect="light">
              <span style="color: #909399" class="metric-icon"><svg-icon icon-class="status"/> {{
                  deviceState.label
                }}</span>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="设备模式" placement="bottom" effect="light">
              <span style="color: #909399;" class="metric-icon"><svg-icon icon-class="model"/> {{ controlModel.label }}</span>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="信号延迟" placement="bottom" effect="light">
              <span style="color: #909399" class="metric-icon"><svg-icon icon-class="single"/> {{ signal }}ms</span>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="GPS强度" placement="bottom" effect="light">
              <span style="color: #909399" class="metric-icon"><svg-icon icon-class="gps"/> {{ gps }}</span>
            </el-tooltip>


          </div>

        </el-row>
      </el-row>
      <el-row :style="{height:winHeight-192+'px'}">
        <el-col :lg="19">
          <el-tabs tab-position="bottom" style=" background: white" :stretch="true">
            <el-tab-pane label="实时地图" :style="{height:winHeight-240+'px'}">
              <real-time-map :cId="channelId+'-map'"></real-time-map>
            </el-tab-pane>
            <el-tab-pane label="循迹路线" :style="{height:winHeight-240+'px'}">
              <trace-monitor :cId="channelId+'-trace'"></trace-monitor>
            </el-tab-pane>
            <el-tab-pane label="监控视频" :style="{height:winHeight-240+'px'}">
              <video-monitor :cId="channelId+'-video'"></video-monitor>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :lg="5" style="height: 100%;overflow-y: auto">
<!--          <el-row style="height: 220px; margin: 6px">-->
<!--            <div class="metric-chart" id="leftVelocityChart"></div>-->
<!--          </el-row>-->
<!--          <el-row style="height: 220px; margin: 6px">-->
<!--            <div class="metric-chart" id="rightVelocityChart"></div>-->
<!--          </el-row>-->
          <el-row style="height: 220px; margin: 6px">
            <div class="metric-chart" id="velocityChart"></div>
          </el-row>
          <el-row style="height: 220px; margin: 6px">
            <div class="metric-chart" id="steeringChart"></div>
          </el-row>
        </el-col>

      </el-row>

    </div>
    <!-- 循迹路线下发Dialog -->
    <el-dialog title="循迹路线下发" :visible.sync="tracking.dialog">
      <el-form :model="tracking" :rules="trackingFormRules" ref="trackingForm">
        <el-form-item label="循迹速度" prop="speed">
          <el-input v-model="tracking.speed"></el-input>
        </el-form-item>
        <el-form-item label="循迹路线" prop="route">
          <el-select v-model="tracking.route" placeholder="请选择循迹路线">
            <el-option
              v-for="item in tracking.routes"
              :key="item.id"
              :label="item.name"
              :value="item.locations"
            >
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tracking.dialog = false">取 消</el-button>
        <el-button type="primary" @click="handleTracking">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import RealTimeMap from '@/views/operating/components/RealTimeMap'
import TraceMonitor from '@/views/operating/components/TraceMonitor'
import VideoMonitor from '@/views/operating/components/VideoMonitor'
import { v4 as uuidv4 } from 'uuid'
import { getDeviceCertificate, getDevices } from '@/api/devicemgr'
import { getDeviceDetail, issueBinding, issueCommand } from '@/api/operating'
import { getTraceRoutes } from '@/api/traceroute'

function log(text) {
  const time = new Date()
  console.log('[' + time.toLocaleTimeString() + '] ' + text)
}

function log_error(text) {
  const time = new Date()
  console.trace('[' + time.toLocaleTimeString() + '] ' + JSON.stringify(text))
}

let CertificateProto = require('@/utils/Certificate_pb')

let leftVelocityOption = null
let rightVelocityOption = null
let leftVelocityChart = null
let rightVelocityChart = null
let velocityChart = null
let velocityOption = null
let steeringChart = null
let steeringOption = null
let powerOption = null
let powerChart = null
export default {

  name: 'operating-remote',
  components: { RealTimeMap, TraceMonitor, VideoMonitor },
  data() {
    return {
      channelId: uuidv4(),
      winHeight: window.innerHeight,
      winWidth: window.innerWidth,
      operationDeviceId: null,
      controllerDeviceId: null,
      operationDeviceLoading: false,
      controllerDeviceLoading: false,
      operationDevices: [],
      connectBtnOptions: {
        false: {
          color: 'primary',
          text: '连接'
        },
        true: {
          color: 'danger',
          text: '断开'
        }
      },
      isConnect: false,
      deviceState: {
        label: '离线状态'
      },
      controlModel: {
        label: '静止模式'
      },
      deviceStates: {
        offline: {
          label: '离线状态'
        },
        online: {
          label: '在线状态'
        }
      },
      controlModels: {
        standby: {
          label: '静止模式'
        },
        operating: {
          label: '平行驾驶模式'
        },
        tracking: {
          label: '自动驾驶模式'
        }
      },
      signal: 0,
      gps: 0,
      tracking: {
        dialog: false,
        disabled: false,
        speed: null,
        route: null,
        routes: []
      },
      operating: {
        dialog: false,
        disabled: false
      },
      standby: {
        dialog: false,
        disabled: true
      },
      shutdown: {
        dialog: false,
        disabled: false
      },
      trackingFormRules: {
        speed: [
          { required: true, message: '请输入循迹速度', trigger: 'blur' }
        ],
        route: [
          { required: true, message: '请选择循迹路线', trigger: 'blur' }
        ]
      },
      deviceDetail: null,
      // 循迹路线缓存
      traceRoute: null,
      eventHandlers: {},
      channels: {
        map: null,
        trace: null,
        video: null
      },
      EVENT_WS_CONNECTION: null,
      EMQ_CONNECTION: null
    }
  },
  mounted() {
    const _this = this
    window.onresize = () => {
      _this.winHeight = window.innerHeight
      _this.winWidth = window.innerWidth
    }
    this.initCharts()
    // 初始化通道
    this.initChannels()
  },
  methods: {
    handleConnect() {
      if (this.isConnect) {
        // 关闭资源
        this.destroyConnections()
      } else {
        if (!this.controllerDeviceId || !this.operationDeviceId) {
          this.$message({
            type: 'error',
            message: '请选择作业设备和控制设备!'
          })
          return
        }
        this.createBinding()
      }

    },
    fetchOptionDevices(query) {
      this.operationDeviceLoading = true
      getDevices(1, 100, query, 'machinery').then(res => {
        let data = res['data']
        this.operationDevices = data['list']
      }).finally(() => {
        this.operationDeviceLoading = false
      })
    },
    fetchControllerDevices(query) {
      this.controllerDeviceLoading = true
      getDevices(1, 100, query, 'controller').then(res => {
        let data = res['data']
        this.operationDevices = data['list']
      }).finally(() => {
        this.controllerDeviceLoading = false
      })
    },
    handleTraceDialog() {
      this.tracking.route = null
      this.tracking.speed = null
      getTraceRoutes('', 1, 100).then(res => {
        this.tracking.routes = res['data']['list']
        this.tracking.dialog = true
      })
    },
    /**
     * 创建绑定
     */
    createBinding() {
      issueBinding(this.controllerDeviceId, this.operationDeviceId).then(res => {
        // 绑定成功后初始化WebSocketConnection
        log('设备绑定成功。')
        log('初始化WebSocket连接……')
        this.initEventsWebSocketConnection()
        // 初始化用于WebRtc的EMQTT客户端
        log('初始化WebRtc连接……')
        this.initWetRtcMqttConnection()
        // 获取设备元数据信息
        this.loadDeviceDetail()
      })
    },
    /**
     * 初始化通道
     */
    initChannels() {
      const mapChannel = new BroadcastChannel(this.channelId + '-map')
      const traceChannel = new BroadcastChannel(this.channelId + '-trace')
      const videoChannel = new BroadcastChannel(this.channelId + '-video')
      mapChannel.onmessage = (msg) => {
        this.onChannelMessage(msg, this.onMapChannelMessage)
      }
      traceChannel.onmessage = (msg) => {
        this.onChannelMessage(msg, this.onTraceChannelMessage)
      }
      videoChannel.onmessage = (msg) => {
        const json = JSON.parse(msg.data)
        const type = json.type
        const data = json.payload
        this.onVideoChannelMessage(type, data)
      }
      this.channels['map'] = mapChannel
      this.channels['trace'] = traceChannel
      this.channels['video'] = videoChannel
    },
    onChannelMessage(msg, func) {
      const type = msg.data.type
      const data = msg.data.data
      func(type, data)
    },

    /**
     * 当Map的通道发来事件时，调用该方法
     * @param type 事件类型
     * @param data 事件内容
     */
    onMapChannelMessage(type, data) {
      // nothing todo
    },
    onTraceChannelMessage(type, data) {
      switch (type) {
        case 'registry':
          this.broadcastTraceLines()
      }

    },
    broadcastTraceLines() {
      // 判断当前是否有循迹路线的缓存，有的话发送
      this.tracking.route && this.channels['trace'].postMessage({
        type: 'trace-lines',
        data: this.tracking.route
      })
    },
    onVideoChannelMessage(type, data) {
      log('BroadCastChannel message arrived: ' + type)
      switch (type) {
        case 'send-message':
          this.sendMessageToEMQ(data)
          break
        case 'registry':
          this.broadcastRtcOptions()
          break
        case 'video-active':
          this.broadcastRtcOptions()
          break
      }
    },
    sendMessageToEMQ(msg) {
      const msgJSON = JSON.stringify(msg)
      log('Send message to emq: ' + msgJSON)
      const message = new Paho.MQTT.Message(msgJSON)
      message.destinationName = this.emqOptions.requestTopic
      this.EMQ_CONNECTION.send(message)
    },
    /**
     * 初始化WebRtc的MQTT连接，设备连接时初始化
     * 需要先获取设备的访问凭证
     */
    initWetRtcMqttConnection() {
      getDeviceCertificate(this.operationDeviceId).then(res => {
        let ciphertext = res['data']['ciphertext']
        let cert = CertificateProto.Certificate.deserializeBinary(ciphertext)
        this.emqOptions = {
          clientId: cert.getRtcvideoclientid() + '/' + this.channelId.substr(0, 4),
          requestTopic: cert.getRtcvideoreqtopic(),
          answerTopic: cert.getRtcvideoanstopic(),
          emqUrl: cert.getUrl(),
          emqUsername: cert.getUsername(),
          emqPassword: cert.getPassword()
        }
        // 初始化EMQ客户端
        this.EMQ_CONNECTION = this.createEMQClient(this.emqOptions)
        // 广播ICE服务器配置
        this.rtcOptions = {
          iceServerUrls: cert.getIceserverurls(),
          iceServerUsername: cert.getIceserverusername(),
          iceServerCredential: cert.getIceservercredential()
        }
      })
    },
    createEMQClient(options) {
      let match = options.emqUrl.match(/^(.+):\/\/(.+):(\d+)/)
      let host
      let port
      if (match) {
        host = match[2]
        port = 8083
      } else {
        throw new Error(options.emqUrl)
      }
      const client = new Paho.MQTT.Client(host, port, options.clientId)
      client.connect({
        userName: options.emqUsername,
        password: options.emqPassword,
        onSuccess: () => {
          log('EMQ客户端已连接。')
          client.subscribe(options.answerTopic)
          log('广播并初始化RTC配置。')
          this.broadcastRtcOptions()
        }
      })
      client.onConnectionLost = (e) => log('EMQ客户端已连接失去连接。')
      client.onMessageArrived = this.onEMQMessageArrived
      return client
    },
    broadcastRtcOptions() {
      if (this.rtcOptions && this.channels['video']) {
        this.channels['video'].postMessage(JSON.stringify({
          type: 'init-rtc-connection',
          payload: this.rtcOptions
        }))
      }
    },
    onEMQMessageArrived(message) {
      console.log('EMQ message arrived: ' + message.payloadString)
      const msg = JSON.parse(message.payloadString)
      this.channels['video'].postMessage(JSON.stringify({
        type: msg.type,
        payload: msg
      }))
    },
    /**
     * 初始化事件WebSocket连接
     */
    initEventsWebSocketConnection() {
      if (this.EVENT_WS_CONNECTION !== null) {
        this.EVENT_WS_CONNECTION.close()
      }

      //window.location.hostname
      this.EVENT_WS_CONNECTION = new WebSocket('ws://' + window.location.host + '/api/v1/operating/ws/events/' + this.operationDeviceId)
      this.EVENT_WS_CONNECTION.onmessage = this.eventBusOnMessage
      this.EVENT_WS_CONNECTION.onopen = this.eventBusOnOpen
      this.EVENT_WS_CONNECTION.onclose = this.eventBusOnClose
    },
    /**
     * 销毁连接
     */
    destroyConnections() {
      this.EVENT_WS_CONNECTION && this.EVENT_WS_CONNECTION.close()
      this.EMQ_CONNECTION && this.EMQ_CONNECTION.disconnect()
    },

    /**
     * 销毁通道
     */
    destroyChannels() {
      for (let channelName in this.channels) {
        const channel = this.channels[channelName]
        channel && channel.close()
      }
    },
    // 控制状态机
    controlStateMachine(state) {
      switch (state) {
        // 静止状态
        case 'standby':
          // 静止按钮禁用
          // this.standby.disabled = true
          this.tracking.disabled = false
          this.operating.disabled = false
          this.shutdown.disabled = false
          return
        case 'tracking':
          this.standby.disabled = false
          this.tracking.disabled = true
          this.operating.disabled = true
          this.shutdown.disabled = true
          return
        case 'operating':
          this.standby.disabled = false
          this.tracking.disabled = true
          this.operating.disabled = true
          this.shutdown.disabled = true
          return
      }
    },
    handleTracking() {
      this.controlStateMachine('tracking')
      const commandBody = JSON.stringify({
        speed: Number(this.tracking.speed),
        route: this.tracking.route
      })
      this.sendCommand(this.operationDeviceId, 'control-mode', 'tracking')
      this.sendCommand(this.operationDeviceId, 'auto-drive', commandBody)
      this.broadcastTraceLines()
      this.tracking.dialog = false
    },
    handleParallelDrive() {
      this.$confirm('平行驾驶指令下发后，您可以使用控制器设备进行远程驾驶, 是否继续?', '平行指令下发', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.controlStateMachine('operating')
        // 发送驾驶指令给机械设备
        this.sendCommand(this.operationDeviceId, 'control-mode', 'operating')
        // 发送驾驶指令给控制设备
        this.sendCommand(this.controllerDeviceId, 'control-mode', 'operating')
      }).catch(() => {
      })
    },
    handleStandby() {
      this.$confirm('静止指令下发后，设备将停止作业，处于静止等待状态, 是否继续?', '静止指令下发', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.controlStateMachine('standby')
        // 发送静止指令给机械设备
        this.sendCommand(this.operationDeviceId, 'control-mode', 'standby')
        // 发送静止指令给控制设备
        this.sendCommand(this.controllerDeviceId, 'control-mode', 'standby')
      }).catch(() => {
      })
    },
    handleShutdown() {
      this.$confirm('关机指令下发后，设备将停止作业，并进行系统关机, 是否继续?', '关机指令下发', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.sendCommand(this.operationDeviceId, 'shutdown', (new Date()).getTime())
      }).catch(() => {
      })
    },
    /**
     * 获取设备详情
     */
    loadDeviceDetail() {
      getDeviceDetail(this.operationDeviceId).then(res => {
        let data = res['data']
        this.deviceDetail = data
        let status = data['status']
        if (this.deviceStates.hasOwnProperty(status)) {
          // 更改状态
          this.deviceState = this.deviceStates[status]
        }
        let model = data['controlState']
        if (this.controlModels.hasOwnProperty(status)) {
          // 更改控制模式
          this.controlModel = this.controlModels[model]
          this.controlStateMachine(this.controlModel)
        }
      })
    },

    sendCommand(targetId, type, body) {
      issueCommand(targetId, type, body).then(res => {
        this.$message.success('指令下发成功！')
      })
    },

    eventBusOnMessage(message) {
      let data = JSON.parse(message['data'])

      let eventType = data['type']['type']
      if (this.eventHandlers.hasOwnProperty(eventType)) {
        this.eventHandlers[eventType](data)
      }
    },
    eventBusOnOpen() {
      log('WebSocket已经连接。')
      this.registryEventHandlers()
      this.isConnect = true
    },

    eventBusOnClose(e) {
      console.log('WebSocket已关闭。')
      this.isConnect = false
    },
    registryEventHandlers() {
      // 位置事件处理器
      this.eventHandlers['location'] = async event => {
        let data = JSON.parse(event['body'])
        // 发送给循迹监控Channel
        this.channels['trace'] && this.channels['trace'].postMessage({
          type: 'location',
          data: data
        })
        // 发送给实时地图
        this.channels['map'] && this.channels['map'].postMessage({
          type: 'location',
          data: data
        })
        // gps
        this.gps = parseInt(data['status'])

      }
      // 延迟信号事件
      this.eventHandlers['delay'] = async event => {
        this.signal = parseInt(event['body'])
      }
      // 左侧履带车速事件处理器
      // this.eventHandlers['left-track-velocity'] = async event => {
      //   if (leftVelocityOption != null && leftVelocityChart != null) {
      //     leftVelocityOption.series[0].data[0].value = parseFloat(event['body'])
      //     leftVelocityChart.setOption({ series: leftVelocityOption.series })
      //   }
      // }
      // 右侧履带车速事件处理器
      // this.eventHandlers['right-track-velocity'] = async event => {
      //   if (rightVelocityOption != null && rightVelocityChart != null) {
      //     rightVelocityOption.series[0].data[0].value = parseFloat(event['body'])
      //     rightVelocityChart.setOption({ series: rightVelocityOption.series })
      //   }
      // }

      // 车速事件处理器
      this.eventHandlers['velocity'] = async event => {
        if (velocityOption != null && velocityChart != null) {
          velocityOption.series[0].data[0].value = parseFloat(event['body'])
          velocityChart.setOption({ series: velocityOption.series })
        }
      }

      // 方向盘转角事件处理器
      this.eventHandlers['steering'] = async event =>{
        if (steeringOption != null && steeringChart != null) {
          steeringOption.series[0].data[0].value = parseFloat(event['body'])
          steeringChart.setOption({ series: steeringOption.series })
        }
      }

      // 电量事件处理器
      // this.eventHandlers['power'] = async event => {
      //   if (powerOption != null && powerChart != null) {
      //     powerOption.series[0].data[0].value = parseInt(event['body'])
      //     powerChart.setOption({ series: powerOption.series })
      //   }
      // }

      // 上线事件
      this.eventHandlers['online'] = async event => {
        this.deviceState = this.deviceStates['online']
      }
      // 下线事件
      this.eventHandlers['offline'] = async event => {
        this.deviceState = this.deviceStates['offline']
      }

      // 控制状态时间
      this.eventHandlers['control-state'] = async event => {
        let controlState = event['body']
        if (this.controlModels.hasOwnProperty(controlState)) {
          this.controlModel = this.controlModels[controlState]
        }
      }
    },
    initCharts() {
      // this.createLeftVelocityChart()
      // this.createRightVelocityChart()
      this.createVelocityChart()
      this.createSteeringChart()
      // this.createPowerChart()
    },
    createLeftVelocityChart() {
      leftVelocityOption = {
        tooltip: {
          formatter: '{b} : {c}%'
        },
        series: [
          {
            name: '左履带速度',
            title: {
              show: true,
              offsetCenter: ['0%', '-35%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 14,
                // fontStyle: "italic",
                // color: [[0.09, "#3EB278"], [0.82, "#4C8FD5"], [1, "#ff4500"]],
                color: '#1C1C1C',
                transparent: true,
                shadowColor: '#fff' // 默认透明
                // shadowBlur: 10
              }
            },
            pointer: {
              width: 4
            },
            detail: {
              formatter: '{value}%',
              offsetCenter: ['0%', '40%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 16
              }
            },

            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder'
              }
            },
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.2, '#F44336'],
                  [0.8, '#03A9F4'],
                  [1, '#F44336']
                ],
                shadowColor: '#fff', // 默认透明
                width: 6
              }
            },
            splitLine: {
              // 分隔线
              length: 10, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                // color: "auto"
              }
            },
            center: ['50%', '55%'],
            type: 'gauge',
            radius: '98%',
            data: [{ value: 0, name: '左履带车速' }],
            min: -100,
            max: 100
          }
        ]
      }
      leftVelocityChart = echarts.init(document.getElementById('leftVelocityChart'))
      leftVelocityChart.setOption(leftVelocityOption)
    },
    createRightVelocityChart() {
      rightVelocityOption = {
        tooltip: {
          formatter: '{b} : {c}%'
        },
        series: [
          {
            name: '右履带速度',
            title: {
              show: true,
              offsetCenter: ['0%', '-35%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 14,
                // fontStyle: "italic",
                // color: [[0.09, "#3EB278"], [0.82, "#4C8FD5"], [1, "#ff4500"]],
                color: '#1C1C1C',
                transparent: true,
                shadowColor: '#fff' // 默认透明
                // shadowBlur: 10
              }
            },
            pointer: {
              width: 4
            },
            detail: {
              formatter: '{value}%',
              offsetCenter: ['0%', '40%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 16
              }
            },

            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder'
              }
            },
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.2, '#F44336'],
                  [0.8, '#03A9F4'],
                  [1, '#F44336']
                ],
                shadowColor: '#fff', // 默认透明
                width: 6
              }
            },
            splitLine: {
              // 分隔线
              length: 10, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                // color: "auto"
              }
            },
            center: ['50%', '55%'],
            type: 'gauge',
            radius: '98%',
            data: [{ value: 0, name: '右履带车速' }],
            min: -100,
            max: 100
          }
        ]
      }
      rightVelocityChart = echarts.init(document.getElementById('rightVelocityChart'))
      rightVelocityChart.setOption(rightVelocityOption)
    },
    createVelocityChart() {
      velocityOption = {
        tooltip: {
          formatter: '{b} : {c}km/h'
        },
        series: [
          {
            name: '速度',
            startAngle: 220,
            endAngle: 0,
            title: {
              show: true,
              offsetCenter: ['0%', '-35%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 14,
                // fontStyle: "italic",
                // color: [[0.09, "#3EB278"], [0.82, "#4C8FD5"], [1, "#ff4500"]],
                color: '#1C1C1C',
                transparent: true,
                shadowColor: '#fff' // 默认透明
                // shadowBlur: 10
              }
            },
            pointer: {
              width: 4
            },
            detail: {
              formatter: '{value}km/h',
              offsetCenter: ['0%', '40%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 16
              }
            },

            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder'
              }
            },
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.4, '#8BC34A'],
                  [0.8, '#03A9F4'],
                  [1, '#F44336']
                ],
                shadowColor: '#fff', // 默认透明
                width: 6
              }
            },
            splitLine: {
              // 分隔线
              length: 10, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                // color: "auto"
              }
            },
            center: ['50%', '55%'],
            type: 'gauge',
            radius: '98%',
            data: [{ value: 0, name: '车速' }],
            min: 0,
            max: 60
          }
        ]
      }
      velocityChart = echarts.init(document.getElementById('velocityChart'))
      velocityChart.setOption(velocityOption)
    },
    createSteeringChart(){
      steeringOption = {
        tooltip: {
          formatter: '{b} : {c}%'
        },
        series: [
          {
            name: '方向盘转角',
            title: {
              show: true,
              offsetCenter: ['0%', '-35%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 14,
                // fontStyle: "italic",
                // color: [[0.09, "#3EB278"], [0.82, "#4C8FD5"], [1, "#ff4500"]],
                color: '#1C1C1C',
                transparent: true,
                shadowColor: '#fff' // 默认透明
                // shadowBlur: 10
              }
            },
            pointer: {
              width: 4
            },
            detail: {
              formatter: '{value}%',
              offsetCenter: ['0%', '40%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 16
              }
            },

            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder'
              }
            },
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.2, '#F44336'],
                  [0.8, '#03A9F4'],
                  [1, '#F44336']
                ],
                shadowColor: '#fff', // 默认透明
                width: 6
              }
            },
            splitLine: {
              // 分隔线
              length: 10, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                // color: "auto"
              }
            },
            center: ['50%', '55%'],
            type: 'gauge',
            radius: '98%',
            data: [{ value: 0, name: '方向盘转角' }],
            min: -500,
            max: 500
          }
        ]
      }
      steeringChart = echarts.init(document.getElementById('steeringChart'))
      steeringChart.setOption(steeringOption)
    },
    createPowerChart() {
      powerOption = {
        tooltip: {
          formatter: '{b} : {c}%'
        },
        series: [
          {
            name: '电量',
            startAngle: 220,
            endAngle: 40,
            splitNumber: 4,
            title: {
              show: true,
              offsetCenter: ['0%', '-35%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 14,
                // fontStyle: "italic",
                // color: [[0.09, "#3EB278"], [0.82, "#4C8FD5"], [1, "#ff4500"]],
                color: '#1C1C1C',
                transparent: true,
                shadowColor: '#fff' // 默认透明
                // shadowBlur: 10
              }
            },
            pointer: {
              width: 4
            },
            detail: {
              formatter: '{value}%',
              offsetCenter: ['0%', '40%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 16
              }
            },

            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder'
              }
            },
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.2, '#F44336'],
                  [0.8, '#03A9F4'],
                  [1, '#8BC34A']
                ],
                shadowColor: '#fff', // 默认透明
                width: 6
              }
            },
            splitLine: {
              // 分隔线
              length: 10, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                // color: "auto"
              }
            },
            center: ['50%', '55%'],
            type: 'gauge',
            radius: '98%',
            data: [{ value: 0, name: '电量' }],
            min: 0,
            max: 100
          }
        ]
      }
      powerChart = echarts.init(document.getElementById('powerChart'))
      powerChart.setOption(powerOption)
    }
  },
  beforeDestroy() {
    // 销毁通道
    this.destroyChannels()
    // 销毁连接
    this.destroyConnections()
  }
}
</script>

<style scoped>
.metric-icon {
  font-size: 14px;
}

.metric-chart {
  height: 100%;
  background: white;
}
</style>
