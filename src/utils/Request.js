import axios from "axios";
import { ElLoading } from "element-plus";
import message from "@/utils/Message";
import router from "../router";
//post提交数据的方式，提交的表单数据会转换为键值对并按照key=value&key2=value2的方式编码
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8"
//post提交数据的另一方式，它会将表单的数据处理为一条消息，以标签为单元，用分隔符分开
const contentTypeJson = "application/json"
//作为请求头，用来告诉服务器消息主体是序列化后的json字符串
const contentTypeFile = "multipart/form-data"
const request = (config) => {
    let { url, params, dataType='form', showLoading='true' } = config
    let contentType = contentTypeForm
    if (dataType === "json") {
        contentType = contentTypeJson
    } else if (dataType === "file") {
        contentType = contentTypeFile
        //把文件的额外参数加进去
        let param = new FormData()
        for (let key in params) {
            param.append(key, params[key])
        }
        params = param
    }
    const instance=axios.create({
        baseURL:'/api',
        timeout:10*1000,
        headers:{
            'Content-Type':contentType,
            'X-Requested-With':'XMLHttpRequest',  //ajax
        }
    })
    let loading=null
    //请求前拦截
    instance.interceptors.request.use(
        (config) => {
            if(showLoading){
                loading=ElLoading.service({
                    lock:true,
                    text:'加载中......',
                    background:'rgba(0,0,0,0.7)'
                })
            }
            return config
        },
        (error)=>{
            if(showLoading && loading){
                loading.close()
            }
            message.error("发送请求失败")
            return Promise.reject("发送请求失败")
        }
    )
    //请求后
    instance.interceptors.response.use(
        (res)=>{
            if(showLoading && loading){
                loading.close()
            }
            const responseData=res.data
            if(responseData.status==="error"){
                if(config.errorCallback){
                    config.errorCallback()
                }
                return Promise.reject(responseData.info)
            }else{
                if(responseData.code===200){
                    return responseData
                }else if(responseData.code===901){
                    setTimeout(()=>{
                        router.push("/login")
                    },2000)
                    return Promise.reject("登陆超时")
                }
            }
        },
        (error)=>{
            if(showLoading && loading){
                loading.close()
            }
            return Promise.reject("网络异常")
        }
    )
    return instance.post(url,params).catch(error=>{
        message.error(error)
        return null
    })
    // let result=new Promise((resolve,reject)=>{
    //     instance.post(url,params).then(res=>{
    //         resolve(res)
    //     }).catch(error=>{
    //         message.error(error)
    //     })
    // })
    // return result
}

export default request