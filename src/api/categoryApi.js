import axiosInstance from './axiosInstance';
import { API_SERVER_HOST } from '../config/apiConfig';
import axios from 'axios';

// list
export const getProductCategoryList = async () => {
  const response = await axiosInstance.get(`/festival/list/common`);
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
  const response = await axiosInstance.post(
    `/festival/add/common`,
    data,
    header,
  );
  return response.data;
};

export const editProductCategory = async (data) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.put(
    `/festival/edit/common`,
    data,
    header,
  );
  return response.data;
};

// remove
export const removeProductCategory = async (id) => {
  const response = await axiosInstance.delete(
    `/festival/delete/common?commonId=${id}`,
  );
  return response.data;
};
