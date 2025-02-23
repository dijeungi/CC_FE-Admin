import React, { useEffect, useState } from 'react';
import Header from '../../components/layouts/Header';
import {
  Box,
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CategoryModal from '../../components/category/CategoryModal';
import CategoryEditModal from '../../components/category/CategoryEditModal';
import {
  getProductCategoryList,
  registerProductCategory,
  editProductCategory,
  removeProductCategory,
} from '../../api/categoryApi';
// import { API_SERVER_HOST } from '../../config/apiConfig';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertModal from '../../components/common/AlertModal';
import PageComponent from '../../components/common/PageComponent';

const CategoryPage = () => {
  const [productCategories, setProductCategories] = useState([]);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const fetchCategories = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
    };

    try {
      const response = await getProductCategoryList(params);
      setProductCategories(response.dtoList || []);
      console.log('dtoList: ', response.dtoList);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('공통코드 목록 로딩 실패:', error);
    }
  };

  const handleProductSubmit = async (formData) => {
    try {
      await registerProductCategory(formData);
      fetchCategories();
    } catch (error) {
      console.error('공통코드 등록 실패:', error);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleEditConfirm = async (formData) => {
    try {
      await editProductCategory(formData);
      setEditModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error(`공통코드 수정 실패:`, error);
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await removeProductCategory(selectedCategory.id);

      setDeleteModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('공통코드 삭제 실패:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF0FB', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="h4"
              sx={{ color: '#2A0934', fontWeight: 'bold' }}
            >
              공통코드 관리
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setOpenProductModal(true)}
              sx={{
                bgcolor: '#FFB7F2',
                color: 'white',
                '&:hover': { bgcolor: '#ff99e6' },
              }}
            >
              공통코드 추가
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fff5fc' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                    코드ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                    코드명
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                    사용유무
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
                {productCategories.map((category, index) => (
                  <TableRow key={category.id || index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.useYn}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{ color: '#FFB7F2' }}
                        onClick={() => handleEditClick(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: '#ff8484' }}
                        onClick={() => handleDeleteClick(category)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <PageComponent
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />

        <CategoryModal
          open={openProductModal}
          handleClose={() => setOpenProductModal(false)}
          title="공통코드 등록"
          onSubmit={handleProductSubmit}
        />

        <CategoryEditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          title="공통코드 수정"
          category={{
            id: selectedCategory?.id || '',
            name: selectedCategory?.name || '',
            useYn: selectedCategory?.useYn || 'Y',
          }}
          onSubmit={handleEditConfirm}
        />

        <AlertModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="공통코드 삭제"
          message="정말 삭제하시겠습니까?"
          isSuccess={false}
          onConfirm={handleDeleteConfirm}
        />
      </Container>
    </div>
  );
};

export default CategoryPage;
