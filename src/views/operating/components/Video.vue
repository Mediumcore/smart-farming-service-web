<template>
  <video :id="videoId+'-video'" playsinline autoplay style="height: 100%;width: 100%;" @dblclick="maximize"></video>
</template>

<script>
import {v4 as uuidv4} from 'uuid';

function log(text) {
  const time = new Date();
  console.log("[" + time.toLocaleTimeString() + "] " + text);
}

function log_error(text) {
  const time = new Date();
  console.trace("[" + time.toLocaleTimeString() + "] " + JSON.stringify(text));
}


export default {
  name: "Video",
  props: {
    cameraId: {
      type: String,
      required: false
    },
    channelId: {
      type: String,
      required: false
    }

  },
  data: () => ({
    instanceId: null,
    videoId: null,
    reqId: null,
    chId: null,
    childIds: [],
    videoElement: null,
    BROAD_CHANNEL: null,
    options: {
      iceServerUrls: null,
      iceServerUsername: null,
      iceServerCredential: null,
      audioBandWidth: 50,
      videoBandWith: 500
    },
    peerConnection: null,
    isActive: false,
  }),
  created() {
    this.videoId = this.cameraId ? this.cameraId : this.$route.params.cameraId
    // 初始化BroadcastChannel
    this.chId = this.channelId ? this.channelId : this.$route.params.cid
    this.BROAD_CHANNEL = new BroadcastChannel(this.chId)
    this.isActive = true
    // 监听广播通道
    this.BROAD_CHANNEL.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      const msgType = data.type
      const payload = data.payload
      if (payload.camera && payload.camera !== this.videoId) return;
      switch (msgType) {
        case 'init-rtc-connection':
          this.handleInitRtcConnectionMessage(payload)
          break
        case 'video-answer':
          this.handleVideoAnswerMessage(payload)
          break
        case 'video-notify-answer':
          this.handleVideoNotifyMessage(payload)
          break
        case 'new-ice-candidate':
          this.handleNewICECandidateMessage(payload)
          break
        case 'destroy-rtc-connection':
          this.handleDestroyRtcConnectionMessage(payload)
          break
        case 'video-active':
          this.isActive = true
          break
        case 'video-destroy':
          this.isActive = false
          this.destroy()
          break
      }
    }
    this.$nextTick(() => {
      // 初始化cameraId
      this.videoElement = document.getElementById(this.videoId + "-video")
    })
  },
  mounted() {
    // 页面关闭时，关闭视频，通知主页面，当前视频关闭
    window.addEventListener('beforeunload', e => this.activeVideo(e))
    // 注册
    this.BROAD_CHANNEL.postMessage(JSON.stringify({
      type: 'registry',
      payload: {}
    }))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.activeVideo(e))
  },
  methods: {
    activeVideo(e) {
      this.BROAD_CHANNEL.postMessage(JSON.stringify({
        type: 'video-active',
        payload: {}
      }))
      this.BROAD_CHANNEL.close()
    },
    maximize() {
      if (!this.$route.params.cameraId) {
        // 将当前视频注销
        this.isActive = false
        this.destroy()
        window.open("#/expand/video/" + this.chId + '/' + this.videoId)
      } else {
        this.$message({
          type: 'error',
          message: '当前已经是扩展页面，不支持再次扩展！'
        });
      }

    },
    /**
     * 请求远程视频响应时调用该方法
     * @param msg
     * @returns {Promise<void>}
     */
    async handleVideoAnswerMessage(msg) {
      const reqId = msg.id
      if (reqId !== this.reqId) return
      const desc = new RTCSessionDescription(msg.sdp);
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(desc).catch(log_error)
      }
    },
    /**
     * 远程视频端就绪时调用该方法
     * @param msg
     * @returns {Promise<void>}
     */
    async handleVideoNotifyMessage(msg) {
      const reqId = msg.id
      if (reqId === this.reqId && msg.status === "ready") {
        await this.createVideoOffer()
      }
    },
    /**
     * 有新的ICE候选接入时调用该方法
     * @param msg
     * @returns {Promise<void>}
     */
    async handleNewICECandidateMessage(msg) {
      const reqId = msg.id
      if (reqId !== this.reqId) return
      const candidate = new RTCIceCandidate(msg.candidate);
      log("*** Adding received ICE candidate: " + JSON.stringify(candidate));
      try {
        await this.peerConnection.addIceCandidate(candidate)
      } catch (err) {
        log_error(err);
      }
    },
    /**
     * 通过数据通道向EMQ发送信息
     * @param message
     * @returns {Promise<void>}
     */
    async sendMessage(message) {
      message.camera = this.videoId
      message.id = this.reqId
      this.BROAD_CHANNEL.postMessage(JSON.stringify({
        type: 'send-message',
        payload: message
      }))
      log("Send message:" + message)
    },
    /**
     * 初始化PeerConnection
     * @param msg
     */
    async handleInitRtcConnectionMessage(msg) {
      if (!this.peerConnection && this.isActive) {
        log("** Init rtc connection.")
        const options = msg
        Object.assign(this.options, msg)
        const configuration = {
          iceServers: [{
            urls: options.iceServerUrls,
            username: options.iceServerUsername,
            credential: options.iceServerCredential
          }],
          sdpSemantics: 'unified-plan',
          bundlePolicy: 'max-compat'
        };
        // 更新实例ID
        this.reqId = uuidv4()
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnection.onicecandidate = this.handleICECandidateEvent;
        peerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
        peerConnection.ontrack = this.handleTrackEvent;
        this.peerConnection = peerConnection;
        this.sendMessage({
          type: 'video-request-notify',
          id: this.reqId
        })
      }
    },
    async handleDestroyRtcConnectionMessage(msg) {
      const reqId = msg.id
      if (reqId === this.reqId && this.peerConnection) {
        this.peerConnection.close()
      }
    },
    removeBandwidthRestriction(sdp) {
      return sdp.replace(/b=AS:.*\r\n/, '').replace(/b=TIAS:.*\r\n/, '');
    },

    updateBandwidthRestriction(sdp) {
      let bandwidth = this.options.videoBandWith
      if (bandwidth === 'unlimited') {
        return this.removeBandwidthRestriction(sdp);
      } else {
        let modifier = 'AS';
        if (adapter.browserDetails.browser === 'firefox') {
          bandwidth = (bandwidth >>> 0) * 1000;
          modifier = 'TIAS';
        }
        if (sdp.indexOf('b=' + modifier + ':') === -1) {
          // insert b= after c= line.
          sdp = sdp.replace(/c=IN (.*)\r\n/, 'c=IN $1\r\nb=' + modifier + ':' + bandwidth + '\r\n');
        } else {
          sdp = sdp.replace(new RegExp('b=' + modifier + ':.*\r\n'), 'b=' + modifier + ':' + bandwidth + '\r\n');
        }
        return sdp;
      }
    },
    async createVideoOffer() {
      try {
        let self = this
        log("*** Create offer.")
        await this.peerConnection.createOffer(async function (sessionDescription) {
          sessionDescription.sdp = self.updateBandwidthRestriction(sessionDescription.sdp);
          await self.peerConnection.setLocalDescription(sessionDescription);
          self.sendMessage({
            type: "video-request",
            sdp: self.peerConnection.localDescription
          });

        }, function (sessionDescription) {
        }, {offerToReceiveAudio: false, offerToReceiveVideo: true});
      } catch (err) {
        log_error("*** The following error occurred while RequestVideo.");
      }
    },
    handleICECandidateEvent(event) {
      if (event.candidate) {
        this.sendMessage({
          type: "new-ice-candidate",
          candidate: event.candidate
        });
      }
    },

    handleSignalingStateChangeEvent(e) {
      // todo
    },
    handleTrackEvent(event) {
      this.videoElement.srcObject = event.streams[0]
    },
    destroy() {
      // 关闭当前的视频
      if (this.videoElement.srcObject) {
        this.videoElement.pause()
        this.videoElement.srcObject.getTracks().forEach(track => {
          track.stop()
        })
        this.videoElement.srcObject = null
      }
      if (this.peerConnection) {
        this.peerConnection.close()
        this.peerConnection = null
      }

    },
  }
}
</script>

<style scoped>

</style>
