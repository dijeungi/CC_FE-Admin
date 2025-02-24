import React, { useEffect, useState } from 'react';

import { getList, remove } from '../../api/actorApi';
import { API_SERVER_HOST } from '../../config/apiConfig';
import axiosInstance from '../../api/axiosInstance';
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PageComponent from '../../components/common/PageComponent';
import AlertModal from '../../components/common/AlertModal';
import Header from '../../components/layouts/Header';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { registerContentExcel } from '../../api/excelApi';
import UploadModal from '../../components/common/UploadModal';
import ActorModal from '../../components/actor/ActorModel';

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

const ActorPage = () => {
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const fetchContents = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
    };

    try {
      const response = await getList(params);
      setContents(response.dtoList || []);

      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('콘텐츠 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (content) => {
    console.log('handleDeleteClick content', content);
    setSelectedContent(content);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await remove(selectedContent.id);
      setDeleteModalOpen(false);
      fetchContents();
    } catch (error) {
      console.error('콘텐츠 삭제 실패:', error);
    }
  };

  const handleContentSubmit = async (newContent) => {
    try {
      console.log('배우 등록 데이터:', newContent);
      setShowContentModal(false);
      fetchContents();
    } catch (error) {
      console.error('배우 등록 실패:', error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await registerContentExcel(file);
      setShowUploadModal(false);
      setUploadModalOpen(true);
      fetchContents();
    } catch (error) {
      console.error('엑셀 업로드 실패:', error);
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
                배우 관리
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#FFB7F2',
                  '&:hover': { backgroundColor: '#ff9ee8' },
                  mr: 1,
                }}
                onClick={() => setShowContentModal(true)}
              >
                배우 등록
              </Button>
              {/* <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: '#217346',
                  '&:hover': { backgroundColor: '#1a5c38' },
                }}
                onClick={() => setShowUploadModal(true)}
              >
                엑셀 업로드
              </Button> */}
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
                  placeholder="공연명, 등장인물 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={fetchContents}>
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
                  순번
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  공연명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  배역
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  성명
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
              {contents.map((content, index) => (
                <TableRow key={content.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{content.festivalName}</TableCell>
                  <TableCell>{content.actorCharacter}</TableCell>
                  <TableCell>{content.actorName}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      sx={{ color: '#ff8484' }}
                      onClick={() => handleDeleteClick(content)}
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
        title="콘테츠 삭제"
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
      <ActorModal
        open={showContentModal}
        handleClose={() => setShowContentModal(false)}
        title="배우 등록"
        onSubmit={handleContentSubmit}
      />

      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default ActorPage;
