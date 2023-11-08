import type { RouteRecordRaw } from 'vue-router'

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '/',
        component: () => import('@/layout/index.vue'),
        redirect: '/home',
        meta: {
            isKeepAlive: true,
        },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    isLink: false,
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: true,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-shouye',
                },
            },
            {
                path: '/system',
                name: 'system',
                component: () => import('@/layout/route/parent.vue'),
                redirect: '/system/menu',
                meta: {
                    title: '系统设置',
                    isLink: false,
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin'],
                    icon: 'iconfont icon-xitongshezhi',
                },
                children: [
                    {
                        path: '/system/menu',
                        name: 'SystemMenu',
                        component: () => import('@/views/system/menu/SystemMenu.vue'),
                        meta: {
                            title: '菜单管理',
                            isLink: false,
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'iconfont icon-caidan',
                        },
                    },
                    {
                        path: '/system/role',
                        name: 'SystemRole',
                        component: () => import('@/views/system/role/SystemRole.vue'),
                        meta: {
                            title: '角色管理',
                            isLink: false,
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-ColdDrink',
                        },
                    },
                    {
                        path: '/system/user',
                        name: 'SystemUser',
                        component: () => import('@/views/system/user/SystemUser.vue'),
                        meta: {
                            title: '用户管理',
                            isLink: false,
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'iconfont icon-icon-',
                        },
                    },
                    {
                        path: '/system/dept',
                        name: 'SystemDept',
                        component: () => import('@/views/system/dept/SystemDept.vue'),
                        meta: {
                            title: '部门管理',
                            isLink: false,
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-OfficeBuilding',
                        },
                    },
                    {
                        path: '/system/dict',
                        name: 'SystemDict',
                        component: () => import('@/views/system/dict/SystemDict.vue'),
                        meta: {
                            title: '字典管理',
                            isLink: false,
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-SetUp',
                        },
                    },
                ],
            },
        ],
    },
]

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
    {
        path: '/:path(.*)*',
        name: 'notFound',
        component: () => import('@/views/error/404.vue'),
        meta: {
            title: '找不到此页面',
            isHide: true,
        },
    },
    {
        path: '/401',
        name: 'noPower',
        component: () => import('@/views/error/401.vue'),
        meta: {
            title: '没有权限',
            isHide: true,
        },
    },
]

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    },
]
