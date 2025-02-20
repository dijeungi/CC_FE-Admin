import axiosInstance from './axiosInstance';

// /api/admin/product/list
export const getList = async (pageParam) => {
  const { page, size, sort, name, categoryId } = pageParam;
  const response = await axiosInstance.get(`festival/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchTerm: name,
      categoryId: categoryId,
    },
  });
  return response.data;
};

// /api/admin/product/{id}
export const getOne = async (productId) => {
  const response = await axiosInstance.get(`/product/${productId}`);
  return response.data;
};

// /api/admin/product
export const register = async (product) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axiosInstance.post(`/festival/add`, product, header);
  return response.data;
};

// /api/admin/product/{id}
export const modify = async (product) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.put(`/festival/edit`, product, header);
  return response.data;
};

// /api/admin/product/{id}
export const remove = async (productId) => {
  const response = await axiosInstance.delete(
    `/festival/delete?festivalId=${productId}`,
  );
  return response.data;
};
