<template>
  <div>
    <el-button type="danger" @click="showEdit('add')">新增分类</el-button>
    <Table
      :columns="columns"
      :showPagination="false"
      :dataSource="tableData"
      :fetch="localDataList"
      :options="tableOptions"
    >
      <template #cover="{ row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <template #op="{ index, row }">
        <div class="op">
          <a
            href="javascript:void(0)"
            class="a-link"
            @click="showEdit('update', row)"
            >修改</a
          >
          <el-divider direction="vertical" />
          <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
          <el-divider direction="vertical" />
          <a
            href="javascript:void(0)"
            :class="[index == 0 ? 'not-allow' : 'a-link']"
            @click="changeSort(index, 'up')"
            >上移</a
          >
          <el-divider direction="vertical" />
          <a
            href="javascript:void(0)"
            :class="[
              index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
            ]"
            @click="changeSort(index, 'down')"
            >下移</a
          >
        </div>
      </template>
    </Table>
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
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  "localDataList": "/category/loadAllCategory4Blog",
  "saveCategory": "category/saveCategory4Blog",
  "delCategory": "category/delCategory4Blog",
  "changeSort": "category/changeCategorySort4Blog",
};
// const userInfo = ref(proxy.VueCookies.get("userInfo") || {})
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
  extHeight: 10,
};
const localDataList = async () => {
  let result = await proxy.Request({
    url: api.localDataList,
  });
  if (!result) {
    return;
  }
  tableData.list = result.data;
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
    localDataList();
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
    localDataList();
  });
};
const changeSort = async (index, type) => {
  let category = tableData.list;
  if (
    (type === "down" && index === category.length - 1) ||
    (type === "up" && index === 0)
  ) {
    return;
  }
  let temp = category[index];
  let number = type == "down" ? 1 : -1;
  category.splice(index, 1);
  category.splice(index + number, 0, temp);
  console.log(JSON.stringify(category));
  let result = await proxy.Request({
    url: api.changeSort,
    dataType: "json",
    params: category,
  });
  if (!result) {
    return;
  }
  proxy.message.success("重新排序成功");
  localDataList();
};
</script>

<style>
</style>