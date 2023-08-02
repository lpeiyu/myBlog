<template>
  <el-upload name="file" 
            :show-file-list="false"
            accept=".png,.PNG,.JPG,.jpg,.jpeg,.JPEG,.GIF,.gif,.pmt,.PMT"
            :multiple="false"
            :http-request="uploadImage">
    <div class="cover-upload-btn">
        <template v-if="modelValue">
            <img :src="proxy.globalInfo.imgUrl + modelValue">
        </template>
        <span class="iconfont icon-add" v-else></span>
    </div>
</el-upload>
</template>

<script setup>
import { getCurrentInstance } from "vue"

const {proxy}=getCurrentInstance()
const props=defineProps({
    modelValue:{
        type:String,
        default:null
    }
})
const api={
    "uploadImage":"file/uploadImage"
}
const emit=defineEmits()
const uploadImage=async(file)=>{
    let result=await proxy.Request({
        url:api.uploadImage,
        dataType:"file",
        params:{
            file:file.file,
            type:0
        }
    })
    const fileName=result.data.fileName
    emit("update:modelValue",fileName)
    emit("callback",fileName)
}
</script>

<style lang="less">
.cover-upload-btn {
    width: 150px;
    height: 150px;
    background-color: rgb(235, 235, 235);
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
        font-size: 50px;
        color: rgb(124, 112, 112);
    }
    img {
        width: 100%;
    }
}

</style>