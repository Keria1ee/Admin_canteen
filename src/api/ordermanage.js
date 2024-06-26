import request from "@/utils/request.js";

export const orderListService = ()=>{

    return request.post('/order/all_preorder');
}
export const orderStockService = (orderData)=>{
    const params = new URLSearchParams();
    for(let key in orderData){
        params.append(key,orderData[key]);
    }
    return request.post('/order/update_preorder',params);
}
export const getDishByIDService = (ID)=>{
    const params = new URLSearchParams();
    for(let key in ID){
        params.append(key,ID[key]);
    }
    // 构建带有查询参数的 URL
    const queryString = params.toString();
    // 使用 GET 请求
    const url = `/dish/id?id=1`;
    return request.get(url);

}

export const dishListService = ()=>{

    return request.get('/dish');
}
export const getAllOrderService = ()=>{
    return request.get('/order/all');
}