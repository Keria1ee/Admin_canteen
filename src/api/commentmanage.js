import request from "@/utils/request.js";

export const commentListService = () => {
    return request.get(`/comment/get_all_comments`);
}

export function getDishList() {
    return request.get('/dish');
}

export function getDish(data) {
    const params = new URLSearchParams();
    params.append('id', data);
    const queryString = params.toString();
    const url = `/dish/id?${queryString}`;
    return request.get(url);
}

export function getAveRatingService(data){

    const params = new URLSearchParams();
    params.append('dishid', parseInt(data));
    const queryString = params.toString();
    console.log(queryString);
    const url = `/comment/get_average_rating?${queryString}`;
    return request.get(url);
}
