import axiosInstance from './axiosInstance';

export const getList = async (pageParam) => {
  const { page, size, sort, name, festivalName, refundState } = pageParam;
  const response = await axiosInstance.get(`/ticket/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchTerm: name,
      searchFestivalName: festivalName,
      refundState: refundState,
    },
  });
  return response.data;
};

export const refund = async (orderId, locationNum) => {
  console.log('좌석: ', locationNum);

  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.put(
    `/ticket/refund?orderId=${orderId}&locationNum=${locationNum}`,
    header,
  );
  return response.data;
};
