<template>
  <div style="height: 100%; width: 100%" id="video-monitor">
    <el-row :gutter="20" style="height: 50%">
      <el-col :sm="24" :md="12" class="video">
        <ExpandVideo :channelId="channelId" :cameraId="'front'"></ExpandVideo>
      </el-col>
      <el-col :sm="24" :md="12" class="video1">
        <ExpandVideo :channelId="channelId" :cameraId="'rear'"></ExpandVideo>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="height: 50%">
      <el-col :sm="24" :md="12" class="video">
        <ExpandVideo :channelId="channelId" :cameraId="'left'"></ExpandVideo>
      </el-col>
      <el-col :sm="24" :md="12" class="video1">
        <ExpandVideo :channelId="channelId" :cameraId="'right'"></ExpandVideo>
      </el-col>
    </el-row>
    <div v-if="!channel" style="text-align:center;height: 100%;">视频监控组件初始化失败</div>
  </div>
</template>

<script>

export default {
  name: "VideoMonitor",
  components: {
    ExpandVideo: () => import('./Video'),

  },
  props: {
    cId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      channel: null,
      channelId: null,
      isExpand: false
    }
  },
  methods: {
    maximize() {
      if (this.isExpand) return
      this.channel.postMessage(JSON.stringify({
        type: 'video-destroy',
        payload: {
          id: 'all'
        }
      }))
      window.open("#/expand/video/" + this.cId)
    }
  }
  ,
  created() {
    const channelId = this.cId ? this.cId : this.$route.params.cid;
    this.isExpand = this.$route.params.cid
    if (channelId) {
      this.channelId = channelId
      this.channel = new BroadcastChannel(channelId)
      this.$nextTick(() => {

      })
    }
  }
  ,
  mounted() {

  }
}
</script>

<style scoped>
.video {
  height: 100%;
}

.video1 {
  height: 100%;
}
</style>
