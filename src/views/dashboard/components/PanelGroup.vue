<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="machinery" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            机械设备(在线/总数)
          </div>
          <count-to :start-val="0" :end-val="machinery.online" :duration="1000" class="card-panel-num"/>
          /
          <count-to :start-val="0" :end-val="machinery.total" :duration="1000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="controller" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            控制设备(在线/总数)
          </div>
          <count-to :start-val="0" :end-val="controller.online" :duration="1000" class="card-panel-num"/>
          /
          <count-to :start-val="0" :end-val="controller.total" :duration="1000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="command" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            下发指令
          </div>
          <count-to :start-val="0" :end-val="command" :duration="1000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="event" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            上报事件
          </div>
          <count-to :start-val="0" :end-val="event" :duration="1000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {overview} from '@/api/overview'

  export default {
    data() {
      return {
        machinery: {
          online: 0,
          total: 0
        },
        controller: {
          online: 0,
          total: 0
        },
        command: 0,
        event: 0,
        loopLoadInterval: null
      }
    },
    components: {
      CountTo
    },
    mounted() {
      this.loopLoadOverview()
    },
    methods: {
      /**
       * 获取概况
       */
      loadOverview() {
        overview().then(res => {
          let data = res['data']
          // 机械的数据
          let machineryTokens = data['machinery']['value'].split('/')
          if (machineryTokens.length > 1) {
            this.machinery.online = parseInt(machineryTokens[0])
            this.machinery.total = parseInt(machineryTokens[1])
          }

          // 控制器的数据
          let controllerTokens = data['controller']['value'].split('/')
          if (controllerTokens.length > 1) {
            this.controller.online = parseInt(controllerTokens[0])
            this.controller.total = parseInt(controllerTokens[1])
          }

          // 指令总数
          this.command = parseInt(data['command']['value'])

          // 事件总数
          this.event = parseInt(data['event']['value'])

        })
      },

      /**
       * 轮询获取概况信息
       * @param interval 间隔
       */
      loopLoadOverview(interval = 10000) {
        this.loadOverview()
        this.loopLoadInterval = setInterval(this.loadOverview, interval)
      }

    },
    beforeDestroy() {
      // 销毁轮询器
      if (this.loopLoadInterval !== null) {
        clearInterval(this.loopLoadInterval)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
