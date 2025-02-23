import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { logoutPost } from '../../api/loginApi';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../common/AlertModal';
import { logout } from '../../slices/loginSlice';

const Header = () => {
  const { id } = useSelector((state) => state.loginSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutPost();
      dispatch(logout());
      setAlertMessage('로그아웃이 되었습니다');
      setOpenAlert(true);
    } catch (error) {
      setAlertMessage('로그아웃 처리 중 오류가 발생했습니다');
      setOpenAlert(true);
    }
  };

  const checkLoginAndNavigate = (path) => {
    if (!id) {
      setAlertMessage('로그인을 해주세요!');
      setOpenAlert(true);
      return false;
    }
    navigate(path);
    return true;
  };

  const menuItems = [
    {
      text: '홈',
      path: '/',
      onClick: () => checkLoginAndNavigate('/'),
    },
    {
      text: '공통코드',
      path: '/common',
      onClick: () => checkLoginAndNavigate('/common'),
    },
    {
      text: '공연',
      path: '/festival',
      onClick: () => checkLoginAndNavigate('/festival'),
    },
    {
      text: '등록허가',
      path: '/access',
      onClick: () => checkLoginAndNavigate('/access'),
    },
    {
      text: '배우',
      path: '/actor',
      onClick: () => checkLoginAndNavigate('/actor'),
    },
    {
      text: '회원',
      path: '/member',
      onClick: () => checkLoginAndNavigate('/member'),
    },
    {
      text: '결제내역',
      path: '/payment',
      onClick: () => checkLoginAndNavigate('/payment'),
    },
    {
      text: id ? '로그아웃' : '로그인',
      path: '/login',
      onClick: id ? handleLogout : () => navigate('/login'),
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (!id) {
      navigate('/login');
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#FFB7F2' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: {
                xs: 'none',
                sm: 'block',
                fontSize: '25px',
                fontWeight: 'bold',
              },
            }}
          >
            CampusConcert 관리페이지
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                onClick={item.onClick}
                sx={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: '#2A0934',
                    transition: 'color 0.3s ease',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      <AlertModal
        open={openAlert}
        message={alertMessage}
        onClose={handleCloseAlert}
      />
    </>
  );
};

export default Header;
