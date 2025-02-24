import axiosInstance from './axiosInstance';

// /api/admin/festival/list
export const getList = async (pageParam) => {
  const { page, size, sort, name } = pageParam;
  const response = await axiosInstance.get(`festival/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchTerm: name,
    },
  });
  return response.data;
};

// /api/admin/festival/{id}
export const getOne = async (festivalId) => {
  const response = await axiosInstance.get(`/festival/${festivalId}`);
  return response.data;
};

// /api/admin/festival
export const register = async (festival) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axiosInstance.post(`/festival/add`, festival, header);
  return response.data;
};

// /api/admin/festival/{id}
export const modify = async (festival) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.put(`/festival/edit`, festival, header);
  return response.data;
};

// /api/admin/festival/{id}
export const remove = async (festivalId) => {
  const response = await axiosInstance.delete(
    `/festival/delete?festivalId=${festivalId}`,
  );
  return response.data;
};

export const getApplyList = async (pageParam) => {
  const { page, size, sort, name } = pageParam;
  const response = await axiosInstance.get(`access/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchTerm: name,
    },
  });
  return response.data;
};

export const accessRegister = async (applyId, festivalId) => {
  const response = await axiosInstance.put(
    `/access/completed?accessId=${applyId}&festivalId=${festivalId}`,
  );
  return response.data;
};

export const refusal = async (festivalId) => {
  const response = await axiosInstance.delete(
    `/access/refusal?festivalId=${festivalId}`,
  );
  return response.data;
};
