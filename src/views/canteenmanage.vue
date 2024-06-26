<script setup>
import { ref } from 'vue'
import {onMounted} from "vue"
import card from '@/components/canteenMaList.vue'
import {canteenListService,addCanteenService} from'@/api/canteenmanage.js'
import {ElMessage} from "element-plus";
import {useTokenStore} from "@/stores/token.js";

const canteenList = ref([])
const getCanteenList = async () => {
  let result = await canteenListService();

  if (result.success === 1) {
    canteenList.value = result.data.sort((a, b) => a.id - b.id);
  } else {
    ElMessage.error('获取食堂信息失败');
  }
}
const addVisible=ref(false);
const addModel=ref({
  image:'',
  location:'',
  name:''
})
//添加分类表单校验
const rules = {
  image: [
    { required: true, message: '请输入图片url', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '请输入食堂地址', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入食堂名称', trigger: 'blur' }
  ]
}
const addCanteen = async () => {
  //调用接口
  let result = await addCanteenService(addModel.value);
  if (result.success === 1) {
    canteenList.value = result.data;
    await getCanteenList()
  } else {
    ElMessage.error('获取食堂信息失败');
  }

  await getCanteenList();
  addVisible.value = false;
}
const clearData=()=>{
  addModel.value.image='';
  addModel.value.location='';
  addModel.value.name='';
}
const handleRefresh = () => {
  getCanteenList();
};
/*// 使用计算属性对列表进行排序
const sortedCanteenList = computed(() => {
  return canteenList.value.slice().sort((a, b) => a.id - b.id);
});*/
onMounted(() => {
  getCanteenList();
})
</script>


<template>
  <div>
      <div class="header">
        <span>食堂列表</span>
        <div class="extra">
          <el-button type="primary" @click="addVisible = true;clearData()">添加食堂</el-button>
        </div>

      </div>
    <br>
    <br>
    <div v-if="canteenList.length > 0">
      <card
          v-for="canteen in canteenList"
          :key="canteen.id"
          :ID="canteen.id"
          :location="canteen.location"
          :imageSrcs="[canteen.image]"
          :mainText="canteen.name"
          :description="canteen.introduction"
          :cardinfom="[canteen.special1, canteen.special2, canteen.special3]"
          @refresh="handleRefresh"
      />
    </div>
    <div v-else>
      <p>暂无食堂信息</p>
    </div>
  </div>
  <!-- 食堂添加弹窗 -->
  <el-dialog v-model="addVisible" title="添加食堂" width="30%">
    <el-form :model="addModel" :rules="rules" label-width="100px" style="padding-right: 30px">
      <el-form-item label="食堂图片" prop="image">
        <el-input v-model="addModel.image" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="食堂地址" prop="location">
        <el-input v-model="addModel.location" minlength="1" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="食堂名称" prop="name">
        <el-input v-model="addModel.name" minlength="1" maxlength="15"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取消</el-button>
                    <el-button type="primary" @click="addCanteen();"> 确认 </el-button>
                </span>
    </template>
  </el-dialog>
</template>
<style>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header span {
  font-size: 24px; /* 添加这一行来改变文本字体大小 */
}
</style>