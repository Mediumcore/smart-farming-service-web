<template>
  <div style="height: 100%; width: 100%" id="real-time-map" @dblclick="maximize">
    <div v-if="!channel" style="text-align:center;height: 100%;">地图组件初始化失败</div>
  </div>
</template>

<script>
import map_transform from "../../../utils/map-transform";

export default {
  name: "RealTimeMap",
  props: {
    cId: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      channel: null,
      map: null,
      mapCenter: null,
      carMarker: null,
      lines: [],
      maxLineCapacity: 1000,
      lastLocation: null,
    }
  },
  created() {
    const channelId = this.cId ? this.cId : this.$route.params.cid;
    if (channelId) {
      this.channel = new BroadcastChannel(channelId)
      this.channel.onmessage = (msg) => {
        const type = msg.data.type
        const data = msg.data.data
        this.onChannelMessage(type, data)
      }
      this.$nextTick(() => {
        this.createMap(map_transform['a_wgs2gcj']([117.1482253804925, 36.69067493933744, 0]))
      })
    }
  },
  methods: {
    createMap(center) {
      if (this.map) return
      let map = new AMap.Map("real-time-map", {
        center: center,
        resizeEnable: true,
        layers: [new AMap.TileLayer.Satellite()],
        zoom: 20
      });

      // 同时引入工具条插件，比例尺插件和鹰眼插件
      AMap.plugin([
        // 'AMap.ToolBar',
        // 'AMap.Scale',
        // 'AMap.OverView',
        'AMap.MapType',
        'AMap.Geolocation',
      ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        // map.addControl(new AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        // map.addControl(new AMap.Scale());

        // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        // map.addControl(new AMap.OverView({isOpen: true}));

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        map.addControl(new AMap.MapType());

        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        map.addControl(new AMap.Geolocation());
      });
      this.map = map;
    },

    onChannelMessage(type, data) {
      switch (type) {
        case 'location':
          this.handleLocationMessage(data)
          break
      }
    },
    handleLocationMessage(data) {
      let location = map_transform['a_wgs2gcj']([data['lng'], data['lat']])
      let angle = data['angle']
      if (!this.map) return
      // 设置地图中心位置
      if (!this.mapCenter) {
        this.mapCenter = location
        this.map.setCenter(this.mapCenter)
      }

      // 判断绘制的路线是否超过最大容量，如果超过，删除一半
      if (this.lines.length === this.maxLineCapacity) {
        const needRemovedLines = this.lines.slice(0, this.maxLineCapacity - 1)
        this.lines.splice(0, this.maxLineCapacity)
        // 删除map中的线
        for (let line of needRemovedLines) {
          this.map.remove(line)
        }
      }

      // 绘制小车标记
      if (this.carMarker == null) {
        this.carMarker = new AMap.Marker({
          position: location,
          icon: "https://webapi.amap.com/images/car.png",
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true,
          angle: -90,
          title: '作业设备'
        });
        this.map.add(this.carMarker)
      }
      this.carMarker.setAngle(angle + 270)

      // 绘制路线
      if (!this.lastLocation) {
        this.lastLocation = location
      }
      const locations = [this.lastLocation, location]
      // 绘制轨迹
      var polyline = new AMap.Polyline({
        map: this.map,
        path: locations,
        showDir: true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      // 添加缓存
      this.lines.push(polyline)
      // 移动小车
      this.carMarker.moveAlong(locations, 1000)
      this.lastLocation = location
    },
    maximize() {
      window.open("#/expand/map/" + this.cId)
    }
  },

  beforeDestroy() {
    this.channel && this.channel.close()
    this.map && this.map.destroy();
  }
}
</script>

<style scoped>

</style>
