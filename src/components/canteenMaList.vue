<template>
  <el-card shadow="hover">
    <el-main>
      <el-row :gutter="20" class="main-content">
        <el-col :span="6">
          <el-carousel :interval="4000" height="400px" >
            <el-carousel-item v-for="(src, index) in imageSrcs" :key="index">
              <img :src="src" alt="Image" class="main-image" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="18">
          <div class="header">
            <span>{{ ID+mainText }}</span>
            <br>
            <span>{{ location }}</span>
            <div class="extra">
              <el-button type="primary"
                         @click="introductionVisible = true;
                         introductionModel.id=props.ID;
                         introductionModel.introduction=props.description;">修改简介</el-button>
              <el-button type="primary"
                         @click="specialVisible = true;
                         specialModel.id=props.ID;
                         specialModel.special1=''+props.cardinfom[0];
                         specialModel.special2=''+props.cardinfom[1];
                         specialModel.special3=''+props.cardinfom[2]">修改特色菜</el-button>
              <el-button type="primary"
                         @click="editVisible = true;
                         editModel.id=props.ID;
                         editModel.image=props.imageSrcs;
                         editModel.location=props.location;
                         editModel.name=props.mainText;">修改基本信息</el-button>
            </div>

          </div>
          <p>{{ description }}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="card-container">
        <el-col :span="8" v-for="card in cards" :key="card.id">
          <el-card shadow="hover" class="card-container">
            <template #header>
              <div>
                <span>{{ card.dishname}}</span>
              </div>
            </template>
            <div class="card-content">
              <img :src="card.image" alt="Dish Image" class="card-image" />
              <div class="card-details">
                <span class="card-name">{{ card.dishname }}</span>
                <span class="card-describe">{{ card.describe }}</span>
                <div class="card-footer">
                  <span>价格: {{ card.price }}</span>

                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <!-- 基本信息修改弹窗 -->
    <el-dialog v-model="editVisible" title="修改基本信息" width="30%">
      <el-form :model="introductionModel" :rules="rules_edit" label-width="100px" style="padding-right: 30px">
        <el-form-item label="食堂图片" prop="image">
          <el-input v-model="editModel.image" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="食堂地址" prop="location">
          <el-input v-model="editModel.location" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="食堂名称" prop="name">
          <el-input v-model="editModel.name" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取消</el-button>
                    <el-button type="primary" @click="editOther()"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 简介修改弹窗 -->
    <el-dialog v-model="introductionVisible" title="修改简介" width="30%">
      <el-form :model="introductionModel" :rules="rules_introduction" label-width="100px" style="padding-right: 30px">
<!--        <el-form-item label="食堂ID" prop="id">
          <el-input v-model="introductionModel.id" minlength="1" maxlength="500"></el-input>
        </el-form-item>-->
        <el-form-item label="食堂简介" prop="introduction">
          <el-input v-model="introductionModel.introduction" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="introductionVisible = false">取消</el-button>
                    <el-button type="primary" @click="editIntroduction()"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 特色菜修改弹窗 -->
    <el-dialog v-model="specialVisible" title="修改特色菜" width="30%">
<!--      <el-form :model="specialModel" :rules="rules_special" label-width="100px" style="padding-right: 30px">
        <el-form-item label="特色菜1ID" prop="special1">
          <el-input v-model="specialModel.special1" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="特色菜2ID" prop="special2">
          <el-input v-model="specialModel.special2" minlength="1" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="特色菜3ID" prop="special3">
          <el-input v-model="specialModel.special3" minlength="1" maxlength="500"></el-input>
        </el-form-item>
      </el-form>-->
      <el-form :model="specialModel" :rules="rules_special" label-width="100px" style="padding-right: 30px">
        <el-form-item label="特色菜1" prop="special1">
          <el-select v-model="specialModel.special1" placeholder="请选择特色菜1">
            <el-option
                v-for="(name, id) in dishMap"
                :key="id"
                :label="name"
                :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特色菜2" prop="special2">
          <el-select v-model="specialModel.special2" placeholder="请选择特色菜2">
            <el-option
                v-for="(name, id) in dishMap"
                :key="id"
                :label="name"
                :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特色菜3" prop="special3">
          <el-select v-model="specialModel.special3" placeholder="请选择特色菜3">
            <el-option
                v-for="(name, id) in dishMap"
                :key="id"
                :label="name"
                :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="specialVisible = false">取消</el-button>
                    <el-button type="primary" @click="editSpecial()"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
  </el-card>

</template>

<script setup>
import { defineProps,ref } from 'vue';
import {
  ElCard,
  ElMain,
  ElRow,
  ElCol,
  ElCarousel,
  ElCarouselItem, ElMessage
} from 'element-plus';
import {onMounted} from "vue";
import {
  addCanteenService,
  dishidListService,
  editIntroductionService,
  editSpecialService,
  dishListService,
  editOtherService
} from '@/api/canteenmanage.js';
import {useRouter} from 'vue-router'
const router=useRouter()
// 定义传入的 props
const props = defineProps({
  ID:{
    type:String,
    required:true,
  },
  location:{
    type:String,
    required:true,
  },
  imageSrcs: {
    type: Array,
    required: true,
  },
  mainText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cardinfom: {
    type: Array,
    required: true,
    validator: value => value.length === 3,
  },
});

const emit = defineEmits(['refresh']);

const cards = ref([]);

const getdishList = async (specialid) => {
  let result = await dishidListService(specialid);
  try{
    if (result.success === 1) {
      cards.value = cards.value.concat(result.data);
    } else {
      ElMessage.error(result.message);
    }

  } catch (e) {
    console.log(e);
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

const editVisible = ref(false);
const editModel=ref({
  id:'',
  image:'',
  location:'',
  name:''
})
//添加分类表单校验
const rules_edit = {
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
const editOther =async ()=>{
  //调用接口
  let result = await editOtherService(editModel.value);
  if (result.success === 1) {
    emit('refresh');
  } else {
    ElMessage.error(result.message);
  }
  //重新显示
  editVisible.value = false;
}
const introductionVisible = ref(false);
const introductionModel=ref({
  id:'',
  introduction:''
})
//添加分类表单校验
const rules_introduction = {
  introduction: [
    { required: true, message: '请输入食堂简介', trigger: 'blur' }
  ]

}
const editIntroduction=async () => {
  //调用接口
  let result = await editIntroductionService(introductionModel.value);
  if (result.success === 1) {
    emit('refresh');
  } else {
    ElMessage.error(result.message);
  }
  //重新显示
  introductionVisible.value = false;
}
const specialVisible = ref(false);
const specialModel=ref({
  id:'',
  special1:'',
  special2:'',
  special3:''
})
//添加分类表单校验
const rules_special = {
  special1: [
    { required: true, message: '请输入特色菜ID1', trigger: 'blur' }
  ],
  special2: [
    { required: true, message: '请输入特色菜ID2', trigger: 'blur' }
  ],
  special3: [
    { required: true, message: '请输入特色菜ID3', trigger: 'blur' }
  ]

}
const editSpecial=async () => {
  //调用接口
  let result = await editSpecialService(specialModel.value);

  if (result.success === 1) {
    location.reload();
  } else {
    ElMessage.error(result.message);
  }
  //重新显示
  specialVisible.value = false;
}
onMounted(() => {
  for (let specialid of props.cardinfom){
    getdishList(specialid);
  }
  dishNameList();

})

</script>

<style scoped>
.main-card {
  border-radius: 10px;
}

.main-content {
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.text-section {
  padding: 20px;
}

.main-text {
  font-size: 2em;
  font-weight: bold;
}

.description {
  font-size: 1.2em;
  color: #555;
}

.card-container {
  margin-top: 20px;
}

.dish-card {
  border-radius: 10px;
  transition: transform 0.3s;
}

.dish-card:hover {
  transform: scale(1.05);
}

.card-header {
  font-size: 1.2em;
  font-weight: bold;
}

.card-content {
  display: flex;
  align-items: center;
}

.card-image {
  width: 150px;
  height: 150px;
  margin-right: 20px;
  object-fit: cover;
  border-radius: 10px;
}

.card-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-name {
  font-size: 1.5em;
  font-weight: bold;
}

.card-describe {
  margin-top: 10px;
  color: #666;
}

.card-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-footer span {
  font-size: 1.2em;
  color: #333;
}

.order-button {
  font-size: 1em;
  border-radius: 5px;
}
</style>