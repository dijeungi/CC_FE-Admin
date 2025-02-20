import axiosInstance from './axiosInstance';
import axios from 'axios';

export const getList = async (pageParam) => {
  const { page, size, sort, name, divisionId } = pageParam;
  const response = await axiosInstance.get(`/festival/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchTerm: name,
      divisionId: divisionId,
    },
  });
  return response.data;
};

export const getFestivalId = async () => {
  const response = await axiosInstance.get(`/festival/id`);
  return response.data;
};

export const getOne = async (contentId) => {
  const response = await axiosInstance.get(`/content/${contentId}`);
  return response.data;
};

export const register = async (content) => {
  const header = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axiosInstance.post(`/festival/add`, content, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('배우 등록 실패:', error);
    throw error;
  }
};

export const modify = async (contentId, content) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.put(
    `/content/${contentId}`,
    content,
    header,
  );
  return response.data;
};

export const remove = async (contentId) => {
  const response = await axiosInstance.delete(
    `/festival/delete?actorId=${contentId}`,
  );
  return response.data;
};
