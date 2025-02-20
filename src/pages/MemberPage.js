import React, { useEffect, useState } from 'react';
import Header from '../components/layouts/Header';
import { getList, remove } from '../api/memberApi';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
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
import AlertModal from '../components/common/AlertModal';
import PageComponent from '../components/common/PageComponent';

const initState = {
  dtoList: [], // member 목록
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  prevPage: 0,
  nextPage: 0,
  next: false,
  totalCount: 0,
  current: 0,
};

const MemberPage = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchMembers = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
      categoryId: null,
    };

    try {
      const response = await getList(params);
      console.log(response.dtoList);
      setMembers(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('회원 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page]);

  const handleDeleteClick = (member) => {
    console.log('handleDeleteClick member', member);
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await remove(selectedMember.id);
      setDeleteModalOpen(false);
      fetchMembers(); // 목록 새로고침
    } catch (error) {
      console.error('회원 삭제 실패:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
                회원 관리
              </Typography>
            </Grid>
            {/* <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#FFB7F2',
                  '&:hover': { backgroundColor: '#ff9ee8' },
                }}
              >
                회원 등록
              </Button>
            </Grid> */}
          </Grid>
        </Box>

        <Card sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="회원명 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={fetchMembers}>
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
                  이름
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  이메일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  전화번호
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  등록일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2A0934' }}>
                  수정일
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
              {members.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.createdAt}</TableCell>
                  <TableCell>{member.modifiedAt}</TableCell>
                  <TableCell align="center">
                    <IconButton>
                      <DeleteIcon
                        size="small"
                        sx={{ color: '#ff8484' }}
                        onClick={() => handleDeleteClick(member)}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AlertModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="회원 삭제"
          message="정말 삭제하시겠습니까?"
          isSuccess={false}
          onConfirm={handleDeleteConfirm}
        />

        <PageComponent
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Container>
    </div>
  );
};

export default MemberPage;
