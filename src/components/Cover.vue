<template>
  <div class="cover">
    <img :src="proxy.globalInfo.imgUrl+cover" v-if="cover">
    <img v-else src="../assets/defalut.jpg">
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue"
const { proxy }=getCurrentInstance()
const props=defineProps({
    cover:{
        type:String
    }
})


</script>

<style lang="less">
.cover{
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    overflow: hidden;
    img{
        width: 100%;
    }
}
</style>