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
  const { email } = useSelector((state) => state.loginSlice);
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
    if (!email) {
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
      text: '상품',
      path: '/product',
      onClick: () => checkLoginAndNavigate('/product'),
    },
    {
      text: '콘텐츠',
      path: '/content',
      onClick: () => checkLoginAndNavigate('/content'),
    },
    {
      text: '회원',
      path: '/member',
      onClick: () => checkLoginAndNavigate('/member'),
    },
    {
      text: '주문',
      path: '/order',
      onClick: () => checkLoginAndNavigate('/order'),
    },
    {
      text: email ? '로그아웃' : '로그인',
      path: '/login',
      onClick: email ? handleLogout : null,
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
    if (!email) {
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
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            로고
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
