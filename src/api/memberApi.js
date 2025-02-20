import axiosInstance from './axiosInstance';

export const getList = async (pageParam) => {
  const { page, size, sort, name, divisionId } = pageParam;
  const response = await axiosInstance.get(`/member/list`, {
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

export const remove = async (memberId) => {
  const response = await axiosInstance.delete(
    `/member/delete?memberId=${memberId}`,
  );
  return response.data;
};
