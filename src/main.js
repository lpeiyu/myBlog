import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/assets/icon/iconfont.css"
import message from './utils/Message'
import Request from '@/utils/Request'
import Table from '@/components/Table.vue'
import Cover from '@/components/Cover.vue'
import Dialog from '@/components/Dialog.vue'
import Confirm from '@/utils/Confirm';
import CoverUpload from '@/components/CoverUpload.vue'
import Window from '@/components/Window.vue'
import EditorMarkdown from '@/components/EditorMarkdown.vue'
import EditorHtml from '@/components/EditorHtml.vue'
import Verify from './utils/Verify'
import store from './store'
const app=createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(store)
app.config.globalProperties.Request=Request
app.config.globalProperties.message=message
app.config.globalProperties.Confirm=Confirm
app.config.globalProperties.Verify=Verify
app.config.globalProperties.globalInfo={
    imgUrl:"/api/file/getImage/"
}
// 不用在每个页面用的时候都要引入
app.component("Table",Table)
app.component("Cover",Cover)
app.component("Dialog",Dialog)
app.component("Window",Window)
app.component("CoverUpload",CoverUpload)
app.component("EditorMarkdown",EditorMarkdown)
app.component("EditorHtml",EditorHtml)
app.mount('#app')
