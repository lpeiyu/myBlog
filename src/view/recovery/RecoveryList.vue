<template>
  <div class="body">
    <div class="top-panel">
        <el-form @submit.prevent
                v-model="searchForm"
                class="search-form"
                labelAlign="left">
            <el-row :gutter="5">
                <el-col :span="5">
                    <el-form-item label="标题">
        <el-input v-model="searchForm.titleFuzzy" 
                maxlength="50"
                placeholder="支持模糊搜索"
                @keyup.enter="loadDataList"
                allowClear></el-input>
      </el-form-item>
                </el-col>
                <el-form-item>
                    <el-button type="danger" @click="loadDataList()">搜索</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
    <Table
      :columns="columns"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <template #cover="{ row }">
        <Cover :cover="row.cover"></Cover>
      </template>

      <template #blogInfo="{ row }">
        <div>标题：{{ row.title }}</div>
        <div>
            文章类型：{{ row.blogType==0?'博客':'专题' }}
            <el-divider direction="vertical"/>
            <span>{{ row.blogType==0?'分类':'专题' }}</span>：{{ row.categoryName||'--' }}
        </div>
        <div>作者：{{ row.nickName }}</div>
      </template>
      <template #statusInfo="{ row }">
        <div>
            <span :style="{ color: row.status == 1 ? 'red' : 'green' }">{{ row.statusName }}</span>
        </div>
      </template>
      <!-- 时间 -->
      <template #timeInfo="{ row }">
        <div>创建时间：{{ row.createTime }}</div>
        <div>更新时间：{{ row.lastUpdateTime }}</div>
      </template>
      <template #operation="{ row }">
        <div class="operation">
          <span v-if="userInfo.roleType == 1">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="reductionBlog(row)">还原</a>

            <el-divider direction="vertical" />
           
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="delBlog(row)"
              >删除</a
            >
          </span>
          <span v-else>---</span>
         </div>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive } from "vue";
import { useRouter } from "vue-router";
const router=useRouter()
const {proxy} =getCurrentInstance()
const api = {
    "loadDataList":"blog/loadRecoveryList",
    "delBlog":"blog/delBlog",
    "reductionBlog":"blog/reductionBlog"
}
const userInfo=reactive({roleType:1})
const tableData = reactive({})
const tableOptions = reactive({
    extHeight: 100
})
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "文章信息",
    prop: "title",
    scopedSlots: "blogInfo",
  },
  {
    label: "编辑器",
    width: 100,
    prop: "editorTypeName",
  },
  {
    label: "评论",
    prop: "allowCommentTypeName",
    width: 80,
  },
  {
    label: "时间",
    prop: "createTime",
    width: 260,
    scopedSlots: "timeInfo",
  },
  {
    label: "操作",
    prop: "operation",
    width: 150,
    scopedSlots: "operation",
  },
];
const searchForm = reactive({})
const loadDataList = async () => {
  let params = {
    pageNo: tableData.pageNo,
    pageSize: tableData.pageSize,
  };
  Object.assign(params, searchForm);
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData,result.data)
}
  //删除
  const delBlog = (data) => {
  proxy.Confirm(`你确定要删除【${data.title}】吗，删除后无法找回`, async () => {
    let result = await proxy.Request({
      url: api.delBlog,
      params: {
        blogId: data.blogId,
      },
    });
    if (!result) {
      return;
    }
    proxy.message.success("删除成功")
    loadDataList();
  });
};

//恢复博客
const reductionBlog = (data) => {
    proxy.Confirm(`确认要恢复【${data.title}】吗？恢复后博客位、为草稿状态`,
    async ()=>{
        let result =await proxy.Request({
            url:api.reductionBlog,
            params:{
                blogId: data.blogId
            }
        })
        if(!result) return
        proxy.message.success("恢复成功")
        loadDataList()
    
    })
}
</script>

<style>

</style>