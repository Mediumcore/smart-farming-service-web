import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: 'Dashboard', icon: 'dashboard'}
    }]
  },

  {
    path: '/mgt',
    component: Layout,
    redirect: '/mgt/device',
    meta: {title: '平台管理', icon: 'platform'},
    children: [{
      path: 'device',
      name: 'DeviceManagement',
      component: () => import('@/views/mgt/device'),
      meta: {title: '设备管理', icon: 'device'}
    },
      {
        path: 'event',
        name: 'EventManagement',
        component: () => import('@/views/mgt/event'),
        meta: {title: '事件管理', icon: 'event'}
      },
      {
        path: 'command',
        name: 'CommandManagement',
        component: () => import('@/views/mgt/command'),
        meta: {title: '指令管理', icon: 'event'}
      }
    ]
  },

  {
    path: '/track',
    component: Layout,
    children: [
      {
        path: 'route',
        name: 'TrackRoute',
        component: () => import('@/views/track/route'),
        meta: {title: '循迹路线', icon: 'route'}
      }
    ]
  },
  {
    path: '/operating',
    component: Layout,
    children: [
      {
        path: 'remote',
        name: 'RemoteOperating',
        component: () => import('@/views/operating/remote'),
        meta: {title: '远程操作', icon: 'operating-remote'}
      }
    ]
  },

  {
    path: '/expand/map/:cid',
    component: () => import('@/views/operating/components/RealTimeMap'),
    hidden: true
  },
  {
    path: '/expand/trace/:cid',
    component: () => import('@/views/operating/components/TraceMonitor'),
    hidden: true
  },
  {
    path: '/expand/video/:cid',
    name: 'VideoMonitor',
    component: () => import('@/views/operating/components/VideoMonitor'),
    hidden: true
  },
    {
    path: '/expand/video/:cid/:cameraId',
    name: 'Video',
    component: () => import('@/views/operating/components/Video'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
