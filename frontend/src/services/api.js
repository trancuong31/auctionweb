import { axiosWithToken, axiosDefault } from './axiosClient';




export const create = async (resource, data, isAuth) => {
    if (isAuth) {
       return await axiosWithToken.post(`/${resource}`, data);
    } else {
       return await axiosDefault.post(`/${resource}`, data);
    }
};


export const getAll = async (resource, isAuth) => {
     if (isAuth) {
       return await axiosWithToken.get(`/${resource}`);
    } else {
       return await axiosDefault.get(`/${resource}`);
    }
};


export const getOne = async (resource, id, isAuth) => {
  if (isAuth) {
    return await axiosWithToken.get(`/${resource}/${id}`);
  } else {
    return await axiosDefault.get(`/${resource}/${id}`);
  }
};


export const update = async (resource, id, data, isAuth) => {
    if (isAuth) {
        return await axiosWithToken.put(`/${resource}/${id}`, data);
    } else {
        return await axiosDefault.put(`/${resource}/${id}`, data);
    }
};


export const deleteOne = async (resource, id, isAuth) => {
    if (isAuth) {
        return await axiosWithToken.delete(`/${resource}/${id}`);
    } else {
        return await axiosDefault.delete(`/${resource}/${id}`);
    }
};
