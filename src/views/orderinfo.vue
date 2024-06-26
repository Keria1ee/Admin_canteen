<script setup>
import { ref, computed, onMounted } from 'vue';
import {ElSelect, ElOption, ElRow, ElCol, ElCard, ElPagination, ElMessage, ElMessageBox} from 'element-plus';
import {getAllOrderService} from "@/api/ordermanage.js";
import {dishListService} from "@/api/dishmanage.js";
const orderList=ref([]);
const getAllOrder = async () => {
  let result = await getAllOrderService();
  if (result.success === 1) {
    orderList.value = result.data;
  } else {
    ElMessage.error(result.message);
  }
}
//获取dishid与dishname的映射
const dishMap=ref({});
const dishNameList=async ()=>{
  let result=await dishListService();
  if (result.success === 1) {
    if (result.data && result.data.length > 0) {
      // 处理数据，构建dishMap
      dishMap.value = result.data.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id] = currentValue.dishname;
        return accumulator;
      }, {});
    }
  }
}
onMounted(()=>{
  getAllOrder();
  dishNameList();
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>订单记录</span>
      </div>
    </template>
    <el-table :data="orderList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="用户id" prop="uid"></el-table-column>
      <el-table-column label="菜品ID" prop="dishid"></el-table-column>
      <el-table-column label="菜品名称">
      <template #default="scope">
        <!-- 使用dishMap根据当前行的id获取菜品名称 -->
        {{ dishMap[scope.row.dishid] }}
      </template>
      </el-table-column>
      <el-table-column label="预定时间" width="300" prop="time"></el-table-column>
      <el-table-column label="预定数量" prop="num"></el-table-column>
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