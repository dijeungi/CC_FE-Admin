import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import { register } from '../../api/productApi';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AlertModal from '../../components/common/AlertModal';
import { getCommonCategoryList } from '../../api/categoryApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    festivalName: '',
    runningTime: '',
    age: '',
    fromDate: new Date(),
    toDate: new Date(),
    festivalPrice: '',
    salePercent: '',
    mdPick: 'Y',
    premier: 'Y',
    categoryId: '',
    placeName: '',
    postImage: '',
  });
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [placeCategories, setPlaceCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getCommonCategoryList('CT');
        const placeList = await getCommonCategoryList('PL');
        setCategories(categoryList);
        setPlaceCategories(placeList);
      } catch (error) {
        console.error('카테고리 목록을 불러오는데 실패했습니다:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertMessage(''); // ✅ 모달이 닫힐 때 메시지를 초기화
    if (alertMessage.includes('성공')) {
      navigate('/product'); // ✅ 성공 시 페이지 이동
    }
  };

  const handleInputChange = (event) => {
    if (event && event.target) {
      const { name, value } = event.target;

      console.log(`🔍 변경 감지: ${name} = ${value}`); // 값이 제대로 들어오는지 확인

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      console.log('📌 formData 업데이트됨:', formData); // formData 상태 확인
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    console.log(`🔍 [Select 변경 감지] ${name} = ${value}`); // 값 확인

    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      console.log('✅ 즉시 formData 업데이트 확인:', newState); // 즉시 변경 확인
      return newState;
    });
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value : null,
    }));
    console.log(value);
    console.log(formData.fromDate);
  };

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0]; // ✅ 첫 번째 파일만 가져오기

  //   if (selectedFile) {
  //     setFiles([selectedFile]); // ✅ 파일 상태를 배열이 아닌 단일 파일로 설정
  //     setFormData((prev) => ({
  //       ...prev,
  //       postImage: selectedFile, // ✅ formData에 단일 파일 저장
  //     }));

  //     // 미리보기 URL 생성 (하나만)
  //     setPreviewUrls([URL.createObjectURL(selectedFile)]);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'fromDate' || key === 'toDate') {
        productData.append(key, formData[key].toISOString().split('T')[0]);
      }
      productData.append(key, formData[key]);
      // if (key !== 'postImage') {
      // }
    });

    // if (formData.postImage) {
    //   productData.append('postImage', formData.postImage);
    // }

    try {
      console.log('📌 전송될 formData:', [...productData.entries()]);
      await register(productData);

      setAlertMessage('공연이 성공적으로 등록되었습니다!'); // ✅ 성공 메시지
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('공연 등록에 실패했습니다.');
      setShowAlert(true);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF0FB', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={{
                mr: 2,
                color: '#2A0934',
                '&:hover': { backgroundColor: 'rgba(42, 9, 52, 0.04)' },
              }}
            >
              뒤로가기
            </Button>
            <Typography
              variant="h4"
              sx={{ color: '#2A0934', fontWeight: 'bold' }}
            >
              공연 등록
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="공연명"
                  name="festivalName"
                  value={formData.festivalName}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="상영시간"
                  name="runningTime"
                  value={formData.runningTime}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="연령가"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        세 이상 관람가
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="시작일"
                    value={formData.fromDate}
                    onChange={(value) => handleDateChange('fromDate', value)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="종료일"
                    value={formData.toDate}
                    onChange={(value) => handleDateChange('toDate', value)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="가격"
                  name="festivalPrice"
                  type="number"
                  value={formData.festivalPrice}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">원</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="할인율"
                  name="salePercent"
                  type="number"
                  value={formData.salePercent}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel shrink>MD PICK</InputLabel>
                  <select
                    id="mdPick"
                    name="mdPick"
                    value={formData.mdPick || ''}
                    onChange={handleSelectChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                    }}
                  >
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel shrink>수상작 유무</InputLabel>
                  <Box
                    component="select"
                    id="premier"
                    name="premier"
                    value={formData.premier || ''}
                    onChange={handleSelectChange}
                    sx={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      appearance: 'none',
                    }}
                  >
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel shrink>카테고리</InputLabel>
                  <Box
                    component="select"
                    id="category"
                    name="categoryId"
                    value={formData.categoryId || ''}
                    onChange={handleInputChange}
                    sx={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      appearance: 'none',
                    }}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel shrink>지역</InputLabel>
                  <Box
                    component="select"
                    id="place"
                    name="placeName"
                    value={formData.placeName || ''}
                    onChange={handleInputChange}
                    sx={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      appearance: 'none',
                    }}
                  >
                    {placeCategories.map((category, index) => (
                      <option key={index} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </Box>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    color: '#FFB7F2',
                    borderColor: '#FFB7F2',
                    '&:hover': {
                      borderColor: '#ff9ee8',
                      backgroundColor: 'rgba(255, 183, 242, 0.1)',
                    },
                  }}
                >
                  이미지 업로드 *
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Button>
              </Grid> */}
              {/* 이미지 미리보기 (단일 이미지) */}
              {/* {previewUrls.length > 0 && (
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                  >
                    <img
                      src={previewUrls[0]} // ✅ 하나만 표시
                      alt="Preview"
                      style={{
                        width: 200,
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                </Grid>
              )} */}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: '#FFB7F2',
                    '&:hover': { backgroundColor: '#ff9ee8' },
                    height: 48,
                  }}
                >
                  공연 등록하기
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <AlertModal
        open={showAlert}
        onClose={handleAlertClose}
        title="알림"
        message={alertMessage}
        isSuccess={alertMessage.includes('성공')}
        onConfirm={handleAlertClose}
      />
    </div>
  );
};

export default ProductRegisterPage;
