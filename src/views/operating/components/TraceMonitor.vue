<template>
  <div id="trace-monitor" :style="{
    height: winHeight*0.75 + 'px',
    width: winWidth*0.68+'px'
  }" @dblclick="maximize">

    <div v-if="!chart" style="text-align:center;height: 100%;">暂无寻迹路线</div>
  </div>
</template>

<script>
import {LatLon} from '../../../utils/utm'

let chart = null;
let option = null;
export default {
  name: "TraceMonitor",
  props: {
    cId: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      channel: null,
      winHeight: window.innerHeight,
      winWidth: window.innerWidth,
    }
  },
  created() {
    const channelId = this.cId ? this.cId : this.$route.params.cid;
    if (channelId) {
      this.channel = new BroadcastChannel(channelId)
      this.channel.onmessage = this.onMessage
    }
  },
  mounted() {

  },
  methods: {
    /**
     * 向父组件注册
     */
    registry() {
      if (this.channel) {
        this.channel.postMessage({
          type: 'registry',
          data: {}
        })
      }
    },
    /**
     * 处理Channel信息
     */
    onMessage(msg) {
      const type = msg.data.type
      const data = msg.data.data
      switch (type) {
        case 'trace-lines':
          this.createTraceChart(data)
          break
        case 'location':
          this.addLocation(data)
          break
      }
    },
    /**
     * 创建图表
     * @param lines
     */
    createTraceChart(lines) {
      this.$nextTick(() => {
        if (lines) {
          chart && chart.dispose();
          chart = echarts.init(document.getElementById('trace-monitor'));
          let xMin = null
          let xMax = null
          let yMin = null
          let yMax = null
          const newLines = lines.map(line => {
            const latLongP = new LatLon(line[1], line[0]);
            const utmCoord = latLongP.toUtm();
            const item = utmCoord.toString(3).split(" ").slice(2).map(i => parseFloat(i))
            const x = item[0]
            const y = item[1]
            if (!xMin || !xMax || !yMax || !yMin) {
              xMin = x
              xMax = x
              yMax = y
              yMin = y
            }
            xMax = Math.max.apply(null, [xMax, x])
            xMin = Math.min.apply(null, [xMin, x])
            yMin = Math.min.apply(null, [yMin, y])
            yMax = Math.max.apply(null, [yMax, y])
            item.push(line[1], line[0])
            return item
          })

          var colors = ['#5793f3', '#d14a61', '#675bba'];
          option = {
            color: colors,
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                let latLong = params['data']
                return "经度：" + latLong[2] + "，纬度：" + latLong[3]
              }
            },
            legend: {
              data: ['寻迹路线', '行驶路线', '预测路线']
            },
            xAxis: {
              type: 'value',
              // show: false, //隐藏坐标轴

              splitLine: {
                show: false
              },
              min: xMin / 2,
              max: xMax * 2
            },
            yAxis: {
              type: 'value',
              // show: false, //隐藏坐标轴
              splitLine: {
                show: false
              },
              min: yMin / 2,
              max: yMax * 2
            },
            dataZoom: [{
              show: true,
              type: 'inside',
              filterMode: 'none',
              xAxisIndex: [0],
              startValue: xMin,
              endValue: xMax
            }, {
              show: true,
              type: 'inside',
              filterMode: 'none',
              yAxisIndex: [0],
              startValue: yMin,
              endValue: yMax
            }],
            graphic: {
              type: 'image',
              id: 'logo',
              right: 40,
              top: 20,
              z: -10,
              bounding: 'raw',
              origin: [75, 75],
              style: {
                image: 'https://s1.ax1x.com/2020/08/13/dpghRS.png',
                width: 150,
                height: 150,
                opacity: 0.6
              }
            },
            series: [
              {
                name: '寻迹路线',
                type: 'line',

                hoverAnimation: false,
                data: newLines,
                lineStyle: {
                  width: 4,
                },
              },

              {
                name: '行驶路线',
                type: 'line',
                showSymbol: false,
                // sampling: 'average',
                showAllSymbol: false,
                hoverAnimation: false,
                data: [],
                lineStyle: {},
                markPoint: {
                  symbol: 'image://https://webapi.amap.com/images/car.png',
                  // symbol: 'triangle',
                  symbolRotate: 0,
                  symbolSize: 30,
                  data: [
                    {
                      name: '当前位置',
                      xAxis: 0,
                      yAxis: 0,
                    }
                  ],
                }
              },
              {
                name: '预测路线',
                type: 'line',
                showSymbol: true,
                hoverAnimation: false,
                data: [],
                lineStyle: {
                  width: 2,
                  type: 'dashed'
                },
              }

            ]
          };
          chart.setOption(option);
          chart.resize();
        }
      })

    },
    /**
     * 向图表添加位置
     * @param trace
     */
    addLocation(trace) {
      if (!chart) return
      const location = [parseFloat(trace['lng']), parseFloat(trace['lat'])]
      const item = this.transformUtm(location)
      // 添加经纬度
      item.push(trace['lng'], trace['lat'])
      // 绘制行驶路线
      option.series[1]['data'].push(item)
      // 设置小车转角
      option.series[1]['markPoint']['symbolRotate'] = 90 - trace['angle']
      option.series[1]['markPoint']['data'][0]['xAxis'] = item[0]
      option.series[1]['markPoint']['data'][0]['yAxis'] = item[1]

      // 绘制预测路线
      if (trace['plat'] && trace['plng']) {
        let pLocation = [parseFloat(trace['plng']), parseFloat(trace['plat'])];
        const pItem = this.transformUtm(pLocation)
        pItem.push(trace['plng'], trace['plat'])
        option.series[2]['data'] = [item, pItem]
      }
      chart.setOption({series: option.series});
    },
    transformUtm(latlon) {
      const latLongP = new LatLon(latlon[1], latlon[0]);
      const utmCoord = latLongP.toUtm();
      return utmCoord.toString(3).split(" ").slice(2).map(i => parseFloat(i))
    },
    maximize() {
      window.open("#/expand/trace/" + this.cId)
    }
  }
}
</script>

<style scoped>

</style>
