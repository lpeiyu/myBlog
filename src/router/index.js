import { createRouter,createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'
const routes=[
    {
        name:'登录',
        path:'/login',
        component:()=>import('../view/Login.vue')
    },
    {
        name:'框架页',
        path:'/',
        component:()=>import('../view/Framework.vue'),
        redirect:"/blog/list",
        children:[
            {
                path:"/blog/test",
                name:"test",
                component:()=>import('../view/blog/Test.vue')
            },
            {
                path:"/blog/list",
                name:"博客管理",
                component:()=>import('../view/blog/BlogList.vue')
            },
            {
                path:"/blog/category",
                name:"分类管理",
                component:()=>import('../view/blog/BlogCategory.vue')
            },
            {
                path:"/special/list",
                name:"专题管理",
                component:()=>import('../view/special/SpecialList.vue')
            },
            {
                path:"/settings/my",
                name:"个人信息",
                component:()=>import('../view/settings/MyInfo.vue')
            },
            {
                path:"/settings/user",
                name:"博客成员",
                component:()=>import('../view/settings/TeamUser.vue')
            },
            {
                path:"/settings/sysInfo",
                name:"系统设置",
                component:()=>import('../view/settings/SysInfo.vue')
            },
            {
                path:"/recovery/list",
                name:"回收站",
                component:()=>import('../view/recovery/RecoveryList.vue')
            },
        ]
    }
]
const router=createRouter({
    routes,
    history:createWebHistory()
})
router.beforeEach((to,from,next)=>{
    const userInfo=VueCookies.get('userInfo')
    if(!userInfo && to.path != "/login"){
        router.push("/login")
    }
    next()
})
export default router