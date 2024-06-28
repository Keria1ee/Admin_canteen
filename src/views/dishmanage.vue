<script setup>
import {
  Edit,
  Delete,
  Refresh
} from '@element-plus/icons-vue'
import {getPreorderList} from '@/api/preorder.js'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";

import {
  deleteDishService,
  dishListService,
  editDescribeService,
  editNameService,
  editPriceService,
  editAllService,
  editImageService,
  editExtendService,
  addDishService,
  searchNameService
} from "@/api/dishmanage.js";
import {orderStockService} from "@/api/ordermanage.js";
import {useTokenStore} from "@/stores/token.js";

const dishData=ref([]);
const state = ref('');
const dishNameList = ref([
])
// 声明一个异步函数
const dishList = async () => {
  let result = await dishListService();
  if (result.success === 1) {
    dishData.value = result.data;
    result.data.forEach(item => {
      dishNameList.value.push(item.dishname);
    });
  } else {
    ElMessage.error(result.message);
  }
}
const querySearch = (queryString, cb) => {
  const results = queryString
      ? dishNameList.value.filter(dish => dish.toLowerCase().includes(queryString.toLowerCase()))
      : dishNameList.value;
  cb(results)
}

const handleSelect = async (item) => {
  state.value = item;
  let result = await searchNameService(item);
  if (result.success === 1) {
    dishData.value = result.data;
  }

}
const refreshList = async()=>{
  state.value = '';
  await dishList();
}
//控制添加分类弹窗
const addVisible = ref(false);
const addModel=ref({
  dishname:'',
  image:'',
  price:''
})
const rules_add={
  dishname: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
  ],
  image: [
    { required: true, message: '请输入图片url', trigger: 'blur' },
  ],
  price: [
    { required: true, message: '请输入菜品价格', trigger: 'blur' },
  ]
}
const addDish=async ()=>{
  let result = await addDishService(addModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '菜品添加成功',
    })
    await dishList();
  } else {
    ElMessage.error(result.message);
  }
}
const rules_dish = {
  dishname: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
  ],
  price: [
    { required: true, message: '请输入菜品价格', trigger: 'blur' },
  ],
  image: [
    { required: true, message: '请输入图片url', trigger: 'blur' }
  ]
}
const nameVisible = ref(false);
const nameModel=ref({
  dishid:'',
  dishname:''
})
const rules_name={
  dishname: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
  ]
}
const showName=async (row)=>{
  nameVisible.value=true;
  nameModel.value.dishid=row.id;
  nameModel.value.dishname=row.dishname;

}
const editName=async ()=>{
  let result = await editNameService(nameModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '菜品名称修改成功',
    })
    await dishList();
  } else {
    ElMessage.error(result.message);
  }
}
const editVisible = ref(false);
const editModel=ref({
  describe:'',
  dishname:'',
  extend:'',
  id:'',
  image:'',
  price:''
})
const rules_edit={
  dishname: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
  ],
  describe: [
    { required: true, message: '请输入菜品描述', trigger: 'blur' },
  ],
  image: [
    { required: true, message: '请输入图片url', trigger: 'blur' }
  ],
  extend: [
    { required: true, message: '请输入菜品热量', trigger: 'blur' },
  ],
  price: [
    { required: true, message: '请输入菜品价格', trigger: 'blur' },
  ]
}
const showEdit=async (row)=>{
  editVisible.value=true;
  editModel.value.id=row.id;
  editModel.value.dishname=row.dishname;
  editModel.value.extend=row.extend;
  editModel.value.price=row.price;
  editModel.value.describe=row.describe;
  editModel.value.image=row.image;
}
const editAll=async ()=>{
  console.log(editModel.value)
  let result = await editAllService(editModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '菜品修改成功',
    })
    await dishList();
  } else {
    ElMessage.error(result.message);
  }
}
const extendVisible = ref(false);
const extendModel=ref({
  dishid:'',
  extend:''
})
const rules_extend={
  extend: [
    { required: true, message: '请输入菜品热量', trigger: 'blur' },
  ]
}
const showExtend=async (row)=>{
  extendVisible.value=true;
  extendModel.value.dishid=row.id;
  extendModel.value.extend=row.extend;
}
const editExtend=async ()=>{
  let result = await editExtendService(extendModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '菜品热量修改成功',
    })
    await dishList();
  } else {
    ElMessage.error(result.message);
  }
}
const imageVisible = ref(false);
const imageModel=ref({
  dishid:'',
  image:''
})
const rules_image={
  image: [
    { required: true, message: '请输入菜品图片', trigger: 'blur' },
  ]
}
const showImage=async (row)=>{
  imageVisible.value=true;
  imageModel.value.dishid=row.id;
  imageModel.value.image=row.image;
}
const editImage=async ()=>{
  let result = await editImageService(imageModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '菜品图片修改成功',
    })
    await dishList();
  } else {
    ElMessage.error(result.message);
  }
}
const describeVisible = ref(false);
const describeModel=ref({
  describe:'',
  dishid:''
})
const rules_describe={
  describe: [
    { required: true, message: '请输入菜品描述', trigger: 'blur' },
  ]
}
const showDescribe=async (row)=>{
  describeVisible.value=true;
  describeModel.value.dishid=row.id;
  describeModel.value.describe=row.describe;
}
const editDescribe=async ()=>{
  let result = await editDescribeService(describeModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '菜品描述修改成功',
    })
    await dishList();
  } else {
    ElMessage.error(result.message);
  }
}
const priceVisible = ref(false);
const priceModel=ref({
  dishid:'',
  price:''
})
const rules_price={
  price: [
    { required: true, message: '请输入菜品价格', trigger: 'blur' },
  ]
}
const showPrice=async (row)=>{
  priceVisible.value=true;
  priceModel.value.dishid=row.id;
  priceModel.value.price=row.price;
}
const editPrice=async ()=>{
  let result = await editPriceService(priceModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '菜品价格修改成功',
    })
    await dishList();
  } else {
    ElMessage.error(result.message);
  }
}




//控制标题的展示

const deleteDish = (row) => {
  //提示用户  确认框

  ElMessageBox.confirm(
      '你确认要删除该菜品吗?',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //调用接口
        console.log(row.id);
        let result = await deleteDishService(row.id);
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        await dishList();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

const adddishuploadSuccess = (response) => {
  addModel.value.image = response.data;
}

const updatimguploadSuccess = (response) => {
  imageModel.value.image = response.data;
}
const updatedishuploadSuccess = (response) => {
  editModel.value.image = response.data;
}

onMounted(()=>{
  dishList();

})
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>菜品</span>
        <el-button :icon="Refresh" circle plain type="primary" @click="refreshList"></el-button>

          <el-autocomplete
              v-model="state"
              :fetch-suggestions="querySearch"
              popper-class="my-autocomplete"
              clearable
              class="inline-input w-50"
              placeholder="请输入菜品名称"
              @select="handleSelect"
          >
            <template #default="{ item }">
              <div class="value">{{ item }}</div>
            </template>
          </el-autocomplete>
          <el-button type="primary" @click="addVisible = true;">添加菜品</el-button>

      </div>
    </template>
    <el-table :data="dishData" style="width: 100%">
      <el-table-column label="ID" width="50" prop="id"> </el-table-column>
      <el-table-column label="菜品名称" prop="dishname"></el-table-column>
      <el-table-column label="菜品简介" prop="describe" width="280"></el-table-column>
      <el-table-column label="菜品图片" width="280">
        <template #default="scope">
          <el-image
              style="width: 100%; height: auto"
              :src="scope.row.image"
              :fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="热量" prop="extend"></el-table-column>
      <el-table-column label="菜品价格" prop="price"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-dropdown trigger="click">
            <el-button :icon="Edit" circle plain type="primary"></el-button>
            <template #dropdown>
              <el-dropdown-item command="editDish" @click="showEdit(row)">更新菜品</el-dropdown-item>
              <el-dropdown-item command="editName" @click="showName(row)">更新名称</el-dropdown-item>
              <el-dropdown-item command="editDescription" @click="showDescribe(row)">更新描述</el-dropdown-item>
              <el-dropdown-item command="editImage" @click="showImage(row)">更新图片</el-dropdown-item>
              <el-dropdown-item command="editExtent" @click="showExtend(row)">更新热量</el-dropdown-item>
              <el-dropdown-item command="editPrice" @click="showPrice(row)">更新价格</el-dropdown-item>
            </template>
          </el-dropdown>
          <el-button :icon="Delete" circle plain type="primary" @click="deleteDish(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 添加菜品弹窗 -->
    <el-dialog v-model="addVisible" title="添加菜品" width="30%">
      <el-form :model="addModel" :rules="rules_add" label-width="100px" style="padding-right: 30px">
        <el-form-item label="菜品名称" prop="dishname">
          <el-input v-model="addModel.dishname" minlength="1" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="菜品图片" prop="image">
          <el-upload
              action="/api/file/upload"
              :onSuccess="adddishuploadSuccess"
              :show-file-list="false"
              :auto-upload="true"
              name="file"
              :headers="{'token':useTokenStore().getToken()}"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-input v-model="addModel.image" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input v-model="addModel.price" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dish-footer">
                    <el-button @click="addVisible = false">取消</el-button>
                    <el-button type="primary" @click="addDish();addVisible = false"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 更新菜品描述弹窗 -->
    <el-dialog v-model="describeVisible" title="更新描述" width="30%">
      <el-form :model="describeModel" :rules="rules_describe" label-width="100px" style="padding-right: 30px">
        <el-form-item label="菜品描述" prop="describe">
          <el-input v-model="describeModel.describe" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dish-footer">
                    <el-button @click="describeVisible = false">取消</el-button>
                    <el-button type="primary" @click="editDescribe();describeVisible = false"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 更新菜品名称弹窗 -->
    <el-dialog v-model="nameVisible" title="更新名称" width="30%">
      <el-form :model="nameModel" :rules="rules_name" label-width="100px" style="padding-right: 30px">
        <el-form-item label="菜品名称" prop="dishname">
          <el-input v-model="nameModel.dishname" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dish-footer">
                    <el-button @click="nameVisible = false">取消</el-button>
                    <el-button type="primary" @click="editName();nameVisible = false"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 更新菜品价格弹窗 -->
    <el-dialog v-model="priceVisible" title="更新价格" width="30%">
      <el-form :model="priceModel" :rules="rules_price" label-width="100px" style="padding-right: 30px">
        <el-form-item label="菜品名称" prop="price">
          <el-input v-model="priceModel.price" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dish-footer">
                    <el-button @click="priceVisible = false">取消</el-button>
                    <el-button type="primary" @click="editPrice();priceVisible = false"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 更新菜品图片弹窗 -->
    <el-dialog v-model="imageVisible" title="更新图片" width="30%">
      <el-form :model="imageModel" :rules="rules_image" label-width="100px" style="padding-right: 30px">
        <el-upload
            action="/api/file/upload"
            :onSuccess="updatimguploadSuccess"
            :show-file-list="false"
            :auto-upload="true"
            name="file"
            :headers="{'token':useTokenStore().getToken()}"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-form-item label="菜品图片" prop="image">
          <el-input v-model="imageModel.image" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dish-footer">
                    <el-button @click="imageVisible = false">取消</el-button>
                    <el-button type="primary" @click="editImage();imageVisible = false"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 更新菜品扩展弹窗 -->
    <el-dialog v-model="extendVisible" title="更新热量" width="30%">
      <el-form :model="extendModel" :rules="rules_extend" label-width="100px" style="padding-right: 30px">
        <el-form-item label="菜品热量" prop="extend">
          <el-input v-model="extendModel.extend" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dish-footer">
                    <el-button @click="extendVisible = false">取消</el-button>
                    <el-button type="primary" @click="editExtend();extendVisible = false"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 更新菜品弹窗 -->
    <el-dialog v-model="editVisible" title="更新菜品" width="30%">
      <el-form :model="editModel" :rules="rules_edit" label-width="100px" style="padding-right: 30px">
        <el-form-item label="菜品名称" prop="dishname">
          <el-input v-model="editModel.dishname" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="菜品描述" prop="describe">
          <el-input v-model="editModel.describe" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="菜品图片" prop="image">
            <el-upload
                action="/api/file/upload"
                :onSuccess="updatedishuploadSuccess"
                :show-file-list="false"
                :auto-upload="true"
                name="file"
                :headers="{'token':useTokenStore().getToken()}"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          <el-input v-model="editModel.image" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="菜品热量" prop="extend">
          <el-input v-model="editModel.extend" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input v-model="editModel.price" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dish-footer">
                    <el-button @click="editVisible = false">取消</el-button>
                    <el-button type="primary" @click="editAll();editVisible = false"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    gap: 16px; /* Adjust the gap as needed */
  }
}
</style>