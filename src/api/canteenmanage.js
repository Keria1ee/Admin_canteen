import request from "@/utils/request.js";

export const canteenListService = () => {
    return request.get('/canteen/all');
}

export const dishidListService = (dishid) => {
    const params = new URLSearchParams();
    //
    params.append('id', dishid);
    // 构建带有查询参数的 URL
    const queryString = params.toString();
    const url = `/dish/id?${queryString}`;
    // 使用 GET 请求
    return request.get(url);
}
export const addCanteenService = (canteenData)=>{
    const params = new URLSearchParams()
    for(let key in canteenData){
        params.append(key,canteenData[key]);
    }
    return request.post('/canteen/new_canteen',params);
}
export const EditCanteenService = (canteenData)=>{
    const params = new URLSearchParams()
    for(let key in canteenData){
        params.append(key,canteenData[key]);
    }
    return request.post('/canteen/new_canteen',params);
}
export const editIntroductionService = (canteenIntroduction)=>{
    const params = new URLSearchParams();
    for(let key in canteenIntroduction){
        params.append(key,canteenIntroduction[key]);
    }
    return request.post('/canteen/update_introduction',params);
}
export const editSpecialService = (canteenSpecial) => {
    // 先将需要转换为整型的字段转换
    /*const convertedSpecial = {
        ...canteenSpecial,
        specialId: parseInt(canteenSpecial.specialId, 10), // 假设specialId需要转换
        canteenId: parseInt(canteenSpecial.canteenId, 10), // 假设canteenId也需要转换
    };*/
    console.log(canteenSpecial);
    const params = new URLSearchParams();
    for (let key in canteenSpecial) {
        params.append(key, canteenSpecial[key]);
    }

    return request.post('/canteen/update_special', params);
}
export const dishListService = ()=>{

    return request.get('/dish');
}
export const editOtherService = (Data)=>{
    const params = new URLSearchParams();
    for(let key in Data){
        params.append(key,Data[key]);
    }
    return request.post('/canteen/update_canteen',params);
}
