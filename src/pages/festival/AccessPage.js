import React, { useEffect, useState } from 'react';
import Header from '../../components/layouts/Header';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PageComponent from '../../components/common/PageComponent';
import AlertModal from '../../components/common/AlertModal';
import { useNavigate } from 'react-router-dom';
import { getApplyList } from '../../api/festivalApi';
import { accessRegister, refusal } from '../../api/festivalApi';

const initState = {
  dtoList: [], // product 목록
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  prevPage: 0,
  nextPage: 0,
  next: false,
  totalCount: 0,
  current: 0,
};

const AccessPage = () => {
  const [applys, setApplys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [refusalModalOpen, setRefusalModalOpen] = useState(false);
  const [selectedApply, setSelectedApply] = useState(null);
  const navigate = useNavigate();

  const fetchApplys = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
    };

    try {
      const response = await getApplyList(params);
      setApplys(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('등록 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchApplys();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAccessClick = (apply) => {
    setSelectedApply(apply);
    setAccessModalOpen(true);
  };

  const handleRefusalClick = (apply) => {
    setSelectedApply(apply);
    setRefusalModalOpen(true);
  };

  const handleAccessConfirm = async () => {
    setAccessModalOpen(false);
    try {
      await accessRegister(selectedApply.accessId, selectedApply.festivalId);
      fetchApplys();
    } catch (error) {
      console.error('등록승인 실패:', error);
    }
  };

  const handleRefusalConfirm = async () => {
    setRefusalModalOpen(false);
    try {
      await refusal(selectedApply.festivalId);
      fetchApplys();
    } catch (error) {
      console.error('등록거부 실패:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF0FB', minHeight: '100vh' }}>
      <Header />
      <Container
        maxWidth={false}
        sx={{
          mt: 4,
          mb: 4,
          px: { xs: 2, sm: 3, md: 4, lg: 6 }, // 반응형 패딩
          maxWidth: { xl: '1400px' }, // 큰 화면에서 최대 너비
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography
                variant="h4"
                sx={{ color: '#2A0934', fontWeight: 'bold' }}
              >
                공연등록 관리
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Card sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="공연명 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={fetchApplys}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fff5fc' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  공연명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  참고영상 URL
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
              {applys.map((apply, index) => (
                <TableRow key={apply.accessId} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{apply.festivalName}</TableCell>
                  <TableCell>{apply.festivalMediaLink}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#00b400',
                        '&:hover': { backgroundColor: '#1a5c38' },
                        mr: 1,
                      }}
                      onClick={() => handleAccessClick(apply)}
                    >
                      승인
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#ff0000',
                        '&:hover': { backgroundColor: '#1a5c38' },
                        mr: 1,
                      }}
                      onClick={() => handleRefusalClick(apply)}
                    >
                      거부
                    </Button>
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
        open={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
        title="등록승인"
        message="정말 승인하시겠습니까?"
        isSuccess={false}
        onConfirm={handleAccessConfirm}
      />
      <AlertModal
        open={refusalModalOpen}
        onClose={() => setRefusalModalOpen(false)}
        title="등록거부"
        message="정말 거부하시겠습니까?"
        isSuccess={false}
        onConfirm={handleRefusalConfirm}
      />
    </div>
  );
};

export default AccessPage;
