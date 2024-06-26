<script setup>
import {
  Edit,
  Delete,
  Finished
} from '@element-plus/icons-vue'
import {orderListService, orderStockService, dishListService} from '@/api/ordermanage.js'
import {onMounted, ref} from 'vue'
import {ElMessage} from "element-plus";


const orderData = ref([]);

// 声明一个异步函数
const orderList = async () => {
  let result = await orderListService();
  if (result.success === 1) {
    orderData.value = result.data;
  } else {
    ElMessage.error(result.message);
  }
};

//获取dishid与dishname的映射
const dishMap = ref({});
const dishNameList = async () => {
  let result = await dishListService();
  if (result.success === 1) {
    if (result.data && result.data.length > 0) {
      // 处理数据，构建dishMap
      dishMap.value = result.data.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id] = currentValue.dishname;
        return accumulator;
      }, {});
    }
  }
};

const saveChanges = async (row) => {
  row.time = formatDate(row.time);
  let result = await orderStockService(row);
  if (result.success === 1) {
    ElMessage({
      type: 'success',
      message: '库存设置成功',
    });
  } else {
    log(result.message);
    ElMessage.error(result.message);
  }
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



onMounted(() => {
  orderList();
  dishNameList();
});
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>今日菜品预定情况</span>
      </div>
    </template>
    <el-table :data="orderData" style="width: 100%">
      <el-table-column label="食堂ID" width="100" prop="canteenid"></el-table-column>
      <el-table-column label="菜品ID" width="100" prop="id"></el-table-column>
      <el-table-column label="菜品名称" width="180">
        <template #default="scope">
          <!-- 使用dishMap根据当前行的id获取菜品名称 -->
          {{ dishMap[scope.row.id] }}
        </template>
      </el-table-column>
      <el-table-column label="预定时间" prop="time" width="200">
        <template #default="scope">
          <el-date-picker v-model="scope.row.time" type="datetime" placeholder="选择时间"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="预定量" prop="ordernum" width="200">
        <template #default="scope">
          <el-input-number v-model.number="scope.row.ordernum" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="库存量" prop="stock" width="200">
        <template #default="scope">
          <el-input-number v-model.number="scope.row.stock" :min="0" :max="500"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="设定" width="100">
        <template #default="{ row }">
          <el-button :icon="Finished" circle plain type="primary" @click="saveChanges(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: #f5f5f5;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .el-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .el-table th, .el-table td {
    text-align: center;
  }

  .el-button {
    margin: 0 auto;
  }

  .el-date-picker, .el-input-number {
    width: 100%;
  }
}
</style>
