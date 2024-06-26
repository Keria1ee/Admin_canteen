import request from "@/utils/request.js";

export const dishListService = ()=>{

    return request.get('/dish');
}
export const addDishService = (dishData)=>{
    const params = new URLSearchParams();
    for(let key in dishData){
        params.append(key,dishData[key]);
    }
    return request.post('/dish/new_dish',params);
}
export const editDescribeService = (describeData)=>{
    const params = new URLSearchParams();
    for(let key in describeData){
        params.append(key,describeData[key]);
    }
    return request.post('/dish/update_dish_describe',params);
}
export const editNameService = (Data)=>{
    const params = new URLSearchParams();
    for(let key in Data){
        params.append(key,Data[key]);
    }
    return request.post('/dish/update_dish_name',params);
}
export const editImageService = (Data)=>{
    const params = new URLSearchParams();
    for(let key in Data){
        params.append(key,Data[key]);
    }
    return request.post('/dish/update_dish_image',params);
}
export const editExtendService = (Data)=>{
    const params = new URLSearchParams();
    for(let key in Data){
        params.append(key,Data[key]);
    }
    return request.post('/dish/update_dish_extend',params);
}
export const editPriceService = (Data)=>{
    const params = new URLSearchParams();
    for(let key in Data){
        params.append(key,Data[key]);
    }
    return request.post('/dish/update_dish_price',params);
}
export const editAllService = (Data)=>{
    const params = new URLSearchParams();
    for(let key in Data){
        params.append(key,Data[key]);
    }
    return request.post('/dish/update_dish',params);
}
export const deleteDishService = (Data)=>{
    const urlWithParams = `/dish/delete_dish?id=${Data}`;
    return request.delete(urlWithParams);
};
export const searchNameService = (Data)=>{
    const urlWithParams = `/dish/name?dishname=${Data}`;
    return request.get(urlWithParams);
};
