import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {ssoLogin} from "@/api/user";

NProgress.configure({showSpinner: false}) // NProgress Configuration
const whiteList = ['/login', '/logout'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  //determine whether the user has logged in
  const hasToken = getToken()

  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  } else if (hasToken) {
    next()
  } else {
    /* has no token*/
    // other pages that do not have permission to access are redirected to the login page.
    // 单点登录
    ssoLogin()
    NProgress.done()
  }

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
