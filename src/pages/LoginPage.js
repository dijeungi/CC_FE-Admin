import React, { useState } from 'react';
import { loginPost } from '../api/loginApi';
import AlertModal from '../components/common/AlertModal';
import Header from '../components/layouts/Header';
import { login } from '../slices/loginSlice';
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginPost(id, password);
      dispatch(
        login({
          id: result.id,
          roles: result.roles,
          accessToken: result.accessToken,
        }),
      );

      setIsSuccess(true);
      setAlertMessage('로그인이 성공하였습니다');
      setOpenAlert(true);
      setId('');
      setPassword('');
    } catch (error) {
      setIsSuccess(false);
      setAlertMessage(error.response.data.errMsg);
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (isSuccess) {
      navigate('/');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF0FB', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(255, 183, 242, 0.25)',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                color: '#2A0934',
                fontWeight: 'bold',
                mb: 3,
              }}
            >
              로그인
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="id"
                label="계정"
                name="id"
                autoComplete="id"
                autoFocus
                value={id}
                onChange={(e) => setId(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FFB7F2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFB7F2',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2A0934',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FFB7F2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFB7F2',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2A0934',
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: '#FFB7F2',
                  color: '#2A0934',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#FF9BE8',
                  },
                }}
              >
                로그인
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>

      <AlertModal
        open={openAlert}
        onClose={handleCloseAlert}
        title={isSuccess ? '로그인 성공' : '로그인 실패'}
        message={alertMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default LoginPage;
