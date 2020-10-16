<template>

</template>

<script>

import { ssoLogin } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {}
  },
  beforeCreate() {
    let token = this.$route.query.token
    if (token) {
      this.$store.dispatch('user/login', token)
      // 跳转到首页
      this.$router.push('/')
    } else {
      // 去单点登陆
      ssoLogin()
    }

  },
  methods: {}
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
</style>
