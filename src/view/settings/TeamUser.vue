<template>
  <div>
    <el-form :model="searchFormData" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="昵称" prop="nickName">
            <el-input
              placeholder="请输入昵称"
              v-model="searchFormData.nickNameFuzzy"
              clearable
              @keyup.enter="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="手机号" prop="phone">
            <el-input
              placeholder="请输入手机号"
              v-model="searchFormData.phoneFuzzy"
              clearable
              @keyup.enter="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" style="padding-left: 15px">
          <el-button type="primary" @click="loadDataList">搜索</el-button>
          <el-button type="danger" @click="showEdit('add')">新增成员</el-button>
        </el-col>
      </el-row>
    </el-form>
    <Table
      :columns="columns"
      :showPagination="true"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <!-- 头像 -->
      <template #avatar="{ row }">
        <Cover :cover="row.avatar"></Cover>
      </template>

      <template #userInfo="{ row }">
        <div>昵&nbsp;&nbsp;&nbsp;&nbsp;称：{{ row.nickName }}</div>
        <div>手机号：{{ row.phone }}</div>
        <div>职&nbsp;&nbsp;&nbsp;&nbsp;业：{{ row.profession }}</div>
      </template>

      <template #roleInfo="{ row }">
        <div>{{ row.roleTypeName }}</div>
      </template>

      <template #statusInfo="{ row }">
        <div>
            <span :style="{ color: row.status == 1 ? 'red' : 'green' }">{{ row.statusName }}</span>
        </div>
        
      </template>
      <!-- 时间 -->
      <template #timeInfo="{ row }">
        <div>创建时间：{{ row.createTime }}</div>
        <div>最后登录时间：{{ row.lastLoginTime }}</div>
      </template>
      <template #operation="{ row }">
        <div class="operation">
          <span v-if="userInfo.roleType == 1">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showEdit('edit', row)">修改</a>

            <el-divider direction="vertical" />
            <a href="javascript:void(0)" class="a-link" @click="changeAccountStatus(row)"
              >{{ row.status== 0 ? "启用" : "禁用" }}</a
            >
            <el-divider direction="vertical" />
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showUpdatePassword(row.userId)"
              >修改密码</a
            >
            <el-divider direction="vertical" />
            <a href="javascript:void(0)" class="a-link" @click="delUser(row)">删除</a>
          </span>
          <span v-else>---</span>
         </div>
      </template>
    </Table>

    <!-- 新增成员弹窗 -->
    <Dialog
      :show="editDialogInfo.show"
      :title="editDialogInfo.title"
      :buttons="editDialogInfo.buttons"
      @close="editDialogInfo.show = false"
      width="800px"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="editFormRef"
        label-width="110px"
      >
      <el-row :gutter="10">
        <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
          <el-input v-model="formData.nickName" maxlength="10">
          </el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" maxlength="11">
          </el-input>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="formData.userId == null">
        <el-col :span="12">
            <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" maxlength="20">
          </el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="再次输入密码" prop="rePassword">
          <el-input v-model="formData.rePassword" type="password" maxlength="20"></el-input>
        </el-form-item>
        </el-col>
      </el-row>
       <el-row :gutter="10">
        <el-col :span="12">
            <el-form-item label="默认编辑器" prop="editorType">
            <el-radio-group v-model="formData.editorType">
              <el-radio :label="0" :value="0">富文本编辑器</el-radio>
              <el-radio :label="1" :value="1">MarkDown编辑器</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业" prop="profession">
            <el-input v-model="formData.profession"></el-input>
          </el-form-item>
        </el-col>
       </el-row>
       <el-row :gutter="10">
        <el-col :span="24">
            <el-form-item label="头像" prop="avatar">
            <CoverUpload v-model="formData.avatar"></CoverUpload>
          </el-form-item>
        </el-col>
       </el-row>
       <el-row :gutter="10">
        <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
                <EditorHtml :v-model="formData.introduction" id="introduction" height="300" ref="introduction"></EditorHtml>
          </el-form-item>
        </el-col>
       </el-row>
      </el-form>
    </Dialog>
<!-- 修改密码 -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="dialogConfig.show = false"
      width="400px"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="passwordFormRef"
        label-width="80px"
      >
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="formData.password" type="password">
          </el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePassword">
          <el-input placeholder="请再次输入密码" v-model="formData.rePassword" type="password"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  "loadDataList": "setting/loadUser",
  "saveTeamUser":"setting/saveTeamUser",
  "delUser":"/setting/delUser",
  "updateStatus":"setting/updateStatus",
  "updatePassword":"/setting/updatePassword"
};
const userInfo = ref({ roleType: 1 });
const searchFormData = reactive({});
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchFormData);
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};
//列表
const columns = [
  {
    label: "头像",
    prop: "avatar",
    width: 80,
    scopedSlots: "avatar",
  },
  {
    label: "用户信息",
    prop: "nickName",
    scopedSlots: "userInfo",
  },
  {
    label: "默认编辑器",
    width: 150,
    prop: "editorTypeName",
  },
  {
    label: "角色",
    prop: "roleTypeName",
    width: 150,
    scopedSlots: "roleInfo",
  },
  {
    label: "状态",
    prop: "statusInfo",
    scopedSlots: "statusInfo",
    width: 150,
  },
  {
    label: "时间",
    prop: "createTime",
    width: 300,
    scopedSlots: "timeInfo",
  },
  {
    label: "操作",
    prop: "operation",
    width: 250,
    scopedSlots: "operation",
  },
];
//定义为reactive的话要用Object.assign复制
const tableData = ref({});
const tableOptions = {
  extHeight: 10,
};
//新增、修改账号
const editDialogInfo = reactive({
    show:false,
    title:"新增用户",
    buttons:[{
        type: "danger",
        text:"确定",
        click:()=>{
            submitForm()
        }
    }]
})
const formData=ref({})
const editFormRef = ref();
const showEdit = (type, data) => {
  editDialogInfo.show = true;
  nextTick(async () => {
    editFormRef.value.resetFields();
    if (type === "add") {
      editDialogInfo.title = "新增账号";
      editDialogInfo.edit=false
      formData.value={
        introduction:" "
      }
    } else if(type==="edit"){
      editDialogInfo.title = "修改账号";
      editDialogInfo.edit=true
      Object.assign(formData.value,data)
    }
  });
};
const submitForm = () => {
  editFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    delete params.createTime
    delete params.lastLoginTime
    let result = await proxy.Request({
      url: api.saveTeamUser,
      params,
    });
    if (!result) {
      return;
    }
    editDialogInfo.show = false;
    proxy.message.success("保存成功");
    loadDataList();
  });
};
const validateRePass = (rule, value, callback) => {
  if (value !== formData.value.password) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const rules = {
  nickName: [{ required: true, message: "昵称不能为空" }],
  editorType: [{ required: true, message: "请选择默认编辑器" }],
  password: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码最少8位，只能数字字母和特殊字符",
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: validateRePass,
      message: "两次输入的密码不一致",
    },
  ],
  phone: [
    { required: true, message: "请输入手机号" },
    {
      validator: proxy.Verify.phone,
      trigger: "blur",
      message: "请输入正确的手机号",
    },
  ],
};
//修改状态
const changeAccountStatus = (data) => {
    let status = data.status == 0 ? 1 : 0
    let statusName = data.status == 0 ? "启用" : "禁用"
    proxy.Confirm(`你确定要【${statusName}】${data.nickName}吗`, async () => {
    let result = await proxy.Request({
      url: api.updateStatus,
      params: {
        userId: data.userId,
        status
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};
//删除
const delUser = (data) => {
  proxy.Confirm(`你确定要删除${data.nickName}吗`, async () => {
    let result = await proxy.Request({
      url: api.delUser,
      params: {
        userId: data.userId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};
//修改密码
const passwordFormRef=ref(null)
const dialogConfig = reactive({
  show: false,
  title: "修改密码",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
        submitPass()
      },
    },
  ],
});
const showUpdatePassword=(userId)=>{
  dialogConfig.show=true
  nextTick(()=>{
    passwordFormRef.value.resetFields()
    formData.value={ userId }
  })
}
const submitPass=()=>{
  passwordFormRef.value.validate(async (valid)=>{
    if(!valid) return
    let result = await proxy.Request({
      url:api.updatePassword,
      params:{
        userId:formData.value.userId,
        password:formData.value.password
      }
    })
    if(!result) return
    dialogConfig.show=false
    proxy.message.success("密码修改成功")
  })
}
</script>

<style>
</style>