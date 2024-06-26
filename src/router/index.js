import {createRouter, createWebHistory} from 'vue-router'

import login from '/src/views/Login.vue'
import layout from '/src/views/layout.vue'
import canteen from '/src/views/canteen.vue'
import order from '/src/views/orderlist.vue'
import buy from '/src/views/orderbuy.vue'
import preorder from '/src/views/preorder.vue'
import room from '/src/views/room.vue'
import NotFound from '/src/components/Notfound.vue'
import repassword from'@/components/repassword.vue'
import canteenmanage from '/src/views/canteenmanage.vue'
import ordermanage from '/src/views/ordermanage.vue'
import dishmanage from '/src/views/dishmanage.vue'
import commentmanage from '/src/views/commentmanage.vue'
import roommanage from '/src/views/roommanage.vue'
import orderinfo from '/src/views/orderinfo.vue'
import roominfo from '/src/views/roominfo.vue'
import {useTokenStore} from "@/stores/token.js";
const routes = [
    {path: '/login', component: login},
    {path: '/',
        component: layout,redirect: '/canteenmanage',
        children: [
            {path: '/roommanage', component: roommanage},
            {path: '/roominfo', component: roominfo},
            {path:'/commentmanage',component: commentmanage},
            {path:'/dishmanage',component:dishmanage},
            {path:'/ordermanage',component:ordermanage},
            {path: '/canteenmanage', component: canteenmanage},
            {path:'/orderinfo',component:orderinfo},
            {path:'/repassword',component:repassword}
        ]
    },
    {path: '/:pathMatch(.*)*', name :'Not Found',component: NotFound}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, from, next) => {
    const token =useTokenStore().token;
    if (!token && to.path !== '/login') {
        next('/login');
    }else {
        next();
    }
})

export default router