import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// import { useKeepALiveNames } from '@/stores/keepAliveNames'
import { initFrontEndControlRoutes } from '@/router/frontEnd'
import { initBackEndControlRoutes } from '@/router/backEnd'
import { notFoundAndNoPower, staticRoutes } from '@/router/route'
import { Session } from '@/utils/storage'

/**
 * 1、前端控制路由时：isRequestRoutes 为 false，需要写 roles，需要走 setFilterRoute 方法。
 * 2、后端控制路由时：isRequestRoutes 为 true，不需要写 roles，不需要走 setFilterRoute 方法），
 * 相关方法已拆解到对应的 `backEnd.ts` 与 `frontEnd.ts`（他们互不影响，不需要同时改 2 个文件）。
 * 特别说明：
 * 1、前端控制：路由菜单由前端去写（无菜单管理界面，有角色管理界面），角色管理中有 roles 属性，需返回到 userInfo 中。
 * 2、后端控制：路由菜单由后端返回（有菜单管理界面、有角色管理界面）
 */

// 读取 `/src/stores/themeConfig.ts` 是否开启后端控制路由配置

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
    history: createWebHashHistory(),
    /**
     * 说明：
     * 1、notFoundAndNoPower 默认添加 404、401 界面，防止一直提示 No match found for location with path 'xxx'
     * 2、backEnd.ts(后端控制路由)、frontEnd.ts(前端控制路由) 中也需要加 notFoundAndNoPower 404、401 界面。
     *    防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
     */
    routes: [...notFoundAndNoPower, ...staticRoutes],
})

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
// export function formatFlatteningRoutes<T extends { children: T }>(arr: T[]) {
//     if (arr.length <= 0) return false
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i].children) {
//             arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1))
//         }
//     }
//     return arr
// }
export function formatFlatteningRoutes<T = any>(arr: T[]) {
    if (arr.length <= 0) return []
    let result: T[] = []
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i])
        const child = (arr[i] as any).children
        console.log('arr[i] :>> ', arr[i])
        if (child) {
            const children = formatFlatteningRoutes(child)
            // console.log(children)
            if (children && children.length) {
                result = result.concat(children)
            }
        }
        // else {
        //     result.push(arr[i])
        // }
    }
    return result
}

/**
 * 树形json数据数组转平级普通数组
 * @param classifyList 嵌套数组
 * @param id 关联的键值，默认id
 * @param key 上级所属的键值，默认pid
 * @param children 嵌套数组的子类，子类的键值，默认children
 * @returns any[]
 */
export function transformLevelArr<T = any>(classifyList: Array<T>, id = 'id' as keyof T, key = 'pid', children = 'children' as keyof T): T[] {
    const temp: any[] = []
    const forFn = function (arr: string | any[], val = 0) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (val) item[key] = val
            temp.push(item)

            if (item[children]) forFn(item[children], item[id])
        }
    }
    forFn(classifyList)
    return temp
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
// export function formatTwoStageRoutes(arr: any) {
//     if (arr.length <= 0) return false
//     const newArr: any = []
//     const cacheList: Array<string> = []
//     arr.forEach((v: any) => {
//         if (v.path === '/') {
//             newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] })
//         } else {
//             // 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
//             // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
//             if (v.path.includes('/:')) {
//                 v.meta.isDynamic = true
//                 v.meta.isDynamicPath = v.path
//             }
//             newArr[0].children.push({ ...v })
//             // 存 name 值，keep-alive 中 include 使用，实现路由的缓存
//             // 路径：@/layout/route/parent.vue
//             if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
//                 cacheList.push(v.name)
//                 const stores = useKeepALiveNames(pinia)
//                 stores.setCacheKeepAlive(cacheList)
//             }
//         }
//     })
//     return newArr
// }

// 路由加载前
router.beforeEach(async (to, from, next) => {
    NProgress.configure({ showSpinner: false })
    if (to.meta.title) NProgress.start()

    const token = Session.get('token')

    if (!token) { // 没有token时，去登录
        Session.clear()
        // token没有，刷新页面时，当前`to`对象可能不是login的路由
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`)
        }
    } else if (token && to.path === '/login') { // 有token，又在登录页时，直接进入首页
        next('/')
    } else {
        const userState = useUserInfo()
        if (userState.menuList.length === 0) {
            const themeState = useThemeConfig()

            if (themeState.isRequestRoute) { // 后端控制路由
                await initBackEndControlRoutes()
            } else { // 前端控制路由
                await initFrontEndControlRoutes()
            }

            next({ path: to.path, query: to.query })
        } else {
            next()
        }
    }
})

// 路由加载后
router.afterEach(() => {
    // setTitle();   // 设置网站标题
    NProgress.done()
})

// 导出路由
export default router
