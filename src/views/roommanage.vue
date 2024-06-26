<template>
  <div class="room-listing-container">
    <div class="filter-container">
      <el-button type="primary" round @click="clearAdd();addVisible = true;">添加包厢</el-button>
      <el-select v-model="selectedName" placeholder="按名字筛选" @change="handleFilterChange" size="large" clearable>
        <el-option v-for="item in uniqueNames" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="selectedTimeRange" placeholder="按时间段筛选" @change="handleFilterChange" size="large" clearable>
        <el-option v-for="item in uniqueTimeRanges" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <el-row :gutter="20" type="flex" justify="center">
      <el-col
          v-if="filteredData.length"
          v-for="(item, index) in pagedData"
          :key="item.id"
          :xs="24" :sm="12" :md="8" :lg="6" :xl="6"
          class="room-card-col"
      >
        <el-card class="room-card" shadow="hover" #default="{ row }">
          <h3 class="room-name">{{ item.name }}</h3>
          <p>
            <i class="el-icon-user-solid"></i> 空余数量: {{ item.number }}
          </p>
          <p>
            <i class="el-icon-time"></i> 时间段:
            <span class="time-highlight">{{ item.startTime }}</span> -
            <span class="time-highlight">{{ item.endTime }}</span>
          </p>
          <el-button type="primary" round @click="showNumber(item)">修改</el-button>
          <el-button :icon="Delete" circle plain type="primary" @click="deleteRoom(item)"></el-button>
        </el-card>
      </el-col>
      <el-col v-else :span="24" class="no-data-col">
        <el-empty description="无可用房间"></el-empty>
      </el-col>
    </el-row>

    <div class="pagination-container" v-if="totalPages > 1">
      <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="filteredData.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handlePageChange"
      />
    </div>
  </div>
  <!-- 添加包厢弹窗 -->
  <el-dialog v-model="addVisible" title="添加包厢" width="30%">
    <el-form :model="addModel" :rules="rules_add" label-width="100px" style="padding-right: 30px">
      <el-form-item label="包厢地址" prop="name">
        <el-input v-model="addModel.name" minlength="1" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="包厢数量" prop="number">
        <el-input v-model="addModel.number" minlength="1" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="包厢时间段" prop="segment">
        <el-select v-model="addModel.segment" placeholder="请选择时间段">
          <el-option
              v-for="(time, id) in segmentList"
              :key="id"
              :label="time"
              :value="id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dish-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addRoom();addVisible = false"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 余量修改弹窗 -->
  <el-dialog v-model="numberVisible" title="修改余量" width="30%">
    <el-form :model="numberModel" :rules="rules_number" label-width="100px" style="padding-right: 30px">
      <el-form-item label="包厢余量" prop="number">
        <el-input v-model="numberModel.number" minlength="1" maxlength="500"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
                <span class="dialog-footer">
                    <el-button @click="numberVisible = false">取消</el-button>
                    <el-button type="primary" @click="editNumber();numberVisible = false"> 确认 </el-button>
                </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {ElSelect, ElOption, ElRow, ElCol, ElCard, ElPagination, ElMessage, ElMessageBox} from 'element-plus';
import {
  Delete
} from '@element-plus/icons-vue';
import {getAllroom,addRoomService,editNumberService,deleteRoomService} from "@/api/roommanage.js";
const data = ref([]);
const currentPage = ref(1);
const pageSize = ref(9);
const selectedName = ref('');
const selectedTimeRange = ref('');

let segmentList={1:'08:00-10:00',2:'10:00-12:00',3:'12:00-14:00',4:'14:00-16:00',5:'16:00-18:00',6:'18:00-20:00'};
const addVisible = ref(false);
const addModel=ref({
  name:'',
  number:'',
  segment:''
})
const rules_add={
  name: [
    { required: true, message: '请输入包厢地址', trigger: 'blur' },
  ],
  number: [
    { required: true, message: '请输入包厢数量', trigger: 'blur' },
  ],
  segment: [
    { required: true, message: '请选择包厢时间段', trigger: 'blur' },
  ]
}
const addRoom=async ()=>{
  let result = await addRoomService(addModel.value);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '包厢添加成功',
    })
    await getRoomList();
  } else {
    ElMessage.error(result.message);
  }
}
const clearAdd = async ()=>{
  addModel.value.name = '';
  addModel.value.number = '';
  addModel.value.segment = '';
}
const numberVisible = ref(false);
const numberModel=ref({
  id:'',
  name:'',
  number:'',
  segment:''
})
//添加分类表单校验
const rules_number = {
  number: [
    { required: true, message: '请输入包厢余量', trigger: 'blur' }
  ]

}
const showNumber=async(item) =>{
  numberVisible.value=true;
  numberModel.value.id=item.id;
  numberModel.value.name=item.name;
  numberModel.value.segment=item.segment;
  numberModel.value.number=item.number;
}
const editNumber=async () => {
  //调用接口
  let result = await editNumberService(numberModel.value);
  if (result.success === 1) {
    await getRoomList();
  } else {
    ElMessage.error(result.message);
  }
  //重新显示
  numberVisible.value = false;
}
//控制标题的展示

const deleteRoom = (item) => {
  //提示用户  确认框

  ElMessageBox.confirm(
      '你确认要删除该包厢吗?',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //调用接口
        let result = await deleteRoomService(item.id);
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        await getRoomList();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}
const filteredData = computed(() => {
  let filtered = data.value;
  if (selectedName.value) {
    filtered = filtered.filter(item => item.name === selectedName.value);
  }
  if (selectedTimeRange.value) {
    const [start, end] = selectedTimeRange.value.split('-');
    filtered = filtered.filter(item => item.startTime === start && item.endTime === end);
  }
  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize.value);
});

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

const uniqueNames = computed(() => {
  const names = data.value.map(item => item.name);
  return [...new Set(names)];
});

const uniqueTimeRanges = computed(() => {
  const timeRanges = data.value.map(item => `${item.startTime}-${item.endTime}`);
  return [...new Set(timeRanges)];
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleFilterChange = () => {
  currentPage.value = 1; // 过滤条件变化时重置到第一页
};

const getRoomList = async () => {
  let result = await getAllroom();
  if (result.success === 1) {
    data.value = result.data;
  } else {
    ElMessage.error('获取房间信息失败');
  }
}
onMounted(() => {
  getRoomList();
});
</script>

<style scoped>
.room-listing-container {
  padding: 20px;
}
.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.room-card-col {
  margin-bottom: 20px;
}
.room-card {
  width: 100%;
}
.time-highlight {
  font-weight: bold;
}
.no-data-col {
  text-align: center;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
