<template>
  <div>
    <v-md-editor :model="modelValue"
                 :height="height + 'px'"
                 :disabled-menus="[]"
                 :include-level="[1,2,3,4,5,6]"
                @upload-image="handleUploadImage"
                @change="change"></v-md-editor>
  </div>
</template>

<script setup>
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import { getCurrentInstance } from 'vue';
// highlightjs
import hljs from 'highlight.js';

const {proxy} = getCurrentInstance()
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
const props=defineProps({
    modelValue:{
        type:String,
        default:""
    },
    height:{
        type:Number,
        default:500
    }
})
const handleUploadImage=async (event,insertImage,files)=>{
    let result=await proxy.Request({
        url:'file/uploadImage',
        dataType:"file",
        params:{
            file:files[0],
            type:1
        }
    })
    if(!result){
        return
    }
    const url=proxy.globalInfo.imgUrl + result.data.fileName
    insertImage({
        url:url,
        desc:'图片'
    })
}
const emit=defineEmits()
const change=(markdownContent,htmlContent)=>{
    emit("update:modelValue",markdownContent)
    emit("htmlContent",htmlContent)
}
</script>

<style>

</style>