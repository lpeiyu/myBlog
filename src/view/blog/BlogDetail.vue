<template>
  <Window
    :buttons="windowConfig.buttons"
    :show="windowConfig.show"
    :showCancel="false"
    @close="windowConfig.show=false">
    <div class="my-title">{{ blog.title }}</div>
    <div v-html="blog.content" class="blog-detail"></div>
  </Window>
</template>

<script setup>
import hljs from "highlight.js"
import "highlight.js/styles/atom-one-light.css"
import { getCurrentInstance, ref,reactive, nextTick } from "vue";
const {proxy} = getCurrentInstance()
const api={
    getBlogDetail:"/blog/getBlogById",
}
const windowConfig = reactive({
  show: false,
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
        windowConfig.show=false 
      },
    },
  ],
});
const blog=ref({ })
const showDetail =async (blogId)=>{
    windowConfig.show=true
    let result =await proxy.Request({
        url:api.getBlogDetail,
        params:{
            blogId
        }
    })
    if(!result) return
    blog.value=result.data
    nextTick(()=>{
        //高亮提示
        let blocks=document.querySelectorAll("pre code")
        blocks.forEach((block)=>{
            hljs.highlightBlock(block)
        })
    })
}
defineExpose({showDetail})
</script>

<style lang="less">
.my-title{
    font-size: 18px;
}
.blog-detail{
    blockquote{
        padding: 0 1em;
        color: #6a737d;
        border-left: 0.25em solid #dfe2e5;
    }
    img{
        width: 100%;
    }
}
</style>