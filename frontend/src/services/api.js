import { axiosWithToken, axiosDefault } from './axiosClient';




export const create = async (resource, data, isAuth) => {
    if (isAuth) {
       return await axiosWithToken.post(`/${resource}`, data);
    } else {
       return await axiosDefault.post(`/${resource}`, data);
    }
};


export const getAll = async (resource, isAuth, params = {}) => {
  if (isAuth) {
    return await axiosWithToken.get(`/${resource}`, { params });
  } else {
    return await axiosDefault.get(`/${resource}`, { params });
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

export const updateSatus = async (resource, id, data, isAuth) => {
    if (isAuth) {
        return await axiosWithToken.patch(`/${resource}/${id}/status`,data);
    } else {
        return await axiosDefault.patch(`/${resource}/${id}/status`,data);
    }
};


export const deleteOne = async (resource, id, isAuth) => {
    if (isAuth) {
        return await axiosWithToken.delete(`/${resource}/${id}`);
    } else {
        return await axiosDefault.delete(`/${resource}/${id}`);
    }
};
