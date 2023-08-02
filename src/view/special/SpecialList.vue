<template>
  <div>
    <el-button type="danger" @click="showEdit('add')">新增分类</el-button>
    <el-row :gutter="10" style="margin-top:10px">
      <el-col :span="13">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题</span>
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="true"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            @rowClick="rowClick"
            ref="dataTableRef"
          >
            <template #cover="{ row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <template #op="{ row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdit('update', row)"
                  >修改</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                  >删除</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题文章</span>
            </div>
          </template>
          <div style="margin-bottom: 5px">
            <el-alert type="info" show-icon :closable="false">拖动文章修改排序</el-alert>
          </div>
          <div class="special-blog-tree">
      <el-tree class="tree-panel"
              ref="refTree"
              :data="blogList"
              defaultExpandAll
              node-key="blogId"
              :expand-on-click-node="false"
              :props="treeProps"
              :highlight-current="true"
              draggable
              @node-drop="blogDrag">
            <template #default="{data}">
              <span class="custom-node-style">
                <span class="node-title">
                  {{ data.title }}
                  <span v-if="data.status==0" style="color:red; font-size: 10px">(草稿)</span>
                  <span v-if="data.status==1" style="color:green; font-size: 10px">(已发布)</span>
                </span>
                <span class="node-op">
                  <template v-if="data.blogId==='0'">
                  <a class="a-link" href="javascript:void(0)" @click="editBlog('add',data)">新增文章</a>
                </template>
                <template v-else>
                  <a class="a-link" href="javascript:void(0)" @click="showDetail(data)">预览</a>
                  <el-divider direction="vertical" />
                  <a class="a-link" href="javascript:void(0)" @click="editBlog('edit',data)">修改</a>
                  <el-divider direction="vertical" />
                  <a class="a-link" href="javascript:void(0)" @click="delBlog(data)">删除</a>
                  <el-divider direction="vertical" />
                  <a class="a-link" href="javascript:void(0)" @click="editBlog('add',data)">新增下级文章</a>
                </template>
                </span>
              </span>
            </template>
            </el-tree>
    </div>
        </el-card>
        
      </el-col>
    </el-row>
    
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="dialogConfig.show = false"
      width="500px"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
      >
        <el-form-item label="名称" prop="categoryName">
          <el-input placeholder="请输入名称" v-model="formData.categoryName">
          </el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="categoryDesc">
          <el-input
            v-model="formData.categoryDesc"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <BlogEdit ref="blogEditRef" @callback="saveBlogCallback"></BlogEdit>
    <BlogDetail ref="blogDetailRef"></BlogDetail>
  </div>
</template>

<script setup>
import BlogDetail from "./BlogDetail.vue"
import BlogEdit from "./BlogEdit.vue";
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  "loadDataList": "/category/loadCategory4Special",
  "saveCategory": "category/saveCategory4Special",
  "delCategory": "category/delCategory4Special",
  "getSpecialInfo":"blog/getSpecialInfo",
  "delBlog":"/blog/recoveryBlog",
  "updateSpecialBlogSort":"blog/updateSpecialBlogSort"
};
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "名称",
    prop: "categoryName",
    width: 200,
  },
  {
    label: "简介",
    prop: "categoryDesc",
  },
  {
    label: "博客数量",
    prop: "blogCount",
    width: 100,
  },
  {
    label: "操作",
    prop: "blogCount",
    width: 200,
    scopedSlots: "op",
  },
];
const tableData = reactive({});
const tableOptions = {
  extHeight: 135,
};
const dataTableRef=ref(null)
const currentCategoryId=ref(null)
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData,result.data)
  if(currentCategoryId.value==null && result.data.list.length>0){
    currentCategoryId.value=result.data.list[0].categoryId
    loadBlogList()
  }
  nextTick(()=>{
    dataTableRef.value.setCurrentRow("categoryId",currentCategoryId.value)
  })
};
//新增、修改
const dialogConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称" }],
};
const formDataRef = ref();
const showEdit = (type, data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (type == "add") {
      dialogConfig.title = "新增分类";
      formData.value={}
    } else if (type == "update") {
      dialogConfig.title = "编辑分类";
      formData.value=JSON.parse(JSON.stringify(data))
    }
  });
};
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.saveCategory,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.message.success("保存成功");
    loadDataList();
  });
};
//删除
const del = (data) => {
  proxy.Confirm(`你确定要删除${data.categoryName}吗`, async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      params: {
        categoryId: data.categoryId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};

//专题树
//获取专题文章
const blogList=ref([])
//行选中
const rowClick=(row)=>{
  currentCategoryId.value=row.categoryId
  loadBlogList()
}
const loadBlogList=async ()=>{
  let result = await proxy.Request({
    url:api.getSpecialInfo,
    params:{
      categoryId:currentCategoryId.value,
      showType:"1"
    }
  })
  blogList.value=result.data
}

//属性展示专题
const treeProps={
  children:"children",
  label:"title",
  value:"blogId"
}

//新增、修改专题博客
const blogEditRef=ref(null)
const editBlog=(type,data)=>{
  blogEditRef.value.init(type,data)
}
//保存专题回调
const saveBlogCallback=()=>{
  loadBlogList()
}
//删除博客
const delBlog = (data) => {
  proxy.Confirm(`你确定要删除【${data.title}】吗`, async () => {
    let result = await proxy.Request({
      url: api.delBlog,
      params: {
        blogId: data.blogId,
      },
    });
    if (!result) {
      return;
    }
    loadBlogList();
  });
};

//拖动改变排序，修改父级
const blogDrag=async (draggingNode,dropNode,dropType,ev)=>{
  let parentNode=null
  if(dropType=="inner"){
    //拖动某个节点，修改父级节点为目标节点，同时修改目标节点下的所有子节点的排序
    parentNode=dropNode
  }else{
    //拖入之前、之后，修改被拖动的节点的父节点为目标节点的父节点，同时修改目标节点父节点下所有的子节点的排序
    parentNode=dropNode.parent
  }
  //操作的节点ID\
  const blogId=draggingNode.data.blogId
  const pBlogId=parentNode.data.blogId
  //需要重新排序的博客Id
  const blogIds=[]
  parentNode.childNodes.forEach(element => {
    blogIds.push(element.data.blogId)
  });
  let params={
    blogId,
    pBlogId,
    blogIds:blogIds.join(",")
  }
  let result = await proxy.Request({
    url:api.updateSpecialBlogSort,
    params
  })
  if(!result) return
  //重新加载文章树
  loadBlogList()
}
const blogDetailRef=ref(null)
const showDetail=(data)=>{
   blogDetailRef.value.showDetail(data)
}
</script>

<style lang="less">
.tree-panel {
  height: calc(100vh - 299px);
  overflow: auto;
  .el-tree-node__content{
    flex: 1;
  }
  .custom-node-style {
  display: flex;
  flex: 1;
  justify-content: space-between;
  }
}

</style>