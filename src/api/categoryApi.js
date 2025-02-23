import axiosInstance from './axiosInstance';
import { API_SERVER_HOST } from '../config/apiConfig';
import axios from 'axios';

// list
export const getProductCategoryList = async (pageParam) => {
  const { page, size, sort } = pageParam;
  const response = await axiosInstance.get(`/common/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};

export const getCommonCategoryList = async (id) => {
  const response = await axios.get(
    `${API_SERVER_HOST}/api/common/list?id=${id}`,
  );
  return response.data;
};

// register
export const registerProductCategory = async (data) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.post(`/common/add`, data, header);
  return response.data;
};

export const editProductCategory = async (data) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.put(`/common/edit`, data, header);
  return response.data;
};

// remove
export const removeProductCategory = async (id) => {
  const response = await axiosInstance.delete(`/common/delete?commonId=${id}`);
  return response.data;
};
