import axios from "axios";
import {BASE_URL} from "../utils/constants";

export const getCall=(key, params, callback)=>{
    const USER_TOKEN = sessionStorage.getItem('userToken');
    USER_TOKEN?axios.defaults.headers.common['Authorization'] = `Bearer ${USER_TOKEN}`:axios.defaults.headers.common['Authorization'] = null;
    axios.get(BASE_URL+key,params)
    .then(res=>{
        if(res.status===200){
            if(callback){
                callback.sfn(res.data)
            }else{
                callback.efn(res.message)
            }
        }
    })
    .catch(err=>{
        if(callback){
            if(err.message==="Request failed with status code 401"){
                callback.efn(401)
            }
            if(err.message==="Network Error"){
                callback.efn(503)
            }
            if(err.message==="Request failed with status code 400"){
                callback.efn(400)
            }
        }
    })
}

export const postCall=(key, body, callback, headerType)=>{
    const USER_TOKEN = sessionStorage.getItem('userToken');
    USER_TOKEN?axios.defaults.headers.common['Authorization'] = `Bearer ${USER_TOKEN}`:axios.defaults.headers.common['Authorization'] = null;
    if(headerType){axios.defaults.headers.common['type'] = headerType}
    axios.post(BASE_URL+key,body)
    .then(res=>{
        if(res.status===200){
            if(callback){
                callback.sfn(res.data)
            }else{
                callback.efn(res.msg)
            }
        }
    })
    .catch(err=>{
        if(callback){
            if(err.message==="Request failed with status code 401"){
                callback.efn(401)
            }
            if(err.message==="Network Error"){
                callback.efn(503)
            }
            if(err.message==="Request failed with status code 400"){
                callback.efn(400)
            }
        }
    })
}

export const putCall=(key, body, callback)=>{
    const USER_TOKEN = sessionStorage.getItem('userToken');
    USER_TOKEN?axios.defaults.headers.common['Authorization'] = `Bearer ${USER_TOKEN}`:axios.defaults.headers.common['Authorization'] = null;
    axios.put(BASE_URL+key,body)
    .then(res=>{
        if(res.status===200){
            if(callback){
                callback.sfn(res.data)
            }else{
                callback.efn(res.msg)
            }
        }
    })
    .catch(err=>{
        if(callback){
            if(err.message==="Request failed with status code 401"){
                callback.efn(401)
            }
            if(err.message==="Network Error"){
                callback.efn(503)
            }
            if(err.message==="Request failed with status code 400"){
                callback.efn(400)
            }
        }
    })
}