<script setup>
import { ref, onMounted } from 'vue';
import {ElSelect, ElOption, ElRow, ElCol, ElCard, ElPagination, ElMessage, ElMessageBox} from 'element-plus';
import {getAllReservationService} from "@/api/roommanage.js";
const reservationList=ref([]);
const getAllReservation = async () => {
  let result = await getAllReservationService();
  if (result.success === 1) {
    reservationList.value = result.data;
  } else {
    ElMessage.error(result.message);
  }
}
onMounted(()=>{
  getAllReservation();
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>订单记录</span>
      </div>
    </template>
    <el-table :data="reservationList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="用户id" prop="uid"></el-table-column>
      <el-table-column label="预约位置" prop="name"></el-table-column>
      <el-table-column label="预约开始" prop="startTime"></el-table-column>
      <el-table-column label="预约结束" prop="endTime"></el-table-column>
      <el-table-column label="预约编码" prop="code"></el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>