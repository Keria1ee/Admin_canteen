<template>
  <el-container class="comment-container">
    <el-header v-if="selectedDishFilter!==''&& filteredComments.length !== 0 " style="text-align: center;">
      <span>{{selectedDishFilter}}平均得分：{{showRating}}</span>
    </el-header>
    <el-main>
      <div class="filter-container" style="text-align: left;">
        <el-select v-model="selectedDishFilter" placeholder="筛选菜品" clearable @clear="clearFilter" @change="handleSelectionChange">
          <el-option
              v-for="dish in dishes"
              :key="dish.id"
              :label="dish.dishname"
              :value="dish.dishname"
          />
        </el-select>
      </div>
      <el-empty v-if="filteredComments.length === 0" description="No comments yet." />
      <div class="comment-list">
        <comment-card
            v-for="comment in paginatedComments"
            :key="comment.cid"
            :avatar-url="comment.avatarUrl"
            :username="comment.uid"
            :dish-name="comment.dishname"
            :comment="comment.comment"
            :rating="comment.rating"
            :comment-time="comment.time"
            @update:rating="(newRating) => comment.rating = newRating"
        />
        <el-pagination
            layout="prev, pager, next"
            :total="filteredComments.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-main>
  </el-container>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import CommentCard from '@/components/commentcardMa.vue';
import { commentListService,getDish, getDishList,getAveRatingService } from "@/api/commentmanage.js";
import { ElMessage } from 'element-plus';
import { useTokenStore } from "@/stores/token.js";

const uid = useTokenStore().getData().id;

const showRating = ref(''); // 展示菜品评分
const selectedDishId = ref('');

const comments = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const dishes = ref([]); // 菜品列表
const selectedDishFilter = ref(''); // 筛选的菜品名

const fetchComments = async () => {
  try {
    let result = await commentListService();
    if (result.success === 1) {
      comments.value = result.data;
      for (let i = 0; i < comments.value.length; i++) {
        comments.value[i].dishname = await getdishname(comments.value[i].dishid);
        comments.value[i].avatarUrl = 'src/assets/avatar.jpg';

      }

    } else {
      ElMessage.error('Failed to load comments.');
    }
  } catch (error) {
    ElMessage.error('An error occurred while fetching comments.');
  }
};

const getdishname = async (dishid) => {
  let result = await getDish(dishid);
  try {
    if (result.success === 1) {
      return result.data.dishname;
    } else {
      console.log('获取菜品名称失败');
    }
  } catch (e) {
    console.log(e);
  }
};

const fetchDishes = async () => {
  try {
    let result = await getDishList();
    if (result.success === 1) {
      dishes.value = result.data;
    } else {
      console.error('Failed to load dishes.');
    }
  } catch (error) {
    console.error('An error occurred while fetching dishes:', error);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const filteredComments = computed(() => {
  if (selectedDishFilter.value) {
    let total=0;
    let newcomment=comments.value.filter(comment => comment.dishname === selectedDishFilter.value);
    newcomment .forEach(comment => {
      total += comment.rating;
    });
    showRating.value = (total/newcomment.length).toFixed(2);
    return newcomment;
  }
  return comments.value;

});

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredComments.value.slice(start, end);
});



const clearFilter = () => {
  selectedDishFilter.value = '';
};

// 处理选项变化，根据ID找到对应的菜品对象
const handleSelectionChange = (selectedDishFilter) => {
  let selectedDish = dishes.value.find(dish => dish.dishname === selectedDishFilter);
  if (selectedDish) {
    selectedDishId.value = selectedDish.id;
    /*getAveRating(selectedDishId.value);*/
  } else {
    // 如果找不到匹配的菜品（例如清除选择时），可以重置id
    selectedDishId.value = '';
  }
};
const getAveRating = async (data) => {
  let result= await getAveRatingService (data);
  if (result.success === 1) {
    showRating.value = result.data;
  } else {
    /*console.error('Failed to load dish average rating.');*/
  }
}
onMounted(() => {
  fetchComments();
  fetchDishes();
});
</script>


<style scoped>
.comment-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.comment-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: center;
}

.comment-input {
  min-height: 400px;
}
</style>