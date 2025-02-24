import React, { useEffect, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getList, refund } from '../../api/orderApi';
import PageComponent from '../../components/common/PageComponent';
import Header from '../../components/layouts/Header';
import AlertModal from '../../components/common/AlertModal';

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  prevPage: 0,
  nextPage: 0,
  next: false,
  totalCount: 0,
  current: 0,
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFestivalName, setSearchFestivalName] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');

  const fetchOrders = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
      festivalName: searchFestivalName,
      refundState: paymentStatus,
    };

    try {
      const response = await getList(params);
      setOrders(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('주문 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, paymentStatus]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRefundClick = (order) => {
    setSelectedOrder(order);
    setRefundModalOpen(true);
  };

  const handleRefundConfirm = async () => {
    setRefundModalOpen(false);
    console.log('선택된 티켓: ', selectedOrder);
    try {
      await refund(selectedOrder.orderId, selectedOrder.locationNum);
      fetchOrders();
    } catch (error) {
      console.error('환불 실패:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF0FB', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography
                variant="h4"
                sx={{ color: '#2A0934', fontWeight: 'bold' }}
              >
                결제내역 관리
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Card sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="회원명 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={fetchOrders}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="공연명 검색"
                  value={searchFestivalName}
                  onChange={(e) => setSearchFestivalName(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={fetchOrders}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>결제 상태</InputLabel>
                  <Select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    label="결제 상태"
                  >
                    <MenuItem value="ALL">전체</MenuItem>
                    <MenuItem value="YET">결제완료</MenuItem>
                    <MenuItem value="REQUEST">환불신청</MenuItem>
                    <MenuItem value="COMPLETED">환불완료</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fff5fc' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  순번
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  결제코드
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  회원명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  공연명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  공연일시
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  좌석
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  결제일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  결제상태
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  결제총금액
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#2A0934' }}
                >
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.orderId} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>{order.festivalName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.locationNum}</TableCell>
                  <TableCell>{order.paymentDate}</TableCell>
                  <TableCell>{order.refundStateName}</TableCell>
                  <TableCell>{order.totalPrice.toLocaleString()}원</TableCell>
                  <TableCell align="center">
                    {order.refundStateName === '결제완료' && (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#ff0000',
                          '&:hover': { backgroundColor: '#1a5c38' },
                          mr: 1,
                        }}
                        onClick={() => handleRefundClick(order)}
                      >
                        환불
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <PageComponent
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Container>

      <AlertModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="티켓환불"
        message="정말 환불하시겠습니까?"
        isSuccess={false}
        onConfirm={handleRefundConfirm}
      />
    </div>
  );
};

export default OrderPage;
