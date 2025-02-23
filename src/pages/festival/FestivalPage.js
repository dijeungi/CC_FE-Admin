import React, { useEffect, useState } from 'react';
import Header from '../../components/layouts/Header';
import { getList, remove } from '../../api/festivalApi';
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
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PageComponent from '../../components/common/PageComponent';
import AlertModal from '../../components/common/AlertModal';
import { registerProductExcel, downloadProductExcel } from '../../api/excelApi';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadModal from '../../components/common/UploadModal';
import Checkbox from '@mui/material/Checkbox';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';

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

const FestivalPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFestivals, setSelectedFestivals] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const fetchFestivals = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
    };

    try {
      const response = await getList(params);
      setFestivals(response.dtoList || []);
      console.log('dtoList: ', response.dtoList);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('공연 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (festival) => {
    setSelectedFestival(festival);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await remove(selectedFestival.id);
      setDeleteModalOpen(false);
      fetchFestivals();
    } catch (error) {
      console.error('공연 삭제 실패:', error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await registerProductExcel(file);
      setShowUploadModal(false);
      setUploadModalOpen(true);
      fetchFestivals();
    } catch (error) {
      console.error('엑셀 업로드 실패:', error);
    }
  };

  const handleSelectProduct = (festivalId) => {
    setSelectedFestivals((prev) => {
      if (prev.includes(festivalId)) {
        return prev.filter((id) => id !== festivalId);
      } else {
        return [...prev, festivalId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedFestivals(festivals.map((festival) => festival.id));
    } else {
      setSelectedFestivals([]);
    }
  };

  const handleDownload = async () => {
    if (selectedFestivals.length === 0) {
      setAlertMessage('공연 체크를 먼저 해주셔야 합니다!');
      setShowAlert(true);
      return;
    }

    try {
      const response = await downloadProductExcel(selectedFestivals);
      // 소문자로 된 헤더 키를 사용

      // 응답 헤더 확인을 위한 로깅
      console.log('Download response headers:', response.headers);

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'products.xlsx'; // 기본 파일명
      console.log('Content-Disposition:', contentDisposition); // 디버깅용

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Excel download failed:', error);
      setAlertMessage('다운로드 중 오류가 발생했습니다.');
      setShowAlert(true);
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
                공연 관리
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: '#217346',
                  '&:hover': { backgroundColor: '#1a5c38' },
                  mr: 1,
                }}
                onClick={() => setShowUploadModal(true)}
              >
                엑셀 업로드
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  backgroundColor: '#217346',
                  '&:hover': { backgroundColor: '#1a5c38' },
                  mr: 1,
                }}
                onClick={handleDownload}
              >
                엑셀 다운로드
              </Button>
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
                      <IconButton onClick={fetchFestivals}>
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
                  <Checkbox
                    checked={selectedFestivals.length === festivals.length}
                    indeterminate={
                      selectedFestivals.length > 0 &&
                      selectedFestivals.length < festivals.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  카테고리
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  공연명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  지역
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  시작일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  종료일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  공연상태
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  할인율
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  가격
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  할인가격
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  상영시간
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  연령가
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  MD PICK
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  수상작유무
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  인기순위
                </TableCell>
                {/* <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  이미지
                </TableCell> */}
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#2A0934' }}
                >
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {festivals.map((festival, index) => (
                <TableRow key={festival.id} hover>
                  <TableCell>
                    <Checkbox
                      checked={selectedFestivals.includes(festival.id)}
                      onChange={() => handleSelectProduct(festival.id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{festival.categoryId}</TableCell>
                  <TableCell>{festival.festivalName}</TableCell>
                  <TableCell>{festival.placeName}</TableCell>
                  <TableCell>{festival.fromDate}</TableCell>
                  <TableCell>{festival.toDate}</TableCell>
                  <TableCell>{festival.festivalStateName}</TableCell>
                  <TableCell>
                    {festival.salePercent.toLocaleString()}%
                  </TableCell>
                  <TableCell>
                    {festival.festivalPrice?.toLocaleString()}원
                  </TableCell>
                  <TableCell>
                    {festival.salePrice?.toLocaleString()}원
                  </TableCell>
                  <TableCell>{festival.runningTime}</TableCell>
                  <TableCell>{festival.age}</TableCell>
                  <TableCell>{festival.mdPick}</TableCell>
                  <TableCell>{festival.premier}</TableCell>
                  <TableCell>{festival.ranking}</TableCell>
                  {/* <TableCell>{festival.postImage}</TableCell> */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      sx={{ color: '#ff8484' }}
                      onClick={() => handleDeleteClick(festival)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="공연 삭제"
        message="정말 삭제하시겠습니까?"
        isSuccess={false}
        onConfirm={handleDeleteConfirm}
      />
      <AlertModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="엑셀 업로드"
        message="업로드가 완료되었습니다!"
        isSuccess={true}
        onConfirm={() => setUploadModalOpen(false)}
      />
      <AlertModal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="알림"
        message={alertMessage}
        isSuccess={false}
        onConfirm={() => setShowAlert(false)}
      />
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default FestivalPage;
